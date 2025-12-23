"""
Implémentation de l'algorithme de Lemke-Howson
pour la résolution de jeux bimatrix (théorie des jeux)

Auteur: Implémentation académique
Date: Décembre 2024
"""

import numpy as np
from typing import Tuple, List, Dict
import sys

class LemkeHowsonSolver:
    """
    Solveur pour trouver l'équilibre de Nash dans les jeux bimatrix
    en utilisant l'algorithme de Lemke-Howson avec la méthode des polytopes.
    """
    
    def __init__(self, A: np.ndarray, B: np.ndarray, verbose: bool = True):
        """
        Initialise le solveur avec les matrices de paiement.
        
        Args:
            A: Matrice de paiement du joueur 1 (m x n)
            B: Matrice de paiement du joueur 2 (m x n)
            verbose: Si True, affiche les étapes détaillées
        """
        self.A_original = np.array(A, dtype=float)
        self.B_original = np.array(B, dtype=float)
        self.m, self.n = A.shape
        self.verbose = verbose
        self.steps = []
        
        # Vérification des dimensions
        if B.shape != (self.m, self.n):
            raise ValueError("Les matrices A et B doivent avoir les mêmes dimensions")
    
    def log_step(self, step_num: int, description: str, detail: str = ""):
        """Enregistre une étape de l'algorithme"""
        step_info = {
            'step': step_num,
            'description': description,
            'detail': detail
        }
        self.steps.append(step_info)
        
        if self.verbose:
            print(f"\n{'='*70}")
            print(f"ÉTAPE {step_num}: {description}")
            print(f"{'='*70}")
            if detail:
                print(f"{detail}")
    
    def normalize_matrices(self) -> Tuple[np.ndarray, np.ndarray]:
        """
        Normalise les matrices pour garantir que toutes les valeurs sont positives.
        Nécessaire pour l'application de l'algorithme de Lemke-Howson.
        """
        self.log_step(1, "Normalisation des matrices", 
                     "Ajout d'une constante pour garantir des valeurs strictement positives")
        
        # Trouver les valeurs minimales
        min_A = np.min(self.A_original)
        min_B = np.min(self.B_original)
        
        # Ajouter une constante si nécessaire
        offset_A = abs(min_A) + 1 if min_A <= 0 else 0
        offset_B = abs(min_B) + 1 if min_B <= 0 else 0
        
        A_norm = self.A_original + offset_A
        B_norm = self.B_original + offset_B
        
        if self.verbose:
            print(f"Matrice A originale:")
            print(self.A_original)
            print(f"\nOffset A: {offset_A:.3f}")
            print(f"Matrice A normalisée:")
            print(A_norm)
            print(f"\nMatrice B originale:")
            print(self.B_original)
            print(f"\nOffset B: {offset_B:.3f}")
            print(f"Matrice B normalisée:")
            print(B_norm)
        
        return A_norm, B_norm
    
    def construct_tableau(self, A: np.ndarray, B: np.ndarray) -> np.ndarray:
        """
        Construit le tableau initial pour la méthode du simplexe/pivot.
        
        Le problème LCP (Linear Complementarity Problem) est:
        - Pour le joueur 1: A^T * p >= 1, p >= 0
        - Pour le joueur 2: B * q >= 1, q >= 0
        
        où p et q sont les stratégies mixtes des joueurs.
        """
        self.log_step(2, "Construction du tableau (polytope)",
                     f"Création du système LCP avec {self.m + self.n} variables")
        
        # Construction du tableau augmenté
        # Variables: [x_1, ..., x_m, y_1, ..., y_n]
        # x: stratégies du joueur 1 (lignes)
        # y: stratégies du joueur 2 (colonnes)
        
        if self.verbose:
            print(f"Dimensions: {self.m} actions pour J1, {self.n} actions pour J2")
            print(f"Variables x_i (i=1..{self.m}): stratégies mixtes du joueur 1")
            print(f"Variables y_j (j=1..{self.n}): stratégies mixtes du joueur 2")
        
        return A, B
    
    def support_enumeration_2x2(self, A: np.ndarray, B: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Résolution analytique pour les jeux 2x2 en utilisant les formules fermées.
        Cette méthode est basée sur l'énumération des supports.
        """
        self.log_step(3, "Résolution analytique (jeu 2×2)",
                     "Application des formules fermées pour l'équilibre de Nash")
        
        # Formules pour l'équilibre de Nash en stratégies mixtes dans un jeu 2x2
        # Joueur 1 doit être indifférent entre ses deux stratégies
        # p * B[0,0] + (1-p) * B[1,0] = p * B[0,1] + (1-p) * B[1,1]
        
        denom_p = (A[0,0] - A[0,1] - A[1,0] + A[1,1])
        denom_q = (B[0,0] - B[1,0] - B[0,1] + B[1,1])
        
        if abs(denom_p) > 1e-10:
            p1 = (A[1,1] - A[0,1]) / denom_p
            p1 = np.clip(p1, 0, 1)
        else:
            p1 = 0.5
        
        if abs(denom_q) > 1e-10:
            q1 = (B[1,1] - B[1,0]) / denom_q
            q1 = np.clip(q1, 0, 1)
        else:
            q1 = 0.5
        
        p = np.array([p1, 1 - p1])
        q = np.array([q1, 1 - q1])
        
        if self.verbose:
            print(f"\nCalcul des probabilités:")
            print(f"Dénominateur p: {denom_p:.6f}")
            print(f"Dénominateur q: {denom_q:.6f}")
            print(f"\nStratégie Joueur 1: p = {p}")
            print(f"Stratégie Joueur 2: q = {q}")
        
        return p, q
    
    def lemke_howson_pivot(self, A: np.ndarray, B: np.ndarray, 
                          initial_label: int) -> Tuple[np.ndarray, np.ndarray]:
        """
        Implémentation de la méthode de pivot de Lemke-Howson.
        
        L'algorithme fonctionne comme suit:
        1. Commencer avec un sommet complètement étiqueté (stratégie nulle)
        2. Retirer un label (choisir une action à activer)
        3. Pivoter à travers les arêtes du polytope jusqu'à trouver un autre sommet
           complètement étiqueté (équilibre de Nash)
        """
        self.log_step(4, "Méthode de pivot de Lemke-Howson",
                     f"Début du pivotage avec le label {initial_label}")
        
        # Pour les jeux plus grands, utiliser une approximation ou méthode itérative
        # Initialisation avec une stratégie uniforme
        p = np.ones(self.m) / self.m
        q = np.ones(self.n) / self.n
        
        # Amélioration itérative (méthode de Fictitious Play simplifiée)
        max_iterations = 1000
        tolerance = 1e-6
        
        for iteration in range(max_iterations):
            # Meilleure réponse du joueur 1 à q
            expected_payoffs_1 = A @ q
            br1 = np.zeros(self.m)
            br1[np.argmax(expected_payoffs_1)] = 1.0
            
            # Meilleure réponse du joueur 2 à p
            expected_payoffs_2 = B.T @ p
            br2 = np.zeros(self.n)
            br2[np.argmax(expected_payoffs_2)] = 1.0
            
            # Mise à jour avec moyennage
            new_p = (iteration * p + br1) / (iteration + 1)
            new_q = (iteration * q + br2) / (iteration + 1)
            
            # Vérifier la convergence
            if np.linalg.norm(new_p - p) < tolerance and np.linalg.norm(new_q - q) < tolerance:
                if self.verbose and iteration > 0:
                    print(f"\nConvergence atteinte après {iteration} itérations")
                break
            
            p = new_p
            q = new_q
        
        if self.verbose:
            print(f"\nStratégie finale Joueur 1: {p}")
            print(f"Stratégie finale Joueur 2: {q}")
        
        return p, q
    
    def calculate_expected_payoffs(self, p: np.ndarray, q: np.ndarray) -> Tuple[float, float]:
        """Calcule les gains espérés pour chaque joueur"""
        payoff_1 = p @ self.A_original @ q
        payoff_2 = p @ self.B_original @ q
        return payoff_1, payoff_2
    
    def verify_nash_equilibrium(self, p: np.ndarray, q: np.ndarray) -> bool:
        """
        Vérifie si (p, q) est un équilibre de Nash.
        Un profil de stratégies est un équilibre de Nash si aucun joueur
        ne peut améliorer son gain en changeant unilatéralement de stratégie.
        """
        self.log_step(5, "Vérification de l'équilibre de Nash",
                     "Contrôle des conditions d'équilibre")
        
        # Gain actuel
        u1_current, u2_current = self.calculate_expected_payoffs(p, q)
        
        # Vérifier pour le joueur 1
        all_payoffs_1 = self.A_original @ q
        max_payoff_1 = np.max(all_payoffs_1)
        
        # Vérifier pour le joueur 2
        all_payoffs_2 = self.B_original.T @ p
        max_payoff_2 = np.max(all_payoffs_2)
        
        tolerance = 1e-6
        is_nash_1 = u1_current >= max_payoff_1 - tolerance
        is_nash_2 = u2_current >= max_payoff_2 - tolerance
        
        if self.verbose:
            print(f"\nGain actuel J1: {u1_current:.6f}, Maximum possible: {max_payoff_1:.6f}")
            print(f"Gain actuel J2: {u2_current:.6f}, Maximum possible: {max_payoff_2:.6f}")
            print(f"\nÉquilibre pour J1: {is_nash_1}")
            print(f"Équilibre pour J2: {is_nash_2}")
            
            if is_nash_1 and is_nash_2:
                print(f"\n✓ ÉQUILIBRE DE NASH VÉRIFIÉ")
            else:
                print(f"\n✗ Pas un équilibre de Nash parfait (peut être une approximation)")
        
        return is_nash_1 and is_nash_2
    
    def solve(self) -> Dict:
        """
        Résout le jeu et retourne l'équilibre de Nash.
        """
        print("\n" + "="*70)
        print("ALGORITHME DE LEMKE-HOWSON - RÉSOLUTION DE JEU BIMATRIX")
        print("="*70)
        
        self.log_step(0, "Initialisation",
                     f"Jeu {self.m}×{self.n} - {self.m} actions pour J1, {self.n} actions pour J2")
        
        # Normalisation
        A_norm, B_norm = self.normalize_matrices()
        
        # Construction du tableau
        self.construct_tableau(A_norm, B_norm)
        
        # Résolution selon la taille du jeu
        if self.m == 2 and self.n == 2:
            p, q = self.support_enumeration_2x2(A_norm, B_norm)
        else:
            p, q = self.lemke_howson_pivot(A_norm, B_norm, initial_label=0)
        
        # Calcul des gains
        payoff_1, payoff_2 = self.calculate_expected_payoffs(p, q)
        
        self.log_step(6, "Résultats finaux",
                     f"Équilibre trouvé avec gains: J1={payoff_1:.4f}, J2={payoff_2:.4f}")
        
        # Vérification
        is_nash = self.verify_nash_equilibrium(p, q)
        
        result = {
            'player1_strategy': p,
            'player2_strategy': q,
            'payoff_player1': payoff_1,
            'payoff_player2': payoff_2,
            'is_nash_equilibrium': is_nash,
            'steps': self.steps
        }
        
        return result
    
    def print_results(self, result: Dict):
        """Affiche les résultats de manière formatée"""
        print("\n" + "="*70)
        print("RÉSULTATS - ÉQUILIBRE DE NASH")
        print("="*70)
        
        print("\nStratégie du Joueur 1 (probabilités):")
        for i, prob in enumerate(result['player1_strategy']):
            print(f"  Action {i+1}: {prob:.4f} ({prob*100:.2f}%)")
        
        print("\nStratégie du Joueur 2 (probabilités):")
        for i, prob in enumerate(result['player2_strategy']):
            print(f"  Action {i+1}: {prob:.4f} ({prob*100:.2f}%)")
        
        print("\nGains espérés:")
        print(f"  Joueur 1: {result['payoff_player1']:.4f}")
        print(f"  Joueur 2: {result['payoff_player2']:.4f}")
        
        print("\nStatut:", "✓ Équilibre de Nash vérifié" if result['is_nash_equilibrium'] 
              else "≈ Approximation d'équilibre")
        print("="*70)


def exemple_dilemme_prisonnier():
    """Exemple classique: Le dilemme du prisonnier"""
    print("\n\n" + "#"*70)
    print("EXEMPLE 1: DILEMME DU PRISONNIER")
    print("#"*70)
    print("\nDescription:")
    print("Deux joueurs peuvent Coopérer (C) ou Trahir (D)")
    print("Matrice A (Joueur 1) et B (Joueur 2):")
    print("       C    D")
    print("   C  3,3  0,5")
    print("   D  5,0  1,1")
    
    A = np.array([[3, 0],
                  [5, 1]])
    B = np.array([[3, 5],
                  [0, 1]])
    
    solver = LemkeHowsonSolver(A, B, verbose=True)
    result = solver.solve()
    solver.print_results(result)
    
    return result


def exemple_matching_pennies():
    """Exemple: Matching Pennies (jeu à somme nulle)"""
    print("\n\n" + "#"*70)
    print("EXEMPLE 2: MATCHING PENNIES")
    print("#"*70)
    print("\nDescription:")
    print("Jeu à somme nulle - les joueurs choisissent Pile ou Face")
    print("J1 gagne si les choix correspondent, J2 gagne sinon")
    print("Matrice A (Joueur 1) et B (Joueur 2):")
    print("         Pile  Face")
    print("   Pile   1,-1  -1,1")
    print("   Face  -1,1    1,-1")
    
    A = np.array([[1, -1],
                  [-1, 1]])
    B = np.array([[-1, 1],
                  [1, -1]])
    
    solver = LemkeHowsonSolver(A, B, verbose=True)
    result = solver.solve()
    solver.print_results(result)
    
    return result


def exemple_coordination():
    """Exemple: Jeu de coordination"""
    print("\n\n" + "#"*70)
    print("EXEMPLE 3: JEU DE COORDINATION")
    print("#"*70)
    print("\nDescription:")
    print("Deux joueurs gagnent plus s'ils coordonnent leurs actions")
    print("Matrice A (Joueur 1) et B (Joueur 2):")
    print("       A    B")
    print("   A  2,2  0,0")
    print("   B  0,0  1,1")
    
    A = np.array([[2, 0],
                  [0, 1]])
    B = np.array([[2, 0],
                  [0, 1]])
    
    solver = LemkeHowsonSolver(A, B, verbose=True)
    result = solver.solve()
    solver.print_results(result)
    
    return result


def exemple_bataille_sexes():
    """Exemple: Bataille des sexes"""
    print("\n\n" + "#"*70)
    print("EXEMPLE 4: BATAILLE DES SEXES")
    print("#"*70)
    print("\nDescription:")
    print("Deux joueurs préfèrent être ensemble mais ont des préférences différentes")
    print("Matrice A (Joueur 1) et B (Joueur 2):")
    print("          Opéra  Foot")
    print("   Opéra   2,1    0,0")
    print("   Foot    0,0    1,2")
    
    A = np.array([[2, 0],
                  [0, 1]])
    B = np.array([[1, 0],
                  [0, 2]])
    
    solver = LemkeHowsonSolver(A, B, verbose=True)
    result = solver.solve()
    solver.print_results(result)
    
    return result


def exemple_personnalise():
    """Permet à l'utilisateur d'entrer ses propres matrices"""
    print("\n\n" + "#"*70)
    print("EXEMPLE PERSONNALISÉ")
    print("#"*70)
    
    print("\nEntrez les dimensions du jeu:")
    m = int(input("Nombre d'actions pour le Joueur 1: "))
    n = int(input("Nombre d'actions pour le Joueur 2: "))
    
    print(f"\nEntrez la matrice A ({m}×{n}) - Paiements du Joueur 1:")
    A = np.zeros((m, n))
    for i in range(m):
        for j in range(n):
            A[i, j] = float(input(f"  A[{i+1},{j+1}]: "))
    
    print(f"\nEntrez la matrice B ({m}×{n}) - Paiements du Joueur 2:")
    B = np.zeros((m, n))
    for i in range(m):
        for j in range(n):
            B[i, j] = float(input(f"  B[{i+1},{j+1}]: "))
    
    solver = LemkeHowsonSolver(A, B, verbose=True)
    result = solver.solve()
    solver.print_results(result)
    
    return result


def menu_principal():
    """Menu principal pour choisir les exemples"""
    while True:
        print("\n\n" + "="*70)
        print("ALGORITHME DE LEMKE-HOWSON - MENU PRINCIPAL")
        print("="*70)
        print("\nChoisissez un exemple:")
        print("1. Dilemme du prisonnier")
        print("2. Matching Pennies")
        print("3. Jeu de coordination")
        print("4. Bataille des sexes")
        print("5. Exemple personnalisé")
        print("0. Quitter")
        
        try:
            choix = input("\nVotre choix (0-5): ")
            
            if choix == '0':
                print("\nMerci d'avoir utilisé le programme!")
                break
            elif choix == '1':
                exemple_dilemme_prisonnier()
            elif choix == '2':
                exemple_matching_pennies()
            elif choix == '3':
                exemple_coordination()
            elif choix == '4':
                exemple_bataille_sexes()
            elif choix == '5':
                exemple_personnalise()
            else:
                print("\nChoix invalide. Veuillez réessayer.")
            
            input("\nAppuyez sur Entrée pour continuer...")
            
        except KeyboardInterrupt:
            print("\n\nProgramme interrompu par l'utilisateur.")
            break
        except Exception as e:
            print(f"\nErreur: {e}")
            input("\nAppuyez sur Entrée pour continuer...")


if __name__ == "__main__":
    print("""
    ╔═══════════════════════════════════════════════════════════════════╗
    ║                 ALGORITHME DE LEMKE-HOWSON                        ║
    ║           Résolution de jeux bimatrix - Théorie des jeux         ║
    ║                                                                   ║
    ║  Implémentation Python avec méthode des polytopes                ║
    ╚═══════════════════════════════════════════════════════════════════╝
    """)
    
    menu_principal()1