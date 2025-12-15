"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  BadgeCheck,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  Hourglass,
  LayoutDashboard,
  Layers,
  Menu,
  PenSquare,
  type LucideIcon,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface SidebarChild {
  label: string;
  href: string;
}

const ICONS = {
  dashboard: LayoutDashboard,
  programs: Layers,
  students: GraduationCap,
  jury: Users,
  teams: Users,
  assignments: ClipboardCheck,
  addResult: PenSquare,
  pending: Hourglass,
  approved: BadgeCheck,
} satisfies Record<string, LucideIcon>;

type IconName = keyof typeof ICONS;

export interface SidebarItem {
  label: string;
  href?: string;
  icon?: IconName;
  children?: SidebarChild[];
}

interface SidenavbarProps {
  items: SidebarItem[];
  heading?: string;
  children?: ReactNode;
}

export default function Sidenavbar({
  items,
  heading = "Menu",
  children,
}: SidenavbarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col gap-4">
      {/* Mobile navbar + drawer menu */}
      <div className="flex flex-col gap-3 md:hidden px-3 pt-3">
        <header className="flex items-center justify-between rounded-2xl bg-white shadow-sm px-4 py-3">
          <span className="text-lg font-semibold text-gray-900">{heading}</span>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-gray-100 hover:bg-gray-200 text-gray-600"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-none bg-white p-0">
              <ScrollArea className="h-full py-4">
                <nav className="space-y-1 px-3">
                  {items.map((item) => {
                    const IconComponent = item.icon ? ICONS[item.icon] : undefined;
                    const isActive = pathname?.startsWith(item.href ?? "");
                    return (
                      <Button
                        key={item.href ?? item.label}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start",
                          isActive && "bg-emerald-50 text-emerald-700",
                          !isActive && "text-gray-600 hover:bg-gray-100"
                        )}
                        asChild
                        onClick={() => setMobileOpen(false)}
                      >
                        <Link
                          href={item.href ?? "#"}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium"
                        >
                          {IconComponent && (
                            <IconComponent className={cn(
                              "h-4 w-4 shrink-0",
                              isActive ? "text-emerald-600" : "text-gray-400"
                            )} />
                          )}
                          <span>{item.label}</span>
                        </Link>
                      </Button>
                    );
                  })}
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1">{children}</main>
      </div>

      {/* Desktop sidebar layout */}
      <div className="hidden min-h-screen gap-6 md:flex relative">
        <aside
          className={cn(
            "fixed left-3 top-3 bottom-3 z-50 flex flex-col rounded-2xl bg-white shadow-xl transition-all duration-300 ease-in-out",
            isOpen ? "w-56" : "w-16",
          )}
        >
          <div
            className={cn(
              "flex h-14 items-center border-b border-gray-100",
              isOpen ? "justify-between px-4" : "justify-center px-2",
            )}
          >
            <span
              className={cn(
                "text-base font-semibold text-gray-900 transition-opacity",
                isOpen ? "opacity-100" : "hidden",
              )}
            >
              {heading}
            </span>
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen((prev) => !prev)}
              className="shrink-0 bg-gray-100 hover:bg-gray-200 rounded-lg h-8 w-8 text-gray-600"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <nav className="p-2 space-y-0.5">
              {items.map((item) => {
                const IconComponent = item.icon ? ICONS[item.icon] : undefined;
                const isActive = pathname?.startsWith(item.href ?? "");
                const hasActiveChild = item.children?.some((child) => 
                  pathname?.startsWith(child.href)
                ) ?? false;
                
                return item.children && item.children.length > 0 ? (
                  <Collapsible 
                    key={item.label} 
                    className="space-y-0.5" 
                    defaultOpen={hasActiveChild && isOpen}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full rounded-xl h-10 text-sm",
                          isActive && "bg-emerald-50 text-emerald-700",
                          !isActive && "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                          !isOpen ? "justify-center px-0" : "justify-start px-3",
                        )}
                        title={!isOpen ? item.label : undefined}
                      >
                        {IconComponent && (
                          <IconComponent className={cn(
                            "shrink-0",
                            isActive ? "text-emerald-600" : "text-gray-400",
                            isOpen ? "h-4 w-4" : "h-5 w-5"
                          )} />
                        )}
                        {isOpen && (
                          <>
                            <span className="flex-1 text-left ml-2 text-sm font-medium">{item.label}</span>
                            <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 transition-transform duration-200 text-gray-400 data-[state=open]:rotate-90" />
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    {isOpen && (
                      <CollapsibleContent className="ml-2 space-y-0.5 mt-0.5">
                        {item.children.map((child) => (
                          <Button
                            key={child.href}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start rounded-lg h-8 text-xs",
                              pathname?.startsWith(child.href) &&
                                "bg-emerald-50 text-emerald-700",
                              !pathname?.startsWith(child.href) && "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            )}
                            asChild
                          >
                            <Link href={child.href} className="w-full flex items-center font-medium">{child.label}</Link>
                          </Button>
                        ))}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                ) : (
                  <Button
                    key={item.href ?? item.label}
                    variant="ghost"
                    className={cn(
                      "w-full rounded-xl h-10 text-sm",
                      pathname?.startsWith(item.href ?? "") &&
                        "bg-emerald-50 text-emerald-700",
                      !pathname?.startsWith(item.href ?? "") && "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                      !isOpen ? "justify-center px-0" : "justify-start px-3",
                    )}
                    asChild
                  >
                    <Link
                      href={item.href ?? "#"}
                      className={cn(
                        "flex w-full items-center",
                        isOpen ? "gap-2 justify-start" : "justify-center"
                      )}
                      title={!isOpen ? item.label : undefined}
                    >
                      {IconComponent && (
                        <IconComponent
                          className={cn(
                            "shrink-0",
                            pathname?.startsWith(item.href ?? "") ? "text-emerald-600" : "text-gray-400",
                            isOpen ? "h-4 w-4" : "h-5 w-5"
                          )}
                        />
                      )}
                      {isOpen && <span className="flex-1 text-left text-sm font-medium">{item.label}</span>}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>
        <main className={cn(
          "flex-1 w-full transition-all duration-300 ease-in-out",
          isOpen ? "ml-[15rem]" : "ml-[5rem]"
        )}>{children}</main>
      </div>
    </div>
  );
}

