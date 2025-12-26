// ===============================
// URL DEL APPS SCRIPT (DEPLOY /exec)
const GOOGLE_SHEETS_API =
"https://script.google.com/macros/s/AKfycbzv2XqvNKWSRim92dDDcvJj798pglXYUKlgak0VnlZXTFzDrNs8jv6iPYPq74aBtvd2/exec";

let allData = [];
let currentData = [];
let editIndex = null;

// ===============================
// CARGAR BASE DE DATOS
async function loadDatabase() {
    const loading = document.getElementById("loading");
    loading.style.display = "flex"; // Mostrar mensaje de cargando

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
    } finally {
        loading.style.display = "none"; // Ocultar cargando siempre
    }
}

// ===============================
// MOSTRAR DATOS EN TABLA
function displayData(data) {
    const body = document.getElementById("table-body");
    const count = document.getElementById("record-count");

    body.innerHTML = "";

    data.forEach((d, index) => {
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
            <td>
                <button onclick="editRecord(${index})">✏️</button>
                <button onclick="deleteRecord(${index})">🗑️</button>
            </td>
        </tr>
        `;
    });

    count.textContent = data.length;
}

// ===============================
// EDITAR REGISTRO
function editRecord(index) {
    const d = currentData[index];
    editIndex = allData.indexOf(d);

    document.getElementById("f-serie").value = d.SERIE || "";
    document.getElementById("f-modelo").value = d.MODELO || "";
    document.getElementById("f-cliente").value = d.CLIENTE || "";
    document.getElementById("f-ciudad").value = d.CIUDAD || "";
    document.getElementById("f-area").value = d.AREA || "";
    document.getElementById("f-calidad").value = d["CALIDAD EQUIPO"] || "";
    document.getElementById("f-venta-fabrica").value = d["VENTA FABRICA"] || "";
    document.getElementById("f-instalacion").value = d.INSTALACION || "";
    document.getElementById("f-venta-perfectech").value = d["VENTA PERFECTECH"] || "";
    document.getElementById("f-inicio-garantia").value = d["INICIO GARANTIA"] || "";
    document.getElementById("f-termino-garantia").value = d["TERMINO GARANTIA"] || "";
    document.getElementById("f-ultima-reparacion").value = d["ULTIMA REPARACION"] || "";
    document.getElementById("f-vendedor").value = d.VENDEDOR || "";
    document.getElementById("f-distribuidor").value = d.DISTRIBUIDOR || "";

    document.getElementById("add-form").style.display = "flex";
}

// ===============================
// ELIMINAR REGISTRO
async function deleteRecord(index) {
    if (!confirm("¿Seguro que deseas eliminar este registro?")) return;

    const realIndex = allData.indexOf(currentData[index]);

    try {
        await fetch(GOOGLE_SHEETS_API, {
            method: "POST",
            body: JSON.stringify({ action: "delete", index: realIndex })
        });

        alert("🗑️ Registro eliminado");
        loadDatabase();

    } catch (e) {
        alert("❌ Error al eliminar");
        console.error(e);
    }
}

// ===============================
// GUARDAR (AGREGAR / EDITAR)
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

    const payload = editIndex === null
        ? { action: "add", data }
        : { action: "edit", index: editIndex, data };

    try {
        await fetch(GOOGLE_SHEETS_API, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        alert(editIndex === null ? "✅ Registro agregado" : "✏️ Registro actualizado");

        editIndex = null;

        // limpiar inputs
        document.querySelectorAll("#add-form input").forEach(i => i.value = "");

        document.getElementById("add-form").style.display = "none";
        loadDatabase();

    } catch (e) {
        alert("❌ Error al guardar");
        console.error(e);
    }
}

// ===============================
// FILTROS
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
        sel.innerHTML = `<option value="">Todos</option>`;
        [...new Set(data.map(d => d[key]))]
            .filter(Boolean)
            .forEach(v => sel.innerHTML += `<option value="${v}">${v}</option>`);
    });
}

// ===============================
function filterTable() {
    showLoading();
    
    const fModelo = document.getElementById("filter-modelo").value;
    const fCliente = document.getElementById("filter-cliente").value;
    const fCiudad = document.getElementById("filter-ciudad").value;
    const fArea = document.getElementById("filter-area").value;
    const fVendedor = document.getElementById("filter-vendedor").value;
    const fDistribuidor = document.getElementById("filter-distribuidor").value;

    currentData = allData.filter(d =>
        (!fModelo || d.MODELO === fModelo) &&
        (!fCliente || d.CLIENTE === fCliente) &&
        (!fCiudad || d.CIUDAD === fCiudad) &&
        (!fArea || d.AREA === fArea) &&
        (!fVendedor || d.VENDEDOR === fVendedor) &&
        (!fDistribuidor || d.DISTRIBUIDOR === fDistribuidor)
    );

    displayData(currentData);
    // 🔄 Actualizar los filtros según lo filtrado
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
        const selected = sel.value; // guardamos selección actual
        sel.innerHTML = `<option value="">Todos</option>`;
        [...new Set(currentData.map(d => d[key]))]
            .filter(Boolean)
            .forEach(v => sel.innerHTML += `<option value="${v}" ${v === selected ? "selected" : ""}>${v}</option>`);
    });

    hideLoading(); // ocultar mensaje
}

// ===============================
// EXPORTAR
function downloadExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(currentData);
    XLSX.utils.book_append_sheet(wb, ws, "Base Instalada");
    XLSX.writeFile(wb, "Base_Instalada.xlsx");
}

// ===============================
function toggleForm() {
    const form = document.getElementById("add-form");
    form.style.display = form.style.display === "none" ? "flex" : "none";
}

// ===============================
document.addEventListener("DOMContentLoaded", loadDatabase);

