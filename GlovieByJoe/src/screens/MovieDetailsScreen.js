import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, ScrollView, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPopularMovies, getMovieDetails } from '../services/movieApi';
import styles from '../styles/movieDetaisScreen.styles';

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
          <TouchableOpacity style={styles.flex} onPress={() => selectNewMovie(item.id)}>
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
      <Text style={styles.titleDetails}>Ficha técnica</Text>

      <Text style={styles.descriptionDetailsF}>
        <b>Titulo Original:</b> &nbsp;{movie.original_title}
      </Text>
      <Text style={styles.descriptionDetails}>
        <b>Gênero:</b> &nbsp;{movie.genres.map(genre => genre.name).join(', ')}
      </Text>
      <Text style={styles.descriptionDetails}>
        <b>Data de lançamento:</b> &nbsp;{movie.release_date}
      </Text>
      <Text style={styles.descriptionDetails}>
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
    <ScrollView style={styles.mainScroll} ref={scrollRef}>
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
      <View style={[styles.movieBannerGradient, {background: "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(253,187,45,0) 100%)"}]} />
      <View style={styles.movieBannerBg} />
      <View style={styles.movieBannerView}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.genres}>{movie.genres[0].name}</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
      </View>

      <View style={styles.containerButton}>
        <TouchableOpacity style={styles.button}>
          <Image
            source={require('../../assets/icons/play/baseline-play_arrow-24px.svg')}
            style={styles.iconPlay}
          />
          <Text style={styles.buttonText}>Assista</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={toggleFavorite}>
          <Image
            source={isFavorited ? require('../../assets/icons/check/baseline-check-24px.svg') : require('../../assets/icons/star/baseline-star_rate-18px.svg')}
            style={styles.iconFavorite}
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



export default MovieDetailsScreen;
