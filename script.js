async function loadDatabase(file) {
    try {
        const response = await fetch(`BASES/{file}.json`); // Cargar JSON desde la carpeta BASES
        if (!response.ok) throw new Error(`Error al cargar datos: ${response.status}`);

        const data = await response.json(); // Convertir respuesta a JSON
        console.log("Datos cargados:", data);
        displayData(data);
    } catch (error) {
        console.error("No se pudieron cargar los datos:", error);
    }
}

function displayData(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Limpia la tabla antes de agregar datos

    data.forEach((item, index) => {
        const row = `<tr>
            <td>${item["Modelo"] || "N/A"}</td>
            <td>${item["Cliente"] || "N/A"}</td>
            <td>${item["Territorio"] || "N/A"}</td>
            <td>${item["Dirección"] || "N/A"}</td>
            <td>${item["Ciudad"] || "N/A"}</td>
            <td>${item["Fecha de Venta"] || "N/A"}</td>
            <td>${item["Fecha de Instalación"] || "N/A"}</td>
            <td><button class="delete-btn" onclick="deleteRow(${index})">Eliminar</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function deleteRow(index) {
    const tableBody = document.getElementById("table-body");
    tableBody.deleteRow(index);
}

