import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// Icon component
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={26} style={{ marginBottom: -3 }} {...props} />;
}

// Tab Layout
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, false), // Disable header for web
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mangas',
          tabBarIcon: ({ color }) => <TabBarIcon name="bookmark" color={color} />,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}
