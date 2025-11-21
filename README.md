# MAS-JAS Admin Dashboard

A modern, web-based admin dashboard for managing and monitoring the MAS-JAS mobile app - a pantry management and recipe generation tool.

## Features

- **Admin Authentication**: Secure login system (currently using mock authentication)
- **Metrics Dashboard**: Real-time metrics display including:
  - Active Users
  - Recipes Generated
  - Average Recipe Generation Time
  - Pantry Items Added
- **Data Visualization**: Interactive charts showing trends over time
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

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── Login.tsx          # Login page component
│   ├── Dashboard.tsx      # Main dashboard layout
│   ├── MetricsOverview.tsx # Metrics cards display
│   └── MetricsCharts.tsx   # Chart visualizations
├── hooks/
│   └── useMetrics.ts      # Custom hook for fetching metrics (currently mock data)
├── App.tsx                # Main app component with routing
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## Next Steps

1. **Backend Integration**: Replace the mock data in `src/hooks/useMetrics.ts` with actual API calls to your backend
2. **Authentication**: Implement real authentication logic in `src/components/Login.tsx`
3. **Additional Metrics**: Add more metrics as needed based on your backend API
4. **Error Handling**: Add proper error handling and loading states
5. **Data Filtering**: Add date range filters and other filtering options

## Demo Credentials

For the demo version, you can use any email and password to log in. This will be replaced with actual authentication when you integrate your backend.


