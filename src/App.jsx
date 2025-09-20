import DashboardHeader from "./components/DashboardHeader"
import CurrencyPairsPanel from "./components/CurrencyPairsPanel.jsx"
import TradingChart from "./components/TradingChart"
import TradeExecutionPanel from "./components/TradeExecutionPanel"
import TradeHistoryTable from "./components/TradeHistoryTable"
import PortfolioSummary from "./components/PortfolioSummary"

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Top Row */}
          <div className="grid lg:col-span-4 grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-20rem)]">
            {/* Left Panel - Currency Pairs */}
            <div className="lg:col-span-1">
              <CurrencyPairsPanel />
            </div>

            {/* Center Panel - Trading Chart */}
            <div className="lg:col-span-2">
              <TradingChart />
            </div>

            {/* Right Panel - Trade Execution */}
            <div className="lg:col-span-1 h-full">
              <TradeExecutionPanel />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="lg:col-span-3">
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
