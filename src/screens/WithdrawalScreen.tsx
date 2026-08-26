import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { apiClient } from '../api/client';
import { useNavigation } from '@react-navigation/native';

export const WithdrawalScreen = () => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('UPI'); // Default method
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigation = useNavigation();

  const handleWithdrawal = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiClient.post('/partner/withdrawal', {
        amount: Number(amount),
        method,
      });
      setSuccess('Withdrawal request submitted successfully');
      setAmount('');
      setLoading(false);
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit withdrawal request');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.headerTitle}>Withdraw Funds</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Amount (₹)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={(val) => {
            setAmount(val);
            setError('');
          }}
          placeholder="Enter withdrawal amount"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Payout Method</Text>
        <View style={styles.methodContainer}>
          <TouchableOpacity
            style={[styles.methodBtn, method === 'UPI' && styles.methodBtnActive]}
            onPress={() => setMethod('UPI')}
          >
            <Text style={[styles.methodText, method === 'UPI' && styles.methodTextActive]}>UPI</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.methodBtn, method === 'BANK' && styles.methodBtnActive]}
            onPress={() => setMethod('BANK')}
          >
            <Text style={[styles.methodText, method === 'BANK' && styles.methodTextActive]}>Bank</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleWithdrawal}
          disabled={loading || !!success}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitBtnText}>Submit Request</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  methodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  methodBtn: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#FFF',
  },
  methodBtnActive: {
    borderColor: '#00D150',
    backgroundColor: '#E8F5E9',
  },
  methodText: {
    fontSize: 16,
    color: '#333',
  },
  methodTextActive: {
    color: '#00D150',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  successText: {
    color: '#00D150',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelBtn: {
    padding: 15,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#555',
    fontSize: 16,
  }
});
