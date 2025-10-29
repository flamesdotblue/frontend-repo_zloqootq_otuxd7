import React from 'react';
import { Activity, CheckCircle, Clock } from 'lucide-react';

const ActivityItem = ({ entry }) => {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-1 h-8 w-8 rounded-lg grid place-items-center text-white ${
        entry.type === 'served' ? 'bg-emerald-600' : 'bg-neutral-400'
      }`}>
        {entry.type === 'served' ? <CheckCircle size={16} /> : <Activity size={16} />}
      </div>
      <div className="flex-1 border-b border-neutral-100 pb-3">
        <p className="text-sm text-neutral-900">
          <span className="font-medium">{entry.message}</span>
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
          <Clock size={12} />
          <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

const ActivityFeed = ({ activity }) => {
  return (
    <section className="p-4 rounded-xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-neutral-900">Activity</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-neutral-50 text-neutral-700 border border-neutral-200">
          {activity.length} events
        </span>
      </div>
      <div className="space-y-4 max-h-72 overflow-auto pr-2">
        {activity.length === 0 && (
          <div className="p-6 border border-dashed rounded-xl text-center text-neutral-500">
            No recent activity.
          </div>
        )}
        {activity.map((e) => (
          <ActivityItem key={e.id} entry={e} />
        ))}
      </div>
    </section>
  );
};

export default ActivityFeed;
