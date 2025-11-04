import { useEffect, useState } from 'react';
import { Menu, FileText, BarChart3, Settings, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './components/ui/button';
import { PhaseBackground } from './components/PhaseBackground';
import { ProjectCard } from './components/ProjectCard';
import { SharePointPanel } from './components/SharePointPanel';
import { AnalyticsSummary } from './components/AnalyticsSummary';
import { GanttChart } from './components/GanttChart';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ScrollProgress } from './components/ScrollProgress';
import { PremiumLoader } from './components/PremiumLoader';
import { determineProjectPhase, calculateMedianCompletion } from './utils/phaseCalculator';
import { projectId, publicAnonKey } from './utils/supabase/info';

interface Project {
  projectCode: string;
  projectName: string;
  clientName: string;
  description: string;
  currentPhase: string;
  completionPercentage: number;
  hoursAllocated: number;
  hoursConsumed: number;
  startDate: string;
  targetCompletionDate: string;
  priority: string;
  ragStatus: string;
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharePointOpen, setSharePointOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      // Initialize database with projects
      const initResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9c55f89c/init-database`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      
      if (initResponse.ok) {
        setInitialized(true);
        fetchProjects();
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9c55f89c/projects`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate median completion for background phase
  const medianCompletion = projects.length > 0 
    ? calculateMedianCompletion(projects) 
    : 0;
  
  const currentPhase = determineProjectPhase(medianCompletion);

  if (loading) {
    return <PremiumLoader />;
  }

  return (
    <div className="min-h-screen relative">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />
      
      {/* Dynamic Phase Background */}
      <PhaseBackground phase={currentPhase} />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Top Navigation */}
        <nav className="glass-nav sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              {/* Logo and Title */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#001d31] via-[#820021] to-[#002718] rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
                  <span className="text-white text-xl font-serif">SP</span>
                </div>
                <div>
                  <h1 className="text-gray-900 tracking-tight">St Paul's School</h1>
                  <p className="text-sm text-gray-600 font-light">Educational Technology Command Center</p>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-6">
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-gray-900"
                  onClick={() => setSharePointOpen(true)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  SharePoint
                </Button>
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setSharePointOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              {/* User Profile */}
              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                  <p className="text-sm text-gray-900 tracking-tight">Mr Nascimento</p>
                  <p className="text-xs text-gray-500 font-light">AI Solutions Developer</p>
                </div>
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 animate-pulse-glow">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
          {/* Welcome Section */}
          <motion.div 
            className="glass-card rounded-3xl p-10 shadow-2xl relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ backgroundSize: '200% 200%', animation: 'gradient-shift 8s ease infinite' }}></div>
            
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-block">
                  <h2 className="text-gray-900 mb-1 tracking-tight inline-block gradient-text" style={{ WebkitTextFillColor: 'transparent' }}>
                    Welcome back, Mr Nascimento!
                  </h2>
                </div>
                <p className="text-gray-600 text-lg font-light">
                  Orchestrating <span className="font-semibold text-[#001d31]">{projects.length}</span> concurrent educational technology initiatives
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>All systems operational</span>
                </div>
              </div>
              <div className="text-left md:text-right space-y-3">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105" style={{ backgroundSize: '200% 200%', animation: 'gradient-shift 5s ease infinite' }}>
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  <div className="text-left">
                    <p className="text-xs font-light opacity-90">Current Phase</p>
                    <p className="font-semibold tracking-wide">{currentPhase.name}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl px-4 py-2 inline-block">
                  <p className="text-sm text-gray-600">
                    <span className="font-mono text-2xl text-[#001d31]">{medianCompletion.toFixed(1)}%</span>
                    <span className="text-xs ml-2">Portfolio Completion</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Analytics Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <AnalyticsSummary />
          </motion.div>

          {/* Project Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-gray-900 tracking-tight">Active Project Portfolio</h2>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                  </motion.div>
                </div>
                <p className="text-gray-500 font-light">Real-time tracking and performance analytics</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-6 relative overflow-hidden group">
                    <span className="relative z-10 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Initialize New Project
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </Button>
                </motion.div>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.projectCode}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.4 + (index * 0.1),
                    ease: "easeOut"
                  }}
                >
                  <ProjectCard
                    project={project}
                    onViewDetails={() => {
                      setSelectedProject(project);
                      setDetailModalOpen(true);
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Gantt Chart Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            <div className="mb-8">
              <h2 className="text-gray-900 tracking-tight mb-2">Interactive Project Timeline</h2>
              <p className="text-gray-500 font-light">Comprehensive Gantt visualization with milestone tracking</p>
            </div>
            <GanttChart projects={projects} />
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="glass-card rounded-3xl p-8 text-center shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-[#001d31] via-[#820021] to-[#002718] rounded-lg flex items-center justify-center shadow"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-white text-sm font-serif">SP</span>
              </motion.div>
              <span className="text-gray-900 font-serif tracking-tight">St Paul's School</span>
            </div>
            <p className="text-sm text-gray-600 font-light">
              São Paulo, Brazil • Educational Technology Command Center
            </p>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 font-light">
                Dashboard Version 2.0 • Last Updated: {new Date().toLocaleDateString('en-GB', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </motion.div>
        </main>
      </div>

      {/* SharePoint Panel */}
      <SharePointPanel 
        isOpen={sharePointOpen} 
        onClose={() => setSharePointOpen(false)} 
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedProject(null);
        }}
      />
    </div>
  );
}
