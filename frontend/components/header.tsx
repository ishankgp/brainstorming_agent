"use client"

import { Beaker, BookOpen, MoreVertical, FileText, Info } from "lucide-react"
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
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Beaker className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Brainstorm Agent</h1>
            <p className="text-xs text-muted-foreground">Pharma Marketing Challenge Generator</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenLibrary}
            className="gap-2 bg-transparent"
          >
            <BookOpen className="h-4 w-4" />
            Format Library
          </Button>

          {/* Discreet settings menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/explainer" className="flex items-center gap-2 cursor-pointer">
                  <Info className="h-4 w-4" />
                  Product Overview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/user-stories" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  User Stories
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onOpenLibrary}
                className="flex items-center gap-2 cursor-pointer"
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
