# --- Jeu : matrice des gains ---
jeu = [
    [(2, 1), (0, 0)],  # Stratégie A1 du joueur 1
    [(3, 2), (1, 1)]   # Stratégie A2 du joueur 1
]

# --- Vérifier une stratégie dominante pour le joueur 1 ---
def strategie_dominante_joueur1(jeu):
    for i in range(len(jeu)):  # Parcourt les stratégies de joueur 1
        dominante = True
        for j in range(len(jeu)):  # Compare avec les autres stratégies
            if i == j:
                continue
            for c in range(len(jeu[0])):  # Pour chaque stratégie de joueur 2
                if jeu[i][c][0] < jeu[j][c][0]:
                    dominante = False
                    break
            if not dominante:
                break
        if dominante:
            return i  # Retourne le numéro de la stratégie dominante
    return None

# --- Vérifier une stratégie dominante pour le joueur 2 ---
def strategie_dominante_joueur2(jeu):
    for j in range(len(jeu[0])):  # Parcourt les stratégies du joueur 2
        dominante = True
        for k in range(len(jeu[0])):  # Compare avec les autres stratégies
            if j == k:
                continue
            for l in range(len(jeu)):  # Pour chaque stratégie du joueur 1
                if jeu[l][j][1] < jeu[l][k][1]:
                    dominante = False
                    break
            if not dominante:
                break
        if dominante:
            return j
    return None

# --- Programme principal ---
s1 = strategie_dominante_joueur1(jeu)
s2 = strategie_dominante_joueur2(jeu)

if s1 is not None:
    print(f"Le joueur 1 a une stratégie dominante : A{s1 + 1}")
else:
    print("Le joueur 1 n’a pas de stratégie dominante.")

if s2 is not None:
    print(f"Le joueur 2 a une stratégie dominante : B{s2 + 1}")
else:
    print("Le joueur 2 n’a pas de stratégie dominante.")
