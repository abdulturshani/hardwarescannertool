import React from 'react';
import { MarketPulse } from './components/MarketPulse';
import { RamSearch } from './components/RamSearch';
import { ChatBot } from './components/ChatBot';
import { Cpu } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <MarketPulse />
      
      <header className="border-b border-white/10 bg-gray-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-8 h-8 text-primary-500" />
            <span className="font-bold text-xl tracking-tight text-white">
              RAM<span className="text-primary-400">Tracker</span>.AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
             <span className="text-white cursor-pointer hover:text-primary-400 transition-colors">Search</span>
             <span className="hover:text-white cursor-pointer transition-colors">Price History</span>
             <span className="hover:text-white cursor-pointer transition-colors">Build Guide</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-start pt-12 pb-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <RamSearch />
      </main>

      <ChatBot />

      <footer className="border-t border-white/10 bg-gray-900 py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} RAM Tracker AI. Data provided by Gemini with Google Search.</p>
      </footer>
    </div>
  );
};

export default App;
