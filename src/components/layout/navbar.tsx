"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === link.href && "text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
              pathname === "/dashboard" && "text-foreground",
            )}
          >
            My CVs
          </Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink variant="ghost" className="h-9 px-3" href="/signin">
            Sign in
          </ButtonLink>
          <ButtonLink className="h-9 px-4" href="/builder/new">
            Create my CV
          </ButtonLink>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon-lg" className="md:hidden" aria-label="Open menu" />}
          >
            <MenuIcon className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] p-6">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="mt-2">
              <Logo />
            </div>
            <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
              {[...NAV_LINKS, { href: "/dashboard", label: "My CVs" }].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-base font-medium text-foreground hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 flex flex-col gap-2">
              <ButtonLink variant="outline" className="h-11 w-full text-base" href="/signin" onClick={() => setOpen(false)}>
                Sign in
              </ButtonLink>
              <ButtonLink className="h-11 w-full text-base" href="/builder/new" onClick={() => setOpen(false)}>
                Create my CV
              </ButtonLink>
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}
