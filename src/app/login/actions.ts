"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleLogin(formData: FormData) {
  // Get form values
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // Simple validation
  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  // In a real app, you would validate against a database or API
  // This is a simple mock authentication
  if (username === "admin" && password === "password") {
    // Set a cookie to indicate the user is logged in
    cookies().set("auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    // Redirect to dashboard
    redirect("/dashboard");
  }

  // Return error for invalid credentials
  return { error: "Invalid username or password" };
}
