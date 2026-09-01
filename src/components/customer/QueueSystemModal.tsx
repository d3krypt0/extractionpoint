import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QueueTicket } from '../../types';
import { X, Users, Clock, Bell } from 'lucide-react';

interface QueueSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueSystemModal: React.FC<QueueSystemModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { queue, joinQueue, callQueueTicket, seatQueueTicket, cancelQueueTicket } = useApp();
  
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState<number>(2);
  const [preferredSection, setPreferredSection] = useState<'indoor' | 'patio' | 'any'>('any');
  const [activeUserTicket, setActiveUserTicket] = useState<QueueTicket | null>(null);

  if (!isOpen) return null;

  const waitingList = queue.filter((q) => q.status === 'waiting');
  const calledList = queue.filter((q) => q.status === 'called');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) return;

    const ticket = joinQueue({
      customerName: customerName.trim(),
      phone: phone.trim(),
      partySize,
      preferredSection,
    });

    setActiveUserTicket(ticket);
    setCustomerName('');
    setPhone('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#faf8f5] dark:bg-[#121215] rounded-2xl shadow-2xl border border-[#ded8ce] dark:border-[#26262b] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e8e2d8] dark:border-[#222226] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#c5a880]/15 text-[#9d7f57] dark:text-[#dfcca9]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#c5a880]">
                Waitlist & Queue Management
              </span>
              <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-[#f8f7f4]">
                Extraction Point Queue
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#777777] dark:text-[#999999] hover:bg-[#eae4db] dark:hover:bg-[#222226] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* Active Ticket Banner if user already joined */}
          {activeUserTicket && activeUserTicket.status !== 'seated' && activeUserTicket.status !== 'cancelled' && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#111111] to-[#252528] text-white shadow-xl border border-[#333338] relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#c5a880] text-black">
                    Your Active Queue Ticket
                  </span>
                  <h4 className="font-mono text-3xl font-black text-white mt-2">
                    {activeUserTicket.ticketNumber}
                  </h4>
                  <p className="text-xs text-gray-300 mt-1 font-medium">
                    Guest: {activeUserTicket.customerName} ({activeUserTicket.partySize} guests)
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-xs text-[#dfcca9]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est. Wait Time</span>
                  </div>
                  <div className="font-mono text-2xl font-bold text-white mt-1">
                    ~{activeUserTicket.estimatedWaitMinutes} mins
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {waitingList.findIndex((q) => q.id === activeUserTicket.id) + 1}nd in line
                  </div>
                </div>
              </div>

              {activeUserTicket.status === 'called' && (
                <div className="mt-4 p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center space-x-2 animate-pulse">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold">Your table is ready! Please proceed to the host counter.</span>
                </div>
              )}
            </div>
          )}

          {/* Join Queue Form */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#ede7dc] dark:bg-[#18181c] border border-[#ded8ce] dark:border-[#26262b]">
            <h4 className="font-serif font-bold text-sm text-[#111111] dark:text-[#f8f7f4] mb-3 flex items-center justify-between">
              <span>Get in Line / Join Waiting List</span>
              <span className="text-xs text-[#c5a880] font-mono font-normal">
                {waitingList.length} parties currently waiting
              </span>
            </h4>

            <form onSubmit={handleJoin} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#555555] dark:text-[#a0a0a5] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bea Alonzo"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#202024] border border-[#ded8ce] dark:border-[#2c2c32] text-xs text-[#111111] dark:text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#555555] dark:text-[#a0a0a5] mb-1">
                    Mobile Number (for SMS callout)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0917-xxx-xxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#202024] border border-[#ded8ce] dark:border-[#2c2c32] text-xs text-[#111111] dark:text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#555555] dark:text-[#a0a0a5] mb-1">
                    Party Size
                  </label>
                  <div className="flex items-center space-x-1.5">
                    {[1, 2, 3, 4, 5, 6, 8].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setPartySize(size)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          partySize === size
                            ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black border-[#111111]'
                            : 'bg-white dark:bg-[#202024] text-[#555555] dark:text-[#9999a0] border-[#ded8ce] dark:border-[#2c2c32]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#555555] dark:text-[#a0a0a5] mb-1">
                    Seating Preference
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['any', 'indoor', 'patio'] as const).map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setPreferredSection(sec)}
                        className={`py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                          preferredSection === sec
                            ? 'bg-[#c5a880] text-black font-bold border-[#c5a880]'
                            : 'bg-white dark:bg-[#202024] text-[#555555] dark:text-[#9999a0] border-[#ded8ce] dark:border-[#2c2c32]'
                        }`}
                      >
                        {sec}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] font-bold text-xs hover:opacity-90 active:scale-[0.99] transition-all shadow-md"
              >
                Join Waiting Queue Now
              </button>
            </form>
          </div>

          {/* Current Live Queue List (Host / Guest Transparency) */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#111111] dark:text-[#f8f7f4] mb-3">
              Live Queue Status
            </h4>
            
            {waitingList.length === 0 && calledList.length === 0 ? (
              <div className="p-6 text-center rounded-xl border border-dashed border-[#ded8ce] dark:border-[#2c2c32] text-xs text-[#777777] dark:text-[#9999a0]">
                No guests in line. Tables are currently ready for walk-ins!
              </div>
            ) : (
              <div className="space-y-2">
                {/* Called guests */}
                {calledList.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-sm text-amber-600 dark:text-amber-400">
                        {ticket.ticketNumber}
                      </span>
                      <div>
                        <div className="font-bold text-xs text-[#111111] dark:text-white">
                          {ticket.customerName} ({ticket.partySize}pax)
                        </div>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium animate-pulse">
                          🔔 Called to host counter
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => seatQueueTicket(ticket.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition-colors"
                      >
                        Seat Party
                      </button>
                    </div>
                  </div>
                ))}

                {/* Waiting guests */}
                {waitingList.map((ticket, index) => (
                  <div
                    key={ticket.id}
                    className="p-3 rounded-xl bg-white dark:bg-[#18181c] border border-[#ded8ce] dark:border-[#2a2a30] flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-xs text-[#c5a880]">
                        #{index + 1}
                      </span>
                      <span className="font-mono font-bold text-sm text-[#111111] dark:text-white">
                        {ticket.ticketNumber}
                      </span>
                      <div>
                        <div className="font-medium text-xs text-[#111111] dark:text-white">
                          {ticket.customerName}
                        </div>
                        <div className="text-[10px] text-[#777777] dark:text-[#9999a0]">
                          {ticket.partySize} guests • Pref: {ticket.preferredSection}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono text-[#888888] dark:text-[#9999a0]">
                        ~{ticket.estimatedWaitMinutes}m
                      </span>
                      <button
                        onClick={() => callQueueTicket(ticket.id)}
                        className="px-2.5 py-1 rounded-lg bg-[#c5a880] text-black font-bold text-[10px] hover:bg-[#d5baa0] transition-colors"
                      >
                        Call
                      </button>
                      <button
                        onClick={() => cancelQueueTicket(ticket.id)}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        title="Cancel ticket"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e8e2d8] dark:border-[#222226] bg-[#f5f1ea] dark:bg-[#16161a] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
