package src;

import java.awt.*;
import java.awt.event.*;
import java.io.*;

import javax.swing.*;

public class visualiseur extends JFrame implements ActionListener {

    // Composants de la fenêtre
    private TextArea textArea;
    private Button btnOuvrir;
    private Button btnQuitter;

    public visualiseur() {
        super("Visualiseur de fichiers");

        // Zone de texte
        textArea = new TextArea();
        add(textArea, BorderLayout.CENTER);

        // Panel du bas avec les boutons
        Panel panel = new Panel();
        panel.setLayout(new FlowLayout());

        btnOuvrir = new Button("Ouvrir");
        btnQuitter = new Button("Quitter");

        btnOuvrir.addActionListener(this);
        btnQuitter.addActionListener(this);

        panel.add(btnOuvrir);
        panel.add(btnQuitter);

        add(panel, BorderLayout.SOUTH);

        // Paramètres de la fenêtre
        setSize(600, 400);
        setVisible(true);
    }

    @Override
    public void actionPerformed(ActionEvent e) {

        if (e.getSource() == btnOuvrir) {
            ouvrirEtLireFichier();
        }

        if (e.getSource() == btnQuitter) {
            System.exit(0);
        }
    }

    // 🔹 Lecture d’un fichier texte dans un buffer char[]
    private void ouvrirEtLireFichier() {

        FileDialog fd = new FileDialog(this, "Choisir un fichier", FileDialog.LOAD);
        fd.setVisible(true);

        String directory = fd.getDirectory();
        String file = fd.getFile();

        if (file == null) return;  // Annulé

        File f = new File(directory + file);

        try {
            long taille = f.length();            // taille du fichier
            char[] buffer = new char[(int) taille];

            FileReader fr = new FileReader(f);
            fr.read(buffer);                     // lire dans le tampon
            fr.close();

            textArea.setText(new String(buffer)); // afficher

        } catch (IOException ex) {
            JOptionPane.showMessageDialog(this,
                    "Erreur de lecture : " + ex.getMessage(),
                    "Erreur",
                    JOptionPane.ERROR_MESSAGE);
        }
    }

    public static void main(String[] args) {
        new visualiseur();
    }
}


