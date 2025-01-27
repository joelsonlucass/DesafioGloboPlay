import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, ScrollView, FlatList, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPopularMovies, getMovieDetails, getTrailerKeyByMovieId } from '../services/movieApi';
import styles from '../styles/movieDetaisScreen.styles';
import PlayVideoModal from '../components/PlayVideoModal';
import { LinearGradient } from 'expo-linear-gradient';

const MovieDetailsScreen = ({ route }) => {
  const { movieId: initialMovieId } = route.params;
  const [movieId, setMovieId] = useState(initialMovieId);
  const [movie, setMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [keyTrailer, setKeyTrailer] = useState(null);
  const [activeTab, setActiveTab] = useState('assista');
  const scrollRef = useRef(null);
  const [isTrailerVisible, setIsTrailerVisible] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(false);

  const selectNewMovie = (id) => {
    setMovieId(id)
    scrollRef.current?.scrollTo({ offset: 0, animated: true });
  }

  // funções para renderizar o conteúdo de cada aba
  const renderAssista = () => (
    <View style={styles.mainView}>
      {adjustedMovies.map((item) => {
        if (item.placeholder) {
          return null;
        }
        return (
          <TouchableOpacity key={item.id} style={styles.viewWatchToo} onPress={() => selectNewMovie(item.id)}>
            <View style={styles.movieCard}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={styles.image}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderDetalhes = (movie) => (
    <View style={styles.content}>
      <Text style={styles.titleDetails}>Ficha técnica</Text>

      <Text style={styles.descriptionDetailsF}>
        <Text style={styles.bold}>Titulo Original:</Text> &nbsp;{movie.original_title}
      </Text>
      <Text style={styles.descriptionDetails}>
        <Text style={styles.bold}>Gênero:</Text> &nbsp;{movie.genres.map(genre => genre.name).join(', ')}
      </Text>
      <Text style={styles.descriptionDetails}>
        <Text style={styles.bold}>Data de lançamento:</Text> &nbsp;{movie.release_date}
      </Text>
      <Text style={styles.descriptionDetails}>
        <Text style={styles.bold}>País:</Text> &nbsp;{movie.origin_country}
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
        checkIfFavorited();
        const keyTrailer = await getTrailerKeyByMovieId(movieId);
        setKeyTrailer(keyTrailer);
        setTrailerUrl(`https://www.youtube.com/embed/${keyTrailer}?autoplay=1`)
      } catch (error) {
        console.error('Erro ao carregar detalhes do filme:', error);
      }
    };

    fetchMovieDetails();

    const fetchMoviesAndGenres = async () => {
      try {
        // carregar filmes e gêneros
        const movieList = await getPopularMovies();
        setMovies(movieList);
      } catch (error) {
        console.error('Erro ao carregar filmes ou gêneros:', error);
      }
    };

    fetchMoviesAndGenres();
  }, [movieId]);

  if (!movie) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const openTrailer = () => {
    setIsTrailerVisible(true);
  };

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
      <LinearGradient
      colors={['rgba(0,0,0,1)', 'rgba(253,187,45,0)']}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={styles.movieBannerGradient}
    >
      {/* Seu conteúdo aqui */}
    </LinearGradient>
      <View style={styles.movieBannerBg} />
      <View style={styles.movieBannerView}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.genres}>{movie.genres[0].name}</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
      </View>

      <View style={styles.containerButton}>
        <TouchableOpacity style={[styles.button, !keyTrailer && styles.disabledButton]} disabled={!keyTrailer} onPress={openTrailer}>
          <Image
            source={require('../../assets/icons/play/drawable-xxxhdpi/baseline_play_arrow_black_48.png')}
            style={styles.iconPlay}
          />
          <Text style={styles.buttonText}>Assista</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={toggleFavorite}>
          <Image
            source={isFavorited ? require('../../assets/icons/check/drawable-xxxhdpi/baseline_check_black_48.png') : require('../../assets/icons/star/drawable-xxxhdpi/baseline_star_rate_black_48.png')}
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
            <Text style={[styles.tabText, styles.tabTextWatch, activeTab === 'assista' && styles.activeTab, ]}>ASSISTA TAMBÉM</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('detalhes')}
          >
            <Text style={[styles.tabText, styles.tabTextDetails, activeTab === 'detalhes' && styles.activeTab,]}>DETALHES</Text>
          </TouchableOpacity>
        </View>
      </View>
      {activeTab === 'assista' && renderAssista()}
      {activeTab === 'detalhes' && renderDetalhes(movie)}

      <PlayVideoModal
      visible={isTrailerVisible}
      onClose={() => setIsTrailerVisible(false)}
      trailerUrl={trailerUrl}
    />
    </ScrollView>
  );
};

export default MovieDetailsScreen;
