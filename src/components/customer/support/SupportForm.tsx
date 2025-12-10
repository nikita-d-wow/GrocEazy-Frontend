import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';

interface FormValues {
  subject: string;
  message: string;
}

export default function SupportForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    // console.log(data);
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
            className="
              w-full mt-2 px-4 py-3 border rounded-lg bg-white
              focus:outline-none focus:border-primary shadow-sm
              transition-all duration-300 group-hover:shadow-md
            "
            placeholder="Enter subject"
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
              w-full mt-2 px-4 py-3 border rounded-lg bg-white 
              focus:outline-none focus:border-primary shadow-sm
              transition-all duration-300 group-hover:shadow-md
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
          className="
            bg-primary text-white py-3 rounded-lg font-semibold w-full
            hover:bg-primary-dark active:scale-95
            transition-all duration-300 shadow-md hover:shadow-xl
            flex items-center justify-center gap-2
          "
        >
          <Send size={18} />
          Submit Ticket
        </button>
      </form>
    </div>
  );
}
