'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Plus, 
  Facebook, 
  Instagram, 
  Globe, 
  Building2,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface CompetitorForm {
  name: string;
  facebookPageUrl: string;
  instagramUsername: string;
  category: string;
  industry: string;
  description: string;
  websiteUrl: string;
}

const categories = [
  'E-commerce',
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Entertainment',
  'Food & Beverage',
  'Fashion',
  'Travel',
  'Real Estate',
  'Automotive',
  'Other'
];

const industries = [
  'Retail',
  'SaaS',
  'Manufacturing',
  'Services',
  'Media',
  'Non-profit',
  'Government',
  'Startup',
  'Enterprise',
  'Small Business'
];

export default function AddCompetitorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState({ facebook: false, instagram: false });
  const [validation, setValidation] = useState({ facebook: null, instagram: null });
  
  const [form, setForm] = useState<CompetitorForm>({
    name: '',
    facebookPageUrl: '',
    instagramUsername: '',
    category: '',
    industry: '',
    description: '',
    websiteUrl: ''
  });

  const handleInputChange = (field: keyof CompetitorForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Clear validation when user changes input
    if (field === 'facebookPageUrl') {
      setValidation(prev => ({ ...prev, facebook: null }));
    }
    if (field === 'instagramUsername') {
      setValidation(prev => ({ ...prev, instagram: null }));
    }
  };

  const validateFacebookPage = async () => {
    if (!form.facebookPageUrl) return;
    
    setValidating(prev => ({ ...prev, facebook: true }));
    
    try {
      // Simulate API call to validate Facebook page
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation result
      const isValid = form.facebookPageUrl.includes('facebook.com');
      setValidation(prev => ({ 
        ...prev, 
        facebook: isValid 
          ? { status: 'valid', data: { name: 'Example Company', followers: '10.2K' } }
          : { status: 'invalid', error: 'Invalid Facebook page URL' }
      }));
      
      if (isValid && !form.name) {
        setForm(prev => ({ ...prev, name: 'Example Company' }));
      }
    } catch (error) {
      setValidation(prev => ({ 
        ...prev, 
        facebook: { status: 'error', error: 'Failed to validate page' }
      }));
    } finally {
      setValidating(prev => ({ ...prev, facebook: false }));
    }
  };

  const validateInstagramUsername = async () => {
    if (!form.instagramUsername) return;
    
    setValidating(prev => ({ ...prev, instagram: true }));
    
    try {
      // Simulate API call to validate Instagram username
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock validation result
      const isValid = form.instagramUsername.length > 0 && !form.instagramUsername.includes(' ');
      setValidation(prev => ({ 
        ...prev, 
        instagram: isValid 
          ? { status: 'valid', data: { username: form.instagramUsername, followers: '8.5K' } }
          : { status: 'invalid', error: 'Invalid Instagram username' }
      }));
    } catch (error) {
      setValidation(prev => ({ 
        ...prev, 
        instagram: { status: 'error', error: 'Failed to validate username' }
      }));
    } finally {
      setValidating(prev => ({ ...prev, instagram: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || (!form.facebookPageUrl && !form.instagramUsername)) {
      toast.error('Please provide at least a name and one social media account');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Competitor added successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to add competitor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add Competitor</h2>
          <p className="text-muted-foreground">
            Add a new competitor to monitor their social media activity
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Provide basic details about your competitor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter competitor name"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry.toLowerCase()}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the competitor (optional)"
                  value={form.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    placeholder="https://example.com"
                    value={form.websiteUrl}
                    onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Social Media Accounts</span>
              </CardTitle>
              <CardDescription>
                Add at least one social media account to monitor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Facebook Page */}
              <div className="space-y-2">
                <Label htmlFor="facebook" className="flex items-center space-x-2">
                  <Facebook className="h-4 w-4 text-blue-600" />
                  <span>Facebook Page URL</span>
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="facebook"
                    placeholder="https://facebook.com/yourcompetitor"
                    value={form.facebookPageUrl}
                    onChange={(e) => handleInputChange('facebookPageUrl', e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={validateFacebookPage}
                    disabled={!form.facebookPageUrl || validating.facebook}
                  >
                    {validating.facebook ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Validate'
                    )}
                  </Button>
                </div>
                
                {validation.facebook && (
                  <div className={`flex items-center space-x-2 text-sm ${
                    validation.facebook.status === 'valid' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {validation.facebook.status === 'valid' ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Valid page found: {validation.facebook.data.name} ({validation.facebook.data.followers} followers)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        <span>{validation.facebook.error}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Instagram Username */}
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center space-x-2">
                  <Instagram className="h-4 w-4 text-pink-600" />
                  <span>Instagram Username</span>
                </Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-3 text-muted-foreground">@</span>
                    <Input
                      id="instagram"
                      placeholder="username"
                      value={form.instagramUsername}
                      onChange={(e) => handleInputChange('instagramUsername', e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={validateInstagramUsername}
                    disabled={!form.instagramUsername || validating.instagram}
                  >
                    {validating.instagram ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Validate'
                    )}
                  </Button>
                </div>
                
                {validation.instagram && (
                  <div className={`flex items-center space-x-2 text-sm ${
                    validation.instagram.status === 'valid' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {validation.instagram.status === 'valid' ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Valid username found: @{validation.instagram.data.username} ({validation.instagram.data.followers} followers)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        <span>{validation.instagram.error}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !form.name || (!form.facebookPageUrl && !form.instagramUsername)}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Competitor...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Competitor
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}