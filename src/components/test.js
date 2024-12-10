export class MM1QueueSim {
    static lambda = 0;
    static mu = 0;
    static numInSystem = 0;
    static numArrival = 0;
    static numDeparture = 0;
    static totalWait = 0;
    static waitInSystem = 0;
    static queue = [];
    static nextArrival = 0;
    static nextDeparture = Infinity;
    static clock = 0;
    static resMat = [];
  
    /**
     * Simulates the M/M/1 queue system for a given number of events.
     *
     * @param {number} lm - The arrival rate (lambda) of the system.
     * @param {number} mu - The service rate (mu) of the system.
     * @param {number} st - The number of simulation steps/events to process.
     * @returns {Array} - A matrix containing details of each event, including
     *                    the event number, clock time, event type, number of
     *                    arrivals, number of departures, number in system, and
     *                    wait time in the system.
     */
    static main(lm, mu, st) {
      const numSimulation = st;
      MM1QueueSim.lambda = lm;
      MM1QueueSim.mu = mu;
      MM1QueueSim.queue = [];
      MM1QueueSim.nextArrival = 0;
      MM1QueueSim.nextDeparture = Infinity;

      console.log('Serial, Clock, Event, #Arrival, #Departure, #InSystem, Wait');

      for (let i = 1; i <= numSimulation; i++) {
        if (MM1QueueSim.nextArrival <= MM1QueueSim.nextDeparture) {
          MM1QueueSim.clock = MM1QueueSim.nextArrival;
          MM1QueueSim.handelArrivalEvent();

          MM1QueueSim.resMat.push([i, MM1QueueSim.clock, 'Arrival', MM1QueueSim.numArrival, MM1QueueSim.numDeparture, MM1QueueSim.numInSystem, 0]);
          console.log(MM1QueueSim.resMat[i - 1]);
        } else {
          MM1QueueSim.clock = MM1QueueSim.nextDeparture;
          MM1QueueSim.handelDepartureEvent();

          MM1QueueSim.resMat.push([i, MM1QueueSim.clock, 'Departure', MM1QueueSim.numArrival, MM1QueueSim.numDeparture, MM1QueueSim.numInSystem, MM1QueueSim.waitInSystem]);
          console.log(MM1QueueSim.resMat[i - 1]);
        }
      }
  
      return MM1QueueSim.resMat;
    }
  
    static handelArrivalEvent() {
      MM1QueueSim.numArrival++;
      MM1QueueSim.numInSystem++;
  
      if (MM1QueueSim.queue.length === 0) {
        const serviceTime = MM1QueueSim.exp(MM1QueueSim.mu);
        MM1QueueSim.nextDeparture = MM1QueueSim.nextArrival + serviceTime;
      }
  
      MM1QueueSim.queue.push(MM1QueueSim.nextArrival);
      const interarrivalTime = MM1QueueSim.exp(MM1QueueSim.lambda);
      MM1QueueSim.nextArrival += interarrivalTime;
    }
  
    static handelDepartureEvent() {
      MM1QueueSim.numDeparture++;
      MM1QueueSim.numInSystem--;
  
      MM1QueueSim.waitInSystem = MM1QueueSim.nextDeparture - MM1QueueSim.queue.shift();
      MM1QueueSim.totalWait += MM1QueueSim.waitInSystem;
  
      if (MM1QueueSim.queue.length === 0) {
        MM1QueueSim.nextDeparture = Infinity;
      } else {
        const serviceTime = MM1QueueSim.exp(MM1QueueSim.mu);
        MM1QueueSim.nextDeparture += serviceTime;
      }
    }
  
    static exp(lambda) {
      return (-Math.log(1 - Math.random()) / lambda) * 1000;
    }

    static reset() {
      MM1QueueSim.lambda = 0;
      MM1QueueSim.mu = 0;
      MM1QueueSim.numInSystem = 0;
      MM1QueueSim.numArrival = 0;
      MM1QueueSim.numDeparture = 0;
      MM1QueueSim.totalWait = 0;
      MM1QueueSim.waitInSystem = 0;
      MM1QueueSim.queue = [];
      MM1QueueSim.nextArrival = 0;
      MM1QueueSim.nextDeparture = Infinity;
      MM1QueueSim.clock = 0;
      MM1QueueSim.resMat = [];
    }
  }