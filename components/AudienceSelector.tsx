"use client";

import React from "react";
import { AudienceVersion } from "@/types";
import { Briefcase, Building, HeartHandshake, Award } from "lucide-react";

interface AudienceSelectorProps {
  selected: AudienceVersion;
  onChange: (audience: AudienceVersion) => void;
  variant?: "cards" | "pills";
}

export const AUDIENCE_CONFIG: Record<
  AudienceVersion,
  {
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    description: string;
  }
> = {
  recruiter: {
    label: "Recruiter / Hiring",
    sublabel: "Impact, Skills & Ownership",
    icon: Briefcase,
    accentColor: "from-blue-600 to-indigo-600 border-indigo-500/50 text-indigo-400",
    description: "Emphasizes engineering trade-offs, architecture decisions, and business impact.",
  },
  client: {
    label: "Client / Freelance",
    sublabel: "Problem, Solution & ROI",
    icon: Building,
    accentColor: "from-emerald-600 to-teal-600 border-emerald-500/50 text-emerald-400",
    description: "Focuses on delivered value, reliability, and business outcomes without code jargon.",
  },
  "non-technical": {
    label: "Non-Technical",
    sublabel: "Intuitive & ELI5",
    icon: HeartHandshake,
    accentColor: "from-amber-600 to-orange-600 border-amber-500/50 text-amber-400",
    description: "Explains the project using intuitive real-world metaphors that anyone can understand.",
  },
  judge: {
    label: "Hackathon Judge",
    sublabel: "Innovation & Execution",
    icon: Award,
    accentColor: "from-purple-600 to-pink-600 border-purple-500/50 text-purple-400",
    description: "Highlights technical novelty, rapid execution under constraints, and future scope.",
  },
};

export default function AudienceSelector({
  selected,
  onChange,
  variant = "cards",
}: AudienceSelectorProps) {
  const versions: AudienceVersion[] = ["recruiter", "client", "non-technical", "judge"];

  if (variant === "pills") {
    return (
      <div className="flex flex-wrap gap-2">
        {versions.map((ver) => {
          const config = AUDIENCE_CONFIG[ver];
          const Icon = config.icon;
          const isSelected = selected === ver;

          return (
            <button
              key={ver}
              type="button"
              onClick={() => onChange(ver)}
              className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {versions.map((ver) => {
        const config = AUDIENCE_CONFIG[ver];
        const Icon = config.icon;
        const isSelected = selected === ver;

        return (
          <div
            key={ver}
            onClick={() => onChange(ver)}
            className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 relative overflow-hidden ${
              isSelected
                ? "bg-slate-900/90 border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40"
                : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40"
            }`}
          >
            {isSelected && (
              <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-500/10 rounded-bl-full pointer-events-none" />
            )}
            <div className="flex items-center space-x-3 mb-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">{config.label}</h4>
                <p className="text-[10px] text-slate-400">{config.sublabel}</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {config.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
