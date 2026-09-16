// oxlint-disable promise/prefer-await-to-callbacks typescript/strict-void-return
import express from 'express';
import assert from 'node:assert';
import http from 'node:http';
import { Server } from 'socket.io';

import type { ClientToServerEvents, Room, ServerToClientEvents } from '@/common/types';

import { roomIdSchema, settingsSchema, usernameSchema, voteSchema } from '@/common/types';

import { generateRoom, handleLeave, handleVotes, startGame, startRound } from './logic';

const rooms: Room[] = [];

const getRoomIdError = (roomId: number, socketRooms: Set<string> | null = null, joining: boolean = false): string => {
    if (!roomIdSchema.safeParse(roomId).success) return `Invalid room id ${roomId}`;

    if (socketRooms !== null) {
        if (!joining && socketRooms.size === 1) return 'Client not in any room';
        if (!joining && !socketRooms.has(roomId.toString())) return 'Client not in roomId';
        if (socketRooms.size > 2) {
            const badRooms = [];
            for (const room of socketRooms)
                // TODO: Use strings as room ids
                if (/^\d+$/u.test(room) && Math.trunc(Number(room)) !== roomId) badRooms.push(room);

            for (const badRoom of badRooms) socketRooms.delete(badRoom);
        }

        // TODO: Make this code more clear
        const targetRoomCount = joining ? 1 : 2;
        if (socketRooms.size !== targetRoomCount)
            return `ERROR: User has weird number of rooms (${socketRooms.size} !== ${targetRoomCount})`;
    }
    if (!(roomId in rooms)) return 'roomId not in rooms';
    return '';
};

const validateRoomId = (roomId: number, socketRooms: Set<string> | null = null, joining: boolean = false): boolean => {
    const error = getRoomIdError(roomId, socketRooms, joining);
    if (error !== '') console.warn(error);
    return error === '';
};

const runServer = (): void => {
    const app = express();
    const server = http.createServer(app);
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
        connectionStateRecovery: {},
    });
    server.listen(5000);

    io.on('connection', (socket) => {
        socket.emit('rooms', rooms);

        socket.on('createRoom', (name, callback) => {
            if (typeof callback !== 'function') return;

            const roomId = rooms.length;
            rooms.push(generateRoom(roomId, name));
            io.emit('rooms', rooms);
            callback(roomId);
        });

        socket.on('editRoomSettings', (roomId, settings) => {
            if (!validateRoomId(roomId, socket.rooms)) return;
            if (!settingsSchema.safeParse(settings).success) return;

            rooms[roomId].settings = settings;
            io.to(roomId.toString()).emit('roomState', {
                room: rooms[roomId],
                serverTime: Date.now(),
            });
        });

        socket.on('joinRoom', async (roomId) => {
            if (!validateRoomId(roomId, socket.rooms, true)) return;

            await socket.join(roomId.toString());
            socket.emit('roomState', { room: rooms[roomId], serverTime: Date.now() });
        });

        socket.on('leaveRoom', async (roomId) => {
            if (!validateRoomId(roomId, socket.rooms)) return;

            await socket.leave(roomId.toString());
        });

        socket.on('joinGame', (roomId, username) => {
            if (!validateRoomId(roomId, socket.rooms)) return;
            if (rooms[roomId].data.roundInProgress) return;
            if (typeof username !== 'string') return;

            rooms[roomId].data.players[username] = 0;

            io.to(roomId.toString()).emit('roomState', {
                room: rooms[roomId],
                serverTime: Date.now(),
            });
        });

        socket.on('leaveGame', (roomId, username) => {
            if (!validateRoomId(roomId, socket.rooms)) return;
            if (!usernameSchema.safeParse(username).success) return;

            handleLeave(rooms[roomId], username);

            io.to(roomId.toString()).emit('roomState', {
                room: rooms[roomId],
                serverTime: Date.now(),
            });
        });

        socket.on('kickPlayer', (roomId, username) => {
            if (!validateRoomId(roomId, socket.rooms)) return;
            if (!usernameSchema.safeParse(username).success) return;

            handleLeave(rooms[roomId], username);

            io.to(roomId.toString()).emit('roomState', {
                room: rooms[roomId],
                serverTime: Date.now(),
            });
        });

        socket.on('startGame', (roomId) => {
            if (!validateRoomId(roomId, socket.rooms)) return;
            if (rooms[roomId].data.gameInProgress) return;

            if (Object.keys(rooms[roomId].data.players).length === 0)
                // TODO: Return the error to the caller
                return;

            startGame(rooms[roomId]);
            io.to(roomId.toString()).emit('roomState', {
                room: rooms[roomId],
                serverTime: Date.now(),
            });
        });

        socket.on('startRound', (roomId) => {
            if (!validateRoomId(roomId, socket.rooms)) return;
            if (!rooms[roomId].data.gameInProgress || rooms[roomId].data.roundInProgress) return;
            if (Object.keys(rooms[roomId].data.players).length === 0) return;

            startRound(rooms[roomId]);
            io.to(roomId.toString()).emit('roomState', {
                room: rooms[roomId],
                serverTime: Date.now(),
            });
        });

        socket.on('vote', (roomId, username, vote) => {
            if (!validateRoomId(roomId, socket.rooms)) return;
            if (!usernameSchema.safeParse(username).success) return;
            if (!voteSchema.safeParse(vote).success) return;

            const room = rooms[roomId];
            if (!room.data.roundInProgress) return;
            if (!(username in room.data.players)) return;

            const round = room.data.currentRound;
            if (vote === null && round.voteEndTime === null)
                // TODO: Convert to a set
                // oxlint-disable-next-line typescript/no-dynamic-delete
                delete room.data.currentRound.votes[username];
            else if (vote !== null) room.data.currentRound.votes[username] = vote;

            // All votes
            if (Object.keys(round.votes).length === round.players.length)
                if (round.players.length === 1 || room.settings.afterVoteTime === 0) {
                    handleVotes(rooms[roomId]);
                } else if (round.voteEndTime === null) {
                    round.voteEndTime = Date.now() + room.settings.afterVoteTime;
                    io.to(roomId.toString()).emit('roomState', {
                        room: rooms[roomId],
                        serverTime: Date.now(),
                    });

                    // Wait delay
                    setTimeout(() => {
                        const updatedRound = rooms[roomId].data.currentRound;
                        assert.ok(updatedRound !== null);

                        updatedRound.voteEndTime = null;
                        handleVotes(rooms[roomId]);

                        io.to(roomId.toString()).emit('roomState', {
                            room: rooms[roomId],
                            serverTime: Date.now(),
                        });
                    }, room.settings.afterVoteTime);
                }

            // Don't emit during vote timer
            if (round.voteEndTime === null)
                io.to(roomId.toString()).emit('roomState', {
                    room: rooms[roomId],
                    serverTime: Date.now(),
                });
        });

        socket.on('endRound', (roomId) => {
            if (!validateRoomId(roomId, socket.rooms)) return;
            if (!rooms[roomId].data.roundInProgress) return;
            if (rooms[roomId].data.currentRound.voteEndTime !== null) return;

            handleVotes(rooms[roomId], true);

            io.to(roomId.toString()).emit('roomState', {
                room: rooms[roomId],
                serverTime: Date.now(),
            });
        });

        socket.on('endGame', (roomId) => {
            if (!validateRoomId(roomId, socket.rooms)) return;
            if (!rooms[roomId].data.gameInProgress) return;

            const players = Object.keys(rooms[roomId].data.players);
            rooms[roomId].data = generateRoom().data;
            rooms[roomId].data.players = Object.fromEntries(players.map((player) => [player, 0]));

            io.to(roomId.toString()).emit('roomState', {
                room: rooms[roomId],
                serverTime: Date.now(),
            });
        });

        socket.on('resetRoom', (roomId) => {
            if (!validateRoomId(roomId, socket.rooms)) return;

            rooms[roomId] = generateRoom(rooms[roomId].id, rooms[roomId].name);
            io.to(roomId.toString()).emit('roomState', {
                room: rooms[roomId],
                serverTime: Date.now(),
            });
        });

        socket.on('deleteRoom', (roomId) => {
            if (!validateRoomId(roomId, socket.rooms)) return;

            rooms[roomId].hidden = true;
            io.to(roomId.toString()).emit('roomState', {
                room: rooms[roomId],
                serverTime: Date.now(),
            });
            io.emit('rooms', rooms);
        });
    });
};

runServer();
