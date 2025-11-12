import numpy as np

# Matrice de gains pour le Joueur 1 et Joueur 2
# Format: (gain_joueur1, gain_joueur2)
matrice = [
    [(3, 3), (0, 5), (5, 0)],
    [(5, 0), (1, 1), (0, 0)],
    [(0, 5), (0, 0), (2, 2)]
]

def extraire_gains(matrice):
    """Extrait les gains des deux joueurs séparément"""
    n = len(matrice)
    gains_j1 = np.array([[matrice[i][j][0] for j in range(n)] for i in range(n)])
    gains_j2 = np.array([[matrice[i][j][1] for j in range(n)] for i in range(n)])
    return gains_j1, gains_j2

def trouver_nash(matrice):
    """Trouve les équilibres de Nash en stratégies pures"""
    gains_j1, gains_j2 = extraire_gains(matrice)
    n = len(matrice)
    equilibres = []
    
    for i in range(n):
        for j in range(n):
            # Vérifier si c'est une meilleure réponse pour J1
            meilleure_reponse_j1 = True
            for k in range(n):
                if gains_j1[k][j] > gains_j1[i][j]:
                    meilleure_reponse_j1 = False
                    break
            
            # Vérifier si c'est une meilleure réponse pour J2
            meilleure_reponse_j2 = True
            for k in range(n):
                if gains_j2[i][k] > gains_j2[i][j]:
                    meilleure_reponse_j2 = False
                    break
            
            # Si les deux conditions sont vraies, c'est un équilibre de Nash
            if meilleure_reponse_j1 and meilleure_reponse_j2:
                equilibres.append((i, j, matrice[i][j]))
    
    return equilibres

def trouver_pareto(matrice):
    """Trouve les solutions Pareto-optimales"""
    n = len(matrice)
    pareto = []
    
    for i in range(n):
        for j in range(n):
            est_pareto = True
            gain_actuel = matrice[i][j]
            
            # Vérifier si une autre solution domine celle-ci
            for k in range(n):
                for l in range(n):
                    if (i, j) == (k, l):
                        continue
                    gain_compare = matrice[k][l]
                    
                    # Domination de Pareto: au moins un joueur gagne plus
                    # et aucun ne perd
                    if (gain_compare[0] >= gain_actuel[0] and 
                        gain_compare[1] >= gain_actuel[1] and
                        (gain_compare[0] > gain_actuel[0] or 
                         gain_compare[1] > gain_actuel[1])):
                        est_pareto = False
                        break
                if not est_pareto:
                    break
            
            if est_pareto:
                pareto.append((i, j, gain_actuel))
    
    return pareto

# Affichage de la matrice
print("=" * 50)
print("MATRICE DE GAINS (Joueur1, Joueur2)")
print("=" * 50)
for i, ligne in enumerate(matrice):
    print(f"Stratégie {i+1} du J1: {ligne}")
print()

# Trouver et afficher les équilibres de Nash
nash = trouver_nash(matrice)
print("=" * 50)
print("ÉQUILIBRES DE NASH")
print("=" * 50)
if nash:
    for idx, (i, j, gains) in enumerate(nash, 1):
        print(f"{idx}. Position ({i+1}, {j+1}): Gains = {gains}")
        print(f"   → J1 joue stratégie {i+1}, J2 joue stratégie {j+1}")
else:
    print("Aucun équilibre de Nash trouvé en stratégies pures")
print()

# Trouver et afficher les optimums de Pareto
pareto = trouver_pareto(matrice)
print("=" * 50)
print("OPTIMUMS DE PARETO")
print("=" * 50)
if pareto:
    for idx, (i, j, gains) in enumerate(pareto, 1):
        est_nash = (i, j, gains) in nash
        symbole = " ★" if est_nash else ""
        print(f"{idx}. Position ({i+1}, {j+1}): Gains = {gains}{symbole}")
        if est_nash:
            print("   → Aussi un équilibre de Nash!")
else:
    print("Aucun optimum de Pareto trouvé")
print()

print("=" * 50)
print("LÉGENDE")
print("=" * 50)
print("★ = Position qui est à la fois Nash et Pareto")
print("Position (i, j) = Joueur 1 choisit ligne i, Joueur 2 choisit colonne j")