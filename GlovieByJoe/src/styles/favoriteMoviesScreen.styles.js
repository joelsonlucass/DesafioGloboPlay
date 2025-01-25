import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    mainView: { 
        flex: 1, 
        backgroundColor: '#1f1f1f' 
    },
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
    flex: { 
        flex: 1 
    },
    appBarHeader: { 
        backgroundColor: '#000', 
        alignItems: 'center' 
    },
    appBarContent: { 
        color: '#fff', 
        fontSize: 20, 
        fontWeight: 'bold' 
    }
});

export default styles;