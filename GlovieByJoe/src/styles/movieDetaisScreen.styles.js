import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  bold: {
    fontWeight: "bold"
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
  tabTextWatch: Platform.select({
    web: {
      width: 114,
    },
    default: {
      width: 124,
    }
  }),
  tabTextDetails: Platform.select({
    web: {
      width: 68,
    },
    default: {
      width: 72,
    }
  }),
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
  flex: {
    flex: 1
  },
  titleDetails: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "roboto light"
  },
  descriptionDetailsF: {
    color: "#908b8b",
    fontFamily: "roboto light",
    marginTop: 14
  },
  descriptionDetails: {
    color: "#908b8b",
    fontFamily: "roboto light",
    marginTop: 4
  },
  mainScroll: {
    backgroundColor: "#1f1f1f"
  },
  mainView: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    padding: 14 
  },
  viewWatchToo: {
    width: '33.3333%',
    padding: 2,
  },
  movieBannerGradient: {
    // backgroundColor: "#000",
    marginTop: -200,
    width: "100%",
    height: 200
  },
  movieBannerBg: {
    backgroundColor: "#000",
    height: 200
  },
  movieBannerView: {
    marginTop: -270,
    paddingLeft: 20,
    paddingRight: 20
  },
  iconPlay: {
    width: 25,
    height: 25,
    tintColor: "#333",
    marginLeft: 10
  },
  iconFavorite: {
    width: 25,
    height: 25,
    tintColor: "#cccccc"
  },
  loaderContainer: {
    flex: 1,    
    backgroundColor: '#000', 
    justifyContent: 'center', 
    alignItems: 'center',  
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#333',
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 30,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  webview: {
    flex: 1,
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.3
  }
});

export default styles;