package tp2Thread.src;


/**
 * Classe TestThread - Classe principale pour tester les threads
 */
public class TestThread {
    
    public static void main(String args[]) {
        // Déclaration et instanciation de PrintDemo
        PrintDemo PD = new PrintDemo();
        
        // Déclaration et instanciation des threads
        ThreadDemo T1 = new ThreadDemo("Thread - 1", PD);
        ThreadDemo T2 = new ThreadDemo("Thread - 2", PD);
        
        // Lancement des threads
        T1.start();
        T2.start();
        
        // Optionnel : Attendre la fin des threads
        try {
            T1.join();
            T2.join();
        } catch(InterruptedException e) {
            System.out.println("Main thread interrupted.");
        }
        
        System.out.println("Fin du programme principal");
    }
}