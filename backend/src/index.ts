import express, { type NextFunction, type Request, type Response } from 'express';
import assert from 'node:assert';
import { z } from 'zod';
import { processRequestBody } from 'zod-express-middleware';

import { handleVotes, startGame, startRound } from './logic';
import { type Room, SettingsSchema } from './types';

const generateRoom = (id: number = -1, name: string = '-1'): Room => ({
    id,
    hidden: false,
    name,
    settings: {
        voteShowTime: 2000,
        voteShowTime1: 1000,
        cardTime: 2000,
        cardTime1: 1000,
        afterVoteTime: 5000,
    },
    data: {
        players: {},
        gameInProgress: false,
        roundInProgress: false,
        removedCards: [],
        roundsDone: 0,
        currentRound: null,
    },
});

const rooms: Room[] = [];

const roomIdValid = (req: Request, res: Response, next: NextFunction): void => {
    const roomId = parseInt(req.params.roomId);
    if (!(roomId in rooms)) {
        res.status(404).json({ error: 'Room not found' });
        return;
    }

    // req.roomId = roomId; // Attach roomId to request for later use
    next();
};

const gameNotInProgress = (req: Request, res: Response, next: NextFunction): void => {
    const roomId = parseInt(req.params.roomId);
    if (!(roomId in rooms)) {
        res.status(404).json({ error: 'Room not found' });
        return;
    }

    const room = rooms[roomId];
    if (room.data.gameInProgress) {
        res.status(400).json({ error: 'Game in progress' });
        return;
    }

    // req.roomId = roomId; // Attach roomId to request for later use
    next();
};

const RoundInProgress = (req: Request, res: Response, next: NextFunction): void => {
    const roomId = parseInt(req.params.roomId);
    if (!(roomId in rooms)) {
        res.status(404).json({ error: 'Room not found' });
        return;
    }

    const room = rooms[roomId];
    if (!room.data.gameInProgress) {
        res.status(400).json({ error: 'Round not in progress' });
        return;
    }

    // req.roomId = roomId; // Attach roomId to request for later use
    next();
};

const roundNotInProgress = (req: Request, res: Response, next: NextFunction): void => {
    const roomId = parseInt(req.params.roomId);
    if (!(roomId in rooms)) {
        res.status(404).json({ error: 'Room not found' });
        return;
    }

    const room = rooms[roomId];
    if (room.data.roundInProgress) {
        res.status(400).json({ error: 'Round in progress' });
        return;
    }

    // req.roomId = roomId; // Attach roomId to request for later use
    next();
};

const runServer = (): void => {
    const app = express();
    app.use(express.json());
    app.get('/rooms', (req, res) => {
        res.json(rooms);
    });

    app.post('/createRoom', (req, res) => {
        const data = z
            .object({
                name: z.string(),
            })
            .parse(req.body);

        const roomId = Object.keys(rooms).length;
        rooms.push(generateRoom(roomId, data.name));
        res.json(roomId);
    });

    app.get('/room/:roomId', roomIdValid, (req: Request, res) => {
        const roomId = parseInt(req.params.roomId);
        if (!(roomId in rooms)) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }

        const round = rooms[roomId].data.currentRound;
        // The +250 makes small time inaccuracies matter less // TODO: change to webSockets
        if (round?.voteEnd && round.voteEnd <= Date.now() + 250) {
            round.voteEnd = null;
            handleVotes(rooms[roomId]);
        }

        res.json({ room: rooms[roomId], serverTime: Date.now() });
    });

    app.put(`/room/:roomId/settings`, gameNotInProgress, processRequestBody(SettingsSchema), (req, res) => {
        const roomId = parseInt(req.params.roomId);
        rooms[roomId].settings = req.body;
        res.json({ room: rooms[roomId], serverTime: Date.now() });
    });

    app.post(
        '/room/:roomId/joinGame',
        gameNotInProgress,
        processRequestBody(z.object({ username: z.string() })),
        (req, res) => {
            const roomId = parseInt(req.params.roomId);
            rooms[roomId].data.players[req.body.username] = 0;
            res.json({ room: rooms[roomId], serverTime: Date.now() });
        },
    );

    app.post(
        '/room/:roomId/leaveGame',
        gameNotInProgress,
        processRequestBody(z.object({ username: z.string() })),
        (req, res) => {
            const roomId = parseInt(req.params.roomId);
            delete rooms[roomId].data.players[req.body.username];
            res.json({ room: rooms[roomId], serverTime: Date.now() });
        },
    );

    app.post('/room/:roomId/startGame', gameNotInProgress, (req, res) => {
        const roomId = parseInt(req.params.roomId);
        if (Object.keys(rooms[roomId].data.players).length === 0) {
            res.status(400).json({ error: 'Too few players to start' });
            return;
        }
        startGame(rooms[roomId]);
        res.json({ room: rooms[roomId], serverTime: Date.now() });
    });

    app.post('/room/:roomId/startRound', roundNotInProgress, (req, res) => {
        const roomId = parseInt(req.params.roomId);
        startRound(rooms[roomId]);
        res.json({ room: rooms[roomId], serverTime: Date.now() });
    });

    app.post(
        '/room/:roomId/vote',
        RoundInProgress,
        processRequestBody(
            z.object({
                username: z.string(),
                vote: z.union([z.literal('stay'), z.literal('leave'), z.null()]),
            }),
        ),
        (req, res) => {
            const roomId = parseInt(req.params.roomId);
            const room = rooms[roomId];
            assert(room.data.roundInProgress); // Should be unnecessary

            const round = room.data.currentRound;
            if (req.body.vote === null && !round.voteEnd) delete room.data.currentRound.votes[req.body.username];
            else if (req.body.vote !== null) room.data.currentRound.votes[req.body.username] = req.body.vote;

            if (Object.keys(round.votes).length === round.players.length) {
                if (round.players.length === 1 || room.settings.afterVoteTime === 0) {
                    handleVotes(rooms[roomId]);
                } else if (!round.voteEnd) {
                    round.voteEnd = Date.now() + room.settings.afterVoteTime;
                }
            }
            res.json({ room, serverTime: Date.now() });
        },
    );

    app.post('/room/:roomId/endGame', roomIdValid, (req, res) => {
        const roomId = parseInt(req.params.roomId);

        rooms[roomId].data = generateRoom().data;
        res.json({ room: rooms[roomId], serverTime: Date.now() });
    });

    app.post('/room/:roomId/resetRoom', roomIdValid, (req, res) => {
        const roomId = parseInt(req.params.roomId);

        rooms[roomId] = generateRoom(rooms[roomId].id, rooms[roomId].name);
        res.json({ room: rooms[roomId], serverTime: Date.now() });
    });

    app.delete('/room/:roomId', roomIdValid, (req, res) => {
        const roomId = parseInt(req.params.roomId);
        rooms[roomId].hidden = true;
        res.json({ room: rooms[roomId], serverTime: Date.now() });
    });

    app.listen(5000);
};

runServer();
