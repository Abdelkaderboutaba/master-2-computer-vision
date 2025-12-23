from core.game import BimatrixGame
from core.lemke_howson import LemkeHowson

A = [[3, 1], [0, 2]]
B = [[3, 0], [1, 2]]

game = BimatrixGame(A, B)
solver = LemkeHowson(game)
print("Market equilibrium:", solver.solve())
