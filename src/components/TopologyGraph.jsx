import React, { useState } from "react";
import { 
  Globe, 
  Zap, 
  FolderGit2, 
  Network, 
  Server, 
  Cpu, 
  BrainCircuit, 
  Layers, 
  Database, 
  Table, 
  Archive, 
  HardDrive,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  X,
  ExternalLink,
  DollarSign,
  Wrench
} from "lucide-react";
import { INFRASTRUCTURE_NODES } from "../data/mockAwsData";

const ICON_MAP = {
  Globe,
  Zap,
  FolderGit2,
  Network,
  Server,
  Cpu,
  BrainCircuit,
  Layers,
  Database,
  Table,
  Archive,
  HardDrive,
};

export default function TopologyGraph({ onSelectNodeForRemediation }) {
  const [selectedNode, setSelectedNode] = useState(INFRASTRUCTURE_NODES[4]); // EC2 node default
  const [nodes, setNodes] = useState(INFRASTRUCTURE_NODES);
  const [filterCategory, setFilterCategory] = useState("ALL");

  const categories = ["ALL", "Compute", "Database", "Storage", "Network", "AI"];

  const filteredNodes = nodes.filter(n => filterCategory === "ALL" || n.category === filterCategory);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Topology Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-white/10">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-amber-400" />
            AWS Live Infrastructure Topology Graph
          </h2>
          <p className="text-xs text-slate-400">
            Real-time interactive node visualizer. Select any resource node to inspect security telemetry & cost leaks.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                filterCategory === cat
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Area & Inspector Split */}
      <div className="flex-1 flex gap-4 min-h-[500px]">
        {/* Interactive SVG Canvas */}
        <div className="flex-1 relative rounded-xl bg-[#090d16] border border-white/10 overflow-hidden shadow-2xl p-6 flex items-center justify-center">
          {/* Background Grid Lines */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: "radial-gradient(#ff9900 1px, transparent 1px), radial-gradient(#00f0ff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              backgroundPosition: "0 0, 20px 20px"
            }}
          ></div>

          {/* Region VPC Box Overlay */}
          <div className="absolute inset-8 rounded-2xl border border-amber-500/20 bg-amber-500/[0.02] pointer-events-none p-4">
            <span className="text-[10px] font-mono font-bold text-amber-400/80 tracking-widest uppercase bg-amber-500/10 px-2 py-1 rounded border border-amber-500/30">
              AWS VPC: vpc-08a9f214 (us-east-1)
            </span>
          </div>

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {nodes.map((node) => {
              return node.connections.map((targetId) => {
                const targetNode = nodes.find((n) => n.id === targetId);
                if (!targetNode) return null;

                const isDanger = node.status === "danger" || targetNode.status === "danger";
                const isWarning = node.status === "warning" || targetNode.status === "warning";

                const strokeColor = isDanger
                  ? "#ef4444"
                  : isWarning
                  ? "#f59e0b"
                  : "#00f0ff";

                return (
                  <g key={`${node.id}-${targetId}`}>
                    <line
                      x1={`${(node.x / 1150) * 100}%`}
                      y1={`${(node.y / 520) * 100}%`}
                      x2={`${(targetNode.x / 1150) * 100}%`}
                      y2={`${(targetNode.y / 520) * 100}%`}
                      stroke={strokeColor}
                      strokeWidth="2"
                      strokeOpacity="0.4"
                      className="dash-connection"
                    />
                  </g>
                );
              });
            })}
          </svg>

          {/* Resource Nodes */}
          {filteredNodes.map((node) => {
            const IconComponent = ICON_MAP[node.icon] || Server;
            const isSelected = selectedNode?.id === node.id;
            
            let statusColor = "border-emerald-500/50 bg-emerald-950/30 text-emerald-400";
            let glowEffect = "hover:shadow-emerald-500/20";
            if (node.status === "danger") {
              statusColor = "border-red-500/80 bg-red-950/40 text-red-400 animate-pulse";
              glowEffect = "shadow-lg shadow-red-500/30";
            } else if (node.status === "warning") {
              statusColor = "border-amber-500/70 bg-amber-950/40 text-amber-400";
              glowEffect = "shadow-md shadow-amber-500/20";
            }

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{
                  left: `${(node.x / 1150) * 88}%`,
                  top: `${(node.y / 520) * 82}%`,
                }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-10 ${
                  isSelected ? "scale-115 z-20" : "hover:scale-105"
                }`}
              >
                <div
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 w-32 glass-panel ${statusColor} ${glowEffect} ${
                    isSelected ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-900/90 flex items-center justify-center border border-white/10 shadow-inner">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] font-bold text-white truncate max-w-[110px]">
                      {node.name}
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                      ${node.costMonthly}/mo
                    </div>
                  </div>

                  {/* Vulnerability Alert Badge */}
                  {node.vulnerabilities.length > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-md animate-bounce">
                      {node.vulnerabilities.length}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Node Inspector Drawer */}
        {selectedNode && (
          <div className="w-80 rounded-xl bg-slate-900/95 border border-white/10 p-5 flex flex-col justify-between shrink-0 shadow-2xl backdrop-blur-md">
            <div>
              {/* Drawer Top */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <span className="badge badge-aws text-[10px] mb-1">{selectedNode.category}</span>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {selectedNode.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">{selectedNode.type} • {selectedNode.region}</p>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status & Telemetry */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-white/10">
                  <span className="text-xs text-slate-400">Node Status</span>
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                    selectedNode.status === "danger"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : selectedNode.status === "warning"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}>
                    {selectedNode.statusText}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-white/10">
                  <span className="text-xs text-slate-400">Monthly Run Rate</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {selectedNode.costMonthly.toFixed(2)} USD
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-white/10 text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-slate-400 block mb-1 text-[10px] uppercase font-mono">Resource Specs & State</span>
                  {selectedNode.details}
                </div>
              </div>

              {/* Vulnerabilities List for Node */}
              {selectedNode.vulnerabilities.length > 0 ? (
                <div>
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    Detected Security / Cost Items ({selectedNode.vulnerabilities.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedNode.vulnerabilities.map((v) => (
                      <div key={v.id} className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/30 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-red-300">{v.id}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-500/20 text-red-400 uppercase">
                            {v.severity}
                          </span>
                        </div>
                        <p className="text-slate-300 font-medium">{v.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No vulnerabilities detected. Node is fully compliant with AWS Well-Architected rules.</span>
                </div>
              )}
            </div>

            {/* Bottom Remediation Action */}
            <div className="pt-4 border-t border-white/10 mt-4">
              <button
                onClick={() => onSelectNodeForRemediation(selectedNode)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20"
              >
                <Wrench className="w-4 h-4" />
                <span>Ask Bedrock AI to Remediate</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
