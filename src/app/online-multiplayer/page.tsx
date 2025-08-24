import Room from "@/Components/online-mode/room/room";
import type { Metadata } from "next";
import { generatePageSEO } from "@/lib/seo";

export const metadata: Metadata = generatePageSEO({
  title: "Online Multiplayer Chess",
  description:
    "Play chess online against players from around the world. Join the global chess community with real-time matchmaking, competitive games, and fair play. Find opponents and improve your chess skills.",
  image: "online.png",
  path: "online-multiplayer",
});

export default function Page() {
  return (
    <div className="min-h-screen flex justify-center items-center flex-col">
      <Room />
    </div>
  );
}
