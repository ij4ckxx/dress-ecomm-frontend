import { redirect } from "next/navigation";

/**
 * Root account redirect handler routing users to their account profile.
 */
export default function AccountIndexPage() {
  redirect("/account/profile");
}

