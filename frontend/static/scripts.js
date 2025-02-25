// Función para mostrar las subopciones basadas en la opción seleccionada
function mostrarSubopciones(opcion) {
    $.post('/get_subopciones', { opcion: opcion }, function (data) {
        let subopcionesHtml = '<h2>Elige una subopción:</h2>';
        data.subopciones.forEach(function (subopcion) {
            subopcionesHtml += `<button class="option-btn" onclick="mostrarFormulario('${opcion}', '${subopcion}')">${subopcion}</button><br>`;
        });
        $('#subopciones').html(subopcionesHtml);
    });
}

// Función para mostrar el formulario según la subopción seleccionada
function mostrarFormulario(opcion, subopcion) {
    if (opcion === 'programacion_lineal') {
        let formularioHtml = `
            <h2>Introduzca los datos para la programación lineal:</h2>
            <label>Número de variables:</label><br>
            <input type="number" id="num_variables" required><br><br>

            <label>Número de restricciones:</label><br>
            <input type="number" id="num_restricciones" required><br><br>

            <label>Tipo de optimización (max/min):</label><br>
            <input type="text" id="tipo_optimizacion" required><br><br>

            <label>Coeficientes de la función objetivo (separados por espacios):</label><br>
            <input type="text" id="coef_objetivo" required><br><br>

            <label>Restricciones (separadas por "|", y coeficientes separados por espacios):</label><br>
            <textarea id="matriz_restricciones" rows="5" cols="40" required></textarea><br><br>

            <label>Signos de las restricciones (separados por espacios):</label><br>
            <input type="text" id="signos" required><br><br>

            <label>Valores del lado derecho de las restricciones (separados por espacios):</label><br>
            <input type="text" id="valores_b" required><br><br>

            <button id="btn-ejecutar">Ejecutar</button>
        `;
        $('#formulario').html(formularioHtml);

        // Asignar el evento al botón 'Ejecutar'
        $('#btn-ejecutar').on('click', function() {
            ejecutar(opcion, subopcion);  // Pasar las variables correctamente
        });
    } else {
        // Aquí podrías manejar otras opciones para 'transporte' o 'redes'
    }
}


// Función para enviar los datos al servidor y ejecutar la operación
function ejecutar(opcion, subopcion) {
    const datos = {
        opcion: opcion,
        subopcion: subopcion,
        num_variables: $('#num_variables').val(),
        tipo_optimizacion: $('#tipo_optimizacion').val(),
        coef_objetivo: $('#coef_objetivo').val(),
        matriz_restricciones: $('#matriz_restricciones').val(), // Separados por "|"
        signos: $('#signos').val(),
        valores_b: $('#valores_b').val(),
    };

    $.post('/programacionlineal', datos, function (data) {
        alert('Resultado: ' + JSON.stringify(data.resultado, null, 2));
    });
}
