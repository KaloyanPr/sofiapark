# Sofia Parking - Interactive Parking Map Application

## Overview

Sofia Parking is a full-stack web application that provides real-time parking information for Sofia, Bulgaria. The application displays an interactive map with parking locations, availability status, pricing, and detailed information about each parking spot. Built with modern web technologies, it offers a responsive mobile-first design with intuitive search and filtering capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for Sofia-specific branding
- **Map Integration**: React Leaflet for interactive map functionality
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API architecture
- **Data Storage**: In-memory storage with interface for future database integration
- **Session Management**: Built-in session handling preparation

### Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: Shared between client and server (`shared/schema.ts`)
- **Migration Strategy**: Drizzle Kit for schema migrations
- **Tables**:
  - `users`: User authentication and management
  - `parking_locations`: Comprehensive parking data with geolocation, pricing, and availability

## Key Components

### Data Models
- **ParkingLocation**: Core entity with location data, pricing, availability, and features
- **User**: Authentication and user management
- **SearchFilters**: Client-side filtering options for parking locations

### API Endpoints
- `GET /api/parking-locations` - Retrieve all parking locations
- `GET /api/parking-locations/:id` - Get specific parking location details
- `GET /api/parking-locations/search/:query` - Search parking locations by name/address
- Future endpoints for availability updates and user management

### UI Components
- **ParkingMap**: Interactive Leaflet map with custom markers
- **SearchBar**: Real-time search with debounced queries
- **ParkingDetailsSheet**: Mobile-optimized bottom sheet for parking details
- **MapControls**: Zoom and center controls for map navigation
- **ParkingHeader**: Application header with branding

## Data Flow

1. **Application Bootstrap**: React app initializes with React Query client and UI providers
2. **Data Fetching**: TanStack Query manages API calls with caching and background updates
3. **Map Rendering**: Leaflet displays parking locations with status-based colored markers
4. **User Interaction**: Search queries trigger debounced API calls, map interactions update UI state
5. **Real-time Updates**: Query invalidation system keeps data fresh across components

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection (prepared for future use)
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **leaflet**: Map functionality
- **react-leaflet**: React integration for Leaflet
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Production server bundling

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module configured
- **Port Configuration**: Internal port 5000, external port 80
- **Live Reload**: Vite HMR with Replit integration

### Production Build Process
1. **Client Build**: Vite builds React app to `dist/public`
2. **Server Build**: esbuild bundles Express server to `dist/index.js`
3. **Asset Serving**: Express serves static files from built client
4. **Database Migration**: Drizzle Kit pushes schema changes

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment flag for development/production modes

## Changelog

- June 21, 2025: Initial Sofia parking map application setup
- June 21, 2025: Added user-contributed parking locations feature with PostgreSQL database, comprehensive form with validation, and optional coordinate fields

## User Preferences

Preferred communication style: Simple, everyday language.
Coordinates should be optional when adding new parking locations.