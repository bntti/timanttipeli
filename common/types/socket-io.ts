import type { Room, Settings } from './room';

export type ServerToClientEvents = {
    rooms: (rooms: Room[]) => void;
    roomState: (roomState: { room: Room; serverTime: number }) => void;
};

export type ClientToServerEvents = {
    createRoom: (name: string, callback: (roomId: number) => void) => void;
    editRoomSettings: (roomId: number, settings: Settings) => void;
    joinRoom: (roomId: number) => void;
    leaveRoom: (roomId: number) => void;
    joinGame: (roomId: number, username: string) => void;
    leaveGame: (roomId: number, username: string) => void;
    kickPlayer: (roomId: number, username: string) => void;
    startGame: (roomId: number) => void;
    startRound: (roomId: number) => void;
    vote: (roomId: number, username: string, vote: 'stay' | 'leave' | null) => void;
    endGame: (roomId: number) => void;
    endRound: (roomId: number) => void;
    resetRoom: (roomId: number) => void;
    deleteRoom: (roomId: number) => void;
};
