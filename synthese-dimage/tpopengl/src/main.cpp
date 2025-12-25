#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <iostream>
#include "shader.hpp"

int main() {
    // ========================================
    // 1. INITIALISATION GLFW
    // ========================================
    if (!glfwInit()) {
        std::cerr << "Erreur : GLFW init failed" << std::endl;
        return -1;
    }

    // Configuration OpenGL 3.3 Core Profile
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    // Créer la fenêtre
    GLFWwindow* window = glfwCreateWindow(800, 600, "Mon Premier Triangle OpenGL Moderne", NULL, NULL);
    if (!window) {
        std::cerr << "Erreur : Window creation failed" << std::endl;
        glfwTerminate();
        return -1;
    }

    glfwMakeContextCurrent(window);

    // ========================================
    // 2. INITIALISATION GLAD
    // ========================================
    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
        std::cerr << "Erreur : GLAD init failed" << std::endl;
        return -1;
    }

    std::cout << "OpenGL Version : " << glGetString(GL_VERSION) << std::endl;

    // ========================================
    // 3. CHARGER LES SHADERS
    // ========================================
    GLuint programID = LoadShaders("simplevertexshader", "simplefragmentshader");

    // ========================================
    // 4. CRÉER UN TRIANGLE
    // ========================================
    
    // Coordonnées des 3 sommets du triangle
    GLfloat vertices[] = {
        -0.5f, -0.5f, 0.0f,  // Sommet 1 (bas gauche)
         0.5f, -0.5f, 0.0f,  // Sommet 2 (bas droite)
         0.0f,  0.5f, 0.0f   // Sommet 3 (haut centre)
    };

    // Créer le VAO (Vertex Array Object)
    GLuint VAO;
    glGenVertexArrays(1, &VAO);
    glBindVertexArray(VAO);

    // Créer le VBO (Vertex Buffer Object)
    GLuint VBO;
    glGenBuffers(1, &VBO);
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

    // Configurer les attributs de sommets
    glVertexAttribPointer(
        0,                  // layout(location = 0) dans le vertex shader
        3,                  // 3 valeurs par sommet (x, y, z)
        GL_FLOAT,           // type de données
        GL_FALSE,           // normaliser ?
        3 * sizeof(float),  // taille d'un sommet
        (void*)0            // offset
    );
    glEnableVertexAttribArray(0);

    // ========================================
    // 5. BOUCLE DE RENDU
    // ========================================
    
    while (!glfwWindowShouldClose(window)) {
        // Effacer l'écran (noir)
        glClearColor(0.1f, 0.1f, 0.1f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        // Utiliser le programme shader
        glUseProgram(programID);

        // Dessiner le triangle
        glBindVertexArray(VAO);
        glDrawArrays(GL_TRIANGLES, 0, 3);

        // Afficher et gérer les événements
        glfwSwapBuffers(window);
        glfwPollEvents();

        // ESC pour fermer
        if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS) {
            glfwSetWindowShouldClose(window, true);
        }
    }

    // ========================================
    // 6. NETTOYAGE
    // ========================================
    
    glDeleteVertexArrays(1, &VAO);
    glDeleteBuffers(1, &VBO);
    glDeleteProgram(programID);

    glfwTerminate();
    return 0;
}
