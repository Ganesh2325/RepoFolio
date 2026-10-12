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
    description: string;
  }
> = {
  recruiter: {
    label: "Recruiter / Hiring",
    sublabel: "Impact, Skills & Ownership",
    icon: Briefcase,
    description: "Emphasizes engineering trade-offs, architecture decisions, and business impact.",
  },
  client: {
    label: "Client / Freelance",
    sublabel: "Problem, Solution & ROI",
    icon: Building,
    description: "Focuses on delivered value, reliability, and business outcomes without code jargon.",
  },
  "non-technical": {
    label: "Non-Technical",
    sublabel: "Intuitive & ELI5",
    icon: HeartHandshake,
    description: "Explains the project using intuitive real-world metaphors that anyone can understand.",
  },
  judge: {
    label: "Hackathon Judge",
    sublabel: "Innovation & Execution",
    icon: Award,
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
                  ? "bg-[#FAFAFA] text-[#111111] shadow-sm font-semibold"
                  : "bg-[#121214] border border-[#2A2A2F] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3E3E46] hover:bg-[#17171A]"
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
          <button
            key={ver}
            type="button"
            onClick={() => onChange(ver)}
            className={`text-left cursor-pointer rounded-xl p-4 border transition-all duration-150 relative ${
              isSelected
                ? "bg-[#17171A] border-[#FAFAFA] ring-1 ring-[#FAFAFA]/30"
                : "bg-[#121214] border-[#2A2A2F] hover:border-[#3E3E46] hover:bg-[#17171A]/60"
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isSelected
                    ? "bg-[#FAFAFA] text-[#111111]"
                    : "bg-[#1E1E22] text-[#A1A1AA]"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#FAFAFA]">{config.label}</h4>
                <p className="text-[10px] text-[#71717A]">{config.sublabel}</p>
              </div>
            </div>
            <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
              {config.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
