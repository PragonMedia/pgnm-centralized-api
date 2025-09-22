# PGNM MediPlanFinder API

A Node.js/Express API for landing page integration with redTrack.

## Features

- Store domain names and campaign IDs
- Search domains and trigger redTrack integration
- SQLite database for data persistence
- Database seeding functionality

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file (optional):

```bash
cp .env.example .env
```

3. Seed the database with sample data:

```bash
npm run seed
```

4. Start the server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### POST /api/domains

Store a domain name and campaign ID.

**Request Body:**

```json
{
  "domain_name": "example.com",
  "campaign_id": "6770837fb6900d8e0192c344"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Domain and campaign ID stored successfully",
  "data": {
    "id": 1,
    "domain_name": "example.com",
    "campaign_id": "6770837fb6900d8e0192c344"
  }
}
```

### GET /api/domains/track?domain_name=example.com

Search for a domain and trigger redTrack integration.

**Response:**

```json
{
  "success": true,
  "message": "Domain found and redTrack triggered successfully",
  "data": {
    "domain_name": "example.com",
    "campaign_id": "6770837fb6900d8e0192c344",
    "rtkcid": "rtk_1234567890_abc123def"
  }
}
```

### GET /api/domains

Get all stored domains (for testing).

### GET /health

Health check endpoint.

## Database

The API uses SQLite database with the following schema:

```sql
CREATE TABLE domains (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  domain_name TEXT UNIQUE NOT NULL,
  campaign_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## RedTrack Integration

The API integrates with redTrack by:

1. Receiving a domain name from the frontend
2. Looking up the associated campaign ID in the database
3. Calling redTrack's tracking endpoint with the campaign ID
4. Returning the unique tracking ID (rtkcid) to the frontend

## Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon
- `npm run seed` - Seed the database with sample data

