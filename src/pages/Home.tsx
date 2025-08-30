import React, { useState, useEffect } from 'react';
import { fetchAllFixturesByDay, fetchUpcomingFixtures, groupEventsBySport, getSportIcon } from '../services/apiService';
import type { SportEvent, GroupedEvents } from '../types/sports';
import { Calendar, Filter, Globe, Sun, Moon, Clock, Search } from 'lucide-react';

const Home: React.FC = () => {
  // State for data
  const [allEvents, setAllEvents] = useState<SportEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<GroupedEvents>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timezone, setTimezone] = useState<string>('local');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // State for dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Get available filter options
  const sports = [...new Set(allEvents.map(event => event.strSport))].sort();
  const countries = [...new Set(allEvents.map(event => event.strCountry).filter(Boolean))].sort();
  const teams = [...new Set([
    ...allEvents.map(event => event.strHomeTeam),
    ...allEvents.map(event => event.strAwayTeam)
  ].filter(Boolean))].sort();

  // Get today's date
  const getTodaysDate = (): string => {
    return new Date().toISOString().slice(0, 10);
  };

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const today = getTodaysDate();
        const todaysEvents = await fetchAllFixturesByDay(today);
        const upcomingEvents = await fetchUpcomingFixtures(7);
        
        // Combine and deduplicate events
        const allEventsData = [...todaysEvents, ...upcomingEvents];
        const uniqueEvents = allEventsData.filter((event, index, self) => 
          index === self.findIndex(e => e.idEvent === event.idEvent)
        );
        
        setAllEvents(uniqueEvents);
      } catch (err) {
        setError('Failed to load fixtures. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = allEvents;

    // Date filter
    if (selectedDate) {
      filtered = filtered.filter(event => event.dateEvent === selectedDate);
    }

    // Sport filter
    if (selectedSport) {
      filtered = filtered.filter(event => event.strSport === selectedSport);
    }

    // Country filter
    if (selectedCountry) {
      filtered = filtered.filter(event => event.strCountry === selectedCountry);
    }

    // Team filter
    if (selectedTeam) {
      filtered = filtered.filter(event => 
        event.strHomeTeam.toLowerCase().includes(selectedTeam.toLowerCase()) ||
        event.strAwayTeam.toLowerCase().includes(selectedTeam.toLowerCase())
      );
    }

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.strEvent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.strLeague.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.strHomeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.strAwayTeam.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Group by sport
    const grouped = groupEventsBySport(filtered);
    setFilteredEvents(grouped);
  }, [allEvents, selectedDate, selectedSport, selectedCountry, selectedTeam, searchQuery]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Format time based on timezone
  const formatTime = (timeString: string, dateString: string): string => {
    if (!timeString) return 'TBD';
    
    try {
      const dateTime = new Date(`${dateString}T${timeString}`);
      return dateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone === 'local' ? undefined : timezone
      });
    } catch {
      return timeString.substring(0, 5);
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Check if event is live
  const isLiveEvent = (event: SportEvent): boolean => {
    return event.strStatus === 'Live' || event.strStatus === '1H' || event.strStatus === '2H';
  };

  // Separate live and upcoming events
  const liveEvents = Object.entries(filteredEvents).reduce((acc, [sport, events]) => {
    const live = events.filter(isLiveEvent);
    if (live.length > 0) {
      acc[sport] = live;
    }
    return acc;
  }, {} as GroupedEvents);

  const upcomingEvents = Object.entries(filteredEvents).reduce((acc, [sport, events]) => {
    const upcoming = events.filter(event => !isLiveEvent(event));
    if (upcoming.length > 0) {
      acc[sport] = upcoming;
    }
    return acc;
  }, {} as GroupedEvents);

  // Clear all filters
  const clearFilters = () => {
    setSelectedDate('');
    setSelectedSport('');
    setSelectedCountry('');
    setSelectedTeam('');
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading fixtures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">⚽🏀🎾</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fixture Finder</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Live sports updates & upcoming matches</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Dark mode toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>

              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Toggle filters"
              >
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, teams, or leagues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Sport Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sport
                </label>
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Sports</option>
                  {sports.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>

              {/* Country Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Globe className="inline w-4 h-4 mr-1" />
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Team Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Team
                </label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Teams</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>

              {/* Timezone Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="local">Local Time</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Live Events Section */}
        {Object.keys(liveEvents).length > 0 && (
          <section className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Events</h2>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {Object.values(liveEvents).flat().length}
              </span>
            </div>
            
            <div className="space-y-6">
              {Object.entries(liveEvents).map(([sport, events]) => (
                <div key={sport} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <span className="mr-3 text-2xl">{getSportIcon(sport)}</span>
                      {sport}
                      <span className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400">
                        ({events.length} live)
                      </span>
                    </h3>
                  </div>
                  
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {events.map((event) => (
                      <div key={event.idEvent} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                              {event.strEvent}
                            </h4>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
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
                            <div className="text-sm font-medium text-red-600 dark:text-red-400">
                              LIVE
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatTime(event.strTime, event.dateEvent)}
                            </div>
                            {event.intHomeScore !== null && event.intAwayScore !== null && (
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {event.intHomeScore} - {event.intAwayScore}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Events Section */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {Object.values(upcomingEvents).flat().length}
            </span>
          </div>

          {Object.keys(upcomingEvents).length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🏟️</div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Events Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your filters to see more events.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(upcomingEvents).map(([sport, events]) => (
                <div key={sport} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <span className="mr-3 text-2xl">{getSportIcon(sport)}</span>
                      {sport}
                      <span className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400">
                        ({events.length} upcoming)
                      </span>
                    </h3>
                  </div>
                  
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {events.map((event) => (
                      <div key={event.idEvent} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                              {event.strEvent}
                            </h4>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
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
                            <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {formatDate(event.dateEvent)}
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatTime(event.strTime, event.dateEvent)}
                            </div>
                            {event.intHomeScore !== null && event.intAwayScore !== null && (
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {event.intHomeScore} - {event.intAwayScore}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
