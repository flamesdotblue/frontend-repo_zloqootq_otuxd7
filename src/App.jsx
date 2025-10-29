import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import KPIStats from './components/KPIStats';
import QueueManager from './components/QueueManager';
import ActivityFeed from './components/ActivityFeed';

function seedData() {
  const now = Date.now();
  return {
    tickets: [
      { id: crypto.randomUUID(), number: 1, customer: 'Alice Johnson', service: 'General', priority: 'normal', status: 'served', createdAt: now - 60 * 60 * 1000, startedAt: now - 58 * 60 * 1000, finishedAt: now - 55 * 60 * 1000 },
      { id: crypto.randomUUID(), number: 2, customer: 'Michael Chen', service: 'Support', priority: 'priority', status: 'waiting', createdAt: now - 22 * 60 * 1000 },
      { id: crypto.randomUUID(), number: 3, customer: 'Priya Singh', service: 'Billing', priority: 'urgent', status: 'waiting', createdAt: now - 18 * 60 * 1000 },
      { id: crypto.randomUUID(), number: 4, customer: 'Daniel Rossi', service: 'General', priority: 'normal', status: 'serving', createdAt: now - 10 * 60 * 1000, startedAt: now - 5 * 60 * 1000 },
    ],
    counters: [
      { id: 'c1', name: 'Counter A', current: null },
      { id: 'c2', name: 'Counter B', current: null },
      { id: 'c3', name: 'Counter C', current: null },
    ],
  };
}

function App() {
  const [tickets, setTickets] = useState(() => seedData().tickets);
  const [counters, setCounters] = useState(() => {
    const s = seedData();
    // Pre-attach serving ticket if exists
    const serving = s.tickets.find(t => t.status === 'serving');
    return s.counters.map((c, i) => (i === 0 && serving ? { ...c, current: serving.id } : c));
  });
  const [activity, setActivity] = useState(() => [
    { id: crypto.randomUUID(), type: 'served', timestamp: Date.now() - 55 * 60 * 1000, message: 'Ticket #1 served at Counter A' },
  ]);

  const handleServe = (ticketId, counterId) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'served', finishedAt: Date.now() } : t));
    setCounters(prev => prev.map(c => c.id === counterId ? { ...c, current: null } : c));
    const t = tickets.find(x => x.id === ticketId);
    if (t) {
      setActivity(prev => [
        { id: crypto.randomUUID(), type: 'served', timestamp: Date.now(), message: `Ticket #${t.number} served at ${counters.find(c => c.id === counterId)?.name || 'Counter'}` },
        ...prev,
      ]);
    }
  };

  const resetDemo = () => {
    const s = seedData();
    setTickets(s.tickets);
    setCounters(s.counters);
    setActivity([
      { id: crypto.randomUUID(), type: 'info', timestamp: Date.now(), message: 'Demo data has been reset' },
    ]);
  };

  const pageTitle = useMemo(() => 'Advanced Queueing Portal', []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50">
      <Header onReset={resetDemo} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">{pageTitle}</h2>
            <p className="text-neutral-600">Monitor performance, manage queues, and keep your counters flowing.</p>
          </div>
        </div>

        <KPIStats tickets={tickets} counters={counters} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <QueueManager
              tickets={tickets}
              setTickets={setTickets}
              counters={counters}
              setCounters={setCounters}
              onServe={handleServe}
            />
          </div>
          <div>
            <ActivityFeed activity={activity} />
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} QueueMaster Pro — All rights reserved.
      </footer>
    </div>
  );
}

export default App;
