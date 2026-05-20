import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';
import { Upload, FileType, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadArticle = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => setSelectedFile(null);

  return (
    <PageTransition>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Article</h1>
            <p className="text-gray-500">Add a new publication to your academic repository.</p>
          </div>
          <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center border border-indigo-200">
            <Sparkles className="w-4 h-4 mr-2" />
            Auto-fill with AI
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">Document File</label>
            <div 
              className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all ${
                dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
              />
              
              <AnimatePresence mode="wait">
                {selectedFile ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center text-center z-10"
                  >
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-primary-600 relative">
                      <FileType className="w-8 h-8" />
                      <button 
                        onClick={(e) => { e.preventDefault(); removeFile(); }}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 transition-colors pointer-events-auto"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center pointer-events-none"
                  >
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-gray-400">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="text-base font-medium text-gray-900 mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PDF, DOC, DOCX (max. 50MB)</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Article Title</label>
              <input type="text" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" placeholder="Enter full article title" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Journal / Conference Name</label>
              <input type="text" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" placeholder="e.g., Nature, NeurIPS" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Publication Year</label>
                <input type="number" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" placeholder="YYYY" min="1900" max="2099" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pages</label>
                <input type="text" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" placeholder="e.g., 53-57" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Co-authors</label>
              <input type="text" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" placeholder="Comma separated list of authors" />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4 border-t border-gray-100 pt-6">
            <button className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors">
              Cancel
            </button>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors">
              Save Article
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UploadArticle;
