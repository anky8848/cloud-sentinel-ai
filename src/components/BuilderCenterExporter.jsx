import React, { useState } from "react";
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Sparkles,
  Award,
  CheckCircle2
} from "lucide-react";
import { BUILDER_CENTER_SUBMISSION_DOC } from "../data/mockAwsData";

export default function BuilderCenterExporter() {
  const [docText, setDocText] = useState(BUILDER_CENTER_SUBMISSION_DOC);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(docText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([docText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aws-builder-center-submission.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Exporter Header */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-display">
              <FileText className="w-5 h-5 text-amber-400" />
              AWS Builder Center Project Generator
            </h2>
            <span className="badge badge-aws text-[10px]">Submission Ready</span>
          </div>
          <p className="text-xs text-slate-400">
            Copy or download your complete hackathon writeup containing problem statement, Bedrock workflow, and Ship Gate proof.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-white/10 transition-all flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copied ? "Copied Markdown!" : "Copy Submission Markdown"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download .md File</span>
          </button>
        </div>
      </div>

      {/* Markdown Preview Area */}
      <div className="p-6 rounded-xl bg-[#090d16] border border-white/10 font-mono text-xs text-slate-300 leading-relaxed shadow-2xl">
        <textarea
          value={docText}
          onChange={(e) => setDocText(e.target.value)}
          className="w-full h-96 bg-transparent text-slate-200 font-mono text-xs focus:outline-none resize-none"
        ></textarea>
      </div>

      {/* Checklist Reminder */}
      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            This submission document fulfills all 4 required points on <strong>AWS Builder Center</strong> for judging.
          </span>
        </div>
        <a
          href="https://builder.aws.com/build/hackathons/e83e84e5-4f4c-383b-bbe9-4a15ac195d55/zero-to-shipped"
          target="_blank"
          rel="noreferrer"
          className="text-amber-400 hover:underline font-bold flex items-center gap-1 shrink-0"
        >
          Go to AWS Builder Center Submission Page <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
