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

function detModel(s, b, lm, m) {
    let ret;
    if (s == 1 && b == 0) {
        ret = calcMM1(lm, m);
    } else if (s == 1 && b > 0) {
        ret = calcMM1K(b, lm, m);
    } else if (s > 1 && b == 0) {
        ret = calcMMC();
    } else if (s > 1 && b > 0) {
        ret = calcMMCK();
    } else {
        ret = "Please enter valid inputs.";
    }

    return ret;
}

function calcMM1(lmd, mui) {
    let w = roundToTwo(1 / (mui - lmd));
    let wq = roundToTwo(lmd / (mui * (mui - lmd)));
    let l = roundToTwo(lmd * w);
    let lq = roundToTwo(lmd * wq);

    return `L= ${l},  Lq= ${lq},  W= ${w},  Wq= ${wq}`;
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

function calcMMC() {

}

function calcMMCK(params) {
    
}