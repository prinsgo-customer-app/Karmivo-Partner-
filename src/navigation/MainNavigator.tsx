import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { WithdrawalScreen } from '../screens/WithdrawalScreen';
import { DocumentsScreen } from '../screens/DocumentsScreen';
import { EarningsScreen } from '../screens/EarningsScreen';
import { SubscriptionScreen } from '../screens/SubscriptionScreen';
import { ReferralScreen } from '../screens/ReferralScreen';
import { OffersScreen } from '../screens/OffersScreen';
import { OrderDetailsScreen } from '../screens/OrderDetailsScreen';

const Stack = createStackNavigator();

export const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="Withdrawal" component={WithdrawalScreen} />
      <Stack.Screen name="Documents" component={DocumentsScreen} />
      <Stack.Screen name="Earnings" component={EarningsScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="Referral" component={ReferralScreen} />
      <Stack.Screen name="Offers" component={OffersScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    </Stack.Navigator>
  );
};
