import { z } from 'zod';

export const orderSchema = z
  .object({
    customer_id: z.number().min(1, 'El cliente es obligatorio'),
    user_id: z.number().min(1, 'El ingeniero es obligatorio'),
    comments: z.string().optional().or(z.literal('')),
    quote_id: z.string().optional().or(z.literal('')),
    type_income: z.enum(['delivery', 'domicile', 'lab'], {
      errorMap: () => ({ message: 'El tipo de ingreso es obligatorio' }),
    }),
    delivery: z
      .object({
        delivery_parcel: z.string().min(1, 'La paquetería es obligatoria'),
        code: z.string().min(1, 'El código de rastreo es obligatorio'),
      })
      .optional(),
    equipments: z
      .array(
        z.object({
          equipment_cat_id: z.string().min(1, 'El equipo es obligatorio'),
          brand_cat_id: z.string().min(1, 'La marca es obligatoria'),
          model: z.string().min(1, 'El modelo es obligatorio'),
          serial_number: z.string().min(1, 'El número de serie es obligatorio'),
          failure: z.string().min(1, 'La falla es obligatoria'),
        })
      )
      .min(1, 'Debe agregar al menos un equipo'),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.type_income === 'delivery' && !data.delivery) {
      ctx.addIssue({
        path: ['delivery'],
        code: z.ZodIssueCode.custom,
        message: 'La información de la paquetería es obligatoria cuando el ingreso es por delivery',
      });
    }

    if (data.type_income !== 'delivery' && data.delivery) {
      ctx.addIssue({
        path: ['delivery'],
        code: z.ZodIssueCode.custom,
        message: 'No debe proporcionarse información de paquetería si el ingreso no es delivery',
      });
    }
  });
