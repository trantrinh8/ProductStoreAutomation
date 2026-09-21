import dotenv from "dotenv";

dotenv.config({ quiet: true });

export interface FrameworkEnv {
  baseUrl: string;
  defaultUsername: string;
  defaultPassword: string;
}

export function getEnv(): FrameworkEnv {
  return {
    baseUrl: process.env.BASE_URL ?? "https://www.demoblaze.com",
    defaultUsername:
      process.env.DEMOBLAZE_USERNAME ?? `auto_user_${Date.now()}`,
    defaultPassword: process.env.DEMOBLAZE_PASSWORD ?? "P@ssw0rd123!",
  };
}
