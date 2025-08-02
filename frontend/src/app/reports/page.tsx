'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Download, 
  FileText, 
  Calendar as CalendarIcon, 
  Eye, 
  Plus,
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  Clock,
  CheckCircle,
  Loader2,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

interface Report {
  id: string;
  name: string;
  type: 'weekly' | 'monthly' | 'custom' | 'comparison';
  status: 'completed' | 'generating' | 'failed';
  dateRange: {
    start: Date;
    end: Date;
  };
  competitors: string[];
  fileUrl?: string;
  generatedAt?: Date;
  expiresAt?: Date;
  size?: string;
}

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Weekly Performance Report',
    type: 'weekly',
    status: 'completed',
    dateRange: {
      start: new Date(2024, 0, 8),
      end: new Date(2024, 0, 14)
    },
    competitors: ['Competitor 1', 'Competitor 2'],
    fileUrl: '/reports/weekly-jan-8-14.pdf',
    generatedAt: new Date(2024, 0, 15),
    expiresAt: new Date(2024, 1, 15),
    size: '2.4 MB'
  },
  {
    id: '2',
    name: 'Monthly Analysis - December',
    type: 'monthly',
    status: 'completed',
    dateRange: {
      start: new Date(2023, 11, 1),
      end: new Date(2023, 11, 31)
    },
    competitors: ['Competitor 1'],
    fileUrl: '/reports/monthly-dec-2023.pdf',
    generatedAt: new Date(2024, 0, 2),
    expiresAt: new Date(2024, 2, 2),
    size: '5.1 MB'
  },
  {
    id: '3',
    name: 'Competitor Comparison',
    type: 'comparison',
    status: 'generating',
    dateRange: {
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 31)
    },
    competitors: ['Competitor 1', 'Competitor 2']
  }
];

const reportTypes = [
  { value: 'weekly', label: 'Weekly Report', icon: CalendarIcon },
  { value: 'monthly', label: 'Monthly Report', icon: BarChart3 },
  { value: 'comparison', label: 'Competitor Comparison', icon: Users },
  { value: 'custom', label: 'Custom Report', icon: PieChart }
];

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const [generating, setGenerating] = useState<string | null>(null);

  const handleDownload = async (report: Report) => {
    if (!report.fileUrl) return;
    
    try {
      // Simulate download
      toast.success(`Downloading ${report.name}...`);
      // In real implementation, this would trigger file download
      // window.open(report.fileUrl, '_blank');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  const handleViewOnline = (report: Report) => {
    toast.info('Opening report in new tab...');
    // In real implementation, this would open the report viewer
  };

  const generateNewReport = async (type: string) => {
    const newReport: Report = {
      id: Date.now().toString(),
      name: `${reportTypes.find(t => t.value === type)?.label} - ${format(new Date(), 'MMM dd, yyyy')}`,
      type: type as any,
      status: 'generating',
      dateRange: {
        start: dateRange.start || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: dateRange.end || new Date()
      },
      competitors: ['Competitor 1', 'Competitor 2']
    };

    setReports(prev => [newReport, ...prev]);
    setGenerating(newReport.id);

    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setReports(prev => prev.map(r => 
        r.id === newReport.id 
          ? { 
              ...r, 
              status: 'completed',
              fileUrl: `/reports/${type}-${Date.now()}.pdf`,
              generatedAt: new Date(),
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              size: '3.2 MB'
            }
          : r
      ));
      
      toast.success('Report generated successfully!');
    } catch (error) {
      setReports(prev => prev.map(r => 
        r.id === newReport.id ? { ...r, status: 'failed' } : r
      ));
      toast.error('Failed to generate report');
    } finally {
      setGenerating(null);
    }
  };

  const filteredReports = selectedType === 'all' 
    ? reports 
    : reports.filter(r => r.type === selectedType);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Generate and download detailed analytics reports
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              {reportTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Generate New Report */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Generate New Report</span>
            </CardTitle>
            <CardDescription>
              Create a new analytics report for your competitors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.value}
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => generateNewReport(type.value)}
                    disabled={generating !== null}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {type.value === 'weekly' && 'Last 7 days analysis'}
                          {type.value === 'monthly' && 'Monthly performance overview'}
                          {type.value === 'comparison' && 'Side-by-side competitor analysis'}
                          {type.value === 'custom' && 'Custom date range and metrics'}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Your generated reports and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No reports found</p>
                  <p className="text-sm">Generate your first report to get started</p>
                </div>
              ) : (
                filteredReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{report.name}</h4>
                          <Badge 
                            variant={
                              report.status === 'completed' ? 'default' :
                              report.status === 'generating' ? 'secondary' : 'destructive'
                            }
                          >
                            {report.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {report.status === 'generating' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {format(report.dateRange.start, 'MMM dd')} - {format(report.dateRange.end, 'MMM dd, yyyy')}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {report.competitors.length} competitors
                          </span>
                          {report.size && (
                            <span>{report.size}</span>
                          )}
                        </div>
                        {report.generatedAt && (
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            Generated {format(report.generatedAt, 'MMM dd, yyyy HH:mm')}
                            {report.expiresAt && (
                              <span className="ml-2">• Expires {format(report.expiresAt, 'MMM dd, yyyy')}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {report.status === 'completed' && (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOnline(report)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Online
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(report)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    )}
                    
                    {report.status === 'generating' && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </div>
                    )}
                    
                    {report.status === 'failed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateNewReport(report.type)}
                      >
                        Retry
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">
              {reports.filter(r => r.status === 'completed').length} completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.generatedAt && r.generatedAt.getMonth() === new Date().getMonth()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Reports</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.type === 'weekly').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Auto-generated weekly
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.8 MB</div>
            <p className="text-xs text-muted-foreground">
              of 100 MB limit
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}