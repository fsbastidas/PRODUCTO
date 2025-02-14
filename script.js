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

async function loadDatabase(file) {
    try {
        const response = await fetch(`BASES/${file}.json`);
        if (!response.ok) throw new Error(`Error al cargar datos: ${response.status}`);

        const jsonData = await response.json();
        console.log("Datos cargados:", jsonData);

        // Obtener la clave del JSON
        const dataKey = Object.keys(jsonData)[0];
        currentData = jsonData[dataKey];

        if (!Array.isArray(currentData)) {
            throw new Error("El formato de datos no es un array válido");
        }

        console.log(`Cantidad de registros en ${file}:`, currentData.length);
        displayData(currentData);

        // Actualizar estilos de los botones según la base seleccionada
        updateButtonStyles(file.includes("LED") ? "LED" : "XENON");
    } catch (error) {
        console.error("No se pudieron cargar los datos:", error);
    }
}

// Función para mostrar los datos en la tabla con botones Editar y Eliminar
function displayData(data) {
    const tableBody = document.getElementById("table-body");
    const recordCount = document.getElementById("record-count");

    tableBody.innerHTML = ""; // Limpia la tabla antes de agregar datos

    data.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td contenteditable="false">${item["Model"] || "N/A"}</td>
            <td contenteditable="false">${item["Customer Name"] || "N/A"}</td>
            <td contenteditable="false">${item["Territoy"] || "N/A"}</td>
            <td contenteditable="false">${item["Address1"] || "N/A"}</td>
            <td contenteditable="false">${item["City"] || "N/A"}</td>
            <td contenteditable="false">${item["Date Sold"] || "N/A"}</td>
            <td contenteditable="false">${item["Date Installed"] || "N/A"}</td>
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

// Función para filtrar los datos en la tabla
function filterTable() {
    const modelFilter = document.getElementById("filter-model").value.toLowerCase();
    const clientFilter = document.getElementById("filter-client").value.toLowerCase();
    const cityFilter = document.getElementById("filter-city").value.toLowerCase();
    const territoyFilter = document.getElementById("filter-territoy").value.toLowerCase();
    const dateSoldFilter = document.getElementById("filter-date-sold").value;
    const dateInstalledFilter = document.getElementById("filter-date-installed").value;

    const filteredData = currentData.filter(item => {
        return (
            item["Model"].toLowerCase().includes(modelFilter) &&
            item["Customer Name"].toLowerCase().includes(clientFilter) &&
            item["City"].toLowerCase().includes(cityFilter) &&
            item["Territoy"].toLowerCase().includes(territoyFilter) &&
            (dateSoldFilter === "" || item["Date Sold"] === dateSoldFilter) &&
            (dateInstalledFilter === "" || item["Date Installed"] === dateInstalledFilter)
        );
    });

    displayData(filteredData);
}











