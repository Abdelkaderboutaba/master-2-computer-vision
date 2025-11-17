import java.io.*;

public class Fichier {

    // Nom du fichier utilisé
    public static String name = "data.txt";

    // Lire et afficher le fichier ligne par ligne
    public static void afficherFichier() throws FileNotFoundException {
        try {
            InputStream is = new FileInputStream(name);
            byte[] buffer = new byte[50];

            int n;
            while ((n = is.read(buffer)) != -1) {
                System.out.println(new String(buffer, 0, n));
            }

            is.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Écrire une chaîne dans un fichier
    public static void ecrireFichier(String s) {
        try {
            OutputStream os = new FileOutputStream(name);
            s = s + "\n";
            os.write(s.getBytes());
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
            ois.close();
            System.out.println(o);
            return o;

        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }

        return null;
    }

    // Écrire un objet sérialisable dans un fichier
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
