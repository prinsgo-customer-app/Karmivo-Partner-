import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { apiClient } from '../api/client';

export const EarningsScreen = () => {
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchEarnings = async () => {
    try {
      setError('');
      const res = await apiClient.get('/partner/earnings');
      setEarnings(res.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load earnings data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEarnings();
    setRefreshing(false);
  };

  const renderEmpty = () => {
    if (loading) return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#00D150" />
      </View>
    );
    if (error) return <Text style={styles.errorText}>{error}</Text>;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No earnings data available</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Earnings</Text>

      {!loading && earnings && (
        <View style={styles.summaryContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total Earnings</Text>
            <Text style={styles.cardValue}>₹{earnings.total || 0}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>This Week</Text>
            <Text style={styles.cardValue}>₹{earnings.weekly || 0}</Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Earning History</Text>
      <FlatList
        data={earnings?.history || []}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <View>
              <Text style={styles.historyId}>Order #{item.orderId}</Text>
              <Text style={styles.historyDate}>{item.date}</Text>
            </View>
            <Text style={styles.historyAmount}>+₹{item.amount}</Text>
          </View>
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#FFF',
    color: '#333',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 10,
    color: '#333',
  },
  listContent: {
    padding: 20,
    flexGrow: 1,
  },
  historyCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historyDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00D150',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
