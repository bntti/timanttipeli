import { z } from 'zod';

const PointsCardSchema = z.object({
    type: z.literal('points'),
    value: z.number().int().positive(),
});
const RelicCardSchema = z.object({
    type: z.literal('relic'),
    value: z.number().int().positive(),
});
const TrapCardSchema = z.object({
    type: z.literal('trap'),
    trap: z.enum(['snake', 'boulder', 'fire', 'log', 'spider']),
});

const CardSchema = z.union([PointsCardSchema, RelicCardSchema, TrapCardSchema]);

const RoomBaseSchema = z.object({ id: z.number().int().nonnegative(), hidden: z.boolean(), name: z.string() });

const RoomSchema = z.union([
    RoomBaseSchema.extend({
        data: z.object({
            players: z.record(z.literal(0)),
            gameInProgress: z.literal(false),
            roundInProgress: z.literal(false),
            removedCards: z.array(CardSchema).length(0),
            roundsDone: z.literal(0),
            currentRound: z.literal(null),
        }),
    }),
    RoomBaseSchema.extend({
        data: z.object({
            players: z.record(z.number().int().nonnegative()),
            gameInProgress: z.literal(true),
            roundInProgress: z.literal(false),
            deckSize: z.number().int().nonnegative(),
            removedCards: z.array(CardSchema),
            roundsDone: z.number().int().nonnegative(),
            lastVote: z.record(z.enum(['stay', 'leave'])),
            lastCard: CardSchema.nullable(),
            currentRound: z.literal(null),
        }),
    }),
    RoomBaseSchema.extend({
        data: z.object({
            players: z.record(z.number().int().nonnegative()),
            gameInProgress: z.literal(true),
            roundInProgress: z.literal(true),
            deckSize: z.number().int().nonnegative(),
            removedCards: z.array(CardSchema),
            roundsDone: z.number().int().nonnegative(),
            lastVote: z.record(z.enum(['stay', 'leave'])),
            lastCard: CardSchema.nullable(),
            currentRound: z.object({
                deck: z.array(CardSchema),
                inPlay: z.array(CardSchema),
                votes: z.record(z.enum(['stay', 'leave'])),
                voteEnd: z.number().int().nonnegative().nullable(),
                players: z.array(z.string()).nonempty(),
                pointsGained: z.record(z.number()),
                hasRelic: z.array(z.string()),
                pointsPerPlayer: z.number().int(),
                pointsOnGround: z.number().int(),
            }),
        }),
    }),
]);

export const RoomResponseSchema = z.object({ room: RoomSchema, serverTime: z.number().int().nonnegative() });
export const RoomsSchema = z.array(RoomBaseSchema);
export type Rooms = z.infer<typeof RoomsSchema>;

export type RelicCard = z.infer<typeof RelicCardSchema>;
export type TrapCard = z.infer<typeof TrapCardSchema>;
export type Card = z.infer<typeof CardSchema>;
export type Room = z.infer<typeof RoomSchema>;
