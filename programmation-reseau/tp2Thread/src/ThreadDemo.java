package tp2Thread.src;

/**
 * Classe ThreadDemo - Thread qui utilise PrintDemo pour afficher
 */
public class ThreadDemo extends Thread {
    
    // Variables d'instance
    private Thread t;
    private String threadName;
    private PrintDemo PD;
    
    /**
     * Constructeur
     * @param name - nom du thread
     * @param pd - instance de PrintDemo
     */
    public ThreadDemo(String name, PrintDemo pd) {
        this.threadName = name;
        this.PD = pd;
    }
    
    /**
     * Méthode run() - Version synchronisée
     * Utilisation de synchronized pour afficher séquentiellement
     */
    public void run() {
        System.out.println("Début du " + threadName);
        synchronized(PD) {
            PD.printCount();
        }
        System.out.println("Fin du " + threadName);
    }
}
