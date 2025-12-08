package tp2Thread.src;

public class PrintDemo {
    
    /**
     * Méthode qui affiche les entiers de 5 à 1
     */
    public void printCount() {
        try {
            for(int i = 5; i > 0; i--) {
                System.out.println("Counter --- " + i);
            }
        } catch(Exception e) {
            System.out.println("Thread interrupted.");
        }
    }
}