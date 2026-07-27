export interface User {
  username: string;
  name: string;
  role: string;
  cabang: string;
}

export interface PembiayaanItem {
  id: string;
  noRekening: string;
  namaAnggota: string;
  nomorWA: string;
  alamat: string;
  jenisPembiayaan: 'Murabahah' | 'Mudharabah' | 'Musyarakah' | 'Qardh';
  plafond: number;
  sisaAngsuran: number;
  angsuranPerBulan: number;
  jatuhTempo: string;
  statusKolektibilitas: 'Lancar' | 'DPK' | 'Kurang Lancar' | 'Diragukan' | 'Macet';
  tunggakanBulan: number;
}

export interface TagihanWhatsApp {
  id: string;
  namaAnggota: string;
  nomorWA: string;
  nominalTagihan: number;
  jatuhTempo: string;
  jenisPembiayaan: string;
  pesanWhatsApp: string;
  statusKirim: 'Belum Terkirim' | 'Terkirim';
}
