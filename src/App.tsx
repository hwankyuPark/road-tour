import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';

import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { LoginScreen } from './screens/screen_login';
import { HomeScreen } from './screens/screen_home';
import { AdressListScreen } from './screens/screen_adressList';
import { TestScreen } from './screens/screen_test';
import { TestInputScreen } from './screens/screen_test_text';

export type RootTabParamList = {
    Login: undefined;
    Home: undefined;
    Address: undefined;
    Test: undefined;
    TestInput: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// 💡 1. 탭 네비게이션을 별도 컴포넌트로 분리 (useSafeAreaInsets 활용을 위함)
function TabNavigator() {
    // 💡 폰의 실제 하단 시스템 바 높이를 동적으로 가져옴 (아이폰은 약 34, 안드로이드는 약 0~24)
    const insets = useSafeAreaInsets();
    const bottomPadding = insets.bottom > 0 ? insets.bottom : 10;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#8E8E93',
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#e9ecef',
                    // 💡 기기별 하단 여백 + 순수 탭바 높이(60)를 동적으로 합성
                    height: 60 + bottomPadding,
                    paddingBottom: bottomPadding,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Address') {
                        return (
                            <FontAwesome
                                name={focused ? 'address-card' : 'address-card-o'}
                                size={size}
                                color={color}
                            />
                        );
                    }

                    if (route.name === 'Login') {
                        iconName = focused ? 'log-in' : 'log-in-outline';
                    } else if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Test' || route.name === 'TestInput') {
                        iconName = focused ? 'construct' : 'construct-outline';
                    } else {
                        iconName = 'ellipse';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Login" component={LoginScreen} options={{ title: '로그인' }} />
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
            <Tab.Screen name="Address" component={AdressListScreen} options={{ title: '주소관리' }} />
            <Tab.Screen name="Test" component={TestScreen} options={{ title: 'TEST-LIST' }} />
            <Tab.Screen name="TestInput" component={TestInputScreen} options={{ title: 'TEST-Input' }} />
        </Tab.Navigator>
    );
}

// 💡 2. 최상위 App 컴포넌트
export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <TabNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});