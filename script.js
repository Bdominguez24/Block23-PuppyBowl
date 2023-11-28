const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2308-FTB-MT-WEB-PT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}/players`);
        if (response.ok) {
            const result = await response.json();
            return result.data.players;
        }
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        playerContainer.innerHTML;
        const response = await fetch(`${APIURL}/players/${playerId}`);
        if (response.ok) {
            const playerData = await response.json();
            return playerData.data.playerId;      
        }
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try { 
      const response = await fetch(`${APIURL}/players`, {
      method: "POST",
      headers: {
        "content-Type" : "application/json",
      },
      body: JSON.stringify(playerObj)
    }); 
    if (response.ok) {
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
    }
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`, {
        method: "DELETE",
        });
    if (response.ok) {
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
    }
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playersList) => {
    try {
        const playerContainer = document.getElementById('all-players-container');
        let playerContainerHTML = "";
        playersList.forEach((player) =>{
            playerContainerHTML += `<div class = "container">
            <div class = "player-card">
            <h2> ${player.name} </h2>
            <img class = "player-image" src= "${player.imageUrl}" alt="${player.name}">
            <div class= "player-details"></div>
            <button class="details-button" data-player-id = "${player.id}">See details</button>
            <button class= "remove-button" data-player-id = "${player.id}">Remove player</button>
            </div>
            </div>`;
        });

        playerContainer.innerHTML = playerContainerHTML;
        const detailsButtons  = document.querySelectorAll(".details-button");
        const removeButtons = document.querySelectorAll(".remove-button");
        const playerDetails = document.querySelectorAll(".player-details");

        detailsButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
                if(playerDetails[index].innerHTML === "") {
                    playerDetails[index].innerHTML = `<p>Breed: ${playersList[index].breed}</p><p>Status: ${playersList[index].status}</p><p>Team ID: ${playersList[index].teamId}</p><p>Cohort ID: ${playersList[index].cohortId}</p>`;
                } else {
                    playerDetails[index].innerHTML = "";
                }
            });
        });

        removeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const playerId = button.getAttribute("data-player-id");
                const playerInfo = document.querySelector(
                    `player-id[data-player-id = "${playerId}"]`
                );
                removePlayer(playerId);
            });
        });
     
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};




/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try { 
      const newPlayerFormContainer = document.getElementById("new-player-form");
      newPlayerFormContainer.innerHTML =   `
      <h2>Add a new player</h2>
      <form id = "player-form">
      <div>
      <label for="name">Name</label>
      <input type = "text" id = "name" name = "name" required>
      </div>
      <div>
      <label for = "breed"> Breed </label>
      <input type = "text" id = "breed" name = "breed" required>
      </div>
      <div>
      <label for = "status">Status</label>
      <input type = "text" id = "status" name = "status" required>
      </div>
      <div>
      <label for = "teamId">Team ID</label>
      <input type = "number" id = "teamId" name = "teamId" required>
      </div>
      <button class= "add-player" type= "submit">Add Player</button>
      </form> `;
      
      const playerForm = document.getElementById("player-form");
      playerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(playerForm);
        const playerData = Object.fromEntries(formData.entries());
        await addNewPlayer(playerData);

      });

    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () =>{
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();

}

init()