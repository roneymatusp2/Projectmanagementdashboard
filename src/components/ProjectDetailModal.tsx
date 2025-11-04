import { X, Calendar, Clock, Users, TrendingUp, AlertCircle, CheckCircle2, Target, Zap, Activity, Award, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

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

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  if (!project) return null;

  const hoursRemaining = project.hoursAllocated - project.hoursConsumed;
  const efficiency = ((project.hoursAllocated / project.hoursConsumed) * 100).toFixed(0);
  const burnRate = (project.hoursConsumed / 30).toFixed(2);
  const daysToCompletion = Math.ceil(hoursRemaining / parseFloat(burnRate));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const ragColors: Record<string, string> = {
    Green: 'bg-green-500',
    Amber: 'bg-amber-500',
    Red: 'bg-red-500'
  };

  const phaseColors: Record<string, string> = {
    'Inception': 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white',
    'Planning': 'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
    'Design': 'bg-gradient-to-r from-rose-600 to-rose-700 text-white',
    'Development': 'bg-gradient-to-r from-green-600 to-green-700 text-white',
    'Testing': 'bg-gradient-to-r from-amber-600 to-amber-700 text-white',
    'Deployment': 'bg-gradient-to-r from-sky-600 to-sky-700 text-white',
    'Complete': 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
  };

  const milestones = [
    { name: 'Requirements Gathering', completed: true, date: project.startDate, icon: CheckCircle2 },
    { name: 'System Architecture', completed: true, date: project.startDate, icon: CheckCircle2 },
    { name: 'UI/UX Design', completed: project.completionPercentage >= 40, date: '', icon: project.completionPercentage >= 40 ? CheckCircle2 : Clock },
    { name: 'Core Development', completed: project.completionPercentage >= 70, date: '', icon: project.completionPercentage >= 70 ? CheckCircle2 : Clock },
    { name: 'Testing & QA', completed: project.completionPercentage >= 85, date: '', icon: project.completionPercentage >= 85 ? CheckCircle2 : Clock },
    { name: 'Deployment', completed: project.completionPercentage >= 95, date: '', icon: project.completionPercentage >= 95 ? CheckCircle2 : Target },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto glass-card border-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <motion.div 
                      className="flex items-center gap-3 mb-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">{project.projectCode}</span>
                      <Badge className={`${phaseColors[project.currentPhase]} shadow-md border-0 px-4 py-1.5`}>
                        {project.currentPhase}
                      </Badge>
                      <div className={`w-4 h-4 rounded-full ${ragColors[project.ragStatus]} shadow-lg`} />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <DialogTitle className="text-3xl text-gray-900 mb-2 font-serif tracking-tight">
                        {project.projectName}
                      </DialogTitle>
                      <p className="text-gray-600 font-light">{project.clientName}</p>
                    </motion.div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-8 mt-8">
                {/* Hero Stats */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-4 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs text-blue-700 font-light">Completion</span>
                    </div>
                    <p className="text-3xl font-mono text-blue-900">{project.completionPercentage.toFixed(0)}%</p>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs text-green-700 font-light">Hours Left</span>
                    </div>
                    <p className="text-3xl font-mono text-green-900">{hoursRemaining.toFixed(0)}h</p>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs text-purple-700 font-light">Efficiency</span>
                    </div>
                    <p className="text-3xl font-mono text-purple-900">{efficiency}%</p>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center shadow">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs text-amber-700 font-light">Burn Rate</span>
                    </div>
                    <p className="text-3xl font-mono text-amber-900">{burnRate}h</p>
                  </Card>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="p-8 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 border-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-gray-700" />
                      <h3 className="text-gray-900 font-serif">Project Overview</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed font-light">{project.description}</p>
                  </Card>
                </motion.div>

                {/* Progress Overview with Circular Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="p-8 glass-card border-2">
                    <h3 className="text-gray-900 mb-6 font-serif flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Progress Analytics
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Circular Progress */}
                      <div className="flex flex-col items-center">
                        <div className="relative w-48 h-48 mb-4">
                          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                            <circle
                              cx="100"
                              cy="100"
                              r="85"
                              fill="none"
                              stroke="#F3F4F6"
                              strokeWidth="15"
                            />
                            <motion.circle
                              cx="100"
                              cy="100"
                              r="85"
                              fill="none"
                              stroke="url(#gradient-modal)"
                              strokeWidth="15"
                              strokeLinecap="round"
                              strokeDasharray={`${(project.completionPercentage / 100) * 534.07} 534.07`}
                              initial={{ strokeDasharray: "0 534.07" }}
                              animate={{ strokeDasharray: `${(project.completionPercentage / 100) * 534.07} 534.07` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                            <defs>
                              <linearGradient id="gradient-modal" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="50%" stopColor="#8B5CF6" />
                                <stop offset="100%" stopColor="#EC4899" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-mono text-gray-900">
                              {project.completionPercentage.toFixed(0)}%
                            </span>
                            <span className="text-sm text-gray-500 font-light mt-2">Complete</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 font-light">
                            Estimated completion in <span className="font-semibold text-gray-900">{daysToCompletion}</span> days
                          </p>
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span className="text-sm text-gray-600">Start Date</span>
                          </div>
                          <span className="font-mono text-gray-900">{formatDate(project.startDate)}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-gray-600">Target Date</span>
                          </div>
                          <span className="font-mono text-gray-900">{formatDate(project.targetCompletionDate)}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-purple-600" />
                            <span className="text-sm text-gray-600">Hours Consumed</span>
                          </div>
                          <span className="font-mono text-gray-900">{project.hoursConsumed.toFixed(0)}h / {project.hoursAllocated.toFixed(0)}h</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            <span className="text-sm text-gray-600">Priority Level</span>
                          </div>
                          <Badge variant={project.priority === 'Critical' ? 'destructive' : 'outline'}>
                            {project.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Milestones */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="p-8 glass-card border-2">
                    <h3 className="text-gray-900 mb-6 font-serif flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Project Milestones
                    </h3>
                    
                    <div className="space-y-4">
                      {milestones.map((milestone, index) => {
                        const Icon = milestone.icon;
                        return (
                          <motion.div
                            key={milestone.name}
                            className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                              milestone.completed 
                                ? 'bg-green-50 border-2 border-green-200' 
                                : 'bg-gray-50 border-2 border-gray-200'
                            }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + (index * 0.1) }}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              milestone.completed ? 'bg-green-600' : 'bg-gray-400'
                            }`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${milestone.completed ? 'text-green-900' : 'text-gray-600'}`}>
                                {milestone.name}
                              </p>
                              {milestone.date && (
                                <p className="text-xs text-gray-500 font-light mt-1">
                                  {formatDate(milestone.date)}
                                </p>
                              )}
                            </div>
                            {milestone.completed && (
                              <Badge className="bg-green-600 text-white">Completed</Badge>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </Card>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button 
                    onClick={onClose}
                    className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 py-6 text-base"
                    style={{ backgroundSize: '200% 200%', animation: 'gradient-shift 5s ease infinite' }}
                  >
                    Close Details
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
