import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle,
  Building2,
  Phone,
  FileText
} from 'lucide-react';
import { PembiayaanItem } from '../types';

interface KelolaPembiayaanProps {
  items: PembiayaanItem[];
  onAddItem: (item: PembiayaanItem) => void;
  onSendWa: (item: PembiayaanItem) => void;
}

export const KelolaPembiayaan: React.FC<KelolaPembiayaanProps> = ({ items, onAddItem, onSendWa }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for new financing
  const [formData, setFormData] = useState({
    namaAnggota: '',
    nomorWA: '',
    alamat: '',
    jenisPembiayaan: 'Murabahah' as 'Murabahah' | 'Mudharabah' | 'Musyarakah' | 'Qardh',
    plafond: 10000000,
    angsuranPerBulan: 1000000,
    jatuhTempo: '2026-08-10',
  });

  const filteredItems = items.filter(item => {
    const matchesSearch = item.namaAnggota.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.noRekening.includes(searchTerm) ||
                          item.alamat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Semua' || item.statusKolektibilitas === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: PembiayaanItem = {
      id: `PB-${Math.floor(100 + Math.random() * 900)}`,
      noRekening: `108.02.00${Math.floor(600 + Math.random() * 300)}`,
      namaAnggota: formData.namaAnggota,
      nomorWA: formData.nomorWA.startsWith('62') ? formData.nomorWA : `62${formData.nomorWA.replace(/^0/, '')}`,
      alamat: formData.alamat,
      jenisPembiayaan: formData.jenisPembiayaan,
      plafond: Number(formData.plafond),
      sisaAngsuran: Number(formData.plafond),
      angsuranPerBulan: Number(formData.angsuranPerBulan),
      jatuhTempo: formData.jatuhTempo,
      statusKolektibilitas: 'Lancar',
      tunggakanBulan: 0,
    };
    onAddItem(newItem);
    setShowAddModal(false);
    setFormData({
      namaAnggota: '',
      nomorWA: '',
      alamat: '',
      jenisPembiayaan: 'Murabahah',
      plafond: 10000000,
      angsuranPerBulan: 1000000,
      jatuhTempo: '2026-08-10',
    });
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Lancar':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3.5 h-3.5" /> Lancar</span>;
      case 'DPK':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-fit"><Clock className="w-3.5 h-3.5" /> DPK (Dalam Perhatian)</span>;
      case 'Kurang Lancar':
        return <span className="bg-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-fit"><AlertTriangle className="w-3.5 h-3.5" /> Kurang Lancar</span>;
      default:
        return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-fit"><XCircle className="w-3.5 h-3.5" /> {status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-emerald-900/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, no. rekening, atau alamat..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#054434]"
          />
        </div>

        {/* Filters and Add button */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 shrink-0">
            <Filter className="w-4 h-4 text-[#054434]" />
            <span>Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#054434] focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Lancar">Lancar</option>
              <option value="DPK">DPK</option>
              <option value="Kurang Lancar">Kurang Lancar</option>
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#054434] hover:bg-[#033427] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 shrink-0 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pembiayaan</span>
          </button>
        </div>
      </div>

      {/* Loan Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-900/10 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-[#054434]" />
            <h3 className="font-bold text-gray-800 text-base">
              Daftar Pembiayaan Anggota ({filteredItems.length})
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-medium">BMT UGT Nusantara - Cabang Pasirian</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-emerald-50/60 text-[#054434] font-bold border-b border-emerald-100 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">No. Rekening & Anggota</th>
                <th className="p-4">Akad / Jenis</th>
                <th className="p-4">Plafond</th>
                <th className="p-4">Sisa Angsuran</th>
                <th className="p-4">Angsuran / Bln</th>
                <th className="p-4">Jatuh Tempo</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Aksi Tagihan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-900 text-sm">{item.namaAnggota}</div>
                    <div className="text-xs text-gray-500 font-mono flex items-center gap-1 mt-0.5">
                      <span>No: {item.noRekening}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 truncate max-w-[200px] mt-0.5">
                      {item.alamat}
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-emerald-900">
                    <span className="bg-emerald-50 border border-emerald-200 text-[#054434] px-2.5 py-1 rounded-lg text-xs font-bold inline-block">
                      {item.jenisPembiayaan}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-gray-800">
                    {formatRupiah(item.plafond)}
                  </td>
                  <td className="p-4 font-semibold text-amber-700">
                    {formatRupiah(item.sisaAngsuran)}
                  </td>
                  <td className="p-4 font-bold text-gray-900">
                    {formatRupiah(item.angsuranPerBulan)}
                  </td>
                  <td className="p-4 text-gray-600 font-medium whitespace-nowrap">
                    {item.jatuhTempo}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(item.statusKolektibilitas)}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => onSendWa(item)}
                      className="bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 mx-auto transition-transform active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>Tagih WA</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    Tidak ditemukan data pembiayaan yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Financing */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-emerald-900/10 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-lg text-[#054434]">Tambah Pembiayaan Anggota Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmitNew} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Anggota</label>
                <input
                  type="text"
                  required
                  value={formData.namaAnggota}
                  onChange={(e) => setFormData({ ...formData, namaAnggota: e.target.value })}
                  placeholder="Contoh: Muhammad Ali"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#054434]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={formData.nomorWA}
                    onChange={(e) => setFormData({ ...formData, nomorWA: e.target.value })}
                    placeholder="081234567890"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#054434]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Jenis Pembiayaan</label>
                  <select
                    value={formData.jenisPembiayaan}
                    onChange={(e) => setFormData({ ...formData, jenisPembiayaan: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#054434]"
                  >
                    <option value="Murabahah">Murabahah</option>
                    <option value="Mudharabah">Mudharabah</option>
                    <option value="Musyarakah">Musyarakah</option>
                    <option value="Qardh">Qardh</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Dusun Pasirian, Lumajang"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#054434]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Plafond (Rp)</label>
                  <input
                    type="number"
                    required
                    value={formData.plafond}
                    onChange={(e) => setFormData({ ...formData, plafond: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#054434]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Angsuran Per Bulan (Rp)</label>
                  <input
                    type="number"
                    required
                    value={formData.angsuranPerBulan}
                    onChange={(e) => setFormData({ ...formData, angsuranPerBulan: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#054434]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Jatuh Tempo Per Bulan</label>
                <input
                  type="date"
                  required
                  value={formData.jatuhTempo}
                  onChange={(e) => setFormData({ ...formData, jatuhTempo: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#054434]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#054434] hover:bg-[#033427] rounded-xl shadow-md"
                >
                  Simpan Pembiayaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
