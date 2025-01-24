import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

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
        <View style={{ flex: 1, backgroundColor: '#1f1f1f' }}>
            <Appbar.Header style={{ backgroundColor: '#000', alignItems: 'center' }}>
                <Appbar.Content
                    title="Minha Lista"
                    titleStyle={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}
                />
            </Appbar.Header>

            <View style={styles.container}>
                <FlatList
                    data={adjustedFavorites}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={{ flex: 1 }}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    listContent: {
        paddingBottom: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    movieCard: {
        marginBottom: 15,
        width: '94%',
        marginLeft: "3%",
    },
    image: {
        width: '100%',
        height: 150,
    },
});

export default FavoriteMoviesScreen;
