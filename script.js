async function loadDatabase(file) {
    try {
        const response = await fetch(`BASES/${file}.json`);
        if (!response.ok) throw new Error(`Error al cargar datos: ${response.status}`);

        const jsonData = await response.json();
        console.log("Datos cargados:", jsonData);

        // Obtener la clave del JSON
        const dataKey = Object.keys(jsonData)[0];
        const data = jsonData[dataKey];

        if (!Array.isArray(data)) {
            throw new Error("El formato de datos no es un array válido");
        }

        console.log(`Cantidad de registros en ${file}:`, data.length);
        displayData(data);
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
            <td>${item["Territoy"] || "N/A"}</td>
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
    const tableBody = document.getElementById("table-body");
    tableBody.deleteRow(index);

    // Actualizar la cantidad de registros después de eliminar
    const recordCount = document.getElementById("record-count");
    recordCount.textContent = tableBody.rows.length;
}
