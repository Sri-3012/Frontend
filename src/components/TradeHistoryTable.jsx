"use client"

import { useState } from "react"
import { Search, Download } from "lucide-react"

const TradeHistoryTable = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const trades = [
    {
      id: "TXN001",
      pair: "EUR/USD",
      type: "BUY",
      amount: 10000,
      openPrice: 1.0823,
      closePrice: 1.0845,
      pnl: 220.0,
      status: "closed",
      openTime: "2024-01-15 09:30:00",
      closeTime: "2024-01-15 11:45:00",
    },
    {
      id: "TXN002",
      pair: "GBP/USD",
      type: "SELL",
      amount: 5000,
      openPrice: 1.265,
      closePrice: 1.2634,
      pnl: 80.0,
      status: "closed",
      openTime: "2024-01-15 10:15:00",
      closeTime: "2024-01-15 12:30:00",
    },
    {
      id: "TXN003",
      pair: "USD/JPY",
      type: "BUY",
      amount: 8000,
      openPrice: 149.45,
      closePrice: null,
      pnl: 296.0,
      status: "open",
      openTime: "2024-01-15 14:20:00",
      closeTime: null,
    },
    {
      id: "TXN004",
      pair: "AUD/USD",
      type: "SELL",
      amount: 12000,
      openPrice: 0.6535,
      closePrice: 0.6523,
      pnl: 144.0,
      status: "closed",
      openTime: "2024-01-15 08:45:00",
      closeTime: "2024-01-15 10:20:00",
    },
    {
      id: "TXN005",
      pair: "EUR/GBP",
      type: "BUY",
      amount: 7500,
      openPrice: 0.8575,
      closePrice: 0.8589,
      pnl: 105.0,
      status: "closed",
      openTime: "2024-01-15 13:10:00",
      closeTime: "2024-01-15 15:25:00",
    },
  ]

  const filteredTrades = trades.filter((trade) => {
    const matchesSearch =
      trade.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || trade.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Trade History</h2>
              <p className="text-sm text-gray-500">Recent trading activity</p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md" title="Export trades">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Trade ID, Currency Pair..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            />
          </div>
        </div>
      </div>

      <div className="overflow-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50" style={{ height: 'calc(100% - 140px)' }}>
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 whitespace-nowrap">
                Trade ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 whitespace-nowrap">Pair</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 whitespace-nowrap">Type</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 whitespace-nowrap">Amount</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 whitespace-nowrap">
                Open Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 whitespace-nowrap">
                Close Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 whitespace-nowrap">P&L</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 whitespace-nowrap">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTrades.map((trade) => (
              <tr key={trade.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{trade.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{trade.pair}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trade.type === "BUY" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {trade.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{trade.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{trade.openPrice.toFixed(4)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {trade.closePrice ? trade.closePrice.toFixed(4) : "-"}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`font-medium ${trade.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trade.status === "open" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {trade.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{trade.openTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TradeHistoryTable
