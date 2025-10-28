matrice = [
    [(3,2),(1,2),(2,6)],
    [(5,1),(6,1),(3,4)],
    [(2,2),(4,1),(5,4)],
]



dict1 = {
    "a1":False,
    "a2":False,
    "a3":False
}

dict2 = {
    "b1":False,
    "b2":False,
    "b3":False
}






def domine(mat):

    x= mat[0][0][0]

    for i in range(0,3):

        curr= mat[i][0][0]

        for j in range(1,3):
            y=mat[i][j][0]
            if y>curr :
                curr = y
                
            
            
    
        print(curr)




domine(matrice)





# matrice = [
#     [(3,2),(1,2),(2,6)],
#     [(5,1),(6,1),(3,4)],
#     [(2,2),(4,1),(5,4)],
# ]

# # noms des stratégies
# a = ["a1", "a2", "a3"]
# b = ["b1", "b2", "b3"]

# def strategie_dominante(matrice):
#     n = len(matrice)
    
#     # --- Joueur 1 ---
#     print("=== Joueur 1 ===")
#     for i in range(n):
#         for j in range(n):
#             if i != j:
#                 meilleur = True
#                 strictement_meilleur = False
#                 for k in range(n):
#                     if matrice[i][k][0] < matrice[j][k][0]:
#                         meilleur = False
#                         break
#                     elif matrice[i][k][0] > matrice[j][k][0]:
#                         strictement_meilleur = True
#                 if meilleur and strictement_meilleur:
#                     print(f"{a[i]} domine {a[j]}")
    
#     # --- Joueur 2 ---
#     print("\n=== Joueur 2 ===")
#     for i in range(n):
#         for j in range(n):
#             if i != j:
#                 meilleur = True
#                 strictement_meilleur = False
#                 for k in range(n):
#                     if matrice[k][i][1] < matrice[k][j][1]:
#                         meilleur = False
#                         break
#                     elif matrice[k][i][1] > matrice[k][j][1]:
#                         strictement_meilleur = True
#                 if meilleur and strictement_meilleur:
#                     print(f"{b[i]} domine {b[j]}")

# strategie_dominante(matrice)
