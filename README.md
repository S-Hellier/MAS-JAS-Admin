# Pantry Partner Admin Dashboard

A modern, web-based admin dashboard for managing and monitoring the Pantry Partner mobile app - a pantry management and recipe generation tool.

## Features

- **Admin Authentication**: Secure login system (currently using mock authentication)
- **Backend Integration**: Connected to the Pantry Partner backend API for real-time metrics
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

Create a `.env` file in the root directory:

**For local development (backend on localhost):**
```env
# Option 1: Base URL (recommended - code will auto-append /api/v1)
VITE_API_BASE_URL=http://localhost:3001

# Option 2: Full path (also works)
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

**For production (deployed backend on Vercel):**
```env
# Option 1: Base URL (recommended - code will auto-append /api/v1)
VITE_API_BASE_URL=https://your-backend.vercel.app

# Option 2: Full path (also works)
VITE_API_BASE_URL=https://your-backend.vercel.app/api/v1
```

Replace `your-backend.vercel.app` with your actual Vercel backend URL.

**Note:** 
- The code automatically appends `/api/v1` if it's not already in the URL
- Do NOT include `/admin` at the end - the code will automatically append `/admin` for admin endpoints
- Do NOT include a trailing slash

3. Ensure your backend API is running:
   - **Local development**: Backend should be running on `http://localhost:3001`
   - **Production**: Your backend should be deployed and accessible at the URL you specified in `VITE_API_BASE_URL`

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

**Important**: 
- Update `VITE_API_BASE_URL` in your `.env` file to point to your production backend URL before building
- If deploying to Vercel, also set `VITE_API_BASE_URL` as an environment variable in your Vercel project settings

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


