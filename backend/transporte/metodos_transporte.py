def metodo_transporte(subopcion):
    if subopcion == 'Metodo de costo minimo':
        return 'Ejecutando Método de Costo Mínimo...'
    elif subopcion == 'Metodo de transporte de North-West':
        return 'Ejecutando Método de Transporte de North-West...'
    elif subopcion == 'Metodo de transporte de Vogel':
        return 'Ejecutando Método de Transporte de Vogel...'
    return 'No se encontró la subopción'
