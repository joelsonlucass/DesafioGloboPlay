import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import FavoriteMoviesScreen from '../screens/FavoriteMoviesScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// stack para a tela de detalhes
const MovieDetailsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MovieDetailsScreen" component={MovieDetailsScreen} options={{ headerTransparent: true, headerTitle: "", headerTintColor: "#fff" }} />
        </Stack.Navigator>
    );
};

// stack para a tela de detalhes (a partir dos favoritos)
const MovieFavoriteDetailsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Lista" component={FavoriteMoviesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MovieFavoriteDetailsScreen" component={MovieDetailsScreen} options={{ headerTransparent: true, headerTitle: "", headerTintColor: "#fff" }} />
        </Stack.Navigator>
    );
};

const Navigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Início"
                screenOptions={({ route, focused }) => ({
                    tabBarLabelPosition: "below-icon",
                    tabBarStyle: {
                        backgroundColor: '#000',
                        height: 70,
                        padding: 5,
                    },
                    tabBarIcon: ({ focused, size }) => {
                        let iconSource;
                        let iconColor;

                        if (route.name === 'Início') {
                            iconSource = require('../../assets/icons/home/drawable-xxxhdpi/baseline_home_black_48.png');
                        } else if (route.name === 'Minha lista') {
                            iconSource = require('../../assets/icons/star/drawable-xxxhdpi/baseline_star_rate_black_48.png');
                        }

                        iconColor = focused ? '#fff' : '#808080';

                        return (
                            <Image
                                source={iconSource}
                                style={{
                                    width: size,
                                    height: size,
                                    tintColor: iconColor,
                                }}
                            />
                        );
                    },
                    tabBarLabel: ({ focused }) => {
                        const labelColor = focused ? '#fff' : '#808080';

                        return (
                            <Text
                                style={{
                                    color: labelColor,
                                    fontSize: 12,
                                    textAlign: 'center',
                                }}
                            >
                                {route.name}
                            </Text>
                        );
                    },
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Início" component={MovieDetailsStack} />
                <Tab.Screen name="Minha lista" component={MovieFavoriteDetailsStack} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
