import assert from 'assert';

import express, { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { processRequestBody } from 'zod-express-middleware';

import { handleVotes, startGame, startRound } from './logic';
import { Room } from './types';

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
    app.get('/api/rooms', (req, res) => {
        res.json(rooms);
    });

    app.post('/api/createRoom', (req, res) => {
        const data = z
            .object({
                name: z.string()
            })
            .parse(req.body);

        const roomId = Object.keys(rooms).length;
        rooms.push({
            id: roomId,
            hidden: false,
            name: data.name,
            data: {
                players: {},
                gameInProgress: false,
                roundInProgress: false,
                removedCards: [],
                roundsDone: 0,
                currentRound: null
            }
        });
        res.json(roomId);
    });

    app.get('/api/room/:roomId', roomIdValid, (req: Request, res) => {
        const roomId = parseInt(req.params.roomId);
        if (!(roomId in rooms)) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }

        res.json(rooms[roomId]);
    });

    app.post(
        '/api/room/:roomId/joinGame',
        gameNotInProgress,
        processRequestBody(z.object({ username: z.string() })),
        (req, res) => {
            const roomId = parseInt(req.params.roomId);
            rooms[roomId].data.players[req.body.username] = 0;
            res.json(rooms[roomId]);
        }
    );

    app.post(
        '/api/room/:roomId/leaveGame',
        gameNotInProgress,
        processRequestBody(z.object({ username: z.string() })),
        (req, res) => {
            const roomId = parseInt(req.params.roomId);
            delete rooms[roomId].data.players[req.body.username];
            res.json(rooms[roomId]);
        }
    );

    app.post('/api/room/:roomId/startGame', gameNotInProgress, (req, res) => {
        const roomId = parseInt(req.params.roomId);
        if (Object.keys(rooms[roomId].data.players).length === 0) {
            res.status(400).json({ error: 'Too few players to start' });
            return;
        }
        startGame(rooms[roomId]);
        res.json(rooms[roomId]);
    });

    app.post('/api/room/:roomId/startRound', roundNotInProgress, (req, res) => {
        const roomId = parseInt(req.params.roomId);
        startRound(rooms[roomId]);
        res.json(rooms[roomId]);
    });

    app.post(
        '/api/room/:roomId/vote',
        RoundInProgress,
        processRequestBody(
            z.object({
                username: z.string(),
                vote: z.union([z.literal('stay'), z.literal('leave'), z.null()])
            })
        ),
        (req, res) => {
            const roomId = parseInt(req.params.roomId);
            const room = rooms[roomId];
            assert(room.data.roundInProgress); // Should be unnecessary

            if (req.body.vote === null) delete room.data.currentRound.votes[req.body.username];
            else room.data.currentRound.votes[req.body.username] = req.body.vote;
            if (Object.keys(room.data.currentRound.votes).length === room.data.currentRound.players.length) {
                handleVotes(room);
            }
            res.json(room);
        }
    );

    app.delete('/api/room/:roomId', roomIdValid, (req, res) => {
        const roomId = parseInt(req.params.roomId);
        rooms[roomId].hidden = true;
        res.json(rooms[roomId]);
    });

    app.post('/api/room/:roomId/resetRoom', roomIdValid, (req, res) => {
        const roomId = parseInt(req.params.roomId);

        rooms[roomId].data = {
            players: {},
            gameInProgress: false,
            roundInProgress: false,
            removedCards: [],
            roundsDone: 0,
            currentRound: null
        };
        res.json(rooms[roomId]);
    });

    app.listen(5000);
};

runServer();
