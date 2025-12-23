import numpy as np

class LemkeHowsonSolver:
    def __init__(self, payoff_matrix_A, payoff_matrix_B):
        """
        Initialise le solveur avec les matrices de gains des deux joueurs.
        payoff_matrix_A : gains du joueur 1 (lignes)
        payoff_matrix_B : gains du joueur 2 (colonnes)
        """
        self.A = np.array(payoff_matrix_A, dtype=float)
        self.B = np.array(payoff_matrix_B, dtype=float)
        self.m, self.n = self.A.shape  # m = nb stratégies joueur 1, n = nb stratégies joueur 2

        # 1. Rendre les gains strictement positifs
        # Cela évite les divisions par zéro pendant le pivotage
        min_val = min(self.A.min(), self.B.min())
        shift = abs(min_val) + 1 if min_val <= 0 else 0
        self.Ap = self.A + shift
        self.Bp = self.B + shift


    def _build_tableaus(self):
        """
        Construit les tableaux pour le pivotage de Lemke-Howson.
        Chaque tableau inclut :
        - Les variables de stratégie
        - Les variables d'écart (slacks)
        - Une colonne constante pour le calcul des ratios
        """
        # Tableau pour le joueur 2 : [I_m | -Bp.T | 1]
        t1 = np.hstack((np.eye(self.m), -self.Bp.T, np.ones((self.m, 1))))
        # Tableau pour le joueur 1 : [-Ap | I_n | 1]
        t2 = np.hstack((-self.Ap, np.eye(self.n), np.ones((self.n, 1))))
        return t1, t2

    def _get_complement(self, index):
        """
        Renvoie le label complémentaire d'une variable.
        Les labels sont utilisés pour suivre quelles stratégies doivent entrer/sortir.
        """
        return index + self.n if index < self.m else index - self.n

    def solve(self, start_label=0):
        """
        Exécute l'algorithme à partir d'un label initial.
        start_label : index du label initial (0 à m+n-1)
        """
        t1, t2 = self._build_tableaus()  # construction des tableaux

        # Initialisation de la base avec les variables d'écart (slacks)
        basis = list(range(self.m, self.m + self.n)) + list(range(self.m))

        entering = start_label  # label initial à libérer

        while True:
            # Choix du tableau et de l'offset selon le label entrant
            if entering < self.m:
                tableau, offset = t1, self.n  # tableau du joueur 2
            else:
                tableau, offset = t2, 0        # tableau du joueur 1

            # Calcul du ratio minimum pour déterminer la ligne pivot
            col_idx = entering
            ratios = []
            for i in range(tableau.shape[0]):
                val = tableau[i, col_idx]
                # Si val > 0, ratio = constante / val, sinon inf
                ratios.append(tableau[i, -1] / val if val > 1e-12 else np.inf)

            pivot_row = np.argmin(ratios)  # ligne de pivot
            if ratios[pivot_row] == np.inf:
                raise ValueError("Le jeu est probablement dégénéré.")

            leaving = basis[offset + pivot_row]  # variable qui sort de la base

            # Pivotage de Gauss-Jordan : rendre la colonne pivot en unité
            pivot_val = tableau[pivot_row, col_idx]
            tableau[pivot_row] /= pivot_val
            for r in range(tableau.shape[0]):
                if r != pivot_row:
                    tableau[r] -= tableau[r, col_idx] * tableau[pivot_row]

            # Mise à jour de la base
            basis[offset + pivot_row] = entering

            # Condition d'arrêt : le label initial est revenu dans la base
            if leaving == start_label:
                break

            # Prochain label à entrer : complémentaire de la variable sortante
            entering = self._get_complement(leaving)

        # Extraction des stratégies finales à partir de la base
        return self._extract_strategies(t1, t2, basis)

    def _extract_strategies(self, t1, t2, basis):
        """
        Récupère les probabilités des stratégies pour chaque joueur
        et les normalise pour que la somme = 1.
        """
        p1, p2 = np.zeros(self.m), np.zeros(self.n)

        # Joueur 1 : les colonnes 0..m-1 de t2
        for i, var in enumerate(basis[:self.n]):
            if var < self.m:
                p1[var] = t2[i, -1]

        # Joueur 2 : les colonnes 0..n-1 de t1
        for i, var in enumerate(basis[self.n:]):
            if var >= self.m:
                p2[var - self.m] = t1[i, -1]

        # Normalisation pour que la somme des probabilités soit 1
        if p1.sum() > 0: p1 /= p1.sum()
        if p2.sum() > 0: p2 /= p2.sum()

        return p1, p2


# --- Test du code ---
if __name__ == "__main__":
    # Exemple de matrices de gains 3x3
    A = [[10, 4, 6],
         [3, 4, 4],
         [1, 0, 1]]
    B = [[10, 12, 11],
         [3, 1, 2],
         [1, 3, 0]]

    solver = LemkeHowsonSolver(A, B)
    p1, p2 = solver.solve(start_label=0)

    print("Équilibre de Nash trouvé :")
    print(f"Joueur Ligne   : {p1}")
    print(f"Joueur Colonne : {p2}")
