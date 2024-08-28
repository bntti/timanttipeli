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
export const CardSchema = z.union([PointsCardSchema, RelicCardSchema, TrapCardSchema]);

export type RelicCard = z.infer<typeof RelicCardSchema>;
export type TrapCard = z.infer<typeof TrapCardSchema>;
export type Card = z.infer<typeof CardSchema>;
