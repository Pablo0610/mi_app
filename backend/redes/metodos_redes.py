def metodo_redes(subopcion):
    if subopcion == 'Algoritmo de Dijkstra':
        return 'Ejecutando Algoritmo de Dijkstra...'
    elif subopcion == 'Algoritmo de Floyd-Warshall':
        return 'Ejecutando Algoritmo de Floyd-Warshall...'
    elif subopcion == 'Algoritmo A*':
        return 'Ejecutando Algoritmo A*...'
    return 'No se encontró la subopción'
