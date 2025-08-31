# OzFootie

A simple website that shows live and upcoming Australian football matches. Built with React and TypeScript.

## What it does

OzFootie displays:
- Live match scores and updates
- Upcoming match schedules
- AFL (Australian Rules Football)
- NRL (Rugby League) 
- Rugby Union (Wallabies & Super Rugby)

## Features

- **Filters**: Search by team, date, or competition
- **Timezone support**: Times shown in your local timezone
- **Mobile friendly**: Works on phones and computers
- **Dark mode**: Automatically matches your device settings

## Sports covered

- **AFL**: Australian Rules Football finals and regular season
- **NRL**: Rugby League matches and finals
- **Rugby Union**: Wallabies games and Super Rugby Pacific

## Tech stuff

- React 19 with TypeScript
- Vite for building
- Tailwind CSS for styling
- Cloudflare Pages for hosting
- TheSportsDB API for match data

## Getting started

1. Clone the repo
2. Run `npm install`
3. Run `npm run dev` to start locally
4. Open http://localhost:3000

## Building

```bash
npm run build
```

## Deploying

The site is hosted on Cloudflare Pages. Push to main branch to deploy automatically.

## Data sources

Match data comes from TheSportsDB API. The site uses a Cloudflare Worker to cache data and avoid hitting API limits.

## License