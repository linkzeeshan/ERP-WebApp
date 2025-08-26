"use server";

import { redirect } from "next/navigation";

export async function handleAddItem(formData: FormData) {
  // In a real app, we would save the data to a database
  // For now, just redirect back to inventory page
  redirect("/inventory");
}
