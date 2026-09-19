import React from "react";
import { 
  ShieldCheck, 
  BrainCircuit, 
  Globe, 
  DollarSign, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles,
  Layers
} from "lucide-react";
import { AWS_ACCOUNT_INFO, METRICS_SUMMARY } from "../data/mockAwsData";

export default function Header({ selectedRegion, setSelectedRegion, onScanClick, isScanning }) {
  return (
    <header className="h-16 bg-[#0b0f19]/90 border-b border-white/10 px-6 flex items-center justify-between backdrop-blur-md z-30 relative">
      {/* Left Branding */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 border border-amber-400/40">
          <BrainCircuit className="w-6 h-6 text-slate-950 font-bold" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold font-display tracking-tight text-white flex items-center gap-2">
              CloudSentinel <span className="text-amber-400 font-extrabold text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">AI</span>
            </h1>
            <span className="badge badge-aws text-[10px]">AWS Bedrock Powered</span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-2 font-mono">
            <span>Account: <strong className="text-slate-200">{AWS_ACCOUNT_INFO.accountId}</strong></span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>Role: <strong className="text-amber-400/90">ConsoleAgentRole</strong></span>
          </p>
        </div>
      </div>

      {/* Middle Stats & Region Selector */}
      <div className="hidden lg:flex items-center gap-6">
        {/* Cost Ticker */}
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-lg bg-slate-900/80 border border-white/10">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Monthly AWS Cost Savings</div>
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
              <span>${METRICS_SUMMARY.monthlySavings.toLocaleString()}/mo</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                -{METRICS_SUMMARY.savingsPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Region Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/10">
          <Globe className="w-4 h-4 text-cyan-400" />
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            {AWS_ACCOUNT_INFO.availableRegions.map(reg => (
              <option key={reg} value={reg} className="bg-slate-900 text-slate-200">
                {reg}
              </option>
            ))}
          </select>
        </div>

        {/* Bedrock Connection Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span>Claude 3.5 Sonnet Active</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Ship Gate Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>AWS Ship Gate: VERIFIED PASS</span>
        </div>

        {/* Scan Now Button */}
        <button
          onClick={onScanClick}
          disabled={isScanning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
          <span>{isScanning ? "Scanning AWS..." : "Run AI Audit"}</span>
        </button>
      </div>
    </header>
  );
}
