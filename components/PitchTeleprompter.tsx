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
    <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/30 via-slate-900/60 to-purple-950/20 p-6 shadow-xl relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100 flex items-center space-x-2">
              <span>45-Second Pitch Script</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Spoken Teleprompter
              </span>
            </h3>
            <p className="text-xs text-slate-400">
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
                  ? "bg-purple-600 text-white border-purple-500"
                  : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700"
              }`}
              title={isSpeaking ? "Stop Speaking" : "Play Text-to-Speech"}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isSpeaking ? "Pause Audio" : "Listen"}</span>
            </button>
          )}

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Pause" : "Start Pitch"}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            title="Copy script"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Progress Bar & Timer */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
          <span>Target Pace: 45s</span>
          <span className="text-indigo-400 font-semibold">
            {seconds}s / {targetDuration}s
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Teleprompter Script Card */}
      <div
        ref={textRef}
        className="max-h-48 overflow-y-auto p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-sm sm:text-base leading-relaxed text-slate-200 select-text scroll-smooth"
      >
        <p className="whitespace-pre-wrap">{pitchScript}</p>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
        <span>Tip: Speak naturally, maintaining eye contact and clear pacing.</span>
        <span>~120 words</span>
      </div>
    </div>
  );
}
