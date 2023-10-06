import ApiCinemas from "./modules/Api.js";

/**
 * Calcule la distance entre 2 points de coordonnées GPS
 * Les 2 paramètres de cette fonction sont des tableaux respectant le format [latitude, longitude]
 *
 * @param {Array} origin La latitude et la longitude du premier point
 * @param {Array} target La latitude et la longitude du second point
 * @return {int} La distance en km
 */
function haversine(origin, target) {
    const [lat1, lon1] = origin;
    const [lat2, lon2] = target;

    // Rayon de la Terre en kilomètres (approximatif)
    const earthRadius = 6371;

    // Conversion des degrés en radians
    const lat1Rad = (Math.PI / 180) * lat1;
    const lon1Rad = (Math.PI / 180) * lon1;
    const lat2Rad = (Math.PI / 180) * lat2;
    const lon2Rad = (Math.PI / 180) * lon2;

    // Différence de latitude et de longitude
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    // Calcul de la distance en utilisant la formule de la haversine
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance en kilomètres
    const distance = earthRadius * c;

    return distance;
}

function sortBySeats(cinemas) {
    return cinemas.sort((a, b) => b.seats - a.seats);
}

// Récupérer la géolocalisation de l'utilisateur
async function getUserLocation() {
    return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    resolve(userLocation);
                },
                error => reject(error)
            );
        } else {
            reject(new Error('La géolocalisation n\'est pas prise en charge.'));
        }
    });
}


let currentPage = 1;


// Afficher les cinémas
async function displayCinemas() {

    const resultsPerPage = 20;  // Nombre de résultats par page    
    const apiCinemas = new ApiCinemas();


    try {

        const cinemas = await apiCinemas.fetchCinemas(resultsPerPage, (currentPage - 1) * resultsPerPage);


        // Géolocaliser l'utilisateur
        const userLocation = await getUserLocation();

        // Calculer et afficher la distance pour chaque cinéma
        /*     const sortedCinemas = cinemas.sort((a, b) => {
              const distanceA = haversine(
                [userLocation.latitude, userLocation.longitude],
                [parseFloat(a.coordinates[0]), parseFloat(a.coordinates[1])]
              );
        
              const distanceB = haversine(
                [userLocation.latitude, userLocation.longitude],
                [parseFloat(b.coordinates[0]), parseFloat(b.coordinates[1])]
              );
        
              return distanceA - distanceB;
            }); */


        // Récupérer l'élement HTML de la liste des cinés
        const cinemaList = document.getElementById('cinema-list');
        cinemaList.innerHTML = '';  // Effacer le contenu précédent
        // màj des éléments html de la pagination
        const paginationDiv = document.getElementById('pagination');
        paginationDiv.innerHTML = '';

        // Créer la liste des cinémas en HTML
        cinemas.forEach(cinema => {
            /*             const distance = haversine(
                            [userLocation.latitude, userLocation.longitude],
                            [parseFloat(cinema.coordinates[0]), parseFloat(cinema.coordinates[1])]
                        ); */

            const cinemaItem = document.createElement('li');
            cinemaItem.textContent = `${cinema.name} - ${cinema.address}, ${cinema.city} (${cinema.seats} fauteuils)`;
            cinemaList.appendChild(cinemaItem);
        });

        // bouton Précédent
        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Page précédente';
            prevButton.addEventListener('click', () => {
                displayCinemas(currentPage - 1);
            });
            paginationDiv.appendChild(prevButton);
        }

        // bouton Suivant
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Page suivante';
        nextButton.addEventListener('click', () => {
            displayCinemas(currentPage + 1);
        });
        paginationDiv.appendChild(nextButton);

        paginationDiv.appendChild(prevButton);
        paginationDiv.appendChild(nextButton);


    } catch (error) {
        console.error('Erreur lors de la récupération des cinémas :', error);
    }
}

// Appeler la fonction pour afficher les cinémas au chargement de la page
displayCinemas();