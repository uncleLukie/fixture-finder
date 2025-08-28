# Fixture Finder

I was sick of trying to find sports fixtures on bloated websites, so I made a FOSS web app purely for finding live sports matches and upcoming fixtures.

## Tech Stack

- React with TypeScript
- Vite
- Tailwind CSS
- Lucide React
- React Router DOM
- Axios

## Configuration

### Local Development
Create `.env`:

```
VITE_API_FOOTBALL_KEY=your_api_key_here
VITE_API_BASE_URL=https://api-football-v1.p.rapidapi.com/v3
```

### GitHub Pages Deployment
For deployment to GitHub Pages, add these as repository secrets:
1. Go to your repository Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `VITE_API_FOOTBALL_KEY`: Your API key
   - `VITE_API_BASE_URL`: API base URL (optional, has default)

## License

MIT License. See [LICENSE](LICENSE).