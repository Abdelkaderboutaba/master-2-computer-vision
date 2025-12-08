package src;

import java.awt.*;
import java.io.*;

public class FileLister extends Frame {

    public FileLister(String path) {
        super("Fichier : " + path);

        TextArea text = new TextArea();
        add(text);

        try {
            File file = new File(path);
            FileReader fr = new FileReader(file);

            char[] buffer = new char[(int) file.length()];
            fr.read(buffer);
            text.setText(new String(buffer));
            fr.close();

        } catch (Exception e) {
            text.setText("Impossible de lire le fichier : " + e.getMessage());
        }

        setSize(600, 400);
        setVisible(true);
    }
}
