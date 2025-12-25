export interface Deal {
  title: string;
  price: number;
  url: string;
  retailer: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface MarketTip {
  text: string;
  timestamp: number;
}

export interface SearchFilters {
  size: string;
  ddr: string;
  speed: string;
  retailer: 'all' | 'amazon' | 'newegg';
}