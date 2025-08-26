"use server";

import { redirect } from "next/navigation";

export async function handleUpdateItem(formData: FormData) {
  // In a real app, we would update the data in a database
  const id = formData.get("id") || "";
  
  // For now, just redirect back to inventory item page
  redirect(`/inventory/${id}`);
}
