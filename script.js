const GOOGLE_SHEETS_API =
"https://script.google.com/macros/s/AKfycbzv2XqvNKWSRim92dDDcvJj798pglXYUKlgak0VnlZXTFzDrNs8jv6iPYPq74aBtvd2/exec";

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

    data.forEach((d) => {
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
        </tr>`;
    });

    count.textContent = data.length;
}

// ===============================
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
            .forEach(v => sel.innerHTML += `<option>${v}</option>`);
    });
}

// ===============================
function filterTable() {
    currentData = allData.filter(d =>
        (!filter-modelo.value || d.MODELO === filter-modelo.value) &&
        (!filter-cliente.value || d.CLIENTE === filter-cliente.value) &&
        (!filter-ciudad.value || d.CIUDAD === filter-ciudad.value) &&
        (!filter-area.value || d.AREA === filter-area.value) &&
        (!filter-vendedor.value || d.VENDEDOR === filter-vendedor.value) &&
        (!filter-distribuidor.value || d.DISTRIBUIDOR === filter-distribuidor.value)
    );

    displayData(currentData);
}

// ===============================
function downloadExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(currentData);
    XLSX.utils.book_append_sheet(wb, ws, "Base");
    XLSX.writeFile(wb, "Base_Instalada.xlsx");
}
function toggleForm() {
    const f = document.getElementById("add-form");
    f.style.display = f.style.display === "none" ? "flex" : "none";
}

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

    const res = await fetch(GOOGLE_SHEETS_API, {
        method: "POST",
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert("✅ Registro guardado");
        loadDatabase(); // recarga la tabla
        toggleForm();
    } else {
        alert("❌ Error al guardar");
    }
}


// ===============================
document.addEventListener("DOMContentLoaded", loadDatabase);

