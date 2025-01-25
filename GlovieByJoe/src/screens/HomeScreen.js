import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput, Button } from 'react-native';
import { getPopularMovies, getGenres, searchMoviesByName } from '../services/movieApi';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Appbar } from 'react-native-paper';
import styles from '../styles/homeScreen.styles';

const HomeScreen = ({ navigation }) => {
    const [moviesSearched, setMoviesSearched] = useState([]);
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [groupedMovies, setGroupedMovies] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchMoviesAndGenres = async () => {
            try {
                // carrega os filmes e gêneros
                const movieList = await getPopularMovies();
                const genreList = await getGenres();

                setMovies(movieList);
                setGenres(genreList);

                // agrupa os filmes por gênero
                groupMoviesByGenre(movieList, genreList);
            } catch (error) {
                console.error('Erro ao carregar filmes ou gêneros:', error);
            }
        };

        fetchMoviesAndGenres();
    }, []);

    // função para agrupar os filmes por gênero
    const groupMoviesByGenre = (movies, genres) => {
        const genreMap = {};
        genres.forEach((genre) => {
            genreMap[genre.id] = genre.name;
        });

        const styles = {};
        movies.forEach((movie) => {
            movie.genre_ids.forEach((genreId) => {
                const genreName = genreMap[genreId];
                if (!styles[genreName]) {
                    styles[genreName] = [];
                }
                styles[genreName].push(movie);
            });
        });

        setGroupedMovies(styles);
    };

    // função para renderizar cada gênero
    const renderGenre = (genre, moviesInGenre) => (
        <View style={styles.mb30} key={genre}>
            <Text style={styles.styleTitle}>{genre}</Text>
            <FlatList
                data={moviesInGenre}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carousel}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('MovieDetailsScreen', { movieId: item.id })}>
                        <View style={styles.movieItem}>
                            <Image
                                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                                style={styles.movieImage}
                            />
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );

    const handleSearchMovie = async (event) => {
        setSearchQuery(event)
        const list = await searchMoviesByName(event);
        setMoviesSearched(list)
    }

    const goToNextPage = async (page) => {
        const nextPage = page + 1;
        const list = await searchMoviesByName(searchQuery, nextPage);
        setMoviesSearched(list)
        scrollRef.current?.scrollTo({ offset: 0, animated: true });
    }

    const goToPreviousPage = async (page) => {
        const previousPage = page - 1;
        const list = await searchMoviesByName(searchQuery, previousPage);
        setMoviesSearched(list)
        scrollRef.current?.scrollTo({ offset: 0, animated: true });
    }

    return (
        <View style={styles.mainView}>
            <Appbar.Header style={styles.appBarHeader}>
                <Appbar.Content
                    title="glovie"
                    titleStyle={styles.appBarContent}
                />
            </Appbar.Header>

            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#999" style={styles.iconLeft} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar filmes..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={handleSearchMovie}
                />
                {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Icon name="close" size={20} color="#999" style={styles.iconRight} />
                    </TouchableOpacity>
                ) : null}
            </View>

            <ScrollView ref={scrollRef}>
                {searchQuery.length > 0 ? (

                    <View style={styles.containerAssista}>
                        <Text style={styles.styleTitle}>{moviesSearched.total_results} resultados encontrados</Text>
                        <FlatList
                            data={moviesSearched.results}
                            extraData={moviesSearched.results}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.flex} onPress={() => navigation.navigate('MovieDetailsScreen', { movieId: item.id })}>
                                    <View style={styles.movieCard}>
                                        {item.placeholder ? null : (
                                            <Image
                                                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                                                style={styles.image}
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            )}
                            numColumns={3}
                            columnWrapperStyle={styles.columnWrapper}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                        <View style={styles.paginationContainer}>
                            <Text style={styles.stylePagination}>
                                Página {moviesSearched.page} de {moviesSearched.total_pages}
                            </Text>
                            <View style={styles.paginationButtons}>
                                {moviesSearched.page > 1 && (
                                    <TouchableOpacity onPress={() => goToPreviousPage(moviesSearched.page)} style={styles.button}>
                                        <Text style={styles.buttonText}>Anterior</Text>
                                    </TouchableOpacity>
                                )}
                                {moviesSearched.page < moviesSearched.total_pages && (
                                    <TouchableOpacity onPress={() => goToNextPage(moviesSearched.page)} style={styles.button}>
                                        <Text style={styles.buttonText}>Próxima</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>

                ) : (
                    <ScrollView style={styles.flex} contentContainerStyle={styles.padding20}>
                        {Object.keys(groupedMovies).map((genre) => renderGenre(genre, groupedMovies[genre]))}
                    </ScrollView>
                )}
            </ScrollView>

        </View>
    );
};

export default HomeScreen;
