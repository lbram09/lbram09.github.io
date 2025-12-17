// CONSTANTS

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz".split("");
const DIGITS = "0123456789".split("");
const ALLOWED_SYMBOLS = "!$%^&*()-_=+".split("")
const ALLOWED_CHARS = [...UPPERCASE,  ...LOWERCASE,  ...DIGITS, ...ALLOWED_SYMBOLS];
const QWERTY_1 = "QWERTYUIOP".split("");
const QWERTY_2 = "ASDFGHJKL".split("");
const QWERTY_3 = "ZXCVBNM".split("");


// PREDICATE FUNCTIONS

// Function to check if a given character is uppercase
const isUpper = (char) => UPPERCASE.includes(char);


// Function to check if a given character is lowercase
const isLower = (char) => LOWERCASE.includes(char);


// Function to check if a given character is a digit
const isDigit = (char) => DIGITS.includes(char);


// Function to check if a given character is in the allowed symbols list
const isAllowedSymbol = (char) => ALLOWED_SYMBOLS.includes(char);


// Function to check if a given character is in the allowed characters list
const isAllowedChar = (char) => ALLOWED_CHARS.includes(char);


// Function to check if an array includes three elements
const includesThreeElements = (arr, a, b, c) => arr.includes(a) && arr.includes(b) && arr.includes(c);


// Function to check if three elements in an array appear consecutively
const threeElementsAreConsecutive = (arr, a, b, c) => arr.indexOf(a) === arr.indexOf(b) - 1 && arr.indexOf(a) === arr.indexOf(c) - 2;


// Function to check if a given password is a valid length (i.e. between 8 and 24 characters inclusive)
const isValidLength = (pwrd) => pwrd.length >= 8 && pwrd.length <= 24;


// Function to check if a given password score is strong
const isStrong = (score) => score > 20;


// Function to check if a given password score is weak
const isWeak = (score) => score <= 0;


// UTILITY FUNCTIONS

// Function to generate a random integer between two specified integers
const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1) + a);


// Function to make a random choice of an element in an array
const randChoice = (arr) => arr[randInt(0, arr.length - 1)];

// MAIN FUNCTIONS

// Function which determines whether the password is valid or not, and returns this validity as a boolean
export const isValid = (pwrd) => {
    if (!isValidLength(pwrd)) {
        // If the password is not of a valid length (i.e. between 8 and 24 characters inclusive), display a suitable error message and return false
        alert(`The password must be between 8 and 24 characters in length - length is ${pwrd.length}.`);
        return false;
    }

    // If the password is of a valid length, check each character in the password to see if it is a valid character that can be used
    for (let char of pwrd) {
        if (!isAllowedChar(char)) {
            // If the character being checked is not allowed, display a suitable error message and return false
            alert(`The character "${char}" at index position ${pwrd.indexOf(char)} is not valid."`);
            return false;
        }
    }

    // If the password passes all the validity tests, return true
    return true;
}


// Function which will calculate the strength level of a password, determined by the score
export const calculateStrength = (score) => {
    if (isStrong(score)) {
        return "strong";
    } else if (isWeak(score)) {
        return "weak";
    } else {
        return "medium";
    }
}


// Function that checks for consecutive characters on a standard UK QWERTY keyboard in a password, and will return the number of occurrences of this
const consecutiveQwertyChars = (pwrd) => {
    let occ = 0;
    for (let i = 0; i < pwrd.length - 2; i++) {
        // For each set of 3 consecutive characters in the password, check whether they are consecutive on QWERTY
        let char1 = pwrd[i].toUpperCase();
        let char2 = pwrd[i + 1].toUpperCase();
        let char3 = pwrd[i + 2].toUpperCase();
        if (includesThreeElements(QWERTY_1, char1, char2, char3)) {
            // If all the 3 characters are in row one of QWERTY, continue
            if (threeElementsAreConsecutive(QWERTY_1, char1, char2, char3)) {
                // If all the 3 characters are also consecutive in row one of QWERTY, increment the occurrences of consecutive QWERTY characters
                occ++;
            }
        } else if (includesThreeElements(QWERTY_2, char1, char2, char3)) {
            // If all the 3 characters are in row two of QWERTY, continue
            if (threeElementsAreConsecutive(QWERTY_2, char1, char2, char3)) {
                // If all the 3 characters are also consecutive in row two of QWERTY, increment the occurrences of consecutive QWERTY characters
                occ++;
            }
        } else if (includesThreeElements(QWERTY_3, char1, char2, char3)) {
            // If all the 3 characters are in row three of QWERTY, continue
            if (threeElementsAreConsecutive(QWERTY_3, char1, char2, char3)) {
                // If all the 3 characters are also consecutive in row three of QWERTY, increment the occurrences of consecutive QWERTY characters
                occ++;
            }
        }
    }
    return occ;
}


// Function which will calculate the overall score of a given password and return it
export const calculateScore = (pwrd) => {
    // Initialise the score to be the given password's length
    let score = pwrd.length;
    // Initialise whether each type of character appears in the password to be false
    let upper = false;
    let lower = false;
    let digit = false;
    let symbol = false;
    for (let char of pwrd) {
        // For each character in the password, check if the character type has appeared in it before and if not, increment the score by 5
        // and set whether the character type has appeared to true.
        if (isUpper(char) && !upper) {
            upper = true;
            score += 5;
        } else if (isLower(char) && !lower) {
            lower = true;
            score += 5;
        } else if (isDigit(char) && !digit) {
            digit = true;
            score += 5;
        } else if (isAllowedSymbol(char) && !symbol) {
            symbol = true;
            score += 5;
        }
    }
    if (upper && lower && digit && symbol) {
        // If the password includes all types of characters, increment the score by 10
        score += 10;
    } else if ((upper && lower && !digit && !symbol) || (digit && !upper && !lower && !symbol) || (symbol && !upper && !lower && !digit)) {
        // If one of the following evaluates to true, decrement the score by 5:
        // - The password only contains uppercase and lowercase letters
        // - The password only contains digits
        // - The password only contains allowed symbols
        score -= 5;
    }
    // Decrement the score by 5 multiplied by the number of times that three consecutive letters in the password are also consecutive
    // on a standard UK QWERTY keyboard
    score -= consecutiveQwertyChars(pwrd) * 5;
    return score;
}


// Function which will generate a pseudo-random strong password, and return the password, strength, and score
export const generatePwrd = () => {
    // Initialise the score to be 0 and the password to be blank
    let score = 0;
    let pwrd;
    while (!isStrong(score)) {
        // Keep regenerating a new password until it is considered a strong password (i.e. score > 20)
        pwrd = "";
        // Initialise the length of the generated password to be a pseudo-random integer between 8 and 12 inclusive
        let len = randInt(8, 12);
        for (let i = 0; i < len; i++) {
            // Generate the password by adding pseudo-random characters from the list of allowed characters the determined length number of times
            pwrd += randChoice(ALLOWED_CHARS);
        }
        score = calculateScore(pwrd);
    }
    const strength = calculateStrength(score);
    return { pwrd: pwrd, score: score, strength: strength };
}
