import { motion } from 'motion/react';

export function PremiumLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001d31] via-[#1a1a2e] to-[#002718] flex items-center justify-center relative overflow-hidden">
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" 
        style={{ 
          animation: 'gradient-shift 8s ease infinite', 
          backgroundSize: '200% 200%' 
        }} 
      />
      
      {/* Radial glow */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          style={{ animation: 'pulse-glow 4s ease-in-out infinite' }}
        />
      </div>
      
      <motion.div 
        className="text-center relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Spinning loader with glow */}
        <div className="relative inline-block mb-8">
          {/* Outer rotating ring */}
          <motion.div 
            className="w-24 h-24 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner rotating ring */}
          <motion.div 
            className="absolute inset-2 border-4 border-transparent border-b-purple-500 border-l-pink-500 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Center logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-[#001d31] via-[#820021] to-[#002718] rounded-lg flex items-center justify-center shadow-2xl"
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-white text-lg font-serif">SP</span>
            </motion.div>
          </div>
          
          {/* Glow effect */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-2xl"
            animate={{ 
              scale: [1, 1.3, 1], 
              opacity: [0.3, 0.6, 0.3] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-white text-3xl font-serif mb-2 tracking-tight">St Paul's School</h1>
          <p className="text-white/70 text-base font-light mb-4">Educational Technology Command Center</p>
          
          {/* Loading text */}
          <motion.p 
            className="text-white/60 text-sm font-light"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Initializing project portfolio...
          </motion.p>
        </motion.div>
        
        {/* Animated progress dots */}
        <motion.div 
          className="flex items-center justify-center gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-white rounded-full"
              animate={{ 
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.15 
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
