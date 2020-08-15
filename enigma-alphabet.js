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
        return this._alphabet.indexOf(ch);
    }
    /** A string that stores the alphabet given by the input characters. */
}