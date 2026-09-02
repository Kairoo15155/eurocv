"use client";

import Link from "next/link";
import { LogOutIcon, UserIcon } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Navbar account control: "Sign in" link, or a menu for the signed-in user. */
export function UserMenu({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { user, enabled, signOut } = useAuth();

  if (!user) {
    return variant === "desktop" ? (
      <ButtonLink variant="ghost" className="h-9 px-3" href="/signin">
        Sign in
      </ButtonLink>
    ) : (
      <ButtonLink variant="outline" className="h-11 w-full text-base" href="/signin">
        Sign in
      </ButtonLink>
    );
  }

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-2">
        <p className="truncate px-1 text-sm text-muted-foreground">{user.email}</p>
        <Button variant="outline" className="h-11 w-full text-base" onClick={() => void signOut()}>
          <LogOutIcon data-icon="inline-start" />
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-9 max-w-[220px] px-2" aria-label="Account menu" />}>
        <span className="flex size-6 items-center justify-center rounded-full bg-brand-soft text-brand">
          <UserIcon className="size-3.5" />
        </span>
        <span className="truncate text-sm">{user.name ?? user.email}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate font-normal text-muted-foreground">{user.email}</DropdownMenuLabel>
          <DropdownMenuItem render={<Link href="/dashboard" />}>My CVs</DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/pricing" />}>Plan &amp; billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => void signOut()} disabled={!enabled}>
            <LogOutIcon /> Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
