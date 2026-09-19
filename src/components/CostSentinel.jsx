import React, { useState } from "react";
import confetti from "canvas-confetti";
import { 
  DollarSign, 
  TrendingDown, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon, 
  Code, 
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { COST_LEAKS_LIST, METRICS_SUMMARY } from "../data/mockAwsData";

export default function CostSentinel({ onGoToChatWithRemediation }) {
  const [leaks, setLeaks] = useState(COST_LEAKS_LIST);
  const [remediatedIds, setRemediatedIds] = useState([]);
  const [isRemediatingAll, setIsRemediatingAll] = useState(false);
  const [remediationProgress, setRemediationProgress] = useState(0);
  const [remediationStep, setRemediationStep] = useState("");
  const [selectedLeakForCode, setSelectedLeakForCode] = useState(null);

  // Calculate dynamic savings based on remediated items
  const remediatedSavings = leaks
    .filter((l) => remediatedIds.includes(l.id))
    .reduce((sum, item) => sum + item.potentialMonthlySavings, 0);

  const activeSavingsTotal = METRICS_SUMMARY.monthlySavings + remediatedSavings;

  const chartData = [
    { name: "EC2 Compute", current: 1420, optimized: 310 },
    { name: "EBS Volumes", current: 220, optimized: 0 },
    { name: "NAT Gateway", current: 135, optimized: 0 },
    { name: "S3 Storage", current: 310, optimized: 45 },
    { name: "RDS Aurora", current: 840, optimized: 490 },
  ];

  // One-Click Auto Remediation with Confetti
  const handleExecuteAllRemediations = () => {
    setIsRemediatingAll(true);
    setRemediationProgress(10);
    setRemediationStep("Connecting to AWS Bedrock Console Agent...");

    setTimeout(() => {
      setRemediationProgress(40);
      setRemediationStep("Downsizing EC2 App Fleet to AWS Graviton3 (t4g.large)...");
    }, 1200);

    setTimeout(() => {
      setRemediationProgress(70);
      setRemediationStep("Snapshotting & removing orphan EBS gp3 volumes...");
    }, 2400);

    setTimeout(() => {
      setRemediationProgress(90);
      setRemediationStep("Enabling S3 Glacier Deep Archive lifecycle policy...");
    }, 3600);

    setTimeout(() => {
      setRemediationProgress(100);
      setRemediationStep("All AWS Cost Leaks Remediated Successfully!");
      setRemediatedIds(leaks.map((l) => l.id));
      setIsRemediatingAll(false);

      // Trigger Celebration Confetti safely
      try {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#ff9900", "#10b981", "#00f0ff", "#a855f7"]
          });
        }
      } catch (e) {
        console.warn("Confetti animation skipped:", e);
      }
    }, 4800);
  };

  const handleRemediateSingle = (id) => {
    if (!remediatedIds.includes(id)) {
      setRemediatedIds([...remediatedIds, id]);
      try {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.7 },
          });
        }
      } catch (e) {
        console.warn("Confetti animation skipped:", e);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Baseline vs Optimized Card */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/40 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              Identified Monthly Savings
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono mb-1">
            ${activeSavingsTotal.toLocaleString()}/mo
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-slate-400 line-through">${METRICS_SUMMARY.monthlySpendBaseline.toLocaleString()}</span>
            <ArrowRight className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-400 font-bold">${METRICS_SUMMARY.monthlySpendOptimized.toLocaleString()}</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
              -{METRICS_SUMMARY.savingsPercent}%
            </span>
          </div>
        </div>

        {/* Remediated Items Counter */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-white/10 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase">
              Auto-Remediated Leaks
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400 font-mono">
            {remediatedIds.length} / {leaks.length}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {remediatedIds.length === leaks.length ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Remediated on AWS
              </span>
            ) : (
              <span>{leaks.length - remediatedIds.length} leaks pending remediation</span>
            )}
          </div>
        </div>

        {/* Global Action Button */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 flex flex-col justify-between shadow-xl">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase font-mono mb-1">
              Bedrock AI Console Execution
            </div>
            <p className="text-xs text-slate-300">
              Run automated IAM script to remediate all waste items simultaneously.
            </p>
          </div>
          <button
            onClick={handleExecuteAllRemediations}
            disabled={isRemediatingAll || remediatedIds.length === leaks.length}
            className="w-full mt-3 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <Zap className={`w-4 h-4 ${isRemediatingAll ? "animate-bounce" : ""}`} />
            <span>
              {isRemediatingAll
                ? "Executing AWS Bedrock Agent..."
                : remediatedIds.length === leaks.length
                ? "All Leaks Remediated"
                : "One-Click Auto-Remediate All Leaks"}
            </span>
          </button>
        </div>
      </div>

      {/* Remediation Progress Bar Modal */}
      {isRemediatingAll && (
        <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/50 shadow-2xl animate-pulse">
          <div className="flex items-center justify-between text-xs text-amber-300 font-mono mb-2">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              {remediationStep}
            </span>
            <span>{remediationProgress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${remediationProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Cost Comparison Chart & Waste Items Table */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recharts Bar Graph */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              AWS Service Spend Breakdown
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Current monthly run rate vs Optimized AI architecture.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0b0f19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "11px" }}
                  />
                  <Bar dataKey="current" fill="#ef4444" radius={[4, 4, 0, 0]} name="Current ($/mo)" />
                  <Bar dataKey="optimized" fill="#10b981" radius={[4, 4, 0, 0]} name="Optimized ($/mo)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-3 border-t border-white/10 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-500"></span> Current Spend
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500"></span> AI Optimized
            </span>
          </div>
        </div>

        {/* Detailed Cost Leaks Table */}
        <div className="lg:col-span-3 p-5 rounded-xl bg-slate-900/80 border border-white/10">
          <h3 className="text-sm font-bold text-white mb-1">
            Detected AWS Infrastructure Cost Leaks ({leaks.length})
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Direct action items flagged by Bedrock AI agent scanning.
          </p>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {leaks.map((leak) => {
              const isRemediated = remediatedIds.includes(leak.id);
              return (
                <div
                  key={leak.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isRemediated
                      ? "bg-emerald-950/20 border-emerald-500/30 text-slate-300"
                      : "bg-slate-950/60 border-white/10 hover:border-amber-500/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-amber-400">{leak.id}</span>
                        <span className="text-xs font-bold text-white">{leak.resourceName}</span>
                        <span className="badge badge-aws text-[9px]">{leak.service}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono text-[11px] truncate max-w-md">
                        {leak.resourceId}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-400">Potential Savings</div>
                      <div className="text-sm font-bold text-emerald-400 font-mono">
                        +${leak.potentialMonthlySavings}/mo
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-white/5 mb-3 leading-relaxed">
                    <strong className="text-amber-400">AI Recommendation:</strong> {leak.recommendation}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={() => setSelectedLeakForCode(selectedLeakForCode?.id === leak.id ? null : leak)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>{selectedLeakForCode?.id === leak.id ? "Hide Terraform" : "View Terraform Snippet"}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {isRemediated ? (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 px-3 py-1 rounded bg-emerald-500/20 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Remediated
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRemediateSingle(leak.id)}
                          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20"
                        >
                          Remediate Item
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Terraform Snippet Collapse */}
                  {selectedLeakForCode?.id === leak.id && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                        <span>Terraform IaC Fix</span>
                        <button
                          onClick={() => onGoToChatWithRemediation(leak.recommendation)}
                          className="text-amber-400 hover:underline flex items-center gap-1"
                        >
                          Ask Bedrock to Deploy <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                      <pre className="code-block">{leak.terraformSnippet}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
