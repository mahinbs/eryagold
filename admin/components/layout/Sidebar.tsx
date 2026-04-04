"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Users,
  MessageSquareText,
  BellRing,
  Settings,
  LogOut,
  LayoutGrid,
  List,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: 'Designs', href: '/designs', icon: Package },
  { name: 'Collections', href: '/collections', icon: LayoutGrid },
  { name: 'Categories', href: '/categories', icon: List },
  { name: "Inquiries", href: "/inquiries", icon: MessageSquareText },
  { name: "Users", href: "/users", icon: Users },
  { name: "Notifications", href: "/notifications", icon: BellRing },
  { name: "Settings", href: "/settings", icon: Settings },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const fullName = user?.user_metadata?.full_name || "Admin User";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-200 w-64">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-100">
        <h1 className="text-xl font-serif tracking-widest text-[#C6A24D]">ERYA GOLD</h1>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="flex-1 space-y-1 px-3" aria-label="Sidebar">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  isActive
                    ? "bg-[#FAF9F6] text-[#C6A24D] border-l-4 border-[#C6A24D]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent",
                  "group flex items-center px-3 py-2.5 text-sm font-medium transition-all"
                )}
              >
                <item.icon
                  className={classNames(
                    isActive ? "text-[#C6A24D]" : "text-gray-400 group-hover:text-gray-500",
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors"
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center min-w-0">
            <div className="inline-block h-9 w-9 rounded-full bg-[#E6D6A8] flex items-center justify-center shrink-0">
              <span className="text-[#1E1E1E] font-medium">{initials}</span>
            </div>
            <div className="ml-3 truncate">
              <p className="text-sm font-medium text-gray-700 truncate">{fullName}</p>
              <p className="text-xs font-medium text-gray-400 truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
