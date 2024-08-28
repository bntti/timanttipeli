import { z } from 'zod';

import { CardSchema } from './card';

export const SettingsSchema = z.object({
    voteShowTime: z.union([z.literal(0), z.number().int().gt(99)]),
    voteShowTime1: z.union([z.literal(0), z.number().int().gt(99)]),
    cardTime: z.union([z.literal(0), z.number().int().gt(99)]),
    cardTime1: z.union([z.literal(0), z.number().int().gt(99)]),
    afterVoteTime: z.union([z.literal(0), z.number().int().gt(99)]),
});

const RoomBaseSchema = z.object({
    id: z.number().int().nonnegative(),
    hidden: z.boolean(),
    name: z.string(),
    settings: SettingsSchema,
});

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

export type Settings = z.infer<typeof SettingsSchema>;
export type Room = z.infer<typeof RoomSchema>;
export type Rooms = z.infer<typeof RoomsSchema>;
