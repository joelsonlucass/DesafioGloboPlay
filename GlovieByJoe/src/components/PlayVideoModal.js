import React from 'react';
import {
    Modal,
    Platform,
    View,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import { WebView } from 'react-native-webview';

import Ionicons from 'react-native-vector-icons/Ionicons';


function PlayVideoModal({ visible, onClose, trailerUrl }) {
    // web (mostra um iframe)
    if (Platform.OS === 'web') {
        return (
            <Modal
                visible={visible}
                onRequestClose={onClose}
                animationType="slide"
                transparent={false}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={30} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.webWrapper}>
                        <iframe
                            width="100%"
                            height="100%"
                            src={trailerUrl}
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            title="Trailer"
                        />
                    </View>
                </View>
            </Modal>
        );
    }

    // android/iOS
    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            animationType="slide"
            transparent={false}
        >
            <View style={styles.modalContainer}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={30} color="#fff" />
                </TouchableOpacity>

                <WebView
                    source={{ uri: trailerUrl }}
                    style={styles.webview}
                    allowsFullscreenVideo
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#000',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 9999,
        padding: 10,
    },
    closeIcon: {
        width: 30,
        height: 30,
        tintColor: '#fff',
    },
    webview: {
        ...StyleSheet.absoluteFillObject, 
    },
    webWrapper: {
        flex: 1,
        marginTop: 0,
    },
});

export default PlayVideoModal;
