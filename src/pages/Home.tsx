import React, { useState, useEffect } from 'react';
import { fetchAllUpcomingEvents, groupEventsBySport, getSportIcon } from '../services/apiService';
import type { SportEvent, GroupedEvents } from '../types/sports';
import { Calendar, Filter, Globe, Clock, Search, ChevronDown, ChevronRight, MapPin } from 'lucide-react';

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
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [userRegion, setUserRegion] = useState<string>('');

  // Get available filter options
  const sports = [...new Set(allEvents.map(event => event.strSport))].sort();
  const countries = [...new Set(allEvents.map(event => event.strCountry).filter(Boolean))].sort();
  const teams = [...new Set([
    ...allEvents.map(event => event.strHomeTeam),
    ...allEvents.map(event => event.strAwayTeam)
  ].filter(Boolean))].sort();



  // Detect user region on component mount
  useEffect(() => {
    const detectRegion = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserRegion(data.country_code || 'US');
      } catch (error) {
        console.log('Could not detect region, defaulting to US');
        setUserRegion('US');
      }
    };
    detectRegion();
  }, []);

  // Auto-expand regional sports sections
  useEffect(() => {
    if (userRegion && Object.keys(filteredEvents).length > 0) {
      const newExpanded = new Set(expandedSections);
      
      // Auto-expand regional sports
      Object.entries(filteredEvents).forEach(([sport, events]) => {
        const isRegional = getRegionalPriority(sport, events) === 1;
        if (isRegional) {
          newExpanded.add(`live-${sport}`);
          newExpanded.add(`upcoming-${sport}`);
        }
      });
      
      setExpandedSections(newExpanded);
    }
  }, [userRegion, filteredEvents]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all upcoming events from the lazy worker
        const allEventsData = await fetchAllUpcomingEvents();
        setAllEvents(allEventsData);
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
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

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

  // Group events by league within each sport
  const groupEventsByLeague = (events: SportEvent[]) => {
    return events.reduce((acc, event) => {
      const league = event.strLeague || 'Other';
      if (!acc[league]) {
        acc[league] = [];
      }
      acc[league].push(event);
      return acc;
    }, {} as Record<string, SportEvent[]>);
  };

  // Normalize sport names for display
  const normalizeSportName = (sport: string): string => {
    const sportMappings: Record<string, string> = {
      'Australian Football': 'AFL',
      'American Football': 'NFL',
      'Rugby Union': 'Rugby Union',
      'Rugby League': 'Rugby League',
      'College Football': 'NCAA Football',
      'Soccer': 'Football',
    };
    return sportMappings[sport] || sport;
  };

  // Get regional priority for sports
  const getRegionalPriority = (_sport: string, events: SportEvent[]): number => {
    const regionalKeywords = {
      'AU': [
        'afl', 'nrl', 'super rugby', 'australian football', 'rugby union', 'rugby league',
        'melbourne', 'sydney', 'brisbane', 'perth', 'adelaide', 'gold coast', 'newcastle',
        'queensland', 'new south wales', 'wallabies', 'kangaroos'
      ],
      'US': [
        'nfl', 'ncaa', 'college football', 'american football', 'football',
        'super bowl', 'playoffs', 'conference', 'division', 'bowl game'
      ],
      'GB': [
        'premiership rugby', 'six nations', 'rugby union', 'rugby league', 'super league',
        'championship', 'challenge cup', 'england', 'wales', 'scotland', 'ireland',
        'british lions', 'rugby world cup'
      ],
      'CA': [
        'cfl', 'canadian football', 'rugby', 'football', 'grey cup'
      ],
      'NZ': [
        'super rugby', 'rugby union', 'all blacks', 'rugby championship', 'mitre 10 cup',
        'new zealand', 'auckland', 'wellington', 'christchurch'
      ],
      'ZA': [
        'super rugby', 'rugby union', 'springboks', 'rugby championship', 'currie cup',
        'south africa', 'johannesburg', 'cape town', 'durban'
      ],
    };

    const userRegionKeywords = regionalKeywords[userRegion as keyof typeof regionalKeywords] || [];
    const hasRegionalEvents = events.some(event => 
      userRegionKeywords.some(keyword => 
        event.strLeague?.toLowerCase().includes(keyword) ||
        event.strSport?.toLowerCase().includes(keyword)
      )
    );

    return hasRegionalEvents ? 1 : 2;
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

  // Sort sports by regional priority
  const sortSportsByPriority = (events: GroupedEvents) => {
    return Object.entries(events).sort(([sportA, eventsA], [sportB, eventsB]) => {
      const priorityA = getRegionalPriority(sportA, eventsA);
      const priorityB = getRegionalPriority(sportB, eventsB);
      if (priorityA !== priorityB) return priorityA - priorityB;
      return sportA.localeCompare(sportB);
    });
  };

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedDate('');
    setSelectedSport('');
    setSelectedCountry('');
    setSelectedTeam('');
    setSearchQuery('');
  };

  // Get region name
  const getRegionName = (code: string): string => {
    const regions: Record<string, string> = {
      'AU': 'Australia',
      'US': 'United States',
      'GB': 'United Kingdom',
      'CA': 'Canada',
      'NZ': 'New Zealand',
      'IN': 'India',
      'ZA': 'South Africa',
      'PK': 'Pakistan',
      'BD': 'Bangladesh',
      'LK': 'Sri Lanka',
      'AF': 'Afghanistan',
      'IE': 'Ireland',
      'SC': 'Scotland',
      'WA': 'Wales',
      'FR': 'France',
      'DE': 'Germany',
      'ES': 'Spain',
      'IT': 'Italy',
      'NL': 'Netherlands',
      'BE': 'Belgium',
      'PT': 'Portugal',
      'SE': 'Sweden',
      'NO': 'Norway',
      'DK': 'Denmark',
      'FI': 'Finland',
      'CH': 'Switzerland',
      'AT': 'Austria',
      'PL': 'Poland',
      'CZ': 'Czech Republic',
      'HU': 'Hungary',
      'RO': 'Romania',
      'BG': 'Bulgaria',
      'HR': 'Croatia',
      'RS': 'Serbia',
      'SI': 'Slovenia',
      'SK': 'Slovakia',
      'LT': 'Lithuania',
      'LV': 'Latvia',
      'EE': 'Estonia',
      'GR': 'Greece',
      'TR': 'Turkey',
      'RU': 'Russia',
      'UA': 'Ukraine',
      'BY': 'Belarus',
      'MD': 'Moldova',
      'GE': 'Georgia',
      'AM': 'Armenia',
      'AZ': 'Azerbaijan',
      'KZ': 'Kazakhstan',
      'UZ': 'Uzbekistan',
      'KG': 'Kyrgyzstan',
      'TJ': 'Tajikistan',
      'TM': 'Turkmenistan',
      'MN': 'Mongolia',
      'CN': 'China',
      'JP': 'Japan',
      'KR': 'South Korea',
      'KP': 'North Korea',
      'TW': 'Taiwan',
      'HK': 'Hong Kong',
      'MO': 'Macau',
      'TH': 'Thailand',
      'VN': 'Vietnam',
      'LA': 'Laos',
      'KH': 'Cambodia',
      'MM': 'Myanmar',
      'MY': 'Malaysia',
      'SG': 'Singapore',
      'ID': 'Indonesia',
      'PH': 'Philippines',
      'BN': 'Brunei',
      'TL': 'East Timor',
      'PG': 'Papua New Guinea',
      'FJ': 'Fiji',
      'VU': 'Vanuatu',
      'NC': 'New Caledonia',
      'PF': 'French Polynesia',
      'WS': 'Samoa',
      'TO': 'Tonga',
      'KI': 'Kiribati',
      'TV': 'Tuvalu',
      'NR': 'Nauru',
      'PW': 'Palau',
      'MH': 'Marshall Islands',
      'FM': 'Micronesia',
      'CK': 'Cook Islands',
      'NU': 'Niue',
      'TK': 'Tokelau',
      'AS': 'American Samoa',
      'GU': 'Guam',
      'MP': 'Northern Mariana Islands'
    };
    return regions[code] || code;
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
                             <div className="text-3xl">🏈🏉</div>
              <div>
                                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rugby Hub</h1>
                 <p className="text-gray-600 dark:text-gray-400 text-sm">
                   Live rugby & football updates
                  {userRegion && (
                    <span className="ml-2 inline-flex items-center text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      <MapPin className="w-3 h-3 mr-1" />
                      {getRegionName(userRegion)}
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  showFilters 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
                title="Toggle filters"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
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
                  <option value="Australia/Sydney">Sydney</option>
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
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Events</h2>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {Object.values(liveEvents).flat().length}
              </span>
            </div>
            
            <div className="space-y-4">
              {sortSportsByPriority(liveEvents).map(([sport, events]) => {
                const leagues = groupEventsByLeague(events);
                const sectionId = `live-${sport}`;
                const isExpanded = expandedSections.has(sectionId);
                const totalEvents = events.length;
                const isRegional = getRegionalPriority(sport, events) === 1;

                return (
                  <div key={sport} className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border ${
                    isRegional ? 'border-blue-200 dark:border-blue-700' : 'border-gray-200 dark:border-gray-700'
                  }`}>
                    <button
                      onClick={() => toggleSection(sectionId)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                                             <div className="flex items-center space-x-3">
                         <span className="text-2xl">{getSportIcon(sport)}</span>
                         <div className="text-left">
                           <h3 className="font-semibold text-gray-900 dark:text-white">{normalizeSportName(sport)}</h3>
                           <p className="text-sm text-gray-500 dark:text-gray-400">
                             {totalEvents} live event{totalEvents !== 1 ? 's' : ''}
                           </p>
                         </div>
                        {isRegional && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            Regional
                          </span>
                        )}
                      </div>
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                    
                    {isExpanded && (
                      <div className="border-t border-gray-200 dark:border-gray-700">
                        {Object.entries(leagues).map(([league, leagueEvents]) => (
                          <div key={league} className="p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">{league}</h4>
                            <div className="space-y-2">
                              {leagueEvents.slice(0, 5).map((event) => (
                                <div key={event.idEvent} className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                                      {event.strEvent}
                                    </div>
                                    {event.strVenue && (
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        📍 {event.strVenue}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-red-600 dark:text-red-400">LIVE</div>
                                    <div className="text-sm text-gray-900 dark:text-white">
                                      {formatTime(event.strTime, event.dateEvent)}
                                    </div>
                                    {event.intHomeScore !== null && event.intAwayScore !== null && (
                                      <div className="text-xs text-gray-600 dark:text-gray-400">
                                        {event.intHomeScore} - {event.intAwayScore}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {leagueEvents.length > 5 && (
                                <div className="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
                                  +{leagueEvents.length - 5} more events
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Upcoming Events Section */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
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
            <div className="space-y-4">
              {sortSportsByPriority(upcomingEvents).map(([sport, events]) => {
                const leagues = groupEventsByLeague(events);
                const sectionId = `upcoming-${sport}`;
                const isExpanded = expandedSections.has(sectionId);
                const totalEvents = events.length;
                const isRegional = getRegionalPriority(sport, events) === 1;

                return (
                  <div key={sport} className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border ${
                    isRegional ? 'border-blue-200 dark:border-blue-700' : 'border-gray-200 dark:border-gray-700'
                  }`}>
                    <button
                      onClick={() => toggleSection(sectionId)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                                             <div className="flex items-center space-x-3">
                         <span className="text-2xl">{getSportIcon(sport)}</span>
                         <div className="text-left">
                           <h3 className="font-semibold text-gray-900 dark:text-white">{normalizeSportName(sport)}</h3>
                           <p className="text-sm text-gray-500 dark:text-gray-400">
                             {totalEvents} upcoming event{totalEvents !== 1 ? 's' : ''}
                           </p>
                         </div>
                        {isRegional && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            Regional
                          </span>
                        )}
                      </div>
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                    
                    {isExpanded && (
                      <div className="border-t border-gray-200 dark:border-gray-700">
                        {Object.entries(leagues).map(([league, leagueEvents]) => (
                          <div key={league} className="p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">{league}</h4>
                            <div className="space-y-2">
                              {leagueEvents.slice(0, 5).map((event) => (
                                <div key={event.idEvent} className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                                      {event.strEvent}
                                    </div>
                                    {event.strVenue && (
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        📍 {event.strVenue}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                      {formatDate(event.dateEvent)}
                                    </div>
                                    <div className="text-sm text-gray-900 dark:text-white">
                                      {formatTime(event.strTime, event.dateEvent)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {leagueEvents.length > 5 && (
                                <div className="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
                                  +{leagueEvents.length - 5} more events
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
