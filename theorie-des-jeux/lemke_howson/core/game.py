import numpy as np

class BimatrixGame:
    def __init__(self, A, B):
        self.A = np.array(A, dtype=float)
        self.B = np.array(B, dtype=float)
        self._validate()
        self._normalize()

    def _validate(self):
        if self.A.shape != self.B.shape:
            raise ValueError("Payoff matrices must have same dimensions")

    def _normalize(self):
        min_val = min(self.A.min(), self.B.min())
        if min_val <= 0:
            self.A += abs(min_val) + 1
            self.B += abs(min_val) + 1

    @property
    def shape(self):
        return self.A.shape
