from pulp import LpProblem, LpVariable, lpSum

def resolver_gran_m_pl(num_variables, sentido, coef_objetivo, matriz_restricciones, signos, valores_b):
    problem = LpProblem("Gran_M_Method", sentido)
    variables = [LpVariable(f"x{i+1}", lowBound=0) for i in range(num_variables)]
    M = 1000  # Valor grande para penalización

    problem += lpSum([coef_objetivo[i] * variables[i] for i in range(num_variables)]), "Funcion_Objetivo"

    for i, (coef, signo, b) in enumerate(zip(matriz_restricciones, signos, valores_b)):
        expr = lpSum([coef[j] * variables[j] for j in range(num_variables)])
        if signo == ">=":
            a = LpVariable(f"a{i+1}", lowBound=0)
            problem += expr - a == b, f"Restriccion_{i+1}"
            problem += -M * a, f"Penalizacion_Gran_M_{i+1}"
        elif signo == "=":
            a = LpVariable(f"a{i+1}", lowBound=0)
            problem += expr == b, f"Restriccion_{i+1}"
            problem += -M * a, f"Penalizacion_Gran_M_{i+1}"
        else:
            problem += expr <= b, f"Restriccion_{i+1}"

    problem.solve()
    iteraciones = problem.solutionTime if problem.solutionTime else "No disponible"

    print("Estado:", problem.status)
    resultados = {"Variable": [], "Valor": []}
    for var in problem.variables():
        resultados["Variable"].append(var.name)
        resultados["Valor"].append(var.varValue)
    print(pd.DataFrame(resultados))
    print("Valor óptimo de Z:", problem.objective.value())
    print("Iteraciones hasta la solución óptima:", iteraciones)
    #analisis_sensibilidad_pl(problem, coef_objetivo, matriz_restricciones, valores_b)
    return resultados
