import {
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Lightbulb,
  Mail,
  Shapes,
  ShoppingBag,
  Users,
} from "lucide-react";

export const publicNavLinks = [
  { href: "/", label: "Home" },
  { href: "/ideas", label: "Ideas" },
  { href: "/about-us", label: "About Us" },
  { href: "/newsletter", label: "Newsletter" },
];

export const authenticatedNavLinks = [
  { href: "/", label: "Home" },
  { href: "/ideas", label: "Ideas" },
  { href: "/about-us", label: "About Us" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/blog", label: "Blog" },
];

export const resourceNavLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
];

export const publicProfileLinks = [
  { href: "/login", label: "Login" },
  { href: "/register", label: "Join now" },
];

export const memberProfileLinks = [
  { href: "/my-profile", label: "My Profile" },
  { href: "/dashboard/member/ideas", label: "My Ideas" },
  { href: "/dashboard/member/purchases", label: "Purchases" },
  { href: "/dashboard/member/ideas/new", label: "Create Idea" },
];

export const adminProfileLinks = [
  { href: "/my-profile", label: "My Profile" },
  { href: "/dashboard/admin/ideas", label: "Idea Review" },
  { href: "/dashboard/admin/categories", label: "Categories" },
  { href: "/dashboard/admin/users", label: "Users" },
];

export const memberDashboardLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/member/ideas", label: "My Ideas", icon: FolderKanban },
  { href: "/dashboard/member/purchases", label: "Purchases", icon: ShoppingBag },
  { href: "/ideas", label: "Public Ideas", icon: Lightbulb },
];

export const adminDashboardLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/ideas", label: "Idea Review", icon: ClipboardList },
  { href: "/dashboard/admin/categories", label: "Categories", icon: Shapes },
  { href: "/dashboard/admin/newsletters", label: "Newsletters", icon: Mail },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/ideas", label: "Public Ideas", icon: Lightbulb },
];
