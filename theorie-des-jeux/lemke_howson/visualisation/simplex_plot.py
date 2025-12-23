import matplotlib.pyplot as plt
import numpy as np

def plot_simplex(path, title="Simplex Path"):
    plt.figure()
    plt.plot([0,1],[0,0],'k')
    plt.scatter(path[:,0], np.zeros(len(path)), c='r')
    plt.title(title)
    plt.xlabel("Probability")
    plt.show()
