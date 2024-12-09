import { useState } from 'react';
import { MM1QueueSimulator } from './MM1QueueSimulator';
import { MM1QueueSim } from './test';

let result;

const QueueStatisticsTable = (props) => {
  const [arrivalRate, setArrivalRate] = useState('');
  const [serviceRate, setServiceRate] = useState('');
  const [iterations, setIterations] = useState(props.it);
  const [simulationResults, setSimulationResults] = useState([]);
  
  const runSimulation = () => {
    MM1QueueSim.reset();
    setArrivalRate(parseFloat(props.lam));
    setServiceRate(parseFloat(props.mu));
    result = MM1QueueSim.main(arrivalRate, serviceRate, iterations);
    setSimulationResults(result);
  };

  return (
    <div className="p-4">
      <div className="mb-6 space-y-4">
        <button 
          onClick={runSimulation}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Run Simulation
        </button>
      </div>

      <div className="overflow-x-auto rounded-md">
        <table className="min-w-full border-primary border-2 rounded-md border-collapse overflow-hidden text-xl">
          <thead className='text-mytext'>
            <tr className="bg-red-600">
              <th className="border p-2">#Customer</th>
              <th className="border p-2">Clock</th>
              <th className="border p-2">Event</th>
              <th className="border p-2">#Arrival</th>
              <th className="border p-2">#Departure</th>
              <th className="border p-2">#InSystem</th>
              <th className="border p-2">Wait</th>
            </tr>
          </thead>
          <tbody className='text-mytext'>
            {simulationResults.map((event, i) => (
              <tr key={i} className="bg-primary hover:bg-secondary">
                <td className="border p-2 text-center">{event[0]}</td>
                <td className="border p-2 text-right">{Math.round(Number(event[1]))}</td>
                <td className="border p-2">{event[2]}</td>
                <td className="border p-2 text-center">{event[3]}</td>
                <td className="border p-2 text-center">{event[4]}</td>
                <td className="border p-2 text-right">{event[5]}</td>
                <td className="border p-2 text-right">{Math.round(Number(event[6]))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QueueStatisticsTable;