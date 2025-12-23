def compute_labels(strategy, slack, tol=1e-8):
    labels = set()

    for i, v in enumerate(strategy):
        if v <= tol:
            labels.add(f"z{i}")

    for j, s in enumerate(slack):
        if abs(s - 1) <= tol:
            labels.add(f"c{j}")

    return labels
