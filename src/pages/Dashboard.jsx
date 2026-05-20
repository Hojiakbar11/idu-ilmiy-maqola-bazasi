import React from 'react';
import PageTransition from '../components/PageTransition';
import { BookOpen, Quote, Clock, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      {trend && (
        <p className="text-sm text-emerald-600 mt-2 flex items-center">
          <TrendingUp className="w-4 h-4 mr-1" />
          {trend}
        </p>
      )}
    </div>
    <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <PageTransition>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Dr. Smith 👋</h1>
          <p className="text-gray-500">Here's an overview of your academic publications and their impact.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Articles" value="24" icon={BookOpen} trend="+3 this year" />
          <StatCard title="Total Citations" value="1,432" icon={Quote} trend="+124 this month" />
          <StatCard title="Recent Uploads" value="2" icon={Clock} />
          <StatCard title="H-Index" value="18" icon={TrendingUp} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-96 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Publication Activity</h3>
            <div className="flex-1 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-gray-400">
              {/* Placeholder for a chart (e.g., Recharts) */}
              <TrendingUp className="w-12 h-12 mb-2 text-gray-300" />
              <p>Activity Chart Placeholder</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { title: "Deep Learning in Healthcare", type: "Published", date: "2 days ago" },
                { title: "Quantum Computing Advances", type: "Draft Updated", date: "1 week ago" },
                { title: "AI Ethics Symposium", type: "New Citation", date: "2 weeks ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span className="font-medium text-primary-600 mr-2">{activity.type}</span>
                      <span>• {activity.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
