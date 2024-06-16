export function updateGameModeSelect(gameModes) {
    const gameModeSelect = document.getElementById('gameMode');
    gameModeSelect.innerHTML = '<option value="none">None</option>';
    gameModes.forEach(gameMode => {
        const option = document.createElement('option');
        option.value = gameMode.gameModeID;
        option.textContent = gameMode.gameModeName;
        gameModeSelect.appendChild(option);
    });
}