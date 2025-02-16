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

// Cargar datos de la base de datos
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
        populateFilters(currentData);

        updateButtonStyles(file.includes("LED") ? "LED" : "XENON");
    } catch (error) {
        console.error("No se pudieron cargar los datos:", error);
    }
}

// Mostrar los datos en la tabla
function displayData(data) {
    const tableBody = document.getElementById("table-body");
    const recordCount = document.getElementById("record-count");

    tableBody.innerHTML = "";

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
            <td>
                <button onclick="editRow(this, ${index})">Editar</button>
                <button onclick="deleteRow(${index})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    recordCount.textContent = data.length;
}

// Llenar los filtros
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
        select.innerHTML = '<option value="">Todos</option>';

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

// Filtrar la tabla
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
