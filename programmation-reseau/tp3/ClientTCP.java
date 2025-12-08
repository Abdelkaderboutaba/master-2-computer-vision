package tp3;

import java.io.*;
import java.net.*;

public class ClientTCP {
    public static void main(String[] args) {
        String serverIP = "127.0.0.1"; // Remplacer par l'IP du serveur si distant
        int port = 5000;

        try (Socket socket = new Socket(serverIP, port)) {

            // Flux pour communiquer avec le serveur
            DataOutputStream out = new DataOutputStream(socket.getOutputStream());
            DataInputStream in = new DataInputStream(socket.getInputStream());

            // 1. Recevoir la date et l'heure du serveur
            String dateHeure = in.readUTF();
            System.out.println("Date et heure du serveur : " + dateHeure);

            // 2. Envoyer son adresse IP au serveur
            String clientIP = InetAddress.getLocalHost().getHostAddress();
            out.writeUTF(clientIP);

            // Fermer les flux
            in.close();
            out.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
