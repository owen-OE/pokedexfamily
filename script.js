let myCaughtPokemon = JSON.parse(localStorage.getItem('myCaughtPokemon')) || [];

document.addEventListener('DOMContentLoaded', () => {
    loadPokemon(0, 20);

    document.getElementById('load-more').addEventListener('click', () => {
        const currentOffset = document.querySelectorAll('.pokemon-card').length;
        loadPokemon(currentOffset, 20);
    });

    const closeModalButtons = document.querySelectorAll('.modal-close');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.getElementById('pokedex-modal');
            modal.style.display = 'none';
            const modalContent = document.getElementById('pokemon-details');
            modalContent.innerHTML = '';
        });
    });
});

async function loadPokemon(offset, limit) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    const pokemonContainer = document.querySelector('.pokemon-container');
    data.results.forEach(async (pokemon) => {
        const pokemonData = await fetchPokemonData(pokemon.url);
        const pokemonCard = createPokemonCard(pokemonData);
        pokemonContainer.appendChild(pokemonCard);
    });
}

async function fetchPokemonData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.dataset.name = pokemon.name;

    card.innerHTML = `
        <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
        <h3>${pokemon.name}</h3>
    `;
    card.addEventListener('click', () => {
        console.log('Image-clicked:', pokemon.name);
        showPokemonDetails(pokemon);
    });

    if (myCaughtPokemon.includes(pokemon.name)) {
        card.classList.add('caught');
    }
    return card;
}

function showPokemonDetails(pokemon) {
    const modal = document.getElementById('pokedex-modal');
    modal.style.display = 'block';

    const modalContent = document.getElementById('pokemon-details');
    modalContent.innerHTML = '';

    modalContent.innerHTML += `
    <button style="background-color:red; color:white; margin-top: 30px;" class="modal-close">&times;</button>
    <h2 style="color:#424744; text-transform:uppercase; font-size: 32px;">${pokemon.name}</h2>
    <img style="border:2px solid black;"src="${pokemon.sprites.other['official-artwork'].front_default}">
    <div style="line-height:0.7"><h2 style="font-weight: 600px; text-transform:uppercase; font-size: 22px;">Abilities: </h2>
       <p>${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
    </div>
    <div style="line-height:0.7"><h2 style="font-weight: 600px; text-transform:uppercase; font-size: 22px;">Types: </h2>
       <p>${pokemon.types.map(type => type.type.name).join(', ')}</p>
    </div>
    <button class="btn" onclick="catchThisPokemon('${pokemon.name}')">Catch</button>
    <button class="btn" onclick="releaseThisPokemon('${pokemon.name}')">Release</button>
    `;

    const closeModalButtons = document.querySelectorAll('.modal-close');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.style.display = 'none';
            modalContent.innerHTML = '';
        });
    });
}

function releaseThisPokemon(name) {
    console.log('Release button clicked for:', name);
    const index = myCaughtPokemon.indexOf(name);
    if (index !== -1) {
        myCaughtPokemon.splice(index, 1);
        localStorage.setItem('myCaughtPokemon', JSON.stringify(myCaughtPokemon));
        console.log(name, 'released successfully.');
        const cardElement = document.querySelector(`.pokemon-card[data-name="${name}"]`);
        if (cardElement) {
            cardElement.classList.remove('caught');
        }
        const modal = document.getElementById('pokedex-modal');
        modal.style.display = 'none';
    } else {
        console.log(name, 'not found in myCaughtPokemon array.');
    }
}

// Function to show alert in custom modal
function showAlert(message) {
    const alertModal = document.getElementById('alertModal');
    const alertMessage = document.getElementById('alertMessage');

    alertMessage.textContent = message;
    alertModal.style.display = 'block';


    const closeButton = document.querySelector('.alert-close');
    closeButton.addEventListener('click', () => {
        alertModal.style.display = 'none';
    });
}

function catchThisPokemon(name) {
    if (!myCaughtPokemon.includes(name)) {
        myCaughtPokemon.push(name);
        localStorage.setItem('myCaughtPokemon', JSON.stringify(myCaughtPokemon));
        showAlert(`${name} has been caught!`); 
        updateCaughtPokemonDisplay();
        const modal = document.getElementById('pokedex-modal');
        modal.style.display = 'none';
    } else {
        showAlert(`${name} has already been caught!`); 
    }
}

function updateCaughtPokemonDisplay() {
    const pokemonCards = document.querySelectorAll('.pokemon-card');
    pokemonCards.forEach(card => {
        const pokemonName = card.dataset.name;
        if (myCaughtPokemon.includes(pokemonName)) {
            card.classList.add('caught');
        } else {
            card.classList.remove('caught');
        }
    });
}