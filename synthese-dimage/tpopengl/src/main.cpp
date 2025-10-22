// #define GLFW_INCLUDE_GLU
// #include <GLFW/glfw3.h>
// #include <cmath>

// int main() {
//     if (!glfwInit()) return -1;

//     GLFWwindow* window = glfwCreateWindow(800, 600, "OpenGL Rotation", NULL, NULL);
//     if (!window) {
//         glfwTerminate();
//         return -1;
//     }

//     glfwMakeContextCurrent(window);
    
//     float angle = 0.0f;

//     while (!glfwWindowShouldClose(window)) {
//         glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        
//         glMatrixMode(GL_PROJECTION);
// //         glLoadIdentity();
// //         gluPerspective(45.0, 800.0/600.0, 0.1, 100.0);
        
// //         glMatrixMode(GL_MODELVIEW);
// //         glLoadIdentity();
// //         glTranslatef(0.0f, 0.0f, -5.0f);
// //         glRotatef(angle, 1.0f, 1.0f, 0.0f);
        
// //         // Dessiner un cube coloré
// //         glBegin(GL_QUADS);
// //             // Face avant (rouge)
// //             glColor3f(1.0f, 0.0f, 0.0f);
// //             glVertex3f(-1.0f, -1.0f, 1.0f);
// //             glVertex3f( 1.0f, -1.0f, 1.0f);
// //             glVertex3f( 1.0f,  1.0f, 1.0f);
// //             glVertex3f(-1.0f,  1.0f, 1.0f);
            
// //             // Face arrière (vert)
// //             glColor3f(0.0f, 1.0f, 0.0f);
// //             glVertex3f(-1.0f, -1.0f, -1.0f);
// //             glVertex3f(-1.0f,  1.0f, -1.0f);
// //             glVertex3f( 1.0f,  1.0f, -1.0f);
// //             glVertex3f( 1.0f, -1.0f, -1.0f);
            
// //             // Face du haut (bleu)
// //             glColor3f(0.0f, 0.0f, 1.0f);
// //             glVertex3f(-1.0f, 1.0f, -1.0f);
// //             glVertex3f(-1.0f, 1.0f,  1.0f);
// //             glVertex3f( 1.0f, 1.0f,  1.0f);
// //             glVertex3f( 1.0f, 1.0f, -1.0f);
            
// //             // Face du bas (jaune)
// //             glColor3f(1.0f, 1.0f, 0.0f);
// //             glVertex3f(-1.0f, -1.0f, -1.0f);
// //             glVertex3f( 1.0f, -1.0f, -1.0f);
// //             glVertex3f( 1.0f, -1.0f,  1.0f);
// //             glVertex3f(-1.0f, -1.0f,  1.0f);
// //         glEnd();
        
// //         angle += 0.5f;
        
// //         glfwSwapBuffers(window);
// //         glfwPollEvents();
// //     }

// //     glfwTerminate();
// //     return 0;
// // }


// #include <GLFW/glfw3.h>
// #include <iostream>

// int main()
// {
//     // Initialisation de GLFW
//     if (!glfwInit()) {
//         std::cout << "Could not initialize glfw.\n";
//         return -1;
//     }

//     // Création de la fenêtre
//     GLFWwindow* window = glfwCreateWindow(640, 480, "OpenGL TP 1", NULL, NULL);
//     if (!window) {
//         glfwTerminate();
//         return -1;
//     }

//     glfwMakeContextCurrent(window);

//     // Définir la couleur de fond (R, G, B, Alpha)
//     glClearColor(1.0f, 0.5f, 0.5f, 1.0f);

//     // Boucle principale
//     while (!glfwWindowShouldClose(window)) {
//         glClear(GL_COLOR_BUFFER_BIT);
//         glfwSwapBuffers(window);
//         glfwPollEvents();
//     }

//     glfwTerminate();
//     return 0;
// }




#include <GLFW/glfw3.h>
#include <stdio.h>
#include <math.h>

// Variables pour contrôler la caméra
float camX = 0.0f, camY = 0.0f, camZ = 5.0f;
float lookX = 0.0f, lookY = 0.0f, lookZ = 0.0f;
int viewMode = 1; // Mode de vue (1-8)

// Fonction gluLookAt manuelle (car GLU peut ne pas être disponible partout)
void myLookAt(float eyeX, float eyeY, float eyeZ,
              float centerX, float centerY, float centerZ,
              float upX, float upY, float upZ) {
    float forward[3], side[3], up[3];
    float m[16];
    
    forward[0] = centerX - eyeX;
    forward[1] = centerY - eyeY;
    forward[2] = centerZ - eyeZ;
    
    // Normaliser forward
    float len = sqrt(forward[0]*forward[0] + forward[1]*forward[1] + forward[2]*forward[2]);
    forward[0] /= len;
    forward[1] /= len;
    forward[2] /= len;
    
    
    // Calculer side = forward x up
    side[0] = forward[1]*upZ - forward[2]*upY;
    side[1] = forward[2]*upX - forward[0]*upZ;
    side[2] = forward[0]*upY - forward[1]*upX;
    
    // Normaliser side
    len = sqrt(side[0]*side[0] + side[1]*side[1] + side[2]*side[2]);
    side[0] /= len;
    side[1] /= len;
    side[2] /= len;
    
    // Recalculer up = side x forward
    up[0] = side[1]*forward[2] - side[2]*forward[1];
    up[1] = side[2]*forward[0] - side[0]*forward[2];
    up[2] = side[0]*forward[1] - side[1]*forward[0];
    
    // Créer la matrice
    m[0] = side[0];
    m[1] = up[0];
    m[2] = -forward[0];
    m[3] = 0.0f;
    
    m[4] = side[1];
    m[5] = up[1];
    m[6] = -forward[1];
    m[7] = 0.0f;
    
    m[8] = side[2];
    m[9] = up[2];
    m[10] = -forward[2];
    m[11] = 0.0f;
    
    m[12] = 0.0f;
    m[13] = 0.0f;
    m[14] = 0.0f;
    m[15] = 1.0f;
    
    glMultMatrixf(m);
    glTranslatef(-eyeX, -eyeY, -eyeZ);
}

// Fonction gluPerspective manuelle
void myPerspective(float fovy, float aspect, float zNear, float zFar) {
    float fH = tan(fovy / 360.0f * 3.14159265f) * zNear;
    float fW = fH * aspect;
    glFrustum(-fW, fW, -fH, fH, zNear, zFar);
}

// Fonction pour dessiner un cube coloré
void drawCube() {
    glBegin(GL_QUADS);
    
    // Face avant (rouge)
    glColor3f(1.0f, 0.0f, 0.0f);
    glVertex3f(-0.5f, -0.5f, 0.5f);
    glVertex3f(0.5f, -0.5f, 0.5f);
    glVertex3f(0.5f, 0.5f, 0.5f);
    glVertex3f(-0.5f, 0.5f, 0.5f);
    
    // Face arrière (vert)
    glColor3f(0.0f, 1.0f, 0.0f);
    glVertex3f(-0.5f, -0.5f, -0.5f);
    glVertex3f(-0.5f, 0.5f, -0.5f);
    glVertex3f(0.5f, 0.5f, -0.5f);
    glVertex3f(0.5f, -0.5f, -0.5f);
    
    // Face gauche (bleu)
    glColor3f(0.0f, 0.0f, 1.0f);
    glVertex3f(-0.5f, -0.5f, -0.5f);
    glVertex3f(-0.5f, -0.5f, 0.5f);
    glVertex3f(-0.5f, 0.5f, 0.5f);
    glVertex3f(-0.5f, 0.5f, -0.5f);
    
    // Face droite (jaune)
    glColor3f(1.0f, 1.0f, 0.0f);
    glVertex3f(0.5f, -0.5f, -0.5f);
    glVertex3f(0.5f, 0.5f, -0.5f);
    glVertex3f(0.5f, 0.5f, 0.5f);
    glVertex3f(0.5f, -0.5f, 0.5f);
    
    // Face haut (cyan)
    glColor3f(0.0f, 1.0f, 1.0f);
    glVertex3f(-0.5f, 0.5f, -0.5f);
    glVertex3f(-0.5f, 0.5f, 0.5f);
    glVertex3f(0.5f, 0.5f, 0.5f);
    glVertex3f(0.5f, 0.5f, -0.5f);
    
    // Face bas (magenta)
    glColor3f(1.0f, 0.0f, 1.0f);
    glVertex3f(-0.5f, -0.5f, -0.5f);
    glVertex3f(0.5f, -0.5f, -0.5f);
    glVertex3f(0.5f, -0.5f, 0.5f);
    glVertex3f(-0.5f, -0.5f, 0.5f);
    
    glEnd();
}

// Fonction pour dessiner les axes de référence
void drawAxes() {
    glLineWidth(2.0f);
    glBegin(GL_LINES);
    
    // Axe X (rouge)
    glColor3f(1.0f, 0.0f, 0.0f);
    glVertex3f(0.0f, 0.0f, 0.0f);
    glVertex3f(2.0f, 0.0f, 0.0f);
    
    // Axe Y (vert)
    glColor3f(0.0f, 1.0f, 0.0f);
    glVertex3f(0.0f, 0.0f, 0.0f);
    glVertex3f(0.0f, 2.0f, 0.0f);
    
    // Axe Z (bleu)
    glColor3f(0.0f, 0.0f, 1.0f);
    glVertex3f(0.0f, 0.0f, 0.0f);
    glVertex3f(0.0f, 0.0f, 2.0f);
    
    glEnd();
    glLineWidth(1.0f);
}

// Fonction de rendu
void render() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    
    // Configuration de la projection
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    myPerspective(45.0f, 1.0f, 0.1f, 100.0f);
    
    // Configuration de la visualisation
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
    
    // Différents modes de vue selon viewMode
    switch(viewMode) {
        case 1: // Vue par défaut - caméra éloignée
            camX = 0.0f; camY = 0.0f; camZ = 5.0f;
            lookX = 0.0f; lookY = 0.0f; lookZ = 0.0f;
            myLookAt(7.0f, 0.0f, 0.0f,   0.0f, 0.0f, 0.0f,   0.0f, 1.0f, 0.0f);

            break;
        case 2: // Vue rapprochée
            camX = 0.0f; camY = 0.0f; camZ = 3.0f;
            lookX = 0.0f; lookY = 0.0f; lookZ = 0.0f;
            myLookAt(camX, camY, camZ, lookX, lookY, lookZ, 0.0f, 1.0f, 0.0f);
            break;
        case 3: // Vue très éloignée
            camX = 0.0f; camY = 0.0f; camZ = 10.0f;
            lookX = 0.0f; lookY = 0.0f; lookZ = 0.0f;
            myLookAt(camX, camY, camZ, lookX, lookY, lookZ, 0.0f, 1.0f, 0.0f);
            break;
        case 4: // Vue latérale (côté X)
            camX = 5.0f; camY = 0.0f; camZ = 0.0f;
            lookX = 0.0f; lookY = 0.0f; lookZ = 0.0f;
            myLookAt(camX, camY, camZ, lookX, lookY, lookZ, 0.0f, 1.0f, 0.0f);
            break;
        case 5: // Vue de dessus
            camX = 0.0f; camY = 5.0f; camZ = 0.0f;
            lookX = 0.0f; lookY = 0.0f; lookZ = 0.0f;
            myLookAt(camX, camY, camZ, lookX, lookY, lookZ, 0.0f, 0.0f, -1.0f);
            break;
        case 6: // Vue diagonale
            camX = 3.0f; camY = 3.0f; camZ = 5.0f;
            lookX = 0.0f; lookY = 0.0f; lookZ = 0.0f;
            myLookAt(camX, camY, camZ, lookX, lookY, lookZ, 0.0f, 1.0f, 0.0f);
            break;
        case 7: // Point de référence déplacé vers la droite
            camX = 0.0f; camY = 0.0f; camZ = 5.0f;
            lookX = 1.0f; lookY = 0.0f; lookZ = 0.0f;
            myLookAt(camX, camY, camZ, lookX, lookY, lookZ, 0.0f, 1.0f, 0.0f);
            break;
        case 8: // Point de référence déplacé vers le haut
            camX = 0.0f; camY = 0.0f; camZ = 5.0f;
            lookX = 0.0f; lookY = 1.0f; lookZ = 0.0f;
            myLookAt(camX, camY, camZ, lookX, lookY, lookZ, 0.0f, 1.0f, 0.0f);
            break;
    }
    
    // Dessiner la scène
    drawAxes();
    drawCube();
    
    printf("\rMode %d - Camera: (%.1f, %.1f, %.1f) -> (%.1f, %.1f, %.1f)    ", 
           viewMode, camX, camY, camZ, lookX, lookY, lookZ);
    fflush(stdout);
}

// Callback pour les touches du clavier
void key_callback(GLFWwindow* window, int key, int scancode, int action, int mods) {
    if (action == GLFW_PRESS) {
        switch(key) {
            case GLFW_KEY_1: viewMode = 1; break;
            case GLFW_KEY_2: viewMode = 2; break;
            case GLFW_KEY_3: viewMode = 3; break;
            case GLFW_KEY_4: viewMode = 4; break;
            case GLFW_KEY_5: viewMode = 5; break;
            case GLFW_KEY_6: viewMode = 6; break;
            case GLFW_KEY_7: viewMode = 7; break;
            case GLFW_KEY_8: viewMode = 8; break;
            case GLFW_KEY_ESCAPE: glfwSetWindowShouldClose(window, GLFW_TRUE); break;
        }
    }
}

int main() {
    // Initialiser GLFW
    if (!glfwInit()) {
        printf("Erreur lors de l'initialisation de GLFW\n");
        return -1;
    }
    
    // Créer une fenêtre
    GLFWwindow* window = glfwCreateWindow(800, 600, "OpenGL - Visualisation et Projection", NULL, NULL);
    if (!window) {
        printf("Erreur lors de la creation de la fenetre\n");
        glfwTerminate();
        return -1;
    }
    
    // Activer le contexte OpenGL
    glfwMakeContextCurrent(window);
    glfwSetKeyCallback(window, key_callback);
    
    // Configuration OpenGL
    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
    glEnable(GL_DEPTH_TEST);
    
    printf("=== Controles ===\n");
    printf("1 : Vue par defaut (camera eloignee)\n");
    printf("2 : Vue rapprochee\n");
    printf("3 : Vue tres eloignee\n");
    printf("4 : Vue laterale (axe X)\n");
    printf("5 : Vue de dessus (axe Y)\n");
    printf("6 : Vue diagonale\n");
    printf("7 : Point de reference deplace vers la droite\n");
    printf("8 : Point de reference deplace vers le haut\n");
    printf("ESC : Quitter\n\n");
    
    // Boucle principale
    while (!glfwWindowShouldClose(window)) {
        render();
        
        glfwSwapBuffers(window);
        glfwPollEvents();
    }
    
    glfwTerminate();
    return 0;
}