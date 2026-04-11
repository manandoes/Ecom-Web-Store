import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, accounts } from "@/lib/db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatarUrl,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
    error: "/auth/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, user.email!),
        });

        if (!existingUser) {
          const [newUser] = await db
            .insert(users)
            .values({
              email: user.email!,
              name: user.name || "User",
              avatarUrl: user.image,
              emailVerified: new Date(),
              role: "customer",
            })
            .returning();

          await db.insert(accounts).values({
            userId: newUser.id,
            provider: "google",
            providerAccountId: account.providerAccountId,
            accessToken: account.access_token ?? null,
            refreshToken: account.refresh_token ?? null,
          });

          user.id = newUser.id;
        } else {
          user.id = existingUser.id;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
});
