import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  MessageCircle, 
  BarChart3, 
  LogOut, 
  User as UserIcon,
  MapPin,
  Sparkles,
  Cloud,
  CloudUpload,
  CloudDownload,
  CheckCircle2,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { User, PembiayaanItem } from '../types';
import { LogoBmt } from './LogoBmt';
import { KelolaPembiayaan } from './KelolaPembiayaan';
import { KirimWhatsApp } from './KirimWhatsApp';
import { LaporanRekap } from './LaporanRekap';
import { INITIAL_PEMBIAYAAN } from '../data/mockData';
import { googleSignIn, initAuth, getAccessToken } from '../lib/auth';
import { loadFromGoogleDrive, saveToGoogleDrive } from '../lib/driveSync';
import { exportToGoogleSheets, importFromGoogleSheets, findSpreadsheetId } from '../lib/sheetsSync';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'pembiayaan' | 'whatsapp' | 'laporan'>('pembiayaan');
  const [pembiayaanList, setPembiayaanList] = useState<PembiayaanItem[]>(INITIAL_PEMBIAYAAN);
  const [selectedWaMember, setSelectedWaMember] = useState<PembiayaanItem | null>(null);

  // Google Drive sync state
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [isDriveConnected, setIsDriveConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string>('');

  useEffect(() => {
    initAuth(
      async (_usr, token) => {
        setDriveToken(token);
        setIsDriveConnected(true);
        // Try auto loading data from Google Drive
        setIsSyncing(true);
        const driveDb = await loadFromGoogleDrive(token);
        if (driveDb && driveDb.pembiayaan && driveDb.pembiayaan.length > 0) {
          setPembiayaanList(driveDb.pembiayaan);
          setSyncStatusMsg('Data berhasil dimuat dari Google Drive');
          setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
        }
        setIsSyncing(false);
      },
      () => {
        setIsDriveConnected(false);
        setDriveToken(null);
      }
    );
  }, []);

  const handleConnectDrive = async () => {
    try {
      setIsSyncing(true);
      setSyncStatusMsg('Menghubungkan ke Google Drive...');
      const res = await googleSignIn();
      if (res?.accessToken) {
        setDriveToken(res.accessToken);
        setIsDriveConnected(true);
        setSyncStatusMsg('Terhubung dengan Google Drive!');
        
        // Auto load or initial save
        const driveDb = await loadFromGoogleDrive(res.accessToken);
        if (driveDb && driveDb.pembiayaan && driveDb.pembiayaan.length > 0) {
          setPembiayaanList(driveDb.pembiayaan);
          setSyncStatusMsg('Database berhasil didownload dari Google Drive');
        } else {
          // Save initial list
          await saveToGoogleDrive(res.accessToken, pembiayaanList);
          setSyncStatusMsg('Database awal berhasil dibuat di Google Drive');
        }
        setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
      }
    } catch (err: any) {
      console.error('Connect Drive Error:', err);
      setSyncStatusMsg('Gagal terhubung dengan Google Drive');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveToDrive = async () => {
    let token = driveToken;
    if (!token) {
      token = await getAccessToken();
    }
    if (!token) {
      handleConnectDrive();
      return;
    }

    try {
      setIsSyncing(true);
      setSyncStatusMsg('Menyimpan database ke Google Drive...');
      const res = await saveToGoogleDrive(token, pembiayaanList);
      if (res) {
        setLastSyncTime(res.modifiedTime);
        setSyncStatusMsg('Database berhasil tersimpan di Google Drive!');
      } else {
        setSyncStatusMsg('Gagal menyimpan file ke Google Drive');
      }
    } catch (err) {
      console.error('Save Drive Error:', err);
      setSyncStatusMsg('Terjadi kesalahan saat menyimpan');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLoadFromDrive = async () => {
    let token = driveToken;
    if (!token) {
      token = await getAccessToken();
    }
    if (!token) {
      handleConnectDrive();
      return;
    }

    try {
      setIsSyncing(true);
      setSyncStatusMsg('Memuat data dari Google Drive...');
      const driveDb = await loadFromGoogleDrive(token);
      if (driveDb && driveDb.pembiayaan) {
        setPembiayaanList(driveDb.pembiayaan);
        setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
        setSyncStatusMsg('Database berhasil dimuat dari Google Drive!');
      } else {
        setSyncStatusMsg('File database belum ditemukan di Google Drive');
      }
    } catch (err) {
      console.error('Load Drive Error:', err);
      setSyncStatusMsg('Gagal memuat dari Google Drive');
    } finally {
      setIsSyncing(false);
    }
  };

  const [sheetUrl, setSheetUrl] = useState<string | null>(null);

  const handleExportToSheets = async () => {
    let token = driveToken;
    if (!token) {
      token = await getAccessToken();
    }
    if (!token) {
      handleConnectDrive();
      return;
    }

    try {
      setIsSyncing(true);
      setSyncStatusMsg('Mengeksport data ke Google Sheets...');
      const res = await exportToGoogleSheets(token, pembiayaanList);
      if (res) {
        setSheetUrl(res.spreadsheetUrl);
        setSyncStatusMsg(`Berhasil di-sync ke Google Sheets (${res.rowCount} baris)!`);
        setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
      } else {
        setSyncStatusMsg('Gagal mengeksport data ke Google Sheets.');
      }
    } catch (err) {
      console.error('Export Sheets Error:', err);
      setSyncStatusMsg('Terjadi kesalahan sync Google Sheets.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddItem = (newItem: PembiayaanItem) => {
    const updatedList = [newItem, ...pembiayaanList];
    setPembiayaanList(updatedList);
    // If drive token active, background save
    if (driveToken) {
      saveToGoogleDrive(driveToken, updatedList).then((res) => {
        if (res) setLastSyncTime(res.modifiedTime);
      });
    }
  };

  const handleSendWaFromTable = (item: PembiayaanItem) => {
    setSelectedWaMember(item);
    setActiveTab('whatsapp');
  };

  return (
    <div className="min-h-screen bg-[#f1f5f3] flex flex-col font-sans">
      
      {/* Top Header Navigation */}
      <header className="bg-[#054434] text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Logo & Office Name */}
          <div className="flex items-center gap-3">
            <LogoBmt variant="dark" size="sm" />
          </div>

          {/* AO Profile & Logout Button */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-[#054434] flex items-center justify-center font-bold text-xs">
                AO
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-bold text-white">{user.name}</div>
                <div className="text-[10px] text-amber-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{user.cabang}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="bg-red-600/90 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar / Logout</span>
            </button>
          </div>

        </div>

        {/* Tab Bar Navigation */}
        <div className="bg-[#033427] border-t border-emerald-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2">
            
            <button
              onClick={() => setActiveTab('pembiayaan')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                activeTab === 'pembiayaan'
                  ? 'bg-amber-500 text-emerald-950 shadow-md'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>1. Kelola Pembiayaan</span>
            </button>

            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                activeTab === 'whatsapp'
                  ? 'bg-[#25D366] text-white shadow-md'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>2. Kirim Tagihan via WhatsApp</span>
            </button>

            <button
              onClick={() => setActiveTab('laporan')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                activeTab === 'laporan'
                  ? 'bg-amber-500 text-emerald-950 shadow-md'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>3. Laporan & Rekap</span>
            </button>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Google Drive Integration Control Card */}
        <div className="bg-gradient-to-r from-emerald-900 via-[#054434] to-[#043327] text-white p-5 rounded-2xl shadow-md border border-amber-400/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-amber-300">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Database Google Drive</h3>
                {isDriveConnected ? (
                  <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Terhubung
                  </span>
                ) : (
                  <span className="bg-amber-500/30 text-amber-300 border border-amber-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Cloud className="w-3 h-3" /> Google Drive Available
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-100/80 mt-1">
                Data pembiayaan tersimpan langsung dalam file JSON <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-200">bmt_ugt_pasirian_database.json</code> di Google Drive.
              </p>
              {syncStatusMsg && (
                <p className="text-xs text-amber-300 font-medium mt-1">
                  Status: {syncStatusMsg} {lastSyncTime && `(Terakhir: ${lastSyncTime})`}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap w-full md:w-auto justify-end">
            {!isDriveConnected ? (
              <button
                onClick={handleConnectDrive}
                disabled={isSyncing}
                className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              >
                {isSyncing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Cloud className="w-4 h-4" />
                )}
                <span>Hubungkan Google Drive</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleLoadFromDrive}
                  disabled={isSyncing}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-3.5 py-2 rounded-xl text-xs border border-white/20 transition-all flex items-center gap-1.5"
                >
                  <CloudDownload className="w-3.5 h-3.5 text-amber-300" />
                  <span>Muat dari Drive</span>
                </button>
                <button
                  onClick={handleSaveToDrive}
                  disabled={isSyncing}
                  className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold px-3.5 py-2 rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  {isSyncing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CloudUpload className="w-3.5 h-3.5" />
                  )}
                  <span>Simpan ke Drive</span>
                </button>
                <button
                  onClick={handleExportToSheets}
                  disabled={isSyncing}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Sync Google Sheets</span>
                </button>
                {sheetUrl && (
                  <a
                    href={sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-1"
                  >
                    <span>Buka Sheet ↗</span>
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        {/* Welcome Notice Banner */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-900/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#054434] shrink-0">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                Selamat Datang, {user.name} ({user.role})
              </h2>
              <p className="text-xs text-gray-500">
                Sistem Informasi Pembiayaan & Tagihan Angsuran BMT UGT Nusantara Cabang Pasirian.
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Mode Aktif AO</span>
          </div>
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'pembiayaan' && (
          <KelolaPembiayaan
            items={pembiayaanList}
            onAddItem={handleAddItem}
            onSendWa={handleSendWaFromTable}
          />
        )}

        {activeTab === 'whatsapp' && (
          <KirimWhatsApp
            items={pembiayaanList}
            selectedItem={selectedWaMember}
          />
        )}

        {activeTab === 'laporan' && (
          <LaporanRekap items={pembiayaanList} />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        <p>© 2026 BMT UGT Nusantara Cabang Pasirian. Hak Cipta Dilindungi.</p>
      </footer>

    </div>
  );
};

