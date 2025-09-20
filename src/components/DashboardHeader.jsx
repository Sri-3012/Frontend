import { Bell, Settings, User, ChevronDown, LogOut, LineChart, Wallet, History } from "lucide-react"

const DashboardHeader = () => {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-lg">α</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AlphaFX</h1>
              <p className="text-xs text-gray-500">Professional Trading Platform</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="flex items-center space-x-2 text-blue-600 font-medium">
              <LineChart className="w-4 h-4" />
              <span className="text-lg font-bold">Trading</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <History className="w-4 h-4" />
              <span className="text-lg font-bold">History</span>
            </a>
            
          </nav>

          {/* Account Info */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <div>
                <p className="text-sm text-gray-500">Balance</p>
                <p className="text-lg font-bold text-gray-900">$125,847.32</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Today's P/L</p>
                <p className="text-lg font-bold text-green-600">+$2,341.18</p>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">3</div>
                <Bell className="w-5 h-5" />
              </button>
              <div className="h-8 w-[1px] bg-gray-200"></div>
              <div className="relative group">
                <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">John Doe</p>
                    <p className="text-xs text-gray-500">Pro Trader</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl border border-gray-100 hidden group-hover:block">
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
