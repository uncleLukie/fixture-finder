import React from 'react';
import { useSportsData } from '../hooks/useSportsData';
import MatchCard from '../components/MatchCard';
import { Activity, Calendar } from 'lucide-react';

const Home: React.FC = () => {
  const { liveMatches, upcomingMatches, loading, error, refreshData } = useSportsData();

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
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Live Matches Section */}
      <section className="mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="w-6 h-6 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-800">Live Matches</h2>
          {liveMatches.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {liveMatches.length}
            </span>
          )}
        </div>

        {liveMatches.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">📺</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Live Matches</h3>
            <p className="text-gray-500">Check back later for live sports action!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Matches Section */}
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">Upcoming Matches</h2>
          {upcomingMatches.length > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {upcomingMatches.length}
            </span>
          )}
        </div>

        {upcomingMatches.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Upcoming Matches</h3>
            <p className="text-gray-500">No matches scheduled for the next 7 days.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
