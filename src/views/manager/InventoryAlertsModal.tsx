import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { X, Bell, Mail, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface InventoryAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryAlertsModal: FC<InventoryAlertsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSave = () => {
    // This is where we would call the backend API to save settings
    // For now, we'll just mock it
    toast.success('Alert settings saved successfully');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl animate-scaleIn overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
              <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-xl font-bold text-text">Stock Alerts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X size={20} className="text-muted-text" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Configure when you want to be notified about low stock levels.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label
                className="text-text font-medium cursor-pointer"
                htmlFor="email-toggle"
              >
                Email Notifications
              </label>
              <div
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
                  emailAlerts ? 'bg-green-500' : 'bg-gray-300'
                }`}
                onClick={() => setEmailAlerts(!emailAlerts)}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                    emailAlerts ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>

            {emailAlerts && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-text mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-text" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manager@groceazy.com"
                    className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-text placeholder:text-muted-text"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Global Low Stock Threshold
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <span className="font-mono font-bold text-text bg-muted px-3 py-1 rounded-lg min-w-[3rem] text-center">
                  {lowStockThreshold}
                </span>
              </div>
              <p className="text-xs text-muted-text mt-1">
                Products with stock below this level will trigger an alert.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-text font-medium hover:bg-card hover:shadow-sm border border-transparent hover:border-border rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm shadow-green-600/20 transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
