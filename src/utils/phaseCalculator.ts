export interface ProjectPhase {
  id: string;
  name: string;
  minProgress: number;
  maxProgress: number;
  backgroundGradient: {
    primary: string;
    secondary: string;
    angle: number;
  };
  particleEffect: {
    type: 'matrix' | 'particles' | 'waves' | 'confetti' | 'blueprints' | 'splash' | 'launch';
    density: number;
    velocity: number;
    color: string;
  };
  transitionDuration: number;
}

export const PROJECT_PHASES: ProjectPhase[] = [
  {
    id: 'inception',
    name: 'Inception',
    minProgress: 0,
    maxProgress: 5,
    backgroundGradient: {
      primary: '#001d31',
      secondary: '#1a1a2e',
      angle: 135
    },
    particleEffect: {
      type: 'particles',
      density: 30,
      velocity: 0.5,
      color: '#4A90E2'
    },
    transitionDuration: 5000
  },
  {
    id: 'planning',
    name: 'Planning',
    minProgress: 6,
    maxProgress: 20,
    backgroundGradient: {
      primary: '#001d31',
      secondary: '#16213e',
      angle: 135
    },
    particleEffect: {
      type: 'blueprints',
      density: 20,
      velocity: 0.3,
      color: '#6B9BD1'
    },
    transitionDuration: 5000
  },
  {
    id: 'design',
    name: 'Design',
    minProgress: 21,
    maxProgress: 40,
    backgroundGradient: {
      primary: '#820021',
      secondary: '#c9184a',
      angle: 135
    },
    particleEffect: {
      type: 'splash',
      density: 25,
      velocity: 0.8,
      color: '#FF6B9D'
    },
    transitionDuration: 5000
  },
  {
    id: 'development',
    name: 'Development',
    minProgress: 41,
    maxProgress: 70,
    backgroundGradient: {
      primary: '#002718',
      secondary: '#004d00',
      angle: 135
    },
    particleEffect: {
      type: 'matrix',
      density: 40,
      velocity: 1.2,
      color: '#00FF41'
    },
    transitionDuration: 5000
  },
  {
    id: 'testing',
    name: 'Testing',
    minProgress: 71,
    maxProgress: 85,
    backgroundGradient: {
      primary: '#B8860B',
      secondary: '#DAA520',
      angle: 135
    },
    particleEffect: {
      type: 'waves',
      density: 15,
      velocity: 0.6,
      color: '#FFD700'
    },
    transitionDuration: 5000
  },
  {
    id: 'deployment',
    name: 'Deployment',
    minProgress: 86,
    maxProgress: 95,
    backgroundGradient: {
      primary: '#2F6FED',
      secondary: '#0047AB',
      angle: 135
    },
    particleEffect: {
      type: 'launch',
      density: 35,
      velocity: 1.5,
      color: '#4A9FFF'
    },
    transitionDuration: 5000
  },
  {
    id: 'complete',
    name: 'Complete',
    minProgress: 96,
    maxProgress: 100,
    backgroundGradient: {
      primary: '#7B68EE',
      secondary: '#9370DB',
      angle: 135
    },
    particleEffect: {
      type: 'confetti',
      density: 50,
      velocity: 2.0,
      color: '#DA70D6'
    },
    transitionDuration: 5000
  }
];

export function determineProjectPhase(completionPercentage: number): ProjectPhase {
  const phase = PROJECT_PHASES.find(
    p => completionPercentage >= p.minProgress && completionPercentage <= p.maxProgress
  );
  return phase || PROJECT_PHASES[0];
}

export function calculateMedianCompletion(projects: any[]): number {
  if (projects.length === 0) return 0;
  
  const sorted = [...projects]
    .map(p => p.completionPercentage)
    .sort((a, b) => a - b);
  
  const mid = Math.floor(sorted.length / 2);
  
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}
