"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronsUpDown, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth-client";
import { ROLE_HOME, ROLE_LABEL } from "@/lib/constants";
import { initials } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";
import type { Profile } from "@/types/api";

export function UserMenu({ user }: { user: Profile }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      setUser(null);
      toast.success("You have been signed out");
      router.replace("/login");
      router.refresh();
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-9 gap-2 px-1.5" aria-label="Account menu" />}>
        <Avatar size="sm">
          <AvatarFallback className="bg-primary text-primary-foreground">{initials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-32 truncate text-sm sm:inline">{user.name}</span>
        <ChevronsUpDown className="text-muted-foreground" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="space-y-0.5 py-1.5">
            <span className="block truncate text-sm font-medium text-foreground">{user.name}</span>
            <span className="block truncate font-normal">{user.email}</span>
            <span className="block font-normal">{ROLE_LABEL[user.role]}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={`${ROLE_HOME[user.role]}/profile`} />}>
          <UserRound aria-hidden />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
          <LogOut aria-hidden />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}