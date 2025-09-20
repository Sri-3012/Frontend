import { Bell, Settings, User } from "lucide-react"

const DashboardHeader = () => {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">AlphaFxTrader</h1>
          </div>

          {/* Account Balance */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Account Balance</p>
              <p className="text-lg font-semibold text-gray-900">$125,847.32</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">P&L Today</p>
              <p className="text-lg font-semibold text-green-600">+$2,341.18</p>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                3
              </span>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
              <Settings className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
