package src;

import java.io.*;

public class fichier {

    // Nom du fichier sur lequel on travaille
    public static String name = "test.txt";

    // Lire le fichier texte et afficher son contenu
    public static void afficherFichier() throws FileNotFoundException {
        try {
            InputStream is = new FileInputStream(name);
            byte[] b = new byte[50];

            while (is.read(b) != -1) {
                System.out.println(new String(b));
            }

            is.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Écrire un texte dans un fichier
    public static void ecrireFichier(String s) {
        try {
            OutputStream os = new FileOutputStream(name);
            os.write((s + "\n").getBytes());
            os.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Lire un objet sérialisé
    public static Object afficherObjectFichier() throws FileNotFoundException {
        try {
            ObjectInputStream ois = new ObjectInputStream(new FileInputStream(name));
            Object o = ois.readObject();
            System.out.println(o);
            ois.close();
            return o;
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }

    // Écrire un objet sérialisé dans un fichier
    public static void ecrireObjectFichier(Object o) {
        try {
            ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(name));
            oos.writeObject(o);
            oos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
