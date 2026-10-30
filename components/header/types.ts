import { SafeUser } from "@/lib/auth/types";

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export interface HighlightItem extends NavItem {
  isSale?: boolean;
}

export interface HeaderProps {
  currentUser?: SafeUser | null;
  className?: string;
}

export interface AccountDropdownProps {
  currentUser: SafeUser | null;
  isOpen: boolean;
  onClose: () => void;
  isLoggingOut: boolean;
  onLogout: () => void;
}

export interface HeaderSearchProps {
  className?: string;
  placeholder?: string;
  onSearchSubmit?: (query: string) => void;
}

