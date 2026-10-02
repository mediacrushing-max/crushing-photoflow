import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Users,
  Camera,
  Clock,
  MapPin,
  Phone,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  FolderUp,
  LogOut,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Sparkles,
  PhoneCall,
  Edit,
  Trash2,
  CalendarDays,
  ListFilter,
  UserPlus,
  RefreshCw,
  SlidersHorizontal,
  FileText
} from 'lucide-react';

const STORAGE_KEY_AUTH = 'crushing_photoflow_auth';
const STORAGE_KEY_PHOTOGRAPHERS = 'crushing_photoflow_photographers';
const STORAGE_KEY_SCHEDULES = 'crushing_photoflow_schedules';

// Initial Mock Photographers
const INITIAL_PHOTOGRAPHERS = [
  {
    id: 'p-1',
    name: 'Nguyễn Văn Hải',
    phone: '0912345678',
    password: '123',
    joinedDate: '2024-01-10',
    notes: 'Chuyên chụp phóng sự cưới, ngoại cảnh'
  },
  {
    id: 'p-2',
    name: 'Trần Minh Quân',
    phone: '0977889900',
    password: '123',
    joinedDate: '2024-02-15',
    notes: 'Chuyên chụp tiệc, kỷ yếu, sự kiện'
  },
  {
    id: 'p-3',
    name: 'Lê Hoàng Nam',
    phone: '0933221100',
    password: '123',
    joinedDate: '2024-03-01',
    notes: 'Chuyên chụp Studio baby, beauty lookbook'
  }
];

// Helper to format ISO date string relative to current date
const getRelativeDateStr = (dayOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString().split('T')[0];
};

const INITIAL_SCHEDULES = [
  {
    id: 'sch-1',
    title: 'Chụp ảnh Cưới Ngoại Cảnh Ba Vì',
    clientName: 'Anh Tuấn & Chị Mai',
    clientPhone: '0945678901',
    location: 'Khu du lịch Ba Vì Resort, Hà Nội',
    date: getRelativeDateStr(0), // Today
    time: '08:30',
    photographerId: 'p-1',
    notes: 'Concept nhẹ nhàng vintage. Chuẩn bị 3 váy cưới & 2 vest.',
    rawStatus: 'submitted',
    rawLink: 'https://drive.google.com/drive/folders/sample-bavi-wedding',
    editStatus: 'editing',
    deliveredLink: '',
    createdAt: '2024-05-01'
  },
  {
    id: 'sch-2',
    title: 'Tiệc Sinh Nhật Bé Bảo Nam 1 Tuổi',
    clientName: 'Chị Lan Hương',
    clientPhone: '0981234567',
    location: 'Nhà hàng Trống Đồng Palace, Cầu Giấy',
    date: getRelativeDateStr(0), // Today
    time: '18:00',
    photographerId: 'p-2',
    notes: 'Chụp tiệc đón khách và khoảnh khắc thổi nến.',
    rawStatus: 'pending',
    rawLink: '',
    editStatus: 'pending',
    deliveredLink: '',
    createdAt: '2024-05-02'
  },
  {
    id: 'sch-3',
    title: 'Lookbook Thời Trang Thu Đông 2024',
    clientName: 'Shop Quần Áo Zenda (Ms. Vy)',
    clientPhone: '0911223344',
    location: 'Studio chi nhánh 2 - 45 Thái Hà, Đống Đa',
    date: getRelativeDateStr(2),
    time: '13:30',
    photographerId: 'p-3',
    notes: 'Cần ánh sáng high-key, chụp 15 set đồ.',
    rawStatus: 'pending',
    rawLink: '',
    editStatus: 'pending',
    deliveredLink: '',
    createdAt: '2024-05-03'
  },
  {
    id: 'sch-4',
    title: 'Chụp Kỷ Yếu Lớp 12A3 THPT Chuyên',
    clientName: 'Bí thư Nguyễn Đức Hiếu',
    clientPhone: '0934567812',
    location: 'Hoàng Thành Thăng Long & Văn Miếu',
    date: getRelativeDateStr(5),
    time: '07:30',
    photographerId: 'p-1',
    notes: 'Gói chụp cả ngày kèm flycam.',
    rawStatus: 'pending',
    rawLink: '',
    editStatus: 'pending',
    deliveredLink: '',
    createdAt: '2024-05-04'
  },
  {
    id: 'sch-5',
    title: 'Chụp Doanh Nhân & Profile Cá Nhân',
    clientName: 'Giám đốc Trần Văn Hải',
    clientPhone: '0966554433',
    location: 'Keangnam Landmark 72, Nam Từ Liêm',
    date: getRelativeDateStr(-2),
    time: '09:00',
    photographerId: 'p-2',
    notes: 'Tông màu sang trọng, lịch lãm.',
    rawStatus: 'submitted',
    rawLink: 'https://drive.google.com/drive/folders/sample-profile-keangnam',
    editStatus: 'delivered',
    deliveredLink: 'https://photos.google.com/share/sample-edited-profile-delivered',
    createdAt: '2024-04-28'
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [photographers, setPhotographers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PHOTOGRAPHERS);
      return saved ? JSON.parse(saved) : INITIAL_PHOTOGRAPHERS;
    } catch {
      return INITIAL_PHOTOGRAPHERS;
    }
  });

  const [schedules, setSchedules] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCHEDULES);
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
    } catch {
      return INITIAL_SCHEDULES;
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PHOTOGRAPHERS, JSON.stringify(photographers));
  }, [photographers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  }, [currentUser]);

  const handleLogin = (phoneOrAdmin, password) => {
    // Admin Credential check
    if (phoneOrAdmin.trim() === '0988888888' && password.trim() === 'admin123') {
      const user = { role: 'admin', name: 'Quản Lý Studio', phone: '0988888888' };
      setCurrentUser(user);
      return { success: true };
    }

    // Photographer Credential check
    const found = photographers.find(
      (p) => p.phone === phoneOrAdmin.trim() && p.password === password.trim()
    );

    if (found) {
      const user = {
        role: 'photographer',
        id: found.id,
        name: found.name,
        phone: found.phone
      };
      setCurrentUser(user);
      return { success: true };
    }

    return {
      success: false,
      message: 'Số điện thoại hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!'
    };
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdatePassword = (photographerId, newPassword) => {
    setPhotographers((prev) =>
      prev.map((p) => (p.id === photographerId ? { ...p, password: newPassword } : p))
    );
  };

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} demoAccounts={photographers} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onUpdatePassword={handleUpdatePassword}
      />
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
        {currentUser.role === 'admin' ? (
          <AdminDashboard
            schedules={schedules}
            setSchedules={setSchedules}
            photographers={photographers}
            setPhotographers={setPhotographers}
          />
        ) : (
          <PhotographerView
            currentUser={currentUser}
            schedules={schedules}
            setSchedules={setSchedules}
          />
        )}
      </main>
      <footer className="text-center py-4 text-xs text-slate-500 border-t border-slate-900 bg-slate-950">
        Hệ Thống Quản Lý Lịch Chụp Ảnh Chuyên Nghiệp • Crushing PhotoFlow Studio
      </footer>
    </div>
  );
}

function Navbar({ currentUser, onLogout, onUpdatePassword }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-3">
        {/* Fixed Brand Logo */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
          <Camera className="w-5 h-5 text-white" />
        </div>

        <div>
          <h1 className="font-bold text-lg leading-tight tracking-wide text-white flex items-center gap-2">
            Crushing PhotoFlow
            <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">
              Studio
            </span>
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">Hệ thống điều phối & phân lịch chụp ảnh</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="text-right">
          <div className="text-sm font-medium text-slate-200 flex items-center justify-end gap-1.5">
            {currentUser.role === 'admin' ? (
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            ) : (
              <UserCheck className="w-4 h-4 text-emerald-400" />
            )}
            <span>{currentUser.name}</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {currentUser.role === 'admin' ? 'Quản Lý Studio' : `Thợ Chụp • ${currentUser.phone}`}
          </span>
        </div>

        {currentUser.role === 'photographer' && (
          <button
            onClick={() => setShowPasswordModal(true)}
            title="Đổi mật khẩu tài khoản"
            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
          >
            <KeyRound className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal
          photographerId={currentUser.id}
          onClose={() => setShowPasswordModal(false)}
          onSave={onUpdatePassword}
        />
      )}
    </header>
  );
}

function LoginView({ onLogin, demoAccounts }) {
  const [phone, setPhone] = useState('0988888888');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = onLogin(phone, password);
    if (!res.success) {
      setError(res.message);
    }
  };

  const quickFill = (p, pwd) => {
    setPhone(p);
    setPassword(pwd);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 to-amber-500 shadow-xl shadow-indigo-500/20 mb-3 w-14 h-14 items-center justify-center mx-auto">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Crushing PhotoFlow</h2>
          <p className="text-slate-400 text-sm mt-1">Đăng nhập Quản lý hoặc Thợ chụp ảnh</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Số điện thoại
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Nhập số điện thoại..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Mật khẩu
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mật khẩu của bạn..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-indigo-500 hover:from-indigo-600 to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/30 transition transform active:scale-98 flex items-center justify-center gap-2"
          >
            Đăng Nhập Hệ Thống
          </button>
        </form>

        {/* Demo Fast Access Section */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Chọn nhanh tài khoản mẫu:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => quickFill('0988888888', 'admin123')}
              className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition"
            >
              <div className="font-semibold text-amber-400">👑 Quản Lý Studio</div>
              <div className="text-slate-400 text-[11px]">Pass: admin123</div>
            </button>
            {demoAccounts.slice(0, 3).map((photographer) => (
              <button
                key={photographer.id}
                onClick={() => quickFill(photographer.phone, photographer.password)}
                className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition"
              >
                <div className="font-semibold text-indigo-300 truncate">📸 {photographer.name}</div>
                <div className="text-slate-400 text-[11px] truncate">Pass: {photographer.password}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ schedules, setSchedules, photographers, setPhotographers }) {
  const [activeTab, setActiveTab] = useState('schedules'); // 'schedules' | 'calendar' | 'photographers'
  const [scheduleSearch, setScheduleSearch] = useState('');
  const [filterPhotographer, setFilterPhotographer] = useState('all');
  const [filterRawStatus, setFilterRawStatus] = useState('all');
  const [filterEditStatus, setFilterEditStatus] = useState('all');

  // Modal States
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showPhotographerModal, setShowPhotographerModal] = useState(false);

  // Photographer Search State in Admin
  const [photographerSearch, setPhotographerSearch] = useState('');

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);

  // Map of Photographers for fast lookup
  const photographerMap = useMemo(() => {
    const map = {};
    photographers.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [photographers]);

  // Filtered schedules for schedule list tab
  const filteredSchedules = useMemo(() => {
    return schedules.filter((sch) => {
      const term = scheduleSearch.toLowerCase();
      const matchSearch =
        sch.title.toLowerCase().includes(term) ||
        sch.clientName.toLowerCase().includes(term) ||
        sch.clientPhone.includes(term) ||
        sch.location.toLowerCase().includes(term);

      if (!matchSearch) return false;
      if (filterPhotographer !== 'all' && sch.photographerId !== filterPhotographer) return false;
      if (filterRawStatus !== 'all' && sch.rawStatus !== filterRawStatus) return false;
      if (filterEditStatus !== 'all' && sch.editStatus !== filterEditStatus) return false;

      return true;
    });
  }, [schedules, scheduleSearch, filterPhotographer, filterRawStatus, filterEditStatus]);

  // Filtered photographers by name or phone
  const filteredPhotographers = useMemo(() => {
    const term = photographerSearch.toLowerCase().trim();
    if (!term) return photographers;
    return photographers.filter(
      (p) => p.name.toLowerCase().includes(term) || p.phone.includes(term)
    );
  }, [photographers, photographerSearch]);

  const handleDeleteSchedule = (id) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveSchedule = (scheduleData) => {
    if (editingSchedule) {
      setSchedules((prev) =>
        prev.map((s) => (s.id === editingSchedule.id ? { ...scheduleData, id: s.id } : s))
      );
    } else {
      const newSchedule = {
        ...scheduleData,
        id: `sch-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setSchedules((prev) => [newSchedule, ...prev]);
    }
    setShowScheduleModal(false);
    setEditingSchedule(null);
  };

  const handleAddPhotographer = (newP) => {
    setPhotographers((prev) => [
      ...prev,
      {
        ...newP,
        id: `p-${Date.now()}`,
        password: newP.password || '123',
        joinedDate: new Date().toISOString().split('T')[0]
      }
    ]);
    setShowPhotographerModal(false);
  };

  const handleResetPhotographerPassword = (id) => {
    setPhotographers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, password: '123' } : p))
    );
  };

  const handleDeletePhotographer = (id) => {
    setPhotographers((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('schedules')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition ${
              activeTab === 'schedules'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Danh Sách Lịch ({schedules.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition ${
              activeTab === 'calendar'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Lịch Tháng / Năm</span>
          </button>

          <button
            onClick={() => setActiveTab('photographers')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition ${
              activeTab === 'photographers'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Quản Lý Thợ ({photographers.length})</span>
          </button>
        </div>

        <div>
          {activeTab === 'photographers' ? (
            <button
              onClick={() => setShowPhotographerModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Thêm Thợ Mới</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingSchedule(null);
                setShowScheduleModal(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Lịch Chụp Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Schedules List */}
      {activeTab === 'schedules' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên lịch, khách, SĐT..."
                value={scheduleSearch}
                onChange={(e) => setScheduleSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={filterPhotographer}
              onChange={(e) => setFilterPhotographer(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Tất cả thợ chụp</option>
              {photographers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.phone})
                </option>
              ))}
            </select>

            <select
              value={filterRawStatus}
              onChange={(e) => setFilterRawStatus(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Tiến độ RAW: Tất cả</option>
              <option value="pending">Thợ chưa nộp file RAW</option>
              <option value="submitted">Thợ đã nộp file RAW</option>
            </select>

            <select
              value={filterEditStatus}
              onChange={(e) => setFilterEditStatus(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Tiến độ hậu kỳ: Tất cả</option>
              <option value="pending">Chưa chỉnh sửa</option>
              <option value="editing">Đang xử lý ảnh</option>
              <option value="delivered">Đã sửa & trả khách</option>
            </select>
          </div>

          {/* Schedule Cards */}
          <div className="space-y-3">
            {filteredSchedules.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400">
                <CalendarDays className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                <p className="font-medium text-slate-300">Không tìm thấy lịch chụp nào phù hợp</p>
                <p className="text-xs text-slate-500 mt-1">Hãy thử xóa bộ lọc hoặc thêm ca chụp mới.</p>
              </div>
            ) : (
              filteredSchedules.map((item) => {
                const assignedPhotographer = photographerMap[item.photographerId];

                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.date} • {item.time}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="flex items-center gap-1 text-slate-300">
                            <Users className="w-3.5 h-3.5 text-emerald-400" />
                            <strong>{item.clientName}</strong> ({item.clientPhone})
                          </span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            {item.location}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-end lg:self-center">
                        <button
                          onClick={() => {
                            setEditingSchedule(item);
                            setShowScheduleModal(true);
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl flex items-center gap-1 border border-slate-700 transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(item.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-1 border border-red-500/20 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>

                    {/* Hiển thị Ghi chú buổi chụp phía Quản lý */}
                    {item.notes && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200/90 flex items-start gap-2.5">
                        <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-300">Ghi chú lịch chụp: </strong>
                          <span className="text-slate-200 leading-relaxed">{item.notes}</span>
                        </div>
                      </div>
                    )}

                    {/* Photographer assignment & 2 tracking pipelines */}
                    <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      {/* Thợ phụ trách */}
                      <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="text-slate-400 text-[11px]">Thợ chụp phụ trách:</div>
                          <div className="font-semibold text-white mt-0.5">
                            {assignedPhotographer ? assignedPhotographer.name : 'Chưa phân công'}
                          </div>
                          <div className="text-slate-400 font-mono text-[11px]">
                            {assignedPhotographer ? assignedPhotographer.phone : ''}
                          </div>
                        </div>
                        <Camera className="w-5 h-5 text-indigo-400 shrink-0" />
                      </div>

                      {/* Tiến độ file RAW của thợ */}
                      <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-800">
                        <div className="text-slate-400 text-[11px] mb-1">File RAW từ thợ chụp:</div>
                        {item.rawStatus === 'submitted' ? (
                          <div className="flex items-center justify-between gap-1">
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Đã nhận file RAW
                            </span>
                            {item.rawLink && (
                              <a
                                href={item.rawLink}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded text-[11px] flex items-center gap-1 font-mono transition"
                              >
                                <ExternalLink className="w-3 h-3" /> Xem RAW
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" /> Thợ chưa nộp RAW
                          </span>
                        )}
                      </div>

                      {/* Tiến độ sửa ảnh & bàn giao khách */}
                      <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-800">
                        <div className="text-slate-400 text-[11px] mb-1">Tiến độ ảnh trả khách:</div>
                        <div className="flex items-center justify-between gap-1">
                          {item.editStatus === 'delivered' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Đã bàn giao khách
                            </span>
                          ) : item.editStatus === 'editing' ? (
                            <span className="inline-flex items-center gap-1 text-sky-400 font-medium">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang hậu kỳ ảnh
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                              <Clock className="w-3.5 h-3.5" /> Chưa chỉnh sửa
                            </span>
                          )}

                          {item.deliveredLink && (
                            <a
                              href={item.deliveredLink}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-0.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded text-[11px] flex items-center gap-1 font-mono transition"
                            >
                              <ExternalLink className="w-3 h-3" /> Link Khách
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Month / Year Calendar Grid */}
      {activeTab === 'calendar' && (
        <CalendarView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          schedules={schedules}
          photographerMap={photographerMap}
          onSelectDay={(day, daySchedules) => {
            setSelectedDayEvents({ day, events: daySchedules });
          }}
        />
      )}

      {/* Tab 3: Photographer Management & Search */}
      {activeTab === 'photographers' && (
        <div className="space-y-4">
          {/* Photographer Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm thợ theo TÊN hoặc SỐ ĐIỆN THOẠI..."
                value={photographerSearch}
                onChange={(e) => setPhotographerSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {photographerSearch && (
                <button
                  onClick={() => setPhotographerSearch('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Đang hiển thị:</span>
              <strong className="text-indigo-400 font-semibold">{filteredPhotographers.length}</strong> /{' '}
              {photographers.length} thợ chụp
            </div>
          </div>

          {/* Photographers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPhotographers.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
                <Users className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                <p className="font-medium text-slate-300">Không tìm thấy thợ chụp phù hợp</p>
                <p className="text-xs text-slate-500 mt-1">Kiểm tra lại tên hoặc số điện thoại tìm kiếm.</p>
              </div>
            ) : (
              filteredPhotographers.map((p) => {
                const assignedCount = schedules.filter((s) => s.photographerId === p.id).length;

                return (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-bold text-white text-base">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-base leading-tight">{p.name}</h4>
                            <span className="text-xs text-indigo-400 font-mono flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" /> {p.phone}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeletePhotographer(p.id)}
                          title="Xóa thợ chụp này"
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {p.notes && (
                        <p className="text-xs text-slate-400 mt-3 p-2 bg-slate-800/60 rounded-lg border border-slate-800">
                          {p.notes}
                        </p>
                      )}

                      <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-slate-800/40 rounded-lg">
                          <div className="text-slate-500 text-[10px] uppercase font-semibold">Tổng ca chụp</div>
                          <div className="text-sm font-bold text-slate-200 mt-0.5">{assignedCount} ca</div>
                        </div>
                        <div className="p-2 bg-slate-800/40 rounded-lg">
                          <div className="text-slate-500 text-[10px] uppercase font-semibold">Mật khẩu hiện tại</div>
                          <div className="text-sm font-mono font-bold text-amber-400 mt-0.5">{p.password}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleResetPhotographerPassword(p.id)}
                        className="text-slate-400 hover:text-amber-400 flex items-center gap-1 transition"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Đặt lại pass (123)</span>
                      </button>

                      <a
                        href={`tel:${p.phone}`}
                        className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg font-medium flex items-center gap-1 transition"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Gọi điện</span>
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Schedule Edit/Add Modal */}
      {showScheduleModal && (
        <ScheduleFormModal
          schedule={editingSchedule}
          photographers={photographers}
          onClose={() => {
            setShowScheduleModal(false);
            setEditingSchedule(null);
          }}
          onSave={handleSaveSchedule}
        />
      )}

      {/* Photographer Add Modal */}
      {showPhotographerModal && (
        <PhotographerFormModal
          onClose={() => setShowPhotographerModal(false)}
          onSave={handleAddPhotographer}
        />
      )}

      {/* Day Events Detail Modal (Calendar) */}
      {selectedDayEvents && (
        <DayEventsModal
          data={selectedDayEvents}
          photographerMap={photographerMap}
          onClose={() => setSelectedDayEvents(null)}
        />
      )}
    </div>
  );
}

function CalendarView({ currentDate, setCurrentDate, schedules, photographerMap, onSelectDay }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Group schedules by date "YYYY-MM-DD"
  const schedulesByDate = useMemo(() => {
    const map = {};
    schedules.forEach((sch) => {
      if (!map[sch.date]) {
        map[sch.date] = [];
      }
      map[sch.date].push(sch);
    });
    return map;
  }, [schedules]);

  // Generate calendar grid dates
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    // Adjust so Monday is first day of week: Monday=0, Sunday=6
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month padding
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, d);
      const dateStr = prevDate.toISOString().split('T')[0];
      days.push({
        dateNumber: d,
        dateStr,
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const thisDate = new Date(year, month, d);
      // Ensure local date formatting string YYYY-MM-DD
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${year}-${mm}-${dd}`;
      days.push({
        dateNumber: d,
        dateStr,
        isCurrentMonth: true
      });
    }

    // Next month padding to reach multiple of 7
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      const dateStr = nextDate.toISOString().split('T')[0];
      days.push({
        dateNumber: i,
        dateStr,
        isCurrentMonth: false
      });
    }

    return days;
  }, [year, month]);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
      {/* Month Navigation Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="w-6 h-6 text-indigo-400" />
          <h3 className="text-xl font-bold text-white tracking-wide">
            {monthNames[month]}, Năm {year}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl border border-slate-700 transition"
          >
            Hôm nay
          </button>
          <div className="flex items-center bg-slate-800 rounded-xl border border-slate-700 p-0.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
              title="Tháng trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
              title="Tháng sau"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Labels (Mon to Sun) */}
      <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 py-2 border-b border-slate-800/80 uppercase tracking-wider">
        <span>Thứ 2</span>
        <span>Thứ 3</span>
        <span>Thứ 4</span>
        <span>Thứ 5</span>
        <span>Thứ 6</span>
        <span className="text-indigo-400">Thứ 7</span>
        <span className="text-amber-400">Chủ Nhật</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {calendarDays.map((dayObj, idx) => {
          const events = schedulesByDate[dayObj.dateStr] || [];
          const hasEvents = events.length > 0;
          const isToday = dayObj.dateStr === todayStr;

          return (
            <div
              key={idx}
              onClick={() => hasEvents && onSelectDay(dayObj.dateStr, events)}
              className={`min-h-[75px] sm:min-h-[95px] p-1.5 sm:p-2 rounded-xl border transition flex flex-col justify-between ${
                !dayObj.isCurrentMonth
                  ? 'bg-slate-950/40 border-slate-900/60 text-slate-600 opacity-40'
                  : isToday
                  ? 'bg-indigo-950/30 border-indigo-500 shadow-inner'
                  : 'bg-slate-800/50 border-slate-800 hover:border-slate-700'
              } ${hasEvents ? 'cursor-pointer hover:bg-slate-800' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold rounded-lg px-1.5 py-0.5 ${
                    isToday
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : dayObj.isCurrentMonth
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  {dayObj.dateNumber}
                </span>

                {/* Event count badge */}
                {hasEvents && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {events.length} ca
                  </span>
                )}
              </div>

              {/* Event indicators snippet */}
              <div className="space-y-1 mt-1 overflow-hidden">
                {events.slice(0, 2).map((ev) => (
                  <div
                    key={ev.id}
                    className="truncate text-[10px] px-1.5 py-0.5 rounded bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 font-medium"
                    title={`${ev.time} - ${ev.title}`}
                  >
                    {ev.time} {ev.title}
                  </div>
                ))}
                {events.length > 2 && (
                  <div className="text-[9px] text-slate-400 pl-1 font-medium">
                    +{events.length - 2} ca nữa...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayEventsModal({ data, photographerMap, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl p-6 relative max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-400" />
              <span>Danh Sách Ca Chụp Ngày: {data.day}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Tổng cộng {data.events.length} ca chụp trong ngày này</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {data.events.map((item) => {
            const p = photographerMap[item.photographerId];

            return (
              <div key={item.id} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                    {item.time}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                  <div>
                    <span className="text-slate-400">Khách hàng:</span> <strong>{item.clientName}</strong>
                    <div className="font-mono text-slate-400">{item.clientPhone}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Địa chỉ:</span>
                    <div>{item.location}</div>
                  </div>
                </div>

                {/* Hiển thị Ghi chú trong bảng xem ngày */}
                {item.notes && (
                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-200/90 flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300">Ghi chú: </strong>
                      <span className="text-slate-200">{item.notes}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    Thợ: <strong className="text-indigo-300">{p ? p.name : 'Chưa phân công'}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.rawStatus === 'submitted' ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã gửi RAW
                      </span>
                    ) : (
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Chưa gửi RAW
                      </span>
                    )}

                    {item.deliveredLink && (
                      <a
                        href={item.deliveredLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-0.5 bg-indigo-600/30 text-indigo-300 rounded text-[11px] font-mono hover:underline"
                      >
                        Link trả khách
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

function ScheduleFormModal({ schedule, photographers, onClose, onSave }) {
  const [title, setTitle] = useState(schedule ? schedule.title : '');
  const [clientName, setClientName] = useState(schedule ? schedule.clientName : '');
  const [clientPhone, setClientPhone] = useState(schedule ? schedule.clientPhone : '');
  const [location, setLocation] = useState(schedule ? schedule.location : '');
  const [date, setDate] = useState(schedule ? schedule.date : new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(schedule ? schedule.time : '09:00');
  const [photographerId, setPhotographerId] = useState(
    schedule ? schedule.photographerId : (photographers[0] ? photographers[0].id : '')
  );
  const [notes, setNotes] = useState(schedule ? schedule.notes : '');
  const [rawStatus, setRawStatus] = useState(schedule ? schedule.rawStatus : 'pending');
  const [rawLink, setRawLink] = useState(schedule ? schedule.rawLink : '');
  const [editStatus, setEditStatus] = useState(schedule ? schedule.editStatus : 'pending');
  const [deliveredLink, setDeliveredLink] = useState(schedule ? schedule.deliveredLink || '' : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      clientName,
      clientPhone,
      location,
      date,
      time,
      photographerId,
      notes,
      rawStatus,
      rawLink,
      editStatus,
      deliveredLink
    });
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-400" />
            <span>{schedule ? 'Chỉnh Sửa Ca Chụp' : 'Thêm Ca Chụp Mới'}</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tên Lịch Chụp / Gói Chụp *
            </label>
            <input
              type="text"
              required
              placeholder="VD: Chụp Phóng Sự Cưới, Lookbook Thời Trang..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tên Khách Hàng *
              </label>
              <input
                type="text"
                required
                placeholder="VD: Anh Minh & Chị Mai"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Số Điện Thoại Khách Hàng *
              </label>
              <input
                type="tel"
                required
                placeholder="VD: 0912345678"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Địa Chỉ / Địa Điểm Chụp *
            </label>
            <input
              type="text"
              required
              placeholder="VD: Phim trường Santorini Park, Yên Sở, Hoàng Mai"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Ngày Chụp *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Giờ Chụp *
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Phân Công Thợ Chụp *
              </label>
              <select
                value={photographerId}
                onChange={(e) => setPhotographerId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              >
                {photographers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.phone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Ghi Chú Chi Tiết Buổi Chụp
            </label>
            <textarea
              rows={2}
              placeholder="Yêu cầu trang phục, đạo cụ, thời lượng, lưu ý đặc biệt..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status Pipelines */}
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Theo Dõi Tiến Độ Sản Phẩm
            </h4>

            {/* RAW status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Trạng Thái File RAW (Thợ gửi)
                </label>
                <select
                  value={rawStatus}
                  onChange={(e) => setRawStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                >
                  <option value="pending">Chưa gửi file RAW</option>
                  <option value="submitted">Thợ đã gửi file RAW</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Link Lưu File RAW (Drive / Cloud)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={rawLink}
                  onChange={(e) => setRawLink(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-mono"
                />
              </div>
            </div>

            {/* Delivered status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700/60">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Trạng Thái Ảnh Sửa & Bàn Giao Khách
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                >
                  <option value="pending">Chưa chỉnh sửa</option>
                  <option value="editing">Đang xử lý / Hậu kỳ</option>
                  <option value="delivered">Đã sửa xong & Trả khách hàng</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Link Ảnh Sản Phẩm Trả Khách
                </label>
                <input
                  type="url"
                  placeholder="https://photos.google.com/... hoặc Drive"
                  value={deliveredLink}
                  onChange={(e) => setDeliveredLink(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-indigo-600/30"
            >
              Lưu Thông Tin Lịch Chụp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PhotographerFormModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('123');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      phone: phone.trim(),
      password: password.trim() || '123',
      notes: notes.trim()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <span>Thêm Thợ Chụp Ảnh Mới</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Họ Và Tên Thợ Chụp *
            </label>
            <input
              type="text"
              required
              placeholder="VD: Nguyễn Văn Nam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Số Điện Thoại (Đồng thời là Tên Đăng Nhập) *
            </label>
            <input
              type="tel"
              required
              placeholder="VD: 0987654321"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mật Khẩu Ban Đầu (Mặc định: 123)
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 font-mono"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Thợ chụp có thể tự đổi mật khẩu sau khi đăng nhập.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Ghi Chú Chuyên Môn / Thiết Bị
            </label>
            <textarea
              rows={2}
              placeholder="VD: Sony A7IV, chuyên cưới phóng sự, ngoại cảnh..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-emerald-600/30"
            >
              Tạo Tài Khoản Thợ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PhotographerView({ currentUser, schedules, setSchedules }) {
  const mySchedules = useMemo(() => {
    return schedules.filter((s) => s.photographerId === currentUser.id);
  }, [schedules, currentUser.id]);

  const [searchTerm, setSearchTerm] = useState('');
  // Unified status filter as requested: 'all' | 'ongoing' | 'upcoming' | 'raw_pending' | 'raw_done'
  const [statusFilter, setStatusFilter] = useState('all');

  // Submit RAW Modal State
  const [submittingRawSchedule, setSubmittingRawSchedule] = useState(null);
  const [rawInputLink, setRawInputLink] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Unified Filter logic
  const filteredSchedules = useMemo(() => {
    return mySchedules.filter((sch) => {
      // Search by title, client name, phone or location
      const term = searchTerm.toLowerCase();
      const matchSearch =
        sch.title.toLowerCase().includes(term) ||
        sch.clientName.toLowerCase().includes(term) ||
        sch.clientPhone.includes(term) ||
        sch.location.toLowerCase().includes(term);

      if (!matchSearch) return false;

      if (statusFilter === 'all') return true;
      if (statusFilter === 'ongoing') return sch.date === todayStr;
      if (statusFilter === 'upcoming') return sch.date > todayStr;
      if (statusFilter === 'raw_pending') return sch.rawStatus !== 'submitted';
      if (statusFilter === 'raw_done') return sch.rawStatus === 'submitted';

      return true;
    });
  }, [mySchedules, searchTerm, statusFilter, todayStr]);

  // Tab counters
  const ongoingCount = mySchedules.filter((s) => s.date === todayStr).length;
  const upcomingCount = mySchedules.filter((s) => s.date > todayStr).length;
  const rawPendingCount = mySchedules.filter((s) => s.rawStatus !== 'submitted').length;
  const rawDoneCount = mySchedules.filter((s) => s.rawStatus === 'submitted').length;

  const handleOpenRawModal = (sch) => {
    setSubmittingRawSchedule(sch);
    setRawInputLink(sch.rawLink || '');
  };

  const handleSaveRawSubmission = (e) => {
    e.preventDefault();
    if (!submittingRawSchedule) return;

    setSchedules((prev) =>
      prev.map((item) =>
        item.id === submittingRawSchedule.id
          ? {
              ...item,
              rawStatus: 'submitted',
              rawLink: rawInputLink.trim()
            }
          : item
      )
    );
    setSubmittingRawSchedule(null);
    setRawInputLink('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Cổng Thông Tin Thợ Chụp Ảnh
          </span>
          <h2 className="text-xl font-bold text-white mt-1.5">
            Xin chào, {currentUser.name}! 📸
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Xem lịch chụp được phân công và cập nhật link nộp file RAW cho studio.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
          <Camera className="w-5 h-5 text-indigo-400" />
          <div className="text-right">
            <div className="text-xs text-slate-400">Tổng ca của bạn</div>
            <div className="text-lg font-bold text-white leading-tight">{mySchedules.length} ca</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar for Photographer */}
      <div className="space-y-3">
        {/* Search input (retained as required) */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khách, số điện thoại, địa điểm chụp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Unified Filter Tabs: Tất cả, Đang diễn ra, Sắp diễn ra, Chưa gửi RAW, Đã hoàn thành gửi RAW */}
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              statusFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/70'
            }`}
          >
            <span>Tất cả</span>
            <span className="opacity-70">({mySchedules.length})</span>
          </button>

          <button
            onClick={() => setStatusFilter('ongoing')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              statusFilter === 'ongoing'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/70'
            }`}
          >
            <span>Đang diễn ra (Hôm nay)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/30 text-indigo-200">
              {ongoingCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              statusFilter === 'upcoming'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/70'
            }`}
          >
            <span>Sắp diễn ra</span>
            <span className="opacity-70">({upcomingCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('raw_pending')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              statusFilter === 'raw_pending'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-800 text-amber-300/80 hover:text-amber-200 hover:bg-slate-700 border border-slate-700/70'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Chưa gửi file RAW</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/30 text-amber-200">
              {rawPendingCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('raw_done')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              statusFilter === 'raw_done'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-emerald-400/80 hover:text-emerald-300 hover:bg-slate-700 border border-slate-700/70'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Đã hoàn thành gửi RAW</span>
            <span className="opacity-70">({rawDoneCount})</span>
          </button>
        </div>
      </div>

      {/* Photographer's Schedule Cards List */}
      <div className="space-y-4">
        {filteredSchedules.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
            <Camera className="w-12 h-12 mx-auto text-slate-600 mb-2" />
            <p className="text-base font-medium text-slate-300">Không có lịch chụp nào</p>
            <p className="text-xs text-slate-500 mt-1">
              Thử thay đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm.
            </p>
          </div>
        ) : (
          filteredSchedules.map((item) => {
            const isToday = item.date === todayStr;
            const isFuture = item.date > todayStr;
            const isPast = item.date < todayStr;

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition ${
                  isToday
                    ? 'bg-slate-900 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                      {isToday && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500 text-white">
                          🔥 HÔM NAY
                        </span>
                      )}
                      {isFuture && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
                          Sắp diễn ra
                        </span>
                      )}
                      {isPast && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-950 text-slate-500">
                          Đã qua
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-indigo-400 text-xs sm:text-sm font-semibold mt-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {item.date} • {item.time}
                      </span>
                    </div>
                  </div>

                  <div>
                    {item.rawStatus === 'submitted' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Đã nộp file RAW
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        Chưa nộp file RAW
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="space-y-1.5">
                    <div className="text-slate-400">Thông tin khách hàng:</div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="font-mono text-slate-300">{item.clientPhone}</span>
                      <a
                        href={`tel:${item.clientPhone}`}
                        className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded text-xs font-medium flex items-center gap-1 ml-2 transition"
                      >
                        <PhoneCall className="w-3 h-3" /> Gọi ngay
                      </a>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-slate-400">Địa chỉ buổi chụp:</div>
                    <div className="text-slate-200 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item.location}</span>
                    </div>
                  </div>
                </div>

                {item.notes && (
                  <div className="mt-3 p-2.5 bg-slate-800/60 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-amber-300">Ghi chú từ studio:</strong> {item.notes}
                    </span>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-400">
                    {item.rawLink ? (
                      <span className="flex items-center gap-1.5 truncate max-w-md">
                        Link RAW đã nộp:
                        <a
                          href={item.rawLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-400 hover:underline truncate"
                        >
                          {item.rawLink}
                        </a>
                      </span>
                    ) : (
                      <span>Vui lòng tải ảnh lên Google Drive/Onebox rồi dán link tại đây</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenRawModal(item)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs sm:text-sm font-medium rounded-xl transition shadow-md shadow-indigo-600/20 active:scale-98"
                  >
                    <FolderUp className="w-4 h-4" />
                    <span>{item.rawStatus === 'submitted' ? 'Cập Nhật Lại Link RAW' : 'Nộp File RAW'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RAW Submission Modal */}
      {submittingRawSchedule && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderUp className="w-5 h-5 text-indigo-400" />
                <span>Nộp File RAW Buổi Chụp</span>
              </h3>
              <button
                onClick={() => setSubmittingRawSchedule(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 text-xs text-slate-300 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
              <div className="font-semibold text-white">{submittingRawSchedule.title}</div>
              <div className="text-slate-400 mt-0.5">
                Khách: {submittingRawSchedule.clientName} • Ngày {submittingRawSchedule.date}
              </div>
            </div>

            <form onSubmit={handleSaveRawSubmission} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Dán đường dẫn Link Google Drive / Cloud file RAW *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={rawInputLink}
                  onChange={(e) => setRawInputLink(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  💡 Hãy mở quyền truy cập link để bộ phận Hậu kỳ studio có thể tải ảnh về xử lý.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubmittingRawSchedule(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-xl transition shadow-lg shadow-emerald-600/30"
                >
                  Xác Nhận Đã Gửi RAW
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ChangePasswordModal({ photographerId, onClose, onSave }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPassword) {
      setMsg({ type: 'error', text: 'Vui lòng nhập mật khẩu mới' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'Mật khẩu xác nhận không trùng khớp!' });
      return;
    }

    onSave(photographerId, newPassword);
    setMsg({ type: 'success', text: 'Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới.' });
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl p-6 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <span>Đổi Mật Khẩu Cá Nhân</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {msg.text && (
          <div
            className={`mb-4 p-2.5 rounded-xl text-xs ${
              msg.type === 'error'
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mật khẩu mới *
            </label>
            <input
              type="password"
              required
              placeholder="Nhập mật khẩu mới..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nhập lại mật khẩu mới *
            </label>
            <input
              type="password"
              required
              placeholder="Xác nhận mật khẩu..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl transition"
            >
              Lưu Mật Khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}