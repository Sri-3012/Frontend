"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { TrendingUp, DollarSign, Activity } from "lucide-react";
import { getForexPrices } from "@/lib/api";
import { Card } from "@/components/ui/card";

const PortfolioSummary = () => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) + '%';
  };

  const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  useEffect(() => {
    let portfolioInterval = null;
    
    const updatePortfolioData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Updating portfolio data...');
        
        const forexData = await getForexPrices([
          "EURUSD", "GBPUSD", "USDJPY", "AUDUSD"
        ]);

        console.log('Received forex data:', forexData);
        
        if (!forexData) {
          throw new Error('No data received from the forex API');
        }

        const totalEquity = 125847.32;
        const portfolioAllocation = [
          { pair: "EURUSD", percentage: 35 },
          { pair: "GBPUSD", percentage: 25 },
          { pair: "USDJPY", percentage: 20 },
          { pair: "AUDUSD", percentage: 12 },
          { name: "Others", percentage: 8 }
        ];

        const updatedPortfolio = portfolioAllocation.map(item => {
          if (item.pair && forexData[item.pair]) {
            const rate = forexData[item.pair].price;
            const amount = (totalEquity * item.percentage / 100);
            const change = forexData[item.pair].percent_change;
            return {
              name: item.pair,
              percentage: item.percentage,
              value: item.percentage,
              amount,
              rate,
              change,
              bid: forexData[item.pair].bid,
              ask: forexData[item.pair].ask,
            };
          }
          return {
            name: item.name || item.pair,
            percentage: item.percentage,
            value: item.percentage,
            amount: (totalEquity * item.percentage / 100)
          };
        });

        setPortfolioData(updatedPortfolio);

        const totalValue = updatedPortfolio.reduce((sum, item) => sum + (item.amount || 0), 0);
        const freeMargin = totalValue * 0.78;
        const usedMargin = totalValue * 0.22;
        const marginLevel = (totalValue / usedMargin) * 100;

        const avgChange = updatedPortfolio
          .filter(item => item.change !== undefined)
          .reduce((sum, item) => sum + (item.change * (item.percentage / 100)), 0);

        setStats([
          {
            label: "Total Equity",
            value: formatCurrency(totalValue),
            change: formatPercentage(avgChange),
            positive: avgChange >= 0,
            icon: DollarSign,
          },
          {
            label: "Free Margin",
            value: formatCurrency(freeMargin),
            change: formatPercentage(avgChange * 0.78),
            positive: avgChange >= 0,
            icon: TrendingUp,
          },
          {
            label: "Used Margin",
            value: formatCurrency(usedMargin),
            change: formatPercentage(avgChange * 0.22),
            positive: false,
            icon: Activity,
          },
          {
            label: "Margin Level",
            value: formatPercentage(marginLevel),
            change: formatPercentage(avgChange),
            positive: marginLevel >= 450,
            icon: TrendingUp,
          }
        ]);

        setLastUpdate(new Date());

        const currentDate = new Date();
        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const date = new Date(currentDate);
          date.setMonth(currentDate.getMonth() - i);
          return {
            month: date.toLocaleString('default', { month: 'short' }),
            profit: Math.floor(Math.random() * 2000) + 1500
          };
        }).reverse();

        setPerformanceData(last6Months);
        setLoading(false);
      } catch (error) {
        console.error('Error updating portfolio:', error);
        const errorMessage = error.message.includes('API request failed')
          ? 'Could not connect to forex data service. Please check your internet connection.'
          : 'Failed to load portfolio data';
        setError(errorMessage);
        setLoading(false);
      }
    };

    updatePortfolioData();
    portfolioInterval = setInterval(updatePortfolioData, 10000);

    return () => {
      if (portfolioInterval) {
        clearInterval(portfolioInterval);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {lastUpdate && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Portfolio Summary</h2>
          <p className="text-sm text-gray-500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
      )}

      {error ? (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center text-red-700">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Error loading data</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                  </div>
                  <div className="rounded-full p-2 bg-gray-100">
                    <stat.icon className={`w-6 h-6 ${stat.positive ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                </div>
                <div className={`mt-2 text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Portfolio Allocation</h3>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
              <div className="w-full md:w-1/2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                {portfolioData.map((item, index) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{formatPercentage(item.percentage)}</p>
                      {item.rate && (
                        <p className="text-xs text-gray-400">
                          Rate: {item.rate.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                />
                <Bar 
                  dataKey="profit" 
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg">Updating data...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioSummary;