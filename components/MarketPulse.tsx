import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { getMarketTip } from '../services/geminiService';

export const MarketPulse: React.FC = () => {
  const [tip, setTip] = useState<string>("Loading market insights...");

  useEffect(() => {
    let mounted = true;
    getMarketTip().then(result => {
      if (mounted) setTip(result);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-y border-white/10 px-4 py-2 flex items-center justify-center gap-3 text-sm">
      <Zap className="w-4 h-4 text-yellow-400 animate-pulse-slow" />
      <span className="font-medium text-indigo-200">AI Insight:</span>
      <span className="text-gray-300 truncate">{tip}</span>
    </div>
  );
};
