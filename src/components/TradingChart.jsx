"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, BarChart3, CandlestickChart as Candlestick } from "lucide-react"

const TradingChart = () => {
  const [chartData, setChartData] = useState([])
  const [timeframe, setTimeframe] = useState("1H")
  const [chartType, setChartType] = useState("line")

  useEffect(() => {
    // Generate initial chart data
    const generateData = () => {
      const data = []
      let basePrice = 1.0845

      for (let i = 0; i < 50; i++) {
        basePrice += (Math.random() - 0.5) * 0.01
        data.push({
          time: new Date(Date.now() - (49 - i) * 60000).toLocaleTimeString(),
          price: basePrice,
          volume: Math.random() * 1000000,
        })
      }
      return data
    }

    setChartData(generateData())

    // Update chart data every 3 seconds
    const interval = setInterval(() => {
      setChartData((prevData) => {
        const newData = [...prevData.slice(1)]
        const lastPrice = newData[newData.length - 1]?.price || 1.0845
        const newPrice = lastPrice + (Math.random() - 0.5) * 0.005

        newData.push({
          time: new Date().toLocaleTimeString(),
          price: newPrice,
          volume: Math.random() * 1000000,
        })

        return newData
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"]

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">EUR/USD</h2>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {chartData[chartData.length - 1]?.price.toFixed(4) || "1.0845"}
              </span>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+0.11%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Chart Type Selector */}
            <div className="flex bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setChartType("line")}
                className={`p-1 rounded ${chartType === "line" ? "bg-white shadow-sm" : ""}`}
              >
                <TrendingUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`p-1 rounded ${chartType === "bar" ? "bg-white shadow-sm" : ""}`}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChartType("candlestick")}
                className={`p-1 rounded ${chartType === "candlestick" ? "bg-white shadow-sm" : ""}`}
              >
                <Candlestick className="h-4 w-4" />
              </button>
            </div>

            {/* Timeframe Selector */}
            <div className="flex bg-gray-100 rounded-md p-1">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-1 text-sm rounded ${
                    timeframe === tf
                      ? "bg-white shadow-sm text-blue-600 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 h-[calc(100%-5rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" stroke="#666" fontSize={12} tickLine={false} />
            <YAxis stroke="#666" fontSize={12} tickLine={false} domain={["dataMin - 0.01", "dataMax + 0.01"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#2563eb" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TradingChart
