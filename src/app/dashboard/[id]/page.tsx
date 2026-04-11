"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import RPPViewer from "@/components/rpp/RPPViewer";
import RPPExportButton from "@/components/rpp/RPPExportButton";
import { ArrowLeft, Loader2 } from "lucide-react";
import { RPPInput, RPPOutput } from "@/types/rpp";

interface RPPData {
  id: string;
  mataPelajaran: string;
  fase: string;
  kelas?: string;
  namaGuru?: string;
  sekolah?: string;
  tahunAjaran?: string;
  semester?: string;
  alokasWaktu?: string;
  rawOutput: RPPOutput;
  createdAt: string;
}

export default function RPPDetailPage() {
  const params = useParams();
  const [rpp, setRpp] = useState<RPPData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRPP();
  }, [params.id]);

  const fetchRPP = async () => {
    try {
      const res = await fetch(`/api/rpp/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setRpp(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch RPP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!rpp) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">RPP tidak ditemukan</h2>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const input: RPPInput = {
    mataPelajaran: rpp.mataPelajaran,
    fase: rpp.fase,
    kelas: rpp.kelas,
    namaGuru: rpp.namaGuru,
    sekolah: rpp.sekolah,
    tahunAjaran: rpp.tahunAjaran,
    semester: rpp.semester,
    alokasWaktu: rpp.alokasWaktu,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Kembali ke Dashboard
      </Link>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{rpp.mataPelajaran}</h1>
          <p className="text-gray-600">{rpp.fase} · {new Date(rpp.createdAt).toLocaleDateString("id-ID")}</p>
        </div>
        <RPPExportButton rppInput={input} rppOutput={rpp.rawOutput} />
      </div>

      <RPPViewer input={input} output={rpp.rawOutput} />
    </div>
  );
}