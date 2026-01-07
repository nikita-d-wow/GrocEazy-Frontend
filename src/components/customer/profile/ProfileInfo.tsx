import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { User, Phone, Save } from 'lucide-react';

import type { AppDispatch } from '../../../redux/store';
import type { IUser } from '../../../redux/types/authTypes';
import { updateProfile } from '../../../redux/actions/profileActions';

interface ProfileInfoProps {
  user: IUser;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [phoneError, setPhoneError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'phone') {
      if (!validatePhone(value)) {
        setPhoneError(
          'Please enter a valid phone number (at least 10 digits).'
        );
      } else {
        setPhoneError('');
      }
    }
  };

  const validatePhone = (phone: string) => {
    // Remove spaces, dashes, parentheses to count digits
    const digits = phone.replace(/\D/g, '');
    // Basic check: at least 10 digits
    if (digits.length < 10) {
      return false;
    }
    // Check for invalid characters (allow digits, space, +, -, (, ))
    const validChars = /^[0-9+\-\s()]*$/;
    return validChars.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneError) {
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await dispatch(updateProfile(formData));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-muted-text" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-text"
              placeholder="Your full name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone size={18} className="text-muted-text" />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-text"
              placeholder="+1 234 567 8900"
            />
          </div>
          {phoneError && (
            <p className="text-red-500 text-xs mt-1">{phoneError}</p>
          )}
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-primary-light text-primary border border-primary/20'
                : 'bg-rose-500/10 text-rose-700 border border-rose-500/20'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving || !!phoneError}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
