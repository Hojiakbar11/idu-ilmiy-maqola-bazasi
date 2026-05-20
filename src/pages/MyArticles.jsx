import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';
import { Search, Filter, Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data
const mockArticles = [
  { id: 1, title: 'Attention Is All You Need', year: 2017, journal: 'NIPS', authors: 'Vaswani et al.', status: 'Published' },
  { id: 2, title: 'Deep Residual Learning for Image Recognition', year: 2016, journal: 'CVPR', authors: 'He, Zhang, Ren, Sun', status: 'Published' },
  { id: 3, title: 'Quantum Supremacy Using a Programmable Superconducting Processor', year: 2019, journal: 'Nature', authors: 'Arute et al.', status: 'Draft' },
  { id: 4, title: 'BERT: Pre-training of Deep Bidirectional Transformers', year: 2019, journal: 'NAACL', authors: 'Devlin et al.', status: 'Published' },
];

const MyArticles = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <PageTransition>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Articles</h1>
            <p className="text-gray-500">Manage, search, and organize your academic publications.</p>
          </div>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            New Upload
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search by title or author..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                <option>All Years</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                <option>All Status</option>
                <option>Published</option>
                <option>Draft</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Articles Grid/Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Article Title</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Journal</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockArticles.map((article, index) => (
                  <motion.tr 
                    key={article.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 mb-1">{article.title}</div>
                      <div className="text-sm text-gray-500">{article.authors}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{article.year}</td>
                    <td className="py-4 px-6 text-gray-600">{article.journal}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors focus:outline-none" title="Download PDF">
                        <Download className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default MyArticles;
