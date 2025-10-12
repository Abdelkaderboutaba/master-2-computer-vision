import pygame

pygame.init()

# --- Fenêtre ---
WIDTH, HEIGHT = 900, 500
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Perceptron - Étape 1 : Entrée des signaux")

# --- Couleurs ---
SKY = (180, 230, 255)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)

font = pygame.font.Font(None, 28)
big_font = pygame.font.Font(None, 38)

# --- Charger images des capteurs ---
def load_image(path, size):
    img = pygame.image.load(path).convert_alpha()
    return pygame.transform.smoothscale(img, size)

eye_img = load_image("images/eye.png", (60, 60))
ear_img = load_image("images/ear.png", (60, 60))
hand_img = load_image("images/sun.png", (60, 60))
nose_img = load_image("images/pacman.png", (60, 60))

# --- Positions des inputs ---
positions = {
    "Œil": (150, 100),
    "Oreille": (150, 220),
    "Main": (150, 340),
    "Nez": (150, 460)
}

images = {
    "Œil": eye_img,
    "Oreille": ear_img,
    "Main": hand_img,
    "Nez": nose_img
}

# --- Boucle principale ---
running = True
while running:
    screen.fill(SKY)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # --- Affichage des inputs ---
    for name, pos in positions.items():
        img = images[name]
        screen.blit(img, (pos[0]-30, pos[1]-30))  # centrer l'image
        text = font.render(name, True, BLACK)
        screen.blit(text, (pos[0]+50, pos[1]-10))

    # --- Texte explicatif ---
    info_text = big_font.render("Étape 1 : Les capteurs reçoivent les signaux !", True, BLACK)
    screen.blit(info_text, (150, 20))

    pygame.display.flip()

pygame.quit()
