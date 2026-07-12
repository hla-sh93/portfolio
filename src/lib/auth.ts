// ---------------------------------------------------------------------------
// Auth.js v5 (next-auth@5) configuration
//
// Install the package before using this file:
//   npm install next-auth@beta
//
// Required environment variables:
//   AUTH_SECRET          — Random 32+ char secret (generate with `npx auth secret`)
//   DATABASE_URL         — PostgreSQL connection string (used by Prisma)
//
// Usage:
//   import { auth, signIn, signOut, handlers } from "@/lib/auth";
//
//   - handlers → export from app/api/auth/[...nextauth]/route.ts
//   - auth      → use in Server Components / API routes to get the session
//   - signIn    → call from Server Actions
//   - signOut   → call from Server Actions
// ---------------------------------------------------------------------------

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations";
import type { NextAuthConfig } from "next-auth";
import type { User } from "next-auth";

// ---------------------------------------------------------------------------
// Augment NextAuth types to carry the user role through the session
// ---------------------------------------------------------------------------

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: "ADMIN" | "EDITOR";
    };
  }

  interface User {
    role: "ADMIN" | "EDITOR";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "EDITOR";
  }
}

// ---------------------------------------------------------------------------
// Auth.js configuration
// ---------------------------------------------------------------------------

export const authConfig: NextAuthConfig = {
  // -------------------------------------------------------------------------
  // Session strategy
  // -------------------------------------------------------------------------
  session: {
    strategy: "jwt",
    /** Session lifetime: 8 hours. */
    maxAge: 8 * 60 * 60,
    /** Rolling session — refresh the token on every request. */
    updateAge: 60 * 60,
  },

  // -------------------------------------------------------------------------
  // Custom pages
  // -------------------------------------------------------------------------
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  // -------------------------------------------------------------------------
  // Providers
  // -------------------------------------------------------------------------
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "admin@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      /**
       * Validates the submitted credentials against the database.
       *
       * Returns the user object on success, or null on failure.
       * Throwing CredentialsSignin surfaces the error to the sign-in page.
       */
      async authorize(credentials): Promise<User | null> {
        // 1. Parse and validate input shape with Zod.
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // 2. Look up the user in the database.
        const user = await db.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
          },
        });

        if (!user) return null;

        // 3. Compare the submitted password against the stored hash.
        const passwordMatch = await bcryptjs.compare(password, user.password);
        if (!passwordMatch) return null;

        // 4. Return a plain user object (password hash excluded).
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
          role: user.role,
        };
      },
    }),
  ],

  // -------------------------------------------------------------------------
  // Callbacks
  // -------------------------------------------------------------------------
  callbacks: {
    /**
     * jwt callback — called when a JWT is created or updated.
     * Embeds `id` and `role` into the token so they survive across requests.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as User).role;
      }
      return token;
    },

    /**
     * session callback — called whenever the session is accessed.
     * Maps JWT fields onto the session object so they are available in
     * Server Components via `auth()` and on the client via `useSession()`.
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },

    /**
     * authorized callback — called by the Auth.js middleware to decide
     * whether a request is permitted to access a given route.
     *
     * Rules:
     * - `/admin/login` is always accessible.
     * - All other `/admin/**` routes require an authenticated session.
     * - Everything else is public.
     */
    authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl;

      // Public admin login page — always allow.
      if (pathname.startsWith("/admin/login")) return true;

      // All other admin routes require authentication.
      if (pathname.startsWith("/admin")) {
        return !!session?.user;
      }

      // All non-admin routes are public.
      return true;
    },
  },

  // -------------------------------------------------------------------------
  // Security
  // -------------------------------------------------------------------------
  trustHost: true,
};

// ---------------------------------------------------------------------------
// Export the Auth.js helpers
// ---------------------------------------------------------------------------

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);

// ---------------------------------------------------------------------------
// Server-side session helpers
// ---------------------------------------------------------------------------

/**
 * Returns the current session or null if the user is not authenticated.
 * Safe to call in Server Components and API Route Handlers.
 */
export async function getSession() {
  return auth();
}

/**
 * Returns the authenticated user from the current session.
 * Throws an error if called in an unauthenticated context.
 *
 * @throws Error if there is no active session.
 */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: no active session.");
  }
  return session;
}

/**
 * Checks whether the current user has ADMIN role.
 *
 * @returns `true` if the session user is an ADMIN.
 */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}
