"use client";

import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useStore } from "zustand";
import useChatStore from "@/store/useChatStore";
import { useEffect, Suspense } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Chat from "../online-mode/chat/chatbox";
import { ChessTheme } from "../themes/chess-theme";
import ThemeToggle from "../themes/theme-toggle";
import Link from "next/link";

function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const playerId = searchParams?.get("playerId") || "";
  const roomID = pathname?.split("/").pop() || "";

  const chatStore = useStore(useChatStore, (state) => state);
  const { roomId: gameId, clearMessages } = chatStore || {
    roomId: "",
    clearMessages: () => {},
  };

  useEffect(() => {
    if (gameId && gameId !== roomID) {
      clearMessages();
    }
  }, [gameId, roomID, clearMessages]);

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
            <Chat playerId={playerId} roomId={roomID} />
          )}
          <ChessTheme />
          <ThemeToggle />
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

export default function NavbarWrapper() {
  return (
    <Suspense fallback={<div>Loading navbar...</div>}>
      <Navbar />
    </Suspense>
  );
}
