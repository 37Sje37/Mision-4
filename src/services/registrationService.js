import { apiPlayersListSchema, apiPlayerSchema } from '../schemas/registrationSchema';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com';

/**
 * Obtiene el listado de jugadores inscritos y valida la respuesta con Zod (safeParse).
 * Si `simulateCorrupt` es true, inyecta un dato corrupto para demostrar el Bonus.
 */
export async function fetchRegistrations({ simulateCorrupt = false } = {}) {
  const response = await fetch(`${BASE_URL}/users?_limit=6`);

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status} al obtener inscripciones`);
  }

  const rawData = await response.json();

  // Normalizamos los datos de JSONPlaceholder al formato de nuestra app
  const mappedData = rawData.map((user, index) => ({
    id: user.id,
    name: user.username || user.name,
    email: user.email,
    role: ['Top', 'Jungle', 'Mid', 'ADC', 'Support'][index % 5],
    rankPoints: (index + 1) * 125,
  }));

  // Simulación controlada para demostrar el Bonus en la defensa oral
  if (simulateCorrupt) {
    mappedData.unshift({
      id: 'ID_INVALIDO_STRING', // Debería ser number
      name: '',                   // Debería tener min(1)
      email: 'correo-roto-sin-arroba',
      role: 'Mid',
      rankPoints: -500,
    });
  }

  // Validación defensiva de la respuesta remota con safeParse
  const parsed = apiPlayersListSchema.safeParse(mappedData);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    throw new Error(
      `[Zod API Guard] Dato corrupto detectado en la respuesta del servidor: "${firstIssue.path.join('.')}" -> ${firstIssue.message}`
    );
  }

  return parsed.data;
}
export async function createRegistration(formData) {
  const payload = {
    name: formData.summonerName,
    email: formData.email,
    role: formData.role,
    rankPoints: formData.rankPoints,
    captainMode: formData.captainMode,
    teamCode: formData.teamCode || null,
  };

  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status} al registrar el jugador`);
  }

  const createdRaw = await response.json();

  // Validamos también el objeto devuelto tras el POST
  const parsed = apiPlayerSchema.safeParse({
    ...createdRaw,
    id: typeof createdRaw.id === 'number' ? createdRaw.id : Date.now(),
  });

  if (!parsed.success) {
    throw new Error('[Zod API Guard] El servidor devolvió un registro inválido tras crear.');
  }

  return parsed.data;
}