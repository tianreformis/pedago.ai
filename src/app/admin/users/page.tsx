"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, CreditCard, Clock, Check, X, Crown } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  name: string | null;
  school: string | null;
  isAdmin: boolean;
  subscriptionStatus: string;
  subscriptionPlan: string | null;
  subscriptionExpiry: string | null;
  subscriptionMidtransId: string | null;
  createdAt: string;
  _count: {
    rpps: number;
    protas: number;
  };
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState<"subscribe" | "admin" | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchUsers(token);
  }, [router]);

  const fetchUsers = async (token: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.error("Failed to fetch users:", res.status);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId: string, actionType: string, data: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, action: actionType, ...data }),
      });
      const result = await res.json();
      if (result.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, ...result.data } : u));
        setShowModal(false);
        setSelectedUser(null);
        setAction(null);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysRemaining = (expiry: string | null) => {
    if (!expiry) return null;
    const days = Math.ceil((new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "expired": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const openModal = (user: UserData, actionType: "subscribe" | "admin") => {
    setSelectedUser(user);
    setAction(actionType);
    setShowModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Pengguna</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Kelola subscription dan akses admin</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Memuat...</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Pengguna</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Berlangganan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Sisa Hari</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">RPP/Prota</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => {
                  const daysRemaining = getDaysRemaining(user.subscriptionExpiry);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{user.name || "-"}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.subscriptionStatus)}`}>
                          {user.subscriptionStatus === "active" ? <Check size={12} /> : 
                           user.subscriptionStatus === "expired" ? <X size={12} /> : null}
                          {user.subscriptionStatus === "active" ? "Aktif" : 
                           user.subscriptionStatus === "expired" ? "Expired" : "Gratis"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {user.subscriptionPlan ? (
                          <div className="flex items-center gap-1">
                            <Crown size={14} className="text-purple-500" />
                            <span className="text-sm text-gray-900 dark:text-white">{user.subscriptionPlan}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {daysRemaining !== null ? (
                          <div className="flex items-center gap-1">
                            <Clock size={14} className={daysRemaining <= 7 ? "text-red-500" : "text-gray-500"} />
                            <span className={`text-sm ${daysRemaining <= 7 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}>
                              {daysRemaining} hari
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                          <span>{user._count.rpps} RPP</span>
                          <span>{user._count.protas} Prota</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openModal(user, "subscribe")}
                            className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                            title="Kelola Subscription"
                          >
                            <CreditCard size={18} />
                          </button>
                          <button
                            onClick={() => openModal(user, "admin")}
                            className={`p-2 rounded-lg transition-colors ${
                              user.isAdmin 
                                ? "text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30" 
                                : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                            title="Kelola Admin"
                          >
                            <Crown size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {action === "subscribe" ? "Kelola Subscription" : "Kelola Akses Admin"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {action === "subscribe" ? (
                <>Ulang tahun: <strong>{selectedUser.email}</strong></>
              ) : (
                <>Berikan akses admin kepada <strong>{selectedUser.email}</strong>?</>
              )}
            </p>
            
            {action === "subscribe" ? (
              <div className="space-y-3">
                <button
                  onClick={() => handleAction(selectedUser.id, "setSubscription", { 
                    status: "active", 
                    plan: "monthly", 
                    durationMonths: 1 
                  })}
                  className="w-full p-3 text-left bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-purple-600" />
                    <span className="font-medium">1 Bulan - Rp 30.000</span>
                  </div>
                </button>
                <button
                  onClick={() => handleAction(selectedUser.id, "setSubscription", { 
                    status: "active", 
                    plan: "yearly", 
                    durationMonths: 12 
                  })}
                  className="w-full p-3 text-left bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Crown size={18} className="text-purple-600" />
                    <span className="font-medium">1 Tahun - Rp 300.000</span>
                  </div>
                </button>
                <button
                  onClick={() => handleAction(selectedUser.id, "setSubscription", { 
                    status: "free" 
                  })}
                  className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <X size={18} className="text-gray-600 dark:text-gray-400" />
                    <span className="font-medium">Hapus Subscription</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => handleAction(selectedUser.id, "toggleAdmin", { isAdmin: true })}
                  className="w-full p-3 text-left bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Check size={18} className="text-yellow-600" />
                    <span className="font-medium">Jadikan Admin</span>
                  </div>
                </button>
                <button
                  onClick={() => handleAction(selectedUser.id, "toggleAdmin", { isAdmin: false })}
                  className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <X size={18} className="text-gray-600 dark:text-gray-400" />
                    <span className="font-medium">Hapus Akses Admin</span>
                  </div>
                </button>
              </div>
            )}
            
            <button
              onClick={() => { setShowModal(false); setSelectedUser(null); setAction(null); }}
              className="mt-4 w-full py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}