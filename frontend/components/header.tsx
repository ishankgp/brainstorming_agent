"use client"

import { Beaker, BookOpen, MoreVertical, FileText, Info, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface HeaderProps {
  onOpenLibrary: () => void
}

export function Header({ onOpenLibrary }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/85 transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <div className="flex items-center gap-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/8 border border-primary/20">
            <Beaker className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-base font-medium text-foreground">Brainstorm Agent</h1>
            <p className="text-xs text-muted-foreground">Pharma Marketing Challenge Generator</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenLibrary}
            className="gap-2 hidden sm:flex"
          >
            <BookOpen className="h-4 w-4" />
            Format Library
          </Button>

          {/* Settings menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/explainer" className="flex items-center gap-3 cursor-pointer">
                  <Info className="h-4 w-4" />
                  Product Overview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/user-stories" className="flex items-center gap-3 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  User Stories
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/monitoring" className="flex items-center gap-3 cursor-pointer">
                  <Activity className="h-4 w-4" />
                  Performance Monitor
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onOpenLibrary}
                className="flex items-center gap-3 cursor-pointer sm:hidden"
              >
                <BookOpen className="h-4 w-4" />
                Format Library
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
