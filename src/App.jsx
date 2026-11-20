import { useState } from 'react';
import { RegistrationForm } from './components/RegistrationForm';
import { RegistrationList } from './components/RegistrationList';

export default function App() {
  const [localAdditions, setLocalAdditions] = useState([]);

  const handleOptimisticAdd = (newPlayer) => {
    setLocalAdditions((prev) => [{ ...newPlayer, id: Date.now() }, ...prev]);
  };

  return (
    <main className="container">
      <header className="app-header">
        <h1>Arena Roster · Misión M4</h1>
        <p>Registro oficial validado con React Hook Form, Zod y TanStack Query</p>
      </header>

      <div className="grid">
        <RegistrationForm onOptimisticAdd={handleOptimisticAdd} />
        <RegistrationList localAdditions={localAdditions} />
      </div>
    </main>
  );
}