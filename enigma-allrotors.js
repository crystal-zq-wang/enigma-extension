/** Superclass that represents a rotor in the enigma machine.
 *  @author Crystal Wang
 */
class Rotor {

    /** A rotor named NAME whose permutation is given by PERM. */
    constructor(name, perm) {
        this._name = name;
        this._permutation = perm;
    }

    /** Return my name. */
    name() {
        return this._name;
    }

    /** Return my alphabet. */
    alphabet() {
        return this._permutation.alphabet();
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
    set(posn) {
        this._setting = permutation().wrap(posn);
    }

    /** Set setting() to character CPOSN. */
    set(cposn) {
        this._setting = alphabet().toInt(cposn);
    }

    /** Return the conversion of P (an integer in the range 0..size()-1)
     *  according to my permutation. */
    convertForward(p) {
        var forward = permutation().permute(p + _setting);
        return permutation().wrap(forward - setting());
    }

    /** Return the conversion of E (an integer in the range 0..size()-1)
     *  according to the inverse of my permutation. */
    convertBackward(e) {
        var backward = permutation().invert(e + _setting);
        return permutation().wrap(backward - setting());
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

class MovingRotor extends Rotor {

    /** A rotor named NAME whose permutation in its default setting is
     *  PERM, and whose notches are at the positions indicated in NOTCHES.
     *  The Rotor is initially in its 0 setting (first character of its
     *  alphabet).
     */
    constructor(name, perm, notches) {
        super(name, perm);
        this._notches = notches;
    }

    advance() {
        set(setting() + 1);
    }

    atNotch() {
        for (i = 0; i < this._notches.length; i++) {
            if (alphabet().toChar(setting()) == this._notches.charAt(i)) {
                return true;
            }
        }
        return false;
    }

    rotates() {
        return true;
    }

}

class Reflector extends FixedRotor {

    /** A non-moving rotor named NAME whose permutation at the 0 setting
     * is PERM. */
    constructor(name, perm) {
        super(name, perm);
    }

    set(posn) {

    }

    set(cposn)  {

    }

    reflecting() {
        return true;
    }

}

class FixedRotor extends Rotor {

    /** A non-moving rotor named NAME whose permutation at the 0 setting
     * is given by PERM. */
    constructor(name, perm) {
        super(name, perm);
    }
}

