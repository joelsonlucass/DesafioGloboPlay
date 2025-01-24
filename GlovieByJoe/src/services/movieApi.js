import axios from 'axios';

const API_KEY = '9e59f1facdb7c14a6f346485830417c9';
const BASE_URL = 'https://api.themoviedb.org/3';

const movieApi = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        language: 'pt-BR',
    },
});

// função para buscar filmes populares
export const getPopularMovies = async () => {
    try {
        const response = await movieApi.get('/movie/popular');
        return response.data.results;
    } catch (error) {
        console.error('Erro ao buscar filmes populares:', error);
        throw error;
    }
};


// função para buscar detalhes do filme
export const getMovieDetails = async (movieId) => {
    try {
        const response = await movieApi.get(`/movie/${movieId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
        throw error;
    }
}

// função para buscar os generos dos filmes
export const getGenres = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
            params: {
                api_key: API_KEY,
                language: 'pt-BR',
            },
        });
        return response.data.genres;
    } catch (error) {
        console.error('Erro ao carregar gêneros:', error);
        return [];
    }

};

// função para pesquisar os filmes pelo nome
export const searchMoviesByName = async (query) => {
    try {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`);
        const data = await response.json();

        if (data.results) {
            return data.results;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        return [];
    }
};