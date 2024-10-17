import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './DriverDashboard.css';

function DriverDashboard() {
  const [activeJob, setActiveJob] = useState(null);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [jobHistory, setJobHistory] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    const token = localStorage.getItem('token');

    socket.on('newJob', (job) => {
      setAvailableJobs(prevJobs => [...prevJobs, job]);
    });

    fetchAvailableJobs();
    fetchJobHistory();

    return () => socket.disconnect();
  }, []);

  const fetchAvailableJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/driver/available-jobs', {
        headers: { 'x-auth-token': token }
      });
      setAvailableJobs(response.data);
    } catch (error) {
      console.error('Error fetching available jobs:', error);
    }
  };

  const fetchJobHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/driver/job-history', {
        headers: { 'x-auth-token': token }
      });
      setJobHistory(response.data);
    } catch (error) {
      console.error('Error fetching job history:', error);
    }
  };

  const acceptJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/driver/accept-job/${jobId}`, {}, {
        headers: { 'x-auth-token': token }
      });
      const acceptedJob = availableJobs.find(job => job.id === jobId);
      setActiveJob(acceptedJob);
      setAvailableJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error accepting job:', error);
    }
  };

  const updateJobStatus = async (status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/driver/update-job-status/${activeJob.id}`, 
        { status },
        { headers: { 'x-auth-token': token } }
      );
      setActiveJob(prevJob => ({ ...prevJob, status }));
      if (status === 'completed') {
        setJobHistory(prevHistory => [activeJob, ...prevHistory]);
        setActiveJob(null);
      }
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  return (
    <div className="driver-dashboard">
      <h2>Driver Dashboard</h2>
      
      {activeJob && (
        <div className="active-job card">
          <h3>Active Job</h3>
          <p><strong>Pickup:</strong> {activeJob.pickup}</p>
          <p><strong>Dropoff:</strong> {activeJob.dropoff}</p>
          <p><strong>Status:</strong> {activeJob.status}</p>
          <div className="status-buttons">
            <button onClick={() => updateJobStatus('en route to pickup')}>En Route to Pickup</button>
            <button onClick={() => updateJobStatus('goods collected')}>Goods Collected</button>
            <button onClick={() => updateJobStatus('en route to dropoff')}>En Route to Dropoff</button>
            <button onClick={() => updateJobStatus('completed')}>Completed</button>
          </div>
        </div>
      )}

      <div className="available-jobs">
        <h3>Available Jobs</h3>
        {availableJobs.map(job => (
          <div key={job.id} className="job-card card">
            <p><strong>Pickup:</strong> {job.pickup}</p>
            <p><strong>Dropoff:</strong> {job.dropoff}</p>
            <button onClick={() => acceptJob(job.id)}>Accept Job</button>
          </div>
        ))}
      </div>

      <div className="job-history">
        <h3>Job History</h3>
        {jobHistory.map(job => (
          <div key={job.id} className="job-card card">
            <p><strong>Pickup:</strong> {job.pickup}</p>
            <p><strong>Dropoff:</strong> {job.dropoff}</p>
            <p><strong>Status:</strong> {job.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DriverDashboard;