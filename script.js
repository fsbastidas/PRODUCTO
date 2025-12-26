// ===============================
// URL DEL APPS SCRIPT (DEPLOY /exec)
const GOOGLE_SHEETS_API =
"https://script.google.com/macros/s/AKfycbzv2XqvNKWSRim92dDDcvJj798pglXYUKlgak0VnlZXTFzDrNs8jv6iPYPq74aBtvd2/exec";

let allData = [];
let currentData = [];

// ===============================
// CARGAR BASE DE DATOS
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
// MOSTRAR DATOS EN TABLA
function displayData(data) {
    const body = document.getElementById("table-body");
    const count = document.getElementById("record-count");

    body.innerHTML = "";

    data.forEach(d => {
        body.innerHTML += `
        <tr>
            <td>${d.SERIE || ""}</td>
            <td>${d.MODELO || ""}</td>
            <td>${d.CLIENTE || ""}</td>
            <td>${d.CIUDAD || ""}</td>
            <td>${d.AREA || ""}</td>
            <td>${d["CALIDAD EQUIPO"] || ""}</td>
            <td>${d["VENTA FABRICA"] || ""}</td>
            <td>${d.INSTALACION || ""}</td>
            <td>${d["VENTA PERFECTECH"] || ""}</td>
            <td>${d["INICIO GARANTIA"] || ""}</td>
            <td>${d["TERMINO GARANTIA"] || ""}</td>
            <td>${d["ULTIMA REPARACION"] || ""}</td>
            <td>${d.VENDEDOR || ""}</td>
            <td>${d.DISTRIBUIDOR || ""}</td>
        </tr>
        `;
    });

    count.textContent = data.length;
}

// ===============================
// CARGAR OPCIONES DE FILTROS
function populateFilters(data) {
    const map = {
        "filter-modelo": "MODELO",
        "filter-cliente": "CLIENTE",
        "filter-ciudad": "CIUDAD",
        "filter-area": "AREA",
        "filter-vendedor": "VENDEDOR",
        "filter-distribuidor": "DISTRIBUIDOR"
    };

    Object.entries(map).forEach(([id, key]) => {
        const sel = document.getElementById(id);
        if (!sel) return;

        sel.innerHTML = `<option value="">Todos</option>`;
        [...new Set(data.map(d => d[key]))]
            .filter(Boolean)
            .forEach(v => {
                sel.innerHTML += `<option value="${v}">${v}</option>`;
            });
    });
}

// ===============================
// FILTRAR TABLA
function filterTable() {
    currentData = allData.filter(d =>
        (!document.getElementById("filter-modelo").value || d.MODELO === document.getElementById("filter-modelo").value) &&
        (!document.getElementById("filter-cliente").value || d.CLIENTE === document.getElementById("filter-cliente").value) &&
        (!document.getElementById("filter-ciudad").value || d.CIUDAD === document.getElementById("filter-ciudad").value) &&
        (!document.getElementById("filter-area").value || d.AREA === document.getElementById("filter-area").value) &&
        (!document.getElementById("filter-vendedor").value || d.VENDEDOR === document.getElementById("filter-vendedor").value) &&
        (!document.getElementById("filter-distribuidor").value || d.DISTRIBUIDOR === document.getElementById("filter-distribuidor").value)
    );

    displayData(currentData);
}

// ===============================
// EXPORTAR A EXCEL
function downloadExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(currentData);
    XLSX.utils.book_append_sheet(wb, ws, "Base Instalada");
    XLSX.writeFile(wb, "Base_Instalada.xlsx");
}

// ===============================
// MOSTRAR / OCULTAR FORMULARIO
function toggleForm() {
    const form = document.getElementById("add-form");
    if (!form) return;

    form.style.display = form.style.display === "none" ? "flex" : "none";
}

// ===============================
// GUARDAR REGISTRO NUEVO
async function saveRecord() {
    const data = {
        SERIE: document.getElementById("f-serie").value,
        MODELO: document.getElementById("f-modelo").value,
        CLIENTE: document.getElementById("f-cliente").value,
        CIUDAD: document.getElementById("f-ciudad").value,
        AREA: document.getElementById("f-area").value,
        "CALIDAD EQUIPO": document.getElementById("f-calidad").value,
        "VENTA FABRICA": document.getElementById("f-venta-fabrica").value,
        INSTALACION: document.getElementById("f-instalacion").value,
        "VENTA PERFECTECH": document.getElementById("f-venta-perfectech").value,
        "INICIO GARANTIA": document.getElementById("f-inicio-garantia").value,
        "TERMINO GARANTIA": document.getElementById("f-termino-garantia").value,
        "ULTIMA REPARACION": document.getElementById("f-ultima-reparacion").value,
        VENDEDOR: document.getElementById("f-vendedor").value,
        DISTRIBUIDOR: document.getElementById("f-distribuidor").value
    };

    try {
        const res = await fetch(GOOGLE_SHEETS_API, {
            method: "POST",
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Error al guardar");

        alert("✅ Registro guardado correctamente");

        toggleForm();
        loadDatabase();

    } catch (e) {
        alert("❌ No se pudo guardar el registro");
        console.error(e);
    }
}

// ===============================
// INICIAR AL CARGAR LA PÁGINA
document.addEventListener("DOMContentLoaded", loadDatabase);
