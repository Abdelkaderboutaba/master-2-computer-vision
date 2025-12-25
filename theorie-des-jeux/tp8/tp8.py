import numpy as np
from scipy.optimize import linprog


# ---------------------------------------------------------
# 1. PURE STRATEGY SADDLE POINT
# ---------------------------------------------------------
def pure_saddle_point(A):
    """
    Detects a saddle point in pure strategies.
    Returns: (exists, (i,j), value)
    """
    A = np.array(A)
    row_min = np.min(A, axis=1)
    col_max = np.max(A, axis=0)

    v_minmax = np.max(row_min)   # max of row minima
    v_maxmin = np.min(col_max)   # min of column maxima

    if v_minmax == v_maxmin:
        # Find the saddle point position
        for i in range(A.shape[0]):
            for j in range(A.shape[1]):
                if A[i, j] == v_minmax:
                    return True, (i, j), v_minmax
    return False, None, None


# ---------------------------------------------------------
# 2. MIXED STRATEGY EQUILIBRIUM FOR GENERAL n×n GAME
# ---------------------------------------------------------
def mixed_strategy_lp(A):
    """
    Computes mixed-strategy Nash equilibrium for a zero-sum game
    using linear programming. Works for any n×n game.
    Returns: (row_strategy, game_value)
    """
    A = np.array(A, dtype=float)
    m, n = A.shape

    # Objective: maximize v, convert to LP (minimize -v)
    c = np.zeros(m+1)
    c[-1] = -1

    # Constraints: A^T x >= v  -->  A^T x - v >= 0
    A_ub = np.hstack([-A.T, np.ones((n, 1))])
    b_ub = np.zeros(n)

    # Probabilities sum to 1
    A_eq = np.zeros((1, m+1))
    A_eq[0, :m] = 1
    b_eq = np.array([1])

    # x_i >= 0, no bound on v
    bounds = [(0, None)] * m + [(None, None)]

    result = linprog(c, A_ub=A_ub, b_ub=b_ub, A_eq=A_eq, b_eq=b_eq,
                     bounds=bounds, method="highs")

    if not result.success:
        raise ValueError("LP failed!")

    x = result.x[:m]       # row player's probabilities
    v = result.x[-1]       # value of the game
    return x, v


# ---------------------------------------------------------
# 3. MIXED STRATEGY EQUILIBRIUM FOR 2×2 SPECIAL CASE
# ---------------------------------------------------------
def mixed_strategy_2x2(A):
    """
    Closed-form mixed-strategy equilibrium for a 2×2 zero-sum game.
    Returns: (p, q, v)
    """
    A = np.array(A, dtype=float)
    a, b = A[0]
    c, d = A[1]

    denom = a - b - c + d
    if denom == 0:
        raise ValueError("No unique mixed equilibrium.")

    p = (d - b) / denom       # row strategy
    q = (d - c) / denom       # column strategy
    v = (a * d - b * c) / denom

    return p, q, v


# ---------------------------------------------------------
# 4. MAIN : TEST EVERYTHING
# ---------------------------------------------------------
if __name__ == "__main__":
    A = [[1, 4],
         [3, 2]]

    print("Payoff Matrix (Row player wins):")
    print(np.array(A))

    # PURE STRATEGY CHECK
    print("\n--- PURE STRATEGY SADDLE POINT ---")
    exists, pos, value = pure_saddle_point(A)
    if exists:
        print(f"Saddle point exists at position {pos}, value = {value}")
    else:
        print("No pure saddle point exists.")

    # MIXED STRATEGY (2x2 closed formula)
    if np.array(A).shape == (2,2):
        print("\n--- MIXED STRATEGY (2x2 CLOSED-FORM) ---")
        p, q, v = mixed_strategy_2x2(A)
        print(f"Row player's strategy: p = {p:.3f}  (probability of Row1)")
        print(f"Column player's strategy: q = {q:.3f}  (probability of Col1)")
        print(f"Value of the game: v = {v:.3f}")

    # MIXED STRATEGY (general LP)
    print("\n--- MIXED STRATEGY (LINEAR PROGRAMMING) ---")
    x, v = mixed_strategy_lp(A)
    print("Row player's mixed strategy:", x)
    print("Value of the game:", v)
