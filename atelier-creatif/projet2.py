import pygame

pygame.init()

# --- Fenêtre ---
WIDTH, HEIGHT = 900, 500
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Perceptron - Étape 2 : Signal vers les capteurs")

# --- Couleurs ---
SKY = (180, 230, 255)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
YELLOW = (255, 230, 120)
BLUE = (100, 180, 255)
GREY = (200, 200, 200)

font = pygame.font.Font(None, 28)
big_font = pygame.font.Font(None, 38)

# --- Charger images des capteurs ---
def load_image(path, size):
    img = pygame.image.load(path).convert_alpha()
    return pygame.transform.smoothscale(img, size)

eye_img = load_image("images/eye.png", (60, 60))
ear_img = load_image("images/ear.png", (60, 60))
hand_img = load_image("images/eye.png", (60, 60))
nose_img = load_image("images/eye.png", (60, 60))

# --- Positions des inputs ---
positions = {
    "Œil": (400, 100),
    "Oreille": (400, 200),
    "Main": (400, 300),
    "Nez": (400, 400)
}

images = {
    "Œil": eye_img,
    "Oreille": ear_img,
    "Main": hand_img,
    "Nez": nose_img
}

# --- Sources pour chaque capteur ---
sources = {
    "Œil": (100, 100),
    "Oreille": (100, 200),
    "Main": (100, 300),
    "Nez": (100, 400)
}

# --- Thought explicative ---
thoughts = {
    "Œil": "💡 Lumière reçue par l’œil",
    "Oreille": "🎵 Son entendu par l’oreille",
    "Main": "✋ Toucher détecté par la main",
    "Nez": "👃 Odeur captée par le nez"
}

# --- Animation individuelle par capteur ---
progress = {name: 0 for name in positions.keys()}
paused = {name: False for name in positions.keys()}
in_pause_zone = {name: False for name in positions.keys()}
speed = 0.003

running = True

while running:
    screen.fill(SKY)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                # relancer uniquement les signaux en pause
                for key in paused.keys():
                    if paused[key]:
                        paused[key] = False
                        in_pause_zone[key] = False  # sortir de la pause

    # --- Affichage des capteurs ---
    for name, pos in positions.items():
        img = images[name]
        screen.blit(img, (pos[0]-30, pos[1]-30))
        text = font.render(name, True, BLACK)
        screen.blit(text, (pos[0]+40, pos[1]-10))

    # --- Texte explicatif ---
    info_text = big_font.render("Étape 2 : Les signaux arrivent aux capteurs !", True, BLACK)
    screen.blit(info_text, (100, 20))

    # --- Animation du signal vers les capteurs ---
    for name, source in sources.items():
        target = positions[name]
        mid_x = (source[0]+target[0])/2
        mid_y = (source[1]+target[1])/2

        # Si le signal entre dans la zone de pause
        if 0.35 < progress[name] < 0.65 and not in_pause_zone[name]:
            paused[name] = True
            in_pause_zone[name] = True

        if paused[name]:
            x, y = mid_x, mid_y
            # Afficher la bulle thought
            bubble_rect = pygame.Rect(x+15, y-40, 220, 30)
            pygame.draw.rect(screen, WHITE, bubble_rect, border_radius=10)
            pygame.draw.rect(screen, GREY, bubble_rect, 2, border_radius=10)
            text_surface = font.render(thoughts[name], True, BLACK)
            screen.blit(text_surface, (x+20, y-35))
        else:
            x = source[0] + (target[0]-source[0])*progress[name]
            y = source[1] + (target[1]-source[1])*progress[name]

        # Ligne trajet
        pygame.draw.line(screen, BLUE, source, target, 2)
        # Cercle signal
        pygame.draw.circle(screen, YELLOW, (int(x), int(y)), 12)

        # --- Mettre à jour la progression si pas en pause ---
        if not paused[name]:
            progress[name] += speed
            if progress[name] >= 1:
                progress[name] = 0
                paused[name] = False
                in_pause_zone[name] = False

    pygame.display.flip()
    pygame.time.Clock().tick(60)

pygame.quit()
