class Permutation {

    /** Set this Permutation to that specified by CYCLES, a string in the
     *  form "(cccc) (cc) ..." where the c's are characters in ALPHABET, which
     *  is interpreted as a permutation in cycle notation.  Characters in the
     *  alphabet that are not included in any cycle map to themselves.
     *  Whitespace is ignored. */
    Permutation(cycles, alphabet) {
        this._alphabet = alphabet;
        this._cycles = cycles.split("[)]");
        var num = 0;

        for (j = 0; j < this._cycles.length; j ++) {
            var removed = _cycles[j].replaceFirst("[(]", "").trim();
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
        var r = p % size();
        if (r < 0) {
            r += size();
        }
        return r;
    }

    /** Returns the size of the alphabet I permute. */
    size() {
        return this._alphabet.size();
    }

    /** Return the result of applying this permutation to P modulo the
     *  alphabet size. */
    permute(p) {
        for (i = 0; i < this._cycles.length; i++) {
            var charInt = this._cycles[i].indexOf(this._alphabet.toChar(wrap(p)));
            if (charInt != -1) {
                if (this._cycles[i].length == 1) {
                    return wrap(p);
                } else if (charInt == this._cycles[i].length - 1) {
                    return this._alphabet.toInt(this._cycles[i].charAt(0));
                } else {
                    return this._alphabet.toInt(this._cycles[i].charAt(charInt + 1));
                }
            }
        }
        return wrap(p);
    }

    /** Return the result of applying the inverse of this permutation
     *  to  C modulo the alphabet size. */
    invert(c) {
        for (i = 0; i < this._cycles.length; i++) {
            var charInt = this._cycles[i].indexOf(this._alphabet.toChar(wrap(c)));
            if (charInt != -1) {
                if (this._cycles[i].length() == 1) {
                    return wrap(c);
                } else if (charInt == 0) {
                    return this._alphabet.toInt(this._cycles[i].charAt(this._cycles[i].length - 1));
                } else {
                    return this._alphabet.toInt(this._cycles[i].charAt(charInt - 1));
                }
            }
        }
        return wrap(c);
    }

    /** Return the result of applying this permutation to the index of P
     *  in ALPHABET, and converting the result to a character of ALPHABET. */
    permute(p) {
        for (i = 0; i < this._cycles.length; i++) {
            if (this._cycles[i].indexOf(p) != -1) {
                if (this._cycles[i].length() == 1) {
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
        for (i = 0; i < this._cycles.length; i++) {
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

        for (i = 0; i < this._cycles.length; i++) {
            if (this._cycles[i].length == 1) {
                return false;
            }
        }
        return true;
    }
}
