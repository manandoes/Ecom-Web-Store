"use server";

import { signIn, signOut } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { registerSchema, loginSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authRateLimit } from "@/lib/redis/ratelimit";
import { sendWelcomeEmail, sendPasswordResetEmail } from "@/lib/emails/resend";
import crypto from "crypto";

export async function registerAction(formData: FormData) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";
  const { success: rateLimitSuccess } = await authRateLimit.limit(ip);
  
  if (!rateLimitSuccess) {
    return { error: "Too many requests. Please try again later." };
  }

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  try {
    // Check if user exists
    const existing = await db.query.users.findFirst({
      where: eq(users.email, parsed.data.email),
    });
    if (existing) {
      return { error: "An account with this email already exists" };
    }

    // Hash password & create user
    const hashedPassword = await hash(parsed.data.password, 12);
    await db.insert(users).values({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: hashedPassword,
      role: "customer",
    });

    // Auto-login after registration
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    // Fire-and-forget: send welcome email (don't block registration)
    sendWelcomeEmail(parsed.data.email, parsed.data.name).catch((err) =>
      console.error("Welcome email failed (non-critical):", err)
    );

    return { success: true };
  } catch (e: unknown) {
    // Avoid exposing raw database constraints
    console.error("Registration error:", e);
    return { error: "Registration failed. Please try again." };
  }
}

export async function loginAction(formData: FormData) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";
  const { success: rateLimitSuccess } = await authRateLimit.limit(ip);
  
  if (!rateLimitSuccess) {
    return { error: "Too many login attempts. Please try again later." };
  }

  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  try {
    const result = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    return { success: true };
  } catch (e: unknown) {
    console.error("Login verification error:", e);
    return { error: "Invalid email or password" };
  }
}

export async function googleSignInAction() {
  await signIn("google", { redirectTo: "/" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required" };

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    // Return success even if user doesn't exist for security reasons
    return { success: true };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 3600000); // 1 hour

  await db
    .update(users)
    .set({ resetToken: token, resetTokenExpiry: expiry })
    .where(eq(users.id, user.id));

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  // Non-blocking email send
  sendPasswordResetEmail(user.email, resetLink).catch(console.error);

  return { success: true };
}

export async function resetPasswordAction(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  if (!token || !password) {
    return { error: "Missing required fields" };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.resetToken, token),
  });

  if (!user || !user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
    return { error: "Invalid or expired reset token" };
  }

  const passwordHash = await hash(password, 10);

  await db
    .update(users)
    .set({
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
    })
    .where(eq(users.id, user.id));

  return { success: true };
}
