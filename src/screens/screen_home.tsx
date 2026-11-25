//import React, { useState, useRef, useEffect } from 'react';
//import AsyncStorage from '@react-native-async-storage/async-storage';
//import { addressFilter } from '../module/address/openapi';

//import { SearchCard, AddressItem, NearbyFacility } from '../components/card/searchCard';

import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Animated,
    Switch,
} from 'react-native';

import {HomeProvider, useHome} from "../hooks/useHomeRoute";
import {RunStatus} from "../components/home/runStatus";
import {CardList} from "@/components/card/searchCardList";
import {styles} from "../css/home";
import { Header } from "@/components/banner/headerBanner";

function HomeContent() {
    const {
        isDrivingMode, setIsDrivingMode, isLoggedIn, userName, text, setText,
        isFocused, setIsFocused, isLoading, isAutoSort, setIsAutoSort,
        activeTab, setActiveTab, destinationList, savedIds,
        filteredResults, selectedIndex, setSelectedIndex,
        completedCount, remainingCount, toastMsg, fadeAnim, triggerToast,
        handleLoginToggle, handleQuickPaste, handleExtractAddress,
        handleClearAllDestinations, handleResetMockData, handleToggleSave,
        handleDeleteDestination, handleUpdateMemo, handleMoveOrder,
        handleAddFromSaved, handleAddWaypoint, handleStartDriving,
        handleCompleteDestination,
    } = useHome();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F5F7" />

            {/* 2단계 상단 주행 상태 바 */}
            {/* 상당 Header 주행 표시 및 동선 수정 */}
            <RunStatus isDrivingMode={isDrivingMode}
                       completedCount={completedCount}
                       destinationTotalCount={destinationList.length}
                       onBackToSetup={() => setIsDrivingMode(false)}/>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.contentWrapper}>
                    <Header/>
                    <CardList/>

                    {/* 하단 고정 바 여백 확보 */}
                    <View style={{ height: 96 }} />
                </View>
            </ScrollView>

            {/* 1단계 하단 고정 주행 시작 액션 바 */}
            {!isDrivingMode && activeTab === 'all' && remainingCount > 0 && (
                <View style={styles.bottomFixedBar}>
                    <TouchableOpacity
                        style={styles.startDrivingBtn}
                        onPress={handleStartDriving}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.startDrivingText}>
                            🚗 총 {remainingCount}곳 확정 · 주행 안내 시작
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {toastMsg && (
                <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.toastText}>{toastMsg}</Text>
                </Animated.View>
            )}
        </View>
    );
}

export function HomeScreen()
{
    return (
        <HomeProvider>
            <HomeContent/>
        </HomeProvider>
    )
}
