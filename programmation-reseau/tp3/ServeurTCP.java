package tp3;

import java.io.*;
import java.net.*;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ServeurTCP {
    public static void main(String[] args) {
        int port = 5000; // Choisir un port libre
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("Serveur démarré sur le port " + port);

            while (true) {
                Socket clientSocket = serverSocket.accept(); // accepter la connexion client
                System.out.println("Client connecté : " + clientSocket.getInetAddress().getHostAddress());

                // Flux pour communiquer avec le client
                DataOutputStream out = new DataOutputStream(clientSocket.getOutputStream());
                DataInputStream in = new DataInputStream(clientSocket.getInputStream());

                // 1. Envoyer la date et l'heure au client
                String dateHeure = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
                out.writeUTF(dateHeure);

                // 2. Lire l'adresse IP du client envoyée
                String clientIP = in.readUTF();
                System.out.println("Adresse IP reçue du client : " + clientIP);

                // Fermer les flux et le socket client
                in.close();
                out.close();
                clientSocket.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
