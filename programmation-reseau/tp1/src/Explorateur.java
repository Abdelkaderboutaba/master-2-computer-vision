package src;

import java.awt.*;
import java.awt.event.*;
import java.io.*;
import java.util.Date;

public class Explorateur extends Frame implements ActionListener, MouseListener {

    private List list;            // liste des fichiers / dossiers
    private TextField infoField;  // infos sur l'élément sélectionné
    private File currentDir;      // répertoire courant
    private Button btnParent;     // bouton "Dossier parent"

    public Explorateur() {
        super("Explorateur Simple");

        setLayout(new BorderLayout());

        // Liste centrale
        list = new List();
        list.addMouseListener(this);
        add(list, BorderLayout.CENTER);

        // Zone d'informations
        infoField = new TextField();
        infoField.setEditable(false);
        add(infoField, BorderLayout.SOUTH);

        // Bouton haut pour remonter
        Panel topPanel = new Panel();
        btnParent = new Button("Dossier parent");
        btnParent.addActionListener(this);
        topPanel.add(btnParent);
        add(topPanel, BorderLayout.NORTH);

        // Dossier de départ (home)
        currentDir = new File(System.getProperty("user.home"));
        afficherRepertoire(currentDir);

        setSize(600, 400);
        setVisible(true);
    }

    // ----------------- Afficher contenu d'un dossier -----------------
    private void afficherRepertoire(File dir) {
        list.removeAll();
        currentDir = dir;

        File[] files = dir.listFiles();
        if (files == null) return;

        for (File f : files) {
            list.add(f.getName());
        }

        infoField.setText("Répertoire : " + dir.getAbsolutePath());
    }

    // ----------------- Afficher infos fichier/dossier -----------------
    private void afficherInfos(File f) {
        String infos = "Nom : " + f.getName() +
                       " | Taille : " + f.length() + " octets" +
                       " | Modifié : " + new Date(f.lastModified());

        infoField.setText(infos);
    }

    // ----------------- Ouvrir fichier dans une autre fenêtre -----------------
    private void ouvrirFichier(File f) {
        new FileLister(f.getAbsolutePath());
    }

    // ----------------- Bouton dossier parent -----------------
    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btnParent) {
            File parent = currentDir.getParentFile();
            if (parent != null) afficherRepertoire(parent);
        }
    }

    // ----------------- Gestion des clics souris -----------------
    @Override
    public void mouseClicked(MouseEvent e) {
        int index = list.getSelectedIndex();
        if (index == -1) return;

        File f = new File(currentDir, list.getItem(index));

        // simple clic → info
        if (e.getClickCount() == 1) {
            afficherInfos(f);
        }

        // double clic → ouvrir / entrer
        if (e.getClickCount() == 2) {
            if (f.isDirectory()) {
                afficherRepertoire(f);
            } else {
                ouvrirFichier(f);
            }
        }
    }

    public void mousePressed(MouseEvent e) {}
    public void mouseReleased(MouseEvent e) {}
    public void mouseEntered(MouseEvent e) {}
    public void mouseExited(MouseEvent e) {}

    // ----------------- MAIN -----------------
    public static void main(String[] args) {
        new Explorateur();
    }
}
