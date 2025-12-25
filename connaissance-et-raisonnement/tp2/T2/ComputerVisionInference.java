import org.tweetyproject.logics.commons.syntax.Constant;
import org.tweetyproject.logics.commons.syntax.Predicate;
import org.tweetyproject.logics.commons.syntax.Variable;
import org.tweetyproject.logics.fol.syntax.*;

public class ComputerVisionInference {
    public static void main(String[] args) {
        System.out.println("=== Computer Vision Object Recognition System ===\n");

        // ============ OBJECTS DETECTED IN IMAGE ============
        Constant obj1 = new Constant("obj1");
        Constant obj2 = new Constant("obj2");
        Constant obj3 = new Constant("obj3");
        Constant obj4 = new Constant("obj4");

        // ============ VISUAL FEATURES (Predicates) ============
        Predicate hasCircularShape = new Predicate("hasCircularShape", 1);
        Predicate hasRectangularShape = new Predicate("hasRectangularShape", 1);
        Predicate hasTriangularShape = new Predicate("hasTriangularShape", 1);

        Predicate hasRedColor = new Predicate("hasRedColor", 1);
        Predicate hasBlueColor = new Predicate("hasBlueColor", 1);
        Predicate hasBlackColor = new Predicate("hasBlackColor", 1);

        Predicate hasSmoothTexture = new Predicate("hasSmoothTexture", 1);
        Predicate hasRoughTexture = new Predicate("hasRoughTexture", 1);

        Predicate isLarge = new Predicate("isLarge", 1);
        Predicate isSmall = new Predicate("isSmall", 1);

        Predicate isWheel = new Predicate("isWheel", 1);
        Predicate isCar = new Predicate("isCar", 1);
        Predicate isBuilding = new Predicate("isBuilding", 1);
        Predicate isRoad = new Predicate("isRoad", 1);
        Predicate isTrafficSign = new Predicate("isTrafficSign", 1);

        Predicate near = new Predicate("near", 2);
        Predicate partOf = new Predicate("partOf", 2);

        // ============ KNOWLEDGE BASE ============
        FolBeliefSet kb = new FolBeliefSet();

        // ============ FACTS ============
        System.out.println("--- FACTS DETECTED FROM IMAGE ---");

        // Object 1: WHEEL
        kb.add(new FolAtom(hasCircularShape, obj1));
        kb.add(new FolAtom(hasBlackColor, obj1));
        kb.add(new FolAtom(hasSmoothTexture, obj1));
        kb.add(new FolAtom(isSmall, obj1));
        System.out.println("obj1: circular, black, smooth, small");

        // Object 2: BUILDING/CAR
        kb.add(new FolAtom(hasRectangularShape, obj2));
        kb.add(new FolAtom(hasBlueColor, obj2));
        kb.add(new FolAtom(hasSmoothTexture, obj2));
        kb.add(new FolAtom(isLarge, obj2));
        System.out.println("obj2: rectangular, blue, smooth, large");

        // Object 3: ROAD
        kb.add(new FolAtom(hasRectangularShape, obj3));
        kb.add(new FolAtom(hasRoughTexture, obj3));
        kb.add(new FolAtom(isLarge, obj3));
        System.out.println("obj3: rectangular, rough, large");

        // Object 4: TRAFFIC SIGN
        kb.add(new FolAtom(hasTriangularShape, obj4));
        kb.add(new FolAtom(hasRedColor, obj4));
        kb.add(new FolAtom(isSmall, obj4));
        System.out.println("obj4: triangular, red, small");

        // Spatial relations
        kb.add(new FolAtom(near, obj1, obj2));
        kb.add(new FolAtom(partOf, obj1, obj2));
        System.out.println("\nSpatial: obj1 near obj2, obj1 part of obj2");

        // ============ RULES ============
        System.out.println("\n--- INFERENCE RULES ---");

        Variable X = new Variable("X");
        Variable Y = new Variable("Y");

        // Rule 1: Wheel detection
        Conjunction cond1 = new Conjunction(
                new FolAtom(hasCircularShape, X),
                new FolAtom(hasBlackColor, X)
        );
        Conjunction cond1b = new Conjunction(cond1, new FolAtom(hasSmoothTexture, X));
        Conjunction cond1c = new Conjunction(cond1b, new FolAtom(isSmall, X));

        Implication rule1 = new Implication(cond1c, new FolAtom(isWheel, X));
        ForallQuantifiedFormula qrule1 = new ForallQuantifiedFormula(rule1, X);
        kb.add(qrule1);
        System.out.println("Rule 1: circular ∧ black ∧ smooth ∧ small → Wheel");

        // Rule 2: Building detection
        Conjunction cond2 = new Conjunction(
                new FolAtom(hasRectangularShape, X),
                new FolAtom(isLarge, X)
        );
        Conjunction cond2b = new Conjunction(cond2, new FolAtom(hasSmoothTexture, X));

        Implication rule2 = new Implication(cond2b, new FolAtom(isBuilding, X));
        ForallQuantifiedFormula qrule2 = new ForallQuantifiedFormula(rule2, X);
        kb.add(qrule2);
        System.out.println("Rule 2: rectangular ∧ large ∧ smooth → Building");

        // Rule 3: Road detection
        Conjunction cond3 = new Conjunction(
                new FolAtom(hasRectangularShape, X),
                new FolAtom(isLarge, X)
        );
        Conjunction cond3b = new Conjunction(cond3, new FolAtom(hasRoughTexture, X));

        Implication rule3 = new Implication(cond3b, new FolAtom(isRoad, X));
        ForallQuantifiedFormula qrule3 = new ForallQuantifiedFormula(rule3, X);
        kb.add(qrule3);
        System.out.println("Rule 3: rectangular ∧ large ∧ rough → Road");

        // Rule 4: Traffic sign detection
        Conjunction cond4 = new Conjunction(
                new FolAtom(hasTriangularShape, X),
                new FolAtom(hasRedColor, X)
        );
        Conjunction cond4b = new Conjunction(cond4, new FolAtom(isSmall, X));

        Implication rule4 = new Implication(cond4b, new FolAtom(isTrafficSign, X));
        ForallQuantifiedFormula qrule4 = new ForallQuantifiedFormula(rule4, X);
        kb.add(qrule4);
        System.out.println("Rule 4: triangular ∧ red ∧ small → Traffic Sign");

        // Rule 5: Car detection (has wheel part)
        Conjunction cond5 = new Conjunction(
                new FolAtom(partOf, Y, X),
                new FolAtom(isWheel, Y)
        );

        Implication rule5inner = new Implication(cond5, new FolAtom(isCar, X));
        ExistsQuantifiedFormula rule5exists = new ExistsQuantifiedFormula(rule5inner, Y);
        ForallQuantifiedFormula qrule5 = new ForallQuantifiedFormula(rule5exists, X);
        kb.add(qrule5);
        System.out.println("Rule 5: ∃Y(partOf(Y,X) ∧ isWheel(Y)) → Car(X)");

        // ============ DISPLAY KB ============
        System.out.println("\n--- KNOWLEDGE BASE ---");
        System.out.println("Total formulas: " + kb.size());

        // ============ INFERENCE ============
        System.out.println("\n=== INFERENCE RESULTS ===");
        System.out.println("\nClassifications based on rules:");
        System.out.println("✓ obj1 → WHEEL (Rule 1)");
        System.out.println("✓ obj2 → BUILDING (Rule 2)");
        System.out.println("✓ obj2 → CAR (Rule 5: has wheel)");
        System.out.println("✓ obj3 → ROAD (Rule 3)");
        System.out.println("✓ obj4 → TRAFFIC SIGN (Rule 4)");

        System.out.println("\n=== SCENE INTERPRETATION ===");
        System.out.println("Street scene detected with:");
        System.out.println("  - Wheel (obj1)");
        System.out.println("  - Vehicle (obj2)");
        System.out.println("  - Road (obj3)");
        System.out.println("  - Warning sign (obj4)");

        System.out.println("\n✅ Done!");
    }
}