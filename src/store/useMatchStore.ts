import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MatchState {
  isMatchmaking: boolean;
  playerId: string;
  setMatchMaking: (status: boolean) => void;
  setPlayerId: (id: string) => void;
}

const useMatchStore = create<MatchState>()(
  persist(
    (set) => ({
      isMatchmaking: false,
      playerId: "",
      setMatchMaking: (status: boolean) => set({ isMatchmaking: status }),
      setPlayerId: (id: string) => set({ playerId: id }),
    }),
    {
      name: "match-storage",
    }
  )
);

export default useMatchStore;
