package be.fnord.DefaultLogic;

import java.util.HashSet;
import be.fnord.util.logic.DefaultReasoner;
import be.fnord.util.logic.WFF;
import be.fnord.util.logic.defaultLogic.DefaultRule;
import be.fnord.util.logic.defaultLogic.RuleSet;
import be.fnord.util.logic.defaultLogic.WorldSet;


public class CVVehicleDetection {


    public static void scenarioBasicDetection() {
        a.e.println("========================================");
        a.e.println("SCENARIO 1: Basic Object Detection");
        a.e.println("========================================\n");

        WorldSet myWorld = new WorldSet();

        // Facts: What the CV system detected
        myWorld.addFormula("obj1_is_large");
        myWorld.addFormula("obj1_is_rectangular");
        myWorld.addFormula("obj1_is_blue");

        a.e.println("Visual Features Detected:");
        a.e.println("  - obj1 is large");
        a.e.println("  - obj1 is rectangular");
        a.e.println("  - obj1 is blue\n");

        // Default Rule: Large rectangular objects are typically buildings
        DefaultRule rule1 = new DefaultRule();
        rule1.setPrerequisite("obj1_is_large & obj1_is_rectangular");
        rule1.setJustificatoin("obj1_is_building");
        rule1.setConsequence("obj1_is_building");

        RuleSet myRules = new RuleSet();
        myRules.addRule(rule1);

        a.e.println("Default Rule Applied:");
        a.e.println("  IF (large AND rectangular)");
        a.e.println("  THEN typically it's a BUILDING\n");

        // Run the reasoner
        DefaultReasoner reasoner = new DefaultReasoner(myWorld, myRules);
        HashSet<String> extensions = reasoner.getPossibleScenarios();

        a.e.println("=== REASONING RESULT ===");
        a.e.println("Given the world: \n\t" + myWorld.toString());
        a.e.println("And the rules: \n\t" + myRules.toString());
        a.e.println("\nPossible Extensions:");
        for (String ext : extensions) {
            a.e.println("\t Extension: Th(W U (" + ext + "))");
            a.e.incIndent();
            WFF world_and_ext = new WFF("(( " + myWorld.getWorld() + " ) & (" + ext + "))");
            a.e.println("= " + world_and_ext.getClosure());
            a.e.decIndent();
        }

        a.e.println("\n✓ CONCLUSION: obj1 is classified as BUILDING");
        a.e.println("========================================\n\n");
    }

    /**
     * Scenario 2: Exception detected
     * We detect wheels on the object
     * This overrides the building default → it's actually a vehicle!
     */
    public static void scenarioExceptionDetected() {
        a.e.println("========================================");
        a.e.println("SCENARIO 2: Exception - Wheels Detected");
        a.e.println("========================================\n");

        a.e.println("NEW INFORMATION: We detected wheels on obj1!\n");

        WorldSet myWorld = new WorldSet();

        // Same facts as before
        myWorld.addFormula("obj1_is_large");
        myWorld.addFormula("obj1_is_rectangular");
        myWorld.addFormula("obj1_is_blue");

        // NEW: We detected wheels!
        myWorld.addFormula("obj1_has_wheels");

        // Fact: Objects with wheels are NOT buildings
        myWorld.addFormula("(obj1_has_wheels " + a.e.IMPLIES + " " + a.e.NOT + "obj1_is_building)");

        a.e.println("Updated Visual Features:");
        a.e.println("  - obj1 is large");
        a.e.println("  - obj1 is rectangular");
        a.e.println("  - obj1 is blue");
        a.e.println("  - obj1 HAS WHEELS (new!)");
        a.e.println("  - Fact: objects with wheels are NOT buildings\n");

        // Default Rule 1: Large rectangular → building
        DefaultRule rule1 = new DefaultRule();
        rule1.setPrerequisite("obj1_is_large & obj1_is_rectangular");
        rule1.setJustificatoin("obj1_is_building");
        rule1.setConsequence("obj1_is_building");

        // Default Rule 2: If has wheels → vehicle (not building)
        DefaultRule rule2 = new DefaultRule();
        rule2.setPrerequisite("obj1_is_large & obj1_is_rectangular");
        rule2.setJustificatoin("obj1_has_wheels");
        rule2.setConsequence(a.e.NOT + "obj1_is_building & obj1_is_vehicle");

        RuleSet myRules = new RuleSet();
        myRules.addRule(rule1);
        myRules.addRule(rule2);

        a.e.println("Rules Applied:");
        a.e.println("  Rule 1: large AND rectangular → typically BUILDING");
        a.e.println("  Rule 2: large AND rectangular + has wheels → VEHICLE (exception!)\n");

        // Run the reasoner
        DefaultReasoner reasoner = new DefaultReasoner(myWorld, myRules);
        HashSet<String> extensions = reasoner.getPossibleScenarios();

        a.e.println("=== REASONING RESULT ===");
        a.e.println("Given the world: \n\t" + myWorld.toString());
        a.e.println("And the rules: \n\t" + myRules.toString());
        a.e.println("\nPossible Extensions:");
        for (String ext : extensions) {
            a.e.println("\t Extension: Th(W U (" + ext + "))");
            a.e.incIndent();
            WFF world_and_ext = new WFF("(( " + myWorld.getWorld() + " ) & (" + ext + "))");
            a.e.println("= " + world_and_ext.getClosure());
            a.e.decIndent();
        }

        a.e.println("\n✓ CONCLUSION: obj1 is classified as VEHICLE (not building)");
        a.e.println("✓ The default was OVERRIDDEN by the exception (wheels detected)");
        a.e.println("========================================\n\n");
    }

    /**
     * Scenario 3: Multiple objects in scene
     */
    public static void scenarioMultipleObjects() {
        a.e.println("========================================");
        a.e.println("SCENARIO 3: Complete Street Scene");
        a.e.println("========================================\n");

        WorldSet myWorld = new WorldSet();

        // Object 1: Building (no wheels)
        myWorld.addFormula("obj1_is_large");
        myWorld.addFormula("obj1_is_rectangular");
        myWorld.addFormula(a.e.NOT + "obj1_has_wheels");

        // Object 2: Vehicle (has wheels)
        myWorld.addFormula("obj2_is_large");
        myWorld.addFormula("obj2_is_rectangular");
        myWorld.addFormula("obj2_has_wheels");

        // Object 3: Small circular object (wheel)
        myWorld.addFormula("obj3_is_small");
        myWorld.addFormula("obj3_is_circular");

        a.e.println("Scene Contains:");
        a.e.println("  obj1: large, rectangular, NO wheels");
        a.e.println("  obj2: large, rectangular, HAS wheels");
        a.e.println("  obj3: small, circular\n");

        // Rules
        DefaultRule rule1 = new DefaultRule();
        rule1.setPrerequisite("obj1_is_large & obj1_is_rectangular & " + a.e.NOT + "obj1_has_wheels");
        rule1.setJustificatoin("obj1_is_building");
        rule1.setConsequence("obj1_is_building");

        DefaultRule rule2 = new DefaultRule();
        rule2.setPrerequisite("obj2_is_large & obj2_is_rectangular & obj2_has_wheels");
        rule2.setJustificatoin("obj2_is_vehicle");
        rule2.setConsequence("obj2_is_vehicle");

        DefaultRule rule3 = new DefaultRule();
        rule3.setPrerequisite("obj3_is_small & obj3_is_circular");
        rule3.setJustificatoin("obj3_is_wheel");
        rule3.setConsequence("obj3_is_wheel");

        RuleSet myRules = new RuleSet();
        myRules.addRule(rule1);
        myRules.addRule(rule2);
        myRules.addRule(rule3);

        a.e.println("Classification Rules:");
        a.e.println("  Rule 1: large + rectangular + NO wheels → BUILDING");
        a.e.println("  Rule 2: large + rectangular + HAS wheels → VEHICLE");
        a.e.println("  Rule 3: small + circular → WHEEL\n");

        DefaultReasoner reasoner = new DefaultReasoner(myWorld, myRules);
        HashSet<String> extensions = reasoner.getPossibleScenarios();

        a.e.println("=== SCENE UNDERSTANDING ===");
        for (String ext : extensions) {
            a.e.println("Extension: " + ext);
        }

        a.e.println("\n✓ SCENE CLASSIFICATION:");
        a.e.println("  - obj1 → BUILDING");
        a.e.println("  - obj2 → VEHICLE");
        a.e.println("  - obj3 → WHEEL");
        a.e.println("========================================\n");
    }

    public static void main(String[] args) {
        // Enable cleaner output
        a.e.HIDE_EMPTY_EFFECTS_IN_PRINT = true;

        a.e.println("\n");
        a.e.println("╔════════════════════════════════════════════════════════╗");
        a.e.println("║  COMPUTER VISION: DEFAULT LOGIC REASONING             ║");
        a.e.println("║  Vehicle vs Building Detection                        ║");
        a.e.println("╚════════════════════════════════════════════════════════╝");
        a.e.println("\n");

        // Run all scenarios
        scenarioBasicDetection();
        scenarioExceptionDetected();
        scenarioMultipleObjects();

        a.e.println("\n✅ ALL SCENARIOS COMPLETED\n");
    }
}
