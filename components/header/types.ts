import { SafeUser } from "@/lib/auth/types";
import { CategoryItem } from "@/lib/types/category";

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  slug?: string;
}

export interface HighlightItem extends NavItem {
  isSale?: boolean;
}

export interface HeaderProps {
  currentUser?: SafeUser | null;
  categories?: CategoryItem[];
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

export interface HeaderNavProps {
  categories?: CategoryItem[];
}

export interface MobileHeaderNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: SafeUser | null;
  categories?: CategoryItem[];
}
