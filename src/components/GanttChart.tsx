import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RefreshCw, Info } from 'lucide-react';

interface Project {
  projectCode: string;
  projectName: string;
  startDate: string;
  targetCompletionDate: string;
  completionPercentage: number;
  currentPhase: string;
}

interface GanttChartProps {
  projects: Project[];
}

export function GanttChart({ projects }: GanttChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(true);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef<number>(0);

  // St. Paul's Official Colors
  const COLORS = {
    rubyRed: '#820021',
    indigoBlue: '#001D31',
    britishGreen: '#002718',
    gold: '#B8860B',
    white: '#FFFFFF',
    lightGray: '#F8F9FA',
    mediumGray: '#DEE2E6',
    darkGray: '#495057',
    textPrimary: '#212529',
    textSecondary: '#6C757D'
  };

  const phaseColors: Record<string, { primary: string; secondary: string }> = {
    'Inception': { primary: COLORS.indigoBlue, secondary: '#003152' },
    'Planning': { primary: '#004A73', secondary: '#005C8F' },
    'Design': { primary: COLORS.rubyRed, secondary: '#A5002A' },
    'Development': { primary: COLORS.britishGreen, secondary: '#004D32' },
    'Testing': { primary: COLORS.gold, secondary: '#9A7409' },
    'Deployment': { primary: '#005C8F', secondary: '#0073B1' },
    'Complete': { primary: COLORS.britishGreen, secondary: '#006B3F' }
  };

  useEffect(() => {
    if (!canvasRef.current || projects.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 2;
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Calculate timeline
    const allDates = projects.flatMap(p => [
      new Date(p.startDate).getTime(),
      new Date(p.targetCompletionDate).getTime()
    ]);
    const minDate = Math.min(...allDates);
    const maxDate = Math.max(...allDates);
    const dateRange = maxDate - minDate;

    const leftMargin = 340;
    const rightMargin = 120;
    const topMargin = 140;
    const chartWidth = width - leftMargin - rightMargin;
    const rowHeight = 120;

    const animate = () => {
      timeRef.current += 0.008;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      
      // Apply zoom and pan transformations
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Animated gradient background
      const bgGradient = ctx.createRadialGradient(width / 2, height / 3, 0, width / 2, height / 3, height);
      bgGradient.addColorStop(0, '#FAFBFC');
      bgGradient.addColorStop(0.5, '#F5F7FA');
      bgGradient.addColorStop(1, '#EEF1F5');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(-pan.x / zoom, -pan.y / zoom, width / zoom, height / zoom);

      // Subtle animated grid
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      const offsetX = (timeRef.current * 10) % gridSize;
      const offsetY = (timeRef.current * 5) % gridSize;
      
      for (let x = -offsetX; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = -offsetY; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // Floating particles
      for (let i = 0; i < 12; i++) {
        const x = (width / 12) * i + Math.sin(timeRef.current * 0.8 + i * 0.5) * 40;
        const y = 60 + Math.sin(timeRef.current * 0.6 + i * 0.8) * 25;
        const radius = 2 + Math.sin(timeRef.current * 2 + i) * 0.8;
        
        const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
        particleGradient.addColorStop(0, `${COLORS.gold}50`);
        particleGradient.addColorStop(1, `${COLORS.gold}00`);
        
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Premium header
      const headerHeight = topMargin;
      
      ctx.save();
      const headerGradient = ctx.createLinearGradient(0, 0, 0, headerHeight);
      headerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
      headerGradient.addColorStop(1, 'rgba(255, 255, 255, 0.92)');
      ctx.fillStyle = headerGradient;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 5;
      ctx.fillRect(0, 0, width, headerHeight);
      ctx.restore();

      // St. Paul's signature stripe (animated)
      const stripeHeight = 8;
      const stripeGradient = ctx.createLinearGradient(0, 0, width, 0);
      stripeGradient.addColorStop(0, COLORS.indigoBlue);
      stripeGradient.addColorStop(0.25, COLORS.rubyRed);
      stripeGradient.addColorStop(0.5, COLORS.gold);
      stripeGradient.addColorStop(0.75, COLORS.britishGreen);
      stripeGradient.addColorStop(1, COLORS.indigoBlue);
      ctx.fillStyle = stripeGradient;
      ctx.fillRect(0, 0, width, stripeHeight);

      // Animated shine on stripe
      const shinePos = (timeRef.current * 120) % (width + 200) - 100;
      const shineGradient = ctx.createLinearGradient(shinePos, 0, shinePos + 150, 0);
      shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      shineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
      shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shineGradient;
      ctx.fillRect(0, 0, width, stripeHeight);

      // Title
      ctx.fillStyle = COLORS.indigoBlue;
      ctx.font = `700 36px 'Playfair Display', serif`;
      ctx.fillText('Project Timeline Gantt', 50, 60);

      // Subtitle
      ctx.fillStyle = COLORS.textSecondary;
      ctx.font = `400 16px 'Inter', sans-serif`;
      ctx.fillText('Interactive Visualization • Zoom & Pan Enabled', 50, 95);

      // Zoom indicator
      ctx.save();
      ctx.fillStyle = COLORS.lightGray;
      ctx.strokeStyle = COLORS.mediumGray;
      ctx.lineWidth = 2;
      const zoomBadgeX = width - 180;
      const zoomBadgeY = 50;
      ctx.beginPath();
      ctx.roundRect(zoomBadgeX, zoomBadgeY, 120, 40, 8);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = COLORS.textPrimary;
      ctx.font = `600 14px 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(`Zoom: ${(zoom * 100).toFixed(0)}%`, zoomBadgeX + 60, zoomBadgeY + 25);
      ctx.textAlign = 'left';
      ctx.restore();

      // St. Paul's Shield Emblem
      const emblemX = width - 90;
      const emblemY = 25;
      const emblemSize = 70;
      
      ctx.save();
      const emblemGradient = ctx.createLinearGradient(emblemX, emblemY, emblemX + emblemSize, emblemY + emblemSize);
      emblemGradient.addColorStop(0, COLORS.indigoBlue);
      emblemGradient.addColorStop(0.4, COLORS.rubyRed);
      emblemGradient.addColorStop(0.7, COLORS.gold);
      emblemGradient.addColorStop(1, COLORS.britishGreen);
      
      ctx.fillStyle = emblemGradient;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 4;
      
      ctx.beginPath();
      ctx.moveTo(emblemX + emblemSize / 2, emblemY);
      ctx.lineTo(emblemX + emblemSize, emblemY + emblemSize * 0.25);
      ctx.lineTo(emblemX + emblemSize, emblemY + emblemSize * 0.7);
      ctx.lineTo(emblemX + emblemSize / 2, emblemY + emblemSize);
      ctx.lineTo(emblemX, emblemY + emblemSize * 0.7);
      ctx.lineTo(emblemX, emblemY + emblemSize * 0.25);
      ctx.closePath();
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.fillStyle = COLORS.white;
      ctx.font = `700 22px 'Playfair Display', serif`;
      ctx.textAlign = 'center';
      ctx.fillText('SPS', emblemX + emblemSize / 2, emblemY + emblemSize / 2 + 8);
      ctx.textAlign = 'left';
      ctx.restore();

      // Timeline grid
      const monthsToShow = Math.ceil(dateRange / (30 * 24 * 60 * 60 * 1000)) + 2;
      const today = new Date();

      ctx.font = `600 13px 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      
      for (let i = 0; i <= monthsToShow; i++) {
        const monthDate = new Date(minDate + (dateRange * i / monthsToShow));
        const x = leftMargin + (chartWidth * i / monthsToShow);
        
        const monthLabel = monthDate.toLocaleDateString('en-GB', { 
          month: 'short', 
          year: '2-digit' 
        }).toUpperCase();
        
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 4;
        ctx.fillStyle = COLORS.darkGray;
        ctx.fillText(monthLabel, x, topMargin - 10);
        ctx.restore();
        
        const gridAlpha = i === 0 || i === monthsToShow ? 0.25 : 0.08;
        ctx.strokeStyle = `rgba(0, 0, 0, ${gridAlpha})`;
        ctx.lineWidth = i === 0 || i === monthsToShow ? 2.5 : 1;
        ctx.setLineDash(i === 0 || i === monthsToShow ? [] : [5, 5]);
        ctx.beginPath();
        ctx.moveTo(x, topMargin + 15);
        ctx.lineTo(x, height - 40);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      ctx.textAlign = 'left';

      // Animated TODAY marker
      const todayX = leftMargin + ((today.getTime() - minDate) / dateRange) * chartWidth;
      if (todayX >= leftMargin && todayX <= leftMargin + chartWidth) {
        ctx.save();
        
        const pulseAlpha = 0.4 + Math.sin(timeRef.current * 4) * 0.15;
        ctx.shadowColor = `rgba(130, 0, 33, ${pulseAlpha})`;
        ctx.shadowBlur = 25;
        
        ctx.strokeStyle = COLORS.rubyRed;
        ctx.lineWidth = 4;
        ctx.setLineDash([12, 6]);
        ctx.beginPath();
        ctx.moveTo(todayX, topMargin + 15);
        ctx.lineTo(todayX, height - 40);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // TODAY badge
        const badgeWidth = 90;
        const badgeHeight = 36;
        const badgeX = todayX - badgeWidth / 2;
        const badgeY = topMargin - 65;
        
        ctx.fillStyle = COLORS.rubyRed;
        ctx.shadowBlur = 25;
        ctx.shadowOffsetY = 5;
        
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 8);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = COLORS.white;
        ctx.font = `700 15px 'Inter', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('TODAY', todayX, badgeY + 23);
        ctx.restore();
        ctx.textAlign = 'left';
      }

      // Draw projects
      projects.forEach((project, index) => {
        const y = topMargin + (index * rowHeight) + 40;
        const isHovered = hoveredProject === index;
        
        // Row background
        if (index % 2 === 0 || isHovered) {
          ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.6)';
          ctx.fillRect(0, y - 20, width, rowHeight);
        }

        // Project info panel
        const panelX = 35;
        const panelY = y - 10;
        const panelWidth = leftMargin - 60;
        const panelHeight = 90;
        
        if (isHovered) {
          ctx.save();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
          ctx.shadowBlur = 25;
          ctx.shadowOffsetY = 8;
          ctx.beginPath();
          ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 12);
          ctx.fill();
          ctx.restore();
        }

        // Project name
        ctx.fillStyle = COLORS.textPrimary;
        ctx.font = `600 18px 'Inter', sans-serif`;
        const nameY = y + 20;
        
        let projectName = project.projectName;
        const maxWidth = panelWidth - 25;
        while (ctx.measureText(projectName).width > maxWidth && projectName.length > 0) {
          projectName = projectName.slice(0, -1);
        }
        if (projectName !== project.projectName) projectName += '...';
        
        ctx.fillText(projectName, panelX + 15, nameY);
        
        // Project code badge
        const codeY = nameY + 18;
        ctx.font = `500 13px 'JetBrains Mono', monospace`;
        const codeWidth = ctx.measureText(project.projectCode).width + 24;
        
        ctx.fillStyle = COLORS.lightGray;
        ctx.strokeStyle = COLORS.mediumGray;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(panelX + 15, codeY, codeWidth, 28, 6);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = COLORS.textSecondary;
        ctx.fillText(project.projectCode, panelX + 27, codeY + 19);

        // Timeline bar
        const startDate = new Date(project.startDate).getTime();
        const endDate = new Date(project.targetCompletionDate).getTime();
        const barStartX = leftMargin + ((startDate - minDate) / dateRange) * chartWidth;
        const barWidth = Math.max(((endDate - startDate) / dateRange) * chartWidth, 60);
        const barHeight = 52;
        const barY = y;
        
        // Bar container
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
        ctx.shadowBlur = isHovered ? 30 : 18;
        ctx.shadowOffsetY = isHovered ? 10 : 5;
        
        ctx.fillStyle = COLORS.white;
        ctx.strokeStyle = COLORS.mediumGray;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(barStartX, barY, barWidth, barHeight, 14);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Progress bar
        const progressWidth = Math.max(barWidth * (project.completionPercentage / 100), 28);
        const colors = phaseColors[project.currentPhase] || phaseColors['Planning'];
        
        if (progressWidth > 0) {
          ctx.save();
          
          const gradient = ctx.createLinearGradient(barStartX, barY, barStartX + progressWidth, barY + barHeight);
          gradient.addColorStop(0, colors.primary);
          gradient.addColorStop(1, colors.secondary);
          
          ctx.fillStyle = gradient;
          ctx.shadowColor = `${colors.primary}70`;
          ctx.shadowBlur = isHovered ? 30 : 20;
          ctx.shadowOffsetY = isHovered ? 8 : 4;
          
          ctx.beginPath();
          ctx.roundRect(barStartX, barY, progressWidth, barHeight, 14);
          ctx.fill();
          
          // Shine effect
          const shine = ctx.createLinearGradient(barStartX, barY, barStartX, barY + barHeight / 2.2);
          shine.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
          shine.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = shine;
          ctx.fill();
          
          ctx.restore();
        }

        // Percentage text
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 5;
        ctx.font = `700 17px 'Inter', sans-serif`;
        
        const percentText = `${project.completionPercentage.toFixed(0)}%`;
        const textMetrics = ctx.measureText(percentText);
        
        if (project.completionPercentage > 25 && progressWidth > 80) {
          ctx.fillStyle = COLORS.white;
          ctx.fillText(percentText, barStartX + progressWidth / 2 - textMetrics.width / 2, barY + barHeight / 2 + 7);
        } else {
          ctx.fillStyle = COLORS.textPrimary;
          ctx.fillText(percentText, barStartX + barWidth / 2 - textMetrics.width / 2, barY + barHeight / 2 + 7);
        }
        ctx.restore();

        // Phase badge
        const badgeX = barStartX + barWidth + 25;
        const badgeY = barY + 12;
        
        ctx.save();
        ctx.font = `600 13px 'Inter', sans-serif`;
        const badgeText = project.currentPhase;
        const badgeMetrics = ctx.measureText(badgeText);
        const badgeWidth = badgeMetrics.width + 28;
        const badgeHeight = 30;
        
        ctx.fillStyle = colors.primary;
        ctx.shadowColor = `${colors.primary}50`;
        ctx.shadowBlur = 18;
        
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 7);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = COLORS.white;
        ctx.fillText(badgeText, badgeX + 14, badgeY + 20);
        ctx.restore();
      });

      // Footer
      ctx.fillStyle = COLORS.textSecondary;
      ctx.font = `400 13px 'Inter', sans-serif`;
      ctx.fillText('St. Paul\'s School • Educational Technology Command Center', 50, height - 15);
      
      ctx.textAlign = 'right';
      ctx.fillText(`Mr Nascimento • AI Solutions Developer`, width - 50, height - 15);
      ctx.textAlign = 'left';

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        setPan({ x: pan.x + dx, y: pan.y + dy });
        setDragStart({ x: e.clientX, y: e.clientY });
      } else {
        const rect = canvas.getBoundingClientRect();
        const mouseY = (e.clientY - rect.top - pan.y) / zoom;
        const topMargin = 140 + 40;
        const rowHeight = 120;
        
        const hoveredIndex = Math.floor((mouseY - topMargin) / rowHeight);
        if (hoveredIndex >= 0 && hoveredIndex < projects.length) {
          setHoveredProject(hoveredIndex);
          canvas.style.cursor = 'pointer';
        } else {
          setHoveredProject(null);
          canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      canvas.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      canvas.style.cursor = 'grab';
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.95 : 1.05;
      const newZoom = Math.min(Math.max(zoom * delta, 0.5), 3);
      setZoom(newZoom);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.style.cursor = 'grab';

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', updateSize);
    };
  }, [projects, hoveredProject, zoom, pan, isDragging, dragStart]);

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom * 0.8, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative"
    >
      <Card className="relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-gray-300 hover:shadow-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 pointer-events-none" />
        
        {/* Info Banner */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-[#001D31] via-[#820021] to-[#002718] text-white px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border border-white/20"
            >
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4" />
                <span className="text-sm tracking-wide">
                  Zoom with scroll • Click and drag to explore • Interactive timeline
                </span>
                <button
                  onClick={() => setShowInfo(false)}
                  className="ml-2 text-white/80 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control Panel */}
        <div className="absolute bottom-6 right-6 z-10 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleZoomOut}
            className="bg-white/95 backdrop-blur-md border-2 border-gray-200 text-gray-700 p-3 rounded-xl shadow-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleZoomIn}
            className="bg-white/95 backdrop-blur-md border-2 border-gray-200 text-gray-700 p-3 rounded-xl shadow-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="bg-white/95 backdrop-blur-md border-2 border-gray-200 text-gray-700 p-3 rounded-xl shadow-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
            title="Reset View"
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFullscreen}
            className="bg-gradient-to-r from-[#001D31] to-[#820021] text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-white/20"
            title={isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </motion.button>
        </div>

        <canvas
          ref={canvasRef}
          className="relative w-full"
          style={{ 
            minHeight: isFullscreen ? '100vh' : '800px',
            height: isFullscreen ? '100vh' : '800px',
            display: 'block'
          }}
        />
      </Card>
    </motion.div>
  );
}
