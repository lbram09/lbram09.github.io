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
    #name;
    #exercise;
    #intel;
    #friend;
    #drool;

    constructor(name, exercise, intel, friend, drool) {
        typeof name === "string" ? this.#name = name : undefined;
        typeof exercise === "number" && exercise >= 1 && exercise <= 5 ? this.#exercise = exercise : undefined;
        typeof intel === "number" && intel >= 1 && intel <= 100 ? this.#intel = intel : undefined;
        typeof friend === "number" && friend >= 1 && friend <= 10 ? this.#friend = friend : undefined;
        typeof drool === "number" && drool >= 1 && drool <= 10 ? this.#drool = drool : undefined;
    }

    toString() {
        return `Name: ${this.#name}\nExercise: ${this.#exercise}\nIntelligence: ${this.#intel}\nFriendliness: ${this.#friend}\nDrool: ${this.#drool}`;
    }

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
    let dogs = [];
    dogNames.splice(-1, 30 - noOfDogs);
    dogNames.forEach(name => dogs.push(new Dog(name, randInt(1, 5), randInt(1, 100), randInt(1, 10), randInt(1, 10))));
    dogs = shuffle(dogs);
    const mp = Math.floor(noOfDogs / 2);
    const playerDogs = dogs.slice(0, mp);
    const computerDogs = dogs.slice(mp, noOfDogs);
    let playerWins = true;

    while (playerDogs.length > 0 && computerDogs.length > 0) {
        const playerCurrent = playerDogs[0];
        const computerCurrent = computerDogs[0];
        let category;
        /*const computerCardContainer = document.querySelector("#computerCardContainer");
        const computerCompareCategory = document.querySelector("#computerCompareCategory");*/
        document.querySelector("#playerCardName").innerText = playerCurrent.name;
        document.querySelector("#playerCardExercise").innerText = playerCurrent.exercise;
        document.querySelector("#playerCardIntel").innerText = playerCurrent.intel;
        document.querySelector("#playerCardFriend").innerText = playerCurrent.friend;
        document.querySelector("#playerCardDrool").innerText = playerCurrent.drool;
        if (playerWins) {
            // computerCardContainer.hidden = true;
            category = await new Promise(res => {
                document.querySelector("#categorySelectForm").addEventListener("submit", e => {
                    e.preventDefault();
                    res(document.querySelector("#categorySelect").value);
                }, { once: true });
            });
        } else {
            category = randChoice(CATEGORIES);
            document.querySelector("#computerCompareCategory").innerText = category;
        }
        document.querySelector("#computerCardName").innerText = computerCurrent.name;
        document.querySelector("#computerCardExercise").innerText = computerCurrent.exercise;
        document.querySelector("#computerCardIntel").innerText = computerCurrent.intel;
        document.querySelector("#computerCardFriend").innerText = computerCurrent.friend;
        document.querySelector("#computerCardDrool").innerText = computerCurrent.drool;
        // computerCardContainer.hidden = false;
        playerWins = true;
        if (category !== "drool") {
            if (computerCurrent.getCategory(category) > playerCurrent.getCategory(category)) {
                playerWins = false;
            }
        } else {
            if (computerCurrent.getCategory(category) < playerCurrent.getCategory(category)) {
                playerWins = false;
            }
        }
        playerDogs.shift();
        computerDogs.shift();
        if (playerWins) {
            document.querySelector("#roundWinner").innerText = "player";
            playerDogs.push(playerCurrent, computerCurrent);
        } else {
            document.querySelector("#roundWinner").innerText = "computer";
            computerDogs.push(playerCurrent, computerCurrent);
        }
        await new Promise(res => {
            document.querySelector("#nextRoundForm").addEventListener("submit", e => {
                e.preventDefault();
                res();
            }, { once: true });
        });
    }

    if (playerDogs.length > 0) {
        document.querySelector("#gameWinner").innerText = "player";
    } else {
        document.querySelector("#gameWinner").innerText = "computer";
    }
}



document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.querySelector("#gameContainer");
    gameContainer.hidden = true;
    /*document.querySelector("#gameWinner").parentElement.hidden = true;
    document.querySelector("#roundWinner").parentElement.hidden = true;
    document.querySelector("#computerCompareCategory").parentElement.hidden = true;
    document.querySelector("#nextRoundForm").hidden = true;
    document.querySelector("#computerCardContainer").hidden = true;*/
    const startForm = document.querySelector("#gameStartForm");
    const numCards = document.querySelector("#numCards");

    startForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const num = parseInt(numCards.value);
        gameContainer.hidden = false;
        await play(num, dogs);
        document.querySelector("#resetGameForm").addEventListener("submit", e => {
            e.preventDefault();
            location.reload();
        });
    });
});
