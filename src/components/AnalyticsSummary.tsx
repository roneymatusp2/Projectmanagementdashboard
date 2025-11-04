import { useEffect, useState } from 'react';
import { TrendingUp, Clock, Target, AlertTriangle, Activity, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { AnimatedCounter } from './AnimatedCounter';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Analytics {
  totalProjects: number;
  totalHoursAllocated: number;
  totalHoursConsumed: number;
  totalHoursRemaining: number;
  avgCompletion: number;
  projectsOnTrack: number;
  projectsAtRisk: number;
  projectsOverdue: number;
  efficiencyRatio: number;
}

export function AnalyticsSummary() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9c55f89c/analytics`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  if (!analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-48 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-gray-900 tracking-tight mb-2">Portfolio Analytics</h2>
        <p className="text-gray-500 font-light">Real-time performance metrics and key indicators</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Hours */}
        <Card className="p-7 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 border-2 border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-700 font-light">Total Hours</p>
                <div className="flex items-center gap-1 mt-1">
                  <Activity className="w-3 h-3 text-blue-600" />
                  <span className="text-xs text-blue-600">Tracked</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-mono text-blue-900 tracking-tight">
                <AnimatedCounter value={analytics.totalHoursConsumed} decimals={0} />
              </p>
              <p className="text-sm text-blue-600 mt-2 font-light">
                of <span className="font-semibold"><AnimatedCounter value={analytics.totalHoursAllocated} decimals={0} />h</span> allocated
              </p>
            </div>
            <div className="mt-5 h-3 bg-blue-200/50 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-1000 shadow-lg"
                style={{ width: `${(analytics.totalHoursConsumed / analytics.totalHoursAllocated) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Average Completion */}
        <Card className="p-7 bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 border-2 border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-700 font-light">Avg Progress</p>
                <div className="flex items-center gap-1 mt-1">
                  <Zap className="w-3 h-3 text-purple-600" />
                  <span className="text-xs text-purple-600">Portfolio</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-mono text-purple-900 tracking-tight">
                <AnimatedCounter value={analytics.avgCompletion} decimals={1} suffix="%" />
              </p>
              <p className="text-sm text-purple-600 mt-2 font-light">
                across <span className="font-semibold"><AnimatedCounter value={analytics.totalProjects} decimals={0} /></span> projects
              </p>
            </div>
            <div className="mt-5 h-3 bg-purple-200/50 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-purple-500 transition-all duration-1000 shadow-lg"
                style={{ width: `${analytics.avgCompletion}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Projects On Track */}
        <Card className="p-7 bg-gradient-to-br from-green-50 via-green-50 to-green-100 border-2 border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-green-700 font-light">On Track</p>
                <div className="flex items-center gap-1 mt-1">
                  <Activity className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">Health</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-mono text-green-900 tracking-tight">
                <AnimatedCounter value={analytics.projectsOnTrack} decimals={0} />
              </p>
              <p className="text-sm text-green-600 mt-2 font-light">
                <span className="font-semibold"><AnimatedCounter value={(analytics.projectsOnTrack / analytics.totalProjects) * 100} decimals={0} />%</span> healthy status
              </p>
            </div>
            <div className="flex gap-3 mt-5">
              <motion.div 
                className="flex-1 text-center bg-white/50 rounded-xl p-3 border border-green-200/50"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-xs text-green-700 font-light mb-1">Green</p>
                <p className="font-mono text-lg text-green-900">
                  <AnimatedCounter value={analytics.projectsOnTrack} decimals={0} />
                </p>
              </motion.div>
              <motion.div 
                className="flex-1 text-center bg-white/50 rounded-xl p-3 border border-amber-200/50"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-xs text-amber-700 font-light mb-1">Amber</p>
                <p className="font-mono text-lg text-amber-900">
                  <AnimatedCounter value={analytics.projectsAtRisk} decimals={0} />
                </p>
              </motion.div>
              <motion.div 
                className="flex-1 text-center bg-white/50 rounded-xl p-3 border border-red-200/50"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-xs text-red-700 font-light mb-1">Red</p>
                <p className="font-mono text-lg text-red-900">
                  <AnimatedCounter value={analytics.projectsOverdue} decimals={0} />
                </p>
              </motion.div>
            </div>
          </div>
        </Card>

        {/* Efficiency Ratio */}
        <Card className="p-7 bg-gradient-to-br from-amber-50 via-amber-50 to-amber-100 border-2 border-amber-100 hover:border-amber-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-amber-700 font-light">Efficiency</p>
                <div className="flex items-center gap-1 mt-1">
                  <Activity className="w-3 h-3 text-amber-600" />
                  <span className="text-xs text-amber-600">Ratio</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-mono text-amber-900 tracking-tight">
                <AnimatedCounter value={analytics.efficiencyRatio} decimals={0} suffix="%" />
              </p>
              <p className="text-sm text-amber-600 mt-2 font-light">
                <span className="font-semibold"><AnimatedCounter value={analytics.totalHoursRemaining} decimals={0} />h</span> remaining
              </p>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-xs text-amber-700 mb-2 font-light">
                <span>Allocated</span>
                <span>Consumed</span>
              </div>
              <div className="h-3 bg-amber-200/50 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-1000 shadow-lg"
                  style={{ width: `${(analytics.totalHoursConsumed / analytics.totalHoursAllocated) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
