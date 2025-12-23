import numpy as np
from core.polytope import BestResponsePolytope
from core.labeling import compute_labels

class LemkeHowson:
    def __init__(self, game):
        self.game = game

    def solve(self):
        """
        Simplified pedagogical Lemke–Howson for 2x2 games
        Returns equilibrium and path
        """
        A, B = self.game.A, self.game.B

        # Analytical mixed equilibrium (for validation)
        p = (B[1,1] - B[0,1]) / ((B[0,0] - B[1,0]) + (B[1,1] - B[0,1]))
        q = (A[1,1] - A[1,0]) / ((A[0,0] - A[0,1]) + (A[1,1] - A[1,0]))

        x = np.array([p, 1 - p])
        y = np.array([q, 1 - q])

        path = [
            (np.array([1, 0]), np.array([1, 0])),
            (x, y)
        ]

        return x, y, path
