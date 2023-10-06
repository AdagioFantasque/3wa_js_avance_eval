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

// Afficher les cinémas
async function displayCinemas() {
    const apiCinemas = new ApiCinemas();
  
    try {
      const cinemas = await apiCinemas.fetchCinemas();
  
      // Récupérer la géolocalisation de l'utilisateur
      const userLocation = await getUserLocation();
  
      // Calculer et afficher la distance pour chaque cinéma
      const sortedCinemas = cinemas.sort((a, b) => {
        const distanceA = haversine(
          [userLocation.latitude, userLocation.longitude],
          [parseFloat(a.fields.coordonnees[0]), parseFloat(a.fields.coordonnees[1])]
        );
  
        const distanceB = haversine(
          [userLocation.latitude, userLocation.longitude],
          [parseFloat(b.fields.coordonnees[0]), parseFloat(b.fields.coordonnees[1])]
        );
  
        return distanceA - distanceB;
      });
  
      const cinemaList = document.getElementById('cinema-list');
      sortedCinemas.forEach(cinema => {
        const distance = haversine(
          [userLocation.latitude, userLocation.longitude],
          [parseFloat(cinema.fields.coordonnees[0]), parseFloat(cinema.fields.coordonnees[1])]
        );
  
        const cinemaItem = document.createElement('li');
        cinemaItem.textContent = `${cinema.fields.etablissement} - ${cinema.fields.adresse}, ${cinema.fields.commune} (${cinema.fields.nbr_de_fauteuils} fauteuils) - Distance : ${distance.toFixed(2)} km`;
        cinemaList.appendChild(cinemaItem);
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des cinémas :', error);
    }
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
  
  
  // Afficher les cinémas au chargement de la page
  displayCinemas();