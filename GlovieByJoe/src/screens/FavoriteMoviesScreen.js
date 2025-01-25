import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../styles/favoriteMoviesScreen.styles';

const FavoriteMoviesScreen = ({ navigation }) => {
    const [favorites, setFavorites] = useState([]);

    const loadFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            setFavorites(JSON.parse(storedFavorites) || []);
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [])
    );

    // adiciona itens vazios no final para evitar lacunas no meio
    const adjustedFavorites = [...favorites];
    while (adjustedFavorites.length % 3 !== 0) {
        adjustedFavorites.push({ id: `placeholder-${adjustedFavorites.length}`, placeholder: true });
    }

    return (
        <View style={styles.mainView}>
            <Appbar.Header style={styles.appBarHeader}>
                <Appbar.Content
                    title="Minha Lista"
                    titleStyle={styles.appBarContent}
                />
            </Appbar.Header>

            <View style={styles.container}>
                <FlatList
                    data={adjustedFavorites}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.flex}
                            onPress={() => navigation.navigate('MovieFavoriteDetailsScreen', { movieId: item.id })}
                        >
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
        </View>
    );
};

export default FavoriteMoviesScreen;
