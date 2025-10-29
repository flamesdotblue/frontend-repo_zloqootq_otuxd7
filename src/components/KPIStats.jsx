import React, { useMemo } from 'react';
import { Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, hint, color }) => {
  return (
    <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-neutral-900">{value}</p>
        </div>
        <div className={`h-10 w-10 rounded-lg grid place-items-center ${color} text-white`}>
          <Icon size={20} />
        </div>
      </div>
      {hint && <p className="mt-3 text-xs text-neutral-500">{hint}</p>}
    </div>
  );
};

const KPIStats = ({ tickets, counters }) => {
  const { waiting, avgWait, servedToday, overdue } = useMemo(() => {
    const waitingList = tickets.filter(t => t.status === 'waiting');
    const served = tickets.filter(t => t.status === 'served').length;
    const overdueList = waitingList.filter(t => t.priority === 'urgent');
    const waitMinutes = waitingList.length
      ? Math.round(
          waitingList.reduce((acc, t) => acc + ((Date.now() - t.createdAt) / 60000), 0) / waitingList.length
        )
      : 0;
    return {
      waiting: waitingList.length,
      avgWait: waitMinutes,
      servedToday: served,
      overdue: overdueList.length,
    };
  }, [tickets]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Users} label="Waiting" value={waiting} hint={`${counters.length} counters active`} color="bg-indigo-600" />
      <StatCard icon={Clock} label="Avg wait (min)" value={avgWait} hint="Based on current queue" color="bg-amber-500" />
      <StatCard icon={CheckCircle} label="Served today" value={servedToday} hint="Completed tickets" color="bg-emerald-600" />
      <StatCard icon={AlertCircle} label="Urgent in queue" value={overdue} hint="High-priority cases" color="bg-rose-600" />
    </section>
  );
};

export default KPIStats;
