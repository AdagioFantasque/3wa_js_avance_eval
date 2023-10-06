class ApiCinemas {
    apiUrl = 'https://data.culture.gouv.fr/api/records/1.0/search/?dataset=etablissements-cinematographiques';
    limit;
    offset;

    constructor() {
      this.apiUrl = this.apiUrl;
    }
  
    async fetchCinemas(limit, offset) {
    
       const url = `${this.apiUrl}&rows=${limit}&start=${offset}`;

      try {
        const response = await fetch(url);
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
            seats: cinema.fauteuils,
            coordinates : cinema.geolocalisation
          };
        });

      } catch (error) {
        console.error('Erreur lors de la récupération des cinémas :', error);
        throw error;
      }
    }
  }
  
  export default ApiCinemas;