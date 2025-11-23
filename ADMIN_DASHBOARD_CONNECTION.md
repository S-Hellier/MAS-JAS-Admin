# Admin Dashboard Connection Guide

This guide explains how to connect your admin dashboard codebase to the backend API endpoints.

## Configuration

### API Base URL
- **Local Development**: `http://localhost:3001/api/v1/admin`
- **Production**: Update this to your production backend URL

### Authentication
All admin endpoints require an API key to be sent in the request header:
- **Header Name**: `x-admin-api-key`
- **API Key**: `e10fc184265409b7d72607f511d2421c5beefdb6a06b5699be33eaccf8c3e222`

⚠️ **Important**: Store this API key securely in your admin dashboard's environment variables. Never commit it to version control.

## Available Endpoints

### 1. Get All Metrics
Get all metrics in a single request.

**Endpoint**: `GET /api/v1/admin/metrics`

**Response**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 42,
    "totalPantryItems": 156,
    "totalRecipes": 89,
    "averageGenerationTimeMs": 2340,
    "averageWeeklyRecipesPerUser": 2.5,
    "timestamp": "2025-01-26T12:00:00.000Z"
  }
}
```

**Response Fields**:
- `totalUsers`: Total number of users in the system
- `totalPantryItems`: Total number of pantry items created
- `totalRecipes`: Total number of recipes generated
- `averageGenerationTimeMs`: Average time (in milliseconds) to generate a recipe
- `averageWeeklyRecipesPerUser`: **Average number of recipes generated per user per week** (see detailed explanation below)

### 2. Get Overview Metrics
Get basic overview statistics (users, items, recipes).

**Endpoint**: `GET /api/v1/admin/metrics/overview`

**Response**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 42,
    "totalPantryItems": 156,
    "totalRecipes": 89,
    "timestamp": "2025-01-26T12:00:00.000Z"
  }
}
```

### 3. Get Recipe Metrics
Get recipe generation specific metrics.

**Endpoint**: `GET /api/v1/admin/metrics/recipes`

**Response**:
```json
{
  "success": true,
  "data": {
    "totalRecipes": 89,
    "averageGenerationTimeMs": 2340,
    "average_weekly_recipes_per_user": 2.5,
    "totalActiveUsers": 42,
    "timestamp": "2025-01-26T12:00:00.000Z"
  }
}
```

**Response Fields**:
- `totalRecipes`: Total number of recipes generated across all time
- `averageGenerationTimeMs`: Average time (in milliseconds) taken to generate a recipe
- `average_weekly_recipes_per_user`: **Average number of recipes generated per user per week**
  - This metric calculates the average across all weeks where recipes were generated
  - Formula: `(Total Recipes) / (Number of Weeks with Recipe Activity) / (Total Users)`
  - Groups recipes by week (Monday-Sunday) and calculates the average
  - Provides insight into user engagement and recipe generation frequency
- `totalActiveUsers`: Total number of users in the system

### 4. Get Daily Growth Metrics
Get daily breakdown of recipes generated and active users for the past 7 days. Perfect for creating growth visualizations.

**Endpoint**: `GET /api/v1/admin/metrics/daily`

**Response**:
```json
{
  "success": true,
  "data": {
    "dailyBreakdown": [
      {
        "date": "2025-01-20",
        "dateFormatted": "Mon, Jan 20",
        "recipesGenerated": 5,
        "activeUsers": 3,
        "cumulativeRecipes": 5,
        "cumulativeUsers": 3
      },
      {
        "date": "2025-01-21",
        "dateFormatted": "Tue, Jan 21",
        "recipesGenerated": 8,
        "activeUsers": 5,
        "cumulativeRecipes": 13,
        "cumulativeUsers": 7
      }
      // ... 5 more days
    ],
    "summary": {
      "totalRecipes": 45,
      "totalActiveUsers": 12,
      "averageRecipesPerDay": 6.43,
      "averageActiveUsersPerDay": 4.29,
      "recipesGrowthPercent": 60.0
    },
    "dateRange": {
      "startDate": "2025-01-20",
      "endDate": "2025-01-26"
    },
    "timestamp": "2025-01-26T12:00:00.000Z"
  }
}
```

**Response Fields**:
- `dailyBreakdown`: Array of daily metrics for the past 7 days
  - `date`: ISO date string (YYYY-MM-DD)
  - `dateFormatted`: Human-readable date (e.g., "Mon, Jan 20")
  - `recipesGenerated`: Number of recipes generated on this day
  - `activeUsers`: Number of unique users active on this day (generated recipes or added pantry items)
  - `cumulativeRecipes`: Running total of recipes from start of period
  - `cumulativeUsers`: Running total of unique users from start of period
- `summary`: Aggregated statistics for the 7-day period
- `dateRange`: Start and end dates of the period

## Understanding the Average Weekly Recipes Per User Metric

The `averageWeeklyRecipesPerUser` (or `average_weekly_recipes_per_user`) metric provides insight into user engagement and recipe generation frequency. This metric is available in both the `/metrics` and `/metrics/recipes` endpoints.

### How It's Calculated

The metric uses the following calculation method:

1. **Groups recipes by week**: All recipe generations are grouped by calendar week (Monday-Sunday)
2. **Counts total recipes**: Sums all recipes generated across all weeks
3. **Counts unique weeks**: Identifies how many unique weeks had recipe activity
4. **Divides by total users**: Divides the total by the number of users in the system

**Formula**: 
```
averageWeeklyRecipesPerUser = (Total Recipes) / (Number of Weeks with Activity) / (Total Users)
```

### Example Calculation

If you have:
- 100 total recipes generated
- 5 unique weeks with recipe activity
- 20 total users

Then: `100 / 5 / 20 = 1.0` recipes per user per week

This means, on average, each user generates 1 recipe per week across the weeks where recipe generation occurred.

### Use Cases

This metric is useful for:
- **Engagement Analysis**: Understanding how frequently users interact with the recipe generation feature
- **Growth Tracking**: Monitoring changes in user engagement over time
- **Product Insights**: Identifying if users are finding value in the recipe feature
- **Resource Planning**: Estimating expected recipe generation volume based on user growth

### Accessing the Metric

You can access this metric from two endpoints:

1. **`GET /api/v1/admin/metrics`** - Returns as `averageWeeklyRecipesPerUser`
2. **`GET /api/v1/admin/metrics/recipes`** - Returns as `average_weekly_recipes_per_user`

Both return the same calculated value, just with slightly different field naming conventions.

### Example Usage

```typescript
// Fetch recipe metrics
const response = await fetch('http://localhost:3001/api/v1/admin/metrics/recipes', {
  headers: {
    'x-admin-api-key': 'your-api-key',
    'Content-Type': 'application/json',
  },
});

const data = await response.json();
const avgWeeklyRecipes = data.data.average_weekly_recipes_per_user;

console.log(`Users generate an average of ${avgWeeklyRecipes} recipes per week`);
// Output: "Users generate an average of 2.5 recipes per week"
```

## Example Implementations

### JavaScript/TypeScript (Fetch API)

```typescript
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'e10fc184265409b7d72607f511d2421c5beefdb6a06b5699be33eaccf8c3e222';
const API_BASE_URL = 'http://localhost:3001/api/v1/admin';

async function fetchAllMetrics() {
  try {
    const response = await fetch(`${API_BASE_URL}/metrics`, {
      method: 'GET',
      headers: {
        'x-admin-api-key': ADMIN_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
}

// Usage
fetchAllMetrics().then(metrics => {
  console.log('Total Users:', metrics.data.totalUsers);
  console.log('Total Items:', metrics.data.totalPantryItems);
  console.log('Total Recipes:', metrics.data.totalRecipes);
  console.log('Avg Weekly Recipes Per User:', metrics.data.averageWeeklyRecipesPerUser);
});
```

### JavaScript/TypeScript (Axios)

```typescript
import axios from 'axios';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'e10fc184265409b7d72607f511d2421c5beefdb6a06b5699be33eaccf8c3e222';
const API_BASE_URL = 'http://localhost:3001/api/v1/admin';

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-admin-api-key': ADMIN_API_KEY,
    'Content-Type': 'application/json',
  },
});

// Fetch all metrics
async function getAllMetrics() {
  try {
    const response = await adminApi.get('/metrics');
    return response.data;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
}

// Fetch overview metrics
async function getOverviewMetrics() {
  try {
    const response = await adminApi.get('/metrics/overview');
    return response.data;
  } catch (error) {
    console.error('Error fetching overview:', error);
    throw error;
  }
}

// Fetch recipe metrics
async function getRecipeMetrics() {
  try {
    const response = await adminApi.get('/metrics/recipes');
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe metrics:', error);
    throw error;
  }
}

// Example: Display average weekly recipes per user
async function displayWeeklyRecipeEngagement() {
  try {
    const metrics = await getRecipeMetrics();
    const avgWeekly = metrics.data.average_weekly_recipes_per_user;
    
    console.log(`Average Weekly Recipes Per User: ${avgWeekly}`);
    console.log(`This means each user generates approximately ${avgWeekly} recipes per week on average.`);
    
    return avgWeekly;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Fetch daily growth metrics
async function getDailyMetrics() {
  try {
    const response = await adminApi.get('/metrics/daily');
    return response.data;
  } catch (error) {
    console.error('Error fetching daily metrics:', error);
    throw error;
  }
}

// Example: Create a growth chart with daily metrics
async function createGrowthChart() {
  const metrics = await getDailyMetrics();
  const dailyData = metrics.data.dailyBreakdown;
  
  // Extract data for charting
  const dates = dailyData.map(d => d.dateFormatted);
  const recipes = dailyData.map(d => d.recipesGenerated);
  const users = dailyData.map(d => d.activeUsers);
  const cumulativeRecipes = dailyData.map(d => d.cumulativeRecipes);
  const cumulativeUsers = dailyData.map(d => d.cumulativeUsers);
  
  // Use with your charting library (Chart.js, Recharts, etc.)
  return {
    dates,
    recipes,
    users,
    cumulativeRecipes,
    cumulativeUsers,
  };
}
```

### Python (Requests)

```python
import os
import requests
from typing import Dict, Any

ADMIN_API_KEY = os.getenv('ADMIN_API_KEY', 'e10fc184265409b7d72607f511d2421c5beefdb6a06b5699be33eaccf8c3e222')
API_BASE_URL = 'http://localhost:3001/api/v1/admin'

headers = {
    'x-admin-api-key': ADMIN_API_KEY,
    'Content-Type': 'application/json',
}

def fetch_all_metrics() -> Dict[str, Any]:
    """Fetch all metrics from the admin API."""
    try:
        response = requests.get(
            f'{API_BASE_URL}/metrics',
            headers=headers
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error fetching metrics: {e}')
        raise

def fetch_overview_metrics() -> Dict[str, Any]:
    """Fetch overview metrics."""
    try:
        response = requests.get(
            f'{API_BASE_URL}/metrics/overview',
            headers=headers
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error fetching overview: {e}')
        raise

def fetch_recipe_metrics() -> Dict[str, Any]:
    """Fetch recipe generation metrics."""
    try:
        response = requests.get(
            f'{API_BASE_URL}/metrics/recipes',
            headers=headers
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error fetching recipe metrics: {e}')
        raise

# Usage example
if __name__ == '__main__':
    metrics = fetch_all_metrics()
    print(f"Total Users: {metrics['data']['totalUsers']}")
    print(f"Total Items: {metrics['data']['totalPantryItems']}")
    print(f"Total Recipes: {metrics['data']['totalRecipes']}")
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

const ADMIN_API_KEY = process.env.REACT_APP_ADMIN_API_KEY || 'e10fc184265409b7d72607f511d2421c5beefdb6a06b5699be33eaccf8c3e222';
const API_BASE_URL = 'http://localhost:3001/api/v1/admin';

interface Metrics {
  totalUsers: number;
  totalPantryItems: number;
  totalRecipes: number;
  averageGenerationTimeMs: number;
  average_weekly_recipes_per_user: number;
  timestamp: string;
}

export function useAdminMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/metrics`, {
          headers: {
            'x-admin-api-key': ADMIN_API_KEY,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch metrics: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success) {
          setMetrics(data.data);
        } else {
          throw new Error(data.error || 'Failed to fetch metrics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  return { metrics, loading, error };
}
```

## Error Responses

If authentication fails or an error occurs, you'll receive an error response:

```json
{
  "success": false,
  "error": "Unauthorized - Invalid admin API key"
}
```

**HTTP Status Codes**:
- `200`: Success
- `401`: Unauthorized (invalid or missing API key)
- `500`: Internal server error

## CORS Configuration

The backend is configured to allow all origins in development mode. For production, you may need to configure CORS to allow your admin dashboard domain.

## Environment Variables

In your admin dashboard codebase, create a `.env` file:

```env
ADMIN_API_KEY=e10fc184265409b7d72607f511d2421c5beefdb6a06b5699be33eaccf8c3e222
API_BASE_URL=http://localhost:3001/api/v1/admin
```

**For production**, update `API_BASE_URL` to your production backend URL.

## Testing the Connection

You can test the connection using curl:

```bash
curl -X GET http://localhost:3001/api/v1/admin/metrics \
  -H "x-admin-api-key: e10fc184265409b7d72607f511d2421c5beefdb6a06b5699be33eaccf8c3e222" \
  -H "Content-Type: application/json"
```

Or using a tool like Postman or Insomnia:
1. Set the request method to `GET`
2. Set the URL to `http://localhost:3001/api/v1/admin/metrics`
3. Add a header: `x-admin-api-key` with the API key value
4. Send the request

## Notes

- The backend must be running for these endpoints to work
- All timestamps are in ISO 8601 format (UTC)
- Metrics are calculated in real-time from the database
- The `recipe_generations` table must exist (migration 005) for recipe metrics to work

