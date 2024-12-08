export class MM1QueueSimulator {
    constructor(arrivalRate, serviceRate) {
        // Queue parameters
        this.arrivalRate = arrivalRate;   // lambda
        this.serviceRate = serviceRate;    // mu
        this.rho = arrivalRate / serviceRate; // traffic intensity
        
        // System state
        this.queue = [];                   // Stores arrival times
        this.numInSystem = 0;
        this.numArrivals = 0;
        this.numDepartures = 0;
        this.totalWaitTime = 0;
        this.totalSystemTime = 0;
        this.totalQueueTime = 0;
        
        // Time tracking
        this.clock = 0;
        this.nextArrival = 0;
        this.nextDeparture = Number.POSITIVE_INFINITY;
        
        // Statistics
        this.stats = {
            avgWaitTime: 0,
            avgNumInSystem: 0,
            utilization: 0,
            timePoints: [],
            // Queue theory metrics
            L: 0,  // Average number in system
            Lq: 0, // Average number in queue
            W: 0,  // Average time in system
            Wq: 0, // Average time in queue
            // Theoretical values
            theoretical: {
                L: 0,
                Lq: 0,
                W: 0,
                Wq: 0
            }
        };

        // Calculate theoretical values
        this.calculateTheoreticalMetrics();
    }

    calculateTheoreticalMetrics() {
        if (this.rho < 1) {  // System is stable
            this.stats.theoretical.L = this.rho / (1 - this.rho);
            this.stats.theoretical.Lq = (this.rho * this.rho) / (1 - this.rho);
            this.stats.theoretical.W = 1 / (this.serviceRate - this.arrivalRate);
            this.stats.theoretical.Wq = this.rho / (this.serviceRate - this.arrivalRate);
        } else {  // System is unstable
            this.stats.theoretical.L = Infinity;
            this.stats.theoretical.Lq = Infinity;
            this.stats.theoretical.W = Infinity;
            this.stats.theoretical.Wq = Infinity;
        }
    }

    generateExponential(rate) {
        return -Math.log(1 - Math.random()) / rate;
    }

    handleArrival() {
        this.numArrivals++;
        this.numInSystem++;
        
        if (this.queue.length === 0) {
            const serviceTime = this.generateExponential(this.serviceRate);
            this.nextDeparture = this.clock + serviceTime;
        }
        
        // Store arrival time and current queue length for Lq calculation
        this.queue.push({
            arrivalTime: this.clock,
            queueLength: Math.max(0, this.numInSystem - 1)  // Exclude customer in service
        });
        
        const interarrivalTime = this.generateExponential(this.arrivalRate);
        this.nextArrival = this.clock + interarrivalTime;
    }

    handleDeparture() {
        this.numDepartures++;
        this.numInSystem--;
        
        const customerInfo = this.queue.shift();
        const totalTime = this.clock - customerInfo.arrivalTime;
        const serviceTime = this.generateExponential(this.serviceRate);
        const queueTime = Math.max(0, totalTime - serviceTime);
        
        this.totalSystemTime += totalTime;
        this.totalQueueTime += queueTime;
        this.totalWaitTime += totalTime;
        
        if (this.queue.length > 0) {
            this.nextDeparture = this.clock + serviceTime;
        } else {
            this.nextDeparture = Number.POSITIVE_INFINITY;
        }

        return {
            waitTime: totalTime,
            queueTime: queueTime,
            serviceTime: serviceTime
        };
    }

    simulate(numEvents) {
        const events = [];
        let totalQueueLength = 0;
        let lastEventTime = 0;
        
        for (let i = 0; i < numEvents; i++) {
            let eventType;
            let waitInfo = null;

            if (this.nextArrival <= this.nextDeparture) {
                // Calculate time-weighted queue length
                totalQueueLength += Math.max(0, this.numInSystem - 1) * (this.nextArrival - lastEventTime);
                lastEventTime = this.nextArrival;
                
                this.clock = this.nextArrival;
                this.handleArrival();
                eventType = 'Arrival';
            } else {
                // Calculate time-weighted queue length
                totalQueueLength += Math.max(0, this.numInSystem - 1) * (this.nextDeparture - lastEventTime);
                lastEventTime = this.nextDeparture;
                
                this.clock = this.nextDeparture;
                waitInfo = this.handleDeparture();
                eventType = 'Departure';
            }

            const event = {
                eventNum: i + 1,
                time: this.clock.toFixed(4),
                type: eventType,
                numArrivals: this.numArrivals,
                numDepartures: this.numDepartures,
                numInSystem: this.numInSystem,
                numInQueue: Math.max(0, this.numInSystem - 1),
                waitTime: waitInfo ? {
                    total: waitInfo.waitTime.toFixed(4),
                    queue: waitInfo.queueTime.toFixed(4),
                    service: waitInfo.serviceTime.toFixed(4)
                } : 'N/A'
            };
            
            events.push(event);
            
            this.stats.timePoints.push({
                time: this.clock,
                numInSystem: this.numInSystem,
                numInQueue: Math.max(0, this.numInSystem - 1)
            });
        }

        this.calculateSimulationMetrics(totalQueueLength);
        
        return {
            events: events,
            statistics: this.stats
        };
    }

    calculateSimulationMetrics(totalQueueLength) {
        // L - Average number in system (time-weighted)
        let totalArea = 0;
        for (let i = 0; i < this.stats.timePoints.length - 1; i++) {
            const duration = this.stats.timePoints[i + 1].time - this.stats.timePoints[i].time;
            totalArea += this.stats.timePoints[i].numInSystem * duration;
        }
        this.stats.L = totalArea / this.clock;
        
        // Lq - Average number in queue (time-weighted)
        this.stats.Lq = totalQueueLength / this.clock;
        
        // W - Average time in system
        this.stats.W = this.numDepartures > 0 ? this.totalSystemTime / this.numDepartures : 0;
        
        // Wq - Average time in queue
        this.stats.Wq = this.numDepartures > 0 ? this.totalQueueTime / this.numDepartures : 0;
        
        // System utilization
        const busyTime = this.stats.timePoints.reduce((acc, point, i, arr) => {
            if (i === 0) return 0;
            const duration = point.time - arr[i - 1].time;
            return acc + (arr[i - 1].numInSystem > 0 ? duration : 0);
        }, 0);
        this.stats.utilization = busyTime / this.clock;
    }
}

// Example usage:
const arrivalRate = 2;  // λ = 2 customers per time unit
const serviceRate = 3;  // μ = 3 customers per time unit
const simulator = new MM1QueueSimulator(arrivalRate, serviceRate);
const result = simulator.simulate(1000);

// Print both theoretical and simulation results
console.log('\nTheoretical Values:');
console.log(`L  (avg number in system): ${result.statistics.theoretical.L.toFixed(4)}`);
console.log(`Lq (avg number in queue): ${result.statistics.theoretical.Lq.toFixed(4)}`);
console.log(`W  (avg time in system): ${result.statistics.theoretical.W.toFixed(4)}`);
console.log(`Wq (avg time in queue): ${result.statistics.theoretical.Wq.toFixed(4)}`);

console.log('\nSimulation Results:');
console.log(`L  (avg number in system): ${result.statistics.L.toFixed(4)}`);
console.log(`Lq (avg number in queue): ${result.statistics.Lq.toFixed(4)}`);
console.log(`W  (avg time in system): ${result.statistics.W.toFixed(4)}`);
console.log(`Wq (avg time in queue): ${result.statistics.Wq.toFixed(4)}`);
console.log(`System Utilization: ${(result.statistics.utilization * 100).toFixed(2)}%`);