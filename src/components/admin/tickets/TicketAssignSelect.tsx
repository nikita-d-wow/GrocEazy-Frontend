import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { UserCheck, ChevronDown, Check, Loader2 } from 'lucide-react';
import type { AppDispatch } from '../../../redux/store';
import { assignSupportTicket } from '../../../redux/actions/supportActions';
import type { IUser, TicketStatus } from '../../../redux/types/support.types';

interface TicketAssignSelectProps {
  ticketId: string;
  currentManager?: IUser;
  managers: IUser[];
  status: TicketStatus;
}

const TicketAssignSelect: React.FC<TicketAssignSelectProps> = ({
  ticketId,
  currentManager,
  managers,
  status,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssign = async (managerId: string) => {
    if (managerId === currentManager?._id) {
      setIsOpen(false);
      return;
    }

    setIsAssigning(true);
    try {
      await dispatch(assignSupportTicket(ticketId, managerId));
    } finally {
      setIsAssigning(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isAssigning || ['resolved', 'closed'].includes(status)}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
          transition-all duration-300
          ${
            isOpen
              ? 'bg-primary/10 text-primary shadow-sm'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
          }
          ${isAssigning || ['resolved', 'closed'].includes(status) ? 'opacity-70 cursor-not-allowed' : ''}
        `}
      >
        {isAssigning ? (
          <Loader2 size={14} className="animate-spin text-primary" />
        ) : (
          <UserCheck
            size={14}
            className={currentManager ? 'text-primary' : 'text-gray-400'}
          />
        )}
        <span className="truncate max-w-[100px]">
          {currentManager?.name || 'Assign To'}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 lg:left-auto lg:right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-[70] py-1 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-left lg:origin-top-right">
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50">
              Select Manager
            </div>
            <div className="max-h-60 overflow-y-auto">
              {managers.length === 0 ? (
                <div className="px-4 py-3 text-xs text-gray-400 italic">
                  No managers available
                </div>
              ) : (
                managers.map((manager) => (
                  <button
                    key={manager._id}
                    onClick={() => handleAssign(manager._id)}
                    className={`
                      w-full flex items-center justify-between px-4 py-2.5 text-xs text-left
                      transition-colors duration-200
                      hover:bg-primary/5 hover:text-primary
                      ${currentManager?._id === manager._id ? 'bg-primary/5 text-primary font-medium' : 'text-gray-700'}
                    `}
                  >
                    <span>{manager.name || manager.email}</span>
                    {currentManager?._id === manager._id && (
                      <Check size={14} className="text-primary" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TicketAssignSelect;
