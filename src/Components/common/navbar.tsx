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

export function Navbar() {
  const pathname = usePathname();
  const roomID = pathname?.split("/").pop() || "";
  const { data: session } = useSession();

  return (
    <div className="w-full fixed pt-2 backdrop-blur-md z-50">
      <MaxWidthWrapper className="w-full flex justify-between p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" width={40} height={40} alt="logo" />
          <Link href="/" className="text-lg font-bold">
            ChessMate
          </Link>
        </div>
        <div className="flex gap-2 justify-center items-center">
          {pathname?.startsWith("/online-multiplayer/room/") && (
            <Chat roomId={roomID} />
          )}
          <ChessTheme />
          <ThemeToggle />
          {session ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => signOut()}
              >
                <Image
                  src={session.user?.image || "/default-avatar.png"}
                  width={32}
                  height={32}
                  className="rounded-full"
                  alt="Profile"
                />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
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
