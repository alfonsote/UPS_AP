// Función para agregar dos menús desplegables debajo de cada <td> con id "area1"
function agregarDropdownsParaEtiquetas() {
    const tdsArea1 = document.querySelectorAll('td[id="area1"]');
    if (tdsArea1.length === 0) {
        console.error('No se encontraron elementos <td> con id "area1".');
        return;
    }

    tdsArea1.forEach((td, index) => {
        const dropdownContainer = document.createElement('div');

        // Crear dropdown con una opción por defecto en blanco y opciones 1, 2 y 3
        const dropdown1 = crearDropdown(['', 1, 2, 3], index, 'td-dropdown1-');
        dropdownContainer.appendChild(dropdown1);

        // Crear dropdown con una opción por defecto en blanco y las opciones dadas
        const opciones = ['', 'Sobre', 'Cajita', 'Caja', 'Cajon', 'Ropa'];
        const dropdown2 = crearDropdown(opciones, index, 'td-dropdown2-');
        dropdownContainer.appendChild(dropdown2);

        td.appendChild(dropdownContainer);
    });
}

function crearDropdown(opciones, index, baseDataIndex) {
    const dropdown = document.createElement('select');
    opciones.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        dropdown.appendChild(option);
    });

    // Asignamos un identificador único al dropdown usando un atributo data-
    const dataIndex = `${baseDataIndex}${index}`;
    dropdown.setAttribute('data-td-index', dataIndex);

    // Si hay un valor guardado en localStorage para este dropdown, lo establecemos
    const cachedValue = localStorage.getItem(dataIndex);
    if (cachedValue) {
        dropdown.value = cachedValue;
    }

    // Guardamos el valor en localStorage cuando el dropdown cambia de valor
    dropdown.addEventListener('change', function() {
        const value = dropdown.value;
        localStorage.setItem(dataIndex, value);
    });

    return dropdown;
}

// Función para agregar los botones en la parte superior central de la página
function agregarBotonesControl() {
    const controlContainer = document.createElement('div');
    controlContainer.style.position = 'fixed';
    controlContainer.style.top = '10px';
    controlContainer.style.left = '50%';
    controlContainer.style.transform = 'translateX(-50%)';
    controlContainer.style.zIndex = '1000';
    controlContainer.style.background = 'white';
    controlContainer.style.padding = '10px';
    controlContainer.style.border = '1px solid black';

    // Botón para descargar la caché
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Descargar cache';
    downloadButton.onclick = function() {
        const data = JSON.stringify(localStorage);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cache.json';
        a.click();
        URL.revokeObjectURL(url);
    };
    controlContainer.appendChild(downloadButton);

    // Botón para cargar la caché
    const loadButton = document.createElement('button');
    loadButton.textContent = 'Cargar cache';
    loadButton.onclick = function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = function(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = JSON.parse(e.target.result);
                for (const key in data) {
                    localStorage.setItem(key, data[key]);
                }
                location.reload(); // Recargamos la página para reflejar los cambios
            };
            reader.readAsText(file);
        };
        input.click();
    };
    controlContainer.appendChild(loadButton);

    // Botón para limpiar la caché
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Limpiar cache';
    clearButton.onclick = function() {
        localStorage.clear();
        location.reload(); // Recargamos la página para reflejar los cambios
    };
    controlContainer.appendChild(clearButton);

    document.body.appendChild(controlContainer);
}

// Ejecuta las funciones para agregar los menús desplegables y los botones
agregarDropdownsParaEtiquetas();
agregarBotonesControl();
