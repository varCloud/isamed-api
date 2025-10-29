import {z} from 'zod';
export const reminderSchmema = z.object({
    remindable_id: z.number().int(),
    remindable_type: z.enum(['Order', 'Repair_report']),
    content: z.string().min(1, { message: 'El contenido es requerido.' }),
    remind_at: z.string().refine(date => new Date(date) > new Date(), {
        message: 'La fecha de recordatorio debe ser futura.',
    }),
})