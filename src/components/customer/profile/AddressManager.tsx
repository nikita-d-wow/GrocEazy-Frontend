import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, MapPin, Edit2, Trash2, CheckCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';

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
      return;
    } // Prevent double submit
    setLoadingAction('save');
    try {
      if (editingAddress && editingAddress._id) {
        // Merge with existing address to ensure no fields are lost
        const fullAddress = { ...editingAddress, ...addressData };

        // Strip all immutable/metadata fields to prevent backend 500 errors
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-unused-vars
        const { _id, __v, createdAt, updatedAt, ...cleanData } =
          fullAddress as any;

        await dispatch(updateAddress(editingAddress._id, cleanData));
      } else {
        await dispatch(addAddress(addressData));
      }
    } catch (error) {
      toast.error('Failed to save address');
      // eslint-disable-next-line no-console
      console.error('Failed to save address:', error);
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
        // eslint-disable-next-line no-console
        console.error('Failed to delete address:', error);
        toast.error('Failed to delete address');
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-unused-vars
      const { _id, __v, createdAt, updatedAt, ...cleanData } = address as any;

      await dispatch(
        updateAddress(address._id, { ...cleanData, isDefault: true })
      );
    } catch (error) {
      toast.error('Failed to set default address');
      // eslint-disable-next-line no-console
      console.error('Failed to set default:', error);
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
        <h3 className="text-lg font-semibold text-text">Saved Addresses</h3>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary-light text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium text-sm border border-primary/20"
        >
          <Plus size={16} />
          Add New Address
        </button>
      </div>

      {!user.addresses || user.addresses.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-xl border border-dashed border-border">
          <MapPin
            size={48}
            className="mx-auto text-muted-text opacity-30 mb-3"
          />
          <p className="text-muted-text">No addresses saved yet.</p>
          <button
            onClick={openAddModal}
            className="mt-2 text-primary hover:text-primary-dark font-medium text-sm"
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
                    ? 'border-primary bg-primary-light ring-2 ring-primary/10'
                    : 'border-border bg-card hover:border-muted-text/30'
                }`}
              >
                {address.isDefault && (
                  <div className="absolute -top-3 left-4 bg-primary text-white flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    <CheckCircle size={12} />
                    Default Address
                  </div>
                )}

                <div className="flex items-start gap-3 mb-3 mt-2">
                  <div
                    className={`p-2 rounded-lg ${address.isDefault ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-text opacity-50'}`}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-text">{address.street}</p>
                    <p className="text-sm text-muted-text">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-sm text-muted-text opacity-60">
                      {address.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  {!address.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(address)}
                      disabled={loadingAction === address._id}
                      className="text-xs text-muted-text hover:text-primary font-medium flex items-center gap-1 transition-colors"
                    >
                      <Star size={12} />
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-xs text-primary font-semibold flex items-center gap-1">
                      <Star size={12} fill="currentColor" />
                      Active Default
                    </span>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => openEditModal(address)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-muted-text hover:bg-muted rounded-md transition-colors border border-border"
                    >
                      <Edit2 size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => address._id && handleDelete(address._id)}
                      disabled={loadingAction === address._id}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-500/10 rounded-md transition-colors border border-border hover:border-rose-500/20"
                    >
                      {loadingAction === address._id ? (
                        <span className="w-3 h-3 border border-rose-500/20 border-t-rose-600 rounded-full animate-spin"></span>
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
