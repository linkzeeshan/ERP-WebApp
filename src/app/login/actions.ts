"use server";

import { redirect } from "next/navigation";

export async function handleLogin(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // Basic validation
  if (!username || !password) {
    return { success: false, error: "Username and password are required" };
  }

  // Simple authentication logic
  // In a real application, you would validate against a database
  if (username === "ceo" && password === "sunflagdemo") {
    // In a real app, you would set session/cookies here
    // For now, just redirect to the data analytics dashboard
    redirect("/real-analysis");
  } else {
    // Return error instead of throwing
    return { success: false, error: "Invalid username or password" };
  }
}
