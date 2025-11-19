

def nash_mixed_2x2(U1, U2):
    # U1 and U2 are 2x2 matrices

    # --- Joueur 1 : probabilité p de jouer Haut (et 1-p Bas) ---
    a, b = U1[0]
    c, d = U1[1]

    # Condition d'indifférence joueur 2 :
    # p*e + (1-p)*g = p*f + (1-p)*h
    e, f = U2[0]
    g, h = U2[1]

    # On résout pour p :
    p = (h - g) / ((h - g) + (e - f))

    # --- Joueur 2 : probabilité q de jouer Gauche (1-q Droite) ---
    # Condition d'indifférence joueur 1 :
    # q*a + (1-q)*b = q*c + (1-q)*d
    q = (d - b) / ((d - b) + (a - c))

    return p, q


# Exemple simple :
U1 = [[3, 1],
      [0, 2]]

U2 = [[2, 1],
      [0, 3]]

p, q = nash_mixed_2x2(U1, U2)

print("Équilibre mixte :")
print("p =", p)  # probabilité Joueur 1 de jouer Haut
print("q =", q)  # probabilité Joueur 2 de jouer Gauche
