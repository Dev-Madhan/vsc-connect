import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";
import { prisma } from "./prisma";
import { env } from "./env";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

/**
 * Pre-approved Google emails. Only these accounts may sign in via Google OAuth.
 * Any other Google account will have its session destroyed immediately after creation.
 */
const GOOGLE_ALLOWLIST = new Set([
  "mg5661639@gmail.com",                        // Super Administrator
  "mukeshveralevel@gmail.com",                   // President
  "mukeshg.csbs24@veltechmultitech.org",         // Vice President
]);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  plugins: [
    username({
      // Default validator only allows [a-zA-Z0-9_.] which breaks usernames like "admin@vsc"
      usernameValidator: (u) => /^[a-zA-Z0-9_.@]+$/.test(u),
      minUsernameLength: 3,
      maxUsernameLength: 50,
    }),
  ],

  user: {
    additionalFields: {
      roleId:   { type: "string", required: false },
      memberId: { type: "string", required: false },
    },
  },

  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          // Look up the user about to get a session
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
            include: {
              accounts: {
                where: { providerId: "google" },
              },
            },
          });

          if (!user) return false;  // no user → block

          const isGoogleSession = user.accounts.length > 0;

          // If this is a Google-authenticated user, enforce the allowlist
          if (isGoogleSession && !GOOGLE_ALLOWLIST.has(user.email)) {
            return false; // block session creation
          }

          return { data: session };
        },
      },
    },
  },

  socialProviders: {
    // Google SSO is temporarily disabled — re-enable by restoring required
    // GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in lib/env.ts and uncommenting below.
    // google: {
    //   clientId: env.GOOGLE_CLIENT_ID!,
    //   clientSecret: env.GOOGLE_CLIENT_SECRET!,
    // },
  },

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
      await resend.emails.send({
        from: "Vistara Connect <noreply@vistaraconnect.com>",
        to: user.email,
        subject: "Reset your password",
        html: `Click <a href="${url}">here</a> to reset your password.`,
      });
    },
  },

  onAPIError: {
    // Redirect all auth errors to our custom page instead of Better Auth's default
    errorURL: "/auth/error",
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,      // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,             // 5 mins
    },
  },
});
