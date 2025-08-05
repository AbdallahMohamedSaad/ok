import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server configuration
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8000', 10),
  
  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://admin:password@localhost:5432/competitor_monitor',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
    ssl: process.env.NODE_ENV === 'production',
  },
  
  // Redis configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // Meta API configuration
  meta: {
    appId: process.env.META_APP_ID || '',
    appSecret: process.env.META_APP_SECRET || '',
    apiVersion: process.env.META_API_VERSION || 'v18.0',
    baseUrl: 'https://graph.facebook.com',
    adLibraryUrl: 'https://graph.facebook.com/v18.0/ads_archive',
    rateLimitPerHour: parseInt(process.env.META_RATE_LIMIT_PER_HOUR || '200', 10),
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  },
  
  // Email configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@competitormonitor.com',
  },
  
  // File storage configuration
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local', // 'local' or 's3'
    localPath: process.env.STORAGE_LOCAL_PATH || './uploads',
    s3: {
      bucket: process.env.S3_BUCKET || '',
      region: process.env.S3_REGION || 'us-east-1',
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
  },
  
  // Stripe configuration
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  
  // Queue configuration
  queue: {
    defaultJobOptions: {
      removeOnComplete: 100,
      removeOnFail: 50,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    },
  },
  
  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
  
  // Security configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    encryptionKey: process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key',
  },
  
  // Application limits
  limits: {
    maxCompetitorsPerUser: {
      free: 3,
      basic: 10,
      pro: 25,
      enterprise: 100,
    },
    maxApiCallsPerHour: {
      free: 100,
      basic: 500,
      pro: 1000,
      enterprise: 5000,
    },
  },
};

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'META_APP_ID',
  'META_APP_SECRET',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0 && config.env !== 'test') {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}