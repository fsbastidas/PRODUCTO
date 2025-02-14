let fullData = []; // Almacenará todos los datos cargados

async function loadDatabase(file) {
    try {
        const response = await fetch(`BASES/${file}.json`);
        if (!response.ok) throw new Error(`Error al cargar datos: ${response.status}`);

        const jsonData = await response.json();
        console.log("Datos cargados:", jsonData);

        const dataKey = Object.keys(jsonData)[0]; // Clave principal del JSON
        const data = jsonData[dataKey];

        if (!Array.isArray(data)) {
            throw new Error("El formato de datos no es un array válido");
        }

        fullData = data; // Guardar datos originales para filtros
        displayData(data);
        updateCustomerCount(data); // Llamar a la función después de cargar los datos
    } catch (error) {
        console.error("No se pudieron cargar los datos:", error);
    }
}

function displayData(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";
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

    updateCustomerCount(data); // Llamar al contador cada vez que se actualiza la tabla
}

function deleteRow(index) {
    fullData.splice(index, 1);
    displayData(fullData);
}

function updateCustomerCount(data) {
    const uniqueCustomers = new Set(data.map(item => item["Customer Name"]?.trim() || "N/A"));
    document.getElementById("total-clients").textContent = uniqueCustomers.size;
}

function filterData() {
    const modelFilter = document.getElementById("filter-model").value.toLowerCase();
    const customerFilter = document.getElementById("filter-customer").value.toLowerCase();
    const cityFilter = document.getElementById("filter-city").value.toLowerCase();

    const filteredData = fullData.filter(item =>
        (item["Model"] || "").toLowerCase().includes(modelFilter) &&
        (item["Customer Name"] || "").toLowerCase().includes(customerFilter) &&
        (item["City"] || "").toLowerCase().includes(cityFilter)
    );

    displayData(filteredData);
}

