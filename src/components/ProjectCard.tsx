import { CheckCircle2, Clock, TrendingUp, AlertCircle, BarChart3, Calendar, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface Project {
  projectCode: string;
  projectName: string;
  clientName: string;
  description: string;
  currentPhase: string;
  completionPercentage: number;
  hoursAllocated: number;
  hoursConsumed: number;
  targetCompletionDate: string;
  priority: string;
  ragStatus: string;
}

interface ProjectCardProps {
  project: Project;
  onViewDetails: () => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const hoursRemaining = project.hoursAllocated - project.hoursConsumed;
  const efficiency = ((project.hoursAllocated / project.hoursConsumed) * 100).toFixed(0);
  
  // Calculate estimated completion based on current burn rate
  const daysToCompletion = Math.ceil(hoursRemaining / (project.hoursConsumed / 30));
  
  // RAG status colors
  const ragColors = {
    Green: 'bg-green-500',
    Amber: 'bg-amber-500',
    Red: 'bg-red-500'
  };
  
  // Phase colors with enhanced gradients
  const phaseColors: Record<string, string> = {
    'Inception': 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white',
    'Planning': 'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
    'Design': 'bg-gradient-to-r from-rose-600 to-rose-700 text-white',
    'Development': 'bg-gradient-to-r from-green-600 to-green-700 text-white',
    'Testing': 'bg-gradient-to-r from-amber-600 to-amber-700 text-white',
    'Deployment': 'bg-gradient-to-r from-sky-600 to-sky-700 text-white',
    'Complete': 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
  };

  // Format date to DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Calculate progress color based on percentage
  const getProgressGradient = (percentage: number) => {
    if (percentage >= 90) return 'from-green-500 to-emerald-600';
    if (percentage >= 70) return 'from-blue-500 to-indigo-600';
    if (percentage >= 50) return 'from-purple-500 to-pink-600';
    if (percentage >= 30) return 'from-amber-500 to-orange-600';
    return 'from-rose-500 to-red-600';
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 glass-card border-2 border-transparent hover:border-blue-200">
      {/* RAG Status Indicator with Gradient */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${ragColors[project.ragStatus as keyof typeof ragColors]} shadow-lg`} />
      
      {/* Animated Background Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/30 group-hover:via-purple-50/30 group-hover:to-pink-50/30 transition-all duration-700 opacity-0 group-hover:opacity-100" />
      
      <div className="relative p-7">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{project.projectCode}</span>
              <Badge className={`${phaseColors[project.currentPhase] || 'bg-gray-600'} shadow-md border-0 px-3 py-1`}>
                {project.currentPhase}
              </Badge>
            </div>
            <h3 className="text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 font-serif tracking-tight leading-tight">
              {project.projectName}
            </h3>
            <p className="text-sm text-gray-600 font-light">{project.clientName}</p>
          </div>
        </div>

        {/* Circular Progress Indicator with Enhanced Animation */}
        <div className="flex justify-center my-8">
          <div className="relative w-36 h-36 group-hover:scale-110 transition-transform duration-500">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#F3F4F6"
                strokeWidth="10"
              />
              {/* Progress circle with animated gradient */}
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="url(#gradient-progress)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(project.completionPercentage / 100) * 326.73} 326.73`}
                className="transition-all duration-1000 ease-out drop-shadow-lg"
              />
              <defs>
                <linearGradient id="gradient-progress" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-mono text-gray-900 tracking-tight">
                {project.completionPercentage.toFixed(0)}%
              </span>
              <span className="text-xs text-gray-500 font-light mt-1">Complete</span>
            </div>
            {/* Animated ring glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-light">Progress</span>
            <span className="text-xs text-gray-900 font-mono">{project.completionPercentage.toFixed(1)}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full bg-gradient-to-r ${getProgressGradient(project.completionPercentage)} transition-all duration-1000 ease-out shadow-lg`}
              style={{ width: `${project.completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats Grid with Enhanced Design */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-gray-600 font-light">Hours Invested</span>
            </div>
            <p className="font-mono text-xl text-gray-900">{project.hoursConsumed.toFixed(0)}h</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-gray-600 font-light">Hours Remaining</span>
            </div>
            <p className="font-mono text-xl text-gray-900">{hoursRemaining.toFixed(0)}h</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-gray-600 font-light">Efficiency</span>
            </div>
            <p className="font-mono text-xl text-gray-900">{efficiency}%</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center shadow">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-gray-600 font-light">Target Date</span>
            </div>
            <p className="text-sm text-gray-900 font-medium">{formatDate(project.targetCompletionDate)}</p>
          </div>
        </div>

        {/* Priority and Status Badges */}
        <div className="flex items-center justify-between mb-6">
          <Badge 
            variant={project.priority === 'Critical' ? 'destructive' : 'outline'}
            className={`text-xs shadow-sm ${
              project.priority === 'Critical' 
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-0' 
                : 'border-gray-300'
            }`}
          >
            {project.priority} Priority
          </Badge>
          
          {project.completionPercentage >= 90 && (
            <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-light">Near Completion</span>
            </div>
          )}
        </div>

        {/* Action Button with Enhanced Styling */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            onClick={onViewDetails}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl py-6 text-base relative overflow-hidden"
            style={{ backgroundSize: '200% 200%', animation: 'gradient-shift 5s ease infinite' }}
          >
            <span className="relative z-10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Comprehensive Analytics
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </Button>
        </motion.div>
      </div>
    </Card>
  );
}
