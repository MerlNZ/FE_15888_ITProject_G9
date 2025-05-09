
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Filter, 
  Search,
  ChevronRight,
  Check,
  AlertCircle,
  Star,
  Plus,
  Trash2,
  Users
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { activitystudentClassGroupService } from './classGroupActivityStudentService';
import TeacherSidebar from '../components/layout/TeacherSidebar';

interface Student {
  id: string;
  name: string;
}

// Interface that matches the API response structure
interface ActivityData {
  activityId: string;
  studentId: string;
  studentUsername: string;
  activityActivityName: string;
  classGroupSubjectClassGroupClassName: string;
  status?: string; // Added by our service for UI purposes
}

const ClassGroupSubjectStudentActivity = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const { activityId } = useParams<{ activityId: string }>();
  const [filteredActivities, setFilteredActivities] = useState<ActivityData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [studentFilter, setStudentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const data = await activitystudentClassGroupService.getClassGroupActivities(activityId);
        console.log("The data from classGroupActivityService is:", data);
        
        setActivities(data);
        setFilteredActivities(data);
        
        // Extract unique students from activities based on new data structure
        const uniqueStudents = Array.from(
          new Set(
            data.map(activity => ({
              id: activity.studentId,
              name: activity.studentUsername
            }))
          ),
          student => JSON.stringify(student)
        ).map(str => JSON.parse(str));
        
        setStudents(uniqueStudents);
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

    if (searchQuery) {
      result = result.filter(activity => 
        (activity.activityActivityName?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (activity.studentUsername?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
      );
    }

    if (classFilter !== 'all') {
      result = result.filter(activity => 
        activity.classGroupSubjectClassGroupClassName === classFilter
      );
    }

    if (studentFilter !== 'all') {
      result = result.filter(activity => 
        activity.studentId === studentFilter
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(activity => activity.status === statusFilter);
    }

    setFilteredActivities(result);
    setCurrentPage(1);
  }, [activities, searchQuery, classFilter, statusFilter, studentFilter]);

  // Extract unique class names from the new data structure
  const classes = ['all', ...new Set(activities.map(activity => 
    activity.classGroupSubjectClassGroupClassName
  ).filter(Boolean))];

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);
  
  const renderSkeleton = () => {
    return Array(5).fill(null).map((_, index) => (
      <div key={index} className="bg-background border rounded-md p-6">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    ));
  };

  // const getStatusBadge = (status: string) => {
  //   switch (status) {
  //     case 'Pending':
  //       return (
  //         <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
  //           <Clock className="h-3 w-3 mr-1" />
  //           Pending
  //         </Badge>
  //       );
  //     case 'Submitted':
  //       return (
  //         <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
  //           <Check className="h-3 w-3 mr-1" />
  //           Submitted
  //         </Badge>
  //       );
  //     case 'Graded':
  //       return (
  //         <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
  //           <Star className="h-3 w-3 mr-1" />
  //           Graded
  //         </Badge>
  //       );
  //     case 'Overdue':
  //       return (
  //         <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
  //           <AlertCircle className="h-3 w-3 mr-1" />
  //           Overdue
  //         </Badge>
  //       );
  //     default:
  //       return <Badge variant="outline">{status || 'Unknown'}</Badge>;
  //   }
  // };

  // const handleDeleteActivity = async (activityId: string, e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   try {
  //     setActivities(activities.filter(activity => 
  //       activity.activityId !== activityId
  //     ));
  //     toast.success("Activity deleted successfully");
  //   } catch (error) {
  //     console.error("Failed to delete activity:", error);
  //     toast.error("Failed to delete activity");
  //   }
  // };

  return (
    
    <div className="flex min-h-screen bg-muted">
  <TeacherSidebar />
  <main className="flex-1 p-6 max-w-6xl mx-auto">
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" /> Student Activities
        </h1>
        {/* <div className="flex gap-2 items-center">
          <Button onClick={() => navigate('/activities/create')} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Create
          </Button>
          <div className="text-sm text-muted-foreground hidden md:flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Saturday, April 12, 2025
          </div>
        </div> */}
      </div>
    </div>

    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={studentFilter} onValueChange={setStudentFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Student" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Students</SelectItem>
          {students.map(student => (
            <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
          ))}
        </SelectContent>
        </Select> 
        <div title="Coming soon">
      <Select value={classFilter} onValueChange={setClassFilter} disabled>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Class" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" disabled>All Classes</SelectItem>
          {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select> 
          </div>
      <div title="Coming soon">
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" disabled>All Status</SelectItem>
          <SelectItem value="Pending" disabled>Pending</SelectItem>
          <SelectItem value="Submitted"disabled>Submitted</SelectItem>
          <SelectItem value="Graded" disabled>Graded</SelectItem>
          <SelectItem value="Overdue" disabled>Overdue</SelectItem>
          </SelectContent>
      </Select>
      </div>
    </div>

    <div className="space-y-4">
      {loading ? renderSkeleton() : (
        paginatedActivities.length > 0 ? (
          paginatedActivities.map((activity, index) => (
            <Card
              key={`activity-${activity.activityId}-${activity.studentId}-${index}`}
              className="p-4 hover:shadow-md cursor-pointer transition border rounded-md bg-white dark:bg-gray-900"
              onClick={() => navigate(`/teacherassignmentdetails/${activity.activityId}/${activity.studentId}`)}
            >
              {/* <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg text-gray-800 dark:text-white">{activity.activityActivityName}</h2>
                {getStatusBadge(activity.status || 'Pending')}
              </div> */}
              <p className="text-sm text-muted-foreground mb-1">Class: {activity.classGroupSubjectClassGroupClassName}</p>
              <p className="text-sm text-muted-foreground">Student: {activity.studentUsername}</p>
              <div className="flex justify-end gap-2 mt-4">
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
                      <AlertDialogAction onClick={(e) => handleDeleteActivity(activity.activityId, e)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog> */}
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/teacherassignmentdetails/${activity.activityId}/${activity.studentId}`); }}>
                  View <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <Users className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
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

export default ClassGroupSubjectStudentActivity;