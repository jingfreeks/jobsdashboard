import React, { useState, useCallback } from "react";
import { useJobOperations } from "@/hooks/useJobOperations";
import { useToast } from "@/hooks/useToast";

export const useDashBoardHooks = () => {
  const data = [
    { name: "Jan", jobs: 12 },
    { name: "Feb", jobs: 18 },
    { name: "Mar", jobs: 9 },
    { name: "Apr", jobs: 15 },
    { name: "May", jobs: 20 },
  ];
  const activities = [
    {
      id: 1,
      activity: "You added a new job: Frontend Developer",
      time: "Today, 09:00",
    },
    {
      id: 2,
      activity: "Interview completed: Backend Engineer",
      time: "Yesterday, 15:30",
    },
    {
      id: 3,
      activity: "Offer accepted: Product Manager",
      time: "Yesterday, 11:10",
    },
  ];
  const tasks = [
    { id: 1, task: "Follow up with recruiter", due: "Today" },
    { id: 2, task: "Prepare for interview", due: "Tomorrow" },
    { id: 3, task: "Review candidate resumes", due: "This week" },
  ];

  const [showAddJobModal, setShowAddJobModal] = useState(false);

  // Use job operations hook
  const { companies, cities, departments, isAdding, createJob } =
    useJobOperations();

  // Use toast for notifications
  const { showSuccess, showError } = useToast();

  // Memoized callbacks for better performance
  const handleAddJob = useCallback(() => setShowAddJobModal(true), []);

  const handleCloseAddJobModal = useCallback(() => {
    setShowAddJobModal(false);
  }, []);

  const handleCreateJob = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const jobData = {
        jobtitle: formData.get("jobtitle") as string,
        companyId: (formData.get("companyId") as string) || undefined,
        cityId: (formData.get("cityId") as string) || undefined,
        departmentId: (formData.get("departmentId") as string) || undefined,
        description: (formData.get("description") as string) || undefined,
        requirements: (formData.get("requirements") as string) || undefined,
        salary: (formData.get("salary") as string) || undefined,
        type: (formData.get("type") as string) || undefined,
        status: (formData.get("status") as string) || undefined,
      };

      if (jobData.jobtitle.trim()) {
        const result = await createJob(jobData);
        if (result) {
          setShowAddJobModal(false);
          showSuccess(
            `Job "${jobData.jobtitle.trim()}" has been created successfully.`
          );
        } else {
          showError("Failed to create job. Please try again.");
        }
      }
    },
    [createJob, showSuccess, showError]
  );
  return {
    data,
    activities,
    tasks,
    showAddJobModal,
    setShowAddJobModal,
    companies,
    cities,
    departments,
    isAdding,
    createJob,
    handleAddJob,
    handleCloseAddJobModal,
    handleCreateJob
  };
};
