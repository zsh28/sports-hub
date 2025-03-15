// env.js
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.string().optional(),
    NEXT_PUBLIC_OWNER_PUBLIC_KEY: z.string(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV || "development",
    NEXT_PUBLIC_OWNER_PUBLIC_KEY: process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY,
  },
  // Set this flag to true if you want to skip validation (for example, in certain Docker setups)
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
