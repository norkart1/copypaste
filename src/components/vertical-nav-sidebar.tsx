"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Trophy,
  BarChart3,
  Search,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/results", label: "Results", icon: Trophy },
  { href: "/scoreboard", label: "Scoreboard", icon: BarChart3 },
  { href: "/participant", label: "Find Participant", icon: Search },
  { href: "/chatbot", label: "AI Assistant", icon: Bot },
];

export function VerticalNavSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 bg-white/90 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20 px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 group",
                isActive
                  ? "bg-gradient-to-br from-[#8B4513] to-[#A0522D] text-white shadow-lg shadow-[#8B4513]/30"
                  : "text-gray-500 hover:bg-gray-100 hover:text-[#8B4513]"
              )}
              title={item.label}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isActive && "scale-110"
                )}
              />
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
              )}
              <span className="absolute -top-10 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap shadow-xl">
                {item.label}
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 rounded-sm" />
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
