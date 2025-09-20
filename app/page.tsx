"use client"

import React from 'react';
import DashboardHeader from "@/src/components/DashboardHeader";
import CurrencyPairsPanel from "@/src/components/CurrencyPairsPanel";
import TradingChart from "@/src/components/TradingChart";
import TradeExecutionPanel from "@/src/components/TradeExecutionPanel";
import TradeHistoryTable from "@/src/components/TradeHistoryTable";
import PortfolioSummary from "@/src/components/PortfolioSummary";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-3">
            <CurrencyPairsPanel />
            <div className="mt-6">
              <PortfolioSummary />
            </div>
          </div>
          
          {/* Center Column */}
          <div className="col-span-6">
            <TradingChart />
            <div className="mt-6">
              <TradeExecutionPanel />
            </div>
          </div>
          
          {/* Right Column */}
          <div className="col-span-3">
            <TradeHistoryTable />
          </div>
        </div>
      </main>
    </div>
  );
}