import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to data analytics dashboard as the home page
  redirect("/real-analysis");
}
