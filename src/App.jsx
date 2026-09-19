import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TopologyGraph from "./components/TopologyGraph";
import CostSentinel from "./components/CostSentinel";
import SecurityAudit from "./components/SecurityAudit";
import BedrockChat from "./components/BedrockChat";
import ConsoleAgentProof from "./components/ConsoleAgentProof";
import BuilderCenterExporter from "./components/BuilderCenterExporter";
import { AWS_ACCOUNT_INFO } from "./data/mockAwsData";

export default function App() {
  const [activeTab, setActiveTab] = useState("topology");
  const [selectedRegion, setSelectedRegion] = useState(AWS_ACCOUNT_INFO.region);
  const [isScanning, setIsScanning] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState("");

  const handleRunAiScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  const handleSelectNodeForRemediation = (node) => {
    setChatInitialPrompt(`Please analyze and remediate ${node.name} (${node.type}) in region ${selectedRegion}. Status: ${node.statusText}.`);
    setActiveTab("chat");
  };

  const handleSendToBedrockChat = (prompt) => {
    setChatInitialPrompt(prompt);
    setActiveTab("chat");
  };

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <Header
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        onScanClick={handleRunAiScan}
        isScanning={isScanning}
      />

      {/* Main Workspace Layout */}
      <div className="app-main">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Center Content View */}
        <main className="content-area">
          {activeTab === "topology" && (
            <TopologyGraph onSelectNodeForRemediation={handleSelectNodeForRemediation} />
          )}

          {activeTab === "cost" && (
            <CostSentinel onGoToChatWithRemediation={handleSendToBedrockChat} />
          )}

          {activeTab === "security" && (
            <SecurityAudit onSendToBedrockChat={handleSendToBedrockChat} />
          )}

          {activeTab === "chat" && (
            <BedrockChat initialPrompt={chatInitialPrompt} />
          )}

          {activeTab === "proof" && (
            <ConsoleAgentProof />
          )}

          {activeTab === "export" && (
            <BuilderCenterExporter />
          )}
        </main>
      </div>
    </div>
  );
}
