// 1. Constants & Setup
const container = document.querySelector('.json-container');
const jsonContent = document.getElementById('json-content');
const descriptionText = document.getElementById('description-text');
const pokemonImg = document.getElementById('pokemon-image');

// 2. Event Listeners

// Shared function to add event listeners
function addFetchEventListener(inputId, buttonId, callback) {
    // Handle 'Enter' keypress in input fields
    document.getElementById(inputId).addEventListener('keypress', (e) => {
        if (e.key === 'Enter') callback();
    });

    // Handle button clicks
    document.getElementById(buttonId).addEventListener('click', callback);
}

// Add fetch events for URL and Pokémon inputs/buttons
addFetchEventListener('url-input', 'fetch-url-button', fetchByUrl);
addFetchEventListener('pokemon-input', 'fetch-pokemon-button', fetchByPokemon);

// JSON-Header-Buttons
document.getElementById('copy-json-button').addEventListener('click', copyJSON);
document.getElementById('download-json-button').addEventListener('click', downloadJSON);
document.getElementById('expand-all-button').addEventListener('click', expandAll);
document.getElementById('collapse-all-button').addEventListener('click', collapseAll);
document.getElementById('clear-button').addEventListener('click', clearQuery);


// 3. Data Fetching and Rendering

async function fetchDataForDisplay(url, isPokemon = false) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
        const jsonData = await response.json();

        // Pokémon-specific handling
        if (isPokemon && jsonData.sprites) {
            pokemonImg.src = jsonData.sprites.front_default || 'https://via.placeholder.com/50';
            pokemonImg.style.display = 'block';
        } else {
            pokemonImg.style.display = 'none';
        }

        // Clear and display container
        jsonContent.innerHTML = '';
        container.style.display = 'flex';
        descriptionText.style.display = 'none';

        visualizeJSON(jsonData, jsonContent);

        showToast('Data fetched successfully!', 'success');
    } catch (error) {
        jsonContent.innerHTML = `<div style="color: red;">${error.message}</div>`;
        container.style.display = 'flex';
        showToast('Failed to fetch data.', 'error');
    }
}

function visualizeJSON(data, parentElement) {
    if (typeof data === 'object' && data !== null) {
        const ul = document.createElement('ul');
        Object.entries(data).forEach(([key, value]) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${key}: </span>`;
            if (typeof value === 'object' && value !== null) {
                const toggle = document.createElement('button');
                toggle.textContent = '+';
                toggle.classList.add('json-toggle');

                const nestedContainer = document.createElement('div');
                nestedContainer.classList.add('json-nested-container');
                nestedContainer.style.display = 'none';

                toggle.onclick = () => {
                    const isHidden = nestedContainer.style.display === 'none';
                    nestedContainer.style.display = isHidden ? 'block' : 'none';
                    toggle.textContent = isHidden ? '-' : '+';
                };

                visualizeJSON(value, nestedContainer);
                li.appendChild(toggle);
                li.appendChild(nestedContainer);
            } else {
                li.innerHTML += `<span>${value}</span>`;
            }
            ul.appendChild(li);
        });
        parentElement.appendChild(ul);
    }
}

// 4. Fetch Functions

function fetchByUrl() {
    const url = document.getElementById('url-input').value.trim();
    if (url) fetchDataForDisplay(url);
}

function fetchByPokemon() {
    const pokemon = document.getElementById('pokemon-input').value.trim();
    if (pokemon) {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`;
        fetchDataForDisplay(apiUrl, true);
    }
}

// 5. JSON-Button Functions

function copyJSON() {
    if (jsonContent.innerText) {
        navigator.clipboard.writeText(jsonContent.innerText).then(() => {
            showToast('JSON copied to clipboard.', 'success');
        });
    }
}

function downloadJSON() {
    if (jsonContent.innerText) {
        const blob = new Blob([jsonContent.innerText], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.json';
        link.click();
    }
}

function collapseAll() {
    document.querySelectorAll('.json-nested-container').forEach((el) => (el.style.display = 'none'));
    document.querySelectorAll('.json-toggle').forEach((btn) => (btn.textContent = '+'));
}

function expandAll() {
    document.querySelectorAll('.json-nested-container').forEach((el) => (el.style.display = 'block'));
    document.querySelectorAll('.json-toggle').forEach((btn) => (btn.textContent = '-'));
}

function clearQuery() {
    document.getElementById('url-input').value = '';
    document.getElementById('pokemon-input').value = '';
    jsonContent.innerHTML = '';
    container.style.display = 'none';
    descriptionText.style.display = 'block';
}

// 6. Toast Notifications

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 10);

    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}
