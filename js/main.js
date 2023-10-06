import ApiCinemas from "./modules/Api.js";

function sortBySeats(cinemas) {
    return cinemas.sort((a, b) => b.seats - a.seats);
  }

async function displayCinemas() {
    const apiCinemas = new ApiCinemas();
  
    try {
      const cinemas = await apiCinemas.fetchCinemas();
      console.log(cinemas);
  
      const sortedCinemas = sortBySeats(cinemas);
  
      const cinemaList = document.getElementById('cinema-list');
      sortedCinemas.forEach(cinema => {
        const cinemaItem = document.createElement('li');
        cinemaItem.textContent = `${cinema.name} - ${cinema.address}, ${cinema.city} (${cinema.seats} fauteuils)`;
        cinemaList.appendChild(cinemaItem);
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des cinémas :', error);
    }
  }
  
  // Appeler la fonction pour afficher les cinémas au chargement de la page
  displayCinemas();