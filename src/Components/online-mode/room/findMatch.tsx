import { Button } from "@/Components/ui/button";
import { leaveQueue } from "@/lib/db/online-players/search";
import { pusherClient } from "@/lib/pusher";
import useMatchStore from "@/store/useMatchStore";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function FindingMatch() {
  const { setMatchMaking, playerId } = useMatchStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (!playerId) return;
    const channel = pusherClient.subscribe(`user-${playerId}`);

    const handleMatchFound = async (data: {
      player1: string;
      player2: string;
      roomId: string;
    }) => {
      try {
        setMatchMaking(false);
        router.push(
          `/online-multiplayer/room/${data.roomId}?playerId=${playerId}`
        );
      } catch (error) {
        console.error("Error creating game:", error);
        setMatchMaking(false);
      }
    };

    const handleQueueTimeout = (data: { message: string }) => {
      setMatchMaking(false);
      console.log(data.message);
    };

    channel.bind("match-found", handleMatchFound);
    channel.bind("queue-timeout", handleQueueTimeout);
  }, [playerId, router, setMatchMaking]);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-full animate-ping"></div>
          <LoaderIcon className="animate-spin h-8 w-8 text-blue-500 dark:text-blue-400 relative z-10" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Searching for Players
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            This might take a few moments...
          </p>
        </div>
      </div>
      <Button
        onClick={() => {
          setMatchMaking(false);
          leaveQueue(playerId);
        }}
        variant="outline"
        className="w-full h-12 mt-4 border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
      >
        Cancel Matchmaking
      </Button>
    </div>
  );
}
