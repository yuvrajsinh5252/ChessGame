"use client";

import { useSession } from "next-auth/react";
import { RiLoginCircleLine } from "react-icons/ri";
import { usePathname } from "next/navigation";
import Image from "next/image";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Chat from "../online-mode/chat/chatbox";
import { ChessTheme } from "../themes/chess-theme";
import ThemeToggle from "../themes/theme-toggle";
import Link from "next/link";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { HamBurger, HamburgerMenu } from "./HamburgerMenu";
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

export function Navbar() {
  const pathname = usePathname();
  const roomID = pathname?.split("/").pop() || "";
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
          <div className="flex items-center gap-2">
            {pathname?.startsWith("/online-multiplayer/room/") && (
              <Chat roomId={roomID} />
            )}
            <HamburgerMenu
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-2">
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

        <HamBurger
          isMobileMenuOpen={isMobileMenuOpen}
          status={status}
          session={session}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </MaxWidthWrapper>
    </div>
  );
}
