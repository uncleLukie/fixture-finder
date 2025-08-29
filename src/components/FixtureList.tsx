import React, { useState, useEffect } from 'react';
import { fetchAllFixturesByDay, groupEventsBySport, getSportIcon } from '../services/apiService';
import type { GroupedEvents } from '../types/sports';

interface FixtureListProps {
  title?: string;
  date?: string;
  showDate?: boolean;
}

const FixtureList: React.FC<FixtureListProps> = ({ 
  title = "Today's Sports Fixtures", 
  date,
  showDate = true 
}) => {
  const [groupedFixtures, setGroupedFixtures] = useState<GroupedEvents>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFixtures = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const eventsArray = await fetchAllFixturesByDay(date);

        // Group the flat array of events by sport
        const grouped = groupEventsBySport(eventsArray);

        setGroupedFixtures(grouped);
      } catch (err) {
        setError('Failed to load fixtures. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFixtures();
  }, [date]);

  const formatTime = (timeString: string): string => {
    if (!timeString) return 'TBD';
    return timeString.substring(0, 5); // Extract HH:MM from HH:MM:SS
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading fixtures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  const sortedSports = Object.keys(groupedFixtures).sort();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        {showDate && date && (
          <p className="text-gray-600">{formatDate(date)}</p>
        )}
      </div>

      {sortedSports.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">🏟️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Events Scheduled
          </h3>
          <p className="text-gray-500">
            No sports events are scheduled for this date.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedSports.map((sport) => (
            <section key={sport} className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="mr-3 text-2xl">{getSportIcon(sport)}</span>
                  {sport}
                  <span className="ml-3 text-sm font-normal text-gray-500">
                    ({groupedFixtures[sport].length} events)
                  </span>
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {groupedFixtures[sport].map((event) => (
                  <div key={event.idEvent} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {event.strEvent}
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{event.strLeague}</p>
                          {event.strVenue && (
                            <p>📍 {event.strVenue}</p>
                          )}
                          {event.strCity && (
                            <p>🏙️ {event.strCity}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatTime(event.strTime)}
                        </div>
                        {event.intHomeScore !== null && event.intAwayScore !== null && (
                          <div className="text-sm text-gray-600 mt-1">
                            {event.intHomeScore} - {event.intAwayScore}
                          </div>
                        )}
                        {event.strStatus && (
                          <div className="text-xs text-blue-600 mt-1">
                            {event.strStatus}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default FixtureList;
