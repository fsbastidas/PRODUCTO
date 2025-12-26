// ===============================
// CONFIGURACIÓN
// ===============================
const GOOGLE_SHEETS_API =
  "https://script.google.com/macros/s/AKfycbwFOmnNEcqRFqgca87ldLPBf_y0S5DPwRs3tq8zRocqavEVg8GV_z7RfwC2xNuxTj5exQ/exec";

let currentData = []; // Datos visibles (LED o XENON)
let allData = [];     // Todos los datos del Sheet

// ===============================
// BOTONES
// ===============================
function updateButtonStyles(activeButton) {
    const btnLed = document.getElementById("btnLed");
    const btnXenon = document.getElementById("btnXenon");

    if (activeButton === "LED") {
        btnLed.style.backgroundColor = "#28a745";
        btnLed.style.color = "white";
        btnLed.disabled = true;

        btnXenon.style.backgroundColor = "#ccc";
        btnXenon.style.color = "#666";
        btnXenon.disabled = false;
    } else {
        btnXenon.style.backgroundColor = "#28a745";
        btnXenon.style.color = "white";
        btnXenon.disabled = true;

        btnLed.style.backgroundColor = "#ccc";
        btnLed.style.color = "#666";
        btnLed.disabled = false;
    }
}

// ===============================
// LIMPIAR TABLA
// ===============================
function clearTable() {
    document.getElementById("table-body").innerHTML = "";
}

// ===============================
// CARGAR DATOS (GOOGLE SHEETS)
// ===============================

/*
async function loadDatabase(tipo){
    try {
        clearTable();

        const response = await fetch(GOOGLE_SHEETS_API);
        if (!response.ok) throw new Error("Error cargando Google Sheets");

        allData = await response.json();

        // FILTRAR POR TECNOLOGÍA
        if (tipo === "BASE_FUJI_LED") {
            currentData = allData.filter(row => row["Tecnología"] === "LED");
            updateButtonStyles("LED");
        } else {
            currentData = allData.filter(row => row["Tecnología"] === "XENON");
            updateButtonStyles("XENON");
        }

        displayData(currentData);
        populateFilters(currentData);

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo cargar la base de datos");
    }
}
*/
async function loadDatabase() {
    try {
        clearTable();

        const response = await fetch(GOOGLE_SHEETS_API);
        if (!response.ok) throw new Error("Error cargando Google Sheets");

        allData = await response.json();
        currentData = allData;

        displayData(currentData);
        populateFilters(currentData);

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo cargar la base de datos");
    }
}

// ===============================
// MOSTRAR DATOS
// ===============================
function displayData(data) {
    const tableBody = document.getElementById("table-body");
    const recordCount = document.getElementById("record-count");

    tableBody.innerHTML = "";

    data.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item["Model"] || ""}</td>
            <td>${item["Customer Name"] || ""}</td>
            <td>${item["Territoy"] || ""}</td>
            <td>${item["Address1"] || ""}</td>
            <td>${item["City"] || ""}</td>
            <td>${item["Date Sold"] || ""}</td>
            <td>${item["Date Installed"] || ""}</td>
            <td>
                <button onclick="editRow(this, ${index})">Editar</button>
                <button onclick="deleteRow(${index})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    recordCount.textContent = data.length;
}

// ===============================
// FILTROS
// ===============================
function populateFilters(data) {
    const filters = {
        "filter-model": "Model",
        "filter-client": "Customer Name",
        "filter-territoy": "Territoy",
        "filter-city": "City",
        "filter-date-sold": "Date Sold",
        "filter-date-installed": "Date Installed"
    };

    Object.keys(filters).forEach(id => {
        const select = document.getElementById(id);
        select.innerHTML = '<option value="">Todos</option>';

        const values = [...new Set(data.map(d => d[filters[id]]))].sort();
        values.forEach(v => {
            if (v) {
                const opt = document.createElement("option");
                opt.value = v;
                opt.textContent = v;
                select.appendChild(opt);
            }
        });
    });
}

function filterTable() {
    const model = document.getElementById("filter-model").value;
    const client = document.getElementById("filter-client").value;
    const city = document.getElementById("filter-city").value;
    const terr = document.getElementById("filter-territoy").value;
    const sold = document.getElementById("filter-date-sold").value;
    const inst = document.getElementById("filter-date-installed").value;

    const filtered = currentData.filter(item =>
        (model === "" || item["Model"] === model) &&
        (client === "" || item["Customer Name"] === client) &&
        (city === "" || item["City"] === city) &&
        (terr === "" || item["Territoy"] === terr) &&
        (sold === "" || item["Date Sold"] === sold) &&
        (inst === "" || item["Date Installed"] === inst)
    );

    displayData(filtered);
}

// ===============================
// EDITAR / ELIMINAR (LOCAL)
// ===============================
function editRow(button, index) {
    const row = button.parentNode.parentNode;
    const cells = row.querySelectorAll("td");

    if (button.textContent === "Editar") {
        cells.forEach((cell, i) => {
            if (i < cells.length - 1) {
                cell.contentEditable = true;
                cell.style.backgroundColor = "#ffffcc";
            }
        });
        button.textContent = "Guardar";
    } else {
        cells.forEach((cell, i) => {
            if (i < cells.length - 1) {
                const keys = [
                    "Model",
                    "Customer Name",
                    "Territoy",
                    "Address1",
                    "City",
                    "Date Sold",
                    "Date Installed"
                ];
                currentData[index][keys[i]] = cell.textContent;
                cell.contentEditable = false;
                cell.style.backgroundColor = "";
            }
        });
        button.textContent = "Editar";
    }
}

function deleteRow(index) {
    currentData.splice(index, 1);
    displayData(currentData);
}

// ===============================
// EXPORTAR
// ===============================
function downloadExcel() {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.table_to_sheet(document.querySelector("table"));
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    XLSX.writeFile(wb, "Base_Datos.xlsx");
}

function downloadPDF() {
    let { jsPDF } = window.jspdf;
    let doc = new jsPDF();
    doc.text("Base de Datos", 10, 10);
    doc.autoTable({ html: "table" });
    doc.save("Base_Datos.pdf");
}

// ===============================
// FORMULARIO
// ===============================
document.getElementById("toggleAddForm").addEventListener("click", () => {
    const form = document.getElementById("addForm");
    form.style.display = form.style.display === "none" ? "flex" : "none";
});

function addRow() {
    const newRow = {
        "Model": document.getElementById("newModel").value,
        "Customer Name": document.getElementById("newClient").value,
        "Territoy": document.getElementById("newTerritoy").value,
        "Address1": document.getElementById("newAddress").value,
        "City": document.getElementById("newCity").value,
        "Date Sold": document.getElementById("newDateSold").value,
        "Date Installed": document.getElementById("newDateInstalled").value
    };

    currentData.push(newRow);
    displayData(currentData);
    document.getElementById("addForm").style.display = "none";
}

