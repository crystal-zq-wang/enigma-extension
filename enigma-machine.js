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
        this._rotors = rotors;

        for (i = 0; i < rotors.length; i++) {
            for (j = 0; j < this._allRotors.length; j++) {
                if (rotors[i] === this._allRotors[j]) {
                    this._usedRotors.set(rotors[i], this._allRotors[j]);
                }
            }
        }
    }

    /** Set my rotors according to SETTING, which must be a string of
     *  numRotors()-1 characters in my alphabet. The first letter refers
     *  to the leftmost rotor setting (not counting the reflector).  */
    setRotors(setting) {

        var charSet = setting.length() - 1;

        for (int k = this._rotors.length - 1; k > 0; k -= 1) {
            this._usedRotors.get(this._rotors[k]).set(setting.charAt(charSet));
            charSet -= 1;
        }

    }

    /** Set the plugboard to PLUGBOARD. */
    setPlugboard(plugboard) {
        this._plugboard = plugboard;
    }

    /** Return the value of P modulo the size of this permutation. */
    wrap(p) {
        var r = p % this._alphabet.size();
        if (r < 0) {
            r += this._alphabet.size();
        }
        return r;
    }

    /** Returns the result of converting the input character C (as an
     *  index in the range 0..alphabet size - 1), after first advancing
     *  the machine, based on ALPHRING. */
    convert(c, alphRing) {
        c = this._plugboard.permute(c);
        for (int i = this._rotors.length - 1; i >= 0; i -= 1) {
            var start = this._usedRotors.get(this._rotors[i]);
            if (start.rotates() && i != this._rotors.length - 1) {
                if (start.atNotch()
                        && _usedRotors.get(this._rotors[i - 1]).rotates()) {
                    start.advance();
                    this._usedRotors.get(this._rotors[i - 1]).advance();
                } else if (this._usedRotors.get(this._rotors[i + 1]).atNotch()
                        && i + 1 == this._rotors.length - 1) {
                    start.advance();
                }
            }
        }
        this._usedRotors.get(this._rotors[this._rotors.length - 1]).advance();

        for (h = this._rotors.length - 1; h >= 0; h -= 1) {
            Rotor r = this._usedRotors.get(this._rotors[h]);
            if (alphRing != null && alphRing.length() != 0) {
                if (h > 0) {
                    var ringSet = this._alphabet.toInt(alphRing.charAt(h - 1));
                    c = wrap(r.convertForward(c - ringSet) + ringSet);
                } else {
                    c = r.convertForward(c);
                }
            } else {
                c = r.convertForward(c);
            }
        }

        for (j = 1; j < this._rotors.length; j += 1) {
            var r = this._usedRotors.get(this._rotors[j]);
            if (alphRing != null && alphRing.length() != 0) {
                var ringSet = this._alphabet.toInt(alphRing.charAt(j - 1));
                c = wrap(r.convertBackward(c - ringSet) + ringSet);
            } else {
                c = r.convertBackward(c);
            }
        }

        for (k = 0; k < this._plugboard.cycles().length; k++) {
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
        var fixed = msg.replaceAll(" ", "");
        for (k = 0; k < fixed.length; k += 1) {
            var charInt = this._alphabet.toInt(fixed.charAt(k));
            result = result + this._alphabet.toChar(convert(charInt, alphRing));
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
