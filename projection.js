let accounts = JSON.parse(localStorage.getItem("accounts") || "[]");

const select = document.getElementById("accountSelect");
const results = document.getElementById("results");

// load accounts
accounts.forEach((a,i)=>{
    let opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${a.name} - $${Number(a.balance).toLocaleString()}`;
    select.appendChild(opt);
});

function num(v){
    if(!v) return 0;
    v = v.toString().toLowerCase().replace(/,/g,'');
    if(v.includes("k")) return parseFloat(v)*1000;
    if(v.includes("m")) return parseFloat(v)*1000000;
    return isNaN(Number(v)) ? 0 : Number(v);
}

// 🔥 EXACT SAME tier logic from your dashboard
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

// 🔥 EXACT SAME logic
function mult(b){ return tier(b); }
function daily(b){ return mult(b) * 800; }
function weekly(b){ return daily(b) * 5; }
function monthly(b){ return daily(b) * 22; }
function dd(b){ return b * 0.4; }
