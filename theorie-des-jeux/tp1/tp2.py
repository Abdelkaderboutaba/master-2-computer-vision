jeu = [
    [(3, 1), (2, 2), (1, 3)],  # Stratégie A1
    [(1, 1), (3, 0), (2, 2)],  # Stratégie A2
    [(4, 1), (2, 3), (1, 4)]   # Stratégie A3
]


# --- Fonction pour trouver les stratégies dominées du joueur 1 ---
def strategie_dominee_joueur1(jeu):
    dominees = []  # liste des stratégies dominées
    # On parcourt toutes les stratégies du joueur 1
    for i in range(len(jeu)):
        for j in range(len(jeu)):
            if i == j:
                continue  # on ne compare pas une stratégie avec elle-même
            dominee = True  # on suppose au début qu'elle est dominée
            # On parcourt les colonnes (stratégies du joueur 2)
            for c in range(len(jeu[0])):
                # si la stratégie i donne un gain >= à la stratégie j, elle n’est pas dominée
                if jeu[i][c][0] >= jeu[j][c][0]:
                    dominee = False
                    break
            # si la stratégie i est dominée par j, on la note et on arrête
            if dominee:
                dominees.append(i)
                break
    return dominees


# --- Fonction pour trouver les stratégies dominées du joueur 2 ---
def strategie_dominee_joueur2(jeu):
    dominees = []  # liste des stratégies dominées
    # On parcourt toutes les stratégies du joueur 2 (les colonnes)
    for j in range(len(jeu[0])):
        for k in range(len(jeu[0])):
            if j == k:
                continue
            dominee = True  # on suppose que j est dominée par k
            # On parcourt les lignes (stratégies du joueur 1)
            for l in range(len(jeu)):
                # si la colonne j donne un gain >= à la colonne k, elle n’est pas dominée
                if jeu[l][j][1] >= jeu[l][k][1]:
                    dominee = False
                    break
            # si la stratégie j est dominée par k, on la note et on arrête
            if dominee:
                dominees.append(j)
                break
    return dominees


# --- Fonction principale : élimine les stratégies dominées des deux joueurs ---
def eliminer_strategies_dominees(jeu):
    # 1️⃣ Éliminer les lignes dominées (joueur 1)
    dom1 = strategie_dominee_joueur1(jeu)
    # On crée une nouvelle matrice sans les lignes dominées
    jeu_sans_dom1 = [ligne for i, ligne in enumerate(jeu) if i not in dom1]
    
    # 2️⃣ Éliminer les colonnes dominées (joueur 2)
    dom2 = strategie_dominee_joueur2(jeu_sans_dom1)
    jeu_sans_dom2 = []
    # Pour chaque ligne restante, on enlève les colonnes dominées
    for ligne in jeu_sans_dom1:
        nouvelle_ligne = [val for j, val in enumerate(ligne) if j not in dom2]
        jeu_sans_dom2.append(nouvelle_ligne)
    
    # On retourne le jeu réduit et les stratégies éliminées
    return jeu_sans_dom2, dom1, dom2


# --- Programme principal ---
nouveau_jeu, dom1, dom2 = eliminer_strategies_dominees(jeu)

# --- Affichage des résultats ---
print("Stratégies dominées du joueur 1 :", ["A" + str(i+1) for i in dom1])
print("Stratégies dominées du joueur 2 :", ["B" + str(i+1) for i in dom2])

print("\nMatrice après élimination des stratégies dominées :")
for ligne in nouveau_jeu:
    print(ligne)
