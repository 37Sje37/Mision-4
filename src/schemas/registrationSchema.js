import { z } from 'zod';

// 1. Esquema del formulario (Cliente -> API)
export const registrationSchema = z
  .object({
    summonerName: z
      .string()
      .min(3, 'El tag del jugador debe tener al menos 3 caracteres')
      .max(20, 'El tag no puede superar los 20 caracteres')
      .regex(/^[a-zA-Z0-9_#]+$/, 'Solo se permiten letras, números, "_" y "#"'),
    email: z
      .string()
      .min(1, 'El correo electrónico es obligatorio')
      .email('Introduce un formato de correo electrónico válido'),
    role: z.enum(['Top', 'Jungle', 'Mid', 'ADC', 'Support'], {
      errorMap: () => ({ message: 'Selecciona un rol válido de la lista' }),
    }),
    rankPoints: z.coerce
      .number({ invalid_type_error: 'Debes introducir un número de LP' })
      .int('Los puntos deben ser un número entero')
      .min(0, 'Los puntos no pueden ser negativos')
      .max(2000, 'El máximo permitido es 2000 LP'),
    captainMode: z.boolean().default(false),
    teamCode: z.string().optional(),
    acceptRules: z.literal(true, {
      errorMap: () => ({ message: 'Debes aceptar la normativa del torneo' }),
    }),
  })
 
  .refine(
    (data) => {
      if (data.captainMode) {
        return data.teamCode && data.teamCode.trim().length >= 4;
      }
      return true;
    },
    {
      message: 'Como capitán, debes indicar un código de equipo de al menos 4 caracteres',
      path: ['teamCode'],
    }
  )
  // Refinamiento 2: Evitar nombres reservados
  .refine((data) => data.summonerName.toLowerCase() !== 'admin', {
    message: 'El nombre "admin" está reservado por la organización',
    path: ['summonerName'],
  });

// 2. Esquema para validar la respuesta de la API (BONUS: safeParse)
export const apiPlayerSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'El servidor devolvió un nombre vacío'),
  email: z.string().email('El servidor devolvió un email corrupto'),
  role: z.string().optional().default('Flex'),
  rankPoints: z.number().nonnegative().optional().default(100),
});

export const apiPlayersListSchema = z.array(apiPlayerSchema);