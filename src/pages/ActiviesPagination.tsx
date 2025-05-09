// ✅ Minimalist layout version of ActivitiesPaginated (functions untouched)

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Calendar, Clock, Filter, Search,
  ChevronRight, Check, AlertCircle, Star, Plus, Trash2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import TeacherSidebar from '../components/layout/TeacherSidebar';
import { 
  Pagination, PaginationContent, PaginationItem, PaginationLink, 
  PaginationNext, PaginationPrevious 
} from "@/components/ui/pagination";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Activity, activityService } from './ActivityService';

const ActivitiesPaginated = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const data = await activityService.getActivities();
        setActivities(data);
        setFilteredActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        toast.error("Failed to load activities");
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    let result = activities;
    if (searchQuery) result = result.filter(activity => activity.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (subjectFilter !== 'all') result = result.filter(activity => activity.subject === subjectFilter);
    if (statusFilter !== 'all') result = result.filter(activity => activity.status === statusFilter);
    setFilteredActivities(result);
    setCurrentPage(1);
  }, [activities, searchQuery, subjectFilter, statusFilter]);

  const subjects = ['all', ...new Set(activities.map(activity => activity.subject))];
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  const renderSkeleton = () => Array(5).fill(null).map((_, index) => (
    <div key={index} className="rounded-lg border bg-white dark:bg-gray-900 p-4 shadow-sm animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-1"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
    </div>
  ));

  const getStatusBadge = (status: string) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Submitted: "bg-blue-100 text-blue-800",
      Graded: "bg-green-100 text-green-800",
      Overdue: "bg-red-100 text-red-800"
    };
    const icons = {
      Pending: <Clock className="h-3 w-3 mr-1" />,
      Submitted: <Check className="h-3 w-3 mr-1" />,
      Graded: <Star className="h-3 w-3 mr-1" />,
      Overdue: <AlertCircle className="h-3 w-3 mr-1" />
    };
    return (
      <Badge className={`px-2 py-1 rounded text-xs font-medium flex items-center ${styles[status] || ''}`}>{icons[status]}{status}</Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NZ', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleDeleteActivity = async (activityId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setActivities(activities.filter(activity => activity.id !== activityId));
      toast.success("Activity deleted successfully");
    } catch (error) {
      console.error("Failed to delete activity:", error);
      toast.error("Failed to delete activity");
    }
  };

  return (
    <div className="flex min-h-screen bg-muted">
      <TeacherSidebar />
      <main className="flex-1 p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Activities</h1>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/activities/create')} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Create
              </Button>
              <div className="text-sm text-muted-foreground hidden md:flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date().toLocaleDateString('en-NZ', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map(subject => <SelectItem key={subject} value={subject}>{subject}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Graded">Graded</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {loading ? renderSkeleton() : (
            paginatedActivities.length > 0 ? (
              paginatedActivities.map(activity => (
                <Card
                  key={activity.id}
                  onClick={() => navigate(`/classgroupsubjectsactivitytudentview/${activity.activityId}`)}
                  className="p-4 hover:shadow-md cursor-pointer transition border rounded-md bg-white dark:bg-gray-900"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-lg text-gray-800 dark:text-white">{activity.title}</h2>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{activity.subject}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{activity.description}</p>
                  <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Due: {formatDate(activity.dueDate)}</span>
                    <div className="flex gap-2">
                      {/* <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={(e) => e.stopPropagation()}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete activity?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently remove the activity.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={(e) => handleDeleteActivity(activity.id, e)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog> */}
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/classgroupsubjectsactivitytudentview/${activity.activityId}`); }}>
                        View <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No activities found</p>
              </div>
            )
          )}

          {filteredActivities.length > 0 && (
            <Pagination className="pt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </main>
    </div>
  );
};

export default ActivitiesPaginated;
