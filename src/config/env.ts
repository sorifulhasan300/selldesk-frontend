import { z } from "zod";

export const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
});

export const clientSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url("NEXT_PUBLIC_API_URL must be a valid URL")
    .default("http://localhost:5000/api/v1"),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .default("http://localhost:3000"),
  NEXT_PUBLIC_APP_DOMAIN: z
    .string()
    .min(1, "NEXT_PUBLIC_APP_DOMAIN is required")
    .default("selldesk.com"),
  NEXT_PUBLIC_SENTRY_DSN: z
    .string()
    .url("NEXT_PUBLIC_SENTRY_DSN must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export const envSchema = serverSchema.merge(clientSchema);

export type Env = z.infer<typeof envSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;

const formatErrors = (issues: z.ZodError["issues"]): string => {
  return issues
    .map((issue) => `  - [${issue.path.join(".")}]: ${issue.message}`)
    .join("\n");
};

const isServer = typeof window === "undefined";

const clientEnv = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
};

const serverEnv = {
  ...clientEnv,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
};

const parsed = isServer
  ? envSchema.safeParse(serverEnv)
  : clientSchema.safeParse(clientEnv);

if (!parsed.success) {
  const formattedErrors = formatErrors(parsed.error.issues);
  console.error(
    `\n❌ Invalid Environment Configuration:\n${formattedErrors}\n`,
  );
  throw new Error(`Invalid environment variables:\n${formattedErrors}`);
}

export const env = parsed.data as Env;
