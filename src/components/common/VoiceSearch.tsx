import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic } from 'lucide-react';
import toast from 'react-hot-toast';

interface ISpeechRecognitionEvent extends Event {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ISpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface VoiceSearchProps {
  onTranscript: (transcript: string) => void;
  className?: string;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({
  onTranscript,
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event: ISpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          // Remove trailing punctuation and aggressively trim whitespace
          const sanitizedTranscript = transcript
            .trim()
            .replace(/[.,!?;:]+$/, '')
            .trim();
          onTranscript(sanitizedTranscript);
        }
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: ISpeechRecognitionErrorEvent) => {
        if (event.error === 'not-allowed') {
          toast.error('Microphone permission denied');
        } else {
          toast.error('Voice search failed. Try again.');
        }
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognitionInstance;
    }
  }, [onTranscript]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error('Voice search is not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        recognitionRef.current.stop();
      }
    }
  }, [isListening]);

  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`relative p-2 rounded-lg transition-all duration-300 ${
        isListening
          ? 'bg-red-50 text-red-500 ring-2 ring-red-200 animate-pulse'
          : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
      } ${className}`}
      title={isListening ? 'Stop Listening' : 'Search by Voice'}
    >
      {isListening ? (
        <div className="relative">
          <Mic size={18} className="animate-bounce" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </div>
      ) : (
        <Mic size={18} />
      )}
    </button>
  );
};

export default VoiceSearch;
