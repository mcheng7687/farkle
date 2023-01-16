/*

*/

const DICE_IMG = {
    1: "dice-img/dice-1.png",
    2: "dice-img/dice-2.png",
    3: "dice-img/dice-3.png",
    4: "dice-img/dice-4.png",
    5: "dice-img/dice-5.png",
    6: "dice-img/dice-6.png",
};

const DICE = [1, 2, 3, 4, 5, 6];
// const INIT_SELECTED = { quantity: 0, values: [] };
let selected = { quantity: 0, values: [] };

const playerScore = { bank: 0, current: 0 };

function initialize() {
    // $("#score-chart").append(`<img class="dice-1">`);
    

    assign_dice();
}

function assign_dice() {
    /*
    Assign die images to document based on DICE values
    */
    $("img.dice").remove();

    for (let d = 0; d < DICE.length; d++) {
        $("#dice-roll").append(`<img class="dice" id="dice-${d}">`)
        $(`#dice-${d}`).attr("src", DICE_IMG[DICE[d]]);
        $(`#dice-${d}`).css("left", `${980 / DICE.length * d}px`);
    }

    // Adds click enlarge feature to each die
    $(".dice").on("click", function () {
        const dice_num = +$(this).attr("id").slice(-1);

        if ($(this).css("width") === "100px") {
            console.log(`Selected ${$(this).attr("id")}`);

            selected.quantity++;
            selected.values.push(DICE[dice_num]);
            $(this).css("width", "120px");
        } else {
            console.log(`Deselected ${$(this).attr("id")}`);

            selected.quantity--;
            selected.values = selected.values.filter((val, idx) => idx !== selected.values.indexOf(DICE[dice_num]));
            $(this).css("width", "100px");
        }
    });
}

function max_points(die_arr) {
    /* 
    Determine max points from an array of die
    Constraints: die_arr.length <= 6, 1 <= die_arr[i] <= 6 
    */
    const combos = {};
    let points = 0, triple_pairs;

    for (let dice of die_arr) {
        // Hashmap die rolls
        combos[dice] = combos[dice] ? combos[dice] + 1 : 1;
    }

    for (let dice_num in combos) {
        if (die_arr.length === 6) {
            // all (6) die combos only

            if (combos[dice_num] === 6)
                // 6 of any number
                return 3000;

            else if (Object.keys(combos).length === 6)
                // straight
                return 1500;

            else if (combos[dice_num] === 3 && Object.keys(combos).length === 2)
                // (2) triplets
                return 2500;

            else if (combos[dice_num] === 4 && Object.keys(combos).length === 2)
                // 4 of any number + pair
                return 1500;

            else if (triple_pairs === undefined && combos[dice_num] === 2 && Object.keys(combos).length === 3)
                // 3 pairs
                triple_pairs = true;
        }

        if (combos[dice_num] === 5)
            // 5 of any number
            points += 2000;

        else if (combos[dice_num] === 4)
            // 4 of any number 
            points += 1000;

        else if (combos[dice_num] === 3) {
            if (+dice_num > 1)
                // 3 of any number except one's
                points += dice_num * 100;
            else
                // 3 of one's
                points += 300;

            triple_pairs = false;
        }

        else if (+dice_num === 1)
            // single one's
            points += combos[dice_num] * 100;

        else if (+dice_num === 5)
            // single five's
            points += combos[dice_num] * 50;
    }

    if (triple_pairs) return 1500;

    return points;
}

function updateScores() {
    /* 
    Update scores on document
    */
    $("#bank-score").html(playerScore.bank);
    $("#current-score").html(playerScore.current);
}

function resetDice() {
    /* 
    Reset dice to 6, current score to 0 and selected dice to 0
    */
    playerScore.current = 0;
    DICE.length = 6;
    selected = { quantity: 0, values: [] };

    updateScores();
}

function verify_winner() {
    /*
    Winning criteria
    */
    if (playerScore.bank >= 10000) alert("You Win!");
}

function verify_farkle() {
    /* 
    Verify if no dice combination can give a score
    */
    const farkle = max_points(DICE) === 0;

    if (farkle) { 
        alert("FARKLE!");

        resetDice();
    }

    return farkle;
}

$("#start-btn").on("click", function () {
    console.log("Game starts!");
    $("#start-btn").remove();
    $("#game").css("visibility", "visible");
});

$("#roll-btn").on("click", function () {
    DICE.length = DICE.length || 6;

    console.log("Rolling the dice...");

    for (let d = 0; d < DICE.length; d++)
        DICE[d] = Math.ceil(Math.random() * 6);

    assign_dice();

    if (!verify_farkle()) {
        $("#score-btn").css("visibility", "visible");
        $("#roll-btn").css("visibility", "hidden");
        $("#bank-btn").css("visibility", "hidden");
    }
});

$("#score-btn").on("click", function () {
    const newPoints = max_points(selected.values);

    if (selected.quantity < 1) {
        console.log("Must select at least one dice before scoring");
    }
    else if (newPoints === 0) {
        console.log("No possible score from selected die");
    }
    else {
        console.log(`Selected ${selected.quantity} die at values ${selected.values}`);

        playerScore.current += newPoints;
        updateScores();

        DICE.length -= selected.quantity;
        selected = { quantity: 0, values: [] };

        if (DICE.length === 0) DICE.length = 6; // If all die used, reset to 6 die

        $("#roll-btn").css("visibility", "visible");
        $("#score-btn").css("visibility", "hidden");
        $("#bank-btn").css("visibility", "visible");
    }
});

$("#bank-btn").on("click", function () {
    playerScore.bank += playerScore.current;
    playerScore.current = 0;

    $("img.dice").remove();

    verify_winner();
    resetDice();
});

initialize();