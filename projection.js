document.addEventListener("DOMContentLoaded", () => {

let accounts = JSON.parse(localStorage.getItem("accounts") || "[]");

const select = document.getElementById("accountSelect");
const results = document.getElementById("projectionResults");
const manualInput = document.getElementById("manualBalance");

if (!select || !results) return;

/* ----------------------------
   LOAD ACCOUNTS
---------------------------- */
accounts.forEach((a,i)=>{
    let opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${a.name} - $${Number(a.balance).toLocaleString()}`;
    select.appendChild(opt);
});

/* ----------------------------
   SAME DASHBOARD LOGIC
---------------------------- */

function num(v){
    if(!v) return 0;
    v = v.toString().toLowerCase().replace(/,/g,'');
    if(v.includes("k")) return parseFloat(v)*1000;
    if(v.includes("m")) return parseFloat(v)*1000000;
    return isNaN(Number(v)) ? 0 : Number(v);
}

function tier(b){

    if (b < 90000) {
        let steps = Math.floor((b - 30000) / 15000);
        let x = 1 + (steps * 0.5);
        if (x < 1) x = 1;
        if (x > 3) x = 3;
        return x;
    }

    if (b < 140000) return 3;
    if (b < 160000) return 3.5;
    if (b < 180000) return 4;
    if (b < 200000) return 4.5;

    let steps = Math.floor((b - 200000) / 20000);
    return 5 + (steps * 0.5);
}

function mult(b){ return tier(b); }
function daily(b){ return mult(b) * 800; }
function weekly(b){ return daily(b) * 5; }
function monthly(b){ return daily(b) * 22; }

function nextTargetFromBalance(b){

    if (b < 30000) return 30000;

    if (b < 90000) {
        let steps = Math.floor((b - 30000) / 15000) + 1;
        return 30000 + (steps * 15000);
    }

    if (b < 140000) return 140000;
    if (b < 160000) return 160000;
    if (b < 180000) return 180000;
    if (b < 200000) return 200000;

    let steps = Math.floor((b - 200000) / 20000) + 1;
    return 200000 + (steps * 20000);
}

/* ----------------------------
   MAIN PROJECTION
---------------------------- */

window.runProjection = function () {

    let b = parseFloat(manualInput.value);

    if (select.value !== "") {
        b = accounts[select.value].balance;
    }

    if (!b || b <= 0){
        results.innerHTML = "<div class='month'>Enter valid balance</div>";
        return;
    }

    let html = "";

    for (let m = 1; m <= 12; m++){

        let d = daily(b);
        let w = weekly(b);
        let mo = monthly(b);
        let mlt = mult(b);

        let nextTarget = nextTargetFromBalance(b);
        let needed = Math.max(0, nextTarget - b);

        let etaDays = d > 0 ? (needed / d) : 0;

        b += mo;

        html += `
        <div class="month">

            <strong>Month ${m}</strong><br><br>

            Balance: <b>$${b.toLocaleString()}</b><br>
            Multiplier: ${mlt.toFixed(2)}x<br><br>

            Daily: $${d.toLocaleString()}<br>
            Weekly: $${w.toLocaleString()}<br>
            Monthly: $${mo.toLocaleString()}<br><br>

            Next Tier: $${nextTarget.toLocaleString()}<br>
            Needed: $${needed.toLocaleString()}<br>
            ETA: ~${etaDays.toFixed(1)} days

        </div>
        `;
    }

    results.innerHTML = html;
};

});
