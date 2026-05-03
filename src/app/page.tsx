"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  BookOpen, Sparkles, FileDown, Save, Calendar,
  Clock, Shield, Zap, CheckCircle, ArrowRight,
  Users, Target, Award, Star, PlayCircle,
  TrendingUp, MessageSquare, Layers
} from "lucide-react";

interface UserData {
  id: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
}

let cachedUser: UserData | null = null;
let cachedUserId: string | null = null;

function getStoredUser(): UserData | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) {
    cachedUser = null;
    cachedUserId = null;
    return null;
  }
  const stored = localStorage.getItem("user");
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    return parsed;
  } catch {
    return null;
  }
}

function subscribeToUser(callback: () => void) {
  const handler = () => {
    const newUser = getStoredUser();
    cachedUser = newUser;
    cachedUserId = newUser?.id || null;
    callback();
  };
  cachedUser = getStoredUser();
  cachedUserId = cachedUser?.id || null;
  window.addEventListener("user-logged-out", handler);
  window.addEventListener("user-logged-in", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("user-logged-out", handler);
    window.removeEventListener("user-logged-in", handler);
    window.removeEventListener("storage", handler);
  };
}

function getUserSnapshot(): UserData | null {
  if (cachedUser === null) {
    cachedUser = getStoredUser();
    cachedUserId = cachedUser?.id || null;
  }
  const current = getStoredUser();
  if (current && current.id !== cachedUserId) {
    cachedUser = current;
    cachedUserId = current.id;
  }
  if (!current && cachedUserId !== null) {
    cachedUser = null;
    cachedUserId = null;
  }
  return cachedUser;
}

export default function Home() {
  const user = useSyncExternalStore(subscribeToUser, getUserSnapshot, () => null);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-sm font-medium">Didukung oleh AI Generatif Terbaru</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Buat RPP Pembelajaran Mendalam
              <span className="block text-yellow-300">Dalam Hitungan Menit</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Generator RPP otomatis sesuai format resmi Kemendikdasmen. Hemat waktu, fokus mengajar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-lg"
                >
                  <ArrowRight size={20} />
                  Buka Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-lg"
                >
                  <ArrowRight size={20} />
                  Login Sekarang
                </Link>
              )}
              <a href="#fitur" className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-colors">
                <PlayCircle size={20} />
                Lihat Fitur
              </a>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-blue-200 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-300" />
                <span>Gratis untuk Guru</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-300" />
                <span>Format Resmi Kemendikdasmen</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-300" />
                <span>Export ke Word</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
              <div className="text-gray-600 dark:text-gray-400 mt-1">RPP Dibuat</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">5K+</div>
              <div className="text-gray-600 dark:text-gray-400 mt-1">Guru Terdaftar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">98%</div>
              <div className="text-gray-600 dark:text-gray-400 mt-1">Kepuasan</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">34</div>
              <div className="text-gray-600 dark:text-gray-400 mt-1">Provinsi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wide">Fitur Unggulan</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Semua yang Guru Butuhkan</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Platform lengkap untuk membuat dan mengelola dokumen pembelajaran</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Generate Otomatis dengan AI</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Buat RPP lengkap hanya dengan mengisi beberapa informasi dasar. AI akan menyusun seluruh dokumen.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Program Tahunan & Semester</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Buat Prota dan Prosem sekali klik, sinkron otomatis dengan RPP yang dibuat.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-emerald-600 dark:text-emerald-400" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Format Resmi Kemendikdasmen</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Semua dokumen mengikuti template dan standar terbaru dari Kementerian Pendidikan.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <FileDown className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Export ke Word & PDF</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Unduh dokumen dalam format .docx siap cetak atau PDF untuk distribusi digital.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Save className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Simpan & Kelola RPP</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Dashboard terpusat untuk menyimpan, mengedit, dan mengelola semua RPP Anda.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center mb-4">
                <Layers className="text-cyan-600 dark:text-cyan-400" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Template Siap Pakai</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Puluhan template RPP untuk berbagai mata pelajaran, fase, dan jenjang pendidikan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wide">Cara Kerja</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">3 Langkah Mudah</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Dari input hingga dokumen siap cetak dalam hitungan menit</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Isi Informasi Dasar</h3>
              <p className="text-gray-600 dark:text-gray-400">Masukkan mata pelajaran, fase, kelas, dan topik pembelajaran yang diinginkan.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Generate RPP</h3>
              <p className="text-gray-600 dark:text-gray-400">AI memproses input dan menghasilkan RPP lengkap sesuai format Kemendikdasmen.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Edit & Export</h3>
              <p className="text-gray-600 dark:text-gray-400">Sesuaikan hasil generate, simpan, dan unduh dalam format Word atau PDF.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pembelajaran Mendalam Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wide">Konsep</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Pembelajaran Mendalam</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Tiga pilar utama dalam pendekatan pembelajaran mendalam</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-4">
                <Target className="text-green-600 dark:text-green-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-3">BERKESADARAN</h3>
              <p className="text-gray-600 dark:text-gray-400">Peserta didik menyadari proses belajar, mengembangkan metakognisi, dan meningkatkan kesadaran diri terhadap kemajuan pembelajaran.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="text-blue-600 dark:text-blue-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">BERMAKNA</h3>
              <p className="text-gray-600 dark:text-gray-400">Pembelajaran dikaitkan dengan konteks kehidupan nyata, pengalaman peserta didik, dan relevansi praktis di luar kelas.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center mb-4">
                <Star className="text-orange-600 dark:text-orange-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-3">MENGGEMBIRAKAN</h3>
              <p className="text-gray-600 dark:text-gray-400">Suasana belajar yang menyenangkan, interaktif, dan memotivasi peserta didik untuk terus belajar dengan antusias.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wide">Testimoni</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Dipercaya Ribuan Guru</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"Sangat membantu! RPP yang dihasilkan sesuai format resmi dan bisa langsung dipakai. Hemat waktu berjam-jam."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">Ibu Sari</div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">Guru SD, Jakarta</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"Fitur generate Prota sangat memudahkan perencanaan tahunan. Tinggal klik, semua tersusun rapi."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">Bapak Ahmad</div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">Guru SMP, Bandung</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"Export ke Word-nya rapi banget, tinggal edit sedikit langsung cetak. Sangat direkomendasikan!"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">Ibu Dewi</div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">Guru SMA, Surabaya</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing/Promo Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm uppercase tracking-wide">Harga</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Pilih Paket yang Cocok</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Mulai gratis, upgrade kapan saja</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Gratis</h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Rp 0<span className="text-base font-normal text-gray-500">/bulan</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500" />1 RPP per hari</li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500" />1 Prota per hari</li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500" />Export PDF</li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500" />Export Word</li>
              </ul>
              {user ? (
                <Link href="/dashboard" className="block text-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Dashboard</Link>
              ) : (
                <Link href="/login" className="block text-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Mulai Gratis</Link>
              )}
            </div>
            <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-6 border border-blue-500 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">POPULER</div>
              <h3 className="text-lg font-semibold text-white mb-2">Premium</h3>
              <div className="text-3xl font-bold text-white mb-4">Rp 30K<span className="text-base font-normal text-blue-200">/bulan</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-blue-100"><CheckCircle size={16} className="text-yellow-300" />RPP unlimited</li>
                <li className="flex items-center gap-2 text-sm text-blue-100"><CheckCircle size={16} className="text-yellow-300" />Export Word & PDF</li>
                <li className="flex items-center gap-2 text-sm text-blue-100"><CheckCircle size={16} className="text-yellow-300" />Generate Prota</li>
                <li className="flex items-center gap-2 text-sm text-blue-100"><CheckCircle size={16} className="text-yellow-300" />Custom RPP</li>
              </ul>
              {user ? (
                <Link href="/dashboard" className="block text-center bg-white text-blue-700 font-semibold px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors">Dashboard</Link>
              ) : (
                <Link href="/login" className="block text-center bg-white text-blue-700 font-semibold px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors">Upgrade Premium</Link>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">HEMAT 30RB</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Premium Tahunan</h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Rp 330K<span className="text-base font-normal text-gray-500">/tahun</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500" />Semua fitur Premium</li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500" />Dashboard admin</li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500" />Support prioritas</li>
              </ul>
              {user ? (
                <Link href="/dashboard" className="block text-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Dashboard</Link>
              ) : (
                <Link href="/login" className="block text-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Hubungi Kami</Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Mempermudah Pembuatan RPP?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Bergabung dengan ribuan guru yang sudah menghemat waktu dengan PedagoAI</p>
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              <ArrowRight size={20} />
              Buka Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              <ArrowRight size={20} />
              Login Sekarang - Gratis
            </Link>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wide">FAQ</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Pertanyaan Umum</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Apakah RPP yang dihasilkan sesuai format resmi?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Ya, semua RPP mengikuti format terbaru dari Kemendikdasmen untuk Pembelajaran Mendalam (RPM).</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Berapa lama waktu yang dibutuhkan untuk generate RPP?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Rata-rata 30-60 detik per RPP, tergantung kompleksitas dan panjang dokumen.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Bisa edit RPP setelah di-generate?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Tentu! Anda bisa mengedit semua RPP yang telah dibuat melalui dashboard kapan saja.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Apakah data RPP saya aman?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Ya, semua data disimpan dengan enkripsi dan hanya dapat diakses oleh akun Anda.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
