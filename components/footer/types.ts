import { SafeUser } from "@/lib/auth/types";

export interface FooterLink {
  label: string;
  href: string;
  icon?: string;
  isExternal?: boolean;
}

export interface SupportHours {
  label: string;
  hours: string;
}

export interface FooterProps {
  currentUser?: SafeUser | null;
  className?: string;
}

