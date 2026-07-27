import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Building, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  BarChart,
  PieChart as PieIcon,
  Download
} from 'lucide-react';
import { PembiayaanItem } from '../types';

interface LaporanRekapProps {
  items: PembiayaanItem[];
}

export const LaporanRekap: React.FC<LaporanRekapProps> = ({ items }) => {
  const totalPlafond = items.reduce((acc, curr) => acc + curr.plafond, 0);
  const totalSisa = items.reduce((acc, curr) => acc + curr.sisaAngsuran, 0);
  const totalAngsuranBulanan = items.reduce((acc, curr) => acc + curr.angsuranPerBulan, 0);

  const totalLancar = items.filter(i => i.statusKolektibilitas === 'Lancar').length;
  const totalTunggakan = items.filter(i => i.statusKolektibilitas !== 'Lancar').length;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-900/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Portfolio Plafond</p>
            <h3 className="text-xl sm:text-2xl font-black text-[#054434] mt-1">{formatRupiah(totalPlafond)}</h3>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">Cabang Pasirian</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-[#054434]">
            <Building className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-900/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sisa Outstanding</p>
            <h3 className="text-xl sm:text-2xl font-black text-amber-700 mt-1">{formatRupiah(totalSisa)}</h3>
            <span className="text-[11px] text-amber-600 font-bold mt-1 inline-block">Angsuran Berjalan</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-900/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Target Tagihan Bln Ini</p>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">{formatRupiah(totalAngsuranBulanan)}</h3>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">100% Target AO</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-900/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kolektibilitas Anggota</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">{totalLancar} / {items.length}</h3>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">{(totalLancar/items.length*100).toFixed(0)}% Lancar</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800">
            <Users className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Analytics & Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Chart Card */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-emerald-900/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-[#054434]" />
              <h3 className="font-bold text-gray-800 text-base">Distribusi Jenis Akad Pembiayaan</h3>
            </div>
            <button className="text-xs font-bold text-[#054434] bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {['Murabahah', 'Mudharabah', 'Musyarakah', 'Qardh'].map((jenis) => {
              const matched = items.filter(i => i.jenisPembiayaan === jenis);
              const count = matched.length;
              const sum = matched.reduce((a, b) => a + b.plafond, 0);
              const percent = totalPlafond > 0 ? (sum / totalPlafond) * 100 : 0;

              return (
                <div key={jenis} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-800">{jenis} ({count} Anggota)</span>
                    <span className="text-[#054434]">{formatRupiah(sum)} ({percent.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-[#054434] h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Status Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-emerald-900/10 space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <PieIcon className="w-5 h-5 text-[#d97706]" />
            <h3 className="font-bold text-gray-800 text-base">Rekap Kualitas Angsuran</h3>
          </div>

          <div className="space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <div className="font-bold text-emerald-950 text-sm">Lancar</div>
                  <div className="text-xs text-emerald-700">Pembayaran tepat waktu</div>
                </div>
              </div>
              <span className="text-lg font-black text-emerald-800">{totalLancar} Anggota</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600" />
                <div>
                  <div className="font-bold text-amber-950 text-sm">Perhatian Khusus / Tunggakan</div>
                  <div className="text-xs text-amber-700">DPK / Kurang Lancar</div>
                </div>
              </div>
              <span className="text-lg font-black text-amber-800">{totalTunggakan} Anggota</span>
            </div>
          </div>

          <div className="bg-[#fcf8f0] border border-amber-200 rounded-xl p-3 text-xs text-amber-900 leading-relaxed font-medium">
            💡 <b>Catatan Account Officer:</b> Penagihan otomatis via WhatsApp direkomendasikan dikirimkan H-3 sebelum tanggal jatuh tempo angsuran.
          </div>
        </div>

      </div>
    </div>
  );
};
