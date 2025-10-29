import React from 'react';
import { LayoutDashboard, Settings, Bell, User } from 'lucide-react';

const Header = ({ onReset }) => {
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white grid place-items-center shadow">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">QueueMaster Pro</h1>
            <p className="text-sm text-neutral-500">Business portal for advanced queuing</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            title="Reset demo data"
          >
            <Bell size={16} className="text-neutral-500" />
            Reset Demo
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50" title="Settings">
            <Settings size={16} />
          </button>
          <div className="h-9 w-9 rounded-full bg-neutral-200 grid place-items-center text-neutral-700">
            <User size={16} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
