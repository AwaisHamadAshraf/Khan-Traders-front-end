# Khan Traders Frontend

This is the frontend for the Khan Traders inventory management system.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```
   cd khan-traders-frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory (see `.env.example` for reference)

### Running the Application

For development:
```
npm start
```

The application will run on port 3000 by default.

## Building for Production

To create a production build:
```
npm run build:prod
```

This will create a `build` folder with the compiled assets ready for deployment.

## Environment Variables

- `REACT_APP_API_URL`: URL of the backend API
- `REACT_APP_ENV`: Current environment (development, production)
- `GENERATE_SOURCEMAP`: Whether to generate source maps (set to 'false' for production)

## Features

- Dashboard with sales and inventory statistics
- Inventory management
- Billing and sales
- Customer management
- User management
- Reports
- Settings

## Deployment

1. Build the application:
   ```
   npm run build:prod
   ```

2. Deploy the contents of the `build` folder to your web server or hosting platform

## Connecting to the Backend

The application will attempt to connect to the backend API specified in the `.env` file.
If the connection fails, it will fall back to using mock data for demonstration purposes.
