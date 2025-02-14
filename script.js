let currentData = []; // Guardar datos cargados

async function loadDatabase(file) {
    try {
        const response = await fetch(`BASES/${file}.json`);
        if (!response.ok) throw new Error(`Error al cargar datos: ${response.status}`);

        const jsonData = await response.json();
        console.log("Datos cargados:", jsonData);

        // Obtener la clave del JSON
        const dataKey = Object.keys(jsonData)[0];
        currentData = jsonData[dataKey]; // Guardar los datos en la variable global

        if (!Array.isArray(currentData)) {
            throw new Error("El formato de datos no es un array válido");
        }

        console.log(`Cantidad de registros en ${file}:`, currentData.length);
        displayData(currentData);
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

    // Actualiza la cantidad de registros en el recuadro
    recordCount.textContent = data.length;

    console.log("Datos mostrados en la tabla:", data.length);
}

// Función para eliminar una fila de la tabla
function deleteRow(index) {
    currentData.splice(index, 1); // Eliminar el elemento del array
    displayData(currentData); // Volver a mostrar los datos
}

// Función para filtrar la tabla
function filterTable() {
    const modelFilter = document.getElementById("filter-model").value.toLowerCase();
    const clientFilter = document.getElementById("filter-client").value.toLowerCase();
    const cityFilter = document.getElementById("filter-city").value.toLowerCase();

    const filteredData = currentData.filter(item => 
        (item["Model"] || "").toLowerCase().includes(modelFilter) &&
        (item["Customer Name"] || "").toLowerCase().includes(clientFilter) &&
        (item["City"] || "").toLowerCase().includes(cityFilter)
    );

    displayData(filteredData);
}
