function roundToTwo(number) {
    return Math.round((number + Number.EPSILON) * 100) / 100;
}

function factorial(num) {
    if (num < 0) {
        throw new Error("Factorial is not defined for negative numbers.");
    }
    if (num === 0 || num === 1) {
        return 1;
    }
    let result = 1;
    for (let i = 2; i <= num; i++) {
        result *= i;
    }
    return result;
}

export function detModel(s, b, lm, m) {
    if (s == 1 && b == 0) {
        return calcMM1(lm, m);
    } else if (s == 1 && b > 0) {
        return calcMM1K(b, lm, m);
    } else if (s > 1 && b == 0) {
        return calcMMC(s, lm, m);
    } else if (s > 1 && b > 0) {
        return calcMMCK(lm, m, s, b);
    } 
    
    return "Please enter valid inputs.";
}

function calcMM1(lmd, mui) {
    let w = 1 / (mui - lmd);
    let wq = lmd / (mui * (mui - lmd));
    let l = lmd * w;
    let lq = lmd * wq;

    return `L= ${roundToTwo(l)},  Lq= ${roundToTwo(lq)},  W= ${roundToTwo(w)},  Wq= ${roundToTwo(wq)}`;
}

function calcMM1K(k, lmd, mui) {
    let rho = lmd / mui;
    let l;
    if (rho === 1) {
        l = roundToTwo(k / 2);
    } else {
        const numerator = 1 - (k + 1) * Math.pow(rho, k) + k * Math.pow(rho, k + 1);
        const denominator = (1 - rho) * (1 - Math.pow(rho, k + 1));
        l =  roundToTwo(rho * (numerator / denominator));
    }
    let pk;
    if (rho === 1) {
        pk = 1 / (k + 1);
    } else {
        const numerator = 1 - rho;
        const denominator = 1 - Math.pow(rho, k + 1);
        pk = Math.pow(rho, k) * (numerator / denominator);
    }
    let lmddash = lmd * (1 - pk);
    let w = roundToTwo(l / lmddash);
    let wq = roundToTwo(w - (1 / mui));
    let lq = roundToTwo(wq * lmddash);

    return `L= ${l},  Lq= ${lq},  W= ${w},  Wq= ${wq}`;
}

function calculate_p0_inverse(lambda, mu, c) {
    const r = lambda / mu; // Traffic intensity (arrival rate / service rate)

    if (r / c < 1) {
        // Case 1: r/c < 1
        let sum1 = 0;
        for (let n = 0; n < c; n++) {
            sum1 += Math.pow(r, n) / factorial(n);
        }
        const term2 = (c * Math.pow(r, c)) / (factorial(c) * (c - r));
        return sum1 + term2;
    } else {
        // Case 2: r/c >= 1
        let sum2 = 0;
        for (let n = 0; n < c; n++) {
            sum2 += (1 / factorial(n)) * Math.pow(r, n);
        }
        const term2 = (1 / factorial(c)) * Math.pow(r, c) * ((c * mu) / (c * mu - lambda));
        return sum2 + term2;
    }
}

function calcMMC(c, lmd, mui) {
    let r = lmd / mui;

    const numerator = Math.pow(r, c + 1) / c;
    const denominator = factorial(c) * Math.pow(1 - r / c, 2);
    let p0 = 1 / calculate_p0_inverse(lmd, mui, c);

    let lq = (numerator / denominator) * p0;
    let l = lq + r;
    let wq = lq / lmd;
    let w = wq + (1 / mui);

    return `L= ${roundToTwo(l)},  Lq= ${roundToTwo(lq)},  W= ${roundToTwo(w)},  Wq= ${roundToTwo(wq)}`;
}

function calc_p0_inverse_ck(rho, r, c, k) {
    if (rho === 1) {
        let sum1 = 0;
        for (let n = 0; n < c; n++) {
            sum1 += Math.pow(r, n) / factorial(n);
        }
        const term2 = (Math.pow(r, c) / factorial(c)) * (k - c + 1);

        return sum1 + term2;
    } else {
        let sum2 = 0;
        for (let n = 0; n < c; n++) {
            sum2 += Math.pow(r, n) / factorial(n);
        }
        const term2 = (Math.pow(r, c) / factorial(c)) * ((1 - Math.pow(rho, (k - c + 1))) / (1 - rho));

        return sum2 + term2;
    }
}

function calcPn(n, r, c, p0) {
    if (n >= 0 && n < c) {
        return ( (Math.pow(r, n) / factorial(n)) * p0 );
    } else {
        return ( (Math.pow(r, n) / ( Math.pow(c, n - c) * factorial(c) ) ) * p0 );
    }
}

function calcMMCK(lmd, mui, c, k) {
    const r = lmd / mui;
    const rho = r / c;
    const p0 = 1 / calc_p0_inverse_ck(rho, r, c, k);
    const lmddash = lmd * ( 1 - calcPn(k, r, c, p0) );

    const t1 = ( rho * Math.pow(r, c) * p0 ) / ( factorial(c) * Math.pow((1 - rho), 2) );
    const t2 = 1 - Math.pow(rho, (k - c + 1)) - (1 - rho) * (k - c + 1) * Math.pow(rho, (k - c));
    const lq = t1 * t2;

    let sum = 0;
    for (let n = 0; n < c; n++) {
        sum += (c - n) * ( Math.pow(r, n) / factorial(n) );
    }

    const l = lq + c - ( p0 * sum );
    const w = l / lmddash;
    const wq = lq / lmddash;

    return `L= ${roundToTwo(l)},  Lq= ${roundToTwo(lq)},  W= ${roundToTwo(w)},  Wq= ${roundToTwo(wq)}`;
}