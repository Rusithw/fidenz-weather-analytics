# Weather Analytics & Comfort Index Platform

A full-stack, secure weather analytics web application that retrieves real-time weather metrics for selected global cities, evaluates environmental comfort using a custom mathematical model, provides high-performance server-side caching, and enforces secure access control via Auth0.

## Key Features

- Automated Weather Analytics: Ingests city codes from cities.json and fetches live atmospheric data from the OpenWeatherMap API.
- Custom Comfort Index Model: Computes a normalized Comfort Index Score (0 to 100) per city entirely on the backend.
- Dynamic Leaderboard Ranking: Sorts cities dynamically from Most Comfortable to Least Comfortable.
- Server-Side In-Memory Caching: 5-minute (300s) TTL caching layer reduces external API rate-limiting and accelerates response latency.
- Real-Time Cache Monitoring: Exposes live cache status (HITS vs MISSES) and processed city count.
- Enterprise Authentication (Auth0): Strict Single Sign-On (SSO) login/logout workflows with closed, whitelisted registration policies.
- Modern Responsive UI: Dark-mode dashboard built with React and modern responsive styling.

## Custom Comfort Index Algorithm

### Formula Architecture
Human thermal comfort depends on the interplay between temperature, relative humidity, and airflow. The backend evaluates each city against empirically established ideal comfort baselines using a penalty-deviation approach:

- Temp Score = max(0, 100 - (|Temperature - 22| * 5))
- Humidity Score = max(0, 100 - (|Humidity - 45| * 2))
- Wind Score = max(0, 100 - (|Wind Speed - 2.5| * 10))

- Comfort Index Score = round((Temp Score * 0.50) + (Humidity Score * 0.30) + (Wind Score * 0.20))

### Parameter Weights & Reasoning
1. Temperature (22°C, Weight: 50%): The primary physiological driver of thermal satisfaction. A 1°C divergence incurs a 5-point deduction.
2. Relative Humidity (45%, Weight: 30%): Excess moisture impairs natural perspiration, while overly dry air causes mucosal irritation. A 1% deviation incurs a 2-point deduction.
3. Wind Speed (2.5 m/s, Weight: 20%): Light breeze aids thermal regulation; dead calm retains humidity, whereas harsh winds cause convective discomfort. A 1 m/s deviation incurs a 10-point deduction.

### Considered Trade-offs
- Linear Penalty vs. Complex Psychrometrics: Linear penalties were chosen for computational simplicity, predictability, and runtime efficiency over heavy empirical equations.
- Static Baseline vs. Seasonal Acclimatization: Fixed baseline values were prioritized over regional seasonal adaptations to establish an objective global benchmark.

## Server-Side Cache Architecture

- Engine: Built using node-cache directly inside the Node.js runtime memory.
- TTL (Time To Live): 300 seconds (5 minutes) per city key (weather_{cityId}).
- Cache Strategy:
  1. Incoming requests iterate over the extracted city IDs.
  2. If data exists in memory, hitsCount increments and cached JSON is served instantly.
  3. If data is absent/expired, missesCount increments, a remote HTTP request is dispatched to OpenWeatherMap, and the response is stored with a 5-minute TTL.
- Benefits: Prevents API rate exhaustion, eliminates redundant network calls, and achieves sub-millisecond data delivery on subsequent requests.

## Tech Stack

- Backend: Node.js, Express.js, Axios, Node-Cache
- Frontend: React.js, Vite, Lucide React (Icons)
- Security & IAM: Auth0 Single Sign-On (OIDC / OAuth 2.0)
- External API: OpenWeatherMap API (Current Weather Data)

## Getting Started

### 1. Prerequisites
- Node.js (v18.x or higher)
- npm / yarn
- OpenWeatherMap API Key

### 2. Backend Setup
cd backend
npm install

Create a .env file in the backend folder:
PORT=5000
OPENWEATHER_API_KEY=your_openweathermap_api_key

Start backend:
npm run dev

### 3. Frontend Setup
cd frontend
npm install

Create a .env file in the frontend folder:
VITE_AUTH0_DOMAIN=dev-uv1ezahqfwcj7u0c.us.auth0.com
VITE_AUTH0_CLIENT_ID=ktygUj9gbzSMaLyDngEi2VDZI1mw70og

Start frontend:
npm run dev

## Test User Credentials (Auth0)

- Email: careers@fidenz.com
- Password: Pass#fidenz

## Known Limitations

1. In-Memory Cache Volatility: Using node-cache keeps cached data in process memory. Restarting the Node server resets the cache. (For production clustering, Redis is recommended).
2. Sequential API Fetching on Cache Miss: Initial cold requests make individual sequential calls. Batch processing or Promise.all can further optimize cold-start latency.