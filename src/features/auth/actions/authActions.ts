"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  serverApiClient,
  ServerApiError,
} from "@/shared/lib/api/server-client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/registerSchema";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import {
  verifyEmailSchema,
  resendOtpSchema,
  type VerifyEmailFormData,
  type ResendOtpFormData,
} from "../schemas/verifyEmailSchema";
import type { AuthActionResult, AuthUser, AuthTokens } from "../types";

/**
 * Cookie options helper for secure authentication cookies
 */
function getAuthCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

/**
 * Server Action for User Signup & Registration
 * Dispatches credentials to backend signup endpoint.
 * Note: Users must verify their email with an OTP before proceeding to onboarding.
 */
export async function signUpAction(
  formData: RegisterFormData,
): Promise<AuthActionResult> {
  try {
    // 1. Validate form schema on the server
    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0]?.toString() || "form";
        fieldErrors[path] = [...(fieldErrors[path] || []), issue.message];
      });

      return {
        success: false,
        message: "ফর্মের তথ্য সঠিক নয়। অনুগ্রহ করে যাচাই করুন।",
        error: "Validation failed",
        errors: fieldErrors,
      };
    }

    const payload = {
      name: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      avatarUrl: formData.avatarUrl?.trim() || undefined,
      avatarPublicId: formData.avatarPublicId?.trim() || undefined,
    };

    // 2. Dispatch request to backend signup endpoint (with fallback)
    let responseData: unknown;

    try {
      responseData = await serverApiClient.post(
        API_ENDPOINTS.AUTH.REGISTER,
        payload,
        { skipAuth: true },
      );
    } catch (primaryError: unknown) {
      if (
        primaryError instanceof ServerApiError &&
        primaryError.statusCode === 404
      ) {
        responseData = await serverApiClient.post(
          API_ENDPOINTS.AUTH.FALLBACK_SIGNUP,
          payload,
          { skipAuth: true },
        );
      } else {
        throw primaryError;
      }
    }

    const raw = responseData as {
      message?: string;
      user?: AuthUser;
      data?: {
        user?: AuthUser;
      };
    };

    const userObj: AuthUser = raw?.data?.user ||
      raw?.user || {
        id: `usr_${Date.now()}`,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: "STORE_OWNER",
        avatarUrl: formData.avatarUrl || null,
        avatarPublicId: formData.avatarPublicId || null,
        isEmailVerified: false,
      };

    return {
      success: true,
      requiresVerification: true,
      email: formData.email.trim().toLowerCase(),
      message:
        raw?.message ||
        "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! আপনার ইমেইল যাচাই করতে ওটিপি (OTP) কোড পাঠানো হয়েছে।",
      user: userObj,
    };
  } catch (error: unknown) {
    if (error instanceof ServerApiError) {
      return {
        success: false,
        message: error.bengaliMessage || "রেজিস্ট্রেশন ব্যর্থ হয়েছে",
        error: error.message,
        errors: error.errors,
      };
    }

    const rawMessage =
      error instanceof Error
        ? error.message
        : "রেজিস্ট্রেশন প্রক্রিয়া সম্পন্ন করা সম্ভব হয়নি";

    return {
      success: false,
      message: "রেজিস্ট্রেশন ব্যর্থ হয়েছে",
      error: rawMessage,
    };
  }
}

/**
 * Server Action for Email OTP Verification (POST /auth/verify-email)
 * Validates the 6-digit OTP code, marks email verified, sets HttpOnly auth cookies, and returns session tokens.
 */
export async function verifyEmailAction(
  formData: VerifyEmailFormData,
): Promise<AuthActionResult> {
  try {
    const validation = verifyEmailSchema.safeParse(formData);
    if (!validation.success) {
      return {
        success: false,
        message: "সঠিক ইমেইল ও ৬ ডিজিটের ওটিপি দিন",
        error: "Validation failed",
      };
    }

    const payload = {
      email: formData.email.trim().toLowerCase(),
      otp: formData.otp.trim(),
    };

    // Dispatch POST /api/v1/auth/verify-email
    const responseData = await serverApiClient.post(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      payload,
      { skipAuth: true },
    );

    const raw = responseData as {
      message?: string;
      tokens?: AuthTokens;
      user?: AuthUser;
      data?: {
        tokens?: AuthTokens;
        user?: AuthUser;
      };
    };

    const tokens = raw?.data?.tokens || raw?.tokens;
    const user = raw?.data?.user || raw?.user;

    const accessToken = tokens?.accessToken;
    if (!accessToken) {
      throw new Error("Missing access token in verify-email response");
    }

    const verifiedUser: AuthUser = {
      id: user?.id || `usr_${Date.now()}`,
      name: user?.name || "",
      email: payload.email,
      phone: user?.phone,
      role: user?.role || "STORE_OWNER",
      avatarUrl: user?.avatarUrl,
      avatarPublicId: user?.avatarPublicId,
      isEmailVerified: true,
    };

    // Persist verified authentication tokens into HttpOnly cookies
    const cookieStore = await cookies();
    const cookieOptions = getAuthCookieOptions(60 * 60 * 24 * 7);

    cookieStore.set("auth_token", accessToken, cookieOptions);
    cookieStore.set("selldesk_access_token", accessToken, cookieOptions);
    cookieStore.set("email_verified", "true", {
      ...cookieOptions,
      httpOnly: false,
    });

    return {
      success: true,
      message: raw?.message || "ইমেইল সফলভাবে ভেরিফাই হয়েছে!",
      user: verifiedUser,
      token: accessToken,
      tokens,
    };
  } catch (error: unknown) {
    if (error instanceof ServerApiError) {
      return {
        success: false,
        message:
          error.bengaliMessage ||
          "ওটিপি যাচাই ব্যর্থ হয়েছে। সঠিক ওটিপি লিখুন।",
        error: error.message,
      };
    }

    const rawMessage =
      error instanceof Error
        ? error.message
        : "ওটিপি যাচাই প্রক্রিয়া সম্পন্ন করা সম্ভব হয়নি";

    return {
      success: false,
      message: "ওটিপি যাচাই ব্যর্থ হয়েছে",
      error: rawMessage,
    };
  }
}

/**
 * Server Action to Resend Email Verification OTP (POST /auth/resend-otp)
 * Triggers dispatch of a fresh 6-digit OTP code to the specified email address.
 */
export async function resendOtpAction(
  formData: ResendOtpFormData,
): Promise<AuthActionResult> {
  try {
    const validation = resendOtpSchema.safeParse(formData);
    if (!validation.success) {
      return {
        success: false,
        message: "সঠিক ইমেইল এড্রেস দিন",
        error: "Validation failed",
      };
    }

    const payload = {
      email: formData.email.trim().toLowerCase(),
    };

    const responseData = await serverApiClient.post<{ message?: string }>(
      API_ENDPOINTS.AUTH.RESEND_OTP,
      payload,
      { skipAuth: true },
    );

    return {
      success: true,
      message:
        responseData?.message ||
        "নতুন ওটিপি (OTP) কোড আপনার ইমেইলে পাঠানো হয়েছে!",
    };
  } catch (error: unknown) {
    if (error instanceof ServerApiError) {
      return {
        success: false,
        message: error.bengaliMessage || "ওটিপি পুনরায় পাঠাতে সমস্যা হয়েছে।",
        error: error.message,
      };
    }

    const rawMessage =
      error instanceof Error
        ? error.message
        : "ওটিপি পুনরায় পাঠানো সম্ভব হয়নি";

    return {
      success: false,
      message: "ওটিপি পুনরায় পাঠাতে সমস্যা হয়েছে",
      error: rawMessage,
    };
  }
}

/**
 * Server Action to Fetch Current Authenticated User Profile (GET /auth/me)
 */
export async function getCurrentUserAction(): Promise<
  AuthActionResult<AuthUser>
> {
  try {
    const responseData = await serverApiClient.get<
      { user?: AuthUser } | AuthUser
    >(API_ENDPOINTS.AUTH.ME);

    const user =
      (responseData as { user?: AuthUser })?.user || (responseData as AuthUser);

    if (!user || !user.id) {
      return {
        success: false,
        message: "ব্যবহারকারীর তথ্য পাওয়া যায়নি",
        error: "User not found",
      };
    }

    return {
      success: true,
      message: "ইউজার প্রোফাইল সফলভাবে লোড হয়েছে",
      user,
      data: user,
    };
  } catch (error: unknown) {
    if (error instanceof ServerApiError) {
      return {
        success: false,
        message: error.bengaliMessage || "ব্যবহারকারীর তথ্য লোড করা যায়নি",
        error: error.message,
      };
    }

    const rawMessage =
      error instanceof Error
        ? error.message
        : "ব্যবহারকারীর তথ্য লোড করা যায়নি";

    return {
      success: false,
      message: "ব্যবহারকারীর তথ্য লোড করা যায়নি",
      error: rawMessage,
    };
  }
}

/**
 * Helper to safely extract storeId claim from a JWT access token
 */
function extractStoreIdFromJwt(jwtToken: string): string | null {
  try {
    const parts = jwtToken.split(".");
    if (parts.length < 2) return null;
    const payloadStr = Buffer.from(parts[1], "base64").toString("utf-8");
    const payload = JSON.parse(payloadStr) as { storeId?: string | null };
    return payload?.storeId || null;
  } catch {
    return null;
  }
}

/**
 * Server Action for User Login
 * Authenticates user credentials, sets HttpOnly auth cookies,
 * verifies store onboarding status, and returns redirect destination.
 */
export async function loginAction(
  formData: LoginFormData,
): Promise<AuthActionResult> {
  try {
    // 1. Validate login form schema on the server
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0]?.toString() || "form";
        fieldErrors[path] = [...(fieldErrors[path] || []), issue.message];
      });

      return {
        success: false,
        message: "আপনার ইমেইল/মোবাইল নম্বর ও পাসওয়ার্ড সঠিকভাবে লিখুন",
        error: "Validation failed",
        errors: fieldErrors,
      };
    }

    const identifier = formData.emailOrPhone.trim();
    const payload = {
      email: identifier.toLowerCase(),
      password: formData.password,
    };

    // 2. Dispatch request to backend login endpoint (Primary: /stores/auth/login, Fallback: /auth/login)
    let responseData: unknown;

    try {
      responseData = await serverApiClient.post(
        API_ENDPOINTS.AUTH.LOGIN,
        payload,
        { skipAuth: true },
      );
    } catch (primaryError: unknown) {
      if (
        primaryError instanceof ServerApiError &&
        primaryError.statusCode === 404
      ) {
        responseData = await serverApiClient.post(
          API_ENDPOINTS.AUTH.FALLBACK_LOGIN,
          payload,
          { skipAuth: true },
        );
      } else {
        throw primaryError;
      }
    }

    // 3. Extract authentication tokens and user information
    const raw = responseData as {
      message?: string;
      user?: AuthUser & { storeId?: string; store?: { id: string } };
      tokens?: AuthTokens;
      token?: string;
      accessToken?: string;
      refreshToken?: string;
      storeId?: string;
    };

    const token =
      raw?.tokens?.accessToken || raw?.accessToken || raw?.token || "";

    if (!token) {
      throw new Error("Invalid authentication response: missing access token");
    }

    // Determine cookie max age based on 'rememberMe' selection (30 days vs 7 days)
    const maxAge = formData.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;

    const cookieStore = await cookies();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge,
    };

    // Set primary HttpOnly auth cookies
    cookieStore.set("auth_token", token, cookieOptions);
    cookieStore.set("selldesk_access_token", token, cookieOptions);
    cookieStore.set("email_verified", "true", {
      ...cookieOptions,
      httpOnly: false,
    });

    // 4. Resolve store presence to determine onboarding state
    let activeStoreId =
      raw?.user?.storeId ||
      raw?.user?.store?.id ||
      raw?.storeId ||
      extractStoreIdFromJwt(token);

    // If storeId not immediately present in response/JWT, verify against my-stores endpoint
    if (!activeStoreId) {
      try {
        const myStores = await serverApiClient.get<
          Array<{ id: string; storeId?: string; store?: { id: string } }>
        >(API_ENDPOINTS.TENANTS.GET_MY_TENANT, {
          token,
          skipAuth: false,
        });

        if (Array.isArray(myStores) && myStores.length > 0) {
          activeStoreId =
            myStores[0]?.storeId ||
            myStores[0]?.store?.id ||
            myStores[0]?.id ||
            null;
        }
      } catch {
        // Fall back gracefully if tenant endpoint is unreachable
      }
    }

    const hasStore = Boolean(activeStoreId);

    if (activeStoreId) {
      cookieStore.set("store_id", activeStoreId, cookieOptions);
      cookieStore.set("selldesk_store_id", activeStoreId, {
        ...cookieOptions,
        httpOnly: false,
      });
    }

    // Determine target redirect based on onboarding completion
    const redirectTo = hasStore ? "/dashboard" : "/onboarding";

    return {
      success: true,
      message: raw?.message || "লগইন সফল হয়েছে!",
      user: raw?.user,
      token,
      tokens: raw?.tokens,
      hasStore,
      redirectTo,
    };
  } catch (error: unknown) {
    if (error instanceof ServerApiError) {
      // Check if login blocked due to unverified email (HTTP 403 Forbidden)
      const isUnverified =
        error.statusCode === 403 ||
        error.message.toLowerCase().includes("verify") ||
        error.message.toLowerCase().includes("not verified");

      if (isUnverified) {
        return {
          success: false,
          requiresVerification: true,
          email: formData.emailOrPhone.trim().toLowerCase(),
          message:
            "আপনার ইমেইল ভেরিফাই করা হয়নি। অনুগ্রহ করে ওটিপি দিয়ে ভেরিফাই করুন।",
          error: error.message,
        };
      }

      const bengaliMessage =
        error.statusCode === 401
          ? "ইমেইল/ফোন অথবা পাসওয়ার্ড সঠিক নয়"
          : error.bengaliMessage || "লগইন ব্যর্থ হয়েছে";

      return {
        success: false,
        message: bengaliMessage,
        error: error.message,
        errors: error.errors,
      };
    }

    const rawMessage =
      error instanceof Error ? error.message : "লগইন ব্যর্থ হয়েছে";

    return {
      success: false,
      message: "লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করে আবার চেষ্টা করুন।",
      error: rawMessage,
    };
  }
}

/**
 * Server Action for User Logout
 * Clears HttpOnly cookies and redirects to the login route.
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete("auth_token");
  cookieStore.delete("selldesk_access_token");
  cookieStore.delete("store_id");
  cookieStore.delete("selldesk_store_id");
  cookieStore.delete("selldesk_tenant_subdomain");
  cookieStore.delete("email_verified");

  redirect("/login");
}
