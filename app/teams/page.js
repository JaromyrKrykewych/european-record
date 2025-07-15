'use client';

import { useState, useEffect } from 'react';
import { Combobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  // const [data, setData] = useState(null);
  const [h2h, setH2h] = useState(null);
  const [loading, setLoading] = useState(false);

  // Traer lista de equipos al cargar
  useEffect(() => {
    fetch('/api/teams')
      .then((response) => response.json())
      .then(setTeams)
      .catch((error) => console.error('Error fetching teams:', error));
  }, []);

  const handleSearch = () => {
    if (!teamA || !teamB || teamA === teamB) return;

    setLoading(true);
    fetch(
      `/api/head-to-head?teamA=${encodeURIComponent(
        teamA
      )}&teamB=${encodeURIComponent(teamB)}`
    )
      .then((response) => response.json())
      .then(setH2h)
      .finally(() => setLoading(false));
  };

  return (
    <main className='flex flex-col items-center gap-8 p-8'>
      <h1 className='text-3xl font-bold'>Head-to-Head</h1>

      <div className='w-full max-w-lg grid gap-4'>
        <Combobox
          options={teams}
          value={teamA}
          onValueChange={setTeamA}
          placeholder='Elige Equipo A'
          filter={(q, opt) => opt.toLowerCase().includes(q.toLowerCase())}
        />
        <Combobox
          options={teams.filter((t) => t !== teamA)}
          value={teamB}
          onValueChange={setTeamB}
          placeholder='Elige Equipo B'
          filter={(q, opt) => opt.toLowerCase().includes(q.toLowerCase())}
        />

        <Button
          disabled={!teamA || !teamB || teamA === teamB}
          onClick={handleSearch}
          className='w-full'
        >
          Buscar
        </Button>
      </div>

      {loading && <p>Cargando…</p>}

      {h2h && !loading && (
        <>
          <h2 className='text-xl font-semibold'>
            {teamA} vs {teamB} — Global {h2h.headToHead}
          </h2>

          <div className='overflow-x-auto w-full max-w-3xl'>
            <table className='w-full text-sm border-collapse'>
              <thead>
                <tr className='border-b'>
                  <th className='p-2 text-left'>Temp</th>
                  <th className='p-2 text-left'>Comp</th>
                  <th className='p-2 text-left'>Ronda</th>
                  <th className='p-2 text-left'>Local</th>
                  <th className='p-2 text-left'>Visitante</th>
                  <th className='p-2 text-left'>Res</th>
                </tr>
              </thead>
              <tbody>
                {h2h.matches.map((m, i) => (
                  <tr key={i} className='odd:bg-muted/40'>
                    <td className='p-2'>{m.season}</td>
                    <td className='p-2'>{m.competition}</td>
                    <td className='p-2'>{m.instance}</td>
                    <td className='p-2'>{m.home}</td>
                    <td className='p-2'>{m.away}</td>
                    <td className='p-2'>{m.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
};

export default TeamsPage;
