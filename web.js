// IMPORTS

import { isValid, calculateStrength, calculateScore, generatePwrd } from "./logic.js";


// MAIN WEB CODE

// Wait for the DOM content to be loaded properly
document.addEventListener("DOMContentLoaded", () => {
    // Initialise all the elements being used as variables
    const generateButton = document.querySelector("#generateButton");
    const generatedPwrd = document.querySelector("#generatedPwrd");
    const generatedScore = document.querySelector("#generatedScore");
    const generatedStrength = document.querySelector("#generatedStrength");
    const checkerForm = document.querySelector("#checkerForm");
    const pwrdInput = document.querySelector("#pwrdInput");
    const checkedScore = document.querySelector("#checkedScore");
    const checkedStrength = document.querySelector("#checkedStrength");

    // Add an event listener for if the user clicks the generate password button
    generateButton.addEventListener("click", () => {
        // If the generate password button is clicked, generate a pseudo-random strong password
        // and display the password, its score, and its strength to the user
        const pwrd = generatePwrd();
        generatedPwrd.innerText = pwrd.pwrd;
        generatedScore.innerText = pwrd.score;
        generatedStrength.innerText = pwrd.strength;
    });

    // Add an event listener for if the user submits the password checker form
    checkerForm.addEventListener("submit", (e) => {
        // If the user submits the form, prevent any page reloads as the event is being handled
        e.preventDefault();

        const pwrd = pwrdInput.value;
        if (!isValid(pwrd)) {
            // If the password is invalid, stop the process of calculating the score and strength of the password
            return;
        }
        // Determine the score and strength of the entered password, and display this information to the user
        const score = calculateScore(pwrd);
        const strength = calculateStrength(score);
        checkedScore.innerText = score;
        checkedStrength.innerText = strength;
    });
});
