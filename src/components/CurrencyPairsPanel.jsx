
/** @jsxImportSource react */

"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Star, RefreshCw } from "lucide-react";
import { getForexPrices } from "@/lib/api";

/**
 * @typedef {Object} CurrencyPairsPanelProps
 * @property {string} [selectedPair] - The currently selected currency pair
 * @property {function(string): void} [onPairSelect] - Callback when a pair is selected
 * @property {string} [className] - Additional CSS classes
 */

const PAIRS = [
  "EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", 
  "USD/CAD", "NZD/USD", "USD/CHF", "EUR/GBP"
];

const CurrencyPairsPanel = ({ selectedPair = "", onPairSelect = () => {}, className = "" }) => {
  const [selectedCategory, setSelectedCategory] = useState("Popular");
  const [pairs, setPairs] = useState([]);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatPrice = (price) => {
    return (price || 0).toFixed(4);
  };

  const formatPercent = (percent) => {
    return (percent || 0).toFixed(2);
  };

  // Function to toggle favorite status
  const toggleFavorite = (e, symbol) => {
    e.stopPropagation(); // Prevent pair selection when clicking favorite
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  // Function to simulate price updates
  const updatePrices = () => {
    setIsUpdating(true);
    setPairs(currentPairs => 
      currentPairs.map(pair => {
        const changePercent = (Math.random() - 0.5) * 0.5; // Random change between -0.25% and +0.25%
        const change = pair.price * (changePercent / 100);
        const newPrice = pair.price + change;
        return {
          ...pair,
          price: newPrice,
          change: change,
          changePercent: changePercent
        };
      })
    );
    setTimeout(() => setIsUpdating(false), 500);
  };

  useEffect(() => {
    async function fetchPrices() {
      try {
        const data = await getForexPrices(PAIRS);
        if (data) {
          const formattedPairs = Object.entries(data).map(([symbol, info]) => ({
            symbol,
            price: parseFloat(info.price),
            change: parseFloat(info.change || 0),
            changePercent: parseFloat(info.percent_change || 0)
          }));
          setPairs(formattedPairs);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
        setError("Error fetching market data");
      }
    }
    fetchPrices();
  }, []);

  const filteredPairs = pairs.filter(pair => {
    if (selectedCategory === "Favorites") return favorites.includes(pair.symbol);
    return true;
  });

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Currency Pairs</h2>
            <p className="text-sm text-gray-500">Market prices</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Click on any pair to select
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={updatePrices}
              className={`p-1.5 rounded-md hover:bg-gray-100 transition-all duration-200 ${
                isUpdating ? 'animate-spin text-blue-500' : 'text-gray-500'
              }`}
              title="Refresh prices"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <button 
            onClick={() => setSelectedCategory("Popular")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              selectedCategory === "Popular" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Popular
          </button>
          <button 
            onClick={() => setSelectedCategory("Major")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              selectedCategory === "Major" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Major
          </button>
          <button 
            onClick={() => setSelectedCategory("Minor")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              selectedCategory === "Minor" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Minor
          </button>
          <button 
            onClick={() => setSelectedCategory("Favorites")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              selectedCategory === "Favorites" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            ★ Favorites
          </button>
        </div>
      </div>

      <div className="overflow-y-auto" style={{ height: "calc(100% - 136px)" }}>
        {error ? (
          <div className="flex items-center justify-center h-full text-red-500 p-4 text-center">
            {error}
          </div>
        ) : (
          filteredPairs.map((pair) => (
            <div
              key={pair.symbol}
              onClick={() => onPairSelect?.(pair.symbol)}
              className={`px-4 py-3 border-b last:border-b-0 cursor-pointer transition-all duration-200 ${
                selectedPair === pair.symbol 
                  ? "bg-blue-50/50 hover:bg-blue-50/75" 
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between group">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 flex items-center">
                    {pair.symbol}
                    <button
                      onClick={(e) => toggleFavorite(e, pair.symbol)}
                      className={`ml-2 transition-all duration-200 ${
                        favorites.includes(pair.symbol)
                          ? "text-yellow-500"
                          : "text-gray-400 opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <Star className="w-3 h-3" fill={favorites.includes(pair.symbol) ? "currentColor" : "none"} />
                    </button>
                  </h3>
                  <p className="text-2xl font-semibold text-gray-900 tabular-nums">
                    {formatPrice(pair.price)}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`flex items-center justify-end space-x-1 transition-colors duration-200 ${
                    pair.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}>
                    {pair.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium tabular-nums">
                      {pair.change >= 0 ? "+" : ""}{formatPercent(pair.changePercent)}%
                    </span>
                  </div>
                  <div className="mt-1">
                    <p className={`text-sm tabular-nums transition-colors duration-200 ${
                      pair.change >= 0 ? "text-green-500" : "text-red-500"
                    }`}>
                      {pair.change >= 0 ? "+" : ""}{formatPrice(Math.abs(pair.change))}
                    </p>
                  </div>
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
