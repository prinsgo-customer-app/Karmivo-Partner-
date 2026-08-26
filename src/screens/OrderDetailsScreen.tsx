import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { apiClient } from '../api/client';

export const OrderDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params as { orderId: string };

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrderDetails = async () => {
    try {
      setError('');
      setLoading(true);
      const res = await apiClient.get(`/partner/orders/${orderId}`);
      setOrder(res.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load order details');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const handleAction = async (action: string) => {
    setActionLoading(true);
    try {
      await apiClient.post(`/partner/orders/${orderId}/action`, { action });
      await fetchOrderDetails(); // Refresh details after successful action
    } catch (err: any) {
      Alert.alert('Action Failed', err.response?.data?.message || 'Failed to perform action on order.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00D150" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Order not found'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Order #{order.id}</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Customer Details</Text>
        <Text style={styles.detailText}>Name: {order.customerName || 'N/A'}</Text>
        <Text style={styles.detailText}>Location: {order.location || 'N/A'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Service Details</Text>
        <Text style={styles.detailText}>Service: {order.serviceName || 'N/A'}</Text>
        <Text style={styles.detailText}>Price: ₹{order.price || '0'}</Text>
        <Text style={styles.detailText}>Status: {order.status}</Text>
      </View>

      <View style={styles.actionsContainer}>
        {actionLoading ? (
          <ActivityIndicator size="large" color="#00D150" />
        ) : (
          <>
            {order.status === 'ASSIGNED' && (
              <>
                <TouchableOpacity style={[styles.actionBtn, styles.acceptBtn]} onPress={() => handleAction('ACCEPT')}>
                  <Text style={styles.actionBtnText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => handleAction('REJECT')}>
                  <Text style={styles.actionBtnText}>Reject</Text>
                </TouchableOpacity>
              </>
            )}
            {order.status === 'ACCEPTED' && (
              <TouchableOpacity style={[styles.actionBtn, styles.startBtn]} onPress={() => handleAction('START')}>
                <Text style={styles.actionBtnText}>Start Service</Text>
              </TouchableOpacity>
            )}
            {order.status === 'IN_PROGRESS' && (
              <TouchableOpacity style={[styles.actionBtn, styles.completeBtn]} onPress={() => handleAction('COMPLETE')}>
                <Text style={styles.actionBtnText}>Complete Service</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#FFF',
    color: '#333',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    margin: 20,
    marginBottom: 0,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  actionsContainer: {
    padding: 20,
    marginTop: 10,
  },
  actionBtn: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  acceptBtn: {
    backgroundColor: '#00D150',
  },
  rejectBtn: {
    backgroundColor: '#D32F2F',
  },
  startBtn: {
    backgroundColor: '#007BFF',
  },
  completeBtn: {
    backgroundColor: '#00D150',
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  backBtn: {
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  }
});
