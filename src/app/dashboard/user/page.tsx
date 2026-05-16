"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users as UsersIcon, CreditCard, Clock, Check, X, Crown, ChevronLeft, ChevronRight, Plus, Pencil, Trash2, GraduationCap } from "lucide-react";

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

interface StudentData {
  id: string;
  email: string;
  nama: string;
  createdAt: string;
  _count: {
    examStudents: number;
  };
}

export default function DashboardUserPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"subscribe" | "admin" | "add" | "edit" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const itemsPerPage = 5;
  const [activeTab, setActiveTab] = useState<"guru" | "siswa">("guru");

  const [students, setStudents] = useState<StudentData[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [studentModalType, setStudentModalType] = useState<"add" | "edit" | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [isDeletingStudent, setIsDeletingStudent] = useState<string | null>(null);
  const [studentPage, setStudentPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user.isAdmin) {
          setIsAdmin(true);
          fetchUsers(token);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      } catch {
        setIsAdmin(false);
        setLoading(false);
      }
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (isAdmin && activeTab === "siswa") {
      fetchStudents();
    }
  }, [isAdmin, activeTab]);

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

  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setStudentsLoading(true);
    try {
      const res = await fetch("/api/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleAction = async (userId: string, actionType: string, data: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: actionType === "delete" ? "DELETE" : "PATCH",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: actionType === "delete" ? undefined : JSON.stringify({ userId, action: actionType, ...data }),
      });
      const result = await res.json();
      if (result.success) {
        if (actionType === "delete") {
          setUsers(users.filter(u => u.id !== userId));
        } else {
          setUsers(users.map(u => u.id === userId ? { ...u, ...result.data } : u));
        }
        setShowModal(false);
        setSelectedUser(null);
        setModalType(null);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleAddUser = async (data: { email: string; password: string; name: string; school: string }) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setUsers([result.data, ...users]);
        setShowModal(false);
        setModalType(null);
      }
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus user ini? Semua RPP dan Prota user juga akan dihapus.")) return;
    
    setIsDeleting(userId);
    await handleAction(userId, "delete", {});
    setIsDeleting(null);
  };

  const handleAddStudent = async (data: { email: string; nama: string; password: string }) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setStudents([result.data, ...students]);
        setShowStudentModal(false);
        setStudentModalType(null);
      } else {
        alert(result.error || "Gagal menambah siswa");
      }
    } catch (error) {
      console.error("Failed to add student:", error);
    }
  };

  const handleEditStudent = async (data: { email?: string; nama?: string; password?: string }) => {
    if (!selectedStudent) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/students/${selectedStudent.id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, ...result.data } : s));
        setShowStudentModal(false);
        setSelectedStudent(null);
        setStudentModalType(null);
      } else {
        alert(result.error || "Gagal mengupdate siswa");
      }
    } catch (error) {
      console.error("Failed to edit student:", error);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus siswa ini?")) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    setIsDeletingStudent(id);
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) {
        setStudents(students.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete student:", error);
    } finally {
      setIsDeletingStudent(null);
    }
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

  const openModal = (user: UserData, type: "subscribe" | "admin" | "edit") => {
    setSelectedUser(user);
    setModalType(type);
    setShowModal(true);
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  const studentTotalPages = Math.ceil(students.length / itemsPerPage);
  const studentStartIndex = (studentPage - 1) * itemsPerPage;
  const currentStudents = students.slice(studentStartIndex, studentStartIndex + itemsPerPage);

  if (isAdmin === false) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4">404</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">Halaman yang Anda Kunjungi tidak ada...!</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola User</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Kelola guru dan siswa</p>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setActiveTab("guru")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "guru"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <UsersIcon size={18} />
          Guru
        </button>
        <button
          onClick={() => setActiveTab("siswa")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "siswa"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <GraduationCap size={18} />
          Siswa
        </button>
      </div>

      {activeTab === "guru" ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Kelola subscription dan akses admin user</p>
            <button
              onClick={() => { setModalType("add"); setShowModal(true); }}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Tambah User
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Memuat...</div>
          ) : (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Langganan</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Sisa Hari</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">RPP/Prota</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {currentUsers.map((user) => {
                        const daysRemaining = getDaysRemaining(user.subscriptionExpiry);
                        return (
                          <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                                  <span className="text-purple-600 dark:text-purple-400 font-medium">
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
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => openModal(user, "edit")}
                                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                  title="Edit User"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() => openModal(user, "subscribe")}
                                  className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                                  title="Kelola Subscription"
                                >
                                  <CreditCard size={16} />
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
                                  <Crown size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  disabled={isDeleting === user.id}
                                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                  title="Hapus User"
                                >
                                  <Trash2 size={16} />
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

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400 px-4">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}

          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
                {modalType === "add" ? (
                  <AddUserModal onSubmit={handleAddUser} onClose={() => { setShowModal(false); setModalType(null); }} />
                ) : modalType === "edit" && selectedUser ? (
                  <EditUserModal user={selectedUser} onSubmit={handleAction} onClose={() => { setShowModal(false); setSelectedUser(null); setModalType(null); }} />
                ) : modalType === "subscribe" && selectedUser ? (
                  <SubscriptionModal user={selectedUser} onSubmit={handleAction} onClose={() => { setShowModal(false); setSelectedUser(null); setModalType(null); }} />
                ) : modalType === "admin" && selectedUser ? (
                  <AdminModal user={selectedUser} onSubmit={handleAction} onClose={() => { setShowModal(false); setSelectedUser(null); setModalType(null); }} />
                ) : null}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Kelola data siswa</p>
            <button
              onClick={() => { setStudentModalType("add"); setShowStudentModal(true); }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Tambah Siswa
            </button>
          </div>

          {studentsLoading ? (
            <div className="text-center py-12 text-gray-500">Memuat...</div>
          ) : (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Nama</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Daftar</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Jumlah Ujian</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {currentStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">{student.id.slice(0, 8)}...</td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{student.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{student.nama}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(student.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{student._count.examStudents}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => { setSelectedStudent(student); setStudentModalType("edit"); setShowStudentModal(true); }}
                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                title="Edit Siswa"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student.id)}
                                disabled={isDeletingStudent === student.id}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                title="Hapus Siswa"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {currentStudents.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                            Belum ada data siswa
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {studentTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setStudentPage(p => Math.max(1, p - 1))}
                    disabled={studentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400 px-4">
                    {studentPage} / {studentTotalPages}
                  </span>
                  <button
                    onClick={() => setStudentPage(p => Math.min(studentTotalPages, p + 1))}
                    disabled={studentPage === studentTotalPages}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}

          {showStudentModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
                {studentModalType === "add" ? (
                  <AddStudentModal
                    onSubmit={handleAddStudent}
                    onClose={() => { setShowStudentModal(false); setStudentModalType(null); }}
                  />
                ) : studentModalType === "edit" && selectedStudent ? (
                  <EditStudentModal
                    student={selectedStudent}
                    onSubmit={handleEditStudent}
                    onClose={() => { setShowStudentModal(false); setSelectedStudent(null); setStudentModalType(null); }}
                  />
                ) : null}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AddUserModal({ onSubmit, onClose }: { onSubmit: (data: { email: string; password: string; name: string; school: string }) => void; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    onSubmit({ email, password, name, school });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tambah User</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sekolah</label>
          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Tambah"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg font-medium transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

function EditUserModal({ user, onSubmit, onClose }: { user: UserData; onSubmit: (userId: string, action: string, data: any) => void; onClose: () => void }) {
  const [name, setName] = useState(user.name || "");
  const [school, setSchool] = useState(user.school || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onSubmit(user.id, "updateInfo", { name, school, password: password || undefined });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit User</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{user.email}</p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sekolah</label>
          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password Baru (opsional)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Kosongkan jika tidak ingin mengubah"
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg font-medium transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

function SubscriptionModal({ user, onSubmit, onClose }: { user: UserData; onSubmit: (userId: string, action: string, data: any) => void; onClose: () => void }) {
  const handleSetSubscription = (status: string, plan?: string, durationMonths?: number) => {
    onSubmit(user.id, "setSubscription", { status, plan, durationMonths });
  };

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Kelola Subscription</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">User: <strong>{user.email}</strong></p>
      <div className="space-y-3">
        <button
          onClick={() => handleSetSubscription("active", "monthly", 1)}
          className="w-full p-3 text-left bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-purple-600" />
            <span className="font-medium">1 Bulan - Rp 30.000</span>
          </div>
        </button>
        <button
          onClick={() => handleSetSubscription("active", "yearly", 12)}
          className="w-full p-3 text-left bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <Crown size={18} className="text-purple-600" />
            <span className="font-medium">1 Tahun - Rp 300.000</span>
          </div>
        </button>
        <button
          onClick={() => handleSetSubscription("free")}
          className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <X size={18} className="text-gray-600 dark:text-gray-400" />
            <span className="font-medium">Hapus Subscription</span>
          </div>
        </button>
      </div>
      <button
        onClick={onClose}
        className="mt-4 w-full py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        Batal
      </button>
    </>
  );
}

function AdminModal({ user, onSubmit, onClose }: { user: UserData; onSubmit: (userId: string, action: string, data: any) => void; onClose: () => void }) {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Kelola Akses Admin</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Berikan akses admin kepada <strong>{user.email}</strong>?</p>
      <div className="space-y-3">
        <button
          onClick={() => onSubmit(user.id, "toggleAdmin", { isAdmin: true })}
          className="w-full p-3 text-left bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <Check size={18} className="text-yellow-600" />
            <span className="font-medium">Jadikan Admin</span>
          </div>
        </button>
        <button
          onClick={() => onSubmit(user.id, "toggleAdmin", { isAdmin: false })}
          className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <X size={18} className="text-gray-600 dark:text-gray-400" />
            <span className="font-medium">Hapus Akses Admin</span>
          </div>
        </button>
      </div>
      <button
        onClick={onClose}
        className="mt-4 w-full py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        Batal
      </button>
    </>
  );
}

function AddStudentModal({ onSubmit, onClose }: { onSubmit: (data: { email: string; nama: string; password: string }) => void; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !nama || !password) return;
    setLoading(true);
    onSubmit({ email, nama, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tambah Siswa</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama *</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
            required
          />
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Tambah"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg font-medium transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

function EditStudentModal({ student, onSubmit, onClose }: { student: StudentData; onSubmit: (data: { email?: string; nama?: string; password?: string }) => void; onClose: () => void }) {
  const [email, setEmail] = useState(student.email);
  const [nama, setNama] = useState(student.nama);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload: { email?: string; nama?: string; password?: string } = {};
    if (email !== student.email) payload.email = email;
    if (nama !== student.nama) payload.nama = nama;
    if (password) payload.password = password;
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Siswa</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password Baru (opsional)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Kosongkan jika tidak ingin mengubah"
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg font-medium transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
