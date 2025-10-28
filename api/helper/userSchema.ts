import { z } from 'zod';

export const userCreateSchema = z.object({
    Name: z.string().min(7),
    Roll: z.string(),
    Birthday: z.string(),
});

export const taskCreateSchema = z.object({
    TasksName: z.string(),
    TasksDescription: z.string().min(8),
    TasksStatus: z.string(),
});
