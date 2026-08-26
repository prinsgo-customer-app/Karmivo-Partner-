import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { useNavigation } from '@react-navigation/native';

export const ProfileScreen = () => {
  const { logout } = useAuthStore();
  const navigation = useNavigation();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      setError('');
      const res = await apiClient.get('/partner/profile');
      setProfile(res.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await apiClient.delete('/partner/account');
              await logout();
            } catch (err: any) {
              Alert.alert('Error', err.response?.data?.message || 'Failed to delete account');
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.headerTitle}>Profile</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#00D150" />
        </View>
      ) : (
        <View style={styles.profileSection}>
          {profile ? (
            <View>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{profile.firstName} {profile.lastName}</Text>

              <Text style={styles.label}>Mobile</Text>
              <Text style={styles.value}>{profile.mobile}</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Profile details unavailable</Text>
            </View>
          )}

          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Earnings' as never)}>
              <Text style={styles.menuItemText}>Earnings History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Subscription' as never)}>
              <Text style={styles.menuItemText}>Subscription Plans</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Documents' as never)}>
              <Text style={styles.menuItemText}>Documents</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Referral' as never)}>
              <Text style={styles.menuItemText}>Refer & Earn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Offers' as never)}>
              <Text style={styles.menuItemText}>Offers & Coupons</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
              <Text style={styles.deleteBtnText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
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
  profileSection: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    marginBottom: 15,
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  logoutBtn: {
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteBtn: {
    padding: 15,
    marginTop: 15,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: 'bold',
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
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
});
