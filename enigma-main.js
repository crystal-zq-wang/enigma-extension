class Main {

    /** Process a sequence of encryptions and decryptions, as
     *  specified by ARGS, where 1 <= ARGS.length <= 3.
     *  ARGS[0] is the name of a configuration file.
     *  ARGS[1] is optional; when present, it names an input file
     *  containing messages.  Otherwise, input comes from the standard
     *  input.  ARGS[2] is optional; when present, it names an output
     *  file for processed messages.  Otherwise, output goes to the
     *  standard output. Exits normally if there are no errors in the input;
     *  otherwise with code 1. */

    /** Check ARGS and open the necessary files (see comment on main). */
    constructor(args) {
        this._message = args;
        const settingsLine = "* B Beta III IV I AXLE BCFG";
        this._m = readConfig();
        setUp(this._m, settingsLine);
    }


    /** Configure an Enigma machine from the contents of configuration
     *  file _config and apply it to the messages in _input, sending the
     *  results to _output. */
    process() {
        return printMessageLine(this._m.convert(this._message, this._ring));
    }

    /** Return an Enigma machine configured from the contents of configuration
     *  file _config. */
    readConfig() {
        this._alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var numRotors = 5;
        var numPawls = 3;
        var allRotors = [1, 2, 3, 4, 5];
        allRotors[0] = new Reflector("B", new Permutation("(AE) (BN) (CK) (DQ)" + 
            " (FU) (GY) (HW) (IJ) (LO) (MP) (RX) (SZ) (TV) (ae) (bn) (ck) (dq)" +
            " (fu) (gy) (hw) (ij) (lo) (mp) (rx) (sz) (tv)", this._alphabet));
        allRotors[1] = new FixedRotor("Beta", new Permutation("(ALBEVFCYODJWUGNMQTZSKPR)" + 
            " (HIX) (albevfcyodjwugnmqtzskpr) (hix)", this._alphabet));
        allRotors[2] = new MovingRotor("III", new Permutation("(ABDHPEJT)" + 
            " (CFLVMZOYQIRWUKXSG) (N) (abdhpejt) (cflvmzoyqirwukxsg) (n)", this._alphabet),
            "V");
        allRotors[3] = new MovingRotor("IV", new Permutation("(AEPLIYWCOXMRFZBSTGJQNH)" +
            " (DV) (KU) (aepliywcoxmrfzbstgjqnh) (dv) (ku)", this._alphabet), "J");
        allRotors[4] = new MovingRotor("I", new Permutation("(AELTPHQXRU) (BKNW)" + 
            " (CMOY) (DFG) (IV) (JZ) (S) (aeltphqxru) (bknw) (cmoy) (dfg) (iv) (jz)" + 
            " (s)", this._alphabet), "Q");

        return new Machine(this._alphabet, numRotors, numPawls, allRotors);
    }

    /** Set M according to the specification given on SETTINGS,
     *  which must have the format specified in the assignment. */
    setUp(M, settings) {
        var rotorCounter = 0;
        var using = ["B", "Beta", "III", "IV", "I"];

        M.insertRotors(using);
        M.setRotors("AXLE");

        this._ring = "BCFG"
    }


    /** Print MSG in groups of five (except that the last group may
     *  have fewer letters). */
    printMessageLine(msg) {
        return msg;
    }

}

new Main(args).process();
