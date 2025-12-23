import matplotlib.pyplot as plt

def plot_path(path):
    plt.figure()
    for i, (x, y) in enumerate(path):
        plt.scatter(x[0], y[0])
        plt.text(x[0], y[0], f"{i}")
    plt.title("Lemke–Howson Path")
    plt.show()
