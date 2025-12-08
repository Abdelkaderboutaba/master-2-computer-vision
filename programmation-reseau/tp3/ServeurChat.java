package tp3;

import java.io.*;
import java.net.*;
import java.util.Scanner;

public class ServeurChat {
    public static void main(String[] args) {
        int port = 5001; // port du serveur
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("Serveur démarré sur le port " + port);

            Socket clientSocket = serverSocket.accept();
            System.out.println("Client connecté : " + clientSocket.getInetAddress().getHostAddress());

            DataInputStream in = new DataInputStream(clientSocket.getInputStream());
            DataOutputStream out = new DataOutputStream(clientSocket.getOutputStream());
            Scanner scanner = new Scanner(System.in);

            String messageClient = "";
            while (!messageClient.equalsIgnoreCase("end")) {
                // Lire message du client
                messageClient = in.readUTF();
                System.out.println("Client : " + messageClient);

                if (messageClient.equalsIgnoreCase("end")) break;

                // Envoyer réponse du serveur
                System.out.print("Serveur : ");
                String messageServeur = scanner.nextLine();
                out.writeUTF(messageServeur);
            }

            System.out.println("Conversation terminée.");
            in.close();
            out.close();
            clientSocket.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
