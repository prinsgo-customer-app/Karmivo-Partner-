import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { MainNavigator } from './src/navigation/MainNavigator';
import { useAuthStore } from './src/store/authStore';

export default function App() {
  const { token, initAuth } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      await initAuth();
      setIsReady(true);
    };
    bootstrap();
  }, [initAuth]);

  if (!isReady) {
    // Optionally return a minimal splash screen here while loading async storage
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {token ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
