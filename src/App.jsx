import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { 
  BookOpen, 
  Download, 
  FileText, 
  Home, 
  LogOut, 
  Plus, 
  Upload, 
  User, 
  Calendar, 
  X, 
  CheckCircle,
  FileCheck2,
  BookMarked
} from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('asosiy'); // 'asosiy' or 'maqolalarim'
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [articles, setArticles] = useState([]);

  // Form states for uploading a new article
  const [newTitle, setNewTitle] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newJournal, setNewJournal] = useState('');
  const [newPages, setNewPages] = useState('');
  const [newCoAuthors, setNewCoAuthors] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  
  // Upload and Toast states
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' or 'error'


  // Close modal on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowUploadModal(false);
      }
    };
    if (showUploadModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showUploadModal]);

  // Fetch articles from Supabase
  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setArticles(data);
    } catch (err) {
      console.error('Maqolalarni yuklashda xatolik:', err.message);
    }
  };

  React.useEffect(() => {
    if (isLoggedIn) {
      fetchArticles();
    }
  }, [isLoggedIn]);

  // Clear toast message after 4s
  React.useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };


  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('asosiy');
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle || !newYear || !selectedFile) {
      setToastMessage("Iltimos, maqola nomi, yili va faylini tanlang!");
      setToastType("error");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload file to Supabase Storage bucket 'articles'
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('articles')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('articles')
        .getPublicUrl(filePath);

      // 3. Insert into Database Table
      const { error: insertError } = await supabase
        .from('articles')
        .insert([
          {
            title: newTitle,
            publication_year: parseInt(newYear) || 2026,
            journal_name: newJournal,
            pages: newPages,
            co_authors: newCoAuthors,
            file_url: publicUrl
          }
        ]);

      if (insertError) throw insertError;

      // Reset form and close modal
      setNewTitle('');
      setNewYear('');
      setNewJournal('');
      setNewPages('');
      setNewCoAuthors('');
      setSelectedFile(null);
      setFileName('');
      setShowUploadModal(false);

      // Show success toast
      setToastMessage("Maqola muvaffaqiyatli yuklandi va saqlandi!");
      setToastType("success");

      // Refresh database articles
      fetchArticles();
    } catch (err) {
      console.error(err);
      setToastMessage(`Xatolik yuz berdi: ${err.message}`);
      setToastType("error");
    } finally {
      setIsUploading(false);
    }
  };

  // Drag and drop helper functions
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50">
          <div className={`px-6 py-4 rounded-xl shadow-lg border text-white font-semibold flex items-center space-x-3 ${
            toastType === 'success' ? 'bg-emerald-600 border-emerald-500' : 'bg-rose-600 border-rose-500'
          }`}>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      
      {/* 1. LANDING PAGE */}
      {!isLoggedIn ? (
        <div className="flex flex-col min-h-screen">
          {/* Navigation Bar */}
          <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md shadow-blue-500/20">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  O'qituvchi<span className="text-blue-600">.uz</span>
                </span>
              </div>
              <button 
                onClick={handleLogin}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 border border-blue-100 hover:border-blue-200"
              >
                <User className="w-5 h-5" />
                <span>Tizimga kirish</span>
              </button>
            </div>
          </nav>

          {/* Hero Section */}
          <main className="flex-1 max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-blue-100/50">
              <span>Yangi tizim 1.0</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight max-w-4xl mb-6">
              O'zbekiston o'qituvchilari uchun yagona <span className="text-blue-600 underline decoration-blue-200 decoration-8 underline-offset-4">ilmiy maqolalar</span> bazasi
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed font-normal">
              O'z ilmiy ishlaringizni xavfsiz saqlang, tartiblang va oson qidiring. Hammasi sodda va tushunarli.
            </p>

            <button 
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Boshlash
            </button>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-20">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-left">
                <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-950 mb-2">Oson yuklash</h3>
                <p className="text-slate-500 leading-relaxed text-sm">PDF yoki Word formatidagi maqolalaringizni bir necha soniyada yuklang.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-left">
                <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <BookMarked className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-950 mb-2">Tizimli saqlash</h3>
                <p className="text-slate-500 leading-relaxed text-sm">Yillar va mavzular bo'yicha maqolalaringizni tartibli ko'rinishda saqlang.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-left">
                <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-950 mb-2">Xavfsizlik</h3>
                <p className="text-slate-500 leading-relaxed text-sm">Sizning ilmiy ishlaringiz va shaxsiy ma'lumotlaringiz to'liq himoyalangan.</p>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-slate-100 py-8 text-center text-slate-400 text-sm">
            <p>© {new Date().getFullYear()} O'qituvchi.uz. Barcha huquqlar himoyalangan.</p>
          </footer>
        </div>
      ) : (
        
        /* 2. USER DASHBOARD (Shaxsiy kabinet) */
        <div className="flex h-screen overflow-hidden">
          
          {/* Sidebar */}
          <aside className="w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between p-6">
            <div className="space-y-8">
              {/* Logo */}
              <div className="flex items-center space-x-3 px-2">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  O'qituvchi<span className="text-blue-600">.uz</span>
                </span>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1.5">
                <button 
                  onClick={() => setActiveTab('asosiy')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'asosiy' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Asosiy oyna</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('maqolalarim')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'maqolalarim' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span>Maqolalarim</span>
                </button>
              </nav>
            </div>

            {/* Logout Option at the bottom */}
            <div>
              <div className="border-t border-slate-100 pt-4 mb-4">
                <div className="flex items-center space-x-3 px-2">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                    U
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950">Ustoz</h4>
                    <p className="text-xs text-slate-400">ID: #12940</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Chiqish</span>
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-slate-50 overflow-y-auto p-8 md:p-12">
            
            {/* View 1: Asosiy oyna */}
            {activeTab === 'asosiy' && (
              <div className="max-w-5xl mx-auto space-y-8">
                {/* Top header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Xush kelibsiz, Ustoz!</h1>
                    <p className="text-slate-500 mt-1">Ilmiy ishlaringiz bazasiga xush kelibsiz. Maqolalaringizni shu erda boshqarishingiz mumkin.</p>
                  </div>
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Yangi maqola yuklash</span>
                  </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Jami maqolalarim</p>
                      <h3 className="text-3xl font-black text-slate-950 mt-1">{articles.length} ta</h3>
                    </div>
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                      <FileText className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Oxirgi qo'shilgan</p>
                      <h3 className="text-lg font-bold text-slate-950 mt-1 truncate max-w-[200px] sm:max-w-[250px]">
                        {articles[0]?.title || "Yo'q"}
                      </h3>
                    </div>
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl flex-shrink-0">
                      <Calendar className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Recent Articles Section */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-slate-950 mb-6">Oxirgi yuklangan maqolalar</h3>
                  <div className="space-y-4">
                    {articles.slice(0, 3).map((article) => (
                      <div 
                        key={article.id}
                        className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50/40 border border-slate-100 hover:border-blue-100/50 rounded-xl transition-all group"
                      >
                        <div className="space-y-1 pr-4">
                          <h4 className="font-bold text-slate-900 group-hover:text-blue-900 transition-colors text-sm sm:text-base leading-snug">
                            {article.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-400 font-medium">{article.publication_year}-yil</p>
                        </div>
                        <a 
                          href={article.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-slate-600 hover:text-blue-600 hover:bg-blue-50 p-2.5 rounded-lg border border-slate-200 hover:border-blue-200 transition-all flex-shrink-0"
                          title="Faylni yuklab olish"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* View 2: Maqolalarim */}
            {activeTab === 'maqolalarim' && (
              <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Mening maqolalarim</h1>
                    <p className="text-slate-500 mt-1">Barcha ilmiy va uslubiy maqolalaringiz ro'yxati.</p>
                  </div>
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Yangi maqola yuklash</span>
                  </button>
                </div>

                {/* All Articles List */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
                  {articles.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-slate-400">Hozircha hech qanday maqola mavjud emas.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {articles.map((article) => (
                        <div 
                          key={article.id}
                          className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50/40 border border-slate-100 hover:border-blue-100/50 rounded-xl transition-all group"
                        >
                          <div className="space-y-1 pr-4">
                            <h4 className="font-bold text-slate-900 group-hover:text-blue-900 transition-colors text-sm sm:text-base leading-snug">
                              {article.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium">{article.publication_year}-yil</p>
                          </div>
                          <a 
                            href={article.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-slate-600 hover:text-blue-600 hover:bg-blue-50 p-2.5 rounded-lg border border-slate-200 hover:border-blue-200 transition-all flex-shrink-0"
                            title="Faylni yuklab olish"
                          >
                            <Download className="w-5 h-5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Modal: Yangi maqola yuklash */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowUploadModal(false)}></div>
          
          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative transform overflow-hidden rounded-2xl bg-white p-6 sm:p-8 text-left shadow-xl transition-all w-full max-w-lg border border-slate-100">
              
              {/* Close Button */}
              <button 
                onClick={() => setShowUploadModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-slate-950 mb-6">Maqola yuklash</h3>

              <form onSubmit={handleUploadSubmit} className="space-y-6">
                
                {/* Drag and Drop Zone */}
                <div>
                  <label htmlFor="file-upload" className="block text-sm font-semibold text-slate-700 mb-2">Hujjat faylini tanlang</label>
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      dragActive 
                        ? 'border-blue-500 bg-blue-50/50' 
                        : 'border-slate-300 bg-slate-50 hover:bg-slate-100/50'
                    }`}
                  >
                    <input 
                      id="file-upload"
                      type="file" 
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                          setFileName(e.target.files[0].name);
                        }
                      }}
                      accept=".pdf,.doc,.docx"
                    />
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-900">Faylni tortib olib keling yoki bosing</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX formats (Max. 50MB)</p>
                    
                    {fileName && (
                      <div className="mt-3 bg-blue-50 border border-blue-200 text-blue-700 text-xs px-3 py-1.5 rounded-lg inline-flex items-center space-x-1">
                        <span className="truncate max-w-[200px]">{fileName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Article Title Input */}
                <div>
                  <label htmlFor="article-title" className="block text-sm font-semibold text-slate-700 mb-2">Maqola nomi</label>
                  <input 
                    id="article-title"
                    type="text" 
                    required
                    disabled={isUploading}
                    placeholder="Masalan: Boshlang'ich sinfda o'qitish metodikasi"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60"
                  />
                </div>

                {/* Journal Name Input */}
                <div>
                  <label htmlFor="article-journal" className="block text-sm font-semibold text-slate-700 mb-2">Jurnal / Konferensiya nomi</label>
                  <input 
                    id="article-journal"
                    type="text" 
                    disabled={isUploading}
                    placeholder="Masalan: Nature, NeurIPS, O'qituvchilar jurnali"
                    value={newJournal}
                    onChange={(e) => setNewJournal(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60"
                  />
                </div>

                {/* Pages and Year Inputs Side by Side */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="article-year" className="block text-sm font-semibold text-slate-700 mb-2">Chop etilgan yili</label>
                    <input 
                      id="article-year"
                      type="number" 
                      required
                      min="1900"
                      max="2099"
                      disabled={isUploading}
                      placeholder="YYYY"
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label htmlFor="article-pages" className="block text-sm font-semibold text-slate-700 mb-2">Sahifalar</label>
                    <input 
                      id="article-pages"
                      type="text" 
                      disabled={isUploading}
                      placeholder="Masalan: 53-57"
                      value={newPages}
                      onChange={(e) => setNewPages(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Co-authors Input */}
                <div>
                  <label htmlFor="article-coauthors" className="block text-sm font-semibold text-slate-700 mb-2">Muallifdoshlar</label>
                  <input 
                    id="article-coauthors"
                    type="text" 
                    disabled={isUploading}
                    placeholder="Masalan: Ali Valiyev, Umar Eshmatov"
                    value={newCoAuthors}
                    onChange={(e) => setNewCoAuthors(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60"
                  />
                </div>


                {/* Action Buttons */}
                <div className="flex space-x-3 pt-2">
                  <button 
                    type="button"
                    disabled={isUploading}
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 py-3 text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Bekor qilish
                  </button>
                  <button 
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition-all disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isUploading ? 'Yuklanmoqda...' : 'Yuklash'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
