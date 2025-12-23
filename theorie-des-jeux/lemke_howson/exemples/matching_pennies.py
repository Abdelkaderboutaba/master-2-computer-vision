from core.game import BimatrixGame
from core.lemke_howson import LemkeHowson

A = [[1, -1], [-1, 1]]
B = [[-1, 1], [1, -1]]

game = BimatrixGame(A, B)
solver = LemkeHowson(game)
x, y, path = solver.solve()

print("Equilibrium:", x, y)
