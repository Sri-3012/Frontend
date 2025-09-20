"use client"

import React, { useState } from 'react';
import DashboardHeader from "@/src/components/DashboardHeader";
import CurrencyPairsPanel from "@/src/components/CurrencyPairsPanel";
import TradingChart from "@/src/components/TradingChart";
import TradeExecutionPanel from "@/src/components/TradeExecutionPanel";
import TradeHistoryTable from "@/src/components/TradeHistoryTable";
import PortfolioSummary from "@/src/components/PortfolioSummary";

export default function Home() {
  const [selectedPair, setSelectedPair] = useState("EUR/USD");
  return (
        <div className="min-h-screen bg-[#f8fafc]">
      <DashboardHeader />
      <main className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Currency Pairs */}
          <div className="col-span-3">
            <CurrencyPairsPanel 
              selectedPair={selectedPair}
              onPairSelect={setSelectedPair}
              className="h-[calc(100vh-13rem)]"
            />
          </div>
          
          {/* Center and Right Columns */}
          <div className="col-span-9 space-y-6">
            {/* Top Row - Chart */}
            <div className="h-[calc(100vh-13rem)] bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <TradingChart 
                selectedPair={selectedPair}
              />
            </div>
            
            {/* Bottom Row - Trade Execution and Portfolio */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-5">
                <div className="h-[calc(100vh-36rem)]">
                  <TradeExecutionPanel 
                    selectedPair={selectedPair}
                  />
                </div>
              </div>
              <div className="col-span-7">
                <div className="h-[calc(100vh-36rem)]">
                  <PortfolioSummary />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}