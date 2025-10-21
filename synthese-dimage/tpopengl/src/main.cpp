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
//         glLoadIdentity();
//         gluPerspective(45.0, 800.0/600.0, 0.1, 100.0);
        
//         glMatrixMode(GL_MODELVIEW);
//         glLoadIdentity();
//         glTranslatef(0.0f, 0.0f, -5.0f);
//         glRotatef(angle, 1.0f, 1.0f, 0.0f);
        
//         // Dessiner un cube coloré
//         glBegin(GL_QUADS);
//             // Face avant (rouge)
//             glColor3f(1.0f, 0.0f, 0.0f);
//             glVertex3f(-1.0f, -1.0f, 1.0f);
//             glVertex3f( 1.0f, -1.0f, 1.0f);
//             glVertex3f( 1.0f,  1.0f, 1.0f);
//             glVertex3f(-1.0f,  1.0f, 1.0f);
            
//             // Face arrière (vert)
//             glColor3f(0.0f, 1.0f, 0.0f);
//             glVertex3f(-1.0f, -1.0f, -1.0f);
//             glVertex3f(-1.0f,  1.0f, -1.0f);
//             glVertex3f( 1.0f,  1.0f, -1.0f);
//             glVertex3f( 1.0f, -1.0f, -1.0f);
            
//             // Face du haut (bleu)
//             glColor3f(0.0f, 0.0f, 1.0f);
//             glVertex3f(-1.0f, 1.0f, -1.0f);
//             glVertex3f(-1.0f, 1.0f,  1.0f);
//             glVertex3f( 1.0f, 1.0f,  1.0f);
//             glVertex3f( 1.0f, 1.0f, -1.0f);
            
//             // Face du bas (jaune)
//             glColor3f(1.0f, 1.0f, 0.0f);
//             glVertex3f(-1.0f, -1.0f, -1.0f);
//             glVertex3f( 1.0f, -1.0f, -1.0f);
//             glVertex3f( 1.0f, -1.0f,  1.0f);
//             glVertex3f(-1.0f, -1.0f,  1.0f);
//         glEnd();
        
//         angle += 0.5f;
        
//         glfwSwapBuffers(window);
//         glfwPollEvents();
//     }

//     glfwTerminate();
//     return 0;
// }


#include <GLFW/glfw3.h>
#include <iostream>

int main()
{
    // Initialisation de GLFW
    if (!glfwInit()) {
        std::cout << "Could not initialize glfw.\n";
        return -1;
    }

    // Création de la fenêtre
    GLFWwindow* window = glfwCreateWindow(640, 480, "OpenGL TP 1", NULL, NULL);
    if (!window) {
        glfwTerminate();
        return -1;
    }

    glfwMakeContextCurrent(window);

    // Définir la couleur de fond (R, G, B, Alpha)
    glClearColor(1.0f, 0.5f, 0.5f, 1.0f);

    // Boucle principale
    while (!glfwWindowShouldClose(window)) {
        glClear(GL_COLOR_BUFFER_BIT);
        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    glfwTerminate();
    return 0;
}
