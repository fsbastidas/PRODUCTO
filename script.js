let currentData = []; // Variable global para guardar los datos cargados

async function loadDatabase(file) {
    try {
        const response = await fetch(`BASES/${file}.json`);
        if (!response.ok) throw new Error(`Error al cargar datos: ${response.status}`);

        const jsonData = await response.json();
        console.log("Datos cargados:", jsonData);

        // Obtener la clave del JSON
        const dataKey = Object.keys(jsonData)[0];
        currentData = jsonData[dataKey]; // Guardar datos en variable global

        if (!Array.isArray(currentData)) {
            throw new Error("El formato de datos no es un array válido");
        }

        console.log(`Cantidad de registros en ${file}:`, currentData.length);
        populateFilters(currentData);
        displayData(currentData);
    } catch (error) {
        console.error("No se pudieron cargar los datos:", error);
    }
}

// Función para llenar los filtros con valores únicos
function populateFilters(data) {
    populateDropdown("filter-model", [...new Set(data.map(item => item["Model"] || "N/A"))]);
    populateDropdown("filter-client", [...new Set(data.map(item => item["Customer Name"] || "N/A"))]);
    populateDropdown("filter-territoy", [...new Set(data.map(item => item["Territory"] || "N/A"))]);
    populateDropdown("filter-city", [...new Set(data.map(item => item["City"] || "N/A"))]);
    populateDropdown("filter-date-sold", [...new Set(data.map(item => item["Date Sold"] || "N/A"))]);
    populateDropdown("filter-date-installed", [...new Set(data.map(item => item["Date Installed"] || "N/A"))]);
}

// Función para llenar un select con opciones
function populateDropdown(selectId, values) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = '<option value="">Todos</option>'; // Opción por defecto
    values.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        selectElement.appendChild(option);
    });
}

// Función para mostrar los datos en la tabla
function displayData(data) {
    const tableBody = document.getElementById("table-body");
    const recordCount = document.getElementById("record-count");

    tableBody.innerHTML = ""; // Limpia la tabla antes de agregar datos

    data.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item["Model"] || "N/A"}</td>
            <td>${item["Customer Name"] || "N/A"}</td>
            <td>${item["Territoy"] || "N/A"}</td>
            <td>${item["Address1"] || "N/A"}</td>
            <td>${item["City"] || "N/A"}</td>
            <td>${item["Date Sold"] || "N/A"}</td>
            <td>${item["Date Installed"] || "N/A"}</td>
            <td><button onclick="deleteRow(${index})">Eliminar</button></td>
        `;
        tableBody.appendChild(row);
    });

    // Actualiza la cantidad de registros en el recuadro
    recordCount.textContent = data.length;
}

// Función para filtrar la tabla
function filterTable() {
    const modelFilter = document.getElementById("filter-model").value;
    const clientFilter = document.getElementById("filter-client").value;
    const territoyFilter = document.getElementById("filter-territory").value;
    const cityFilter = document.getElementById("filter-city").value;
    const dateSoldFilter = document.getElementById("filter-date-sold").value;
    const dateInstalledFilter = document.getElementById("filter-date-installed").value;

    const filteredData = currentData.filter(item =>
        (modelFilter === "" || item["Model"] === modelFilter) &&
        (clientFilter === "" || item["Customer Name"] === clientFilter) &&
        (territoyFilter === "" || item["Territoy"] === territoyFilter) &&
        (cityFilter === "" || item["City"] === cityFilter) &&
        (dateSoldFilter === "" || item["Date Sold"] === dateSoldFilter) &&
        (dateInstalledFilter === "" || item["Date Installed"] === dateInstalledFilter)
    );

    displayData(filteredData);
}

// Función para eliminar una fila de la tabla
function deleteRow(index) {
    currentData.splice(index, 1); // Eliminar el elemento del array
    displayData(currentData); // Volver a mostrar los datos
}

