import { motion } from 'motion/react';

export function ProjectCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-7 border-2 border-gray-100">
      <div className="space-y-4 animate-pulse">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-20 bg-gray-200 rounded skeleton" />
          <div className="h-6 w-24 bg-gray-200 rounded skeleton" />
        </div>
        
        {/* Title */}
        <div className="h-8 w-3/4 bg-gray-200 rounded skeleton" />
        <div className="h-4 w-1/2 bg-gray-200 rounded skeleton" />
        
        {/* Circular Progress */}
        <div className="flex justify-center py-6">
          <div className="w-36 h-36 rounded-full bg-gray-200 skeleton" />
        </div>
        
        {/* Progress Bar */}
        <div className="h-2.5 w-full bg-gray-200 rounded-full skeleton" />
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl skeleton" />
          ))}
        </div>
        
        {/* Button */}
        <div className="h-12 w-full bg-gray-200 rounded skeleton" />
      </div>
    </div>
  );
}

export function AnalyticsCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-7 border-2 border-gray-100">
      <div className="space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="w-14 h-14 bg-gray-200 rounded-xl skeleton" />
          <div className="h-4 w-20 bg-gray-200 rounded skeleton" />
        </div>
        <div className="h-10 w-24 bg-gray-200 rounded skeleton" />
        <div className="h-4 w-32 bg-gray-200 rounded skeleton" />
        <div className="h-3 w-full bg-gray-200 rounded-full skeleton" />
      </div>
    </div>
  );
}

export function GanttSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-8 border-2 border-gray-100">
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded skeleton" />
        <div className="h-96 w-full bg-gray-100 rounded-xl skeleton" />
      </div>
    </div>
  );
}
