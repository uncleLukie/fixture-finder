import React from 'react';
import { ExternalLink, Github, Globe } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">About OzFootie</h1>
          <p className="text-lg text-gray-600">
            Oz Footy Central: Real-Time Hub for AFL, League, and Union Down Under
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🎯 What We Do</h2>
            <p className="text-gray-600 mb-4">
              OzFootie provides real-time information about live Australian football matches across all major 
              competitions. Stay updated with scores, schedules, and match details for your favorite teams.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Live match scores and updates</li>
              <li>• Upcoming match schedules</li>
              <li>• AFL (Australian Rules Football)</li>
              <li>• NRL (Rugby League)</li>
              <li>• Rugby Union (Wallabies & Super Rugby)</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🛠️ Built With</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">R</div>
                <span className="text-gray-700">React 18 with TypeScript</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white text-xs font-bold">V</div>
                <span className="text-gray-700">Vite for fast development</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center text-white text-xs font-bold">T</div>
                <span className="text-gray-700">Tailwind CSS for styling</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">A</div>
                <span className="text-gray-700">Free sports APIs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Data Sources</h2>
          <p className="text-gray-600 mb-4">
            This application uses free sports APIs to provide real-time match data. The data includes:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Supported Sports</h3>
              <ul className="text-gray-600 space-y-1">
                <li>🏈 AFL (Australian Rules Football)</li>
                <li>🏉 NRL (Rugby League)</li>
                <li>🏉 Rugby Union (Wallabies)</li>
                <li>🏉 Super Rugby Pacific</li>
                <li>🏉 Rugby Championship</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Match Information</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Live scores and updates</li>
                <li>• Match schedules and times</li>
                <li>• Team information</li>
                <li>• Venue details</li>
                <li>• Competition and round info</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🔗 Links</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/yourusername/fixture-finder"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://yourusername.github.io/fixture-finder"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Live Demo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
