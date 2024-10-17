const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onclick="showDetails(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function showDetails(pokemonNumber) {

    pokemonList.style.display = 'none';
    loadMoreButton.style.display = 'none';


    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('detailName').textContent = data.name;
            document.getElementById('detailNumber').textContent = `#${data.id}`;
            document.getElementById('detailImage').src = data.sprites.other.dream_world.front_default;
            document.getElementById('detailTypes').textContent = `Tipos: ${data.types.map(type => type.type.name).join(', ')}`;

            const statsList = document.getElementById('detailStats');
            statsList.innerHTML = '';
            data.stats.forEach(stat => {
                const li = document.createElement('li');
                li.textContent = `${stat.stat.name}: ${stat.base_stat}`;
                statsList.appendChild(li);
            });

            document.getElementById('pokemonDetails').style.display = 'block';
        });
}

document.getElementById('closeDetails').addEventListener('click', () => {
    document.getElementById('pokemonDetails').style.display = 'none';

    pokemonList.style.display = 'grid';
    loadMoreButton.style.display = 'block';

});
