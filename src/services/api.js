import axios from "axios";
import { FALLBACK_API, PRIMARY_API, REQUEST_TIMEOUT_MS } from "./apiConfig";

const primaryAPI = axios.create({
  baseURL: PRIMARY_API,
  timeout: REQUEST_TIMEOUT_MS,
});

const fallbackAPI = axios.create({
  baseURL: FALLBACK_API,
  timeout: REQUEST_TIMEOUT_MS,
});

const shouldFallback = (error) => {
  if (!axios.isAxiosError(error)) return true;

  if (!error.response) return true;

  const status = error.response.status;
  return status >= 500 || status === 408;
};

const requestWithFallback = async (requestFn) => {
  try {
    return await requestFn(primaryAPI);
  } catch (primaryError) {
    if (!shouldFallback(primaryError)) {
      throw primaryError;
    }
    return requestFn(fallbackAPI);
  }
};

// 🔹 Student & Management - Get all complaints
export const getAllComplaints = () => {
  return requestWithFallback((client) => client.get("/api/complaints"));
};

export const getComplaints = getAllComplaints;

// 🔹 Student - Submit new complaint
export const createComplaint = (complaint) => {
  return requestWithFallback((client) =>
    client.post("/api/complaints", complaint)
  );
};

export const postComplaint = createComplaint;

// 🔹 Student / Management - Update status
export const updateComplaintStatus = (id, status) => {
  return requestWithFallback((client) =>
    client.put(`/api/complaints/${id}/status`, null, {
      params: { status },
    })
  );
};

export const updateStatus = updateComplaintStatus;

// 🔹 Management - Delete complaint
export const deleteComplaint = (id) => {
  return requestWithFallback((client) =>
    client.delete(`/api/complaints/${id}`)
  );
};
