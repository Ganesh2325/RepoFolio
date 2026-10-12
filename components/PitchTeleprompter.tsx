"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, Play, Pause, RotateCcw, Copy, Check, Volume2 } from "lucide-react";

interface PitchTeleprompterProps {
  pitchScript: string;
  projectTitle?: string;
}

export default function PitchTeleprompter({
  pitchScript,
  projectTitle,
}: PitchTeleprompterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // 45s target duration
  const targetDuration = 45;

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= targetDuration) {
            setIsPlaying(false);
            return targetDuration;
          }
          return prev + 1;
        });

        // Smooth scroll teleprompter text
        if (textRef.current) {
          textRef.current.scrollTop += 1.5;
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setSeconds(0);
    if (textRef.current) {
      textRef.current.scrollTop = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pitchScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTextToSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(pitchScript);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPlaying(false);
      };
      setIsSpeaking(true);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const progressPercent = Math.min((seconds / targetDuration) * 100, 100);

  return (
    <div className="rounded-xl border border-[#2A2A2F] bg-[#121214] p-6 shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#222226]">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#1E1E22] border border-[#2A2A2F] flex items-center justify-center text-[#FAFAFA]">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#FAFAFA] flex items-center space-x-2">
              <span>45-Second Pitch Script</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#17171A] text-[#A1A1AA] border border-[#2A2A2F]">
                Teleprompter
              </span>
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              Practice presenting {projectTitle || "your project"} out loud in 45 seconds.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {typeof window !== "undefined" && "speechSynthesis" in window && (
            <button
              onClick={handleTextToSpeech}
              className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center space-x-1.5 ${
                isSpeaking
                  ? "bg-[#FAFAFA] text-[#111111] border-[#FAFAFA]"
                  : "bg-[#17171A] hover:bg-[#1E1E22] text-[#A1A1AA] hover:text-[#FAFAFA] border-[#2A2A2F]"
              }`}
              title={isSpeaking ? "Stop Speaking" : "Play Text-to-Speech"}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isSpeaking ? "Pause Audio" : "Listen"}</span>
            </button>
          )}

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 px-3 rounded-lg bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#111111] text-xs font-semibold transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#111111]" /> : <Play className="w-3.5 h-3.5 text-[#111111]" />}
            <span>{isPlaying ? "Pause" : "Start Pitch"}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-[#17171A] hover:bg-[#1E1E22] border border-[#2A2A2F] text-[#A1A1AA] hover:text-[#FAFAFA] text-xs transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-[#17171A] hover:bg-[#1E1E22] border border-[#2A2A2F] text-[#A1A1AA] hover:text-[#FAFAFA] text-xs transition-colors"
            title="Copy script"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Progress Bar & Timer */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-[#A1A1AA] mb-1.5 font-mono">
          <span>Target Pace: 45s</span>
          <span className="text-[#FAFAFA] font-semibold">
            {seconds}s / {targetDuration}s
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#222226] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FAFAFA] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Teleprompter Script Card */}
      <div
        ref={textRef}
        className="max-h-48 overflow-y-auto p-4 rounded-xl bg-[#101012] border border-[#2A2A2F] text-sm sm:text-base leading-relaxed text-[#FAFAFA] select-text scroll-smooth"
      >
        <p className="whitespace-pre-wrap">{pitchScript}</p>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-[#71717A]">
        <span>Tip: Speak naturally, maintaining eye contact and clear pacing.</span>
        <span>~120 words</span>
      </div>
    </div>
  );
}
