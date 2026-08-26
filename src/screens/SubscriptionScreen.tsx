import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { apiClient } from '../api/client';

export const SubscriptionScreen = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchSubscriptions = async () => {
    try {
      setError('');
      const res = await apiClient.get('/partner/subscriptions');
      setPlans(res.data?.plans || []);
      setCurrentSubscription(res.data?.current || null);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load subscriptions');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSubscriptions();
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
        <Text style={styles.emptyText}>No subscription plans available right now.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Subscription Plans</Text>

      {currentSubscription && (
        <View style={styles.activePlanContainer}>
          <Text style={styles.activePlanTitle}>Current Plan: {currentSubscription.name}</Text>
          <Text style={styles.activePlanDetails}>Status: {currentSubscription.status}</Text>
          <Text style={styles.activePlanDetails}>Expires on: {currentSubscription.expiryDate}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Available Plans</Text>
      <FlatList
        data={plans}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.planCard}>
            <View>
              <Text style={styles.planName}>{item.name}</Text>
              <Text style={styles.planPrice}>₹{item.price}</Text>
              <Text style={styles.planDuration}>{item.durationMonths} Months</Text>
            </View>
            <TouchableOpacity style={styles.subscribeBtn}>
              <Text style={styles.subscribeBtnText}>Subscribe</Text>
            </TouchableOpacity>
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
  activePlanContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#00D150',
    borderRadius: 10,
  },
  activePlanTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  activePlanDetails: {
    color: '#FFF',
    fontSize: 14,
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
  planCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00D150',
  },
  planDuration: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  subscribeBtn: {
    backgroundColor: '#00D150',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  subscribeBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
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
