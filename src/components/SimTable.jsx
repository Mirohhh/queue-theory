import React from 'react';
import { detModel } from './QueueCalc';
import decamelize from 'decamelize';

const SimTable = () => {
    const detTable = (s, b, lm, m) => {
        if (s == 1 && b == 0) {
            return 1;
        } else if (s == 1 && b > 0) {
            return 2;
        } else if (s > 1 && b == 0) {
            return 3;
        } else if (s > 1 && b > 0) {
            return 4;
        } 
        
        return "Please enter valid inputs.";
    }
  return (
    <>
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
          <section className='flex items-start gap-20 mt-4'>
            {Object.entries(performanceMetrics).map(([key, value], i) => (
              <div key={i} className='flex flex-col items-center text-mytext text-2xl'>
                <p className='capitalize'><strong>{decamelize(key, {separator: ' '})}:</strong> {value}</p>
              </div>
            ))}
          </section>
        </section>
      </div>
      
    </>
  )
}

export default SimTable;