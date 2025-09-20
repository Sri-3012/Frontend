"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

const CurrencyPairsPanel = () => {
  const [pairs, setPairs] = useState([
    { symbol: "EUR/USD", price: 1.0845, change: 0.0012, changePercent: 0.11 },
    { symbol: "GBP/USD", price: 1.2634, change: -0.0023, changePercent: -0.18 },
    { symbol: "USD/JPY", price: 149.82, change: 0.45, changePercent: 0.3 },
    { symbol: "AUD/USD", price: 0.6523, change: 0.0008, changePercent: 0.12 },
    { symbol: "USD/CAD", price: 1.3756, change: -0.0015, changePercent: -0.11 },
    { symbol: "NZD/USD", price: 0.5987, change: 0.0034, changePercent: 0.57 },
    { symbol: "USD/CHF", price: 0.8934, change: -0.0021, changePercent: -0.23 },
    { symbol: "EUR/GBP", price: 0.8589, change: 0.0007, changePercent: 0.08 },
  ])

  const [selectedPair, setSelectedPair] = useState("EUR/USD")

  useEffect(() => {
    const interval = setInterval(() => {
      setPairs((prevPairs) =>
        prevPairs.map((pair) => ({
          ...pair,
          price: pair.price + (Math.random() - 0.5) * 0.01,
          change: (Math.random() - 0.5) * 0.01,
          changePercent: (Math.random() - 0.5) * 1,
        })),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Currency Pairs</h2>
        <p className="text-sm text-gray-500">Live market prices</p>
      </div>

      <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
        {pairs.map((pair) => (
          <div
            key={pair.symbol}
            onClick={() => setSelectedPair(pair.symbol)}
            className={`p-3 rounded-md cursor-pointer transition-colors ${
              selectedPair === pair.symbol ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{pair.symbol}</p>
                <p className="text-lg font-semibold text-gray-900">{pair.price.toFixed(4)}</p>
              </div>
              <div className="text-right">
                <div className={`flex items-center ${pair.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {pair.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  <span className="text-sm font-medium">
                    {pair.changePercent >= 0 ? "+" : ""}
                    {pair.changePercent.toFixed(2)}%
                  </span>
                </div>
                <p className={`text-sm ${pair.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {pair.change >= 0 ? "+" : ""}
                  {pair.change.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CurrencyPairsPanel
