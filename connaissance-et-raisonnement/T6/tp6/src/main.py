# src/main.py

from model_builder import build_model
from inference import compute_from_csv
from utils import plot_bayesian_network, plot_results

# 1. Construire le modèle
model = build_model()

# 2. Visualiser le réseau
plot_bayesian_network(model)

# 3. Lire le CSV et calculer les probabilités
df_results = compute_from_csv(model, 'data/example_scenarios.csv')

# 4. Sauvegarder les résultats
df_results.to_csv('report/results.csv', index=False)
print("=== Résultats ===")
print(df_results)

# 5. Générer graphique comparatif
plot_results(df_results)
