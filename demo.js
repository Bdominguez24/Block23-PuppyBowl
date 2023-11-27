
const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');


const cohortName = '2308-FTB-WEB-PT';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;


const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}players`);
        const result = await response.json();
        return result;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

// (async () => {
//     const players = await fetchAllPlayers();
//     console.log(players);
// })();

const renderAllPlayers = (players) => {
    try {
        players.forEach((player) =>{
            const playerElement = document.createElement('p');
            playerElement.innerHTML = player.name;
            playerContainer.appendChild(playerElement);
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

const init = async () =>{
    const players = await fetchAllPlayers()
    console.log(players.data.players)
    renderAllPlayers(players.data.players)

}

init()