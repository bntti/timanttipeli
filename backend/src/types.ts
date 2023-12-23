import { z } from 'zod';

const PointsCardSchema = z.object({
    type: z.literal('points'),
    value: z.number().int().positive()
});
const RelicCardSchema = z.object({
    type: z.literal('relic'),
    value: z.number().int().positive()
});
const TrapCardSchema = z.object({
    type: z.literal('trap'),
    trap: z.enum(['snake', 'boulder', 'fire', 'log', 'spider'])
});

const CardSchema = z.union([PointsCardSchema, RelicCardSchema, TrapCardSchema]);

export const RoomSchema = z.union([
    z.object({
        id: z.number().int().nonnegative(),
        hidden: z.boolean(),
        name: z.string(),
        data: z.object({
            players: z.record(z.literal(0)),
            gameInProgress: z.literal(false),
            roundInProgress: z.literal(false),
            removedCards: z.array(CardSchema).length(0),
            roundsDone: z.literal(0),
            currentRound: z.literal(null)
        })
    }),
    z.object({
        id: z.number().int().nonnegative(),
        hidden: z.boolean(),
        name: z.string(),
        data: z.object({
            players: z.record(z.number().int().nonnegative()),
            gameInProgress: z.literal(true),
            roundInProgress: z.literal(false),
            removedCards: z.array(CardSchema),
            roundsDone: z.number().int().nonnegative(),
            currentRound: z.literal(null)
        })
    }),
    z.object({
        id: z.number().int().nonnegative(),
        hidden: z.boolean(),
        name: z.string(),
        data: z.object({
            players: z.record(z.number().int().nonnegative()),
            gameInProgress: z.literal(true),
            roundInProgress: z.literal(true),
            removedCards: z.array(CardSchema),
            roundsDone: z.number().int().nonnegative(),
            currentRound: z.object({
                deck: z.array(CardSchema),
                inPlay: z.array(CardSchema),
                votes: z.record(z.enum(['stay', 'leave'])),
                players: z.array(z.string()).nonempty(),
                pointsPerPlayer: z.number().int(),
                pointsOnGround: z.number().int()
            })
        })
    })
]);
export const RoomsSchema = z.array(RoomSchema);

export type RelicCard = z.infer<typeof RelicCardSchema>;
export type Card = z.infer<typeof CardSchema>;
export type Room = z.infer<typeof RoomSchema>;
export type Rooms = z.infer<typeof RoomsSchema>;