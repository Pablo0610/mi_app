// Función para mostrar las subopciones basadas en la opción seleccionada
function mostrarSubopciones(opcion) {
    $.post('/get_subopciones', JSON.stringify({ opcion: opcion }), function (data) {
        let subopcionesHtml = '<h2>Elige una subopción:</h2>';
        data.subopciones.forEach(function (subopcion) {
            subopcionesHtml += `<button class="option-btn" onclick="mostrarFormulario('${opcion}', '${subopcion}')">${subopcion}</button><br>`;
        });
        $('#subopciones').html(subopcionesHtml);
    }, "json");
}

// Función para mostrar el formulario según la subopción seleccionada
function mostrarFormulario(opcion, subopcion) {
    let formularioHtml = '';

    if (opcion === 'programacion_lineal') {
        formularioHtml = `
            <h2>Introduzca los datos para Programación Lineal:</h2>
            <label>Número de variables:</label>
            <input type="number" id="num_variables" required><br><br>

            <label>Tipo de optimización (max/min):</label>
            <input type="text" id="tipo_optimizacion" required><br><br>

            <label>Coeficientes de la función objetivo (separados por espacios):</label>
            <input type="text" id="coef_objetivo" required><br><br>

            <label>Restricciones (separadas por "|", y coeficientes separados por espacios):</label>
            <textarea id="matriz_restricciones" rows="5" cols="40" required></textarea><br><br>

            <label>Signos de las restricciones (separados por espacios):</label>
            <input type="text" id="signos" required><br><br>

            <label>Valores del lado derecho de las restricciones (separados por espacios):</label>
            <input type="text" id="valores_b" required><br><br>
        `;
    }
    else if (opcion === 'transporte') {
        formularioHtml = `
            <h2>Introduzca los datos para el Método de Transporte:</h2>
            <label>Número de fuentes:</label>
            <input type="number" id="num_fuentes" required><br><br>

            <label>Número de destinos:</label>
            <input type="number" id="num_destinos" required><br><br>

            <label>Oferta de cada fuente (separados por espacios):</label>
            <input type="text" id="oferta" required><br><br>

            <label>Demanda de cada destino (separados por espacios):</label>
            <input type="text" id="demanda" required><br><br>

            <label>Matriz de costos (separados por "|", y valores separados por espacios):</label>
            <textarea id="matriz_costos" rows="5" cols="40" required></textarea><br><br>
        `;
    }
    else if (opcion === 'redes') {
        formularioHtml = `
            <h2>Introduzca los datos para el Método de Redes:</h2>
            <label>Número de nodos:</label>
            <input type="number" id="num_nodos" required><br><br>

            <label>Lista de conexiones (formato: nodo1 nodo2 peso | nodo3 nodo4 peso ...):</label>
            <textarea id="lista_conexiones" rows="5" cols="40" required></textarea><br><br>

            <label>Nodo de inicio:</label>
            <input type="number" id="nodo_inicio" required><br><br>

            <label>Nodo de destino:</label>
            <input type="number" id="nodo_destino" required><br><br>
        `;
    }
    
    formularioHtml += `
        <button id="btn-ejecutar">Ejecutar</button>
        <div id="resultado" style="margin-top: 20px;"></div>
    `;

    $('#formulario').html(formularioHtml);

    $('#btn-ejecutar').on('click', function () {
        ejecutar(opcion, subopcion);
    });
}

// Función para enviar los datos al servidor y ejecutar la operación
function ejecutar(opcion, subopcion) {
    let datos = {
        opcion: opcion,
        subopcion: subopcion
    };

    if (opcion === 'programacion_lineal') {
        datos.num_variables = $('#num_variables').val();
        datos.tipo_optimizacion = $('#tipo_optimizacion').val();
        datos.coef_objetivo = $('#coef_objetivo').val();
        datos.matriz_restricciones = $('#matriz_restricciones').val();
        datos.signos = $('#signos').val();
        datos.valores_b = $('#valores_b').val();
    } 
    else if (opcion === 'transporte') {
        datos.num_fuentes = $('#num_fuentes').val();
        datos.num_destinos = $('#num_destinos').val();
        datos.oferta = $('#oferta').val();
        datos.demanda = $('#demanda').val();
        datos.matriz_costos = $('#matriz_costos').val();
    }
    else if (opcion === 'redes') {
        datos.num_nodos = $('#num_nodos').val();
        datos.lista_conexiones = $('#lista_conexiones').val();
        datos.nodo_inicio = $('#nodo_inicio').val();
        datos.nodo_destino = $('#nodo_destino').val();
    }

    $.ajax({
        url: '/programacionlineal',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(datos),
        success: function (data) {
            let resultadoHtml = '<h2>Resultados:</h2>';

            if (opcion === 'programacion_lineal') {
                resultadoHtml += '<table border="1"><tr><th>Variable</th><th>Valor</th></tr>';
                if (data.resultado.Variable) {
                    data.resultado.Variable.forEach((variable, index) => {
                        resultadoHtml += `<tr><td>${variable}</td><td>${data.resultado.Valor[index]}</td></tr>`;
                    });
                } else {
                    resultadoHtml += '<tr><td colspan="2">No se encontraron resultados</td></tr>';
                }
                resultadoHtml += '</table>';
                resultadoHtml += `<h3>Valor óptimo de Z: ${data.resultado["Valor óptimo"] || "No disponible"}</h3>`;
            } 
            else if (opcion === 'transporte') {
                resultadoHtml += `<p>Resultado del método de transporte: ${data.resultado}</p>`;
            }
            else if (opcion === 'redes') {
                resultadoHtml += `<p>Resultado del método de redes (${subopcion}): ${data.resultado}</p>`;
            }

            $('#resultado').html(resultadoHtml);
        },
        error: function (xhr, status, error) {
            console.error("Error en AJAX:", error);
            $('#resultado').html('<h2>Ocurrió un error en el servidor.</h2><p>' + xhr.responseText + '</p>');
        }
    });
}
