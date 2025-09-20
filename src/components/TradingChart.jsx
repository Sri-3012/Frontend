"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, BarChart3, CandlestickChart as Candlestick } from "lucide-react"

const TradingChart = ({ selectedPair }) => {
  const [chartData, setChartData] = useState([])
  const [timeframe, setTimeframe] = useState("1H")
  const [chartType, setChartType] = useState("line")
  
  // Base prices for different currency pairs
  const basePrices = {
    "EUR/USD": 1.0845,
    "GBP/USD": 1.2634,
    "USD/JPY": 149.82,
    "AUD/USD": 0.6523,
    "USD/CAD": 1.3756,
    "NZD/USD": 0.5987,
    "USD/CHF": 0.8934,
    "EUR/GBP": 0.8589
  }

  const getTimeframeInMilliseconds = (tf) => {
    const map = {
      '1M': 60 * 1000,        // 1 minute
      '5M': 5 * 60 * 1000,    // 5 minutes
      '15M': 15 * 60 * 1000,  // 15 minutes
      '30M': 30 * 60 * 1000,  // 30 minutes
      '1H': 60 * 60 * 1000,   // 1 hour
      '4H': 4 * 60 * 60 * 1000, // 4 hours
      '1D': 24 * 60 * 60 * 1000 // 1 day
    }
    return map[tf]
  }

  useEffect(() => {
    // Generate initial chart data
    const generateData = () => {
      const data = []
      let basePrice = basePrices[selectedPair]
      const volatility = selectedPair.includes('JPY') ? 0.1 : 0.0005
      const timeframeMs = getTimeframeInMilliseconds(timeframe)
      const dataPoints = 50

      for (let i = 0; i < dataPoints; i++) {
        basePrice += (Math.random() - 0.5) * volatility
        const timestamp = new Date(Date.now() - (dataPoints - 1 - i) * timeframeMs)
        data.push({
          time: timestamp.toLocaleTimeString(),
          fullTime: timestamp.toLocaleString(),
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
        const lastPrice = newData[newData.length - 1]?.price || basePrices[selectedPair]
        const volatility = selectedPair.includes('JPY') ? 0.1 : 0.0005
        const newPrice = lastPrice + (Math.random() - 0.5) * volatility
        const now = new Date()

        newData.push({
          time: now.toLocaleTimeString(),
          fullTime: now.toLocaleString(),
          price: newPrice,
          volume: Math.random() * 1000000,
        })

        return newData
      })
    }, getTimeframeInMilliseconds(timeframe) / 10) // Update more frequently than the timeframe

    return () => clearInterval(interval)
  }, [selectedPair, timeframe]) // Re-initialize chart when currency pair or timeframe changes

  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"]

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 h-full">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{selectedPair}</h2>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {chartData[chartData.length - 1]?.price.toFixed(selectedPair.includes('JPY') ? 2 : 4) || basePrices[selectedPair].toFixed(selectedPair.includes('JPY') ? 2 : 4)}
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

      <div className="p-4 h-[calc(100%-5rem)] bg-white">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              stroke="#666" 
              fontSize={12} 
              tickLine={false}
              tick={{ fill: '#666' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => {
                const date = new Date(value);
                if (timeframe === '1D') {
                  return value.split(',')[0]; // Show date only
                } else if (['4H', '1H'].includes(timeframe)) {
                  return value.split(':').slice(0, 2).join(':'); // Show HH:MM
                } else {
                  return value.split(':').join(':'); // Show HH:MM:SS
                }
              }}
            />
            <YAxis 
              stroke="#666" 
              fontSize={12} 
              tickLine={false} 
              domain={["dataMin - 0.01", "dataMax + 0.01"]}
              tick={{ fill: '#666' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                padding: "8px",
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
