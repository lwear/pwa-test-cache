window.onload = function () {

// prompt the user to install your PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installButton = document.getElementById('install-button');
  installButton.style.display = 'block';

  installButton.addEventListener('click', () => {
    installButton.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  });
});


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope:', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}

}; // window.onload

// Fetch a joke from the JokeAPI
function fetchJoke() {
  const jokeContainer = document.getElementById('joke-container');
  
  fetch('https://v2.jokeapi.dev/joke/Any')
    .then(response => response.json())
    .then(joke => {
      // If the joke has both a setup and delivery, display both
      if (joke.type === 'twopart') {
        jokeContainer.innerHTML = `<p>${joke.setup}</p><p><strong>${joke.delivery}</strong></p>`;
      } else {
        // Otherwise, display the single part joke
        jokeContainer.innerHTML = `<p>${joke.joke}</p>`;
      }
    })
    .catch(error => {
      jokeContainer.innerHTML = `<p>Failed to fetch a joke. Please try again later.</p>`;
      console.log('Error fetching joke:', error);
    });
}

// Set up the button to fetch a new joke on click
document.getElementById('joke-btn').addEventListener('click', fetchJoke);

// Clear dynamic cache when button is clicked
document.getElementById('clear-cache').addEventListener('click', () => {
  caches.delete('my-app-dynamic-cache-v1').then(() => {
    alert('Dynamic cache cleared!');
  });
});

