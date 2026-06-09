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

// SAME tier logic as dashboard
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

function daily(b){
    return tier(b) * 800;
}

function runProjection(){

    let b = parseFloat(document.getElementById("manualBalance").value);

    if (select.value !== "") {
        b = accounts[select.value].balance;
    }

    if (!b || b <= 0){
        results.innerHTML = "Enter valid balance";
        return;
    }

    let html = "";

    for (let m = 1; m <= 12; m++){

        let d = daily(b);
        let w = d * 5;
        let mo = d * 22;

        b += mo;

        html += `
        <div class="month">
            <strong>Month ${m}</strong><br><br>
            Balance: $${b.toLocaleString()}<br>
            Daily: $${d.toLocaleString()}<br>
            Weekly: $${w.toLocaleString()}<br>
            Monthly: $${mo.toLocaleString()}
        </div>
        `;
    }

    results.innerHTML = html;
}
