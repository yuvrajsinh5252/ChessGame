"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Chat from "../online-mode/chat/chatbox";
import { ChessTheme } from "../themes/chess-theme";
import ThemeToggle from "../themes/theme-toggle";
import Link from "next/link";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { HamburgerMenu } from "./HamburgerMenu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export function Navbar() {
  const pathname = usePathname();
  const roomID = pathname?.split("/").pop() || "";
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-full fixed pt-2 backdrop-blur-md z-50">
      <MaxWidthWrapper className="w-full flex flex-col md:flex-row justify-between p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" width={40} height={40} alt="logo" />
            <Link href="/" className="text-lg font-bold">
              ChessMate
            </Link>
          </div>
          <HamburgerMenu
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>

        <div
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row gap-4 md:gap-2 items-center mt-4 md:mt-0 transition-all duration-200 ease-in-out`}
        >
          {pathname?.startsWith("/online-multiplayer/room/") && (
            <Chat roomId={roomID} />
          )}
          <ChessTheme />
          <ThemeToggle />
          {status === "loading" ? (
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-500 animate-pulse" />
          ) : session ? (
            <Dialog>
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
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Profile</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src={session.user?.image || "/default-avatar.png"}
                      width={50}
                      height={50}
                      className="rounded-full"
                      alt="Profile"
                    />
                    <div>
                      <p className="font-medium">{session.user?.name}</p>
                      <p className="text-sm text-gray-500">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                  <Button variant="destructive" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 w-full md:w-auto justify-center"
              onClick={() => signIn("github")}
            >
              <GitHubLogoIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Sign In with GitHub</span>
            </Button>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
