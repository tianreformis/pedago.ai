"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import PromesViewer from "@/components/promes/PromesViewer";
import PromesExportButton from "@/components/promes/PromesExportButton";
import { PromesOutput } from "@/types/promes";

export default function PromesDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [promes, setPromes] = useState<{ id: string; rawOutput: any; mataPelajaran: string; fase: string; semester: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchPromes(token, params.id as string);
  }, [router, params.id]);

  const fetchPromes = async (token: string, id: string) => {
    try {
      const res = await fetch(`/api/promes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPromes(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch Promes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!promes) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Promes tidak ditemukan</h2>
        <button
          onClick={() => router.push("/dashboard/promes")}
          className="mt-4 text-purple-600 hover:underline"
        >
          Kembali ke daftar Promes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/dashboard/promes")}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>
        <PromesExportButton output={promes.rawOutput as PromesOutput} />
      </div>

      <PromesViewer output={promes.rawOutput as PromesOutput} />
    </div>
  );
}
