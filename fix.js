// Función para agregar dos menús desplegables debajo de cada <td> con id "area1"
function asignarIDSegundoTD() {
  const tabla = document.querySelector('#inventory');
  if (!tabla) {
    console.error('No se encontró la tabla con id "inventory".');
    return;
  }
  const filas = tabla.querySelectorAll('tr');
  filas.forEach((fila) => {
    const celdas = fila.querySelectorAll('td');
    if (celdas.length > 1) {
      celdas[1].id = "tracking";
    }
  });
}
asignarIDSegundoTD();

function crearDropdown(opciones, claveCombinada, baseDataIndex) {
    const dropdown = document.createElement('select');
    opciones.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        dropdown.appendChild(option);
    });
    const dataIndex = `${baseDataIndex}${claveCombinada}`;
    dropdown.setAttribute('data-td-index', dataIndex);

    const cachedValue = localStorage.getItem(dataIndex);
    if (cachedValue) {
        dropdown.value = cachedValue;
    }

    dropdown.addEventListener('change', function() {
        const value = dropdown.value;
        localStorage.setItem(dataIndex, value);
    });

    return dropdown;
}
function agregarDropdownsParaEtiquetas() {
    const tdsArea1 = document.querySelectorAll('td[id="area1"]');
    if (tdsArea1.length === 0) {
        console.error('No se encontraron elementos <td> con id "area1".');
        return;
    }
    tdsArea1.forEach((td) => {
        const filaActual = td.parentElement;
        const tdTracking = filaActual.querySelector('td[id="tracking"]');
        
        if (tdTracking) {
            const dropdownContainer = document.createElement('div');
            const claveCombinada = `${td.textContent.trim()}-${tdTracking.textContent.trim()}`;
            const dropdown1 = crearDropdown(['', 1, 2, 3], claveCombinada, 'td-dropdown1-');
            const opciones = ['', 'Sobre', 'Cajita', 'Caja', 'Cajon', 'Ropa'];
            const dropdown2 = crearDropdown(opciones, claveCombinada, 'td-dropdown2-');
            dropdownContainer.appendChild(dropdown1);
            dropdownContainer.appendChild(dropdown2);
            td.appendChild(dropdownContainer);
        }
    });
}
function descargarBackupCache() {
  const data = JSON.stringify(localStorage);
  const blob = new Blob([data], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'backup_cache.json';
  a.click();
  URL.revokeObjectURL(url);
}

function validarDatos() {
  const tdsArea1 = document.querySelectorAll('td[id="area1"]');
  let hayDiferencias = false; // Bandera para verificar si hay registros diferentes

  tdsArea1.forEach((td) => {
    const tdContent = td.textContent.trim();
    const keys = [`td-dropdown1-${tdContent}`, `td-dropdown2-${tdContent}`];
    keys.forEach(key => {
      if (!localStorage.getItem(key)) {
        hayDiferencias = true; // Se encontró un registro diferente
      }
    });
  });

  if (hayDiferencias) {
    descargarBackupCache(); // Descargar backup solo si hay registros diferentes
    tdsArea1.forEach((td) => {
      const tdContent = td.textContent.trim();
      const keys = [`td-dropdown1-${tdContent}`, `td-dropdown2-${tdContent}`];
      keys.forEach(key => {
        if (!localStorage.getItem(key)) {
          localStorage.removeItem(key);
        }
      });
    });
  }
limpiarCache(); 
}
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
    const blob = new Blob([data], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cache.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  controlContainer.appendChild(downloadButton);
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
        validarDatos(); // Validar los datos después de cargar la caché
        location.reload();
      };
      reader.readAsText(file);
    };
    input.click();
  };
  controlContainer.appendChild(loadButton);
  const clearButton = document.createElement('button');
  clearButton.textContent = 'Limpiar cache';
  clearButton.onclick = function() {
    localStorage.clear();
    location.reload(); // Recargamos la página para reflejar los cambios
  };
  controlContainer.appendChild(clearButton);

  document.body.appendChild(controlContainer);
}
agregarDropdownsParaEtiquetas();
agregarBotonesControl();
validarDatos(); // Validar los datos al cargar la página
