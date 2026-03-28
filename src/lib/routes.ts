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
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about-us", label: "About Us" },
  { href: "/blog", label: "Blog" },
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
