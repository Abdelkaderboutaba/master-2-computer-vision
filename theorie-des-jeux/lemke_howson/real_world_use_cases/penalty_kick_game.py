from core.game import BimatrixGame
from core.lemke_howson import LemkeHowson

A = [[1, -1], [-1, 1]]  # kicker
B = [[-1, 1], [1, -1]]  # keeper

game = BimatrixGame(A, B)
solver = LemkeHowson(game)
print("Penalty equilibrium:", solver.solve())
