class ApiCinemas {
    apiUrl = 'https://data.culture.gouv.fr/api/records/1.0/search/?dataset=etablissements-cinematographiques';

    constructor() {
      this.apiUrl = this.apiUrl;
    }
  
    async fetchCinemas() {
      try {
        const response = await fetch(this.apiUrl);
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des cinémas. Code : ${response.status}`);
        }
  
        const data = await response.json();
        return data.records.map(record => {
          const cinema = record.fields;
          return {
            name: cinema.nom,
            address: cinema.adresse,
            city: cinema.commune,
            seats: cinema.fauteuils
          };
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des cinémas :', error);
        throw error;
      }
    }
  }
  
  export default ApiCinemas;