import axios from "axios";

const jobApi = axios.create({
  baseURL: "http://localhost:5000",
});

// Jobs
export const getJobs = () => jobApi.get("/jobs");

export const getJobById = (id) => jobApi.get(`/jobs/${id}`);

// Applications
export const submitApplication = (application) =>
  jobApi.post("/applications", application);

export const getApplications = () =>
  jobApi.get("/applications");

// Saved jobs
export const getSavedJobs = () =>
  jobApi.get("/savedJobs");

// Save job with user ID
export const saveJob = (jobId, userId) =>
  jobApi.post("/savedJobs", {
    jobId,
    userId,
  });

export const removeSavedJob = (savedId) =>
  jobApi.delete(`/savedJobs/${savedId}`);

// Add new job
export const addJob = (job) =>
  jobApi.post("/jobs", job);

// Update existing job
export const updateJob = (id, job) =>
  jobApi.put(`/jobs/${id}`, job);

// Delete job
export const deleteJob = (id) =>
  jobApi.delete(`/jobs/${id}`);

// Register new user
export const registerUser = (user) =>
  jobApi.post("/users", user);

export const updateApplication = (id, data) => {
  return jobApi.patch(`/applications/${id}`, data);
};

// Get user by email (for login)
export const getUserByEmail = (email) =>
  jobApi.get(`/users?email=${encodeURIComponent(email)}`);

export const getSavedJobByJobId = async (jobId, userId) => {
  const response = await getSavedJobs();

  return response.data.find(
    (saved) =>
      String(saved.jobId) === String(jobId) &&
      String(saved.userId) === String(userId)
  );
};


export const getUsers = () => jobApi.get("/users");

export const updateUser = (id, data) => {
  return jobApi.patch(`/users/${id}`, data);
};

export const deleteUser = (id) => jobApi.delete(`/users/${id}`);

// Get admin settings
export const getSettings = () => jobApi.get("/settings");

// Save admin settings
export const updateSettings = (id, data) => {
  return jobApi.patch(`/settings/${id}`, data);
};

// Get a user by ID
export const getUserById = (id) => {
  return jobApi.get(`/users/${id}`);
};

export const getNotifications = () => {
  return jobApi.get("/notifications");
};

export const addNotification = (data) => {
  return jobApi.post("/notifications", data);
};

export const updateNotification = (id, data) => {
  return jobApi.patch(`/notifications/${id}`, data);
};

export const deleteNotification = (id) => {
  return jobApi.delete(`/notifications/${id}`);
};
export default jobApi;