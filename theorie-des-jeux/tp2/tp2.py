import numpy as np

def is_dominated(player_matrix):
    """
    Vérifie si une stratégie (ligne) est strictement dominée par une autre.
    Retourne les indices des lignes NON dominées.
    """
    n = player_matrix.shape[0]
    dominated = set()

    for i in range(n):
        for j in range(n):
            if i != j:
                # Si la stratégie j domine strictement la stratégie i
                if all(player_matrix[j, k] > player_matrix[i, k] for k in range(player_matrix.shape[1])):
                    dominated.add(i)

    return [i for i in range(n) if i not in dominated]


def eliminate_dominated(A, B):
    """
    Élimine itérativement les stratégies dominées pour les deux joueurs.
    A : gains du joueur 1
    B : gains du joueur 2
    """
    changed = True
    while changed:
        changed = False

        # Élimination des stratégies dominées du joueur 1 (lignes)
        remaining_rows = is_dominated(A)
        if len(remaining_rows) < A.shape[0]:
            A = A[remaining_rows, :]
            B = B[remaining_rows, :]
            changed = True

        # Élimination des stratégies dominées du joueur 2 (colonnes)
        remaining_cols = is_dominated(B.T)
        if len(remaining_cols) < B.shape[1]:
            A = A[:, remaining_cols]
            B = B[:, remaining_cols]
            changed = True

    return A, B


# ==============================================
# 🔢 Exemple : Jeu 3x3
# ==============================================

# Gains du joueur 1
A = np.array([
    [3, 2, 1],
    [2, 4, 0],
    [1, 1, 0]
])

# Gains du joueur 2
B = np.array([
    [1, 3, 2],
    [4, 1, 0],
    [2, 2, 3]
])

print("=== MATRICES INITIALES ===")
print("Joueur 1 :\n", A)
print("Joueur 2 :\n", B)

A_reduced, B_reduced = eliminate_dominated(A, B)

print("\n=== MATRICES APRÈS ÉLIMINATION ===")
print("Joueur 1 :\n", A_reduced)
print("Joueur 2 :\n", B_reduced)
