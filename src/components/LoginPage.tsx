import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Lock, 
  Eye, 
  EyeOff, 
  Calculator, 
  MessageCircle, 
  BarChart3, 
  ShieldCheck,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { LogoBmt } from './LogoBmt';
import { User } from '../types';
import { googleSignIn } from '../lib/auth';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWaModal, setShowWaModal] = useState(false);
  const [waNumber, setWaNumber] = useState('081234567890');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials as requested: username: user, password: useradmin
      if (username.trim() === 'user' && password === 'useradmin') {
        const loggedUser: User = {
          username: 'user',
          name: 'Ahmad Muzakki, S.E.',
          role: 'Account Officer (AO)',
          cabang: 'Cabang Pasirian'
        };
        onLoginSuccess(loggedUser);
      } else {
        setErrorMessage('Username atau password salah! (Username: user | Password: useradmin)');
        setIsLoading(false);
      }
    }, 600);
  };

  const handleFillDemo = () => {
    setUsername('user');
    setPassword('useradmin');
    setErrorMessage('');
  };

  const handleWaLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const loggedUser: User = {
        username: 'user_wa',
        name: 'Ahmad Muzakki (WA AO)',
        role: 'Account Officer (AO)',
        cabang: 'Cabang Pasirian'
      };
      setShowWaModal(false);
      onLoginSuccess(loggedUser);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#eaf0ed] flex items-center justify-center p-3 sm:p-6 md:p-8 font-sans">
      {/* Main Glass/Card Container */}
      <div className="w-full max-w-6xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] border border-emerald-900/10">
        
        {/* ================= LEFT SIDE (Dark Emerald Panel) ================= */}
        <div className="lg:col-span-6 xl:col-span-7 bg-gradient-to-br from-[#043d2f] via-[#054434] to-[#022b21] text-white relative flex flex-col justify-between overflow-hidden p-6 sm:p-8 md:p-10">
          
          {/* Subtle Geometric Background Pattern */}
          <div className="absolute top-0 left-0 w-48 h-48 opacity-10 pointer-events-none">
            <div className="grid grid-cols-6 gap-2 p-4">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white"></div>
              ))}
            </div>
          </div>

          <div className="relative z-10 space-y-6 sm:space-y-8">
            {/* Logo BMT UGT Nusantara */}
            <div className="pt-2">
              <LogoBmt variant="dark" size="lg" />
            </div>

            {/* Headline */}
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug tracking-tight">
                Sistem Manajemen Pembiayaan <br className="hidden sm:inline" />
                & Tagihan Angsuran
              </h2>
              <div className="w-16 h-1 bg-[#d97706] rounded-full mt-3 sm:mt-4"></div>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4 pt-2">
              {/* Feature 1 */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Calculator className="w-6 h-6 text-[#054434]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#eab308]">
                    Kelola Pembiayaan
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                    Kelola data anggota dan pembiayaan dengan mudah dan efisien.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-6 h-6 text-[#25D366] fill-[#25D366]/20" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#eab308]">
                    Kirim Tagihan via WhatsApp
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                    Kirim informasi tagihan angsuran langsung ke anggota melalui WhatsApp.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-6 h-6 text-[#054434]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#eab308]">
                    Laporan & Rekap
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                    Pantau laporan pembiayaan dan pembayaran secara real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Office Building Banner with Golden Curved Wave Arc */}
          <div className="relative mt-8 sm:mt-12 rounded-2xl overflow-hidden border border-emerald-400/20 shadow-xl group">
            <div className="h-44 sm:h-52 w-full relative overflow-hidden bg-emerald-950">
              <img 
                src="/src/assets/images/bmt_office_building_1785164827946.jpg" 
                alt="Kantor BMT UGT Nusantara Cabang Pasirian" 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback to stylized architecture graphic if image fails
                  e.currentTarget.src = "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#022b21] via-transparent to-transparent opacity-80"></div>
              
              {/* Golden Wave Divider overlay */}
              <svg 
                className="absolute bottom-0 left-0 right-0 w-full text-[#d97706] fill-current h-12 sm:h-16 pointer-events-none opacity-90"
                viewBox="0 0 1440 320" 
                preserveAspectRatio="none"
              >
                <path d="M0,224L120,202.7C240,181,480,139,720,149.3C960,160,1200,224,1320,256L1440,288L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
              </svg>

              <div className="absolute bottom-3 left-4 right-4 text-xs font-semibold text-amber-100 flex items-center justify-between z-10">
                <span className="drop-shadow-md">Kantor Cabang Pasirian - Lumajang</span>
                <span className="bg-[#054434]/90 px-2.5 py-0.5 rounded-full border border-amber-400/40 text-[10px] uppercase font-bold tracking-wider">
                  Operasional AO
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDE (White Login Form) ================= */}
        <div className="lg:col-span-6 xl:col-span-5 bg-white p-6 sm:p-10 md:p-12 flex flex-col justify-between">
          
          <div className="space-y-6 my-auto">
            {/* Header Stacked Logo */}
            <div className="text-center pt-2">
              <LogoBmt variant="stacked" />
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-3 px-4">
                Aplikasi Pembiayaan & Tagihan Angsuran <br className="hidden sm:inline" />
                Untuk Account Officer (AO)
              </p>
            </div>

            {/* Demo Helper Pill */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-medium">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Default: <b>user</b> / <b>useradmin</b></span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-2.5 py-1 rounded-md text-[11px] transition-colors shrink-0 shadow-sm"
              >
                Isi Otomatis
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3.5 rounded-r-xl flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-red-700 font-medium leading-snug">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#054434] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-11 pr-11 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#054434] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#054434] hover:bg-[#033427] active:scale-[0.99] text-white py-3.5 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-75"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Login</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider "atau" */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-gray-200 w-full"></div>
              <span className="bg-white px-3 text-xs text-gray-400 font-medium tracking-wider uppercase absolute">
                atau
              </span>
            </div>

            {/* Login dengan WhatsApp Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    const res = await googleSignIn();
                    if (res?.user) {
                      const loggedUser: User = {
                        username: res.user.email || 'user_google',
                        name: res.user.displayName || 'AO BMT UGT',
                        role: 'Account Officer (AO)',
                        cabang: 'Cabang Pasirian'
                      };
                      onLoginSuccess(loggedUser);
                    }
                  } catch (e) {
                    console.error('Google Sign In error', e);
                    setErrorMessage('Gagal login via Google Account.');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Login & Hubungkan Google Drive</span>
              </button>

              <button
                type="button"
                onClick={() => setShowWaModal(true)}
                className="w-full border border-[#054434] hover:bg-emerald-50/60 text-[#054434] py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                <span>Login dengan WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Bottom Security Footer Box */}
          <div className="mt-8 bg-[#fdfaf3] border border-[#f5e6ca] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-100/80 flex items-center justify-center shrink-0 text-[#c5912f]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#b47a1f] leading-none">
                Aman, Cepat, Terpercaya
              </h4>
              <p className="text-xs text-amber-900/70 mt-1 font-medium">
                Sistem terintegrasi untuk pelayanan terbaik
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* WhatsApp Modal */}
      {showWaModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-emerald-900/10 space-y-4">
            <div className="flex items-center gap-3 text-[#054434]">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#25D366]">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Login via WhatsApp</h3>
                <p className="text-xs text-gray-500">BMT UGT Nusantara Cab. Pasirian</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
              Sistem akan mengonfirmasi nomor WhatsApp terdaftar Anda sebagai Account Officer (AO).
            </p>

            <form onSubmit={handleWaLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nomor WhatsApp AO
                </label>
                <input
                  type="text"
                  required
                  value={waNumber}
                  onChange={(e) => setWaNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#054434]"
                  placeholder="081234567890"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWaModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#054434] hover:bg-[#033427]"
                >
                  Masuk Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
