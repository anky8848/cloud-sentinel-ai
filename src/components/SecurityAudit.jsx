import React, { useState } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  FileCode, 
  Copy, 
  Check, 
  AlertTriangle, 
  ExternalLink, 
  Terminal,
  Cpu,
  Layers,
  Sparkles
} from "lucide-react";
import { SECURITY_VULNERABILITIES, METRICS_SUMMARY } from "../data/mockAwsData";

export default function SecurityAudit({ onSendToBedrockChat }) {
  const [vulnerabilities, setVulnerabilities] = useState(SECURITY_VULNERABILITIES);
  const [selectedVuln, setSelectedVuln] = useState(vulnerabilities[0]);
  const [codeFormat, setCodeFormat] = useState("Terraform"); // "Terraform", "CloudFormation", "CDK"
  const [copied, setCopied] = useState(false);

  const complianceScores = [
    { title: "AWS Well-Architected", score: 84, color: "text-amber-400", bar: "bg-amber-500" },
    { title: "SOC 2 Type II Security", score: 88, color: "text-emerald-400", bar: "bg-emerald-500" },
    { title: "NIS 2 European Directive", score: 92, color: "text-cyan-400", bar: "bg-cyan-500" },
    { title: "CIS AWS Foundations", score: 91, color: "text-purple-400", bar: "bg-purple-500" },
  ];

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate code dynamically based on format
  const getCodeSnippet = (vuln, format) => {
    if (format === "CloudFormation") {
      return vuln.cloudFormationCode;
    } else if (format === "CDK") {
      return `import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

// Auto-generated AWS CDK Security Remediation for ${vuln.id}
export class RemediationStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Enforce Zero-Trust Security Policy
    const secureSg = new ec2.SecurityGroup(this, 'SecureSG', {
      vpc,
      description: 'Bedrock AI Managed Security Group - Closed Ingress',
      allowAllOutbound: true
    });
  }
}`;
    } else {
      // Terraform default
      return `# AWS Bedrock AI Terraform Remediation Plan for ${vuln.id}
# Target Resource: ${vuln.affectedResource}

resource "aws_security_group_rule" "restricted_ssh" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["10.0.0.0/16"] # Restricted to internal VPC Bastion CIDR
  security_group_id = "sg-0941ab209f"
}

resource "aws_kms_key" "rds_kms_key" {
  description             = "KMS Encryption Key for Aurora Postgres"
  deletion_window_in_days = 10
  enable_key_rotation     = true
}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Compliance Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceScores.map((c) => (
          <div key={c.title} className="p-4 rounded-xl bg-slate-900/80 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
              <span>{c.title}</span>
              <span className={`font-bold ${c.color}`}>{c.score}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5 mb-2">
              <div className={`h-full ${c.bar} transition-all duration-1000`} style={{ width: `${c.score}%` }}></div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {c.score > 90 ? "PASSED Compliance" : "Action Recommended"}
            </div>
          </div>
        ))}
      </div>

      {/* Main Audit Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Vulnerabilities List (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                AWS Security Findings & Violations ({vulnerabilities.length})
              </h3>
              <p className="text-xs text-slate-400">
                Audited against CIS AWS Foundations & NIS2 standards.
              </p>
            </div>
            <span className="badge badge-danger text-[10px]">3 Critical</span>
          </div>

          <div className="space-y-3">
            {vulnerabilities.map((v) => {
              const isSelected = selectedVuln?.id === v.id;
              let severityBadge = "badge-danger";
              if (v.severity === "HIGH") severityBadge = "badge-warning";
              if (v.severity === "MEDIUM") severityBadge = "badge-aws";

              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVuln(v)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-slate-800/90 border-amber-400 ring-1 ring-amber-400/50 shadow-xl"
                      : "bg-slate-950/60 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-amber-400">{v.id}</span>
                        <span className={`badge ${severityBadge} text-[9px]`}>{v.severity}</span>
                        <span className="text-xs font-mono text-slate-400">CVSS {v.cvssScore}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{v.title}</h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-2 font-mono text-[11px] truncate">
                    Target: {v.affectedResource}
                  </p>

                  <div className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded-lg border border-white/5 leading-relaxed">
                    <strong className="text-slate-400">Impact:</strong> {v.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Remediation Inspector & Code Generator (5 Cols) */}
        {selectedVuln && (
          <div className="lg:col-span-5 p-5 rounded-xl bg-slate-900/95 border border-white/10 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">{selectedVuln.id}</span>
                  <h3 className="text-sm font-bold text-white">{selectedVuln.title}</h3>
                </div>
                <span className="badge badge-aws text-[10px]">{selectedVuln.framework}</span>
              </div>

              {/* Remediation Details */}
              <div className="space-y-3 mb-4">
                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300">
                  <strong className="block text-amber-400 font-mono text-[10px] uppercase mb-1">
                    AI Remediation Strategy
                  </strong>
                  {selectedVuln.remediationPlan}
                </div>

                {/* Code Format Switcher */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">Generate Infrastructure Code:</span>
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-white/10">
                    {["Terraform", "CloudFormation", "CDK"].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setCodeFormat(fmt)}
                        className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                          codeFormat === fmt
                            ? "bg-amber-500 text-slate-950"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generated Code Snippet */}
                <div className="relative">
                  <pre className="code-block text-[11px] max-h-56 overflow-y-auto">
                    {getCodeSnippet(selectedVuln, codeFormat)}
                  </pre>
                  <button
                    onClick={() => handleCopyCode(getCodeSnippet(selectedVuln, codeFormat))}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-all text-xs flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px] font-mono">{copied ? "Copied!" : "Copy Code"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => onSendToBedrockChat(`Please execute automated remediation for ${selectedVuln.id}: ${selectedVuln.title}`)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask Bedrock AI to Deploy Fix</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
