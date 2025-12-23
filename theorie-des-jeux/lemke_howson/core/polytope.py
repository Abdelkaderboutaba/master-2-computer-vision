import numpy as np

class BestResponsePolytope:
    def __init__(self, payoff_matrix, transpose=False):
        self.M = payoff_matrix.T if transpose else payoff_matrix

    def slack(self, strategy):
        return self.M @ strategy
