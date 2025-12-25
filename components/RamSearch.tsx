import React, { useState } from 'react';
import { Search, Loader2, ExternalLink, ShoppingCart, DollarSign, TrendingDown, ChevronDown, SlidersHorizontal, CheckCircle2, Store } from 'lucide-react';
import { scanRamDeals } from '../services/geminiService';
import { Deal, SearchFilters } from '../types';

export const RamSearch: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [deals, setDeals] = useState<Deal[] | null>(null);
  
  // Default Filters
  const [filters, setFilters] = useState<SearchFilters>({
    size: '32GB',
    ddr: 'DDR5',
    speed: '6000MHz',
    retailer: 'all'
  });

  const handleScan = async () => {
    setLoading(true);
    setDeals(null);
    
    // Set initial loading message based on filter
    if (filters.retailer === 'all') {
      setLoadingStage('Scanning Amazon & Newegg...');
    } else if (filters.retailer === 'amazon') {
      setLoadingStage('Scanning Amazon...');
    } else {
      setLoadingStage('Scanning Newegg...');
    }
    
    try {
      const data = await scanRamDeals(filters);
      setDeals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  const handleDdrChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDdr = e.target.value;
    setFilters(prev => ({
      ...prev,
      ddr: newDdr,
      // Reset speed to a valid default for the new DDR type
      speed: newDdr === 'DDR5' ? '6000MHz' : '3200MHz'
    }));
  };

  const availableSpeeds = filters.ddr === 'DDR5' 
    ? ['4800MHz', '5200MHz', '5600MHz', '6000MHz', '6400MHz', '7200MHz']
    : ['3200MHz', '3600MHz', '4000MHz', '4400MHz'];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-10">
      {/* Header & Action */}
      <div className="text-center space-y-6">
        <h2 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
          RAM Price Scanner
        </h2>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          AI-powered deep search to find the lowest prices across major retailers.
        </p>
        
        {/* Filters Section */}
        <div className="flex flex-wrap items-center justify-center gap-4 max-w-3xl mx-auto bg-gray-900/60 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
           <div className="flex items-center gap-2 text-gray-400 mr-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">Specs:</span>
           </div>
           
           {/* Size Filter */}
           <div className="relative group">
             <select 
               value={filters.size}
               onChange={(e) => setFilters({...filters, size: e.target.value})}
               className="appearance-none bg-gray-800 text-white pl-4 pr-10 py-2.5 rounded-xl border border-gray-700 hover:border-primary-500 focus:border-primary-500 focus:outline-none cursor-pointer transition-colors min-w-[100px]"
             >
               <option value="8GB">8GB</option>
               <option value="16GB">16GB</option>
               <option value="32GB">32GB</option>
               <option value="64GB">64GB</option>
             </select>
             <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-white transition-colors" />
           </div>

           {/* DDR Filter */}
           <div className="relative group">
             <select 
               value={filters.ddr}
               onChange={handleDdrChange}
               className="appearance-none bg-gray-800 text-white pl-4 pr-10 py-2.5 rounded-xl border border-gray-700 hover:border-primary-500 focus:border-primary-500 focus:outline-none cursor-pointer transition-colors min-w-[100px]"
             >
               <option value="DDR4">DDR4</option>
               <option value="DDR5">DDR5</option>
             </select>
             <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-white transition-colors" />
           </div>

           {/* Speed Filter */}
           <div className="relative group">
             <select 
               value={filters.speed}
               onChange={(e) => setFilters({...filters, speed: e.target.value})}
               className="appearance-none bg-gray-800 text-white pl-4 pr-10 py-2.5 rounded-xl border border-gray-700 hover:border-primary-500 focus:border-primary-500 focus:outline-none cursor-pointer transition-colors min-w-[120px]"
             >
               {availableSpeeds.map(speed => (
                 <option key={speed} value={speed}>{speed}</option>
               ))}
             </select>
             <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-white transition-colors" />
           </div>

           <div className="w-px h-8 bg-gray-700 mx-1 hidden md:block"></div>

           {/* Retailer Filter */}
           <div className="flex items-center gap-2">
              <div className="relative group">
                <Store className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
                <select 
                  value={filters.retailer}
                  onChange={(e) => setFilters({...filters, retailer: e.target.value as any})}
                  className="appearance-none bg-gray-800 text-white pl-10 pr-10 py-2.5 rounded-xl border border-gray-700 hover:border-primary-500 focus:border-primary-500 focus:outline-none cursor-pointer transition-colors min-w-[140px]"
                >
                  <option value="all">All Retailers</option>
                  <option value="amazon">Amazon Only</option>
                  <option value="newegg">Newegg Only</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-white transition-colors" />
              </div>
           </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleScan}
            disabled={loading}
            className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white text-lg font-semibold py-4 px-10 rounded-full shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>{loadingStage}</span>
              </>
            ) : (
              <>
                <Search className="w-6 h-6" />
                <span>Find Lowest Prices</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {deals && deals.length > 0 && (
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary-400" />
              {filters.retailer === 'all' ? 'Found Deals' : `${filters.retailer.charAt(0).toUpperCase() + filters.retailer.slice(1)} Deals`}
            </h3>
            <span className="text-sm text-gray-500">{deals.length} result{deals.length !== 1 ? 's' : ''} found</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {deals.map((deal, idx) => (
              <div 
                key={idx} 
                className={`relative flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-2xl border transition-all duration-300 ${
                  idx === 0 
                    ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-yellow-500/50 shadow-yellow-500/10 shadow-lg scale-[1.02]' 
                    : 'bg-gray-900/50 border-white/10 hover:border-white/20'
                }`}
              >
                {idx === 0 && (
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-yellow-500 text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                    Best Value
                  </div>
                )}
                
                <div className="flex-1 min-w-0 pr-6 mb-4 md:mb-0">
                  <h4 className="text-lg font-medium text-white mb-2 leading-tight">
                    {deal.title}
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1 font-semibold text-primary-300">
                      <ShoppingCart className="w-3 h-3" /> {deal.retailer}
                    </span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span className="text-green-400 font-medium">In Stock</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-0.5">Price</p>
                    <p className="text-2xl font-bold text-white flex items-center">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      {deal.price.toFixed(2)}
                    </p>
                  </div>
                  
                  <a
                    href={deal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-gray-800 hover:bg-primary-600 text-gray-400 hover:text-white rounded-xl border border-gray-700 hover:border-primary-500 transition-all group"
                  >
                    <ExternalLink className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {deals && deals.length === 0 && (
        <div className="text-center py-10 bg-gray-900/30 rounded-2xl border border-dashed border-gray-700">
          <p className="text-gray-400">No deals found for this configuration.</p>
          <p className="text-sm text-gray-500 mt-2">Try changing the filters or the retailer selection.</p>
        </div>
      )}
      
      {!deals && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
           <div className="p-6 bg-gray-900/30 border border-white/5 rounded-2xl text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-white font-medium">Smart Search</h4>
              <p className="text-sm text-gray-500 mt-2">Search specific retailers or use strict mode.</p>
           </div>
           <div className="p-6 bg-gray-900/30 border border-white/5 rounded-2xl text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <h4 className="text-white font-medium">Best Value</h4>
              <p className="text-sm text-gray-500 mt-2">Finds the absolute lowest prices available right now.</p>
           </div>
           <div className="p-6 bg-gray-900/30 border border-white/5 rounded-2xl text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-white font-medium">Real-Time</h4>
              <p className="text-sm text-gray-500 mt-2">Scans the web live for current stock and pricing.</p>
           </div>
        </div>
      )}
    </div>
  );
};