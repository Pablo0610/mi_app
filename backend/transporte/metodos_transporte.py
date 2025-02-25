def metodo_transporte(subopcion):
    if subopcion == 'Algoritmo de Dijkstra':
        return 'Algoritmo de Dijkstra'
    elif subopcion == 'Algoritmo de Floyd-Warshall':
        return 'Algoritmo de Floyd-Warshall'
    elif subopcion == 'Algoritmo A*':
        return 'Algoritmo A*'
    return 'No se encontro la subopcion'