"use client"

import { Beaker, BookOpen, MoreVertical, FileText, Info, Activity, Menu, LayoutGrid, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"

export function Header() {
  const pathname = usePathname()
  const { setIsLibraryOpen } = useAppStore()

  const navItems = [
    {
      name: "Generator",
      href: "/",
      icon: LayoutGrid,
      matcher: (path: string) => path === "/"
    },
    {
      name: "Monitor",
      href: "/monitoring",
      icon: Activity,
      matcher: (path: string) => path === "/monitoring"
    },
    {
      name: "Models",
      href: "/monitoring/models",
      icon: Settings,
      matcher: (path: string) => path.startsWith("/monitoring/models")
    },
    {
      name: "Guide",
      href: "/explainer",
      icon: Info,
      matcher: (path: string) => path.startsWith("/explainer")
    },
    {
      name: "Docs",
      href: "/user-stories",
      icon: FileText,
      matcher: (path: string) => path.startsWith("/user-stories")
    }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/85 transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shadow-sm ring-1 ring-primary/5">
              <Beaker className="h-5 w-5 text-primary" />
            </div>
            <div className="hidden md:flex flex-col gap-0.5">
              <h1 className="text-sm font-semibold text-foreground tracking-tight">Brainstorm Agent</h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Pharma Marketing</p>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => {
            const isActive = item.matcher(pathname)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-secondary text-foreground shadow-sm ring-1 ring-border/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "opacity-70")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLibraryOpen(true)}
            className="hidden sm:flex items-center gap-2 h-9 px-4 rounded-full border-border/60 hover:bg-muted/50 hover:border-border transition-colors group"
          >
            <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium">Format Library</span>
          </Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-muted"
                >
                  <Menu className="h-5 w-5 text-muted-foreground" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = item.matcher(pathname)
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer mb-1",
                          isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
                        )}
                      >
                        <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem
                  onClick={() => setIsLibraryOpen(true)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer"
                >
                  <BookOpen className="h-4 w-4" />
                  Format Library
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

