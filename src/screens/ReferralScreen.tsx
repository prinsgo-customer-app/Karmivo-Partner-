import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { apiClient } from '../api/client';

export const ReferralScreen = () => {
  const [referrals, setReferrals] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchReferrals = async () => {
    try {
      setError('');
      const res = await apiClient.get('/partner/referrals');
      setReferrals(res.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load referral data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReferrals();
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
        <Text style={styles.emptyText}>No referral history found.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Refer & Earn</Text>

      {!loading && referrals && (
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Your Referral Code</Text>
          <Text style={styles.codeText}>{referrals.referralCode}</Text>
          <TouchableOpacity style={styles.shareBtn}>
            <Text style={styles.shareBtnText}>Share Code</Text>
          </TouchableOpacity>

          <View style={styles.rewardSummary}>
            <Text style={styles.rewardText}>Total Earned: ₹{referrals.totalEarned || 0}</Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Referral History</Text>
      <FlatList
        data={referrals?.history || []}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <View>
              <Text style={styles.referredUser}>{item.referredUser}</Text>
              <Text style={styles.referralStatus}>Status: {item.status}</Text>
            </View>
            <Text style={styles.referralAmount}>₹{item.rewardAmount}</Text>
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
  codeContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  codeLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  codeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 2,
    marginBottom: 20,
  },
  shareBtn: {
    backgroundColor: '#00D150',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  shareBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rewardSummary: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    width: '100%',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 16,
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
  referredUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  referralStatus: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  referralAmount: {
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
