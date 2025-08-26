import { useState, useEffect } from "react";
import "../App.css";
import {api, useAuth} from "../context/auth.ts";

interface Contact {
  id: number | string;
  name: string;
  phone?: string;
  email?: string;
  amount_owed?: number;
}

interface DashboardStats {
  total_money_owed_to_me?: number;
  total_money_i_owe?: number;
  net_position?: number;
  total_clients?: number;
  total_suppliers?: number;
  recent_clients?: Contact[];
  recent_suppliers?: Contact[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get<DashboardStats>("/dashboard");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-gray-600">Here's your financial overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">€</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Money Owed to Me</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      €{(stats?.total_money_owed_to_me ?? 0).toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">€</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Money I Owe</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      €{(stats?.total_money_i_owe ?? 0).toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div
                      className={`w-8 h-8 ${((stats?.net_position ?? 0) >= 0 ? "bg-green-500" : "bg-red-500")} rounded-full flex items-center justify-center`}
                  >
                    <span className="text-white font-bold">€</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Net Position</dt>
                    <dd className={`text-lg font-medium ${((stats?.net_position ?? 0) >= 0 ? "text-green-600" : "text-red-600")}`}>
                      €{(stats?.net_position ?? 0).toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">#</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Contacts</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {(stats?.total_clients ?? 0) + (stats?.total_suppliers ?? 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Clients</h3>
            {stats?.recent_clients && stats.recent_clients.length > 0 ? (
                <div className="space-y-3">
                  {stats.recent_clients.map((client) => (
                      <div key={client.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-500">{client.email || client.phone}</p>
                        </div>
                        <p className="font-medium text-green-600">€{(client.amount_owed ?? 0).toLocaleString()}</p>
                      </div>
                  ))}
                </div>
            ) : (
                <p className="text-gray-500">No clients yet. Add your first client!</p>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Suppliers</h3>
            {stats?.recent_suppliers && stats.recent_suppliers.length > 0 ? (
                <div className="space-y-3">
                  {stats.recent_suppliers.map((supplier) => (
                      <div key={supplier.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{supplier.name}</p>
                          <p className="text-sm text-gray-500">{supplier.email || supplier.phone}</p>
                        </div>
                        <p className="font-medium text-red-600">€{(supplier.amount_owed ?? 0).toLocaleString()}</p>
                      </div>
                  ))}
                </div>
            ) : (
                <p className="text-gray-500">No suppliers yet. Add your first supplier!</p>
            )}
          </div>
        </div>
      </div>
  );
};

export default Dashboard;