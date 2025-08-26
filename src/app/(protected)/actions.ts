"use server";

import { redirect } from "next/navigation";

export async function handleLogout() {
  // In a real app, we would clear the session/cookies here
  // For now, just redirect to login page
  redirect("/login");
}
