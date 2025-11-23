# MAS-JAS Admin Dashboard

A modern, web-based admin dashboard for managing and monitoring the MAS-JAS mobile app - a pantry management and recipe generation tool.

## Features

- **Admin Authentication**: Secure login system (currently using mock authentication)
- **Backend Integration**: Connected to the MAS-JAS backend API for real-time metrics
- **Metrics Dashboard**: Real-time metrics display including:
  - Active Users (Total Users)
  - Recipes Generated (Total Recipes)
  - Average Recipe Generation Time
  - Pantry Items Added (Total Pantry Items)
- **Data Visualization**: Interactive charts showing trends over time
- **Error Handling**: Comprehensive error handling and loading states
- **Responsive Design**: Works seamlessly on desktop and tablet devices

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running (see `ADMIN_DASHBOARD_CONNECTION.md` for details)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and update if needed (defaults are set for local development)
```

The `.env` file should contain:
```env
VITE_API_BASE_URL=http://localhost:3001/api/v1/admin
VITE_ADMIN_API_KEY=e10fc184265409b7d72607f511d2421c5beefdb6a06b5699be33eaccf8c3e222
```

3. Ensure your backend API is running on `http://localhost:3001`

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

**Important**: Update `VITE_API_BASE_URL` in your `.env` file to point to your production backend URL before building.

## Project Structure

```
src/
├── components/
│   ├── Login.tsx          # Login page component
│   ├── Dashboard.tsx      # Main dashboard layout
│   ├── MetricsOverview.tsx # Metrics cards display
│   └── MetricsCharts.tsx   # Chart visualizations
├── config/
│   └── api.ts             # API configuration and fetch functions
├── hooks/
│   └── useMetrics.ts      # Custom hook for fetching metrics from backend
├── App.tsx                # Main app component with routing
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## Backend Integration

The dashboard is now connected to the backend API. See `ADMIN_DASHBOARD_CONNECTION.md` for detailed API documentation.

### API Endpoints Used

- `GET /api/v1/admin/metrics` - Fetches all metrics (users, recipes, pantry items, generation time)

### Data Mapping

The backend response is automatically mapped to the dashboard format:
- `totalUsers` → Active Users
- `totalRecipes` → Recipes Generated
- `averageGenerationTimeMs` → Average Recipe Time (converted to seconds)
- `totalPantryItems` → Pantry Items Added

### Chart Data

**Note**: The chart visualizations currently use mock data as the backend doesn't provide time-series endpoints yet. When time-series endpoints are available, update `src/hooks/useMetrics.ts` to fetch real chart data.

## Error Handling

The dashboard includes comprehensive error handling:
- Loading states with skeleton loaders
- Error messages for API failures
- Automatic retry every 30 seconds
- Clear error messages for authentication failures

## Demo Credentials

For the demo version, you can use any email and password to log in. This will be replaced with actual authentication when you integrate your backend authentication system.

## Troubleshooting

### Backend Connection Issues

1. **401 Unauthorized**: Check that your `VITE_ADMIN_API_KEY` in `.env` matches the API key in your backend
2. **Connection Refused**: Ensure your backend is running on `http://localhost:3001`
3. **CORS Errors**: The backend should allow CORS for your dashboard domain (configured in backend)

### Environment Variables

- In Vite, environment variables must be prefixed with `VITE_` to be accessible in the browser
- After changing `.env`, restart the development server
- Never commit `.env` to version control (it's in `.gitignore`)


