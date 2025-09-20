import DashboardHeader from "./components/DashboardHeader"
import CurrencyPairsPanel from "./components/CurrencyPairsPanel"
import TradingChart from "./components/TradingChart"
import TradeExecutionPanel from "./components/TradeExecutionPanel"
import TradeHistoryTable from "./components/TradeHistoryTable"
import PortfolioSummary from "./components/PortfolioSummary"

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-8rem)]">
          {/* Left Panel - Currency Pairs */}
          <div className="lg:col-span-1">
            <CurrencyPairsPanel />
          </div>

          {/* Center Panel - Trading Chart */}
          <div className="lg:col-span-2">
            <TradingChart />
          </div>

          {/* Right Panel - Trade Execution */}
          <div className="lg:col-span-1">
            <TradeExecutionPanel />
          </div>
        </div>

        {/* Bottom Section - Trade History and Portfolio */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <TradeHistoryTable />
          </div>
          <div className="lg:col-span-1">
            <PortfolioSummary />
          </div>
        </div>
      </main>
    </div>
  )
}
//sdp

export default App
