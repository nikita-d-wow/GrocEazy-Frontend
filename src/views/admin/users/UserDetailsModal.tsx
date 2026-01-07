import { X, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import type { User } from '../../../redux/types/userTypes';

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailsModal({
  user,
  isOpen,
  onClose,
}: UserDetailsModalProps) {
  if (!isOpen || !user) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-card rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text">User Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X size={20} className="text-muted-text" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Profile Summary */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary text-3xl font-bold shrink-0">
              {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-text">
                {user.name || 'No Name Provided'}
              </h3>
              <p className="text-muted-text flex items-center gap-2 mt-1">
                <Shield size={16} />
                <span className="capitalize">{user.role}</span>
              </p>
              <div className="flex gap-2 mt-3">
                {user.isActive ? (
                  <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/20">
                    Active Account
                  </span>
                ) : (
                  <span className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-xs font-semibold border border-rose-500/20">
                    Banned / Inactive
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-muted/50 rounded-2xl border border-border">
              <p className="text-xs font-semibold text-muted-text uppercase mb-2">
                Email Address
              </p>
              <div className="flex items-center gap-2 text-text font-medium break-all">
                <Mail size={18} className="shrink-0 text-muted-text" />
                {user.email}
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-2xl border border-border">
              <p className="text-xs font-semibold text-muted-text uppercase mb-2">
                Phone Number
              </p>
              <div className="flex items-center gap-2 text-text font-medium">
                <Phone size={18} className="shrink-0 text-muted-text" />
                {user.phone || 'Not Provided'}
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-2xl border border-border">
              <p className="text-xs font-semibold text-muted-text uppercase mb-2">
                Date Joined
              </p>
              <div className="flex items-center gap-2 text-text font-medium">
                <Calendar size={18} className="shrink-0 text-muted-text" />
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div>
            <h4 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-primary" /> Saved Addresses
            </h4>
            {user.addresses && user.addresses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {user.addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-border rounded-2xl hover:border-primary transition-colors bg-muted/30"
                  >
                    <p className="font-semibold text-text">{addr.fullName}</p>
                    <p className="text-sm text-muted-text mt-1">{addr.line1}</p>
                    <p className="text-sm text-muted-text">
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                    <p className="text-xs text-muted-text mt-2">
                      Phone: {addr.phone}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted rounded-2xl border border-dashed border-border text-muted-text">
                No addresses saved yet.
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-border bg-muted/50 rounded-b-3xl">
          <p className="text-xs text-center text-muted-text">
            User ID: {user._id}
          </p>
        </div>
      </div>
    </div>
  );
}
