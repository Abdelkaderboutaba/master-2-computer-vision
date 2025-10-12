import pygame
import sys

pygame.init()

# --- Fenêtre ---
WIDTH, HEIGHT = 700, 500
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("🧠 Le neurone décideur")

font = pygame.font.SysFont("Arial", 24)

# --- Couleurs ---
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
BLUE = (100, 150, 255)
GREEN = (0, 200, 0)
RED = (200, 0, 0)
YELLOW = (255, 255, 0)
GRAY = (180, 180, 180)

# --- Variables du perceptron ---
input1 = 0
input2 = 0
w1 = 0.5
w2 = 0.5
bias = 0.2
threshold = 1

# --- Fonctions utilitaires ---
def perceptron_output(x1, x2, w1, w2, bias):
    s = x1 * w1 + x2 * w2 + bias
    return 1 if s >= threshold else 0

def draw_button(x, y, value, label):
    color = GREEN if value == 1 else RED
    pygame.draw.circle(screen, color, (x, y), 30)
    text = font.render(label, True, WHITE)
    screen.blit(text, (x - 25, y + 40))

def draw_slider(x, y, value, label):
    pygame.draw.rect(screen, GRAY, (x, y, 200, 10))
    knob_x = int(x + value * 200)
    pygame.draw.circle(screen, BLUE, (knob_x, y + 5), 10)
    text = font.render(f"{label}: {value:.2f}", True, BLACK)
    screen.blit(text, (x, y - 30))
    return x, y, knob_x

def draw_output(value):
    pygame.draw.circle(screen, YELLOW if value == 1 else GRAY, (550, 250), 60)
    text = font.render("OUI" if value == 1 else "NON", True, BLACK)
    screen.blit(text, (520, 245))

# --- Boucle principale ---
running = True
dragging_w1 = dragging_w2 = False

while running:
    screen.fill(WHITE)

    # --- Titre ---
    title = font.render("🧠 Le neurone décideur : prend-il une décision ?", True, BLACK)
    screen.blit(title, (120, 30))

    # --- Entrées ---
    draw_button(150, 200, input1, "Entrée 1")
    draw_button(150, 350, input2, "Entrée 2")

    # --- Poids ---
    w1_area = draw_slider(300, 200, w1, "Poids 1")
    w2_area = draw_slider(300, 350, w2, "Poids 2")

    # --- Calcul du perceptron ---
    output = perceptron_output(input1, input2, w1, w2, bias)

    # --- Sortie ---
    draw_output(output)

    # --- Texte explicatif ---
    explain = font.render(
        f"Somme = {input1}×{w1:.2f} + {input2}×{w2:.2f} + {bias:.2f}",
        True, BLACK)
    screen.blit(explain, (180, 420))

    pygame.display.flip()

    # --- Événements ---
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        if event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()

            # Boutons d’entrée
            if (mx - 150)**2 + (my - 200)**2 < 30**2:
                input1 = 1 - input1  # Toggle
            if (mx - 150)**2 + (my - 350)**2 < 30**2:
                input2 = 1 - input2

            # Curseur W1
            if abs(my - (w1_area[1] + 5)) < 15 and w1_area[0] <= mx <= w1_area[0] + 200:
                dragging_w1 = True
            # Curseur W2
            if abs(my - (w2_area[1] + 5)) < 15 and w2_area[0] <= mx <= w2_area[0] + 200:
                dragging_w2 = True

        if event.type == pygame.MOUSEBUTTONUP:
            dragging_w1 = dragging_w2 = False

        if event.type == pygame.MOUSEMOTION:
            mx, my = pygame.mouse.get_pos()
            if dragging_w1:
                w1 = max(0, min(1, (mx - w1_area[0]) / 200))
            if dragging_w2:
                w2 = max(0, min(1, (mx - w2_area[0]) / 200))
