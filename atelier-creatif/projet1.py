import pygame
import math

pygame.init()

# --- Configuration fenêtre ---
WIDTH, HEIGHT = 1000, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Perceptron Cartoon - Animal sur la ligne")

# --- Couleurs ---
SKY = (180, 230, 255)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 200, 120)
YELLOW = (255, 230, 120)
BLUE = (100, 180, 255)
RED = (255, 100, 100)
ORANGE = (255, 170, 70)
GREY = (200, 200, 200)

font = pygame.font.Font(None, 32)
big_font = pygame.font.Font(None, 42)

# --- Charger images ---
def load_image(path, size):
    img = pygame.image.load(path).convert_alpha()
    return pygame.transform.smoothscale(img, size)

eye_img = load_image("images/eye.png", (120, 120))
ear_img = load_image("images/ear.png", (120, 120))
lamp_on = load_image("images/lamp_on.png", (100, 100))
lamp_off = load_image("images/lamp_off.png", (100, 100))
sun_img = load_image("images/sun.png", (90, 90))
sound_img = load_image("images/sound.png", (90, 90))
cat_img_original = load_image("images/cat.png", (80, 80))

# --- Positions ---
light_source = (120, 150)
sound_source = (120, 450)
eye_pos = (300, 150)
ear_pos = (300, 450)
neuron_pos = (600, 300)
output_pos = (850, 300)

# --- Perceptron ---
inputs = [1, 1]      # Entrées reçues
weights = [0.6, 0.4] # Poids
bias = 0.1

def activation(sum_value):
    return 1 if sum_value >= 0.7 else 0

weighted_sum = sum(inputs[i] * weights[i] for i in range(2)) + bias
output = activation(weighted_sum)

# --- Animation ---
clock = pygame.time.Clock()
running = True
stage = 0
progress = 0
speed = 0.01

def draw_arrow(start, end, color, width=6):
    pygame.draw.line(screen, color, start, end, width)
    rotation = math.atan2(start[1] - end[1], end[0] - start[0])
    pygame.draw.polygon(screen, color, [
        (end[0], end[1]),
        (end[0] - 15 * math.cos(rotation + math.pi / 6), end[1] + 15 * math.sin(rotation + math.pi / 6)),
        (end[0] - 15 * math.cos(rotation - math.pi / 6), end[1] + 15 * math.sin(rotation - math.pi / 6))
    ])

def draw_text_center(text, y):
    text_surface = big_font.render(text, True, BLACK)
    text_rect = text_surface.get_rect(center=(WIDTH // 2, y))
    screen.blit(text_surface, text_rect)

# --- Boucle principale ---
while running:
    screen.fill(SKY)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # --- Dessin des images ---
    screen.blit(sun_img, (light_source[0] - 45, light_source[1] - 45))
    screen.blit(sound_img, (sound_source[0] - 45, sound_source[1] - 45))
    screen.blit(eye_img, (eye_pos[0] - 60, eye_pos[1] - 60))
    screen.blit(ear_img, (ear_pos[0] - 60, ear_pos[1] - 60))

    lamp = lamp_on if output == 1 else lamp_off
    screen.blit(lamp, (output_pos[0] - 50, output_pos[1] - 50))

    # --- Flèches initiales ---
    draw_arrow((light_source[0]+50, light_source[1]), (eye_pos[0]-60, eye_pos[1]), GREY)
    draw_arrow((sound_source[0]+50, sound_source[1]), (ear_pos[0]-60, ear_pos[1]), GREY)
    draw_arrow((eye_pos[0]+60, eye_pos[1]), (neuron_pos[0]-70, neuron_pos[1]-50), GREY)
    draw_arrow((ear_pos[0]+60, ear_pos[1]), (neuron_pos[0]-70, neuron_pos[1]+50), GREY)
    draw_arrow((neuron_pos[0]+75, neuron_pos[1]), (output_pos[0]-60, output_pos[1]), GREY)

    # --- Animation selon les étapes ---
    if stage == 0:
        # Signaux vers les capteurs
        lx = light_source[0] + (eye_pos[0]-light_source[0])*progress
        ly = light_source[1] + (eye_pos[1]-light_source[1])*progress
        sx = sound_source[0] + (ear_pos[0]-sound_source[0])*progress
        sy = sound_source[1] + (ear_pos[1]-sound_source[1])*progress
        pygame.draw.circle(screen, YELLOW, (int(lx), int(ly)), 12)
        pygame.draw.circle(screen, ORANGE, (int(sx), int(sy)), 12)
        draw_text_center("👁️ L’œil et 👂 l’oreille captent les signaux...", 60)
        progress += speed
        if progress >=1:
            progress=0
            stage=1

    elif stage == 1:
        # Animal sur la ligne eye -> neurone
        ex = eye_pos[0] + (neuron_pos[0]-eye_pos[0])*progress
        ey = eye_pos[1] + (neuron_pos[1]-eye_pos[1])*progress
        scale_factor = 1 + weights[0]   # taille selon poids
        cat_size = (int(80*scale_factor), int(80*scale_factor))
        cat_img = pygame.transform.smoothscale(cat_img_original, cat_size)
        screen.blit(cat_img, (int(ex-cat_size[0]//2), int(ey-cat_size[1]//2)))
        draw_arrow((eye_pos[0]+60, eye_pos[1]), (neuron_pos[0]-70, neuron_pos[1]-50), YELLOW)
        draw_text_center("🐱 Le chat transporte le signal lumineux !", 60)
        progress += speed
        if progress>=1:
            progress=0
            stage=2

    elif stage == 2:
        # Animal sur la ligne oreille -> neurone
        ax = ear_pos[0] + (neuron_pos[0]-ear_pos[0])*progress
        ay = ear_pos[1] + (neuron_pos[1]-ear_pos[1])*progress
        scale_factor = 1 + weights[1]
        cat_size = (int(80*scale_factor), int(80*scale_factor))
        cat_img = pygame.transform.smoothscale(cat_img_original, cat_size)
        screen.blit(cat_img, (int(ax-cat_size[0]//2), int(ay-cat_size[1]//2)))
        draw_arrow((ear_pos[0]+60, ear_pos[1]), (neuron_pos[0]-70, neuron_pos[1]+50), RED)
        draw_text_center("🐱 Le chat transporte le signal sonore !", 60)
        progress += speed
        if progress>=1:
            progress=0
            stage=3

    elif stage == 3:
        # Sortie
        nx = neuron_pos[0] + (output_pos[0]-neuron_pos[0])*progress
        ny = neuron_pos[1] + (output_pos[1]-neuron_pos[1])*progress
        pygame.draw.circle(screen, GREEN, (int(nx), int(ny)), 12)
        draw_text_center("💡 La lampe s’allume si le signal est suffisant !", 60)
        progress += speed
        if progress>=1:
            progress=0
            stage=0

    # --- Info calcul ---
    info = font.render(f"Somme = x1*w1 + x2*w2 + bias = {weighted_sum:.2f}", True, BLACK)
    screen.blit(info, (250, 550))

    pygame.display.flip()
    clock.tick(60)

pygame.quit()




