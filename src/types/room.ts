export interface RoomState {
  roomId: string | null;
  isCreating: boolean;
  isJoining: boolean;
  createRoom: () => void;
  joinRoom: (id: string) => void;
  leaveRoom: () => void;
}
