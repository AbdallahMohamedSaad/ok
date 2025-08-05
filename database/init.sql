-- Competitor Monitoring SaaS Database Schema
-- Initialize database with UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for authentication and subscription management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    subscription_tier VARCHAR(50) NOT NULL DEFAULT 'free', -- free, basic, pro, enterprise
    subscription_status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, cancelled, expired
    subscription_expires_at TIMESTAMP,
    meta_access_token TEXT, -- Encrypted Meta API access token
    is_email_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Competitors/Pages being monitored
CREATE TABLE competitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    facebook_page_id VARCHAR(100),
    facebook_page_name VARCHAR(255),
    instagram_username VARCHAR(100),
    instagram_user_id VARCHAR(100),
    category VARCHAR(100),
    industry VARCHAR(100),
    description TEXT,
    website_url VARCHAR(500),
    follower_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    monitoring_enabled BOOLEAN DEFAULT true,
    last_scraped_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Posts data from Facebook and Instagram
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL, -- 'facebook' or 'instagram'
    post_id VARCHAR(100) NOT NULL,
    content TEXT,
    media_urls TEXT[], -- Array of media URLs
    media_type VARCHAR(50), -- photo, video, carousel, story
    post_type VARCHAR(50), -- post, reel, story, etc.
    hashtags TEXT[],
    mentions TEXT[],
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2),
    posted_at TIMESTAMP,
    collected_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(platform, post_id)
);

-- Ads data from Meta Ad Library
CREATE TABLE ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
    ad_id VARCHAR(100) NOT NULL UNIQUE,
    ad_creative_id VARCHAR(100),
    ad_name VARCHAR(255),
    creative_url TEXT,
    ad_text TEXT,
    headline VARCHAR(500),
    description TEXT,
    call_to_action VARCHAR(100),
    destination_url TEXT,
    platforms TEXT[], -- facebook, instagram, messenger, audience_network
    placements TEXT[], -- feed, stories, reels, etc.
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    spend_estimate_min INTEGER,
    spend_estimate_max INTEGER,
    currency VARCHAR(10) DEFAULT 'USD',
    impressions_min INTEGER,
    impressions_max INTEGER,
    demographics JSONB, -- Age, gender, location targeting
    interests JSONB, -- Interest targeting
    collected_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics and metrics data
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
    metric_type VARCHAR(100) NOT NULL, -- followers, engagement_rate, post_frequency, etc.
    metric_value DECIMAL(15,2),
    metric_date DATE NOT NULL,
    platform VARCHAR(20), -- facebook, instagram, or null for combined
    additional_data JSONB, -- Store additional metric details
    calculated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(competitor_id, metric_type, metric_date, platform)
);

-- User alerts and notifications
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
    alert_type VARCHAR(100) NOT NULL, -- new_post, ad_change, follower_milestone, etc.
    alert_name VARCHAR(255) NOT NULL,
    conditions JSONB NOT NULL, -- Alert conditions and thresholds
    is_active BOOLEAN DEFAULT true,
    notification_channels TEXT[] DEFAULT ARRAY['email'], -- email, webhook, push
    webhook_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Notification history
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    alert_id UUID REFERENCES alerts(id) ON DELETE SET NULL,
    competitor_id UUID REFERENCES competitors(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL, -- email, webhook, push
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed
    metadata JSONB,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reports and exports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_name VARCHAR(255) NOT NULL,
    report_type VARCHAR(100) NOT NULL, -- weekly, monthly, custom, comparison
    competitors UUID[] NOT NULL, -- Array of competitor IDs
    date_range_start DATE NOT NULL,
    date_range_end DATE NOT NULL,
    filters JSONB, -- Report filters and parameters
    file_url VARCHAR(500), -- S3 URL or local path
    file_format VARCHAR(20) DEFAULT 'pdf', -- pdf, xlsx, csv
    status VARCHAR(50) DEFAULT 'pending', -- pending, generating, completed, failed
    generated_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- API usage tracking for rate limiting
CREATE TABLE api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    api_endpoint VARCHAR(255) NOT NULL,
    api_method VARCHAR(10) NOT NULL,
    request_count INTEGER DEFAULT 1,
    date_hour TIMESTAMP NOT NULL, -- Rounded to the hour
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, api_endpoint, api_method, date_hour)
);

-- Subscription plans and features
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    max_competitors INTEGER,
    max_api_calls_per_hour INTEGER,
    features JSONB, -- Array of feature flags
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_competitors_user_id ON competitors(user_id);
CREATE INDEX idx_competitors_facebook_page_id ON competitors(facebook_page_id);
CREATE INDEX idx_competitors_instagram_username ON competitors(instagram_username);

CREATE INDEX idx_posts_competitor_id ON posts(competitor_id);
CREATE INDEX idx_posts_platform ON posts(platform);
CREATE INDEX idx_posts_posted_at ON posts(posted_at);
CREATE INDEX idx_posts_engagement_rate ON posts(engagement_rate);

CREATE INDEX idx_ads_competitor_id ON ads(competitor_id);
CREATE INDEX idx_ads_is_active ON ads(is_active);
CREATE INDEX idx_ads_start_date ON ads(start_date);
CREATE INDEX idx_ads_end_date ON ads(end_date);

CREATE INDEX idx_analytics_competitor_id ON analytics(competitor_id);
CREATE INDEX idx_analytics_metric_type ON analytics(metric_type);
CREATE INDEX idx_analytics_metric_date ON analytics(metric_date);

CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_competitor_id ON alerts(competitor_id);
CREATE INDEX idx_alerts_is_active ON alerts(is_active);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);

CREATE INDEX idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX idx_api_usage_date_hour ON api_usage(date_hour);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, max_competitors, max_api_calls_per_hour, features) VALUES
('Free', 'Basic monitoring for small businesses', 0.00, 0.00, 3, 100, '["basic_analytics", "email_alerts"]'),
('Basic', 'Enhanced monitoring with more competitors', 29.99, 299.99, 10, 500, '["basic_analytics", "email_alerts", "weekly_reports", "competitor_comparison"]'),
('Pro', 'Professional monitoring with advanced features', 79.99, 799.99, 25, 1000, '["advanced_analytics", "email_alerts", "webhook_alerts", "custom_reports", "competitor_comparison", "sentiment_analysis"]'),
('Enterprise', 'Full-featured monitoring for large organizations', 199.99, 1999.99, 100, 5000, '["advanced_analytics", "email_alerts", "webhook_alerts", "custom_reports", "competitor_comparison", "sentiment_analysis", "api_access", "white_label"]');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_competitors_updated_at BEFORE UPDATE ON competitors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON ads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();