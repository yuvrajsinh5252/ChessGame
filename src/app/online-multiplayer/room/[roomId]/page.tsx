import { OnlineBoard } from "@/Components/online-mode/onlineboard";
import useRoomStore from "@/store/useRoomStore";
import { useStore } from "zustand";

interface PageProps {
  params: {
    roomId: string;
  };
}

export default function page({ params }: PageProps) {
  const { roomId } = params;
  console.log(roomId);

  return <OnlineBoard />;
}
