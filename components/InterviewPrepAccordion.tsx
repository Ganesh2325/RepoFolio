"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, CheckCircle2, MessageSquareText } from "lucide-react";

interface InterviewQuestion {
  question: string;
  talking_points?: string;
}

interface InterviewPrepAccordionProps {
  questions: InterviewQuestion[];
}

export default function InterviewPrepAccordion({ questions }: InterviewPrepAccordionProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([0]); // First item open by default
  const [practicedIndices, setPracticedIndices] = useState<number[]>([]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const togglePracticed = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setPracticedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {questions.map((q, idx) => {
        const isOpen = openIndices.includes(idx);
        const isPracticed = practicedIndices.includes(idx);

        return (
          <div
            key={idx}
            className={`rounded-xl border transition-all duration-150 overflow-hidden ${
              isOpen
                ? "bg-[#17171A] border-[#FAFAFA] ring-1 ring-[#FAFAFA]/20"
                : "bg-[#121214] border-[#2A2A2F] hover:border-[#3E3E46]"
            }`}
          >
            {/* Accordion Header */}
            <div
              onClick={() => toggleIndex(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleIndex(idx);
                }
              }}
              className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer group select-none"
            >
              <div className="flex items-start space-x-3.5 pr-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-md bg-[#1E1E22] border border-[#2A2A2F] text-[#FAFAFA] text-xs font-mono font-semibold flex items-center justify-center mt-0.5">
                  Q{idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-medium text-[#FAFAFA] transition-colors">
                    {q.question}
                  </h4>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => togglePracticed(e, idx)}
                  title={isPracticed ? "Practiced" : "Mark as practiced"}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    isPracticed
                      ? "text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20"
                      : "text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#1E1E22]"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <div className={`p-1 text-[#A1A1AA] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Accordion Body */}
            {isOpen && (
              <div className="px-5 pb-5 pt-1 border-t border-[#222226] text-xs sm:text-sm text-[#A1A1AA]">
                <div className="p-4 rounded-xl bg-[#101012] border border-[#2A2A2F] space-y-2">
                  <div className="flex items-center space-x-2 text-[#FAFAFA] font-semibold text-xs tracking-wide uppercase">
                    <MessageSquareText className="w-3.5 h-3.5 text-[#FAFAFA]" />
                    <span>Suggested Talking Points & Architecture Angle</span>
                  </div>
                  <p className="leading-relaxed text-[#A1A1AA]">
                    {q.talking_points ||
                      "Focus on technical trade-offs, why this design decision was made, scalability considerations, and real-world failure modes."}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
