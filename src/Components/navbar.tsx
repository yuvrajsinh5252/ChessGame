"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import MaxWidthWrapper from "./MaxWidthWrapper";
import ThemeToggle from "./themes/theme-toggle";
import Chat from "./online-mode/chat/chatbox";

export default function Navbar() {
  const pathname = usePathname();
  const playerId = pathname.split("/").pop() || "";
  const roomId = pathname.split("/").pop() || "";

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
          {pathname.startsWith("/online-multiplayer/room/") && (
            <Chat playerId={playerId} roomId={roomId} />
          )}
          <ThemeToggle />
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
