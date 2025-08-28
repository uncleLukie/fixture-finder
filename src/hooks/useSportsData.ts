import { useState, useEffect } from 'react';
import type { Match, Sport } from '../types/sports';
import { sportsApiService } from '../services/sportsApi';

export const useSportsData = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [matchesResponse, liveResponse, upcomingResponse] = await Promise.all([
          sportsApiService.getMatches('football'),
          sportsApiService.getLiveMatches(),
          sportsApiService.getUpcomingMatches(7)
        ]);

        if (matchesResponse.success) {
          setMatches(matchesResponse.data);
        }

        if (liveResponse.success) {
          setLiveMatches(liveResponse.data);
        }

        if (upcomingResponse.success) {
          setUpcomingMatches(upcomingResponse.data);
        }

        setSports(sportsApiService.getSports());
      } catch (err) {
        setError('Failed to fetch sports data');
        console.error('Error in useSportsData:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [matchesResponse, liveResponse, upcomingResponse] = await Promise.all([
        sportsApiService.getMatches('football'),
        sportsApiService.getLiveMatches(),
        sportsApiService.getUpcomingMatches(7)
      ]);

      if (matchesResponse.success) {
        setMatches(matchesResponse.data);
      }

      if (liveResponse.success) {
        setLiveMatches(liveResponse.data);
      }

      if (upcomingResponse.success) {
        setUpcomingMatches(upcomingResponse.data);
      }
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return {
    matches,
    liveMatches,
    upcomingMatches,
    sports,
    loading,
    error,
    refreshData
  };
};
