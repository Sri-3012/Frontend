"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Zap, AlertTriangle } from "lucide-react"
import { getForexPrices } from "@/lib/api"

const TradeExecutionPanel = () => {
  const [tradeType, setTradeType] = useState("buy")
  const [orderType, setOrderType] = useState("market")
  const [amount, setAmount] = useState("10000")
  const [stopLoss, setStopLoss] = useState("")
  const [takeProfit, setTakeProfit] = useState("")
  const [priceStatus, setPriceStatus] = useState({ isLive: true, price: null })

  useEffect(() => {
    async function fetchCurrentPrice() {
      try {
        const data = await getForexPrices(["EUR/USD"]);
        if (data && data["EUR/USD"]) {
          const quote = data["EUR/USD"];
          setPriceStatus({
            price: quote.price,
            isLive: quote.timestamp > Date.now() - 60000,
            spread: Math.abs(quote.ask - quote.bid)
          });
        }
      } catch (error) {
        console.error("Error fetching price:", error);
        setPriceStatus(prev => ({ ...prev, isLive: false }));
      }
    }

    fetchCurrentPrice();
    const interval = setInterval(fetchCurrentPrice, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleTrade = () => {
    if (!priceStatus.isLive && orderType === "market") {
      alert("Warning: Using indicative prices. Please confirm before proceeding.");
    }
    
    console.log("Executing trade:", {
      type: tradeType,
      orderType,
      amount,
      stopLoss,
      takeProfit,
      priceStatus
    });
    // Trade execution logic would go here
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Trade Execution</h2>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-500">EUR/USD</p>
          {priceStatus.price && (
            <div className="flex items-center">
              <span className={`text-sm font-medium ${priceStatus.isLive ? 'text-gray-900' : 'text-gray-500'}`}>
                {priceStatus.price.toFixed(4)}
              </span>
              {!priceStatus.isLive && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                  Indicative
                </span>
              )}
            </div>
          )}
        </div>
        {priceStatus.spread && (
          <p className="text-xs text-gray-500 mt-1">
            Spread: {(priceStatus.spread * 10000).toFixed(1)} pips
          </p>
        )}
      </div>

      <div className="p-4 space-y-4">
        {!priceStatus.isLive && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-700">
                Using indicative prices. Live market data unavailable.
              </p>
            </div>
          </div>
        )}
        
        {/* AI Signal Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">AI Signal</span>
          </div>
          <p className="text-sm text-blue-800 mt-1">Strong BUY signal detected. Confidence: 87%</p>
        </div>

        {/* Buy/Sell Toggle */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setTradeType("buy")}
            className={`p-3 rounded-lg font-medium transition-colors ${
              tradeType === "buy" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <TrendingUp className="h-4 w-4 mx-auto mb-1" />
            BUY
            <div className="text-sm font-normal">
              {priceStatus.price 
                ? (priceStatus.price + (priceStatus.spread ? priceStatus.spread/2 : 0)).toFixed(4)
                : "---"}
            </div>
          </button>
          <button
            onClick={() => setTradeType("sell")}
            className={`p-3 rounded-lg font-medium transition-colors ${
              tradeType === "sell" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <TrendingDown className="h-4 w-4 mx-auto mb-1" />
            SELL
            <div className="text-sm font-normal">
              {priceStatus.price 
                ? (priceStatus.price - (priceStatus.spread ? priceStatus.spread/2 : 0)).toFixed(4)
                : "---"}
            </div>
          </button>
        </div>

        {/* Order Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="market">Market Order</option>
            <option value="limit">Limit Order</option>
            <option value="stop">Stop Order</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount (Units)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="10000"
          />
        </div>

        {/* Stop Loss */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stop Loss</label>
          <input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="1.0800"
            step="0.0001"
          />
        </div>

        {/* Take Profit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Take Profit</label>
          <input
            type="number"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="1.0900"
            step="0.0001"
          />
        </div>

        {/* Risk Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Risk Warning</span>
          </div>
          <p className="text-xs text-yellow-700 mt-1">
            Trading involves substantial risk of loss and may not be suitable for all investors.
          </p>
        </div>

        {/* Execute Button */}
        <button
          onClick={handleTrade}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
            tradeType === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Execute {tradeType.toUpperCase()} Order
        </button>
      </div>
    </div>
  )
}

export default TradeExecutionPanel
