import { StyleSheet } from 'react-native';

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
    stylePagination: {
        fontSize: 12,
        color: '#fff',
        fontFamily: "roboto light",
        paddingLeft: 6
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

    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 10,
    },
    stylePagination: {
        fontSize: 12,
        color: '#fff',
        flex: 1,
    },
    paginationButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'rgba(0,0,0,0)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginLeft: 5,
    },
    buttonText: {
        color: '#ff9900',
        fontWeight: "bold",
        fontSize: 14,
    },
    mb30: {
        marginBottom: 30
    },
    flex: {
        flex: 1
    },
    padding20: {
        padding: 20
    },
    mainView: {
        backgroundColor: '#1f1f1f',
        flex: 1
    },
    appBarHeader: {
        backgroundColor: '#000'
    },
    appBarContent: {
        color: '#e6e6e6',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: "center",
        fontFamily: "roboto light",
        letterSpacing: 4
    }
});

export default styles;