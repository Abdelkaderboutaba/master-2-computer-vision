package tp2Thread.src;
/**
 * Classe principale pour tester la synchronisation
 */
public class TestThreads {
    
    public static void main(String[] args) {
        // Objet de verrouillage partagé pour synchroniser les affichages
        Object lock = new Object();
        
        // Création du thread A (Runnable)
        ThreadA threadA = new ThreadA(lock);
        Thread ta = new Thread(threadA);
        
        // Création du thread B (extends Thread)
        ThreadB threadB = new ThreadB(lock);
        
        System.out.println("=== Démarrage des threads synchronisés ===\n");
        
        // Démarrage des threads
        ta.start();
        threadB.start();
        
        // Attendre la fin des threads
        try {
            ta.join();
            threadB.join();
        } catch(InterruptedException e) {
            System.out.println("Thread principal interrompu");
        }
        
        System.out.println("=== Fin de l'exécution ===");
    }
}