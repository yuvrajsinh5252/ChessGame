"use client";

import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import MaxWidthWrapper from "./MaxWidthWrapper";
import ThemeToggle from "./themes/theme-toggle";
import Chat from "./online-mode/chat/chatbox";
import { useStore } from "zustand";
import useChatStore from "@/store/useChatStore";
import { useEffect, Suspense } from "react";

function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const playerId = searchParams?.get("playerId") || "";
  const roomId = pathname?.split("/").pop() || "";

  const chatStore = useStore(useChatStore, (state) => state);
  const { roomId: gameId, clearMessages } = chatStore || {
    roomId: "",
    clearMessages: () => {},
  };

  useEffect(() => {
    if (gameId && gameId !== roomId) {
      clearMessages();
    }
  }, [gameId, roomId, clearMessages]);

  return (
    <div className="w-full fixed pt-2 backdrop-blur-md z-50">
      <MaxWidthWrapper className="w-full flex justify-between p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" width={40} height={40} alt="logo" />
          <a href="/" className="text-lg font-bold">
            ChessMate
          </a>
        </div>
        <div className="flex gap-2 justify-center items-center">
          {pathname?.startsWith("/online-multiplayer/room/") && (
            <Chat playerId={playerId} roomId={roomId} />
          )}
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
