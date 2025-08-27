import {useNavigate} from "react-router";
import "../App.css";
import {useAuth} from "../context/auth.ts";
import React from "react";
import tradeFlow from "../assets/tradeFlow.png"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <img
                      src={tradeFlow}
                      alt="TradeFlow Logo"
                      className="h-8 w-auto mr-2"
                  />
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <button
                      onClick={() => navigate('/dashboard')}
                      className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </button>
                  <button
                      onClick={() => navigate('/clients')}
                      className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Clients
                  </button>
                  <button
                      onClick={() => navigate('/suppliers')}
                      className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Suppliers
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">Welcome, {user?.name ?? "Guest"}</span>
                <button
                    onClick={logout}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white shadow-inner border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <img
                    src={tradeFlow}
                    alt="TradeFlow Logo"
                    className="h-6 w-auto mr-2"
                />
                <span className="text-gray-600 text-sm">
                © {currentYear} TradeFlow. All rights reserved.
              </span>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">Terms of Service</a>
                <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">Contact Us</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
};

export default Layout;