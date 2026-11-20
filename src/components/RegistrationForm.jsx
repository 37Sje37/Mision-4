import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registrationSchema } from '../schemas/registrationSchema';
import { createRegistration } from '../services/registrationService';

export function RegistrationForm({ onOptimisticAdd }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: 'onBlur',
    defaultValues: {
      summonerName: '',
      email: '',
      role: 'Mid',
      rankPoints: 0,
      captainMode: false,
      teamCode: '',
      acceptRules: false,
    },
  });

  const isCaptain = watch('captainMode');

  const mutation = useMutation({
    mutationFn: createRegistration,
    onSuccess: (newPlayer) => {
      // Invalidamos la query key para sincronizar con el servidor
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      // Añadimos localmente para feedback visual inmediato con JSONPlaceholder
      if (onOptimisticAdd) onOptimisticAdd(newPlayer);
      reset();
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <section className="card" aria-labelledby="form-heading">
      <h2 id="form-heading">Inscripción al Torneo</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Campo 1: Tag de jugador */}
        <div className="field">
          <label htmlFor="summonerName">Player Tag *</label>
          <input
            id="summonerName"
            type="text"
            placeholder="Ej: Faker#KR1"
            aria-invalid={!!errors.summonerName}
            aria-describedby={errors.summonerName ? 'summonerName-error' : undefined}
            {...register('summonerName')}
          />
          {errors.summonerName && (
            <span id="summonerName-error" className="error-msg" role="alert">
              {errors.summonerName.message}
            </span>
          )}
        </div>

        {/* Campo 2: Correo electrónico */}
        <div className="field">
          <label htmlFor="email">Correo de contacto *</label>
          <input
            id="email"
            type="email"
            placeholder="jugador@arena.gg"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <span id="email-error" className="error-msg" role="alert">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Campo 3: Rol (Select nativo sin Controller) */}
        <div className="field">
          <label htmlFor="role">Posición principal *</label>
          <select
            id="role"
            aria-invalid={!!errors.role}
            aria-describedby={errors.role ? 'role-error' : undefined}
            {...register('role')}
          >
            <option value="Top">Top</option>
            <option value="Jungle">Jungle</option>
            <option value="Mid">Mid</option>
            <option value="ADC">ADC</option>
            <option value="Support">Support</option>
          </select>
          {errors.role && (
            <span id="role-error" className="error-msg" role="alert">
              {errors.role.message}
            </span>
          )}
        </div>

        {/* Campo 4: Puntos de liga */}
        <div className="field">
          <label htmlFor="rankPoints">Puntos actuales (LP) *</label>
          <input
            id="rankPoints"
            type="number"
            aria-invalid={!!errors.rankPoints}
            aria-describedby={errors.rankPoints ? 'rankPoints-error' : undefined}
            {...register('rankPoints')}
          />
          {errors.rankPoints && (
            <span id="rankPoints-error" className="error-msg" role="alert">
              {errors.rankPoints.message}
            </span>
          )}
        </div>

        {/* Campo 5: Checkbox Capitán (activa refinamiento condicional) */}
        <div className="field checkbox-field">
          <input id="captainMode" type="checkbox" {...register('captainMode')} />
          <label htmlFor="captainMode">Me inscribo como Capitán de equipo</label>
        </div>

        {isCaptain && (
          <div className="field">
            <label htmlFor="teamCode">Código del equipo *</label>
            <input
              id="teamCode"
              type="text"
              placeholder="Ej: T1-2026"
              aria-invalid={!!errors.teamCode}
              aria-describedby={errors.teamCode ? 'teamCode-error' : undefined}
              {...register('teamCode')}
            />
            {errors.teamCode && (
              <span id="teamCode-error" className="error-msg" role="alert">
                {errors.teamCode.message}
              </span>
            )}
          </div>
        )}

        {/* Campo 6: Aceptación de reglas */}
        <div className="field checkbox-field">
          <input
            id="acceptRules"
            type="checkbox"
            aria-invalid={!!errors.acceptRules}
            aria-describedby={errors.acceptRules ? 'acceptRules-error' : undefined}
            {...register('acceptRules')}
          />
          <label htmlFor="acceptRules">Acepto la normativa oficial de la competición *</label>
        </div>
        {errors.acceptRules && (
          <span id="acceptRules-error" className="error-msg" role="alert">
            {errors.acceptRules.message}
          </span>
        )}

        {/* Estados de envío (UX: carga / error / éxito) */}
        <button type="submit" disabled={isSubmitting || mutation.isPending}>
          {mutation.isPending ? 'Registrando en servidor...' : 'Confirmar inscripción'}
        </button>

        {mutation.isError && (
          <div className="banner banner-error" role="alert">
            Error al enviar: {mutation.error.message}
          </div>
        )}

        {mutation.isSuccess && (
          <div className="banner banner-success" role="status">
            Inscripción registrada y validada correctamente.
          </div>
        )}
      </form>
    </section>
  );
}