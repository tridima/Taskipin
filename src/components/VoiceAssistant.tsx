'use client';

import { useState, useRef } from 'react';
import { transcribeAudio, parseCommand, ProcessedCommand } from '@/lib/voiceCommands';

interface VoiceAssistantProps {
  apiKey: string;
  onCommand: (command: ProcessedCommand) => void;
}

export default function VoiceAssistant({ apiKey, onCommand }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (!apiKey) {
      setError('Please set your OpenAI API key in settings');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        
        setIsProcessing(true);
        setError(null);

        try {
          // Transcribe audio
          const transcribedText = await transcribeAudio(audioBlob, apiKey);
          setTranscript(transcribedText);

          // Parse command
          const command = await parseCommand(transcribedText, apiKey);
          onCommand(command);

          // Clear transcript after 3 seconds
          setTimeout(() => setTranscript(null), 3000);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to process audio');
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsListening(true);
      setError(null);
    } catch (err) {
      setError('Failed to access microphone');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const getButtonClass = () => {
    if (isListening) {
      return 'bg-red-600 hover:bg-red-700 animate-pulse';
    }
    if (isProcessing) {
      return 'bg-yellow-600 cursor-wait';
    }
    return 'bg-blue-600 hover:bg-blue-700';
  };

  return (
    <div className="fixed bottom-4 left-4 flex flex-col items-start gap-2">
      {(error || transcript) && (
        <div
          className={`px-4 py-2 rounded-lg shadow-lg max-w-xs ${
            error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}
        >
          <p className="text-sm">{error || transcript}</p>
        </div>
      )}
      
      <button
        onClick={isListening ? stopRecording : startRecording}
        disabled={isProcessing}
        className={`${getButtonClass()} text-white p-4 rounded-full shadow-lg transition-colors`}
        title={
          isListening
            ? 'Stop recording'
            : isProcessing
            ? 'Processing...'
            : 'Start voice command'
        }
      >
        {isProcessing ? (
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : isListening ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="2" />
            <rect x="14" y="4" width="4" height="16" rx="2" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.5 2A2.5 2.5 0 006 4.5v7a2.5 2.5 0 005 0v-7A2.5 2.5 0 008.5 2zm4 7.5a4.5 4.5 0 01-9 0h-2a6.5 6.5 0 0012 0h-1zm-2.5 7.5v3h5v2h-12v-2h5v-3a7 7 0 01-7-7h2a5 5 0 0010 0h2a7 7 0 01-5 6.93z" />
            <circle cx="18" cy="6" r="4" />
            <path d="M18 4v4m-2-2h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}

