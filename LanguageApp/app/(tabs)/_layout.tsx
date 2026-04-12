import { Tabs } from 'expo-router';
import React from 'react';
import { BottomNav } from '@/components/dashboard/BottomNav';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={props => <BottomNav {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="course" />
      <Tabs.Screen name="exam" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
