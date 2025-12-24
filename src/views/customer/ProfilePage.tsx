import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { User, MapPin, ShoppingBag } from 'lucide-react';

import type { RootState } from '../../redux/rootReducer';
import ProfileInfo from '../../components/customer/profile/ProfileInfo';
import AddressManager from '../../components/customer/profile/AddressManager';

type Tab = 'info' | 'address';

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const navigate = useNavigate();

  if (!user) {
    return null; // Should be handled by ProtectedRoute, but safe guard
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-2">
          Manage your personal information and delivery addresses
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <nav className="flex flex-row lg:flex-col">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 lg:flex-none flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-b lg:border-b-0 lg:border-l-4 ${
                  activeTab === 'info'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <User size={20} />
                Personal Info
              </button>
              <button
                onClick={() => setActiveTab('address')}
                className={`flex-1 lg:flex-none flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-b lg:border-b-0 lg:border-l-4 ${
                  activeTab === 'address'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <MapPin size={20} />
                My Addresses
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="flex-1 lg:flex-none flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-b lg:border-b-0 lg:border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <ShoppingBag size={20} />
                My Orders
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {activeTab === 'info' ? (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                  Personal Information
                </h2>
                <ProfileInfo user={user} />
              </div>
            ) : (
              <div>
                {/* Header is handled inside AddressManager for better button placement */}
                <AddressManager user={user} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
