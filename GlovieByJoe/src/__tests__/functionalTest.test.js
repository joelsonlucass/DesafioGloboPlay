import { getPopularMovies, getMovieDetails, getGenres, searchMoviesByName, movieApi } from '../services/movieApi';

// mockando a função get do movieApi
jest.mock('../services/movieApi', () => ({
    movieApi: {
        get: jest.fn(),
    },
    getPopularMovies: jest.requireActual('../services/movieApi').getPopularMovies,
    getGenres: jest.requireActual('../services/movieApi').getGenres,
    searchMoviesByName: jest.requireActual('../services/movieApi').searchMoviesByName,
    getMovieDetails: jest.requireActual('../services/movieApi').getMovieDetails,
}));

describe('functionalTest', () => {
    //
    // aqui vou verificar se ele retorna os filmes, generos se a pesquisa funciona e se ao consultar os detalhes ele retorna também
    //
    it('retorna os filmes populares', async () => {
        // simula a resposta do movieApi.get
        movieApi.get.mockResolvedValue({
            data: {
                results: [{ id: 1, title: '' }, { id: 2, title: '' }],
            },
        });

        const movies = await getPopularMovies();

        expect(movies.length).toBeGreaterThan(0);
    });

    it('retorna os generos dos filmes', async () => {
        // simula a resposta do movieApi.get
        movieApi.get.mockResolvedValue({
            data: {
                results: [{ id: 1, name: '' }, { id: 2, name: '' }],
            },
        });

        const moviesGenres = await getGenres();

        expect(moviesGenres.length).toBeGreaterThan(0);
    });

    it('retorna os filmes a partir de uma pesquisa', async () => {
        // simula a resposta do movieApi.get
        movieApi.get.mockResolvedValue({
            data: {
                results: [{ id: 1, title: '' }, { id: 2, title: '' }],
            },
        });

        const movieSearched = await searchMoviesByName("Globo");

        expect(movieSearched.results.length).toBeGreaterThan(0);
    });

    it('retorna os detalhes do filme', async () => {
        // simula a resposta do movieApi.get
        movieApi.get.mockResolvedValue({
            data: {
                id: 993710,
                title: '',
                overview: '',
            },
        });

        const movieDetails = await getMovieDetails(993710);

        expect(movieDetails).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String),
            })
        );
    });
});
