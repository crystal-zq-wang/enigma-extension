//document.body.innerHTML = document.body.innerHTML.replace(/Berkeley/g, 'ZOOM');
// do we need packages?


class Alphabet {

    /** A new alphabet containing CHARS.  Character number #k has index
     *  K (numbering from 0). No character may be duplicated. */

    constructor(alph) {
    	this._alphabet = alph;
    }

    /** A default alphabet of all upper-case characters. */
    Alphabet() {
        this("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }

    /** Returns the size of the alphabet. */
    size() {
        return this._alphabet.length;
    }

    /** Returns true if CH is in this alphabet. */
    contains(ch) {
        if (this._alphabet.indexOf(ch) != -1) {
            return true;
        }
        return false;
    }

    /** Returns character number INDEX in the alphabet, where
     *  0 <= INDEX < size(). */
    toChar(index) {
        return this._alphabet.charAt(index);
    }

    /** Returns the index of character CH which must be in
     *  the alphabet. This is the inverse of toChar(). */
    toInt(ch)  {
        if (this._alphabet instanceof Alphabet) {
            return this._alphabet._alphabet.indexOf(ch);
        }
        return this._alphabet.indexOf(ch);
    }
    /** A string that stores the alphabet given by the input characters. */
}

/** Superclass that represents a rotor in the enigma machine.
 *  @author Crystal Wang
 */
class Rotor {

    /** A rotor named NAME whose permutation is given by PERM. */
    constructor(name, perm, setting) {
        this._name = name;
        this._permutation = perm;
        this._setting = perm._alphabet.toInt(setting);
    }

    /** Return my name. */
    name() {
        return this._name;
    }

    /** Return my alphabet. */
    alphabet() {
        return this._permutation._alphabet;
    }

    /** Return my permutation. */
    permutation() {
        return this._permutation;
    }

    /** Return the size of my alphabet. */
    size() {
        return alphabet().size();
    }

    /** Return true iff I have a ratchet and can move. */
    rotates() {
        return false;
    }

    /** Return true iff I reflect. */
    reflecting() {
        return false;
    }

    /** Return my current setting. */
    setting() {
        return this._setting;
    }

    /** Set setting() to POSN.  */
    setInt(posn) {
        this._setting = this.permutation().wrap(posn);
    }

    /** Set setting() to character CPOSN. */
    set(cposn) {
        this._setting = this._permutation._alphabet.toInt(cposn);
    }

    /** Return the conversion of P (an integer in the range 0..size()-1)
     *  according to my permutation. */
    convertForward(p) {
        var forward = this.permutation().permuteInt(p + this._setting);
        return this.permutation().wrap(forward - this._setting);
    }

    /** Return the conversion of E (an integer in the range 0..size()-1)
     *  according to the inverse of my permutation. */
    convertBackward(e) {
        var backward = this.permutation().invertInt(e + this._setting);
        return this.permutation().wrap(backward - this._setting);
    }

    /** Returns true iff I am positioned to allow the rotor to my left
     *  to advance. */
    atNotch() {
        return false;
    }

    /** Advance me one position, if possible. By default, does nothing. */
    advance() {

    }

    toString() {
        return "Rotor " + this._name;
    }

}

class Permutation {

    /** Set this Permutation to that specified by CYCLES, a string in the
     *  form "(cccc) (cc) ..." where the c's are characters in ALPHABET, which
     *  is interpreted as a permutation in cycle notation.  Characters in the
     *  alphabet that are not included in any cycle map to themselves.
     *  Whitespace is ignored. */
    constructor(cycles, alphabet) {
        this._alphabet = alphabet;
        this._cycles = cycles.split(")");
        var num = 0;

        for (var j = 0; j < this._cycles.length; j++) {
            var removed = this._cycles[j].replace("(", "").trim();
            this._cycles[j] = removed;
            num += this._cycles[j].length;
        }
    }

    /** Add the cycle c0->c1->...->cm->c0 to the permutation, where CYCLE is
     *  c0c1...cm. */
    addCycle(cycle) {

    }

    /** Return the value of P modulo the size of this permutation. */
    wrap(p) {
        
        var r = p % this._alphabet._alphabet.length;
        if (r < 0) {
            r += this._alphabet._alphabet.length;
        }
        return r;
    }

    /** Returns the size of the alphabet I permute. */
    size() {
        return this._alphabet.length;
    }

    /** Return the result of applying this permutation to P modulo the
     *  alphabet size. */
    permuteInt(p) {
        
        for (var i = 0; i < this._cycles.length; i++) {
            var place = this._alphabet.toChar(this.wrap(p));
            var charInt = this._cycles[i].indexOf(place);
            if (charInt != -1) {
                if (this._cycles[i].length == 1) {
                    return this.wrap(p);
                } else if (charInt == this._cycles[i].length - 1) {
                    return this._alphabet.toInt(this._cycles[i].charAt(0));
                } else {
                    var x = this.wrap(charInt + 1);
                    return this._alphabet.toInt(this._cycles[i].charAt(x));
                }
            }
        }
        // this._alphabet = this._alphabet._alphabet;
        return this.wrap(p);
    }

    /** Return the result of applying the inverse of this permutation
     *  to  C modulo the alphabet size. */
    invertInt(c) {
        for (var i = 0; i < this._cycles.length; i++) {
            var charInt = this._cycles[i].indexOf(this._alphabet.toChar(this.wrap(c)));
            if (charInt != -1) {
                if (this._cycles[i].length == 1) {
                    return this.wrap(c);
                } else if (charInt == 0) {
                    return this._alphabet.toInt(this._cycles[i].charAt(this._cycles[i].length - 1));
                } else {
                    return this._alphabet.toInt(this._cycles[i].charAt(this.wrap(charInt - 1)));
                }
            }
        }
        return this.wrap(c);
    }

    /** Return the result of applying this permutation to the index of P
     *  in ALPHABET, and converting the result to a character of ALPHABET. */
    permute(p) {
        for (var i = 0; i < this._cycles.length; i++) {
            if (this._cycles[i].indexOf(p) != -1) {
                if (this._cycles[i].length == 1) {
                    return p;
                } else if (this._cycles[i].indexOf(p) == this._cycles[i].length - 1) {
                    return this._cycles[i].charAt(0);
                } else {
                    return this._cycles[i].charAt(this._cycles[i].indexOf(p) + 1);
                }
            }
        }
        return p;
    }

    /** Return the result of applying the inverse of this permutation to C. */
    invert(c) {
        for (var i = 0; i < this._cycles.length; i++) {
            if (this._cycles[i].indexOf(c) != -1) {
                if (this._cycles[i].length == 1) {
                    return c;
                } else if (this._cycles[i].indexOf(c) == 0) {
                    return this._cycles[i].charAt(this._cycles[i].length - 1);
                } else {
                    return this._cycles[i].charAt(this._cycles[i].indexOf(c) - 1);
                }
            }
        }
        return c;
    }

    /** Return the alphabet used to initialize this Permutation. */
    alphabet() {
        return this._alphabet;
    }

    /** Return the permutation cycles. */
    cycles() {
        return this._cycles;
    }

    /** Return true iff this permutation is a derangement (i.e., a
     *  permutation for which no value maps to itself). */
    derangement() {
        if (this._num < size()) {
            return false;
        }

        for (var i = 0; i < this._cycles.length; i++) {
            if (this._cycles[i].length == 1) {
                return false;
            }
        }
        return true;
    }
}

class MovingRotor extends Rotor {

    /** A rotor named NAME whose permutation in its default setting is
     *  PERM, and whose notches are at the positions indicated in NOTCHES.
     *  The Rotor is initially in its 0 setting (first character of its
     *  alphabet).
     */
    constructor(name, perm, setting, notches) {
        super(name, perm, setting );
        this._notches = notches;
    }

    advance() {
        this.setInt(this._setting + 1);
    }

    atNotch() {
        for (var i = 0; i < this._notches.length; i++) {
            if (this._permutation._alphabet.toChar(this.setting()) == this._notches.charAt(i)) {
                return true;
            }
        }
        return false;
    }

    rotates() {
        return true;
    }

}

class FixedRotor extends Rotor {

    /** A non-moving rotor named NAME whose permutation at the 0 setting
     * is given by PERM. */
    constructor(name, perm, setting) {
        super(name, perm, setting);
    }
}

class Reflector extends FixedRotor {

    /** A non-moving rotor named NAME whose permutation at the 0 setting
     * is PERM. */
    constructor(name, perm, setting) {
        super(name, perm, setting);
    }

    set(posn) {

    }

    set(cposn)  {

    }

    reflecting() {
        return true;
    }

}

class Machine {

    /** A new Enigma machine with alphabet ALPHA, 1 < NUMROTORS rotor slots,
     *  and 0 <= PAWLS < NUMROTORS pawls.  ALLROTORS contains all the
     *  available rotors. */

    constructor(alpha, numRotors, pawls,
            allRotors) {
        this._alphabet = alpha;
        this._numRotors = numRotors;
        this._numPawls = pawls;
        this._allRotors = allRotors;
        this._usedRotors = [];
        this._plugboard = new Permutation("", this._alphabet);
    }

    /** Return the number of rotor slots I have. */
    numRotors() {
        return this._numRotors;
    }

    /** Return the number pawls (and thus rotating rotors) I have. */
    numPawls() {
        return this._numPawls;
    }

    /** Set my rotor slots to the rotors named ROTORS from my set of
     *  available rotors (ROTORS[0] names the reflector).
     *  Initially, all rotors are set at their 0 setting. */
    insertRotors(rotors) {
        // this._rotors = rotors;
        // var count = 0;

        // for (var i = 0; i < rotors.length; i++) {
        //     for (var j = 0; j < this._allRotors.length; j++) {
        //         if (rotors[i] === this._allRotors[j]) {
        //             this._usedRotors(rotors[i], this._allRotors[j]);
        //         }
        //     }
        // }
        this._usedRotors = rotors;
    }

    /** Set my rotors according to SETTING, which must be a string of
     *  numRotors()-1 characters in my alphabet. The first letter refers
     *  to the leftmost rotor setting (not counting the reflector).  */
    setRotors(setting) {

        var charSet = setting.length - 1;

		this._usedRotors[1]._setting = this._alphabet.toInt(setting.charAt(0));
        this._usedRotors[2]._setting = this._alphabet.toInt(setting.charAt(1));
        this._usedRotors[3]._setting = this._alphabet.toInt(setting.charAt(2));
        this._usedRotors[4]._setting = this._alphabet.toInt(setting.charAt(3));
        // for (i = numRotors() - 1; i > 0; i--) {
        //     
        //     charSet -= 1;
        // }

    }

    /** Set the plugboard to PLUGBOARD. */
    setPlugboard(plugboard) {
        this._plugboard = plugboard;
    }

    /** Return the value of P modulo the size of this permutation. */
    wrap(p) {
        var r = p % this._alphabet._alphabet.length;
        if (r < 0) {
            r += this._alphabet._alphabet.length;
        }
        return r;
    }

    /** Returns the result of converting the input character C (as an
     *  index in the range 0..alphabet size - 1), after first advancing
     *  the machine, based on ALPHRING. */
    convertInt(c, alphRing) {
        c = this._plugboard.permute(c);
        for (var i = this._usedRotors.length - 1; i >= 0; i -= 1) {
            var start = this._usedRotors[i];
            if (start.rotates() && i != this._usedRotors.length - 1) {
                if (start.atNotch()
                        && this._usedRotors[i - 1].rotates()) {
                    start.advance();
                    this._usedRotors[i - 1].advance();
                } else if (this._usedRotors[i + 1].atNotch()
                        && i + 1 == this._usedRotors.length - 1) {
                    start.advance();
                }
            }
        }
        this._usedRotors[this._usedRotors.length - 1].advance();

        for (var h = this._usedRotors.length - 1; h >= 0; h -= 1) {
            var r = this._usedRotors[h];
            if (alphRing != null && alphRing.length != 0) {
                if (h > 0) {
                    var ringSet = this._alphabet.toInt(alphRing.charAt(h - 1));
                    var inner = r.convertForward(c - ringSet) + ringSet
                    c = this.wrap(inner);
                } else {
                    c = r.convertForward(c);
                }
            } else {
                c = r.convertForward(c);
            }
        }

        for (var j = 1; j < this._usedRotors.length; j += 1) {
            var r = this._usedRotors[j];
            if (alphRing != null && alphRing.length != 0) {
                var ringSet = this._alphabet.toInt(alphRing.charAt(j - 1));
                c = this.wrap(r.convertBackward(c - ringSet) + ringSet);
            } else {
                c = r.convertBackward(c);
            }
        }

        for (var k = 0; k < this._plugboard.cycles().length; k++) {
            if (this._plugboard.cycles()[k].indexOf(this._alphabet.toChar(c)) != -1) {
                c = this._plugboard.invert(c);
                break;
            }
        }
        return c;
    }

    /** Returns the encoding/decoding of MSG, updating the state of
     *  the rotors accordingly, based on ALPHRING settings. */
    convert(msg, alphRing) {
        var result = "";
        console.log(msg.toString());
        var fixed = msg;//.toString().replace(/\s/g, '');
        for (var k = 0; k < fixed.length; k += 1) {
            var s = fixed.charAt(k);
            if (s === " ") {
                result = result + s;
            } else {
                var charInt = this._alphabet.toInt(s);
                var t = this.convertInt(charInt, alphRing);
                result = result + this._alphabet.toChar(t);
            }
            
        }
        return result;
    }

    /** Returns the used rotors. */
    usedRotors() {
        return this._usedRotors;
    }

    /** Returns the list of the names of the rotors we want. */
    rotors() {
        return this._rotors;
    }

}


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

		this._alphabet = new Alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
        var numRotors = 5;
        var numPawls = 3;
        var allRotors = [1, 2, 3, 4, 5];
        allRotors[0] = new Reflector("B", new Permutation("(AE) (BN) (CK) (DQ)" + 
            " (FU) (GY) (HW) (IJ) (LO) (MP) (RX) (SZ) (TV) (ae) (bn) (ck) (dq)" +
            " (fu) (gy) (hw) (ij) (lo) (mp) (rx) (sz) (tv)", this._alphabet), 0);
        allRotors[1] = new FixedRotor("Beta", new Permutation("(ALBEVFCYODJWUGNMQTZSKPR)" + 
            " (HIX) (albevfcyodjwugnmqtzskpr) (hix)", this._alphabet), "A");
        allRotors[2] = new MovingRotor("III", new Permutation("(ABDHPEJT)" + 
            " (CFLVMZOYQIRWUKXSG) (N) (abdhpejt) (cflvmzoyqirwukxsg) (n)", this._alphabet),
            "X", "V");
        allRotors[3] = new MovingRotor("IV", new Permutation("(AEPLIYWCOXMRFZBSTGJQNH)" +
            " (DV) (KU) (aepliywcoxmrfzbstgjqnh) (dv) (ku)", this._alphabet), "L", "J");
        allRotors[4] = new MovingRotor("I", new Permutation("(AELTPHQXRU) (BKNW)" + 
            " (CMOY) (DFG) (IV) (JZ) (S) (aeltphqxru) (bknw) (cmoy) (dfg) (iv) (jz)" + 
            " (s)", this._alphabet), "E", "Q");

        this._m = new Machine(this._alphabet, numRotors, numPawls, allRotors);

        // this._m = readConfig();
        // setUp(this._m, settingsLine);

        this._m.insertRotors(allRotors);
        // this._m.setRotors("AXLE");

        this._ring = "BCFG"
    }


    /** Configure an Enigma machine from the contents of configuration
     *  file _config and apply it to the messages in _input, sending the
     *  results to _output. */
    process() {
        var holder = this._m.convert(this._message, this._ring);
        console.log(holder);
        return holder;
    }


    /** Print MSG in groups of five (except that the last group may
     *  have fewer letters). */
    printMessageLine(msg) {
        console.log(msg);
        return msg;
    }

}

// var words = document.body.innerText.split(" ");
// for (var f = 0; f < words.length; f++) {
//     var tmp = new Main(words[f]);
//     document.body.innerHTML = document.body.innerHTML.replace(words[f], tmp.process());
// }

// const matchAllExceptWhitespace = /\w+/g;
// const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

// let node;
// // var sdf = 0;

// while (node = treeWalker.nextNode()) {
//     var word = new Main(node.nodeValue);
//     node.nodeValue = node.nodeValue.replace(matchAllExceptWhitespace, word.process());
// }

a = new Main("CKSKQzQJYDr HaVbLu");
b = a.process();
// a = new Main(document.body.textContent);
// document.body.innerHTML = document.body.innerHTML.replace(/VATT/g, "ZOOM");
//document.body.innerHTML = document.body.innerHTML.replace(/Berkeley/g, "ZOOM");