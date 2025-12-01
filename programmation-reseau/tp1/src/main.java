package src;

import java.io.FileNotFoundException;

public class main {

    public static void main(String[] args) {

        System.out.println("=== TEST 1 : Texte ===");
        try {
            fichier.ecrireFichier("bon");
            fichier.afficherFichier();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        System.out.println("\n=== TEST 2 : Objet sérialisé ===");
        try {
            Object o = new String("goodmorning");
            fichier.ecrireObjectFichier(o);

            String s = (String) fichier.afficherObjectFichier();
            System.out.println("Objet lu : " + s);

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }
}
