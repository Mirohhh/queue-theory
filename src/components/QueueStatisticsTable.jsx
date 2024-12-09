import { useState } from 'react';
import { MM1QueueSim } from './test';

let result;

/**
 * QueueStatisticsTable is a React component that takes in lambda, mu, and iterations
 * as props and displays a table of simulation results. The table includes the
 * event number, clock time, event type, number of arrivals, number of departures,
 * number in system, and wait time in the system. The component also contains a
 * button to run the simulation.
 *
 * @param {number} lam - The arrival rate (lambda) of the system.
 * @param {number} mu - The service rate (mu) of the system.
 * @param {number} it - The number of simulation iterations.
 *
 * @returns {JSX.Element} - A JSX element representing the simulation table
 *                          component.
 */
const QueueStatisticsTable = (props) => {
  const [arrivalRate, setArrivalRate] = useState(props.lam);
  const [serviceRate, setServiceRate] = useState(props.mu);
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
      <div className="flex justify-center mb-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-mytext font-semibold text-lg py-2 px-6 border-2 border-btn rounded-md"
          onClick={runSimulation}
        >
          Run Simulation
        </button>
      </div>
      <div className="overflow-x-auto rounded-md">
        <table className="min-w-full border-primary border-2 rounded-md border-collapse overflow-hidden text-xl">
          <thead className='text-mytext'>
            <tr className="bg-red-600">
              <th className="border py-4 px-6">#Customer</th>
              <th className="border py-4 px-6">Clock</th>
              <th className="border py-4 px-6">Event</th>
              <th className="border py-4 px-6">#Arrival</th>
              <th className="border py-4 px-6">#Departure</th>
              <th className="border py-4 px-6">#InSystem</th>
              <th className="border py-4 px-6">Wait</th>
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