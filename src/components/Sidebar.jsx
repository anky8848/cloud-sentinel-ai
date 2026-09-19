import React from "react";
import { 
  Network, 
  DollarSign, 
  ShieldAlert, 
  MessageSquareCode, 
  CheckCircle, 
  FileText,
  Award,
  Zap
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    {
      id: "topology",
      label: "Architecture Graph",
      subLabel: "Live Node Topology",
      icon: Network,
      badge: "Interactive",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    },
    {
      id: "cost",
      label: "Cost & Waste Leak",
      subLabel: "70% Savings Engine",
      icon: DollarSign,
      badge: "-$3,430/mo",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    },
    {
      id: "security",
      label: "Security Audit",
      subLabel: "Well-Architected & IaC",
      icon: ShieldAlert,
      badge: "3 Critical",
      badgeColor: "bg-red-500/10 text-red-400 border-red-500/30",
    },
    {
      id: "chat",
      label: "Bedrock Agent Chat",
      subLabel: "Claude 3.5 Sonnet",
      icon: MessageSquareCode,
      badge: "Live AI",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    },
    {
      id: "proof",
      label: "Console Agent Proof",
      subLabel: "AWS Ship Gate Telemetry",
      icon: CheckCircle,
      badge: "PASS",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    },
    {
      id: "export",
      label: "Builder Center Export",
      subLabel: "Hackathon Entry Generator",
      icon: FileText,
      badge: "Submission",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    },
  ];

  return (
    <aside className="w-64 bg-[#0b0f19] border-r border-white/10 flex flex-col justify-between shrink-0 p-4 z-20">
      {/* Navigation Items */}
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
          Audit Dashboard Modules
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-sans text-left group ${
                isActive
                  ? "bg-slate-800/90 text-white border border-amber-500/40 shadow-lg shadow-amber-500/5"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-slate-900 text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold">{item.label}</div>
                  <div className="text-[10px] text-slate-500">{item.subLabel}</div>
                </div>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-semibold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Banner - Hackathon Status */}
      <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-300">Zero to Shipped Entry</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
          Workplace Efficiency category entry featuring live AWS console agent telemetry.
        </p>
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-white/10">
          <span>Track: <strong className="text-slate-300">Startup</strong></span>
          <span className="text-emerald-400 flex items-center gap-1 font-bold">
            <Zap className="w-3 h-3 fill-emerald-400" /> Live AWS
          </span>
        </div>
      </div>
    </aside>
  );
}
