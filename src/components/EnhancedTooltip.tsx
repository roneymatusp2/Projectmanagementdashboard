import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface EnhancedTooltipProps {
  children: ReactNode;
  content: string | ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function EnhancedTooltip({ children, content, side = 'top' }: EnhancedTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side}
          className="glass-card border-2 border-gray-200 shadow-2xl px-4 py-3"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {typeof content === 'string' ? (
              <p className="text-sm text-gray-700 font-light">{content}</p>
            ) : (
              content
            )}
          </motion.div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
