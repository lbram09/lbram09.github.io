const CATEGORIES = ["exercise", "intelligence", "friendliness", "drool"];
const dogs = ["Annie the Afgan Hound",
    "Bertie the Boxer",
    "Betty the Borzoi",
    "Charlie the Chihuahua",
    "Chaz the Cocker Spaniel",
    "Donald the Dalmatian",
    "Dottie the Doberman",
    "Fern the Fox Terrier",
    "Frank the French Bulldog",
    "George the Great Dane",
    "Gertie the Greyhound",
    "Harry the Harrier",
    "Ian the Irish Wolfhound",
    "Juno the Jack Russell",
    "Keith the Kerry Blue",
    "Larry the Labrador",
    "Marge the Maltese",
    "Max the Mutt",
    "Nutty the Newfoundland",
    "Olive the Old English Sheepdog",
    "Peter the Pug",
    "Poppy the Pekingese",
    "Rosie the Rottweiler",
    "Ruby the Retriever",
    "Sam the Springer Spaniel",
    "Sukie the Saluki",
    "Vernon the Vizsla",
    "Whilma the West Highland Terrier",
    "William the Whippet",
    "Yolande the Yorkshire Terrier"
]


class Dog {
    // Dog class
    #name;
    #exercise;
    #intel;
    #friend;
    #drool;

    constructor(name, exercise, intel, friend, drool) {
        // Dog constructor, with validation for each parameter
        typeof name === "string" ? this.#name = name : undefined;
        typeof exercise === "number" && exercise >= 1 && exercise <= 5 ? this.#exercise = exercise : undefined;
        typeof intel === "number" && intel >= 1 && intel <= 100 ? this.#intel = intel : undefined;
        typeof friend === "number" && friend >= 1 && friend <= 10 ? this.#friend = friend : undefined;
        typeof drool === "number" && drool >= 1 && drool <= 10 ? this.#drool = drool : undefined;
    }

    toString() {
        return `Name: ${this.#name}\nExercise: ${this.#exercise}\nIntelligence: ${this.#intel}\nFriendliness: ${this.#friend}\nDrool: ${this.#drool}`;
    }


    // GETTERS AND SETTERS
    get name() {
        return this.#name;
    }

    get exercise() {
        return this.#exercise;
    }

    get intel() {
        return this.#intel;
    }

    get friend() {
        return this.#friend;
    }

    get drool() {
        return this.#drool;
    }

    getCategory(category) {
        // Function which returns the value of the specified category for that dog instance
        switch (category) {
            case "exercise":
                return this.#exercise;
            case "intelligence":
                return this.#intel;
            case "friendliness":
                return this.#friend;
            case "drool":
                return this.#drool;
        }
    }
}


// Function to generate a random integer between two specified integers
const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1) + a);


// Function to make a random choice of an element in an array
const randChoice = (arr) => arr[randInt(0, arr.length - 1)];


// Function to shuffle a given array, using the Fisher-Yates sorting algorithm
const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = randInt(0, i);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}



const play = async (noOfDogs, dogNames) => {
    // Play the game
    let dogs = [];
    dogNames.splice(-1, 30 - noOfDogs);
    dogNames.forEach(name => dogs.push(new Dog(name, randInt(1, 5), randInt(1, 100), randInt(1, 10), randInt(1, 10))));
    dogs = shuffle(dogs); // Add the correct number of dogs to the deck, create dogs for each name, and shuffle the deck
    const mp = Math.floor(noOfDogs / 2);
    const playerDogs = dogs.slice(0, mp);
    const computerDogs = dogs.slice(mp, noOfDogs); // Split the deck in half for the player and computer
    let playerWins = true;

    while (playerDogs.length > 0 && computerDogs.length > 0) {
        // Main loop whilst both players have cards
        const playerCurrent = playerDogs[0];
        const computerCurrent = computerDogs[0];
        let category;
        /*const computerCardContainer = document.querySelector("#computerCardContainer");
        const computerCompareCategory = document.querySelector("#computerCompareCategory");*/
        document.querySelector("#playerCardName").innerText = playerCurrent.name;
        document.querySelector("#playerCardExercise").innerText = playerCurrent.exercise;
        document.querySelector("#playerCardIntel").innerText = playerCurrent.intel;
        document.querySelector("#playerCardFriend").innerText = playerCurrent.friend;
        document.querySelector("#playerCardDrool").innerText = playerCurrent.drool; // Display the player's current card
        if (playerWins) {
            // If the player won the last round, let them choose the category to compare cards with
            // computerCardContainer.hidden = true;
            category = await new Promise(res => {
                document.querySelector("#categorySelectForm").addEventListener("submit", e => {
                    e.preventDefault();
                    res(document.querySelector("#categorySelect").value);
                }, { once: true });
            });
        } else {
            // If the computer won the last round, it chooses the category to compare cards with randomly
            category = randChoice(CATEGORIES);
            document.querySelector("#computerCompareCategory").innerText = category;
        }
        document.querySelector("#computerCardName").innerText = computerCurrent.name;
        document.querySelector("#computerCardExercise").innerText = computerCurrent.exercise;
        document.querySelector("#computerCardIntel").innerText = computerCurrent.intel;
        document.querySelector("#computerCardFriend").innerText = computerCurrent.friend;
        document.querySelector("#computerCardDrool").innerText = computerCurrent.drool; // Display the computer's current card
        // computerCardContainer.hidden = false;
        playerWins = true;
        if (category !== "drool") {
            if (computerCurrent.getCategory(category) > playerCurrent.getCategory(category)) {
                // If the category is not drool, the higher value wins
                playerWins = false;
            }
        } else {
            if (computerCurrent.getCategory(category) < playerCurrent.getCategory(category)) {
                // If the category is drool, the lower value wins
                playerWins = false;
            }
        }
        playerDogs.shift();
        computerDogs.shift(); // Remove the top card from each player's deck
        if (playerWins) {
            // If the player wins, display this to the user and add both cards to the bottom of the player's deck
            document.querySelector("#roundWinner").innerText = "player";
            playerDogs.push(playerCurrent, computerCurrent);
        } else {
            // If the computer wins, display this to the user and add both cards to the bottom of the computer's deck
            document.querySelector("#roundWinner").innerText = "computer";
            computerDogs.push(playerCurrent, computerCurrent);
        }
        await new Promise(res => {
            document.querySelector("#nextRoundForm").addEventListener("submit", e => {
                e.preventDefault();
                res();
            }, { once: true });
        }); // Wait for the user to click the button to move on to the next round
    }

    if (playerDogs.length > 0) {
        // If the player has cards left, they win the game, otherwise the computer wins
        document.querySelector("#gameWinner").innerText = "player";
    } else {
        document.querySelector("#gameWinner").innerText = "computer";
    }
}



document.addEventListener("DOMContentLoaded", () => {
    // Wait for the DOM to load before running any code which interacts with it
    const gameContainer = document.querySelector("#gameContainer");
    gameContainer.hidden = true; // Hide the main game container until the user has selected the number of cards to play with
    /*document.querySelector("#gameWinner").parentElement.hidden = true;
    document.querySelector("#roundWinner").parentElement.hidden = true;
    document.querySelector("#computerCompareCategory").parentElement.hidden = true;
    document.querySelector("#nextRoundForm").hidden = true;
    document.querySelector("#computerCardContainer").hidden = true;*/
    const startForm = document.querySelector("#gameStartForm");
    const numCards = document.querySelector("#numCards");

    startForm.addEventListener("submit", async (e) => {
        // Once the user has selected the number of cards to play with and submitted the form, start the game
        e.preventDefault();
        gameContainer.hidden = false;
        await play(parseInt(numCards.value), dogs);
        document.querySelector("#resetGameForm").addEventListener("submit", e => {
            e.preventDefault();
            location.reload();
        }); // If the reset game button is pressed, reload the page to reset the game
    });
});
