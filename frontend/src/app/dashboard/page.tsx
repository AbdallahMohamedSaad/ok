'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  Share2, 
  Eye,
  Plus,
  Settings,
  Download,
  Filter,
  Search
} from 'lucide-react';

// Mock data - replace with real API calls
const competitorData = [
  { id: 1, name: 'Competitor 1', posts: 5, ads: 2, trend: 'up', engagement: 4.2 },
  { id: 2, name: 'Competitor 2', posts: 3, ads: 0, trend: 'down', engagement: 2.8 },
];

const engagementData = [
  { name: 'Mon', posts: 4, engagement: 2400 },
  { name: 'Tue', posts: 3, engagement: 1398 },
  { name: 'Wed', posts: 2, engagement: 9800 },
  { name: 'Thu', posts: 6, engagement: 3908 },
  { name: 'Fri', posts: 5, engagement: 4800 },
  { name: 'Sat', posts: 3, engagement: 3800 },
  { name: 'Sun', posts: 4, engagement: 4300 },
];

const platformData = [
  { name: 'Facebook', value: 60, color: '#1877F2' },
  { name: 'Instagram', value: 40, color: '#E4405F' },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('week');

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome, Abdallah!</h2>
          <p className="text-muted-foreground">
            Here's what's happening with your competitors today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Competitor
          </Button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">This Week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Ads</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.5%</div>
            <p className="text-xs text-muted-foreground">+0.5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Competitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Active monitoring</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Competitors Overview */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Competitors Overview</CardTitle>
            <CardDescription>Performance comparison of your tracked competitors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitorData.map((competitor) => (
                <div key={competitor.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {competitor.name.charAt(competitor.name.length - 1)}
                    </div>
                    <div>
                      <p className="font-medium">{competitor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {competitor.posts} posts • {competitor.ads} ads
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">{competitor.engagement}%</p>
                      <p className="text-sm text-muted-foreground">Engagement</p>
                    </div>
                    {competitor.trend === 'up' ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
            <CardDescription>Posts across different platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {platformData.map((platform) => (
                <div key={platform.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-sm">{platform.name}</span>
                  <span className="text-sm text-muted-foreground">{platform.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Trends</CardTitle>
          <CardDescription>Weekly engagement patterns across all competitors</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest posts and ads from your competitors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                1
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Competitor 1 posted on Facebook</p>
                  <Badge variant="secondary">2 hours ago</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  New product launch announcement with high engagement
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    234 likes
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    45 comments
                  </span>
                  <span className="flex items-center">
                    <Share2 className="w-4 h-4 mr-1" />
                    12 shares
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Competitor 2 started new ad campaign</p>
                  <Badge variant="secondary">5 hours ago</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Holiday promotion campaign targeting similar audience
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <span>Facebook, Instagram</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}