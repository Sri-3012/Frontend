
"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Search, Star } from "lucide-react";
import { getForexPrices } from "@/lib/api";

const PAIRS = [
  "EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", 
  "USD/CAD", "NZD/USD", "USD/CHF", "EUR/GBP"
];

const CurrencyPairsPanel = ({ selectedPair, onPairSelect, className = "" }) => {
  const [selectedCategory, setSelectedCategory] = useState("Popular");
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const data = await getForexPrices(PAIRS);
        if (data) {
          const formattedPairs = Object.entries(data).map(([symbol, info]) => ({
            symbol,
            price: parseFloat(info.price),
            change: parseFloat(info.change),
            changePercent: parseFloat(info.percent_change),
            isLive: info.timestamp > Date.now() - 60000 // Consider data live if less than 1 minute old
          }));
          setPairs(formattedPairs);
          setError(null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prices:", error);
        setError("Unable to fetch live prices. Showing indicative rates.");
        setLoading(false);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return price.toFixed(4);
  };

  const formatPercent = (percent) => {
    return percent.toFixed(2);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Currency Pairs</h2>
            <p className="text-sm text-gray-500">Live market prices</p>
            {pairs.length > 0 && pairs[0].timestamp && (
              <p className="text-xs text-gray-400 mt-0.5">
                Last updated: {new Date(pairs[0].timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1.5 rounded-md hover:bg-gray-100">
              <Search className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-gray-100">
              <Star className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => setSelectedCategory("Popular")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${selectedCategory === "Popular" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Popular
          </button>
          <button 
            onClick={() => setSelectedCategory("Major")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${selectedCategory === "Major" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Major
          </button>
          <button 
            onClick={() => setSelectedCategory("Minor")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${selectedCategory === "Minor" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Minor
          </button>
        </div>
      </div>

      <div className="overflow-y-auto" style={{ height: "calc(100% - 116px)" }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500 p-4 text-center">
            {error}
          </div>
        ) : (
          pairs.map((pair) => (
            <div
              key={pair.symbol}
              onClick={() => onPairSelect(pair.symbol)}
              className={`px-4 py-3 border-b last:border-b-0 cursor-pointer transition-colors ${
                selectedPair === pair.symbol ? "bg-blue-50/50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {pair.symbol}
                    {!pair.isLive && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                        Indicative
                      </span>
                    )}
                  </h3>
                  <p className={`text-2xl font-semibold ${pair.isLive ? 'text-gray-900' : 'text-gray-500'}`}>
                    {formatPrice(pair.price)}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`flex items-center space-x-1 ${
                    pair.change >= 0 ? "text-green-600" : "text-red-600"
                  } ${!pair.isLive ? 'opacity-50' : ''}`}>
                    {pair.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {pair.change >= 0 ? "+" : ""}{formatPercent(pair.changePercent)}%
                    </span>
                  </div>
                  <p className={`text-sm ${
                    pair.change >= 0 ? "text-green-600" : "text-red-600"
                  } ${!pair.isLive ? 'opacity-50' : ''}`}>
                    {pair.change >= 0 ? "+" : ""}{formatPrice(pair.change)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CurrencyPairsPanel;

