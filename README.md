# CivicTrack - Community Issue Tracking Platform

![CivicTrack Logo](logo.png)

CivicTrack is a modern, full-featured web application that empowers citizens to **report local civic issues** and **track their resolution progress**. Built with React, TypeScript, and Supabase, it provides a comprehensive platform for community engagement and transparent governance.

## 🚀 Features

### 🌍 Core Functionality
- **Issue Reporting**: Report civic issues with photos, location, and detailed descriptions
- **Real-time Tracking**: Monitor issue status from reported → in progress → resolved
- **Interactive Maps**: View issues on an interactive map with location-based filtering
- **Community Engagement**: Vote on issues, comment, and stay informed
- **User Dashboard**: Personal and community issue management

### 🛠️ Technical Features
- **Progressive Web App (PWA)**: Installable on mobile devices
- **Real-time Updates**: Live notifications and status changes via websockets
- **Geolocation**: GPS-based issue reporting and proximity filtering
- **Responsive Design**: Mobile-first, works on all devices
- **Authentication**: Secure user registration and login
- **Database**: PostgreSQL with PostGIS for location-based queries

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for fast development and building
- **React Router** for navigation with protected routes
- **Zustand** for state management
- **Leaflet.js** for interactive maps

### Backend
- **Supabase** for backend-as-a-service
- **PostgreSQL** with PostGIS extension
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** for live updates
- **File storage** for image uploads

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/soho-star/CivicTrack_Odoo.git
   cd CivicTrack_Odoo
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `database/schema.sql`
   - Enable PostGIS extension
   - Configure Row Level Security

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:5173` to see the application.

## 📁 Project Structure

```
CivicTrack/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Base UI components
│   │   │   ├── layout/        # Layout components
│   │   │   ├── forms/         # Form components
│   │   │   ├── maps/          # Map components
│   │   │   └── common/        # Common components
│   │   ├── pages/             # Page components
│   │   ├── features/          # Feature-based modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── issues/        # Issue management
│   │   │   └── notifications/ # Notifications
│   │   ├── services/          # API and external services
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # State management
│   │   ├── types/             # TypeScript definitions
│   │   └── utils/             # Utility functions
│   └── public/                # Static assets
├── database/                   # Database schema and migrations
│   ├── schema.sql             # Complete database schema
│   ├── migrations/            # Database migrations
│   ├── seeds/                 # Sample data
│   └── functions/             # Database functions
└── docs/                      # Documentation
```

## 🗄️ Database Schema

The application uses PostgreSQL with PostGIS for location-based features:

### Core Tables
- **users** - User profiles and authentication
- **issues** - Civic issues with location data
- **comments** - Issue discussions and updates
- **notifications** - Real-time user notifications
- **issue_votes** - Community voting on issues
- **status_updates** - Issue progress tracking

### Key Features
- **PostGIS integration** for location-based queries
- **Row Level Security** for data protection
- **Custom functions** for distance calculations
- **Triggers** for automated updates
- **Indexes** for performance optimization

## 🎯 User Roles

### Citizens
- Report new issues
- View community issues
- Vote and comment on issues
- Track personal submissions
- Receive notifications

### Authorities
- Update issue status
- Add official comments
- Manage assigned issues
- View analytics

### Administrators
- Full system access
- User management
- System configuration
- Analytics and reporting

## 🌟 Key Features Explained

### Issue Reporting
Users can report civic issues with:
- **Photos**: Multiple image uploads
- **Location**: GPS-based or manual location selection
- **Categories**: Severe, Mild, Low priority levels
- **Descriptions**: Detailed issue information

### Real-time Updates
- Live issue status changes
- New comment notifications
- Community activity updates
- WebSocket-based real-time sync

### Location Services
- **GPS Detection**: Automatic location detection
- **Proximity Filtering**: View issues within specified radius
- **Interactive Maps**: Visual issue representation
- **Address Geocoding**: Convert coordinates to addresses

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=CivicTrack
VITE_DEFAULT_LAT=40.7128
VITE_DEFAULT_LNG=-74.0060
```

## 🚀 Deployment

### Frontend Deployment
The frontend can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **Any static hosting service**

### Database Setup
1. Create Supabase project
2. Run `database/schema.sql`
3. Enable PostGIS extension
4. Configure authentication
5. Set up storage buckets

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the excellent backend-as-a-service platform
- **OpenStreetMap** for free map tiles
- **Leaflet.js** for the mapping library
- **Tailwind CSS** for the utility-first CSS framework
- **React** community for the amazing ecosystem

## 📞 Support

For support and questions:
- Create an [Issue](https://github.com/soho-star/CivicTrack_Odoo/issues)
- Check our [Documentation](docs/)
- Contact the maintainers

---

**Built with ❤️ for stronger communities and better civic engagement.**

*Empowering citizens to make their voices heard and create positive change in their communities.*