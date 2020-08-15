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