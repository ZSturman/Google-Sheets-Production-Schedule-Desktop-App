import "./App.css";
import { useEffect, useState } from 'react';
import Database from '@tauri-apps/plugin-sql';
import SettingsContainer from "./settings/SettingsContainer";


function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState('');
  const [newJob, setNewJob] = useState<Partial<Job>>({
    Job_Number: '',
    Customer: '',
    Text: '',
    Quantity: 0,
    Length: 0,
    Production_Quantity: 0,
    Balance_Quantity: 0,
    Requested_Ship_Date: '',
    Requested_Ship_Time: '',
    Set_Up_Min: 0,
    UPH: 0,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const db = await Database.load('sqlite:rods-sheets.db');
      const result = await db.select<Job[]>('SELECT * FROM Jobs');
      setJobs(result);
    } catch (err) {
      setError('Failed to fetch jobs');
      console.error(err);
    }
  };

  const validateFields = () => {
    const errors: Record<string, string> = {};
    if (!newJob.Job_Number) errors.Job_Number = 'Job Number is required';
    if (!newJob.Customer) errors.Customer = 'Customer is required';
    if (!newJob.Requested_Ship_Date) errors.Requested_Ship_Date = 'Ship Date is required';
    if (!newJob.Requested_Ship_Time) errors.Requested_Ship_Time = 'Ship Time is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addJob = async () => {
    if (!validateFields()) {
      setError('Please fill out all required fields.');
      return;
    }

    const {
      Job_Number,
      Customer,
      Text,
      Quantity,
      Length,
      Production_Quantity,
      Balance_Quantity,
      Requested_Ship_Date,
      Requested_Ship_Time,
      Set_Up_Min,
      UPH,
    } = newJob;

    try {
      const db = await Database.load('sqlite:rods-sheets.db');
      await db.execute(
        `INSERT INTO Jobs 
          (Job_Number, Customer, Text, Quantity, Length, Production_Quantity, Balance_Quantity, Requested_Ship_Date, Requested_Ship_Time, Set_Up_Min, UPH) 
         VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          Job_Number,
          Customer,
          Text || '',
          Quantity || 0,
          Length || 0,
          Production_Quantity || 0,
          Balance_Quantity || 0,
          Requested_Ship_Date,
          Requested_Ship_Time,
          Set_Up_Min || 0,
          UPH || 0,
        ]
      );
      setNewJob({
        Job_Number: '',
        Customer: '',
        Text: '',
        Quantity: 0,
        Length: 0,
        Production_Quantity: 0,
        Balance_Quantity: 0,
        Requested_Ship_Date: '',
        Requested_Ship_Time: '',
        Set_Up_Min: 0,
        UPH: 0,
      });
      setFieldErrors({});
      setError('');
      fetchJobs();
    } catch (err) {
      setError('Failed to add job');
      console.error(err);
    }
  };

  const deleteJob = async (jobNumber: string) => {
    try {
      const db = await Database.load('sqlite:rods-sheets.db');
      await db.execute('DELETE FROM Jobs WHERE Job_Number = $1', [jobNumber]);
      fetchJobs();
    } catch (err) {
      setError('Failed to delete job');
      console.error(err);
    }
  };

  return (
    <div>
      <SettingsContainer />
      
      <h1>Jobs Management</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Add Job Section */}
      <div>
        <h2>Add Job</h2>
        <div>
          <input
            type="text"
            placeholder="Job Number *"
            value={newJob.Job_Number || ''}
            onChange={(e) => setNewJob({ ...newJob, Job_Number: e.target.value })}
            className={fieldErrors.Job_Number ? 'error' : ''}
          />
          {fieldErrors.Job_Number && <p style={{ color: 'red' }}>{fieldErrors.Job_Number}</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder="Customer *"
            value={newJob.Customer || ''}
            onChange={(e) => setNewJob({ ...newJob, Customer: e.target.value })}
            className={fieldErrors.Customer ? 'error' : ''}
          />
          {fieldErrors.Customer && <p style={{ color: 'red' }}>{fieldErrors.Customer}</p>}
        </div>
        <div>
          <input
            type="date"
            placeholder="Requested Ship Date *"
            value={newJob.Requested_Ship_Date || ''}
            onChange={(e) => setNewJob({ ...newJob, Requested_Ship_Date: e.target.value })}
            className={fieldErrors.Requested_Ship_Date ? 'error' : ''}
          />
          {fieldErrors.Requested_Ship_Date && <p style={{ color: 'red' }}>{fieldErrors.Requested_Ship_Date}</p>}
        </div>
        <div>
          <input
            type="time"
            placeholder="Requested Ship Time *"
            value={newJob.Requested_Ship_Time || ''}
            onChange={(e) => setNewJob({ ...newJob, Requested_Ship_Time: e.target.value })}
            className={fieldErrors.Requested_Ship_Time ? 'error' : ''}
          />
          {fieldErrors.Requested_Ship_Time && <p style={{ color: 'red' }}>{fieldErrors.Requested_Ship_Time}</p>}
        </div>
        <input
          type="text"
          placeholder="Text"
          value={newJob.Text || ''}
          onChange={(e) => setNewJob({ ...newJob, Text: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newJob.Quantity || 0}
          onChange={(e) => setNewJob({ ...newJob, Quantity: +e.target.value })}
        />
        <button onClick={addJob}>Add Job</button>
      </div>

      {/* Existing Jobs Section */}
      <h2>Existing Jobs</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.Job_Number}>
            <p>{`Job Number: ${job.Job_Number}, Customer: ${job.Customer}`}</p>
            <button onClick={() => deleteJob(job.Job_Number)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;