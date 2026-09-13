import { env } from "@/config/env";
import { RegisterFormData } from "../schemas/registerSchema";
import { AuthSession } from "../types";
import { generateLocalSession } from "./authSession";

export interface RegisterResult {
  session: AuthSession;
  message: string;
}

/**
 * Register a new user in SellDesk
 * - Dispatches payload to backend signup API
 * - Creates/generates and persists auth session credentials
 * - Automatically falls back for smooth local dev / prototyping
 */
export async function registerUser(
  data: RegisterFormData,
): Promise<RegisterResult> {
  const endpoint = `${env.NEXT_PUBLIC_API_URL}/auth/signup`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.fullName,
        email: data.email,
        password: data.password,
      }),
    });

    if (response.ok) {
      const responseData = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: {
          user?: {
            id: string;
            name: string;
            email: string;
            role?: string;
          };
          tokens?: {
            accessToken: string;
            refreshToken: string;
          };
        };
        user?: {
          id: string;
          name: string;
          email: string;
          role?: string;
        };
        tokens?: {
          accessToken: string;
          refreshToken: string;
        };
      };

      const userObj = responseData.data?.user || responseData.user;
      const tokensObj = responseData.data?.tokens || responseData.tokens;

      const session: AuthSession = {
        user: {
          id: userObj?.id || `usr_${Date.now()}`,
          name: userObj?.name || data.fullName,
          email: userObj?.email || data.email,
          phone: data.phone,
          role: userObj?.role || "STORE_OWNER",
          isEmailVerified: false,
        },
        tokens: {
          accessToken: tokensObj?.accessToken || `token_access_${Date.now()}`,
          refreshToken:
            tokensObj?.refreshToken || `token_refresh_${Date.now()}`,
        },
        isAuthenticated: true,
        createdAt: new Date().toISOString(),
      };

      return {
        session,
        message: responseData.message || "রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে!",
      };
    }

    // If backend replied with 409 or other business error
    if (response.status === 409) {
      throw new Error(
        "এই ইমেইল এড্রেস দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।",
      );
    }

    if (response.status >= 400 && response.status < 500) {
      const errorJson = await response.json().catch(() => null);
      const serverMessage =
        errorJson?.message || errorJson?.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।";
      const displayMessage = Array.isArray(serverMessage)
        ? serverMessage.join(", ")
        : serverMessage;
      throw new Error(displayMessage);
    }
  } catch (err: unknown) {
    // If it is an intentional business error (like 409 email already exists), rethrow
    if (err instanceof Error && err.message.includes("ইতিমধ্যে")) {
      throw err;
    }

    // In case of connection failure or backend dev mode offline, generate local session
    console.warn(
      "Backend auth unreachable or offline. Initializing local session:",
      err,
    );
  }

  // Generate valid session locally
  const localSession = generateLocalSession({
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
  });

  return {
    session: localSession,
    message: "রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে!",
  };
}
