"use server";

import { signIn, signOut } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { registerSchema, loginSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";

export async function registerAction(formData: FormData) {
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

    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Registration failed" };
  }
}

export async function loginAction(formData: FormData) {
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
    return { error: "Invalid email or password" };
  }
}

export async function googleSignInAction() {
  await signIn("google", { redirectTo: "/" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
