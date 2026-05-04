"use client";

import { useState } from "react";
import { RPPInput, RPPOutput } from "@/types/rpp";
import { ChevronDown, ChevronUp } from "lucide-react";

interface RPPViewerProps {
  input: RPPInput;
  output: RPPOutput;
}

function SectionCard({ title, icon, color, children, defaultOpen = false }: {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 ${color} text-white font-semibold`}
      >
        <div className="flex items-center gap-2">
          {icon}
          {title}
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && <div className="p-4 bg-white dark:bg-gray-800">{children}</div>}
    </div>
  );
}

export default function RPPViewer({ input, output }: RPPViewerProps) {
  const { karakteristikPembelajar, desainPembelajaran, pengalamanBelajar, asesmen, glosarium, pertanyaanRefleksiGuru, lembarKerjaPesertaDidik } = output;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-600 p-4 rounded-r-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300">Identitas RPP</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
          <div className="dark:text-gray-200"><span className="font-medium">Mata Pelajaran:</span> {input.mataPelajaran}</div>
          <div className="dark:text-gray-200"><span className="font-medium">Fase:</span> {input.fase}</div>
          {input.kelas && <div className="dark:text-gray-200"><span className="font-medium">Kelas:</span> {input.kelas}</div>}
          {input.namaGuru && <div className="dark:text-gray-200"><span className="font-medium">Guru:</span> {input.namaGuru}</div>}
          {input.sekolah && <div className="dark:text-gray-200"><span className="font-medium">Sekolah:</span> {input.sekolah}</div>}
          {input.alokasWaktu && <div className="dark:text-gray-200"><span className="font-medium">Waktu:</span> {input.alokasWaktu}</div>}
        </div>
      </div>

      <SectionCard
        title="Karakteristik Pembelajaran"
        icon={<span>A.</span>}
        color="bg-green-600"
        defaultOpen
      >
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-semibold dark:text-white">Kesiapan Peserta Didik:</span>
            <p className="mt-1 text-gray-700 dark:text-gray-300">{karakteristikPembelajar.kesiapanPesertaDidik}</p>
          </div>
          <div>
            <span className="font-semibold dark:text-white">Karakteristik Materi:</span>
            <p className="mt-1 text-gray-700 dark:text-gray-300">{karakteristikPembelajar.karakteristikMateri}</p>
          </div>
          <div>
            <span className="font-semibold dark:text-white">Dimensi Profil Lulusan:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {karakteristikPembelajar.dimensiProfilLulusan.map((d, i) => (
                <span key={i} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-xs">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Desain Pembelajaran"
        icon={<span>B.</span>}
        color="bg-purple-600"
        defaultOpen
      >
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-semibold dark:text-white">Capaian Pembelajaran:</span>
            <p className="mt-1 text-gray-700 dark:text-gray-300">{desainPembelajaran.capaianPembelajaran}</p>
          </div>
          <div>
            <span className="font-semibold dark:text-white">Topik Pembelajaran:</span>
            <p className="mt-1 text-gray-700 dark:text-gray-300">{desainPembelajaran.topikPembelajaran}</p>
          </div>
          {desainPembelajaran.lintasDisiplinIlmu && (
            <div>
              <span className="font-semibold dark:text-white">Lintas Disiplin Ilmu:</span>
              <p className="mt-1 text-gray-700 dark:text-gray-300">{desainPembelajaran.lintasDisiplinIlmu}</p>
            </div>
          )}
          <div>
            <span className="font-semibold dark:text-white">Tujuan Pembelajaran:</span>
            <ol className="mt-1 list-decimal list-inside text-gray-700 dark:text-gray-300">
              {desainPembelajaran.tujuanPembelajaran.map((tp, i) => (
                <li key={i}>{tp.replace(/^[0-9]+[\.\)]\s*/, "")}</li>
              ))}
            </ol>
          </div>
          {desainPembelajaran.pertanyaanPenuntunPemahaman && desainPembelajaran.pertanyaanPenuntunPemahaman.length > 0 && (
            <div>
              <span className="font-semibold dark:text-white">Pertanyaan Penuntun Pemahaman:</span>
              <ol className="mt-1 list-decimal list-inside text-gray-700 dark:text-gray-300">
                {desainPembelajaran.pertanyaanPenuntunPemahaman.map((p, i) => (
                  <li key={i}>{p.replace(/^[0-9]+[\.\)]\s*/, "")}</li>
                ))}
              </ol>
            </div>
          )}
          <div>
            <span className="font-semibold dark:text-white">Praktik Pedagogis:</span>
            <p className="mt-1 text-gray-700 dark:text-gray-300">{desainPembelajaran.praktikPedagogis}</p>
          </div>
          {desainPembelajaran.kemitraanPembelajaran && (
            <div>
              <span className="font-semibold dark:text-white">Kemitraan Pembelajaran:</span>
              <p className="mt-1 text-gray-700 dark:text-gray-300">{desainPembelajaran.kemitraanPembelajaran}</p>
            </div>
          )}
          <div>
            <span className="font-semibold dark:text-white">Lingkungan Belajar:</span>
            <p className="mt-1 text-gray-700 dark:text-gray-300">{desainPembelajaran.lingkunganBelajar}</p>
          </div>
          {desainPembelajaran.pemanfaatanTeknologi && (
            <div>
              <span className="font-semibold dark:text-white">Pemanfaatan Teknologi:</span>
              <p className="mt-1 text-gray-700 dark:text-gray-300">{desainPembelajaran.pemanfaatanTeknologi}</p>
            </div>
          )}
          <div>
            <span className="font-semibold dark:text-white">Kriteria Pencapaian TP:</span>
            <ol className="mt-1 list-decimal list-inside text-gray-700 dark:text-gray-300">
              {desainPembelajaran.kriteriaPencapaianTP.map((k, i) => (
                <li key={i}>{k.replace(/^[0-9]+[\.\)]\s*/, "")}</li>
              ))}
            </ol>
          </div>
          <div>
            <span className="font-semibold dark:text-white">Dimensi Profil Lulusan:</span>
            <p className="mt-1 text-gray-700 dark:text-gray-300">{desainPembelajaran.dimensiProfilLulusan}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Pengalaman Belajar"
        icon={<span>C.</span>}
        color="bg-orange-500"
        defaultOpen
      >
        <div className="space-y-4 text-sm">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border-l-4 border-orange-400">
            <h4 className="font-semibold text-orange-800 dark:text-orange-300">Fase Awal ({pengalamanBelajar.awal.durasi})</h4>
            <p className="mt-2 dark:text-gray-200"><span className="font-medium">Prinsip:</span> {pengalamanBelajar.awal.prinsip}</p>
            <p className="mt-1 dark:text-gray-200"><span className="font-medium">Orientasi:</span> {pengalamanBelajar.awal.orientasi}</p>
            <p className="mt-1 dark:text-gray-200"><span className="font-medium">Apersepsi:</span> {pengalamanBelajar.awal.apersepsi}</p>
            <p className="mt-1 dark:text-gray-200"><span className="font-medium">Motivasi:</span> {pengalamanBelajar.awal.motivasi}</p>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border-l-4 border-orange-600">
            <h4 className="font-semibold text-orange-800 dark:text-orange-300">Fase Inti</h4>
            <div className="mt-3 space-y-3">
              <div>
                <span className="font-medium dark:text-gray-200">Memahami ({pengalamanBelajar.inti.memahami.durasi})</span>
                <p className="text-gray-700 dark:text-gray-300">{pengalamanBelajar.inti.memahami.prinsip}</p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-1">
                  {(pengalamanBelajar.inti.memahami as any).kegitan?.map((k: string, i: number) => (
                    <li key={i}>{k}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-medium dark:text-gray-200">Mengaplikasi ({pengalamanBelajar.inti.mengaplikasi.durasi})</span>
                <p className="text-gray-700 dark:text-gray-300">{pengalamanBelajar.inti.mengaplikasi.prinsip}</p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-1">
                  {(pengalamanBelajar.inti.mengaplikasi as any).kegitan?.map((k: string, i: number) => (
                    <li key={i}>{k}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-medium dark:text-gray-200">Merefleksi ({pengalamanBelajar.inti.merefleksi.durasi})</span>
                <p className="text-gray-700 dark:text-gray-300">{pengalamanBelajar.inti.merefleksi.prinsip}</p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-1">
                  {(pengalamanBelajar.inti.merefleksi as any).kegitan?.map((k: string, i: number) => (
                    <li key={i}>{k}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border-l-4 border-orange-700">
            <h4 className="font-semibold text-orange-800 dark:text-orange-300">Fase Penutup ({pengalamanBelajar.penutup.durasi})</h4>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2">
              {(pengalamanBelajar.penutup as any).kegitan?.map((k: string, i: number) => (
                <li key={i}>{k}</li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Asesmen Pembelajaran"
        icon={<span>D.</span>}
        color="bg-red-500"
        defaultOpen
      >
        <div className="space-y-4 text-sm">
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border-l-4 border-red-400">
            <h4 className="font-semibold text-red-800 dark:text-red-300">Asesmen Awal (Assessment as Learning)</h4>
            <p className="mt-2 dark:text-gray-200"><span className="font-medium">Teknik:</span> {asesmen.asesmenAwal.teknik}</p>
            <p className="mt-1 dark:text-gray-200"><span className="font-medium">Instrumen:</span> {asesmen.asesmenAwal.instrumen}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border-l-4 border-red-500">
            <h4 className="font-semibold text-red-800 dark:text-red-300">Asesmen Formatif (Assessment for Learning)</h4>
            <p className="mt-2 dark:text-gray-200"><span className="font-medium">Teknik:</span> {asesmen.asesmenFormatif.teknik}</p>
            <p className="mt-1 dark:text-gray-200"><span className="font-medium">Instrumen:</span> {asesmen.asesmenFormatif.instrumen}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border-l-4 border-red-600">
            <h4 className="font-semibold text-red-800 dark:text-red-300">Asesmen Sumatif (Assessment of Learning)</h4>
            <p className="mt-2 dark:text-gray-200"><span className="font-medium">Teknik:</span> {asesmen.asesmenSumatif.teknik}</p>
            <p className="mt-1 dark:text-gray-200"><span className="font-medium">Instrumen:</span> {asesmen.asesmenSumatif.instrumen}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border-l-4 border-emerald-400">
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">Pengayaan</h4>
            <p className="mt-2 dark:text-gray-200">{asesmen.pengayaan}</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border-l-4 border-amber-400">
            <h4 className="font-semibold text-amber-800 dark:text-amber-300">Remedial</h4>
            <p className="mt-2 dark:text-gray-200">{asesmen.remedial}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Glosarium"
        icon={<span>E.</span>}
        color="bg-pink-600"
        defaultOpen
      >
        <div className="space-y-3 text-sm">
          {glosarium?.terms?.map((term, i) => (
            <div key={i} className="border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
              <span className="font-semibold dark:text-white">{term.istilah}:</span>
              <p className="text-gray-700 dark:text-gray-300">{term.definisi}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Pertanyaan Refleksi Guru"
        icon={<span>F.</span>}
        color="bg-teal-600"
        defaultOpen
      >
        <div className="space-y-3 text-sm">
          <p className="text-gray-600 dark:text-gray-400 italic">{pertanyaanRefleksiGuru?.tujuan}</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            {pertanyaanRefleksiGuru?.pertanyaan?.map((p, i) => (
              <li key={i}>{p.replace(/^\d+\.\s*/, "")}</li>
            ))}
          </ol>
        </div>
      </SectionCard>

      <SectionCard
        title="Lembar Kerja Peserta Didik"
        icon={<span>G.</span>}
        color="bg-indigo-600"
        defaultOpen
      >
        <div className="space-y-4 text-sm">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <h4 className="font-semibold text-indigo-800 dark:text-indigo-300">{lembarKerjaPesertaDidik?.namaLembarKerja}</h4>
            <p className="mt-2 text-gray-700 dark:text-gray-300"><span className="font-medium">Instruksi:</span> {lembarKerjaPesertaDidik?.instruksi}</p>
          </div>
          <div className="space-y-4">
            {lembarKerjaPesertaDidik?.tugas?.map((tugas, i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <p className="font-medium text-gray-800 dark:text-gray-200">{tugas.nomor}. {tugas.pertanyaan}</p>
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-600 rounded min-h-[80px] text-gray-400 text-xs">
                  {tugas.ruangJawaban}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}