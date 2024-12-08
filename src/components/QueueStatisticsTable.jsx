import { useState } from 'react';
import { MM1QueueSimulator } from './MM1QueueSimulator';

// MM1QueueSimulator class from previous example goes here
// ... (include full simulator code)

let result;

const QueueStatisticsTable = () => {
  const [arrivalRate, setArrivalRate] = useState(2);
  const [serviceRate, setServiceRate] = useState(3);
  const [iterations, setIterations] = useState(10);
  const [simulationResults, setSimulationResults] = useState([]);
  
  const runSimulation = () => {
    const simulator = new MM1QueueSimulator(arrivalRate, serviceRate);
    result = simulator.simulate(iterations);
    setSimulationResults(result.events);
  };

  return (
    <div className="p-4">
      <div className="mb-6 space-y-4">
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium mb-1">Arrival Rate (λ)</label>
            <input 
              type="number" 
              value={arrivalRate}
              onChange={(e) => setArrivalRate(Number(e.target.value))}
              className="border rounded px-2 py-1"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Service Rate (μ)</label>
            <input 
              type="number" 
              value={serviceRate}
              onChange={(e) => setServiceRate(Number(e.target.value))}
              className="border rounded px-2 py-1"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Iterations</label>
            <input 
              type="number" 
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="border rounded px-2 py-1"
              min="1"
            />
          </div>
        </div>
        <button 
          onClick={runSimulation}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Run Simulation
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Event #</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Event Type</th>
              <th className="border p-2">In System</th>
              <th className="border p-2">In Queue</th>
              <th className="border p-2">Total Wait</th>
              <th className="border p-2">Queue Wait</th>
              <th className="border p-2">Service Time</th>
            </tr>
          </thead>
          <tbody>
            {simulationResults.map((event) => (
              <tr key={event.eventNum} className="hover:bg-gray-50">
                <td className="border p-2 text-center">{event.eventNum}</td>
                <td className="border p-2 text-right">{Number(event.time).toFixed(4)}</td>
                <td className="border p-2">{event.type}</td>
                <td className="border p-2 text-center">{event.numInSystem}</td>
                <td className="border p-2 text-center">{event.numInQueue}</td>
                <td className="border p-2 text-right">
                  {event.waitTime === 'N/A' ? 'N/A' : event.waitTime.total}
                </td>
                <td className="border p-2 text-right">
                  {event.waitTime === 'N/A' ? 'N/A' : event.waitTime.queue}
                </td>
                <td className="border p-2 text-right">
                  {event.waitTime === 'N/A' ? 'N/A' : event.waitTime.service}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {simulationResults.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-2">Summary Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Average System Size (L):</strong> {result.statistics.L.toFixed(4)}</p>
              <p><strong>Average Queue Size (Lq):</strong> {result.statistics.Lq.toFixed(4)}</p>
            </div>
            <div>
              <p><strong>Average System Time (W):</strong> {result.statistics.W.toFixed(4)}</p>
              <p><strong>Average Queue Time (Wq):</strong> {result.statistics.Wq.toFixed(4)}</p>
            </div>
          </div>
          <h3 className="font-medium mb-2 mt-4">Theoretical Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Average System Size (L):</strong> {result.statistics.theoretical.L.toFixed(4)}</p>
              <p><strong>Average Queue Size (Lq):</strong> {result.statistics.theoretical.Lq.toFixed(4)}</p>
            </div>
            <div>
              <p><strong>Average System Time (W):</strong> {result.statistics.theoretical.W.toFixed(4)}</p>
              <p><strong>Average Queue Time (Wq):</strong> {result.statistics.theoretical.Wq.toFixed(4)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueStatisticsTable;