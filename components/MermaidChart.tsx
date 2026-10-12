"use client";

import React, { useEffect, useRef, useState } from "react";
import { Copy, Check, ZoomIn, ZoomOut, RotateCcw, Code2, Eye, RefreshCw } from "lucide-react";

interface MermaidChartProps {
  chart: string;
  className?: string;
  title?: string;
  onResetChart?: (fallbackChart: string) => void;
}

export function cleanMermaidSyntax(raw: string): string {
  if (!raw) return "";
  let cleaned = raw.trim();

  // Remove markdown code fence if wrapped
  cleaned = cleaned.replace(/^```(?:mermaid)?\s*/i, "").replace(/```$/i, "").trim();

  // If no diagram type declaration, prefix with flowchart TD
  if (
    !cleaned.startsWith("flowchart") &&
    !cleaned.startsWith("graph") &&
    !cleaned.startsWith("sequenceDiagram") &&
    !cleaned.startsWith("classDiagram") &&
    !cleaned.startsWith("erDiagram")
  ) {
    cleaned = `flowchart TD\n${cleaned}`;
  }

  return cleaned;
}

const DEFAULT_FALLBACK_CHART = `flowchart TD
  User([Client User]) --> WebUI[Web Application Interface]
  WebUI --> Router[API Router & Controllers]
  Router --> Engine[Processing & Business Logic]
  Engine --> DB[(Persistent Database)]
  Engine --> External[External Services & APIs]`;

export default function MermaidChart({
  chart,
  className = "",
  title,
  onResetChart,
}: MermaidChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const sanitizedChart = cleanMermaidSyntax(chart);

    async function renderMermaid() {
      if (!sanitizedChart || typeof window === "undefined") return;

      const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

      try {
        setError(null);
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          fontFamily: "inherit",
          themeVariables: {
            darkMode: true,
            background: "#121214",
            primaryColor: "#17171A",
            primaryTextColor: "#FAFAFA",
            primaryBorderColor: "#2A2A2F",
            lineColor: "#71717A",
            secondaryColor: "#1E1E22",
            tertiaryColor: "#101012",
          },
        });

        const { svg } = await mermaid.render(uniqueId, sanitizedChart);

        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: unknown) {
        console.warn("Failed to render Mermaid diagram:", err);
        // Clean up any injected error elements created by Mermaid
        try {
          const errorElem = document.getElementById(`d${uniqueId}`);
          if (errorElem) errorElem.remove();
        } catch {
          // ignore cleanup error
        }

        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to parse Mermaid syntax. Displaying raw architecture markup."
          );
        }
      }
    }

    renderMermaid();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanMermaidSyntax(chart));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetToStandard = () => {
    if (onResetChart) {
      onResetChart(DEFAULT_FALLBACK_CHART);
    }
  };

  return (
    <div className={`relative rounded-xl border border-[#2A2A2F] bg-[#121214] overflow-hidden ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2A2A2F] bg-[#101012] text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-[#FAFAFA]">
            {title || "Architecture Flow"}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#17171A] text-[#A1A1AA] border border-[#2A2A2F]">
            Mermaid.js
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-[#A1A1AA]">
          <button
            onClick={() => setZoom((prev) => Math.min(prev + 0.15, 2))}
            title="Zoom In"
            className="p-1.5 rounded hover:bg-[#1E1E22] hover:text-[#FAFAFA] transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(prev - 0.15, 0.5))}
            title="Zoom Out"
            className="p-1.5 rounded hover:bg-[#1E1E22] hover:text-[#FAFAFA] transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            title="Reset Zoom"
            className="p-1.5 rounded hover:bg-[#1E1E22] hover:text-[#FAFAFA] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-3.5 bg-[#2A2A2F] mx-1" />
          <button
            onClick={() => setShowCode(!showCode)}
            className="p-1.5 rounded hover:bg-[#1E1E22] hover:text-[#FAFAFA] transition-colors flex items-center space-x-1"
            title={showCode ? "View Visual Chart" : "View Syntax Code"}
          >
            {showCode ? <Eye className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-[#1E1E22] hover:text-[#FAFAFA] transition-colors"
            title="Copy Mermaid Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {showCode ? (
        <div className="p-4 bg-[#101012] font-mono text-xs text-[#FAFAFA] overflow-x-auto max-h-96">
          <pre>{cleanMermaidSyntax(chart)}</pre>
        </div>
      ) : error ? (
        <div className="p-6 text-center">
          <div className="text-[#F59E0B] text-xs font-semibold mb-2">
            Notice: Syntax error in Mermaid markup. Showing raw text view.
          </div>
          <pre className="p-4 bg-[#101012] border border-[#2A2A2F] rounded-lg text-left text-xs font-mono text-[#A1A1AA] overflow-x-auto max-h-60 mb-3">
            {chart}
          </pre>
          {onResetChart && (
            <button
              onClick={handleResetToStandard}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#111111] text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Standard Architecture Flow</span>
            </button>
          )}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="p-6 overflow-auto flex items-center justify-center min-h-[260px] bg-[#121214]"
        >
          {svgContent ? (
            <div
              style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
              className="transition-transform duration-150 select-none max-w-full"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <div className="flex items-center space-x-2 text-xs text-[#71717A] animate-pulse">
              <span>Rendering architecture flow...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
