import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'HomePage',
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
        }}
      />
    </Tabs>
  );
}
