import { literal, union } from 'zod';

export const InterventionTypeSchema = union([literal('OVERPAY'), literal('UNDERPAY')]);
