async function loadDatabase(file) {
    try {
        const response = await fetch(`BASES/${file}`); // Cargar JSON desde la carpeta BASES
        if (!response.ok) throw new Error(`Error al cargar datos: ${response.status}`);
        
        const jsonData = await response.json(); // Convertir respuesta a JSON
        console.log("Datos cargados:", jsonData);

        // Asegurar que accedemos al array correcto dentro del JSON
        const dataKey = Object.keys(jsonData)[0]; // Obtener la primera clave del objeto
        const data = jsonData[dataKey]; // Extraer el array de datos
        
        displayData(data);
    } catch (error) {
        console.error("No se pudieron cargar los datos:", error);
    }
}

function displayData(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Limpiar la tabla antes de agregar datos

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

function deleteRow(index) {
    const tableBody = document.getElementById("table-body");
    tableBody.deleteRow(index);
}

