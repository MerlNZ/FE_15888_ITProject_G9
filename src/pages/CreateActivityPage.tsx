import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Save, X } from "lucide-react";

import TeacherSidebar from "../components/layout/TeacherSidebar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Interfaces
interface ClassGroup {
  id: string;
  name: string;
  classGroupSubjectId: string;
  subjectId: string;
  subjectName: string;
}

interface Subject {
  id: string;
  name: string;
}

interface CreateActivityRequest {
  title: string;
  description: string;
  activityName: string;
  dueDate: string;
  classGroupId: string;
  teacherId: string;
  subjectId?: string;
  pdfFileBase64?: string;
  weightagePercent?: number;
  fileName?: string;
}

// Form Schema
const activityFormSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  dueDate: z.date({ required_error: "Due date is required" }),
  classGroupId: z.string().min(1),
  teacherId: z.string().min(1),
  activityName: z.string().min(2).max(50),
  subjectId: z.string().optional(),
  weightagePercent: z.number().min(1).max(100),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

const CreateActivity = () => {
  const [classLevels, setClassLevels] = useState<ClassGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedClassGroupId, setSelectedClassGroupId] = useState<string>("");

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: undefined,
      classGroupId: "",
      teacherId: "41E8083D-04E1-4421-1FAB-08DD7EDEE8F0",
      activityName: "",
      subjectId: "",
      weightagePercent: 50,
    },
  });

  const availableSubjects = useMemo(() => {
    if (!selectedClassGroupId) return [];
    const subjects = classLevels
      .filter((level) => level.id === selectedClassGroupId)
      .map((level) => ({ id: level.subjectId, name: level.subjectName }));
    return Array.from(new Map(subjects.map((s) => [s.id, s])).values());
  }, [selectedClassGroupId, classLevels]);

  const handleClassGroupChange = (value: string) => {
    setSelectedClassGroupId(value);
    form.setValue("classGroupId", value);
    form.setValue("subjectId", "");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
      try {
        const base64 = await convertFileToBase64(file);
        setFileBase64(base64);
      } catch (error) {
        toast.error("Error processing file");
      }
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data: ActivityFormValues) => {
    setIsSubmitting(true);
    try {
      const requestData: CreateActivityRequest = {
        ...data,
        dueDate: data.dueDate.toISOString(),
        pdfFileBase64: fileBase64 ?? undefined,
        fileName: fileName ?? undefined,
      };

      const response = await fetch("https://localhost:44361/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error("Failed to create activity");

      toast.success("Activity created successfully!");
      navigate("/activitiespagination");
    } catch (error) {
      toast.error("Failed to create activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate("/TeacherDashboard");

  useEffect(() => {
    const fetchClassLevels = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://localhost:44361/api/ClassGroupSubject/classgroupslist");
        const data = await response.json();
        const formatted = data.map((item: any) => ({
          id: item.classGroupId,
          name: item.classGroupClassName,
          subjectId: item.subjectId,
          subjectName: item.subjectSubjectName,
          classGroupSubjectId: item.classGroupSubjectId,
        }));
        setClassLevels(formatted);
      } catch {
        toast.error("Failed to load class levels");
      } finally {
        setLoading(false);
      }
    };

    fetchClassLevels();
  }, []);

  return (
    <div className="flex h-screen bg-muted">
      <TeacherSidebar />
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-6 space-y-5">
          <div className="flex justify-start">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
          <h1 className="text-2xl font-semibold">Create Activity</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl shadow-md border">
              <FormField name="title" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input placeholder="e.g., Kindness Tree Project" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="activityName" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Name</FormLabel>
                  <FormControl><Input placeholder="e.g., DIY Kindness Tree" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="description" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Explain the activity..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="weightagePercent" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Weightage</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        field.onChange(!isNaN(val) ? Math.max(1, Math.min(val, 100)) : "");
                      }}
                    />
                  </FormControl>
                  <FormDescription>Value between 1–100</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormItem>
                <FormLabel>Upload File</FormLabel>
                <Input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                {selectedFile && <p className="text-xs text-green-600 mt-1">Selected: {selectedFile.name}</p>}
              </FormItem>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="classGroupId" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Level</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        handleClassGroupChange(value);
                      }}
                      value={field.value || "placeholder"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="placeholder" disabled>Select a class level</SelectItem>
                        {classLevels
                          .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
                          .map(level => (
                            <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="dueDate" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline">
                            <Calendar className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField name="subjectId" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || "placeholder"} disabled={!selectedClassGroupId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedClassGroupId ? "Select a subject" : "First select a class level"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableSubjects.length > 0 ? (
                        availableSubjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No subjects available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" /> {isSubmitting ? "Saving..." : "Save Activity"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateActivity;
