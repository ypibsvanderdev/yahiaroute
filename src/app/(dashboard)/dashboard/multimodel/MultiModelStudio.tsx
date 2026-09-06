"use client";

import React, { useState } from "react";
import {
  POPULAR_MODELS,
  PRESET_TEAMS,
  type MultiModelWorkflowMode,
  type MultiModelRunResult,
  type ModelMetadata,
} from "@/lib/multimodel/orchestrator";

const QUICK_PROMPTS = [
  {
    title: "⚡ High-Throughput Microservice",
    prompt: "Design a high-throughput, low-latency API gateway in TypeScript. Include error boundaries, rate limiting, and graceful fallback strategies.",
  },
  {
    title: "🛡️ Security & Threat Audit",
    prompt: "Perform a comprehensive security audit on an AI gateway handling API keys and multi-tenant proxy routing. Highlight vulnerabilities and mitigations.",
  },
  {
    title: "🧠 Complex Logic & Reasoning",
    prompt: "Analyze the trade-offs between Monolithic, Microservices, and Modular Monolith architectures for high-traffic real-time applications. Conclude with a definitive recommendation.",
  },
  {
    title: "💻 Full-Stack Auth Flow",
    prompt: "Write a production-ready Next.js 15 Server Action flow for authentication using secure HTTP-only cookies, JWT verification, and CSRF protection.",
  },
];

export default function MultiModelStudio() {
  const [mode, setMode] = useState<MultiModelWorkflowMode>("collaborative");
  const [selectedModels, setSelectedModels] = useState<string[]>([
    "anthropic/claude-3-7-sonnet",
    "openai/gpt-4o",
    "google/gemini-2.0-pro-exp",
  ]);
  const [taskPrompt, setTaskPrompt] = useState(QUICK_PROMPTS[0].prompt);
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<MultiModelRunResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Toggle model selection
  const toggleModel = (modelId: string) => {
    if (mode === "solo") {
      setSelectedModels([modelId]);
      return;
    }
    if (selectedModels.includes(modelId)) {
      if (selectedModels.length > 1) {
        setSelectedModels(selectedModels.filter((id) => id !== modelId));
      }
    } else {
      setSelectedModels([...selectedModels, modelId]);
    }
  };

  const applyTeamPreset = (team: (typeof PRESET_TEAMS)[number]) => {
    setSelectedModels(team.models);
    setMode(team.recommendedMode as MultiModelWorkflowMode);
  };

  const handleRun = async () => {
    if (!taskPrompt.trim()) return;
    setIsRunning(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/multimodel/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: taskPrompt,
          mode,
          selectedModels,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to execute multi-model workflow");
      }

      const data: MultiModelRunResult = await res.json();
      setRunResult(data);
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-full bg-bg p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 via-card to-violet-950/40 p-6 sm:p-8 shadow-warm backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-3">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              YahiaRoute Multi-Model Engine
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text-main">
              Collaborative Intelligence Studio
            </h1>
            <p className="text-sm sm:text-base text-text-muted mt-2 max-w-2xl">
              Run individual models or orchestrate multiple state-of-the-art LLMs simultaneously. Unify Claude, GPT-4o, Gemini, and DeepSeek on a single task through consensus, sequential pipelines, or debates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs uppercase tracking-wider text-text-muted block font-semibold">Active Models</span>
              <span className="text-xl font-bold text-cyan-400">{selectedModels.length} Selected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Mode Selector */}
      <div className="space-y-3">
        <label className="text-xs uppercase tracking-wider font-bold text-text-muted">
          1. Select Collaboration Workflow Mode
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            {
              id: "solo",
              icon: "⚡",
              name: "Solo (1 Model)",
              desc: "Fast direct execution with a single model",
            },
            {
              id: "collaborative",
              icon: "🤝",
              name: "Consensus Synthesis",
              desc: "Run all models in parallel & synthesize best solution",
            },
            {
              id: "pipeline",
              icon: "⛓️",
              name: "Sequential Chain",
              desc: "Architect -> Implementer -> Auditor handoff",
            },
            {
              id: "debate",
              icon: "⚔️",
              name: "AI Debate",
              desc: "Models cross-examine and critique back & forth",
            },
            {
              id: "arena",
              icon: "📊",
              name: "Side-by-Side Arena",
              desc: "Parallel benchmark comparing latency and answers",
            },
          ].map((item) => {
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setMode(item.id as MultiModelWorkflowMode);
                  if (item.id === "solo" && selectedModels.length > 1) {
                    setSelectedModels([selectedModels[0]]);
                  }
                }}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 ${
                  active
                    ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50"
                    : "border-border/60 bg-card hover:border-border hover:bg-surface/50"
                }`}
              >
                <span className="text-2xl mb-1.5">{item.icon}</span>
                <span className={`text-sm font-bold ${active ? "text-cyan-400" : "text-text-main"}`}>
                  {item.name}
                </span>
                <span className="text-xs text-text-muted mt-1 leading-snug">{item.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Model Selection Panel */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs uppercase tracking-wider font-bold text-text-muted">
            2. Choose Models {mode === "solo" ? "(Select 1 Model)" : "(Select Models to Work Together)"}
          </label>
          {/* Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-text-muted mr-1 font-medium">Quick Teams:</span>
            {PRESET_TEAMS.map((team) => (
              <button
                key={team.id}
                onClick={() => applyTeamPreset(team)}
                className="px-2.5 py-1 rounded-lg border border-border/80 bg-surface/70 hover:bg-cyan-500/10 hover:border-cyan-500/40 text-text-muted hover:text-cyan-300 font-medium transition-colors"
              >
                {team.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {POPULAR_MODELS.map((model) => {
            const isSelected = selectedModels.includes(model.id);
            return (
              <div
                key={model.id}
                onClick={() => toggleModel(model.id)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                  isSelected
                    ? "border-cyan-500/80 bg-cyan-500/10 shadow-sm ring-1 ring-cyan-500/40"
                    : "border-border/60 bg-card hover:bg-surface/60 hover:border-border"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 font-bold"
                  style={{ backgroundColor: `${model.color}20`, color: model.color }}
                >
                  {model.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-text-main truncate">{model.name}</span>
                    <input
                      type={mode === "solo" ? "radio" : "checkbox"}
                      checked={isSelected}
                      readOnly
                      className="accent-cyan-500 h-4 w-4 rounded pointer-events-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                    <span>{model.provider}</span>
                    <span>•</span>
                    <span className="uppercase text-[10px] px-1.5 py-0.2 rounded bg-border/40 font-mono">
                      {model.contextWindow}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Input Section */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs uppercase tracking-wider font-bold text-text-muted">
            3. Task & Instructions
          </label>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => setTaskPrompt(qp.prompt)}
                className="text-xs px-2.5 py-1 rounded-md border border-border bg-card hover:bg-surface text-text-muted hover:text-text-main transition-colors"
              >
                {qp.title}
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-xl border border-border bg-card p-2 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all">
          <textarea
            value={taskPrompt}
            onChange={(e) => setTaskPrompt(e.target.value)}
            rows={4}
            placeholder="Describe the task or challenge you want the models to tackle together..."
            className="w-full bg-transparent p-2 text-sm text-text-main placeholder-text-muted focus:outline-none resize-none font-sans"
          />

          <div className="flex items-center justify-between pt-2 border-t border-border/40 px-2">
            <span className="text-xs text-text-muted">
              Mode: <strong className="text-cyan-400 capitalize">{mode}</strong> with{" "}
              <strong className="text-cyan-400">{selectedModels.length}</strong> model(s)
            </span>

            <button
              onClick={handleRun}
              disabled={isRunning || !taskPrompt.trim()}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-warm transition-all duration-200 ${
                isRunning || !taskPrompt.trim()
                  ? "bg-cyan-500/50 text-white/60 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isRunning ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Coordinating Models...
                </>
              ) : (
                <>
                  <span>🚀</span> Run Collaborative Task
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Visual Workflow Pipeline DAG */}
      <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Execution Pipeline Graph</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-surface/40 overflow-x-auto">
          {/* Step 1: Input */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold">
              📝
            </div>
            <div>
              <div className="text-xs font-bold text-text-main">Prompt Input</div>
              <div className="text-[11px] text-text-muted">1 Active Task</div>
            </div>
          </div>

          <div className="hidden md:block w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-violet-500 opacity-60" />

          {/* Step 2: Participating Models */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-center">
            {selectedModels.map((mId) => {
              const m = POPULAR_MODELS.find((item) => item.id === mId);
              return (
                <div
                  key={mId}
                  className="px-3 py-1.5 rounded-lg border border-border/80 bg-surface text-xs font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <span>{m?.avatar || "🤖"}</span>
                  <span className="text-text-main font-semibold">{m?.name || mId}</span>
                  {isRunning && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping ml-1" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden md:block w-8 h-0.5 bg-gradient-to-r from-violet-500 to-emerald-500 opacity-60" />

          {/* Step 3: Synthesis Node */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
              🌟
            </div>
            <div>
              <div className="text-xs font-bold text-text-main">
                {mode === "solo" ? "Direct Output" : "Master Synthesis"}
              </div>
              <div className="text-[11px] text-text-muted">
                {mode === "solo" ? "Single Model" : "Consensus Engine"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {runResult && (
        <div className="space-y-6 pt-4">
          {/* Summary Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card">
              <span className="text-xs font-semibold text-text-muted uppercase">Execution Time</span>
              <div className="text-2xl font-black text-cyan-400 mt-1">{runResult.totalDurationMs} ms</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card">
              <span className="text-xs font-semibold text-text-muted uppercase">Total Tokens</span>
              <div className="text-2xl font-black text-violet-400 mt-1">{runResult.totalTokens.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card">
              <span className="text-xs font-semibold text-text-muted uppercase">Participating Models</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">{runResult.results.length} Models</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card">
              <span className="text-xs font-semibold text-text-muted uppercase">Workflow Mode</span>
              <div className="text-2xl font-black text-amber-400 mt-1 capitalize">{runResult.mode}</div>
            </div>
          </div>

          {/* Master Collaborative Synthesis (If Multi-Model) */}
          {runResult.synthesis && (
            <div className="p-6 sm:p-8 rounded-2xl border-2 border-cyan-500/40 bg-gradient-to-b from-cyan-950/30 via-card to-card shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-border/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-black text-lg">
                    ✨
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-text-main">Master Unified Synthesis</h2>
                    <p className="text-xs text-text-muted">
                      Synthesized from {runResult.results.map((r) => r.modelName).join(", ")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(runResult.synthesis!.masterContent)}
                  className="px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  {copied ? "✓ Copied!" : "📋 Copy Synthesis"}
                </button>
              </div>

              {/* Consensus Points Pills */}
              {runResult.synthesis.consensusSummary && (
                <div className="p-4 rounded-xl bg-surface/50 border border-border/60 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Key Consensus Points:
                  </span>
                  <ul className="space-y-1.5 text-xs text-text-muted">
                    {runResult.synthesis.consensusSummary.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Markdown Content */}
              <div className="prose prose-invert max-w-none text-sm text-text-main leading-relaxed space-y-3 whitespace-pre-line font-sans">
                {runResult.synthesis.masterContent}
              </div>
            </div>
          )}

          {/* Individual Model Output Cards */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <span>🔍</span> Individual Model Contributions
            </h3>
            <div className={`grid grid-cols-1 ${runResult.results.length > 1 ? "md:grid-cols-2" : ""} gap-4`}>
              {runResult.results.map((res, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-card p-5 space-y-3 flex flex-col justify-between shadow-sm hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-main text-sm">{res.modelName}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {res.provider}
                        </span>
                      </div>
                      <span className="text-xs text-text-muted block mt-0.5 font-medium">{res.role}</span>
                    </div>

                    <div className="text-right text-xs text-text-muted">
                      <span className="block font-mono text-cyan-400 font-semibold">{res.durationMs} ms</span>
                      <span className="block text-[11px]">{res.tokens.total} tokens</span>
                    </div>
                  </div>

                  <div className="text-xs text-text-muted leading-relaxed max-h-72 overflow-y-auto whitespace-pre-line font-mono bg-surface/40 p-3 rounded-lg border border-border/40">
                    {res.content}
                  </div>

                  {res.insights && res.insights.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1">
                      {res.insights.map((ins, iIdx) => (
                        <span
                          key={iIdx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-border/40 text-text-muted"
                        >
                          ✦ {ins}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
