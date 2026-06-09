const accountSelect =
document.getElementById("accountSelect");

const projectionResults =
document.getElementById("projectionResults");

const savedAccounts =
JSON.parse(localStorage.getItem("accounts")) || [];

// Load accounts into dropdown
savedAccounts.forEach((account, index) => {
    const option =
    document.createElement("option");

    option.value = index;
    option.textContent =
    `${account.name} - $${account.balance}`;

    accountSelect.appendChild(option);
});

function runProjection() {

    let balance =
    parseFloat(
        document.getElementById("manualBalance").value
    );

    // If account selected, use account balance
    if (accountSelect.value !== "") {
        balance =
        savedAccounts[
            accountSelect.value
        ].balance;
    }

    if (!balance || balance <= 0) {
        projectionResults.innerHTML =
        "Enter a valid balance";
        return;
    }

    let html = "";

    for (let month = 1; month <= 12; month++) {

        // Uses existing multiplier logic
        const monthlyProfit = balance * 0.10;

        balance += monthlyProfit;

        html += `
        <div style="
            background:#2a2a2a;
            padding:15px;
            border-radius:14px;
            margin-bottom:10px;
        ">
            <strong>Month ${month}</strong><br>
            Balance:
            $${balance.toLocaleString()}
        </div>
        `;
    }

    projectionResults.innerHTML = html;
}
