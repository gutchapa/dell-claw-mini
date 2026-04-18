import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface PageLoad {
  url: string;
  timestamp: number;
  loadTime: number;
  success: boolean;
}

interface SessionMetrics {
  totalLoads: number;
  successfulLoads: number;
  failedLoads: number;
  averageLoadTime: number;
  uniqueDomains: Set<string>;
  startTime: number;
}

export function BrowserDashboard() {
  const [metrics, setMetrics] = useState<SessionMetrics>({
    totalLoads: 0,
    successfulLoads: 0,
    failedLoads: 0,
    averageLoadTime: 0,
    uniqueDomains: new Set(),
    startTime: Date.now(),
  });
  const [pageLoads, setPageLoads] = useState<PageLoad[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const sessionDuration = Math.floor((Date.now() - metrics.startTime) / 1000);
  const minutes = Math.floor(sessionDuration / 60);
  const seconds = sessionDuration % 60;

  const successRate = metrics.totalLoads > 0
    ? ((metrics.successfulLoads / metrics.totalLoads) * 100).toFixed(1)
    : '0';

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <View style={styles.header}>
          <Text style={styles.title}>📊 Browser Dashboard</Text>
          <Text style={styles.toggle}>{isExpanded ? '▼' : '▶'}</Text>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView style={styles.content}>
          {/* Session Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Session Overview</Text>
            <View style={styles.metricRow}>
              <Metric label="Duration" value={`${minutes}m ${seconds}s`} />
              <Metric label="Total Loads" value={metrics.totalLoads.toString()} />
            </View>
          </View>

          {/* Performance Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance</Text>
            <View style={styles.metricRow}>
              <Metric label="Avg Load Time" value={`${metrics.averageLoadTime.toFixed(2)}s`} />
              <Metric label="Success Rate" value={`${successRate}%`} />
            </View>
            <View style={styles.metricRow}>
              <Metric label="Success" value={metrics.successfulLoads.toString()} color="#4CAF50" />
              <Metric label="Failed" value={metrics.failedLoads.toString()} color="#f44336" />
            </View>
          </View>

          {/* Navigation Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Navigation</Text>
            <View style={styles.metricRow}>
              <Metric label="Unique Domains" value={metrics.uniqueDomains.size.toString()} />
              <Metric label="Pages/Min" value={metrics.totalLoads > 0 ? (metrics.totalLoads / (sessionDuration / 60 || 1)).toFixed(1) : '0'} />
            </View>
          </View>

          {/* Recent History */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent History</Text>
            {pageLoads.length === 0 ? (
              <Text style={styles.empty}>No pages loaded yet</Text>
            ) : (
              pageLoads.slice(-5).reverse().map((load, idx) => (
                <View key={idx} style={styles.historyItem}>
                  <Text style={styles.historyUrl} numberOfLines={1}>
                    {new URL(load.url).hostname}
                  </Text>
                  <Text style={[styles.historyStatus, { color: load.success ? '#4CAF50' : '#f44336' }]}>
                    {load.success ? '✓' : '✗'} {load.loadTime.toFixed(2)}s
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function Metric({ label, value, color = '#6200ee' }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#6200ee',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggle: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    maxHeight: 400,
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyUrl: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  empty: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10,
  },
});

export default BrowserDashboard;
