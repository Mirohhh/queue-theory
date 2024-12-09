import { useState } from 'react';
import { MM1QueueSim } from './test';
import { simulate, reset } from './sim';
import decamelize from 'decamelize';

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
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  
  const runSimulation = () => {
    reset();
    setArrivalRate(parseFloat(props.lam));
    setServiceRate(parseFloat(props.mu));
    const results = simulate(arrivalRate, serviceRate, iterations);
    setSimulationResults(results.resMat);
    setPerformanceMetrics(results.perfMetrics);
  };

  return (
    <div className="py-8 px-16">
      <div className="flex justify-center mb-5">
        <button
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-mytext font-semibold text-lg py-2 px-4 border-2 border-btn rounded-md"
          onClick={runSimulation}
        >
          Run Simulation
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full border-primary border-2 rounded-lg border-collapse overflow-hidden text-xl">
          <thead className='text-mytext'>
            <tr className="bg-action">
              <th className="border py-2 px-4 text-left">Customer</th>
              <th className="border py-2 px-4 text-left">Time Since Last Arrival(Mins)</th>
              <th className="border py-2 px-4 text-left">Arrival Time</th>
              <th className="border py-2 px-4 text-left">Service Time(Mins)</th>
              <th className="border py-2 px-4 text-left">Time Service Begins</th>
              <th className="border py-2 px-4 text-left">Time Customer Waits in Queue(Mins)</th>
              <th className="border py-2 px-4 text-left">Time Service Ends</th>
              <th className="border py-2 px-4 text-left">Time Customer Spends in System(Mins)</th>
              <th className="border py-2 px-4 text-left">Idle Server Time(Mins)</th>
            </tr>
          </thead>
          <tbody className='text-mytext'>
            {simulationResults.map((event, i) => (
              <tr key={i} className="bg-primary">
                <td className="border p-2 text-right">{event[0]}</td>
                <td className="border p-2 text-right">{event[1]}</td>
                <td className="border p-2 text-right">{event[2]}</td>
                <td className="border p-2 text-right">{event[3]}</td>
                <td className="border p-2 text-right">{event[4]}</td>
                <td className="border p-2 text-right">{event[5]}</td>
                <td className="border p-2 text-right">{event[6]}</td>
                <td className="border p-2 text-right">{event[7]}</td>
                <td className="border p-2 text-right">{event[8]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex bg-secondary rounded-lg p-6 mt-5'>
        <section>
          <h2 className='text-action font-bold text-4xl'>Performance Metrics</h2>
          <section className='flex  items-start gap-20 mt-4'>
            {Object.entries(performanceMetrics).map(([key, value], i) => (
              <div key={i} className='flex flex-col items-center text-mytext text-2xl'>
                <p className='capitalize'><strong>{decamelize(key, {separator: ' '})}:</strong> {value}</p>
              </div>
            ))}
          </section>
        </section>
      </div>
    </div>
  );
};

export default QueueStatisticsTable;