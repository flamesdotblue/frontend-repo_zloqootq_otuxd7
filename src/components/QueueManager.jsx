import React, { useMemo, useState } from 'react';
import { Plus, RefreshCw, CheckCircle, Clock } from 'lucide-react';

const priorities = [
  { value: 'normal', label: 'Normal' },
  { value: 'priority', label: 'Priority' },
  { value: 'urgent', label: 'Urgent' },
];

const QueueManager = ({ tickets, setTickets, counters, setCounters, onServe }) => {
  const [name, setName] = useState('');
  const [service, setService] = useState('General');
  const [priority, setPriority] = useState('normal');

  const nextNumber = useMemo(() => {
    const last = tickets.reduce((max, t) => Math.max(max, t.number), 0);
    return last + 1;
  }, [tickets]);

  const addTicket = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newTicket = {
      id: crypto.randomUUID(),
      number: nextNumber,
      customer: name.trim(),
      service,
      priority,
      status: 'waiting',
      createdAt: Date.now(),
    };
    setTickets(prev => [...prev, newTicket]);
    setName('');
  };

  const assignToCounter = (ticketId, counterId) => {
    setCounters(prev => prev.map(c => c.id === counterId ? { ...c, current: ticketId } : c));
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'serving', startedAt: Date.now() } : t));
  };

  const waitingTickets = useMemo(() => {
    const weight = (p) => (p === 'urgent' ? 3 : p === 'priority' ? 2 : 1);
    return tickets
      .filter(t => t.status === 'waiting')
      .sort((a, b) => weight(b.priority) - weight(a.priority) || a.createdAt - b.createdAt);
  }, [tickets]);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Queue</h2>
          <button
            onClick={() => {
              // Auto-assign next ticket to first free counter
              const free = counters.find(c => !c.current);
              const next = waitingTickets[0];
              if (free && next) assignToCounter(next.id, free.id);
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
          >
            <RefreshCw size={16} />
            Auto-assign
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {waitingTickets.length === 0 && (
            <div className="col-span-1 md:col-span-2 p-6 border border-dashed rounded-xl text-center text-neutral-500">
              No customers waiting.
            </div>
          )}
          {waitingTickets.map((t) => (
            <div key={t.id} className="p-4 rounded-xl border border-neutral-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Ticket #{t.number}</p>
                  <p className="text-lg font-semibold text-neutral-900">{t.customer}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    t.priority === 'urgent'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : t.priority === 'priority'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-neutral-50 text-neutral-700 border border-neutral-200'
                  }`}
                >
                  {t.priority}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Clock size={14} />
                  <span>
                    {Math.max(1, Math.round((Date.now() - t.createdAt) / 60000))} min waiting
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {counters.filter(c => !c.current).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => assignToCounter(t.id, c.id)}
                      className="px-2.5 py-1.5 rounded-lg border border-neutral-200 text-sm hover:bg-neutral-50"
                    >
                      Send to {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-neutral-200 bg-white">
          <h3 className="text-base font-semibold text-neutral-900">New ticket</h3>
          <form onSubmit={addTicket} className="mt-4 space-y-3">
            <div>
              <label className="block text-sm text-neutral-600 mb-1">Customer name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Jane Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Service</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none"
                >
                  <option>General</option>
                  <option>Billing</option>
                  <option>Support</option>
                  <option>Onboarding</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none"
                >
                  {priorities.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Plus size={16} />
              Add to queue
            </button>
          </form>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white">
          <h3 className="text-base font-semibold text-neutral-900 mb-3">Service counters</h3>
          <div className="space-y-3">
            {counters.map((c) => {
              const ticket = c.current ? tickets.find(t => t.id === c.current) : null;
              return (
                <div key={c.id} className="p-3 rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-neutral-900">{c.name}</p>
                    {ticket ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Serving #{ticket.number}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-neutral-50 text-neutral-700 border border-neutral-200">
                        Idle
                      </span>
                    )}
                  </div>
                  {ticket && (
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm text-neutral-600">
                        {ticket.customer} · {ticket.service}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onServe(ticket.id, c.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
                        >
                          <CheckCircle size={14} /> Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QueueManager;
