import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Nandi Test App</Text>
        <Text style={styles.subtitle}>
          This app demonstrates in-app purchase functionality for testing Google Play API integration.
        </Text>
        <Text style={styles.package}>Package: com.hbellala.nandi</Text>
        
        <TouchableOpacity
          style={styles.storeButton}
          onPress={() => navigation.navigate('Store')}
        >
          <Text style={styles.storeButtonText}>Open Store</Text>
        </TouchableOpacity>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Features:</Text>
          <Text style={styles.infoItem}>• Google Play Billing integration</Text>
          <Text style={styles.infoItem}>• Dynamic product loading</Text>
          <Text style={styles.infoItem}>• Purchase validation</Text>
          <Text style={styles.infoItem}>• Real-time product updates</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  package: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#007AFF',
    backgroundColor: '#e8f4ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 40,
  },
  storeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 40,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  storeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  infoSection: {
    alignSelf: 'stretch',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 22,
  },
});

export default HomeScreen;