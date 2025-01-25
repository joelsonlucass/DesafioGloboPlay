import { getPopularMovies, movieApi } from '../services/movieApi';

// mockando a função get do movieApi
jest.mock('../services/movieApi', () => ({
    movieApi: {
        get: jest.fn(),
    },
    getPopularMovies: jest.requireActual('../services/movieApi').getPopularMovies,
}));

describe('instrumentedTest', () => {
    // 
    // aqui vou verificar só a api basica de videos
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
});
