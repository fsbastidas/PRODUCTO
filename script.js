let allData = []; // Variable global para almacenar datos

async function loadDatabase(file) {
    try {
        const response = await fetch(`BASES/${file}.json`);
        if (!response.ok) throw new Error(`Error al cargar datos: ${response.status}`);

        const jsonData = await response.json();
        console.log("Datos cargados:", jsonData);

        // Tomamos la primera clave del JSON
        const dataKey = Object.keys(jsonData)[0];
        const data = jsonData[dataKey]; // Extraemos los datos

        if (!Array.isArray(data)) {
            throw new Error("El formato de datos no es un array válido");
        }

        allData = data; // Guardamos los datos globalmente para filtros
        displayData(allData);
    } catch (error) {
        console.error("No se pudieron cargar los datos:", error);
    }
}

function displayData(data) {
    const tableBody = document.getElementById("table-body");
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
            <td><button onclick="deleteRow(${index})">❌ Eliminar</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });

    document.getElementById("total-clients").textContent = data.length; // Actualiza el contador
}

function filterData() {
    const searchValue = document.getElementById("search").value.toLowerCase();
    const filteredData = allData.filter(item => 
        item["Customer Name"].toLowerCase().includes(searchValue) ||
        item["Model"].toLowerCase().includes(searchValue)
    );
    displayData(filteredData);
}

function deleteRow(index) {
    allData.splice(index, 1); // Elimina el elemento del array global
    displayData(allData); // Vuelve a renderizar la tabla
}

