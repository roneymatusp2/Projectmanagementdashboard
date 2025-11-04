import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({ 
  value, 
  duration = 1.5, 
  decimals = 0,
  suffix = '',
  className = ''
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;
    const diff = endValue - startValue;

    const animate = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000; // Convert to seconds
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease out)
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (diff * eased);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayValue.toFixed(decimals)}{suffix}
    </motion.span>
  );
}
