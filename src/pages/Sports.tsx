import React, { useState } from 'react';
import { useSportsData } from '../hooks/useSportsData';
import MatchCard from '../components/MatchCard';
import type { Sport } from '../types/sports';

const Sports: React.FC = () => {
  const { matches, sports, loading, error } = useSportsData();
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sports data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const filteredMatches = selectedSport
    ? matches.filter(match => 
        selectedSport.competitions.some(comp => 
          match.competition.toLowerCase().includes(comp.toLowerCase())
        )
      )
    : matches;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Sports Selection */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Sports Categories</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setSelectedSport(null)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedSport === null
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">🏆</div>
            <div className="font-medium">All Sports</div>
            <div className="text-sm text-gray-500">{matches.length} matches</div>
          </button>

          {sports.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedSport?.id === sport.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{sport.icon}</div>
              <div className="font-medium">{sport.name}</div>
              <div className="text-sm text-gray-500">
                {matches.filter(match => 
                  sport.competitions.some(comp => 
                    match.competition.toLowerCase().includes(comp.toLowerCase())
                  )
                ).length} matches
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Matches for Selected Sport */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedSport ? `${selectedSport.name} Matches` : 'All Matches'}
          </h2>
          {selectedSport && (
            <button
              onClick={() => setSelectedSport(null)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All Sports
            </button>
          )}
        </div>

        {filteredMatches.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">🏟️</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Matches Found
            </h3>
            <p className="text-gray-500">
              {selectedSport 
                ? `No ${selectedSport.name} matches available at the moment.`
                : 'No matches available at the moment.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Sports;
