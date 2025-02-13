let fullData = []; // Guardar los datos originales para aplicar filtros

async function loadDatabase(file) {
    try {
        const response = await fetch(`BASES/${file}.json`);
        if (!response.ok) throw new Error(`Error al cargar datos: ${response.status}`);

        const jsonData = await response.json();
        console.log("Datos cargados:", jsonData);

        // Tomar la clave del JSON (nombre del objeto principal)
        const dataKey = Object.keys(jsonData)[0];
        const data = jsonData[dataKey];

        if (!Array.isArray(data)) {
            throw new Error("El formato de datos no es un array válido");
        }

        fullData = data; // Guardamos los datos originales para filtros
        displayData(data);
        updateCustomerCount(data);
    } catch (error) {
        console.error("No se pudieron cargar los datos:", error);
    }
}

// Función para mostrar los datos en la tabla
function displayData(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Limpia la tabla

    data.forEach((item, index) => {
        const row = `<tr>
            <td>${item["Model"] || "N/A"}</td>
            <td>${item["Customer Name"] || "N/A"}</td>
            <td>${item["Territory"] || "N/A"}</td>
            <td>${item["Address1"] || "N/A"}</td>
            <td>${item["City"] || "N/A"}</td>
            <td>${item["Date Sold"] || "N/A"}</td>
            <td>${item["Date Installed"] || "N/A"}</td>
            <td><button onclick="deleteRow(${index})">Eliminar</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Función para contar clientes únicos
function updateCustomerCount(data) {
    const uniqueClients = new Set(data.map(item => item["Customer Name"]));
    document.getElementById("customer-count").textContent = uniqueClients.size;
}

// Función para eliminar una fila de la tabla
function deleteRow(index) {
    fullData.splice(index, 1); // Elimina el elemento del array original
    displayData(fullData); // Vuelve a renderizar la tabla
    updateCustomerCount(fullData);
}

// Función para filtrar la tabla en tiempo real
function filterTable() {
    const modelFilter = document.getElementById("search-model").value.toLowerCase();
    const clientFilter = document.getElementById("search-client").value.toLowerCase();
    const cityFilter = document.getElementById("search-city").value.toLowerCase();

    const filteredData = fullData.filter(item => 
        (item["Model"] || "").toLowerCase().includes(modelFilter) &&
        (item["Customer Name"] || "").toLowerCase().includes(clientFilter) &&
        (item["City"] || "").toLowerCase().includes(cityFilter)
    );

    displayData(filteredData);
    updateCustomerCount(filteredData);
}

