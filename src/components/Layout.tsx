import {useNavigate} from "react-router";
import "../App.css";
import {useAuth} from "../context/auth.ts";
import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-gray-900">Debt & Credit Manager</h1>
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
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
  );
};

export default Layout;