async function loadDatabase(file) {
    try {
        const response = await fetch(`BASES/${file}`);
        if (!response.ok) throw new Error(`Error al cargar datos: ${response.status}`);

        const jsonData = await response.json();
        console.log("Datos cargados:", jsonData);

        // Obtener la clave del JSON (LED o XENON)
        const dataKey = Object.keys(jsonData)[0];
        const data = jsonData[dataKey];

        if (!Array.isArray(data)) {
            throw new Error("El formato de datos no es un array válido");
        }

        displayData(data);
    } catch (error) {
        console.error("No se pudieron cargar los datos:", error);
    }
}

function displayData(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    let uniqueClients = new Set(); // Conjunto para contar clientes únicos

    data.forEach((item, index) => {
        uniqueClients.add(item["Customer Name"]); // Agregar cliente al conjunto

        const row = `<tr>
            <td contenteditable="false">${item.Model || "N/A"}</td>
            <td contenteditable="false">${item["Customer Name"] || "N/A"}</td>
            <td contenteditable="false">${item.Territory || "N/A"}</td>
            <td contenteditable="false">${item.Address1 || "N/A"}</td>
            <td contenteditable="false">${item.City || "N/A"}</td>
            <td contenteditable="false">${item["Date Sold"] || "N/A"}</td>
            <td contenteditable="false">${item["Date Installed"] || "N/A"}</td>
            <td>
                <button onclick="editRow(this)">✏️ Editar</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });

    document.getElementById("client-count").textContent = uniqueClients.size; // Actualizar contador
}

function editRow(button) {
    let row = button.closest("tr");
    let cells = row.querySelectorAll("td[contenteditable]");

    if (button.textContent === "✏️ Editar") {
        cells.forEach(cell => cell.contentEditable = true);
        button.textContent = "💾 Guardar";
    } else {
        cells.forEach(cell => cell.contentEditable = false);
        button.textContent = "✏️ Editar";
        saveChanges(row);
    }
}

function saveChanges(row) {
    let updatedData = {
        Model: row.cells[0].textContent,
        "Customer Name": row.cells[1].textContent,
        Territory: row.cells[2].textContent,
        Address1: row.cells[3].textContent,
        City: row.cells[4].textContent,
        "Date Sold": row.cells[5].textContent,
        "Date Installed": row.cells[6].textContent
    };

    console.log("Datos actualizados:", updatedData);
    alert("Cambios guardados correctamente.");
}

function filterTable() {
    const modelFilter = document.getElementById("filter-model").value.toLowerCase();
    const clientFilter = document.getElementById("filter-client").value.toLowerCase();
    const cityFilter = document.getElementById("filter-city").value.toLowerCase();
    
    const rows = document.querySelectorAll("#table-body tr");
    rows.forEach(row => {
        const model = row.cells[0].textContent.toLowerCase();
        const client = row.cells[1].textContent.toLowerCase();
        const city = row.cells[4].textContent.toLowerCase();
        
        row.style.display = 
            (model.includes(modelFilter) && client.includes(clientFilter) && city.includes(cityFilter)) 
            ? "" : "none";
    });
}
