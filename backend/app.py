from flask import Flask, render_template, request, jsonify
from programacion_lineal.metodos_programacion_lineal import resolver_gran_m_pl  # Asegúrate de importar correctamente los métodos
from transporte.metodos_transporte import metodo_transporte
from redes.metodos_redes import metodo_redes
from pulp import LpMaximize, LpMinimize
from flask_cors import CORS


app = Flask(__name__, static_folder='../frontend/static', template_folder='../frontend')
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')  # Esto debería servir index.html desde la carpeta frontend

@app.route('/get_subopciones', methods=['POST'])
def get_subopciones():
    opcion = request.form['opcion']
    
    if opcion == 'programacion_lineal':
        return jsonify(subopciones=['Metodo Gran M', 'Metodo 2 Fases', 'Metodo simplex'])
    elif opcion == 'transporte':
        return jsonify(subopciones=['Metodo de costo minimo', 'Metodo de transporte de North-West', 'Metodo de transporte de Vogel'])
    elif opcion == 'redes':
        return jsonify(subopciones=['Algoritmo de Dijkstra', 'Algoritmo de Floyd-Warshall', 'Algoritmo A*'])
    return jsonify(subopciones=[])


@app.route('/programacionlineal', methods=['POST'])
def programacionlineal():
    opcion = request.form['opcion']
    subopcion = request.form['subopcion']

    # Extraemos los datos que nos pasan del frontend
    num_variables = int(request.form['num_variables'])
    sentido = LpMaximize if request.form['tipo_optimizacion'] == "max" else LpMinimize
    coef_objetivo = list(map(float, request.form['coef_objetivo'].split()))
    matriz_restricciones = [list(map(float, row.split())) for row in request.form['matriz_restricciones'].split('|')]
    signos = request.form['signos'].split()
    valores_b = list(map(float, request.form['valores_b'].split()))
    
    if subopcion == 'Metodo Gran M':

        # Llamamos a la función resolver_gran_m_pl con los datos
        resultado = resolver_gran_m_pl(num_variables, sentido, coef_objetivo, matriz_restricciones, signos, valores_b)
    elif opcion == 'transporte':
        resultado = metodo_transporte(subopcion)
    elif opcion == 'redes':
        resultado = metodo_redes(subopcion)
    
    return jsonify(resultado=resultado)

if __name__ == '__main__':
    app.run(debug=True)
