import numpy as np

# ---------------------------------------------
# 1. Projection sur le simplex (probabilités)
# ---------------------------------------------
def project_to_simplex(p):
    p = np.maximum(p, 1e-12)  # élimine les valeurs négatives
    return p / np.sum(p)      # normalise pour que la somme = 1


# ---------------------------------------------
# 2. Gradient Dynamics (cœur du Nash mixte)
# ---------------------------------------------
def gradient_nash(A, B, lr=0.01, steps=10000):
    m, n = A.shape

    # Initialisation aléatoire des stratégies
    x = project_to_simplex(np.random.rand(m))  # joueur 1
    y = project_to_simplex(np.random.rand(n))  # joueur 2

    for _ in range(steps):
        # Gradients = gains de chaque action contre la stratégie de l'autre
        grad_x = A @ y      # payoff de chaque action pure du joueur 1
        grad_y = x @ B      # payoff de chaque action pure du joueur 2

        # Mise à jour (gradient ascent)
        x = project_to_simplex(x + lr * grad_x)
        y = project_to_simplex(y + lr * grad_y)

    return x, y


# ---------------------------------------------
# 3. Vérification simple du Nash
# ---------------------------------------------
def verify_nash(A, B, x, y):
    print("\n----- Vérification du Nash -----")

    payoff1 = A @ y
    payoff2 = x @ B

    print("\nJoueur 1 :")
    print("Payoff de chaque action :", payoff1)
    print("Payoff obtenu :", x @ payoff1)
    print("Payoff max possible :", np.max(payoff1))

    print("\nJoueur 2 :")
    print("Payoff de chaque action :", payoff2)
    print("Payoff obtenu :", y @ payoff2)
    print("Payoff max possible :", np.max(payoff2))


# ---------------------------------------------
# 4. Exemple : Jeu 3x3
# ---------------------------------------------
A = np.array([
    [4, 2, 3],
    [5, 8, 9],
    [6, 3, 2]
])

B = np.array([
    [3, 1, 2],
    [1, 4, 6],
    [0, 6, 5]
])

# Calcul du Nash
x, y = gradient_nash(A, B, lr=0.01, steps=15000)

print("\n========= ÉQUILIBRE DE NASH TROUVÉ =========")
print("Stratégie du joueur 1 :", x)
print("Stratégie du joueur 2 :", y)

# Vérification
verify_nash(A, B, x, y)
