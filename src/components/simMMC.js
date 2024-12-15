function exponentialRandom(mean) {
    return -mean * Math.log(1 - Math.random());
}

export const simulateMMC = (lambda, mu, numServers, simulationTime) => {
    let clock = 0; // Current time
    let nextArrival = exponentialRandom(1 / lambda); // Time of the next arrival
    let servers = Array(numServers).fill(0); // Array representing server availability times
    let serverBusyTimes = Array(numServers).fill(0); // Total busy time for each server
    let queue = []; // Queue of waiting customers
    let log = []; // Log of events and states
    let numCustomersInSystem = 0; // Number of customers in the system

    // Metrics
    let totalWaitTime = 0;
    let totalCustomersServed = 0;
    let customersInQueue = 0;
    let maxQueueLength = 0;
    const logLimit = 10000;
    while (clock < simulationTime) {
        // Determine the time of the next event (either an arrival or a service completion)
        let nextDeparture = Math.min(...servers.filter(time => time > 0));
        if (!isFinite(nextDeparture)) nextDeparture = Infinity; // Handle no active servers

        let isArrival = nextArrival <= nextDeparture && nextArrival <= simulationTime;

        if (isArrival) {
            // Process the next arrival
            clock = nextArrival;

            // Check for an available server
            const availableServer = servers.findIndex((time) => time <= clock);
            if (availableServer !== -1) {
                // Assign the customer to the available server
                const serviceTime = exponentialRandom(1 / mu);
                servers[availableServer] = clock + serviceTime;
                serverBusyTimes[availableServer] += serviceTime;
                totalCustomersServed++;
                numCustomersInSystem++;
                if (log.length < logLimit) {
                    log.push({
                        event: "Arrival",
                        time: clock.toFixed(2),
                        server: availableServer + 1,
                        arrivalTime: clock.toFixed(2),
                        serviceTime: serviceTime.toFixed(2),
                        queueLength: queue.length,
                        numCustomersInSystem: numCustomersInSystem
                    });
                }
            } else {
                // Add the customer to the queue
                queue.push(clock);
                customersInQueue++;
                maxQueueLength = Math.max(maxQueueLength, queue.length);
                numCustomersInSystem++;
                if (log.length < logLimit) {
                    log.push({
                        event: "Arrival",
                        time: clock.toFixed(2),
                        server: "-",
                        arrivalTime: clock.toFixed(2),
                        serviceTime: "-",
                        queueLength: queue.length,
                        numCustomersInSystem: numCustomersInSystem
                    });
                }
            }

            // Schedule the next arrival
            nextArrival += exponentialRandom(1 / lambda);
        } else {
            // Process the next departure
            clock = nextDeparture;
            const departingServer = servers.findIndex((time) => time === clock);

            // Check if there is a queued customer
            if (queue.length > 0) {
                const arrivalTime = queue.shift();
                const serviceTime = exponentialRandom(1 / mu);
                servers[departingServer] = clock + serviceTime;
                serverBusyTimes[departingServer] += serviceTime;
                totalWaitTime += clock - arrivalTime;
                totalCustomersServed++;
                numCustomersInSystem = Math.max(numCustomersInSystem - 1, 0);
                if (log.length < logLimit) {
                    log.push({
                        event: "Departure",
                        time: clock.toFixed(2),
                        server: departingServer + 1,
                        arrivalTime: arrivalTime.toFixed(2),
                        serviceTime: serviceTime.toFixed(2),
                        queueLength: queue.length,
                        numCustomersInSystem: numCustomersInSystem
                    });
                }
            } else {
                // Server becomes idle
                servers[departingServer] = 0;
                numCustomersInSystem = Math.max(numCustomersInSystem - 1, 0);
                if (log.length < logLimit) {
                    log.push({
                        event: "Departure",
                        time: clock.toFixed(2),
                        server: departingServer + 1,
                        arrivalTime: "-",
                        serviceTime: "-",
                        queueLength: queue.length,
                        numCustomersInSystem: numCustomersInSystem
                    });
                }
            }
        }
    }

    const averageWaitTime = (totalWaitTime / totalCustomersServed).toFixed(2) || 0;
    const averageQueueLength = (customersInQueue / simulationTime).toFixed(2);
    const serverUtilizations = serverBusyTimes.map(
        (busyTime, index) => ({
            server: index + 1,
            utilization: ((busyTime / simulationTime) * 100).toFixed(2) + "%"
        })
    );

    const custArr = log.map(obj => [Math.floor(parseFloat(obj.time)), obj.numCustomersInSystem]);

    const perfMetrics = {
        totalCustomersServed,
        averageWaitTime,
        averageQueueLength,
    }

    return {
        log,
        perfMetrics,
        serverUtilizations,
        custArr
    }
}