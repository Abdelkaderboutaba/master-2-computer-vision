# src/inference.py

from pgmpy.inference import VariableElimination
import pandas as pd

def compute_obstacle_probability(model, evidence):
    """Calcule la probabilité qu'un obstacle réel soit présent 
    
    selon une observation.

       Variable Elimination est l’algorithme qui permet au réseau bayésien
       de raisonner 
       efficacement en supprimant les variables inutiles pour calculer 
       uniquement la probabilité recherchée.
    """
    infer = VariableElimination(model)
    result = infer.query(variables=['Obstacle_Reel'], evidence=evidence)
    return result

def compute_from_csv(model, csv_file):
    """Lit un CSV et calcule les probabilités pour chaque scénario."""
    df = pd.read_csv(csv_file)
    results = []
    for idx, row in df.iterrows():
        evidence = {
            'Meteo': row['Meteo'],
            'Luminosite': row['Luminosite'],
            'Camera': row['Camera'],
            'Radar': row['Radar']
        }
        result = compute_obstacle_probability(model, evidence)
        prob_present = result.values[1]  # Index 1 = Présent
        results.append({
            'Scenario': idx+1,
            'Meteo': row['Meteo'],
            'Luminosite': row['Luminosite'],
            'Camera': row['Camera'],
            'Radar': row['Radar'],
            'Prob_Obstacle': prob_present
        })
    return pd.DataFrame(results)
