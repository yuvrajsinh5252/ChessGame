"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { ChessTheme } from "../themes/chess-theme";
import ThemeToggle from "../themes/theme-toggle";
import Link from "next/link";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FriendsList } from "../friends/FriendsList";
import { UserSearch } from "../friends/UserSearch";
import { UserPlus } from "lucide-react";
import { RiLoginCircleLine } from "react-icons/ri";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
}

export function HamburgerMenu({ isOpen, onClick }: HamburgerMenuProps) {
  return (
    <button
      className="relative w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 md:hidden focus:outline-none group"
      onClick={onClick}
      aria-label="Toggle Menu"
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5">
        <span
          className={`absolute top-0.5 block h-0.5 w-5 rounded-full bg-current transform transition-all duration-300 ease-in-out ${
            isOpen ? "rotate-45 translate-y-1" : ""
          }`}
        />
        <span
          className={`absolute top-2 block h-0.5 w-5 rounded-full bg-current transform transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`absolute top-3.5 block h-0.5 w-5 rounded-full bg-current transform transition-all duration-300 ease-in-out ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </div>
    </button>
  );
}

export function HamBurger({
  isMobileMenuOpen,
  status,
  session,
  isDialogOpen,
  setIsDialogOpen,
}: {
  isMobileMenuOpen: boolean;
  status: string;
  session: any;
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
}) {
  return (
    <div
      className={`absolute top-0 left-0 w-full transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? "translate-y-[72px]" : "-translate-y-full"
      } bg-white dark:bg-gray-900 shadow-lg md:hidden p-4 rounded-b-lg`}
    >
      <div className="flex justify-center gap-10 items-center">
        <ChessTheme />
        <ThemeToggle />
        {status === "loading" ? (
          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-500 animate-pulse" />
        ) : session ? (
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"ghost"} size="sm" className="mr-2">
                  <UserPlus className="w-6 h-6" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] max-sm:w-[300px] rounded-lg">
                <DialogHeader>
                  <DialogTitle>Find Friends</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <UserSearch />
                  <div className="border-t pt-4">
                    <FriendsList />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger>
                <div className="flex items-center gap-2">
                  <Image
                    src={session.user?.image || "/default-avatar.png"}
                    width={36}
                    height={36}
                    className="rounded-full"
                    alt="Profile"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] max-sm:w-[300px] rounded-lg">
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-2">
                    <div className="flex items-center gap-2">
                      <Image
                        src={session.user?.image || "/default-avatar.png"}
                        width={50}
                        height={50}
                        className="rounded-full"
                        alt="Profile"
                      />
                      <div>
                        <p className="font-medium line-clamp-1">
                          {session.user?.name}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="self-start sm:self-center">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 w-full md:w-auto justify-center"
            onClick={() => signIn()}
          >
            <RiLoginCircleLine className="w-6 h-6" />
            <span>Sign In</span>
          </Button>
        )}
      </div>
    </div>
  );
}
