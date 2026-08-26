import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';

export const HomeScreen = () => {
  const { isOnline, setIsOnline } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setError('');
      const res = await apiClient.get('/partner/dashboard');
      setDashboardData(res.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboard();
    setRefreshing(false);
  };

  const toggleOnlineStatus = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    try {
      await apiClient.post('/partner/status', { status: newStatus ? 'ONLINE' : 'OFFLINE' });
    } catch (err) {
      // Revert if API fails
      setIsOnline(!newStatus);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello Partner,</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
          <Switch
            value={isOnline}
            onValueChange={toggleOnlineStatus}
            trackColor={{ false: '#767577', true: '#00D150' }}
          />
        </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#00D150" />
        </View>
      ) : !dashboardData ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No dashboard data available</Text>
        </View>
      ) : (
        <View style={styles.dashboard}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today's Earnings</Text>
            <Text style={styles.cardValue}>₹{dashboardData.todayEarnings ?? '-'}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pending Requests</Text>
            <Text style={styles.cardValue}>{dashboardData.pendingRequests ?? '-'}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Wallet Balance</Text>
            <Text style={styles.cardValue}>₹{dashboardData.walletBalance ?? '-'}</Text>
          </View>
        </View>
      )}

      {/* Offers and dynamic Admin controlled components would be rendered below */}
      {!loading && dashboardData?.offers && dashboardData.offers.length > 0 ? (
        <View style={styles.offersContainer}>
           <Text style={styles.sectionTitle}>Active Offers</Text>
           {dashboardData.offers.map((offer: any, idx: number) => (
             <Text key={idx} style={styles.offerText}>{offer.title}</Text>
           ))}
        </View>
      ) : (
        !loading && (
          <View style={styles.offersContainer}>
            <Text style={styles.sectionTitle}>Active Offers</Text>
            <Text style={styles.emptyText}>No active offers at the moment.</Text>
          </View>
        )
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    paddingTop: 50,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginRight: 10,
    fontWeight: 'bold',
    color: '#555',
  },
  dashboard: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  offersContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  offerText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FFEBEE',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
  },
});
