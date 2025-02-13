async function loadDatabase(fileName) {
    const loadingMessage = document.getElementById("loadingMessage");
    loadingMessage.style.display = "block";  // Muestra mensaje de carga
    
    try {
        const response = await fetch(`BASES/${fileName}`);
        if (!response.ok) throw new Error(`Error al cargar datos: ${response.status}`);
        
        const textData = await response.text();
        const jsonData = parseTextToJson(textData);
        
        console.log("Datos cargados:", jsonData);
        displayData(jsonData);
    } catch (error) {
        console.error("No se pudieron cargar los datos:", error);
        alert("Error cargando la base de datos. Verifica los archivos en GitHub.");
    } finally {
        loadingMessage.style.display = "none"; // Oculta el mensaje de carga
    }
}

function parseTextToJson(text) {
    const lines = text.trim().split("\n");
    const headers = lines[0].split("\t"); // Separa por tabulación
    const jsonData = lines.slice(1).map(line => {
        const values = line.split("\t");
        let obj = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = values[index] ? values[index].trim() : "N/A";
        });
        return obj;
    });
    return jsonData;
}

function displayData(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    data.forEach((item, index) => {
        const row = `<tr>
            <td>${item.Model || "N/A"}</td>
            <td>${item["Customer Name"] || "N/A"}</td>
            <td>${item.Territory || "N/A"}</td>
            <td>${item.Address1 || "N/A"}</td>
            <td>${item.City || "N/A"}</td>
            <td>${item["Date Sold"] || "N/A"}</td>
            <td>${item["Date Installed"] || "N/A"}</td>
            <td><button onclick="deleteRow(${index})">Eliminar</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function deleteRow(index) {
    const tableBody = document.getElementById("table-body");
    tableBody.deleteRow(index);
}
