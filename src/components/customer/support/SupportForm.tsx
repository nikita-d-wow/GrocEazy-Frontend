import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch } from '../../../redux/store';
import { createSupportTicket } from '../../../redux/actions/supportActions';
import {
  selectSupportLoading,
  selectSupportError,
} from '../../../redux/selectors/supportSelectors';

interface FormValues {
  subject: string;
  message: string;
}

export default function SupportForm() {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectSupportLoading);
  const error = useSelector(selectSupportError);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    await dispatch(createSupportTicket(data.subject, data.message));

    if (!error) {
      toast.success('Support ticket submitted successfully');
      reset();
    } else {
      toast.error(error);
    }
  };

  return (
    <div
      className="
        bg-white/70 backdrop-blur-md shadow-xl border border-gray-200
        rounded-xl p-7 animate-slideUp hover:shadow-2xl transition-all duration-300
      "
    >
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
        <Send size={20} className="text-primary" />
        Send us a Message
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Subject */}
        <div className="relative group">
          <label className="text-sm font-medium text-gray-700">Subject</label>

          <input
            {...register('subject', { required: 'Subject is required' })}
            placeholder="Enter subject"
            className="
              w-full mt-2 px-4 py-3 rounded-lg bg-white
              border border-gray-300
              focus:outline-none
              focus:border-primary
              focus:ring-2 focus:ring-primary/30
              shadow-sm transition-all duration-300
              group-hover:shadow-md
            "
          />

          {errors.subject && (
            <p className="text-red-500 text-sm mt-1 animate-fadeIn">
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="relative group">
          <label className="text-sm font-medium text-gray-700">Message</label>

          <textarea
            {...register('message', { required: 'Message cannot be empty' })}
            rows={6}
            placeholder="Describe your issue..."
            className="
              w-full mt-2 px-4 py-3 rounded-lg bg-white
              border border-gray-300
              focus:outline-none
              focus:border-primary
              focus:ring-2 focus:ring-primary/30
              shadow-sm transition-all duration-300
              group-hover:shadow-md
            "
          />

          {errors.message && (
            <p className="text-red-500 text-sm mt-1 animate-fadeIn">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="
            bg-primary text-white py-3 rounded-lg font-semibold w-full
            hover:bg-primary-dark active:scale-95
            transition-all duration-300 shadow-md hover:shadow-xl
            flex items-center justify-center gap-2
            disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
          "
        >
          <Send size={18} />
          {loading ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
}
