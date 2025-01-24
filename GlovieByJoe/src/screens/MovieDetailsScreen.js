import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, ScrollView, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPopularMovies, getMovieDetails } from '../services/movieApi';

const MovieDetailsScreen = ({ route }) => {
  const { movieId: initialMovieId } = route.params;
  const [movieId, setMovieId] = useState(initialMovieId);
  const [movie, setMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('assista');
  const scrollRef = useRef(null);

  const selectNewMovie = (id) => {
    setMovieId(id)
    scrollRef.current?.scrollTo({ offset: 0, animated: true });
  }

  // funções para renderizar o conteúdo de cada aba
  const renderAssista = () => (
    <View style={styles.containerAssista}>
      <FlatList
        data={adjustedMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ flex: 1 }} onPress={() => selectNewMovie(item.id)}>
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
  );

  const renderDetalhes = (movie) => (
    <View style={styles.content}>
      <Text style={{ color: "#fff", fontWeight: "bold", fontFamily: "roboto light" }}>Ficha técnica</Text>

      <Text style={{ color: "#908b8b", fontFamily: "roboto light", marginTop: 14 }}>
        <b>Titulo Original:</b> &nbsp;{movie.original_title}
      </Text>
      <Text style={{ color: "#908b8b", fontFamily: "roboto light", marginTop: 4 }}>
        <b>Gênero:</b> &nbsp;{movie.genres.map(genre => genre.name).join(', ')}
      </Text>
      <Text style={{ color: "#908b8b", fontFamily: "roboto light", marginTop: 4 }}>
        <b>Data de lançamento:</b> &nbsp;{movie.release_date}
      </Text>
      <Text style={{ color: "#908b8b", fontFamily: "roboto light", marginTop: 4 }}>
        <b>País:</b> &nbsp;{movie.origin_country}
      </Text>
    </View>
  );
  
  // adiciona itens vazios no final para evitar lacunas no meio
  const adjustedMovies = [...movies];
  while (adjustedMovies.length % 3 !== 0) {
    adjustedMovies.push({ id: `placeholder-${adjustedMovies.length}`, placeholder: true });
  }

  // função para verificar se o filme já está nos favoritos
  const checkIfFavorited = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      const favoriteMovies = JSON.parse(favorites) || [];
      const isAlreadyFavorited = favoriteMovies.some((favMovie) => favMovie.id === movieId);
      setIsFavorited(isAlreadyFavorited);
    } catch (error) {
      console.error('Erro ao verificar favoritos:', error);
    }
  };

  // função para adicionar ou remover o filme dos favoritos
  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      const favoriteMovies = JSON.parse(favorites) || [];

      if (isFavorited) {
        // remove o filme dos favoritos
        const updatedFavorites = favoriteMovies.filter((movie) => movie.id !== movieId);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorited(false);
      } else {
        // adiciona o filme aos favoritos
        const updatedFavorites = [...favoriteMovies, movie];
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Erro ao adicionar/remover favorito:', error);
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieData = await getMovieDetails(movieId);
        setMovie(movieData);
        console.log(movieData)
        checkIfFavorited();
      } catch (error) {
        console.error('Erro ao carregar detalhes do filme:', error);
      }
    };

    fetchMovieDetails();

    const fetchMoviesAndGenres = async () => {
      try {
        // Carregar filmes e gêneros
        const movieList = await getPopularMovies();
        setMovies(movieList);
      } catch (error) {
        console.error('Erro ao carregar filmes ou gêneros:', error);
      }
    };

    fetchMoviesAndGenres();
  }, [movieId]);

  if (!movie) {
    return <Text>Carregando...</Text>;
  }

  return (
    <ScrollView style={{ background: "#1f1f1f" }} ref={scrollRef}>
      <View style={styles.container}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
          style={styles.blurredImage}
          blurRadius={8}
        />

        <View style={styles.centeredImageContainer}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
            style={styles.centeredImage}
          />
        </View>
      </View>
      <View style={{ background: "#000", background: "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(253,187,45,0) 100%)", marginTop: -200, width: "100%", height: 200 }} />
      <View style={{ background: "#000", height: 100 }} />
      <View style={{ marginTop: -170, paddingLeft: 20, paddingRight: 20 }}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.genres}>{movie.genres[0].name}</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
      </View>

      <View style={styles.containerButton}>
        <TouchableOpacity style={styles.button}>
          <Image
            source={require('../../assets/icons/play/baseline-play_arrow-24px.svg')}
            style={{
              width: 25,
              height: 25,
              tintColor: "#333",
              marginLeft: 10
            }}
          />
          <Text style={styles.buttonText}>Assista</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={toggleFavorite}>
          <Image
            source={isFavorited ? require('../../assets/icons/check/baseline-check-24px.svg') : require('../../assets/icons/star/baseline-star_rate-18px.svg')}
            style={{
              width: 25,
              height: 25,
              tintColor: "#cccccc"
            }}
          />
          <Text style={styles.buttonTextOutline}>{isFavorited ? 'Adicionado' : 'Minha lista'}</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.containerTab}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('assista')}
          >
            <Text style={[styles.tabText, activeTab === 'assista' && styles.activeTab, { width: 114 }]}>ASSISTA TAMBÉM</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('detalhes')}
          >
            <Text style={[styles.tabText, activeTab === 'detalhes' && styles.activeTab, { width: 68 }]}>DETALHES</Text>
          </TouchableOpacity>
        </View>
      </View>
      {activeTab === 'assista' && renderAssista()}
      {activeTab === 'detalhes' && renderDetalhes(movie)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  blurredImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "roboto light"
  },
  genres: {
    textAlign: "center",
    color: "#908b8b",
    fontSize: 12,
    fontFamily: "roboto light",
    marginTop: 10,
  },
  overview: {
    color: "#908b8b",
    fontSize: 13,
    fontFamily: "roboto light",
    marginTop: 10
  },
  centeredImageContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -50 },
      { translateY: -90 },
    ],
  },
  centeredImage: {
    width: 100,
    height: 150,
  },
  // botões inferiores
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#000",
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 3,
    width: "49%"
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: .5,
    borderColor: '#cccccc',
  },
  buttonText: {
    color: '#333',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "roboto light"
  },
  buttonTextOutline: {
    color: '#cccccc',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "roboto light"
  },
  icon: {
    marginRight: 10,
  },
  // tabs
  containerTab: {
    flex: 2,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#000"
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  tabButton: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'left',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    color: "#fff"
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#908b8b',
    fontFamily: "roboto thin",
    paddingBottom: 16,
  },
  content: {
    padding: 20,
    borderRadius: 5,
  },
  // movies
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

export default MovieDetailsScreen;
