import { z } from 'zod';

const pointsCardSchema = z.object({
    type: z.literal('points'),
    value: z.number().int().positive(),
});
const relicCardSchema = z.object({
    type: z.literal('relic'),
    value: z.number().int().positive(),
});
const trapCardSchema = z.object({
    type: z.literal('trap'),
    trap: z.enum(['snake', 'boulder', 'fire', 'log', 'spider']),
});
export const CardSchema = z.union([pointsCardSchema, relicCardSchema, trapCardSchema]);

export type RelicCard = z.infer<typeof relicCardSchema>;
export type TrapCard = z.infer<typeof trapCardSchema>;
export type Card = z.infer<typeof CardSchema>;
