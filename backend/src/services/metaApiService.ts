import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { config } from '@/config/config';
import { logger } from '@/utils/logger';
import { RateLimiterMemory } from 'rate-limiter-flexible';

interface FacebookPageData {
  id: string;
  name: string;
  username?: string;
  about?: string;
  category?: string;
  website?: string;
  fan_count?: number;
  followers_count?: number;
  link?: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  type: string;
  link?: string;
  picture?: string;
  full_picture?: string;
  likes?: {
    summary: {
      total_count: number;
    };
  };
  comments?: {
    summary: {
      total_count: number;
    };
  };
  shares?: {
    count: number;
  };
  reactions?: {
    summary: {
      total_count: number;
    };
  };
}

interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  permalink?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  thumbnail_url?: string;
}

interface AdData {
  id: string;
  ad_creation_time: string;
  ad_creative_bodies?: Array<{
    text: string;
  }>;
  ad_creative_link_captions?: Array<{
    text: string;
  }>;
  ad_creative_link_descriptions?: Array<{
    text: string;
  }>;
  ad_creative_link_titles?: Array<{
    text: string;
  }>;
  ad_delivery_start_time?: string;
  ad_delivery_stop_time?: string;
  ad_snapshot_url?: string;
  currency?: string;
  demographic_distribution?: any;
  funding_entity?: string;
  impressions?: {
    lower_bound: string;
    upper_bound: string;
  };
  languages?: string[];
  page_id: string;
  page_name: string;
  platforms?: string[];
  publisher_platforms?: string[];
  spend?: {
    lower_bound: string;
    upper_bound: string;
  };
}

class MetaApiService {
  private graphApiClient: AxiosInstance;
  private adLibraryClient: AxiosInstance;
  private rateLimiter: RateLimiterMemory;

  constructor() {
    // Initialize Graph API client
    this.graphApiClient = axios.create({
      baseURL: config.meta.baseUrl,
      timeout: 30000,
      headers: {
        'User-Agent': 'CompetitorMonitor/1.0',
      },
    });

    // Initialize Ad Library API client
    this.adLibraryClient = axios.create({
      baseURL: config.meta.adLibraryUrl,
      timeout: 30000,
      headers: {
        'User-Agent': 'CompetitorMonitor/1.0',
      },
    });

    // Rate limiter: 200 requests per hour as per Meta's limits
    this.rateLimiter = new RateLimiterMemory({
      keyPrefix: 'meta_api',
      points: config.meta.rateLimitPerHour,
      duration: 3600, // 1 hour
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for rate limiting
    const requestInterceptor = async (config: AxiosRequestConfig) => {
      try {
        await this.rateLimiter.consume('meta_api_calls');
        return config;
      } catch (rateLimiterRes) {
        const msBeforeNext = rateLimiterRes.msBeforeNext || 1000;
        logger.warn(`Meta API rate limit exceeded. Waiting ${msBeforeNext}ms`);
        
        return new Promise((resolve) => {
          setTimeout(() => resolve(config), msBeforeNext);
        });
      }
    };

    // Response interceptor for error handling
    const responseInterceptor = (response: any) => response;
    const errorInterceptor = (error: any) => {
      if (error.response) {
        const { status, data } = error.response;
        logger.error('Meta API Error:', {
          status,
          error: data.error,
          url: error.config?.url,
        });

        // Handle specific Meta API errors
        if (status === 400 && data.error?.code === 190) {
          throw new Error('Invalid access token');
        }
        if (status === 403) {
          throw new Error('Access forbidden - check permissions');
        }
        if (status === 429) {
          throw new Error('Rate limit exceeded');
        }
      }
      return Promise.reject(error);
    };

    this.graphApiClient.interceptors.request.use(requestInterceptor);
    this.graphApiClient.interceptors.response.use(responseInterceptor, errorInterceptor);
    
    this.adLibraryClient.interceptors.request.use(requestInterceptor);
    this.adLibraryClient.interceptors.response.use(responseInterceptor, errorInterceptor);
  }

  /**
   * Get Facebook page information
   */
  async getFacebookPageInfo(pageId: string, accessToken: string): Promise<FacebookPageData> {
    try {
      const fields = [
        'id',
        'name',
        'username',
        'about',
        'category',
        'website',
        'fan_count',
        'followers_count',
        'link',
        'picture{url}'
      ].join(',');

      const response = await this.graphApiClient.get(`/${config.meta.apiVersion}/${pageId}`, {
        params: {
          fields,
          access_token: accessToken,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Error fetching Facebook page info:', error);
      throw new Error(`Failed to fetch Facebook page info: ${error.message}`);
    }
  }

  /**
   * Get Facebook page posts
   */
  async getFacebookPagePosts(
    pageId: string, 
    accessToken: string, 
    limit: number = 25,
    since?: string,
    until?: string
  ): Promise<FacebookPost[]> {
    try {
      const fields = [
        'id',
        'message',
        'story',
        'created_time',
        'type',
        'link',
        'picture',
        'full_picture',
        'likes.summary(true)',
        'comments.summary(true)',
        'shares',
        'reactions.summary(true)'
      ].join(',');

      const params: any = {
        fields,
        limit,
        access_token: accessToken,
      };

      if (since) params.since = since;
      if (until) params.until = until;

      const response = await this.graphApiClient.get(`/${config.meta.apiVersion}/${pageId}/posts`, {
        params,
      });

      return response.data.data || [];
    } catch (error) {
      logger.error('Error fetching Facebook posts:', error);
      throw new Error(`Failed to fetch Facebook posts: ${error.message}`);
    }
  }

  /**
   * Get Instagram business account info
   */
  async getInstagramAccountInfo(instagramAccountId: string, accessToken: string): Promise<any> {
    try {
      const fields = [
        'id',
        'username',
        'name',
        'biography',
        'website',
        'followers_count',
        'follows_count',
        'media_count',
        'profile_picture_url'
      ].join(',');

      const response = await this.graphApiClient.get(`/${config.meta.apiVersion}/${instagramAccountId}`, {
        params: {
          fields,
          access_token: accessToken,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Error fetching Instagram account info:', error);
      throw new Error(`Failed to fetch Instagram account info: ${error.message}`);
    }
  }

  /**
   * Get Instagram posts
   */
  async getInstagramPosts(
    instagramAccountId: string,
    accessToken: string,
    limit: number = 25,
    since?: string,
    until?: string
  ): Promise<InstagramPost[]> {
    try {
      const fields = [
        'id',
        'caption',
        'media_type',
        'media_url',
        'permalink',
        'timestamp',
        'like_count',
        'comments_count',
        'thumbnail_url'
      ].join(',');

      const params: any = {
        fields,
        limit,
        access_token: accessToken,
      };

      if (since) params.since = since;
      if (until) params.until = until;

      const response = await this.graphApiClient.get(`/${config.meta.apiVersion}/${instagramAccountId}/media`, {
        params,
      });

      return response.data.data || [];
    } catch (error) {
      logger.error('Error fetching Instagram posts:', error);
      throw new Error(`Failed to fetch Instagram posts: ${error.message}`);
    }
  }

  /**
   * Search ads in Ad Library
   */
  async searchAds(
    searchTerms?: string,
    adReachedCountries?: string[],
    adActiveStatus?: 'ACTIVE' | 'INACTIVE' | 'ALL',
    limit: number = 100,
    searchPageIds?: string[]
  ): Promise<AdData[]> {
    try {
      const params: any = {
        access_token: `${config.meta.appId}|${config.meta.appSecret}`,
        ad_type: 'POLITICAL_AND_ISSUE_ADS',
        ad_active_status: adActiveStatus || 'ALL',
        limit,
        fields: [
          'id',
          'ad_creation_time',
          'ad_creative_bodies',
          'ad_creative_link_captions',
          'ad_creative_link_descriptions',
          'ad_creative_link_titles',
          'ad_delivery_start_time',
          'ad_delivery_stop_time',
          'ad_snapshot_url',
          'currency',
          'demographic_distribution',
          'funding_entity',
          'impressions',
          'languages',
          'page_id',
          'page_name',
          'platforms',
          'publisher_platforms',
          'spend'
        ].join(','),
      };

      if (searchTerms) {
        params.search_terms = searchTerms;
      }

      if (adReachedCountries && adReachedCountries.length > 0) {
        params.ad_reached_countries = adReachedCountries;
      }

      if (searchPageIds && searchPageIds.length > 0) {
        params.search_page_ids = searchPageIds.join(',');
      }

      const response = await this.adLibraryClient.get('', { params });

      return response.data.data || [];
    } catch (error) {
      logger.error('Error searching ads:', error);
      throw new Error(`Failed to search ads: ${error.message}`);
    }
  }

  /**
   * Validate Facebook page URL and extract page ID
   */
  async validateFacebookPage(pageUrl: string, accessToken: string): Promise<{ isValid: boolean; pageData?: FacebookPageData; error?: string }> {
    try {
      // Extract page identifier from URL
      const pageIdentifier = this.extractPageIdentifierFromUrl(pageUrl);
      
      if (!pageIdentifier) {
        return { isValid: false, error: 'Invalid Facebook page URL format' };
      }

      // Try to fetch page info
      const pageData = await this.getFacebookPageInfo(pageIdentifier, accessToken);
      
      return { isValid: true, pageData };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  }

  /**
   * Validate Instagram username
   */
  async validateInstagramUsername(username: string, accessToken: string): Promise<{ isValid: boolean; accountData?: any; error?: string }> {
    try {
      // For Instagram Basic Display API, we would need to search for the user
      // This is a simplified version - in reality, you'd need Instagram Business API
      // or use Instagram Basic Display API with proper authentication flow
      
      // For now, we'll do basic validation
      const isValidUsername = /^[a-zA-Z0-9._]{1,30}$/.test(username);
      
      if (!isValidUsername) {
        return { isValid: false, error: 'Invalid Instagram username format' };
      }

      // In a real implementation, you would:
      // 1. Use Instagram Basic Display API to search for the user
      // 2. Or use Instagram Business API if the account is a business account
      // 3. Handle the authentication flow properly

      return { 
        isValid: true, 
        accountData: { 
          username, 
          followers_count: Math.floor(Math.random() * 10000) // Mock data
        } 
      };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  }

  /**
   * Extract page identifier from Facebook URL
   */
  private extractPageIdentifierFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      
      // Handle different Facebook URL formats
      if (urlObj.hostname.includes('facebook.com')) {
        const pathname = urlObj.pathname;
        
        // Remove leading slash and split by slash
        const parts = pathname.substring(1).split('/');
        
        // Get the first part which should be the page identifier
        if (parts.length > 0 && parts[0]) {
          return parts[0];
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Calculate engagement rate for a post
   */
  calculateEngagementRate(post: FacebookPost | InstagramPost, followerCount: number): number {
    let totalEngagement = 0;

    if ('likes' in post && post.likes?.summary?.total_count) {
      totalEngagement += post.likes.summary.total_count;
    }
    if ('like_count' in post && post.like_count) {
      totalEngagement += post.like_count;
    }
    if ('comments' in post && post.comments?.summary?.total_count) {
      totalEngagement += post.comments.summary.total_count;
    }
    if ('comments_count' in post && post.comments_count) {
      totalEngagement += post.comments_count;
    }
    if ('shares' in post && post.shares?.count) {
      totalEngagement += post.shares.count;
    }
    if ('reactions' in post && post.reactions?.summary?.total_count) {
      totalEngagement += post.reactions.summary.total_count;
    }

    if (followerCount === 0) return 0;
    
    return (totalEngagement / followerCount) * 100;
  }

  /**
   * Get rate limiter stats
   */
  async getRateLimiterStats(): Promise<{ remainingPoints: number; totalHits: number; resetTime: Date }> {
    const resRateLimiter = await this.rateLimiter.get('meta_api_calls');
    
    return {
      remainingPoints: resRateLimiter ? resRateLimiter.remainingPoints : config.meta.rateLimitPerHour,
      totalHits: resRateLimiter ? resRateLimiter.totalHits : 0,
      resetTime: resRateLimiter ? new Date(Date.now() + resRateLimiter.msBeforeNext) : new Date(),
    };
  }
}

export const metaApiService = new MetaApiService();
export { FacebookPageData, FacebookPost, InstagramPost, AdData };