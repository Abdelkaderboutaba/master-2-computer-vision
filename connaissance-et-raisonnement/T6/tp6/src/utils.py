# src/utils.py

import networkx as nx
import matplotlib.pyplot as plt

def plot_bayesian_network(model, filename='report/images/network.png'):
    G = nx.DiGraph()
    for parent, child in model.edges():
        G.add_edge(parent, child)

    plt.figure(figsize=(6,4))
    pos = nx.spring_layout(G)
    nx.draw(G, pos, with_labels=True, node_size=2000, node_color='lightblue', arrowsize=20)
    plt.title("Réseau Bayésien - Fusion Caméra/Radar")
    plt.savefig(filename)
    plt.close()

def plot_results(df, filename='report/images/probabilities.png'):
    """Trace un graphique des probabilités d'obstacle réel pour tous les scénarios."""
    plt.figure(figsize=(10,5))
    plt.bar(df['Scenario'], df['Prob_Obstacle'], color='orange')
    plt.xlabel("Scénario")
    plt.ylabel("Probabilité Obstacle Réel")
    plt.title("Probabilité d'Obstacle Réel par scénario")
    plt.ylim(0,1)
    plt.grid(axis='y')
    plt.savefig(filename)
    plt.close()
