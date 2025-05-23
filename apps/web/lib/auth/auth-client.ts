import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/auth/api/auth`,
  plugins: [inferAdditionalFields({
    user: {
      first_name: {
        type: "string",
        input: true,
        required: true,
      },
      surname: {
        type: "string",
        input: true,
        required: true,
      },
      role: {
        type: "string",
        required: true,
        defaultValue: "STUDENT",
        input: false,
      },
    }
  })],
});

export type AuthClient = typeof authClient.$Infer;
export type Session = typeof authClient.$Infer.Session;
export type User = Omit<typeof authClient.$Infer.Session.user, "first_name" | "surname">;

export const { signIn, signUp, signOut, useSession } = authClient;