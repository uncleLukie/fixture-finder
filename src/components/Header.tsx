import React from 'react';
import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  onRefresh?: () => void;
  loading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, loading = false }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">⚽🏀🎾</div>
            <div>
              <h1 className="text-2xl font-bold">Fixture Finder</h1>
              <p className="text-blue-100 text-sm">Live sports updates & upcoming matches</p>
            </div>
          </div>
          
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">
                {loading ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
