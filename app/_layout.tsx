import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Alert } from 'react-native';
import { initDB, pruneOldLogs, seedData } from '../services/database';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setup = async () => {
      try {
        console.log('Starting database initialization...');
        await initDB();
        console.log('Database initialized, seeding data...');
        await seedData();
        console.log('Data seeded, pruning old logs...');
        await pruneOldLogs();
        console.log('Database setup complete!');
        setDbReady(true);
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        console.error("Database setup failed:", e);
        setError(errorMsg);
        Alert.alert(
          'Database Error',
          `Failed to initialize database: ${errorMsg}. Please restart the app.`,
          [{ text: 'OK' }]
        );
      }
    };
    setup();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Ionicons name="alert-circle" size={64} color="#dc2626" />
        <Text style={{ marginTop: 16, fontSize: 18, fontWeight: 'bold', color: '#dc2626' }}>
          Database Error
        </Text>
        <Text style={{ marginTop: 8, textAlign: 'center', color: '#666' }}>
          {error}
        </Text>
        <Text style={{ marginTop: 16, textAlign: 'center', color: '#999' }}>
          Please restart the app
        </Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={{ marginTop: 16, color: '#6b7280' }}>Initializing Database...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: '#1a202c' },
          headerTintColor: '#fff',
          drawerActiveBackgroundColor: '#edf2f7',
          drawerActiveTintColor: '#1a202c',
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Super Scanner',
            title: 'GateFlow Scanner',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="scan-circle-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="logs"
          options={{
            drawerLabel: 'Access Logs',
            title: 'Gate History',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="list-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
