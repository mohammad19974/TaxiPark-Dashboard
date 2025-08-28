# 🚖 TaxiPark Pro - Complete Taxi Fleet Management Dashboard

[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Commercial-green.svg)](LICENSE)

A modern, full-stack taxi fleet management system with multi-language support, theme customization, and comprehensive CRUD operations.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)

## ✨ Features

### 🌍 Multi-Language Support
- **5 Languages**: English, Arabic, Hebrew, French, Spanish
- **RTL/LTR Support**: Automatic layout direction switching
- **Native Fonts**: Optimized typography for each language
- **Persistent Preferences**: Language selection saved locally

### 🎨 Theme Customization
- **Dynamic Color Picker**: Real-time theme preview
- **5 Built-in Presets**: Professional color schemes
- **Accessibility Validation**: WCAG AA/AAA compliance
- **Color-blind Safety**: Automatic contrast checking

### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based auth
- **Password Reset**: OTP-based email verification
- **Role-based Access**: Admin, Manager, Operator roles
- **Rate Limiting**: Protection against abuse

### 📊 Dashboard & Analytics
- **Real-time KPIs**: Live performance metrics
- **Interactive Charts**: Vehicle utilization, revenue tracking
- **Responsive Design**: Mobile-first approach
- **Data Visualization**: Comprehensive reporting

### 👥 User Management
- **CRUD Operations**: Complete user lifecycle
- **Profile Management**: User details and preferences
- **Activity Tracking**: User action logs
- **Bulk Operations**: Efficient mass updates

### 🚗 Fleet Management
- **Vehicle Registration**: Complete vehicle profiles
- **Driver Assignment**: Scheduling and tracking
- **Maintenance Records**: Service history and alerts
- **License Management**: Expiry tracking and renewals

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **React-i18next** - Internationalization
- **Recharts** - Data visualization

### Backend
- **NestJS** - Scalable Node.js framework
- **TypeORM** - Object-relational mapping
- **SQLite** - Lightweight database
- **JWT** - JSON Web Tokens
- **Nodemailer** - Email service
- **Bcrypt** - Password hashing
- **Swagger** - API documentation

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/taxipark-pro.git
cd taxipark-pro

# Install dependencies
npm install

# Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Run database migrations
cd backend
npm run migration:run

# Start development servers
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the frontend.
API documentation available at [http://localhost:3001/api](http://localhost:3001/api).

## 📦 Installation

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/taxipark-pro.git
   cd taxipark-pro
   ```

2. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Backend environment
   cp backend/.env.example backend/.env
   
   # Frontend environment
   cp frontend/.env.example frontend/.env
   ```

4. **Database Setup**
   ```bash
   cd backend
   
   # Run migrations
   npm run migration:run
   
   # Seed initial data (optional)
   npm run seed
   ```

5. **Start Development Servers**
   ```bash
   # From root directory
   npm run dev
   
   # Or start individually
   # Frontend (from frontend directory)
   npm run dev
   
   # Backend (from backend directory)
   npm run start:dev
   ```

## ⚙️ Configuration

### Backend Environment Variables

```env
# Database Configuration
DATABASE_TYPE=sqlite
DATABASE_PATH=./database.sqlite

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# App Configuration
PORT=3001
NODE_ENV=development
API_PREFIX=api

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@taxipark.com

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DEST=./uploads

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

### Frontend Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# App Configuration
VITE_APP_NAME=TaxiPark Pro
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin"
  }
}
```

#### POST `/auth/forgot-password`
Request password reset OTP.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST `/auth/verify-otp`
Verify OTP and get reset token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### POST `/auth/reset-password`
Reset password with verified token.

**Request Body:**
```json
{
  "resetToken": "reset-token-here",
  "newPassword": "newPassword123"
}
```

### User Management Endpoints

#### GET `/users`
Retrieve all users with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term
- `role` (optional): Filter by role
- `status` (optional): Filter by status

#### POST `/users`
Create a new user.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890",
  "role": "operator",
  "status": "active"
}
```

#### GET `/users/:id`
Retrieve user by ID.

#### PATCH `/users/:id`
Update user information.

#### DELETE `/users/:id`
Delete user (soft delete).

### Driver Management Endpoints

#### GET `/drivers`
Retrieve all drivers.

#### POST `/drivers`
Create a new driver.

#### GET `/drivers/:id`
Retrieve driver by ID.

#### PATCH `/drivers/:id`
Update driver information.

#### DELETE `/drivers/:id`
Delete driver.

### Vehicle Management Endpoints

#### GET `/vehicles`
Retrieve all vehicles.

#### POST `/vehicles`
Create a new vehicle.

#### GET `/vehicles/:id`
Retrieve vehicle by ID.

#### PATCH `/vehicles/:id`
Update vehicle information.

#### DELETE `/vehicles/:id`
Delete vehicle.

### Booking Management Endpoints

#### GET `/bookings`
Retrieve all bookings.

#### POST `/bookings`
Create a new booking.

#### GET `/bookings/:id`
Retrieve booking by ID.

#### PATCH `/bookings/:id`
Update booking status.

#### DELETE `/bookings/:id`
Cancel booking.

### Analytics Endpoints

#### GET `/analytics/dashboard`
Retrieve dashboard KPIs.

#### GET `/analytics/revenue`
Retrieve revenue analytics.

#### GET `/analytics/vehicle-utilization`
Retrieve vehicle utilization data.

## 🚀 Deployment

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Vercel Deployment (Frontend)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Railway/Heroku Deployment (Backend)

1. Create new app on Railway/Heroku
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Manual Server Deployment

```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
cd backend
pm2 start dist/main.js --name "taxipark-api"

# Serve frontend with nginx
# Copy frontend/dist to nginx web root
```

## 🧪 Testing

### Frontend Testing

```bash
cd frontend

# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Backend Testing

```bash
cd backend

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
```

## 🔧 Development

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Database Operations

```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert

# Seed database
npm run seed
```

## 📖 Documentation

- **API Documentation**: Available at `/api` when running backend
- **Storybook**: Component documentation at `http://localhost:6006`
- **TypeDoc**: Generated API docs in `docs/` directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow conventional commit messages
- Ensure code passes linting and formatting

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features on GitHub Issues
- **Email**: support@taxipark-pro.com
- **Community**: Join our Discord server

## 📄 License

This project is licensed under the Commercial License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- NestJS team for the powerful backend framework
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors who made this project possible

---

**Made with ❤️ by the TaxiPark Pro Team**

*Last Updated: January 2025*