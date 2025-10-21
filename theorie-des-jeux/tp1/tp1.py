jeu = [
    [(2, 1), (0, 0)],
    [(3, 2), (1, 1)]
]



def strategie_dominante_joueur1(jeu):
    nb_strategies = len(jeu)
    nb_colonnes = len(jeu[0])
    for i in range(nb_strategies):
        dominante = True
        for j in range(nb_strategies):
            if i == j:
                continue
            # Vérifie si la stratégie i est meilleure ou égale à j dans toutes les colonnes
            for c in range(nb_colonnes):
                if jeu[i][c][0] < jeu[j][c][0]:
                    dominante = False
                    break
            if not dominante:
                break
        if dominante:
            return i
    return None




def strategie_dominante_joueur2(jeu):
    nb_strategies = len(jeu[0])
    nb_lignes = len(jeu)
    for j in range(nb_strategies):
        dominante = True
        for k in range(nb_strategies):
            if j == k:
                continue
            for l in range(nb_lignes):
                # pour joueur 2, on compare les deuxièmes valeurs (gain_joueur2)
                if jeu[l][j][1] < jeu[l][k][1]:
                    dominante = False
                    break
            if not dominante:
                break
        if dominante:
            return j
    return None




def main():
    jeu = [
        [(2, 1), (0, 0)],
        [(3, 2), (1, 1)]
    ]
    
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

if __name__ == "__main__":
    main()
