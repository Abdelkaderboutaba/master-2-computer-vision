# src/model_builder.py

from pgmpy.models import DiscreteBayesianNetwork
from pgmpy.factors.discrete import TabularCPD

def build_model():
    """Construit le réseau bayésien complet pour le projet."""

    model = DiscreteBayesianNetwork([
        ('Meteo', 'Camera'),
        ('Luminosite', 'Camera'),
        ('Obstacle_Reel', 'Camera'),
        ('Obstacle_Reel', 'Radar')
    ])

    # CPDs
    cpd_meteo = TabularCPD(
        variable='Meteo',
        variable_card=3,
        values=[[0.5], [0.3], [0.2]],
        state_names={'Meteo': ['Soleil', 'Pluie', 'Brouillard']}
    )

    cpd_lumi = TabularCPD(
        variable='Luminosite',
        variable_card=2,
        values=[[0.7], [0.3]],
        state_names={'Luminosite': ['Jour', 'Nuit']}
    )

    cpd_obs = TabularCPD(
        variable='Obstacle_Reel',
        variable_card=2,
        values=[[0.6], [0.4]],
        state_names={'Obstacle_Reel': ['Absent', 'Present']}
    )

    cpd_radar = TabularCPD(
        variable='Radar',
        variable_card=2,
        values=[[0.9, 0.2], [0.1, 0.8]],
        evidence=['Obstacle_Reel'],
        evidence_card=[2],
        state_names={
            'Radar': ['Absent', 'Present'],
            'Obstacle_Reel': ['Absent', 'Present']
        }
    )

    cpd_camera = TabularCPD(
        variable='Camera',
        variable_card=2,
        values=[
            [0.99, 0.9, 0.8, 0.7, 0.95, 0.85, 0.75, 0.65, 0.9, 0.8, 0.7, 0.6],
            [0.01, 0.1, 0.2, 0.3, 0.05, 0.15, 0.25, 0.35, 0.1, 0.2, 0.3, 0.4]
        ],
        evidence=['Meteo', 'Luminosite', 'Obstacle_Reel'],
        evidence_card=[3, 2, 2],
        state_names={
            'Camera': ['Absent', 'Present'],
            'Meteo': ['Soleil', 'Pluie', 'Brouillard'],
            'Luminosite': ['Jour', 'Nuit'],
            'Obstacle_Reel': ['Absent', 'Present']
        }
    )

    # Ajouter CPDs
    model.add_cpds(cpd_meteo, cpd_lumi, cpd_obs, cpd_radar, cpd_camera)

    # Vérification du modèle
    assert model.check_model(), "Le modèle n'est pas correct !"

    return model
