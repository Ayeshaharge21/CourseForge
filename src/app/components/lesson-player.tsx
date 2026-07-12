"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Maximize, 
  CheckCircle2,
  FileText,
  Download
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: number; // in seconds
  description: string;
  resources?: { name: string; url: string }[];
}

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete?: (lessonId: string) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isCompleted?: boolean;
}

export function LessonPlayer({ 
  lesson, 
  onComplete, 
  onNext, 
  onPrevious,
  isCompleted 
}: LessonPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    setCurrentTime(time);
    setProgress((time / duration) * 100);

    // Auto mark complete at 90%
    if (time / duration > 0.9 && !isCompleted) {
      onComplete?.(lesson.id);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
  };

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <Card className="overflow-hidden bg-black">
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            src={lesson.videoUrl}
            className="w-full h-full"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            controls={false}
          />
          
          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
            <div className="absolute bottom-4 left-4 right-4 space-y-3">
              <Progress value={progress} className="h-1 cursor-pointer" />
              
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => skip(-10)}>
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => skip(10)}>
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  <span className="text-sm">
                    {formatTime(currentTime)} / {formatTime(lesson.duration)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Volume2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Maximize className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Lesson Info */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{lesson.title}</h2>
            <p className="text-muted-foreground mt-2">{lesson.description}</p>
          </div>
          {isCompleted && (
            <Badge className="bg-green-500">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Completed
            </Badge>
          )}
        </div>

        {/* Resources */}
        {lesson.resources && lesson.resources.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Resources
            </h3>
            <div className="space-y-2">
              {lesson.resources.map((res) => (
                <a
                  key={res.url}
                  href={res.url}
                  target="_blank"
                  className="flex items-center gap-2 text-sm hover:underline"
                >
                  <Download className="h-4 w-4" />
                  {res.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onPrevious}>
            Previous Lesson
          </Button>
          <Button onClick={onNext}>
            Next Lesson
            <SkipForward className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Helper component
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${className}`}>{children}</div>
}