# Competitor Monitor SaaS

A comprehensive SaaS platform for monitoring and analyzing competitors' activities on Facebook and Instagram. Built with modern technologies and designed for scalability.

## 🚀 Features

### Core Functionality
- **Competitor Monitoring**: Track Facebook pages and Instagram accounts
- **Real-time Data Collection**: Automated scraping of posts, ads, and engagement metrics
- **Analytics Dashboard**: Comprehensive insights and performance comparisons
- **Report Generation**: Automated weekly/monthly reports with PDF export
- **Alert System**: Real-time notifications for competitor activities
- **Multi-platform Support**: Facebook and Instagram integration

### Technical Features
- **Microservices Architecture**: Scalable and maintainable backend services
- **Modern Frontend**: React 18 with Next.js 14 and Tailwind CSS
- **Real-time Updates**: WebSocket connections for live dashboard updates
- **Rate Limit Management**: Intelligent API usage optimization
- **Data Visualization**: Interactive charts and analytics
- **Responsive Design**: Mobile-first approach with modern UI

## 🏗️ Architecture

### High-Level Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Backend       │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐             │
                       │   Queue System  │◄────────────┘
                       │   (Redis/Bull)  │
                       └─────────────────┘
                                │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Meta APIs     │    │   Data Workers  │    │   Database      │
│   (Graph/Ads)   │◄──►│   (Collectors)  │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: Zustand
- **Charts**: Recharts
- **Authentication**: NextAuth.js

#### Backend
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with optimized indexes
- **Cache**: Redis for sessions and API caching
- **Queue**: Bull/BullMQ for background jobs
- **ORM**: Raw SQL with connection pooling

#### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Development**: Hot reload with volume mounting
- **Production**: Multi-stage builds with optimization
- **Monitoring**: Health checks and logging

## 📋 Prerequisites

- **Node.js**: 18.0.0 or higher
- **Docker**: Latest version with Docker Compose
- **Meta Developer Account**: For Facebook/Instagram API access
- **PostgreSQL**: 15+ (or use Docker)
- **Redis**: 7+ (or use Docker)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd competitor-monitor-saas
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### 3. Meta API Setup
1. Create a Facebook App at [developers.facebook.com](https://developers.facebook.com)
2. Add your `META_APP_ID` and `META_APP_SECRET` to `.env`
3. Configure app permissions for Pages and Instagram APIs

### 4. Docker Development
```bash
# Start all services
npm run docker:dev

# Or start individual services
docker-compose -f docker-compose.dev.yml up frontend backend postgres redis
```

### 5. Manual Development
```bash
# Install dependencies
npm install

# Start backend
cd backend && npm run dev

# Start frontend (in new terminal)
cd frontend && npm run dev
```

## 🔧 Configuration

### Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://admin:password@localhost:5432/competitor_monitor

# Meta API (Required)
META_APP_ID=your-facebook-app-id
META_APP_SECRET=your-facebook-app-secret

# JWT Security
JWT_SECRET=your-super-secret-jwt-key
```

### Optional Configuration
- **Email Notifications**: SMTP settings for alerts
- **File Storage**: Local or S3 for report storage
- **Stripe Integration**: For subscription management
- **Rate Limiting**: API usage controls

## 📊 Database Schema

### Core Tables
- **users**: User accounts and subscriptions
- **competitors**: Monitored Facebook/Instagram accounts
- **posts**: Collected social media posts
- **ads**: Facebook Ad Library data
- **analytics**: Processed metrics and insights
- **reports**: Generated report metadata
- **alerts**: User notification rules

### Indexes
Optimized indexes for:
- User-specific queries
- Time-based analytics
- Platform filtering
- Engagement sorting

## 🔌 API Integration

### Meta Graph API
- **Pages API**: Public page information and posts
- **Instagram API**: Business account posts and metrics
- **Rate Limiting**: 200 calls/hour per app
- **Webhooks**: Real-time updates (future enhancement)

### Meta Ad Library API
- **Ad Search**: Find ads by page or keyword
- **Ad Details**: Creative content and targeting
- **Spend Data**: Estimated budget information
- **Demographics**: Audience targeting data

## 📈 Analytics Features

### Metrics Tracked
- **Engagement**: Likes, comments, shares, reactions
- **Reach**: Follower growth and post visibility
- **Content**: Post frequency and types
- **Advertising**: Ad spend and creative analysis

### Insights Generated
- **Performance Trends**: Time-series analysis
- **Competitor Comparison**: Side-by-side metrics
- **Content Analysis**: Top-performing posts
- **Audience Insights**: Demographics and interests

## 🚦 Development Workflow

### Code Structure
```
├── frontend/                 # Next.js frontend
│   ├── src/app/             # App router pages
│   ├── src/components/      # Reusable components
│   └── src/lib/             # Utilities and hooks
├── backend/                 # Express.js backend
│   ├── src/controllers/     # Route handlers
│   ├── src/services/        # Business logic
│   ├── src/workers/         # Background jobs
│   └── src/utils/           # Helper functions
├── database/                # SQL schemas and migrations
└── docker-compose.dev.yml   # Development environment
```

### Development Commands
```bash
# Frontend development
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint

# Backend development
cd backend
npm run dev          # Start with nodemon
npm run build        # Compile TypeScript
npm run test         # Run test suite

# Database operations
npm run db:migrate   # Run migrations
npm run db:studio    # Open database GUI
```

## 🔒 Security Considerations

### Data Protection
- **Encryption**: Sensitive data encrypted at rest
- **HTTPS**: All communications secured
- **Input Validation**: Comprehensive request sanitization
- **Rate Limiting**: API abuse prevention

### Privacy Compliance
- **GDPR Ready**: User data export/deletion
- **Data Retention**: Configurable retention policies
- **Audit Logs**: User action tracking
- **Consent Management**: Privacy preferences

## 📊 Monitoring & Observability

### Health Checks
- **Database Connectivity**: Connection pool status
- **Redis Availability**: Cache system health
- **External APIs**: Meta API response times
- **Queue Processing**: Background job status

### Logging
- **Structured Logging**: JSON format with correlation IDs
- **Error Tracking**: Comprehensive error capture
- **Performance Metrics**: Response time monitoring
- **User Analytics**: Usage pattern analysis

## 🚀 Deployment Options

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.yml build

# Deploy with orchestration
docker-compose -f docker-compose.yml up -d
```

### Cloud Deployment
- **AWS**: ECS/EKS with RDS and ElastiCache
- **Google Cloud**: GKE with Cloud SQL and Memorystore
- **Azure**: AKS with PostgreSQL and Redis Cache
- **Vercel/Netlify**: Frontend deployment options

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Follow code style guidelines
4. Add tests for new features
5. Submit a pull request

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- **API Reference**: `/docs/api`
- **Architecture Guide**: `/docs/architecture`
- **Deployment Guide**: `/docs/deployment`

### Community
- **Issues**: GitHub issue tracker
- **Discussions**: GitHub discussions
- **Discord**: Community server (link)

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Core monitoring functionality
- ✅ Basic analytics dashboard
- ✅ Report generation
- ✅ Docker development environment

### Phase 2 (Next)
- 🔄 Real-time WebSocket updates
- 🔄 Advanced ML-powered insights
- 🔄 White-label solution
- 🔄 Mobile application

### Phase 3 (Future)
- 📋 Additional social platforms (Twitter, LinkedIn)
- 📋 Advanced sentiment analysis
- 📋 Competitor discovery suggestions
- 📋 API marketplace integration

---

**Built with ❤️ for competitive intelligence and market research.**