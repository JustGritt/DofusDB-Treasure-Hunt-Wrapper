(() => {
    const topBar = document.createElement('div');
    const exitButton = document.createElement('button');
    const appTitle = document.createElement('h1');

    topBar.classList.add('top-bar');
    appTitle.classList.add('app-title');
    exitButton.classList.add('exit-btn');

    appTitle.textContent = 'DofusDB Treasure Hunt Wrapper';
    exitButton.textContent = 'X';

    exitButton.setAttribute('aria-label', 'Close application');

    exitButton.addEventListener('click', () => {
        if (typeof dofusdb !== 'undefined' && typeof dofusdb.quit === 'function') {
            dofusdb.quit();
        } else {
            console.error('dofusdb.quit is not defined');
        }
    });

    topBar.appendChild(appTitle);
    topBar.appendChild(exitButton);
    document.body.appendChild(topBar);
})();