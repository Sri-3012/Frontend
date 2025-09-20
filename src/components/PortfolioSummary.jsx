import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import { TrendingUp, DollarSign, Activity } from "lucide-react"

const PortfolioSummary = () => {
  const portfolioData = [
    { name: "EUR/USD", value: 35, amount: 43975 },
    { name: "GBP/USD", value: 25, amount: 31462 },
    { name: "USD/JPY", value: 20, amount: 25169 },
    { name: "AUD/USD", value: 12, amount: 15102 },
    { name: "Others", value: 8, amount: 10139 },
  ]

  const performanceData = [
    { month: "Jan", profit: 2400 },
    { month: "Feb", profit: 1800 },
    { month: "Mar", profit: 3200 },
    { month: "Apr", profit: 2800 },
    { month: "May", profit: 3600 },
    { month: "Jun", profit: 2900 },
  ]

  const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  const stats = [
    {
      label: "Total Equity",
      value: "$125,847.32",
      change: "+2.34%",
      positive: true,
      icon: DollarSign,
    },
    {
      label: "Free Margin",
      value: "$98,234.56",
      change: "+1.87%",
      positive: true,
      icon: TrendingUp,
    },
    {
      label: "Used Margin",
      value: "$27,612.76",
      change: "-0.45%",
      positive: false,
      icon: Activity,
    },
    {
      label: "Margin Level",
      value: "455.8%",
      change: "+12.3%",
      positive: true,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Portfolio Summary</h2>
        <p className="text-sm text-gray-500">Account overview and performance</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <Icon className="h-4 w-4 text-gray-600" />
                  <span className={`text-xs font-medium ${stat.positive ? "text-green-600" : "text-red-600"}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Portfolio Allocation */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Portfolio Allocation</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {portfolioData.map((item, index) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Performance */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Monthly Performance</h3>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={10} />
                <YAxis hide />
                <Tooltip formatter={(value) => [`$${value}`, "Profit"]} />
                <Bar dataKey="profit" fill="#2563eb" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Risk Metrics</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-yellow-700">Risk Level:</span>
              <span className="font-medium text-yellow-800">Moderate</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-yellow-700">Max Drawdown:</span>
              <span className="font-medium text-yellow-800">-3.2%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-yellow-700">Sharpe Ratio:</span>
              <span className="font-medium text-yellow-800">1.84</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioSummary
