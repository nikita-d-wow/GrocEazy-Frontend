import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import type { IAddress } from '../../../redux/types/authTypes';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: Partial<IAddress>) => void;
    initialData?: IAddress | null;
}

export default function AddressModal({
    isOpen,
    onClose,
    onSave,
    initialData,
}: AddressModalProps) {
    const [formData, setFormData] = useState<Partial<IAddress>>({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                // Preserve _id explicitly
                _id: initialData._id,
                street: initialData.street || '',
                city: initialData.city || '',
                state: initialData.state || '',
                zipCode: initialData.zipCode || '',
                country: initialData.country || '',
                isDefault: initialData.isDefault || false,
            });
        } else {
            setFormData({
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
                isDefault: false,
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address
                        </label>
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            required
                            placeholder="123 Main St"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                placeholder="New York"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                State
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                placeholder="NY"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ZIP Code
                            </label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                required
                                placeholder="10001"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Country
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                                placeholder="USA"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            name="isDefault"
                            id="isDefault"
                            checked={formData.isDefault}
                            onChange={handleChange}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor="isDefault" className="text-sm text-gray-700">
                            Set as default address
                        </label>
                    </div>

                    <div className="flex justify-end pt-4 gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium shadow-sm"
                        >
                            <Save size={18} />
                            Save Address
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
