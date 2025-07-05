
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Square, Play, Pause, Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioNarrationRecorderProps {
  onAudioReady: (audioBlob: Blob, audioUrl: string) => void;
  existingAudioUrl?: string;
}

const AudioNarrationRecorder: React.FC<AudioNarrationRecorderProps> = ({
  onAudioReady,
  existingAudioUrl
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioUrl || null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onAudioReady(audioBlob, url);
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone"
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Please allow microphone access to record audio",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      if (audioElement.current) {
        audioElement.current.pause();
      }
      
      audioElement.current = new Audio(audioUrl);
      audioElement.current.play();
      setIsPlaying(true);
      
      audioElement.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const pauseAudio = () => {
    if (audioElement.current) {
      audioElement.current.pause();
      setIsPlaying(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      onAudioReady(file, url);
      
      toast({
        title: "Audio uploaded",
        description: "Your audio file has been added successfully"
      });
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a valid audio file",
        variant: "destructive"
      });
    }
  };

  const removeAudio = () => {
    setAudioUrl(null);
    setIsPlaying(false);
    if (audioElement.current) {
      audioElement.current.pause();
    }
    onAudioReady(new Blob(), '');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Audio Narration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <Button onClick={startRecording} variant="outline" className="flex-1">
              <Mic className="h-4 w-4 mr-2" />
              Record Narration
            </Button>
          ) : (
            <Button onClick={stopRecording} variant="destructive" className="flex-1">
              <Square className="h-4 w-4 mr-2" />
              Stop Recording ({formatTime(recordingTime)})
            </Button>
          )}
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Audio
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {audioUrl && (
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Audio Narration Ready</span>
              <Button onClick={removeAudio} variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              {!isPlaying ? (
                <Button onClick={playAudio} size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </Button>
              ) : (
                <Button onClick={pauseAudio} size="sm" variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioNarrationRecorder;
