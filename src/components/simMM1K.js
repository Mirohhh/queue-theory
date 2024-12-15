let arrivalTime = 0;
let servTime;
let numCustomersInSystem = 0;
let noCustomerArr = [];
let timeServBegins;
let timeSinceLastArrival;
let timeCustomerWaitInQu;
let timeServEnds = 0;
let timeCustomerSpendsInSys;
let idleServtime;
let resMat = [];
let servTimeTotal = 0;
let timeCustomerWaitInQuTotal = 0;
let timeCustomerSpendsInSysTotal = 0;
let idleServtimeTotal = 0;

const rand = (mean) => {
    return Math.round((Math.log(1 - Math.random()) / -mean));
}

let tse = 0;
let noOfCustWhoWaited = 0;
/**
 * Simulates the M/M/1 queue system for a given number of events.
 *
 * @param {number} lam - The arrival rate (lambda) of the system.
 * @param {number} mu - The service rate (mu) of the system.
 * @param {number} iter - The number of simulation iterations.
 *
 * @returns {Object} - An object containing the simulation results.
 *                      The object contains the following properties:
 *                      resMat: An array of arrays, where each subarray
 *                              contains the details of each event, including
 *                              the event number, clock time, event type,
 *                              number of arrivals, number of departures,
 *                              number in system, wait time in the system, and
 *                              idle service time.
 *                      servTimeTotal: The total service time.
 *                      timeCustomerWaitInQuTotal: The total time customers
 *                                                  spend waiting in the
 *                                                  queue.
 *                      timeCustomerSpendsInSysTotal: The total time customers
 *                                                      spend in the system.
 *                      idleServtimeTotal: The total idle service time.
 */
export const simulateMM1K = (lam, mu, iter, cap) => {
  for (let i = 0; i < iter; i++) {
    timeSinceLastArrival = i === 0 ? 0 : rand(lam);
    console.log(`Arr: ${rand(lam)}`);
    arrivalTime += timeSinceLastArrival;

    if (numCustomersInSystem >= cap) {
      numCustomersInSystem--;
      noCustomerArr.push([timeServEnds, numCustomersInSystem]);
      resMat.push([i + 1, timeSinceLastArrival, arrivalTime, "Rejected", "Rejected", "Rejected", "Rejected", "Rejected", idleServtime]);
      console.log("Rejected customer at time: " + arrivalTime);
      continue;
    }
    servTime = rand(mu);
    console.log(`Serv: ${rand(mu)}`);
    servTimeTotal += servTime;
    timeServBegins = Math.max(arrivalTime, timeServEnds);
    timeCustomerWaitInQu = timeServBegins - arrivalTime;
    noOfCustWhoWaited += timeCustomerWaitInQu > 0 ? 1 : 0;
    timeCustomerWaitInQuTotal += timeCustomerWaitInQu;
    timeServEnds = timeServBegins + servTime;
    timeCustomerSpendsInSys = timeServEnds - arrivalTime;
    timeCustomerSpendsInSysTotal += timeCustomerSpendsInSys;
    idleServtime = Math.max(arrivalTime - tse, 0);
    idleServtimeTotal += idleServtime;
    tse = timeServEnds;

    if (timeCustomerWaitInQu > 0) {
      numCustomersInSystem++; // increment if customer waits in queue
    } else {
      numCustomersInSystem = Math.max(numCustomersInSystem - 1, 0); // decrement if customer doesn't wait in queue
    }

    noCustomerArr.push([timeServEnds, numCustomersInSystem]);
    resMat.push([i + 1, timeSinceLastArrival, arrivalTime, servTime, timeServBegins, timeCustomerWaitInQu, timeServEnds, timeCustomerSpendsInSys, idleServtime]);
  }

    const perfMetrics = calcAverage({resMat, servTimeTotal, timeCustomerWaitInQuTotal, timeCustomerSpendsInSysTotal, idleServtimeTotal, noOfCustWhoWaited});

    return {resMat, perfMetrics, noCustomerArr};
}

const calcAverage = (arr) => {
    const iterNum = arr.resMat.length;
    const avgWaitingTime = parseFloat((arr.timeCustomerWaitInQuTotal / iterNum).toFixed(2));
    const avgServiceTime = parseFloat((arr.servTimeTotal / iterNum).toFixed(2));
    const propIdleServer = parseFloat((arr.idleServtimeTotal / arr.resMat[iterNum - 1][6]).toFixed(2));
    const avgTimeSpentInSystem = parseFloat((arr.timeCustomerSpendsInSysTotal / iterNum).toFixed(2));
    const propCustomerWaitsInQueue = parseFloat((arr.noOfCustWhoWaited / iterNum).toFixed(2));
    return {avgServiceTime, avgWaitingTime, propCustomerWaitsInQueue, avgTimeSpentInSystem, propIdleServer};
}

export const reset = () => {
    arrivalTime = 0;
    servTime = 0;
    timeServBegins = 0;
    timeCustomerWaitInQu = 0;
    timeServEnds = 0;
    timeCustomerSpendsInSys = 0;
    idleServtime = 0;
    resMat = [];
    servTimeTotal = 0;
    timeCustomerWaitInQuTotal = 0;
    timeCustomerSpendsInSysTotal = 0;
    idleServtimeTotal = 0;
    noOfCustWhoWaited = 0;
    tse = 0;
    noCustomerArr = [];
    numCustomersInSystem = 0;
}