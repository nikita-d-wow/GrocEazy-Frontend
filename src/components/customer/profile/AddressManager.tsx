import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, MapPin, Edit2, Trash2, CheckCircle, Star } from 'lucide-react';

import type { AppDispatch } from '../../../redux/store';
import type { IAddress, IUser } from '../../../redux/types/authTypes';
import {
  addAddress,
  updateAddress,
  deleteAddress,
} from '../../../redux/actions/profileActions';

import AddressModal from './AddressModal';

interface AddressManagerProps {
  user: IUser;
}

export default function AddressManager({ user }: AddressManagerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleSave = async (addressData: Partial<IAddress>) => {
    if (loadingAction) {
      return; // Prevent double submit
    }
    setLoadingAction('save');
    try {
      if (editingAddress && editingAddress._id) {
        // Merge with existing address to ensure no fields are lost
        const fullAddress = { ...editingAddress, ...addressData };

        // Strip all immutable/metadata fields to prevent backend 500 errors
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, __v, createdAt, updatedAt, ...cleanData } =
          fullAddress as any;

        await dispatch(updateAddress(editingAddress._id, cleanData));
      } else {
        await dispatch(addAddress(addressData));
      }
    } catch (error) {
      // Error handled by logic or silently ignored
    } finally {
      setLoadingAction(null);
      setIsModalOpen(false); // Close modal here only after logic runs
    }
  };

  const handleDelete = async (addressId: string) => {
    if (loadingAction) {
      return;
    }
    if (confirm('Are you sure you want to delete this address?')) {
      setLoadingAction(addressId);
      try {
        await dispatch(deleteAddress(addressId));
      } catch (error) {
        // Error handled by logic or silently ignored
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const handleSetDefault = async (address: IAddress) => {
    if (loadingAction || address.isDefault || !address._id) {
      return;
    }
    setLoadingAction(address._id);
    try {
      // Strip all immutable/metadata fields
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, __v, createdAt, updatedAt, ...cleanData } = address as any;

      await dispatch(
        updateAddress(address._id, { ...cleanData, isDefault: true })
      );
    } catch (error) {
      // Error handled by logic or silently ignored
    } finally {
      setLoadingAction(null);
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const openEditModal = (address: IAddress) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Saved Addresses</h3>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
        >
          <Plus size={16} />
          Add New Address
        </button>
      </div>

      {!user.addresses || user.addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No addresses saved yet.</p>
          <button
            onClick={openAddModal}
            className="mt-2 text-green-600 hover:text-green-700 font-medium text-sm"
          >
            Add your first address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.addresses
            .filter((address) => address && address.street && address.city) // Filter out broken addresses
            .map((address) => (
              <div
                key={address._id || Math.random()}
                className={`relative p-5 rounded-xl border shadow-sm transition-all group ${
                  address.isDefault
                    ? 'border-green-500 bg-green-50/30 ring-2 ring-green-200'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                {address.isDefault && (
                  <div className="absolute -top-3 left-4 bg-green-600 text-white flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    <CheckCircle size={12} />
                    Default Address
                  </div>
                )}

                <div className="flex items-start gap-3 mb-3 mt-2">
                  <div
                    className={`p-2 rounded-lg ${address.isDefault ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-400'}`}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {address.street}
                    </p>
                    <p className="text-sm text-gray-500">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-sm text-gray-400">{address.country}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  {!address.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(address)}
                      disabled={loadingAction === address._id}
                      className="text-xs text-gray-500 hover:text-green-600 font-medium flex items-center gap-1 transition-colors"
                    >
                      <Star size={12} />
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                      <Star size={12} fill="currentColor" />
                      Active Default
                    </span>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => openEditModal(address)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-md transition-colors border border-gray-100 hover:border-gray-200"
                    >
                      <Edit2 size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => address._id && handleDelete(address._id)}
                      disabled={loadingAction === address._id}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors border border-gray-100 hover:border-red-100"
                    >
                      {loadingAction === address._id ? (
                        <span className="w-3 h-3 border border-red-200 border-t-red-600 rounded-full animate-spin"></span>
                      ) : (
                        <Trash2 size={12} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingAddress}
      />
    </div>
  );
}
