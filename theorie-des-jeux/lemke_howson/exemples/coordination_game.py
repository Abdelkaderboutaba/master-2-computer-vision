from core.game import BimatrixGame
from core.lemke_howson import LemkeHowson

A = [[2, 0], [0, 2]]
B = [[2, 0], [0, 2]]

game = BimatrixGame(A, B)
solver = LemkeHowson(game)
print(solver.solve())
