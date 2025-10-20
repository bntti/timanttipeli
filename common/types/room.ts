import { z } from 'zod';

import { CardSchema } from './card';

export const settingsSchema = z.object({
    allowCheats: z.boolean(),
    goldGoldGold: z.boolean(),
    voteShowTime: z.union([z.literal(0), z.number().int().gt(99)]),
    voteShowTime1: z.union([z.literal(0), z.number().int().gt(99)]),
    cardTime: z.union([z.literal(0), z.number().int().gt(99)]),
    cardTime1: z.union([z.literal(0), z.number().int().gt(99)]),
    afterVoteTime: z.union([z.literal(0), z.number().int().gt(99)]),
});

const roomBaseSchema = z.object({
    id: z.number().int().nonnegative(),
    hidden: z.boolean(),
    name: z.string(),
    settings: settingsSchema,
});

const roomSchema = z.union([
    roomBaseSchema.extend({
        data: z.object({
            players: z.record(z.string(), z.literal(0)),
            gameInProgress: z.literal(false),
            roundInProgress: z.literal(false),
            removedCards: z.array(CardSchema).length(0),
            roundsDone: z.literal(0),
            currentRound: z.literal(null),
        }),
    }),
    roomBaseSchema.extend({
        data: z.object({
            players: z.record(z.string(), z.number().int().nonnegative()),
            gameInProgress: z.literal(true),
            roundInProgress: z.literal(false),
            deckSize: z.number().int().nonnegative(),
            removedCards: z.array(CardSchema),
            roundsDone: z.number().int().nonnegative(),
            lastVote: z.record(z.string(), z.enum(['stay', 'leave'])),
            lastCard: CardSchema.nullable(),
            currentRound: z.literal(null),
        }),
    }),
    roomBaseSchema.extend({
        data: z.object({
            players: z.record(z.string(), z.number().int().nonnegative()),
            gameInProgress: z.literal(true),
            roundInProgress: z.literal(true),
            deckSize: z.number().int().nonnegative(),
            removedCards: z.array(CardSchema),
            roundsDone: z.number().int().nonnegative(),
            lastVote: z.record(z.string(), z.enum(['stay', 'leave'])),
            lastCard: CardSchema.nullable(),
            currentRound: z.object({
                deck: z.array(CardSchema),
                inPlay: z.array(CardSchema),
                votes: z.record(z.string(), z.enum(['stay', 'leave'])),
                voteEndTime: z.number().int().nonnegative().nullable(),
                players: z.array(z.string()).nonempty(),
                pointsGained: z.record(z.string(), z.number()),
                hasRelic: z.array(z.string()),
                pointsPerPlayer: z.number().int(),
                pointsOnGround: z.number().int(),
            }),
        }),
    }),
]);

export const roomResponseSchema = z.object({ room: roomSchema, serverTime: z.number().int().nonnegative() });
export const roomsSchema = z.array(roomBaseSchema);

export type Settings = z.infer<typeof settingsSchema>;
export type Room = z.infer<typeof roomSchema>;
