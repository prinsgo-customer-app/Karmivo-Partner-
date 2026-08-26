import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';

import { useNavigation } from '@react-navigation/native';

export const LoginScreen = () => {
  const navigation = useNavigation();
  const setToken = useAuthStore((state) => state.setToken);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (mobileNumber.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiClient.post('/auth/send-otp', { mobileNumber });
      setOtpSent(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.post('/auth/verify-otp', { mobileNumber, otp });
      if (res.data && res.data.token) {
        await setToken(res.data.token);
      } else {
        throw new Error('No token received');
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid OTP');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {!otpSent ? (
        <>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            value={mobileNumber}
            onChangeText={(text) => {
              setMobileNumber(text);
              setError('');
            }}
            placeholder="Enter mobile number"
            placeholderTextColor="#888"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send OTP</Text>}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>Enter OTP</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={otp}
            onChangeText={(text) => {
              setOtp(text);
              setError('');
            }}
            placeholder="Enter OTP"
            placeholderTextColor="#888"
            maxLength={6}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setOtpSent(false)} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </>
      )}

      {!otpSent && (
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.footerLink} onPress={() => (navigation.navigate as any)('SignUp')}>
            <Text style={styles.footerText}>New Partner? Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink} onPress={() => (navigation.navigate as any)('ForgotPassword')}>
            <Text style={styles.footerText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  button: {
    backgroundColor: '#00D150',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
  footerContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerLink: {
    marginBottom: 15,
  },
  footerText: {
    color: '#00D150',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
