import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchRegistrations } from '../services/registrationService';

export function RegistrationList({ localAdditions }) {
  const [simulateCorrupt, setSimulateCorrupt] = useState(false);

  const {
    data: remotePlayers = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['registrations', { simulateCorrupt }],
    queryFn: () => fetchRegistrations({ simulateCorrupt }),
    retry: false, // Desactivado para ver al instante el error de Zod en la demo
  });

  const allPlayers = [...localAdditions, ...remotePlayers];

  return (
    <section className="card" aria-labelledby="list-heading">
      <div className="list-header">
        <h2 id="list-heading">Roster Inscrito ({isError ? 0 : allPlayers.length})</h2>

        <div className="controls">
          <label className="corrupt-toggle">
            <input
              type="checkbox"
              checked={simulateCorrupt}
              onChange={(e) => setSimulateCorrupt(e.target.checked)}
            />
            Simular API corrupta (Bonus Zod)
          </label>

          <button type="button" className="btn-secondary" onClick={() => refetch()}>
            {isFetching ? 'Actualizando...' : 'Refrescar'}
          </button>
        </div>
      </div>

      {/* Estado de carga */}
      {isLoading && <p className="status-loading">Cargando participantes desde la API...</p>}

      {/* Estado de error (incluye errores capturados por Zod safeParse) */}
      {isError && (
        <div className="banner banner-error" role="alert">
          <strong>Petición bloqueada:</strong> {error.message}
        </div>
      )}

      {/* Listado válido */}
      {!isLoading && !isError && (
        <ul className="roster-list">
          {allPlayers.map((player) => (
            <li key={player.id} className="roster-item">
              <div>
                <strong>{player.name}</strong>
                <span className="badge">{player.role}</span>
                <p className="muted">{player.email}</p>
              </div>
              <span className="lp-tag">{player.rankPoints} LP</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}