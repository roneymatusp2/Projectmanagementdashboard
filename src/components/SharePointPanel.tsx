import { useState, useEffect } from 'react';
import { X, Plus, Send, FileText, Calendar, Users, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SharePointRequest {
  requestId: string;
  pageTitle: string;
  pagePurpose: string;
  targetAudiences: string[];
  contentDescription: string;
  priorityLevel: string;
  currentStatus: string;
  requestedDate: string;
  targetPublicationDate?: string;
}

interface SharePointPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SharePointPanel({ isOpen, onClose }: SharePointPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState<SharePointRequest[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    pageTitle: '',
    pagePurpose: '',
    targetAudiences: [] as string[],
    contentDescription: '',
    priorityLevel: 'Medium',
    targetPublicationDate: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9c55f89c/sharepoint-requests`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Error fetching SharePoint requests:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9c55f89c/sharepoint-requests`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      if (response.ok) {
        // Reset form
        setFormData({
          pageTitle: '',
          pagePurpose: '',
          targetAudiences: [],
          contentDescription: '',
          priorityLevel: 'Medium',
          targetPublicationDate: ''
        });
        setShowForm(false);
        fetchRequests();
      }
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    'Submitted': 'bg-blue-100 text-blue-800',
    'In Review': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'In Progress': 'bg-purple-100 text-purple-800',
    'Published': 'bg-emerald-100 text-emerald-800',
    'Rejected': 'bg-red-100 text-red-800'
  };

  const priorityColors: Record<string, string> = {
    'Low': 'bg-gray-100 text-gray-800',
    'Medium': 'bg-blue-100 text-blue-800',
    'High': 'bg-orange-100 text-orange-800',
    'Critical': 'bg-red-100 text-red-800'
  };

  const audiences = ['Students', 'Parents', 'Faculty', 'Alumni', 'General'];
  const purposes = ['Event', 'Notice', 'Resource', 'Policy', 'Newsletter', 'Other'];

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-white shadow-2xl z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001d31] to-[#820021] text-white p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white">SharePoint Quick Access</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-sm text-white/80">Manage page requests and content</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!showForm ? (
          <>
            {/* New Request Button */}
            <Button
              onClick={() => setShowForm(true)}
              className="w-full mb-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Page Request
            </Button>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <Card className="p-3 text-center">
                <div className="text-2xl font-mono text-blue-600">
                  {requests.filter(r => r.currentStatus === 'Submitted').length}
                </div>
                <div className="text-xs text-gray-600">Pending</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl font-mono text-purple-600">
                  {requests.filter(r => r.currentStatus === 'In Progress').length}
                </div>
                <div className="text-xs text-gray-600">In Progress</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl font-mono text-green-600">
                  {requests.filter(r => r.currentStatus === 'Published').length}
                </div>
                <div className="text-xs text-gray-600">Published</div>
              </Card>
            </div>

            {/* Requests List */}
            <div className="space-y-3">
              <h3 className="text-gray-700 mb-3">Recent Requests</h3>
              {requests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No requests yet</p>
                  <p className="text-sm">Create your first page request above</p>
                </div>
              ) : (
                requests.map(request => (
                  <Card key={request.requestId} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-gray-500">
                            {request.requestId}
                          </span>
                          <Badge className={statusColors[request.currentStatus]}>
                            {request.currentStatus}
                          </Badge>
                        </div>
                        <h4 className="text-sm text-gray-900 mb-1">{request.pageTitle}</h4>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {request.contentDescription}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <Badge variant="outline" className={priorityColors[request.priorityLevel]}>
                        {request.priorityLevel}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(request.requestedDate).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </>
        ) : (
          /* Request Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="pageTitle">Page Title *</Label>
              <Input
                id="pageTitle"
                value={formData.pageTitle}
                onChange={e => setFormData({ ...formData, pageTitle: e.target.value })}
                placeholder="Enter page title"
                maxLength={100}
                required
              />
            </div>

            <div>
              <Label htmlFor="pagePurpose">Page Purpose *</Label>
              <Select
                value={formData.pagePurpose}
                onValueChange={value => setFormData({ ...formData, pagePurpose: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  {purposes.map(purpose => (
                    <SelectItem key={purpose} value={purpose}>
                      {purpose}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Target Audience *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {audiences.map(audience => (
                  <Badge
                    key={audience}
                    variant={formData.targetAudiences.includes(audience) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        targetAudiences: formData.targetAudiences.includes(audience)
                          ? formData.targetAudiences.filter(a => a !== audience)
                          : [...formData.targetAudiences, audience]
                      });
                    }}
                  >
                    <Users className="w-3 h-3 mr-1" />
                    {audience}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="contentDescription">Content Description *</Label>
              <Textarea
                id="contentDescription"
                value={formData.contentDescription}
                onChange={e => setFormData({ ...formData, contentDescription: e.target.value })}
                placeholder="Describe the content and purpose of this page..."
                maxLength={500}
                rows={4}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.contentDescription.length}/500 characters
              </p>
            </div>

            <div>
              <Label htmlFor="priorityLevel">Priority Level</Label>
              <Select
                value={formData.priorityLevel}
                onValueChange={value => setFormData({ ...formData, priorityLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="targetPublicationDate">Target Publication Date</Label>
              <Input
                id="targetPublicationDate"
                type="date"
                value={formData.targetPublicationDate}
                onChange={e => setFormData({ ...formData, targetPublicationDate: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
