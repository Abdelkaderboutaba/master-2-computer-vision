package src;

import java.awt.*;
import java.awt.event.*;
import java.io.*;
import java.util.Date;

public class Explorateur extends Frame implements ActionListener, MouseListener {

    private List list;            // liste des fichiers / dossiers
    private TextField infoField;  // infos sur l'élément sélectionné
    private File currentDir;      // répertoire courant
    private Button btnParent;     // pour remonter d’un dossier

    public Explorateur() {
        super("Explorateur Simple");

        // Layout principal
        setLayout(new BorderLayout());

        // Liste
        list = new List();
        list.addMouseListener(this);
        add(list, BorderLayout.CENTER);

        // Zone d'infos
        infoField = new TextField();
        infoField.setEditable(false);
        add(infoField, BorderLayout.SOUTH);

        // Bouton pour remonter
        Panel topPanel = new Panel();
        btnParent = new Button("Dossier parent");
        btnParent.addActionListener(this);
        topPanel.add(btnParent);
        add(topPanel, BorderLayout.NORTH);

        // Dossier initial (home)
        currentDir = new File(System.getProperty("user.home"));
        afficherRepertoire(currentDir);

        setSize(500, 400);
        setVisible(true);
    }

    // Afficher le contenu d'un répertoire dans la List
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

    // Afficher les informations d'un fichier/dossier sélectionné
    private void afficherInfos(File f) {
        String infos = "";

        infos += "Nom : " + f.getName();
        infos += " | Taille : " + f.length() + " octets";
        infos += " | Modifié : " + new Date(f.lastModified());

        infoField.setText(infos);
    }

    // Ouvrir un fichier dans une fenêtre FileLister
    private void ouvrirFichier(File f) {
        new FileLister(f.getAbsolutePath());  // fenêtre qui lit et affiche le fichier
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btnParent) {
            File parent = currentDir.getParentFile();
            if (parent != null) {
                afficherRepertoire(parent);
            }
        }
    }

    // =================== MouseListener ======================
    @Override
    public void mouseClicked(MouseEvent e) {

        int index = list.getSelectedIndex();
        if (index == -1) return;

        File f = new File(currentDir, list.getItem(index));

        // Simple clic → afficher infos
        if (e.getClickCount() == 1) {
            afficherInfos(f);
        }

        // Double-clic
        if (e.getClickCount() == 2) {
            if (f.isDirectory()) {
                afficherRepertoire(f);      // entrer dans le dossier
            } else {
                ouvrirFichier(f);           // ouvrir le fichier dans FileLister
            }
        }
    }

    // Méthodes inutilisées mais obligatoires
    public void mousePressed(MouseEvent e) {}
    public void mouseReleased(MouseEvent e) {}
    public void mouseEntered(MouseEvent e) {}
    public void mouseExited(MouseEvent e) {}

    // MAIN
    public static void main(String[] args) {
        new Explorateur();
    }
}
