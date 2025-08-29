import React, { useState } from 'react';
import FixtureList from '../components/FixtureList';

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const getTodaysDate = (): string => {
    return new Date().toISOString().slice(0, 10);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const resetToToday = () => {
    setSelectedDate('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Date Selector */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4">
            <label htmlFor="date-selector" className="text-lg font-medium text-gray-900">
              Select Date:
            </label>
            <input
              id="date-selector"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={resetToToday}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Today
            </button>
            <div className="text-sm text-gray-600">
              {selectedDate ? `Viewing: ${selectedDate}` : `Viewing: ${getTodaysDate()} (Today)`}
            </div>
          </div>
        </div>
      </div>

      {/* Fixtures List */}
      <FixtureList 
        title={selectedDate ? `Sports Fixtures for ${selectedDate}` : "Today's Sports Fixtures"}
        date={selectedDate || getTodaysDate()}
        showDate={!selectedDate}
      />
    </div>
  );
};

export default Home;
