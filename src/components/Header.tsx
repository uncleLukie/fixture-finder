import React from 'react';

const Header: React.FC = () => {
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
        </div>
      </div>
    </header>
  );
};

export default Header;
