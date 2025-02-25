from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from programacion_lineal.metodos_programacion_lineal import resolver_gran_m_pl
from transporte.metodos_transporte import metodo_transporte
from redes.metodos_redes import metodo_redes
from pulp import LpMaximize, LpMinimize

app = Flask(__name__, template_folder="../frontend/templates")

CORS(app)

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/get_subopciones', methods=['POST'])
def get_subopciones():
    """ Devuelve las subopciones disponibles según la opción seleccionada en el frontend. """
    data = request.get_json()
    print("📥 Datos recibidos en /get_subopciones:", data)  # Depuración

    if not data or 'opcion' not in data:
        return jsonify({"error": "No se recibió la opción"}), 400

    opcion = data.get('opcion')

    opciones = {
        'programacion_lineal': ['Metodo Gran M', 'Metodo 2 Fases', 'Metodo Simplex'],
        'transporte': ['Metodo de Costo Minimo', 'Metodo de Transporte North-West', 'Metodo de Transporte de Vogel'],
        'redes': ['Algoritmo de Dijkstra', 'Algoritmo de Floyd-Warshall', 'Algoritmo A*']
    }

    return jsonify(subopciones=opciones.get(opcion, []))


@app.route('/programacionlineal', methods=['POST'])
def programacionlineal():
    """ Procesa la solicitud para resolver problemas de Programación Lineal, Transporte y Redes. """
    try:
        data = request.get_json()
        print("📥 Datos recibidos en /programacionlineal:", data)  # Depuración

        if not data:
            return jsonify({"error": "No se recibieron datos"}), 400

        opcion = data.get('opcion')
        subopcion = data.get('subopcion')

        if opcion == 'programacion_lineal':
            try:
                num_variables = int(data.get('num_variables', 0))
                sentido = LpMaximize if data.get('tipo_optimizacion') == "max" else LpMinimize
                coef_objetivo = list(map(float, data.get('coef_objetivo', "").split()))
                matriz_restricciones = [list(map(float, row.split())) for row in data.get('matriz_restricciones', "").split('|')]
                signos = data.get('signos', "").split()
                valores_b = list(map(float, data.get('valores_b', "").split()))

                if subopcion == 'Metodo Gran M':
                    resultado = resolver_gran_m_pl(num_variables, sentido, coef_objetivo, matriz_restricciones, signos, valores_b)
                else:
                    return jsonify({"error": "Método de Programación Lineal no soportado"}), 400
            except Exception as e:
                print("❌ Error en datos de programación lineal:", str(e))  # Depuración
                return jsonify({"error": "Error en los datos de entrada: " + str(e)}), 400

        elif opcion == 'transporte':
            resultado = metodo_transporte(subopcion)

        elif opcion == 'redes':
            resultado = metodo_redes(subopcion)

        else:
            return jsonify({"error": "Opción no válida"}), 400

        print("✅ Resultado enviado:", resultado)  # Depuración
        return jsonify({"resultado": resultado})

    except Exception as e:
        print("❌ Error en el servidor:", str(e))  # Depuración
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
