// src/pages/ManagementDashboard.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getComplaints, updateStatus, deleteComplaint } from "../services/api";
import ComplaintCard from "../components/ComplaintCard";
import ParticleBackground from "../components/ParticleBackground";
import { toast } from "react-toastify";
import "./ManagementDashboard.css";

export default function ManagementDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await getComplaints();
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
      const isNetworkError =
        err?.code === "ERR_NETWORK" ||
        err?.message?.toLowerCase?.().includes("network") ||
        err?.message?.toLowerCase?.().includes("failed to fetch");
      toast.error(
        isNetworkError
          ? "Backend not reachable. Start Spring Boot (localhost:8080) and refresh."
          : "Failed to fetch complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authed = localStorage.getItem("mgmtAuthed") === "true";
    if (!authed) {
      const password = prompt("Enter management password:");
      if (password === "2006") {
        localStorage.setItem("mgmtAuthed", "true");
      } else {
        localStorage.removeItem("mgmtAuthed");
        toast.error("Incorrect password!");
        navigate("/");
        return;
      }
    }

    fetchComplaints();
  }, [navigate]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateStatus(id, status);
      toast.success(`Status updated to ${status}`);
      fetchComplaints();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure to delete this complaint?")){
      try {
        await deleteComplaint(id);
        toast.success("Complaint deleted");
        fetchComplaints();
      } catch(err){
        console.error(err);
        toast.error("Failed to delete complaint");
      }
    }
  };

  return (
    <div className="management-dashboard">
      <ParticleBackground />
      <div className="page-content">
        <h1 className="dashboard-title">Management Dashboard</h1>
        <div className="toolbar">
          <button
            type="button"
            className="refresh-btn"
            onClick={fetchComplaints}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
            
        </div>
        <div className="complaints-grid">
          {complaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              isManagement={true}
              onStatusChange={handleStatusUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
