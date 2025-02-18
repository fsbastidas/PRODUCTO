let currentData = []; // Guardar datos actuales para modificar y filtrar

// Función para actualizar el estado visual de los botones
function updateButtonStyles(activeButton) {
    const btnLed = document.getElementById("btnLed");
    const btnXenon = document.getElementById("btnXenon");

    
    if (activeButton === "LED") {
        btnLed.style.backgroundColor = "#28a745"; // Verde activo
        btnLed.style.color = "white";
        btnLed.disabled = true;

        btnXenon.style.backgroundColor = "#ccc"; // Apagado
        btnXenon.style.color = "#666";
        btnXenon.disabled = false;
    } else {
        btnXenon.style.backgroundColor = "#28a745"; // Verde activo
        btnXenon.style.color = "white";
        btnXenon.disabled = true;

        btnLed.style.backgroundColor = "#ccc"; // Apagado
        btnLed.style.color = "#666";
        btnLed.disabled = false;
    }
}

// Función para limpiar la tabla antes de cargar datos nuevos
function clearTable() {
    document.getElementById("table-body").innerHTML = "";
}

// Función para cargar la base de datos
async function loadDatabase(file) {
    try {
        clearTable(); // Limpia la tabla antes de cargar nuevos datos

        const response = await fetch(`BASES/${file}.json`);
        if (!response.ok) throw new Error(`Error al cargar datos: ${response.status}`);

        const jsonData = await response.json();
        console.log("Datos cargados:", jsonData);

        const dataKey = Object.keys(jsonData)[0];
        currentData = jsonData[dataKey];

        if (!Array.isArray(currentData)) throw new Error("El formato de datos no es válido");

        console.log(`Cantidad de registros en ${file}: ${currentData.length}`);
        displayData(currentData);
        populateFilters(currentData);
        updateButtonStyles(file.includes("LED") ? "LED" : "XENON");
    } catch (error) {
        console.error("No se pudieron cargar los datos:", error);
    }
}

// Función para mostrar los datos en la tabla
function displayData(data) {
    const tableBody = document.getElementById("table-body");
    const recordCount = document.getElementById("record-count");

    tableBody.innerHTML = ""; // Limpia la tabla antes de agregar datos

    data.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item["Model"]?.trim() || ""}</td>
            <td>${item["Customer Name"]?.trim() || ""}</td>
            <td>${item["Territoy"]?.trim() || ""}</td>
            <td>${item["Address1"]?.trim() || ""}</td>
            <td>${item["City"]?.trim() || ""}</td>
            <td>${item["Date Sold"]?.trim() || ""}</td>
            <td>${item["Date Installed"]?.trim() || ""}</td>
            <td>
                <button onclick="editRow(this, ${index})">Editar</button>
                <button onclick="deleteRow(${index})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Actualiza la cantidad de registros en el recuadro
    recordCount.textContent = data.length;
}

// Función para llenar los filtros con valores únicos
function populateFilters(data) {
    const filters = {
        "filter-model": "Model",
        "filter-client": "Customer Name",
        "filter-territoy": "Territoy",
        "filter-city": "City",
        "filter-date-sold": "Date Sold",
        "filter-date-installed": "Date Installed"
    };

    Object.keys(filters).forEach(filterId => {
        const select = document.getElementById(filterId);
        select.innerHTML = '<option value="">Todos</option>'; // Resetear opciones

        const uniqueValues = [...new Set(data.map(item => item[filters[filterId]]))].sort();
        uniqueValues.forEach(value => {
            if (value) {
                const option = document.createElement("option");
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            }
        });
    });
}

// Función para filtrar los datos en la tabla
function filterTable() {
    const modelFilter = document.getElementById("filter-model").value;
    const clientFilter = document.getElementById("filter-client").value;
    const cityFilter = document.getElementById("filter-city").value;
    const territoyFilter = document.getElementById("filter-territoy").value;
    const dateSoldFilter = document.getElementById("filter-date-sold").value;
    const dateInstalledFilter = document.getElementById("filter-date-installed").value;

    const filteredData = currentData.filter(item => {
        return (
            (modelFilter === "" || item["Model"] === modelFilter) &&
            (clientFilter === "" || item["Customer Name"] === clientFilter) &&
            (cityFilter === "" || item["City"] === cityFilter) &&
            (territoyFilter === "" || item["Territoy"] === territoyFilter) &&
            (dateSoldFilter === "" || item["Date Sold"] === dateSoldFilter) &&
            (dateInstalledFilter === "" || item["Date Installed"] === dateInstalledFilter)
        );
    });

    displayData(filteredData);
}

// Función para habilitar la edición de la fila
function editRow(button, index) {
    const row = button.parentNode.parentNode;
    const cells = row.querySelectorAll("td");

    if (button.textContent === "Editar") {
        // Habilitar edición
        cells.forEach((cell, i) => {
            if (i < cells.length - 1) {
                cell.contentEditable = true;
                cell.style.backgroundColor = "#ffffcc"; // Color amarillo para resaltar edición
            }
        });
        button.textContent = "Guardar";
    } else {
        // Guardar cambios
        cells.forEach((cell, i) => {
            if (i < cells.length - 1) {
                currentData[index][Object.keys(currentData[index])[i]] = cell.textContent;
                cell.contentEditable = false;
                cell.style.backgroundColor = ""; // Restaurar color
            }
        });
        button.textContent = "Editar";
        console.log("Datos actualizados:", currentData[index]); // Mostrar cambios en consola
    }
}

// Función para eliminar una fila de la tabla
function deleteRow(index) {
    currentData.splice(index, 1); // Elimina la fila del array
    displayData(currentData); // Recarga la tabla con los datos actualizados
}

// Función para descargar en Excel
function downloadExcel() {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.table_to_sheet(document.querySelector("table"));
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    XLSX.writeFile(wb, "Base_Datos.xlsx");
}

// Función para descargar en PDF
function downloadPDF() {
    let { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    doc.text("Base de Datos", 10, 10);
    doc.autoTable({ html: "table" });
    doc.save("Base_Datos.pdf");
}

// Mostrar / Ocultar el formulario de agregar fila
document.getElementById("toggleAddForm").addEventListener("click", function () {
    let form = document.getElementById("addForm");
    form.style.display = form.style.display === "none" ? "flex" : "none";
});

// Función para agregar una nueva fila a la tabla
function addRow() {
    let newRow = {
        "Model": document.getElementById("newModel").value.trim(),
        "Customer Name": document.getElementById("newClient").value.trim(),
        "Territoy": document.getElementById("newTerritoy").value.trim(),
        "Address1": document.getElementById("newAddress").value.trim(),
        "City": document.getElementById("newCity").value.trim(),
        "Date Sold": document.getElementById("newDateSold").value || "N/A",
        "Date Installed": document.getElementById("newDateInstalled").value || "N/A"
    };

    // Agregar al array de datos actuales
    currentData.push(newRow);
    displayData(currentData);

    // Limpiar los campos
    document.getElementById("newModel").value = "";
    document.getElementById("newClient").value = "";
    document.getElementById("newTerritoy").value = "";
    document.getElementById("newAddress").value = "";
    document.getElementById("newCity").value = "";
    document.getElementById("newDateSold").value = "";
    document.getElementById("newDateInstalled").value = "";

    // Ocultar el formulario después de agregar
    document.getElementById("addForm").style.display = "none";
}
