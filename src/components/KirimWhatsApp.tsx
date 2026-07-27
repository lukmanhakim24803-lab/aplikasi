import React, { useState } from 'react';
import { MessageCircle, Send, Copy, Check, Smartphone, Sparkles, Building2 } from 'lucide-react';
import { PembiayaanItem } from '../types';

interface KirimWhatsAppProps {
  items: PembiayaanItem[];
  selectedItem?: PembiayaanItem | null;
}

export const KirimWhatsApp: React.FC<KirimWhatsAppProps> = ({ items, selectedItem }) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(selectedItem?.id || items[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const currentItem = items.find(i => i.id === selectedMemberId) || items[0];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const getWaMessageText = (item: PembiayaanItem) => {
    return `Assalamu'alaikum Wr. Wb.\n\nYth. Bapak/Ibu *${item.namaAnggota}*\nAnggota BMT UGT Nusantara Cabang Pasirian\n\nKami menginformasikan tagihan angsuran pembiayaan syariah Anda:\n\n📌 *Jenis Akad:* ${item.jenisPembiayaan}\n📌 *No. Rekening:* ${item.noRekening}\n📌 *Tagihan Bulan Ini:* ${formatRupiah(item.angsuranPerBulan)}\n📌 *Tanggal Jatuh Tempo:* ${item.jatuhTempo}\n📌 *Sisa Pokok Pembiayaan:* ${formatRupiah(item.sisaAngsuran)}\n\nPembayaran dapat dilakukan melalui Account Officer (AO) kami atau transfer ke rekening resmi Kantor BMT UGT Nusantara Cab. Pasirian.\n\nTerima kasih atas kepercayaan Anda.\nWassalamu'alaikum Wr. Wb.\n_Account Officer (AO) Cabang Pasirian_`;
  };

  const handleCopyMessage = () => {
    if (!currentItem) return;
    navigator.clipboard.writeText(getWaMessageText(currentItem));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWaLink = () => {
    if (!currentItem) return;
    const cleanNumber = currentItem.nomorWA.replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(getWaMessageText(currentItem));
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodedMsg}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#054434] to-[#08634c] p-6 rounded-2xl text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Fitur Tagihan Angsuran WA</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Pengiriman Pesan Tagihan Angsuran</h2>
          <p className="text-xs sm:text-sm text-emerald-100/90">
            Kirim notifikasi tagihan angsuran langsung ke WhatsApp Anggota secara resmi & personal.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20">
          <MessageCircle className="w-7 h-7 text-[#25D366] fill-[#25D366]" />
          <div>
            <div className="text-xs text-emerald-200">Terhubung Sebagai</div>
            <div className="text-sm font-bold text-white">AO Cab. Pasirian</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Select Member */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl shadow-sm border border-emerald-900/10 space-y-4">
          <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#054434]" />
            Pilih Anggota Pembiayaan
          </h3>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {items.map((item) => {
              const isSelected = item.id === selectedMemberId;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMemberId(item.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-emerald-50 border-[#054434] shadow-sm ring-1 ring-[#054434]' 
                      : 'bg-gray-50/60 border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-gray-900 text-sm">{item.namaAnggota}</div>
                    <span className="text-[11px] font-bold text-[#054434] bg-emerald-100 px-2 py-0.5 rounded-md">
                      {item.jenisPembiayaan}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono mt-1">No. Rek: {item.noRekening}</div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200/60 text-xs">
                    <span className="text-gray-600">Tagihan: <b>{formatRupiah(item.angsuranPerBulan)}</b></span>
                    <span className="text-emerald-700 font-semibold">{item.nomorWA}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: WhatsApp Preview & Send */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-emerald-900/10 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#25D366]" />
              <h3 className="font-bold text-gray-800 text-base">Pratinjau Pesan WhatsApp</h3>
            </div>
            {currentItem && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                {currentItem.namaAnggota} ({currentItem.nomorWA})
              </span>
            )}
          </div>

          {currentItem ? (
            <div className="space-y-4">
              {/* Green WA Phone Frame Preview */}
              <div className="bg-[#efeae2] p-4 rounded-2xl border border-gray-300 shadow-inner min-h-[320px] flex flex-col justify-between relative overflow-hidden">
                <div className="bg-[#005c4b] text-white px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-bold shadow-sm mb-3">
                  <span>BMT UGT Nusantara Cab. Pasirian</span>
                  <span className="bg-[#25D366] text-white px-2 py-0.5 rounded text-[10px]">Official AO</span>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md border border-emerald-900/10 text-xs sm:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-sans relative">
                  {getWaMessageText(currentItem)}
                  <div className="text-[10px] text-gray-400 text-right mt-2 font-mono">
                    10:45 AM ✓✓
                  </div>
                </div>

                <div className="text-center text-[11px] text-gray-500 mt-3 font-medium">
                  Pesan di atas akan dikirimkan otomatis ke WhatsApp anggota.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Pesan Salin!' : 'Salin Teks Pesan'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenWaLink}
                  className="w-full bg-[#25D366] hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Tagihan via WhatsApp</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              Pilih anggota di sebelah kiri untuk melihat pesan tagihan.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
