import React from 'react';
import type { Match } from '../types/sports';
import { formatDate, formatTime, getRelativeTime } from '../utils/dateUtils';

interface MatchCardProps {
  match: Match;
  showVenue?: boolean;
  showCompetition?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ 
  match, 
  showVenue = true, 
  showCompetition = true 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-500 text-white';
      case 'scheduled':
        return 'bg-blue-500 text-white';
      case 'finished':
        return 'bg-gray-500 text-white';
      case 'postponed':
        return 'bg-yellow-500 text-black';
      case 'cancelled':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live':
        return `LIVE ${match.minute}'`;
      case 'scheduled':
        return 'SCHEDULED';
      case 'finished':
        return 'FINISHED';
      case 'postponed':
        return 'POSTPONED';
      case 'cancelled':
        return 'CANCELLED';
      default:
        return status.toUpperCase();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(match.status)}`}>
          {getStatusText(match.status)}
        </span>
        {match.status === 'scheduled' && (
          <span className="text-xs text-gray-500">
            {getRelativeTime(match.date)}
          </span>
        )}
      </div>

      {/* Competition */}
      {showCompetition && (
        <div className="text-sm text-gray-600 mb-2">
          {match.competition}
          {match.round && ` • ${match.round}`}
        </div>
      )}

      {/* Teams */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
            {match.homeTeam.shortName || match.homeTeam.name.substring(0, 2)}
          </div>
          <span className="font-medium text-gray-900">
            {match.homeTeam.name}
          </span>
        </div>

        {/* Score or VS */}
        <div className="mx-4 text-center">
          {match.status === 'live' || match.status === 'finished' ? (
            <div className="text-lg font-bold">
              <span className="text-gray-900">{match.score?.home}</span>
              <span className="mx-2 text-gray-400">-</span>
              <span className="text-gray-900">{match.score?.away}</span>
            </div>
          ) : (
            <div className="text-sm text-gray-500 font-medium">VS</div>
          )}
        </div>

        <div className="flex items-center space-x-3 flex-1 justify-end">
          <span className="font-medium text-gray-900 text-right">
            {match.awayTeam.name}
          </span>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
            {match.awayTeam.shortName || match.awayTeam.name.substring(0, 2)}
          </div>
        </div>
      </div>

      {/* Date and Time */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>{formatDate(match.date)}</span>
        {match.time && <span>{formatTime(match.time)}</span>}
      </div>

      {/* Venue */}
      {showVenue && match.venue && (
        <div className="mt-2 text-xs text-gray-500">
          📍 {match.venue.name}
          {match.venue.city && `, ${match.venue.city}`}
        </div>
      )}
    </div>
  );
};

export default MatchCard;
