const GOOGLE_SHEETS_API =
"https://script.google.com/macros/s/AKfycbxug982kQNmK67uPZ2jLby2RVIrRbXNUbGDUMsH9HvV72QjM-97j0Tc8sDuIR8-Qx29gw/exec";

let allData = [];
let currentData = [];

// ===============================
async function loadDatabase() {
    try {
        const res = await fetch(GOOGLE_SHEETS_API);
        if (!res.ok) throw new Error("Error API");

        allData = await res.json();
        currentData = [...allData];

        displayData(currentData);
        populateFilters(currentData);

    } catch (e) {
        alert("❌ No se pudo cargar la base");
        console.error(e);
    }
}

// ===============================
function displayData(data) {
    const body = document.getElementById("table-body");
    const count = document.getElementById("record-count");
    body.innerHTML = "";

    data.forEach((d, i) => {
        body.innerHTML += `
        <tr>
            <td>${d["Model"] || ""}</td>
            <td>${d["Customer Name"] || ""}</td>
            <td>${d["Territoy"] || ""}</td>
            <td>${d["Address1"] || ""}</td>
            <td>${d["City"] || ""}</td>
            <td>${d["Date Sold"] || ""}</td>
            <td>${d["Date Installed"] || ""}</td>
            <td>
                <button onclick="deleteRow(${i})">🗑</button>
            </td>
        </tr>`;
    });

    count.textContent = data.length;
}

// ===============================
function populateFilters(data) {
    const map = {
        "filter-model": "Model",
        "filter-client": "Customer Name",
        "filter-territoy": "Territoy",
        "filter-city": "City",
        "filter-date-sold": "Date Sold",
        "filter-date-installed": "Date Installed"
    };

    Object.entries(map).forEach(([id, key]) => {
        const sel = document.getElementById(id);
        sel.innerHTML = `<option value="">Todos</option>`;
        [...new Set(data.map(d => d[key]))]
            .filter(Boolean)
            .forEach(v => sel.innerHTML += `<option>${v}</option>`);
    });
}

// ===============================
function filterTable() {
    currentData = allData.filter(d =>
        (!filter-model.value || d["Model"] === filter-model.value) &&
        (!filter-client.value || d["Customer Name"] === filter-client.value) &&
        (!filter-territoy.value || d["Territoy"] === filter-territoy.value) &&
        (!filter-city.value || d["City"] === filter-city.value) &&
        (!filter-date-sold.value || d["Date Sold"] === filter-date-sold.value) &&
        (!filter-date-installed.value || d["Date Installed"] === filter-date-installed.value)
    );
    displayData(currentData);
}

// ===============================
function deleteRow(i) {
    currentData.splice(i, 1);
    displayData(currentData);
}

// ===============================
function downloadExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(currentData);
    XLSX.utils.book_append_sheet(wb, ws, "Base");
    XLSX.writeFile(wb, "Base_Area_Producto.xlsx");
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.autoTable({ html: "table" });
    doc.save("Base_Area_Producto.pdf");
}

// ===============================
document.getElementById("toggleAddForm").onclick = () => {
    addForm.style.display = addForm.style.display === "none" ? "flex" : "none";
};

function addRow() {
    currentData.push({
        "Model": newModel.value,
        "Customer Name": newClient.value,
        "Territoy": newTerritoy.value,
        "Address1": newAddress.value,
        "City": newCity.value,
        "Date Sold": newDateSold.value,
        "Date Installed": newDateInstalled.value
    });
    displayData(currentData);
    addForm.style.display = "none";
}

// ===============================
document.addEventListener("DOMContentLoaded", loadDatabase);
