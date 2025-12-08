package tp2Thread.src;

/**
 * Thread A implémentant Runnable
 * Affiche un texte de 6 lignes toutes les 100ms
 */
public class ThreadA implements Runnable {
    
    private Object lock;
    
    /**
     * Constructeur avec objet de verrouillage pour synchronisation
     * @param lock - objet partagé pour synchroniser l'affichage
     */
    public ThreadA(Object lock) {
        this.lock = lock;
    }
    
    @Override
    public void run() {
        for(int i = 0; i < 5; i++) {
            // Synchronisation sur l'objet lock
            synchronized(lock) {
                afficherTexte();
            }
            
            try {
                Thread.sleep(100); // Attendre 100ms
            } catch(InterruptedException e) {
                System.out.println("Thread A interrompu");
            }
        }
    }
    
    /**
     * Méthode pour afficher le texte du thread A
     */
    private void afficherTexte() {
        System.out.println("Affichage du thread A :");
        System.out.println("2ème ligne du thread A");
        System.out.println("3ème ligne du thread A");
        System.out.println("4ème ligne du thread A");
        System.out.println("5ème ligne du thread A");
        System.out.println("6ème ligne du thread A");
        System.out.println(); // Ligne vide pour la lisibilité
    }
}