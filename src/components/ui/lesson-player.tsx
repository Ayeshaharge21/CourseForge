"use client";

import { useState, useRef } from "react";
import { Card } from "./card"; 
import { Button } from "./button"; 

// import { Progress } from "./progress"; 

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
}
