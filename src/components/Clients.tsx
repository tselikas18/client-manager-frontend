import { useState, useEffect } from "react";
import {api} from "../context/auth.ts"
import "../App.css";
import axios from "axios";
import type { Client } from "../types.ts";

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingNotes, setViewingNotes] = useState<{text: string, id: string} | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    amount_owed: "",
    notes: "",
  });

  useEffect(() => {
    fetchClients();
  }, [searchTerm]);

  useEffect(() => {
    const t = setTimeout(() => { fetchClients(); }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const fetchClients = async () => {
    try {
      const q = searchTerm.trim();
      const params = q ? { search: q } : {};
      console.log("fetchClients params:", params);
      const response = await api.get<Client[]>("/clients", { params });
      console.log("fetchClients response:", response.data.length);
      setClients(response.data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (formData.amount_owed === '' || formData.amount_owed == null) {
      setFormError('Please provide amount owed.');
      return;
    }
    const parsedAmount = parseFloat(formData.amount_owed);
    if (Number.isNaN(parsedAmount)) {
      setFormError('amount_owed must be a valid number.');
      return;
    }

    const phoneDigits = (formData.phone ?? '').toString().replace(/\D/g, '');
    if (phoneDigits.length != 10) {
      setFormError('Please enter a valid phone number.');
      return;
    }

    try {
      const data = {
        ...formData,
        amount_owed: parsedAmount,
      };

      if (editingClient) {
        const editId = String(editingClient._id ?? editingClient.id);
        await api.put(`/clients/${editId}`, data);
      } else {
        await api.post('/clients/', data);
      }

      setShowForm(false);
      setEditingClient(null);
      setFormData({ name: '', phone: '', email: '', amount_owed: '', notes: '' });
      fetchClients();
    } catch (err: unknown) {
      console.error('Failed to save client:', err);
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.error ?? err.response?.data?.message ?? 'Failed to save client';
        setFormError(msg);
      } else if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError(String(err));
      }
    }
  };

  const handleDelete = async (clientId?: string) => {
    console.log('handleDelete called with id:', clientId);
    if (!clientId) {
      console.error("No client id provided to delete");
      return;
    }
    if (!confirm("Are you sure?")) return;
    await api.delete(`/clients/${clientId}`);
    setClients(prev => prev.filter(c => String(c._id ?? c.id) !== String(clientId)));
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone || "",
      email: client.email || "",
      amount_owed: (client.amount_owed ?? 0).toString(),
      notes: client.notes || "",
    });
    setShowForm(true);
  };

  const formatDate = (d?: string | Date | null) =>
      d ? new Date(d).toLocaleString() : '—';

  const handleViewNotes = (notes: string, id: string) => {
    setViewingNotes({ text: notes, id });
  };

  return (
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
            <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Client
            </button>
          </div>

          <div className="mb-4">
            <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {loading ? (
              <div className="text-center py-8">Loading...</div>
          ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Amount Owed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Notes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Actions</th>
                  </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(clients) && clients.map((client) => (
                      <tr key={String(client._id ?? client.id)}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{client.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {client.email && <div>{client.email}</div>}
                          {client.phone && <div>{client.phone}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                          €{(client.amount_owed ?? 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 relative">
                          <div className="max-h-12 overflow-hidden">
                            {client.notes ? (
                                <div className="line-clamp-2 hover:cursor-pointer" onClick={() => handleViewNotes(client.notes || "", String(client._id ?? client.id))}>
                                  {client.notes}
                                </div>
                            ) : "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(client.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(client.updated_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button onClick={() => handleEdit(client)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                          <button onClick={() => handleDelete(client._id ?? client.id)} className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </div>

        {showForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingClient ? "Edit Client" : "Add New Client"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name *</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone *</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount Owed* (€)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.amount_owed}
                        onChange={(e) => setFormData({ ...formData, amount_owed: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditingClient(null);
                          setFormData({ name: "", phone: "", email: "", amount_owed: "", notes: "" });
                          setFormError(null)
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                      {editingClient ? "Update" : "Add"}
                    </button>
                  </div>
                </form>
                <div>
                  {formError && <div role="alert" className="form-error" style={{ color: 'red' }}>{formError}</div>}
                </div>
              </div>
            </div>
        )}

        {/* Notes modal */}
        {viewingNotes && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Notes</h3>
                  <button
                      onClick={() => setViewingNotes(null)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 max-h-96 overflow-y-auto">
                  <p className="text-sm text-gray-500 whitespace-pre-wrap">{viewingNotes.text}</p>
                </div>
                <div className="mt-4">
                  <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => setViewingNotes(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default Clients;