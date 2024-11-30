import "./styles.css";

const lambda = document.getElementById("lambda");
const mu = document.getElementById("mu");
const servers = document.getElementById("servers");
const bound = document.getElementById("bound");
const subBtn = document.getElementById("sbmt");
const res = document.getElementById("result")

subBtn.addEventListener("click", () => {
    let lmd = parseFloat(lambda.value);
    let mui = parseFloat(mu.value);
    let serv = parseFloat(servers.value);
    let bnd = parseFloat(bound.value);

    res.innerText = detModel(serv, bnd, lmd, mui);
});

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

function detModel(s, b, lm, m) {
    if (s == 1 && b == 0) {
        return calcMM1(lm, m);
    } else if (s == 1 && b > 0) {
        return calcMM1K(b, lm, m);
    } else if (s > 1 && b == 0) {
        return calcMMC(s, lm, m);
    } else if (s > 1 && b > 0) {
        return calcMMCK();
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

function calcMMCK(params) {
    
}