package tp3;

import java.io.*;
import java.net.*;
import java.util.Scanner;

public class ClientChat {
    public static void main(String[] args) {
        String serverIP = "127.0.0.1"; // IP du serveur
        int port = 5001;

        try (Socket socket = new Socket(serverIP, port)) {
            DataInputStream in = new DataInputStream(socket.getInputStream());
            DataOutputStream out = new DataOutputStream(socket.getOutputStream());
            Scanner scanner = new Scanner(System.in);

            String messageClient = "";
            while (!messageClient.equalsIgnoreCase("end")) {
                // Envoyer message au serveur
                System.out.print("Client : ");
                messageClient = scanner.nextLine();
                out.writeUTF(messageClient);

                if (messageClient.equalsIgnoreCase("end")) break;

                // Lire réponse du serveur
                String messageServeur = in.readUTF();
                System.out.println("Serveur : " + messageServeur);
            }

            System.out.println("Conversation terminée.");
            in.close();
            out.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
