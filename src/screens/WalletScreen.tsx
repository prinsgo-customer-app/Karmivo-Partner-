import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { apiClient } from '../api/client';
import { useNavigation } from '@react-navigation/native';

export const WalletScreen = () => {
  const navigation = useNavigation();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchWalletData = async () => {
    try {
      setError('');
      const res = await apiClient.get('/partner/wallet');
      setWallet(res.data?.summary || { balance: 0, pending: 0, withdrawable: 0 });
      setTransactions(res.data?.transactions || []);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load wallet data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWalletData();
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
        <Text style={styles.emptyText}>No transactions found</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Wallet</Text>

      {!loading && wallet && (
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₹{wallet.withdrawable || 0}</Text>
          <TouchableOpacity style={styles.withdrawBtn} onPress={() => navigation.navigate('Withdrawal' as never)}>
            <Text style={styles.withdrawBtnText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.transactionsHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <Text style={styles.txId}>Txn #{item.id}</Text>
            <Text style={styles.txAmount}>₹{item.amount}</Text>
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
  balanceCard: {
    backgroundColor: '#000',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#CCC',
    fontSize: 16,
    marginBottom: 10,
  },
  balanceAmount: {
    color: '#00D150',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  withdrawBtn: {
    backgroundColor: '#00D150',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  withdrawBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionsHeader: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
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
  transactionCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txId: {
    fontSize: 14,
    color: '#555',
  },
  txAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  }
});
