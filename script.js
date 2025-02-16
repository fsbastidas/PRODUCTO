let currentData = []; // Guardar datos actuales para modificar y filtrar

// Evento para mostrar el formulario de agregar fila
document.getElementById("add-row-btn").addEventListener("click", function() {
    document.getElementById("add-row-form").classList.remove("hidden");
});

// Función para cancelar la adición de una fila
function cancelAddRow() {
    document.getElementById("add-row-form").classList.add("hidden");
}

// Función para agregar una nueva fila a la tabla
function addRow() {
    const newRow = {
        "Model": document.getElementById("new-model").value.trim(),
        "Customer Name": document.getElementById("new-client").value.trim(),
        "Territoy": document.getElementById("new-territory").value.trim(),
        "Address1": document.getElementById("new-address").value.trim(),
        "City": document.getElementById("new-city").value.trim(),
        "Date Sold": document.getElementById("new-date-sold").value,
        "Date Installed": document.getElementById("new-date-installed").value
    };

    currentData.push(newRow);
    displayData(currentData);
    
    // Ocultar formulario después de agregar
    document.getElementById("add-row-form").classList.add("hidden");
}

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

function clearTable() {
    document.getElementById("table-body").innerHTML = "";
}

// Función para cargar la base de datos
async function loadDatabase(file) {
    try {
        clearTable(); // Limpia antes de cargar nuevos datos

        const response = await fetch(`BASES/${file}.json`);
        if (!response.ok) throw new Error(`Error al cargar datos: ${response.status}`);

        const jsonData = await response.json();
        console.log("Datos cargados:", jsonData);

        const dataKey = Object.keys(jsonData)[0];
        currentData = jsonData[dataKey];

        if (!Array.isArray(currentData)) {
            throw new Error("El formato de datos no es un array válido");
        }

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

    // Actualiza la cantidad de registros en el recuadro
    recordCount.textContent = data.length;
}

// Función para editar una fila
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
    currentData.splice(index, 1);
    displayData(currentData);
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

// Función para descargar en Excel
function exportToExcel() {
    let table = document.querySelector("table");
    let wb = XLSX.utils.table_to_book(table, { sheet: "Base de Datos" });
    XLSX.writeFile(wb, "base_datos.xlsx");
}

// Función para descargar en PDF
function exportToPDF() {
    let doc = new jsPDF();
    doc.autoTable({ html: "table" });
    doc.save("base_datos.pdf");
}

// Mostrar opciones de descarga
document.getElementById("download-btn").addEventListener("click", function() {
    let menu = document.getElementById("download-menu");
    menu.classList.toggle("hidden");
});

