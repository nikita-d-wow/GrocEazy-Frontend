import { useEffect } from 'react';
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
import Input from '../../common/Input';
import TextArea from '../../common/TextArea';

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
    const success = await dispatch(
      createSupportTicket(data.subject, data.message)
    );

    if (success) {
      toast.success('Support ticket submitted successfully');
      reset();
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div
      className="
        bg-card/70 backdrop-blur-md shadow-xl border border-border
        rounded-xl p-7 animate-slideUp hover:shadow-2xl transition-all duration-300
      "
    >
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-text">
        <Send size={20} className="text-primary" />
        Send us a Message
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Subject */}
        <Input
          label="Subject"
          {...register('subject', { required: 'Subject is required' })}
          placeholder="Enter subject"
          error={errors.subject?.message}
        />

        {/* Message */}
        <TextArea
          label="Message"
          {...register('message', { required: 'Message cannot be empty' })}
          rows={6}
          placeholder="Describe your issue..."
          error={errors.message?.message}
        />

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
