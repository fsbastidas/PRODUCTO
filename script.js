async function loadDatabase(file) {
    try {
        const response = await fetch(`BASES/${file}.json`);
        if (!response.ok) throw new Error(`Error al cargar datos: ${response.status}`);

        const jsonData = await response.json();
        console.log("Datos cargados:", jsonData);

        // Obtener la clave correcta del JSON
        const dataKey = Object.keys(jsonData)[0]; // Extrae la clave correcta
        const data = jsonData[dataKey]; // Obtiene el array de datos

        if (!Array.isArray(data)) {
            throw new Error("El formato de datos no es un array válido");
        }

        displayData(data);
    } catch (error) {
        console.error("No se pudieron cargar los datos:", error);
    }
}

// Función para mostrar los datos en la tabla
function displayData(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Limpiar antes de mostrar nuevos datos

    data.forEach((item, index) => {
        const row = `<tr>
            <td>${item["Modelo"] || "N/A"}</td>
            <td>${item["Cliente"] || "N/A"}</td>
            <td>${item["Territorio"] || "N/A"}</td>
            <td>${item["Dirección"] || "N/A"}</td>
            <td>${item["Ciudad"] || "N/A"}</td>
            <td>${item["Fecha de Venta"] || "N/A"}</td>
            <td>${item["Fecha de Instalación"] || "N/A"}</td>
            <td><button onclick="deleteRow(${index})">Eliminar</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Función para eliminar una fila de la tabla
function deleteRow(index) {
    const tableBody = document.getElementById("table-body");
    tableBody.deleteRow(index);
}

