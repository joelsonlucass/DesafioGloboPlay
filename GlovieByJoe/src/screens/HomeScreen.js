import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput } from 'react-native';
import { getPopularMovies, getGenres, searchMoviesByName } from '../services/movieApi';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Appbar } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
    const [moviesSearched, setMoviesSearched] = useState([]);
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [groupedMovies, setGroupedMovies] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

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
        <View style={{ marginBottom: 30 }} key={genre}>
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
        console.log(moviesSearched)
        setMoviesSearched(list)
    }

    return (
        <View style={{ backgroundColor: '#1f1f1f', flex: 1 }}>
            <Appbar.Header style={{ backgroundColor: '#000' }}>
                <Appbar.Content
                    title="glovie"
                    titleStyle={{ color: '#e6e6e6', fontSize: 24, fontWeight: 'bold', textAlign: "center", fontFamily: "roboto light", letterSpacing: 4 }}
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

            {searchQuery.length > 0 ? (
                <ScrollView>
                    <View style={styles.containerAssista}>
                        <Text style={styles.styleTitle}>{moviesSearched.length} resultados encontrados</Text>
                        <FlatList
                            data={moviesSearched}
                            extraData={moviesSearched}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('MovieDetailsScreen', { movieId: item.id })}>
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
                    </View>
                </ScrollView>
            ) : (
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                    {Object.keys(groupedMovies).map((genre) => renderGenre(genre, groupedMovies[genre]))}
                </ScrollView>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0)',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
        backgroundColor: '#333',
        margin: 20,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        marginHorizontal: 10,
    },
    iconLeft: {
        marginRight: 5,
    },
    iconRight: {
        marginLeft: 5,
    },

    styleTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        fontFamily: "roboto light"
    },
    movieItem: {
        marginRight: 10,
        alignItems: 'center',
    },
    movieImage: {
        width: 120,
        height: 170,
    },
    containerAssista: {
        padding: 10,
    },
    listContent: {
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    movieCard: {
        marginBottom: 15,
        width: '94%',
        marginLeft: "3%"
    },
    image: {
        width: '100%',
        height: 150,
    },
});

export default HomeScreen;
