import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Browser() {
  const [url, setUrl] = useState('https://example.com');
  const [currentUrl, setCurrentUrl] = useState('https://example.com');
  const [status, setStatus] = useState('Ready');
  const [loadCount, setLoadCount] = useState(0);
  const iframeRef = useRef(null);

  const navigate = () => {
    let targetUrl = url.trim();
    if (!targetUrl) return;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }
    setStatus('Loading...');
    setCurrentUrl(targetUrl);
    setLoadCount(c => c + 1);
  };

  const handleLoad = () => {
    setStatus('Loaded: ' + currentUrl);
  };

  const handleError = () => {
    setStatus('Error loading: ' + currentUrl);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>{status}</Text>
        <Text style={styles.countText}>Loads: {loadCount}</Text>
      </View>

      {/* Address Bar */}
      <View style={styles.addressBar}>
        <TextInput
          style={styles.urlInput}
          value={url}
          onChangeText={setUrl}
          onSubmitEditing={navigate}
          placeholder="Enter URL (e.g., example.com)"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        <TouchableOpacity style={styles.goButton} onPress={navigate}>
          <Text style={styles.goButtonText}>GO</Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          📱 Testing from: {Platform.OS}{'\n'}
          🌐 Current: {currentUrl}{'\n'}
          💡 Try: example.com, wikipedia.org, github.com
        </Text>
      </View>

      {/* Browser Frame */}
      <View style={styles.browserFrame}>
        <iframe
          src={currentUrl}
          style={styles.iframe}
          onLoad={handleLoad}
          onError={handleError}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          title="Browser"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#6200ee',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    flex: 1,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
  },
  addressBar: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  urlInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    fontSize: 16,
  },
  goButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#6200ee',
    borderRadius: 20,
    justifyContent: 'center',
  },
  goButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoBox: {
    padding: 10,
    backgroundColor: '#e3f2fd',
    borderBottomWidth: 1,
    borderBottomColor: '#90caf9',
  },
  infoText: {
    fontSize: 12,
    color: '#1565c0',
  },
  browserFrame: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    margin: 10,
  },
  iframe: {
    flex: 1,
    border: 'none',
    width: '100%',
    height: '100%',
  },
});
