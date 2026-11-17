import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Switch,
    StatusBar,
    Alert,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AddressItem {
    id: string;
    title: string;
    roadAddress: string;
    placeName?: string;
    lat?: string;
    lon?: string;
    distance?: string;
    distanceKm?: number;
}

const MOCK_DATA: AddressItem[] = [];

export function AdressListScreen() {
    const [isAutoSortEnabled, setIsAutoSortEnabled] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // 아코디언 카드 선택 상태 (처음에는 모두 닫힌 상태)
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [items, setItems] = useState<AddressItem[]>(MOCK_DATA);
    const [checkedIds, setCheckedIds] = useState<string[]>([]);

    // 체크박스 개별 선택/해제
    const handleToggleCheck = (id: string) => {
        setCheckedIds((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        );
    };

    // 전체 선택/해제
    const handleToggleSelectAll = () => {
        if (filteredList.length === 0) return;
        if (checkedIds.length === filteredList.length) {
            setCheckedIds([]);
        } else {
            setCheckedIds(filteredList.map((item) => item.id));
        }
    };

    // 선택 항목 일괄 삭제
    const handleDeleteChecked = () => {
        if (checkedIds.length === 0) return;

        Alert.alert(
            '목적지 삭제',
            `선택한 ${checkedIds.length}개의 목적지를 삭제하시겠습니까?`,
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: () => {
                        setItems((prev) => prev.filter((item) => !checkedIds.includes(item.id)));
                        setCheckedIds([]);
                        setSelectedId(null);
                    },
                },
            ]
        );
    };

    const handleNaviLaunch = (naviName: string, placeTitle: string) => {
        Alert.alert('내비게이션 연결', `${naviName}(으)로 [${placeTitle}] 안내를 시작합니다.`);
    };

    const filteredList = items.filter(
        (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.roadAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedList = isAutoSortEnabled
        ? [...filteredList].sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))
        : filteredList;

    const isAllChecked = checkedIds.length === filteredList.length && filteredList.length > 0;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F5F7" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.contentWrapper}>

                    {/* 1. 상단 브랜드 헤더 */}
                    <View style={styles.headerBlock}>
                        <View style={styles.headerTitleRow}>
                            <View style={styles.headerLeftGroup}>
                                <View style={styles.logoBadge}>
                                    <Text style={styles.logoBadgeText}>RT</Text>
                                </View>
                                <Text style={styles.headerTitle}>주소 관리 영역</Text>
                                <View style={styles.countBadge}>
                                    <Text style={styles.countBadgeText}>{sortedList.length}</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.headerSubText}>목적지를 체크하여 한 번에 삭제하거나 터치하여 내비로 연결하세요</Text>
                    </View>

                    {/* 2. 목적지 검색 입력창 */}
                    <View style={styles.searchBox}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="장소명 또는 도로명 주소 검색"
                            placeholderTextColor="#94A3B8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
                                <Text style={styles.clearIcon}>✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* 3. 상단 컨트롤 바 (전체 선택 & 거리순 정렬/삭제) */}
                    <View style={styles.controlBar}>
                        <TouchableOpacity
                            style={styles.selectAllBox}
                            onPress={handleToggleSelectAll}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.checkbox, isAllChecked && styles.checkboxChecked]}>
                                {isAllChecked && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.selectAllText}>
                                전체선택 {checkedIds.length > 0 && `(${checkedIds.length}/${filteredList.length})`}
                            </Text>
                        </TouchableOpacity>

                        {checkedIds.length > 0 ? (
                            <TouchableOpacity
                                style={styles.deleteActiveBtn}
                                onPress={handleDeleteChecked}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.deleteActiveBtnText}>🗑 {checkedIds.length}개 삭제</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.sortToggleGroup}>
                                <Text style={styles.sortTitle}>거리순 정렬</Text>
                                <Switch
                                    trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                                    thumbColor={isAutoSortEnabled ? '#2563EB' : '#F8FAFC'}
                                    ios_backgroundColor="#CBD5E1"
                                    onValueChange={setIsAutoSortEnabled}
                                    value={isAutoSortEnabled}
                                />
                            </View>
                        )}
                    </View>

                    {/* 4. 목적지 카드 목록 */}
                    <View style={styles.listSection}>
                        {sortedList.length === 0 ? (
                            <View style={styles.emptyCard}>
                                <Text style={styles.emptyText}>저장된 목적지가 없습니다.</Text>
                            </View>
                        ) : (
                            sortedList.map((item) => {
                                const isSelected = selectedId === item.id;
                                const isChecked = checkedIds.includes(item.id);

                                return (
                                    <View
                                        key={item.id}
                                        style={[
                                            styles.listCard,
                                            isSelected && styles.listCardSelected,
                                            isChecked && styles.listCardChecked,
                                        ]}
                                    >
                                        <View style={[styles.cardAccentBar, isSelected && styles.cardAccentBarActive]} />

                                        {/* 체크박스 */}
                                        <TouchableOpacity
                                            style={styles.checkboxTouchArea}
                                            onPress={() => handleToggleCheck(item.id)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                                                {isChecked && <Text style={styles.checkmark}>✓</Text>}
                                            </View>
                                        </TouchableOpacity>

                                        {/* 카드 내용 영역 */}
                                        <View style={styles.cardInner}>
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                onPress={() => setSelectedId(isSelected ? null : item.id)}
                                                style={styles.cardHeaderArea}
                                            >
                                                <View style={styles.cardHeaderRow}>
                                                    <Text style={styles.placeTitle}>{item.title}</Text>
                                                    <View style={styles.distBadge}>
                                                        <Text style={styles.distBadgeText}>{item.distanceKm}km</Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.roadAddress}>{item.roadAddress}</Text>
                                            </TouchableOpacity>

                                            {/* 터치 시 펼쳐지는 내비 선택 영역 */}
                                            {isSelected && (
                                                <View style={styles.naviActionArea}>
                                                    <Text style={styles.naviActionLabel}>내비게이션 바로 연결</Text>
                                                    <View style={styles.naviBtnGroup}>
                                                        <TouchableOpacity
                                                            style={[styles.naviBtn, styles.kakaoBg]}
                                                            onPress={() => handleNaviLaunch('카카오내비', item.title)}
                                                            activeOpacity={0.8}
                                                        >
                                                            <Text style={styles.kakaoText}>카카오내비</Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                            style={[styles.naviBtn, styles.tmapBg]}
                                                            onPress={() => handleNaviLaunch('TMAP', item.title)}
                                                            activeOpacity={0.8}
                                                        >
                                                            <Text style={styles.tmapText}>TMAP</Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                            style={[styles.naviBtn, styles.naverBg]}
                                                            onPress={() => handleNaviLaunch('네이버지도', item.title)}
                                                            activeOpacity={0.8}
                                                        >
                                                            <Text style={styles.naverText}>네이버지도</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                );
                            })
                        )}
                    </View>

                    {/* 5. 최하단 푸터 */}
                    <View style={styles.footerArea}>
                        <Text style={styles.footerBrandText}>THE PARK</Text>
                        <Text style={styles.footerCopyright}>© The Park Corp. All rights reserved.</Text>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F5F7',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    contentWrapper: {
        width: '100%',
        maxWidth: 440,
    },
    headerBlock: {
        marginBottom: 16,
        paddingHorizontal: 2,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    headerLeftGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoBadge: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 7,
    },
    logoBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    countBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    countBadgeText: {
        color: '#2563EB',
        fontSize: 12,
        fontWeight: '800',
    },
    headerSubText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
    },
    searchIcon: {
        fontSize: 14,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#0F172A',
        fontWeight: '500',
    },
    clearIcon: {
        color: '#94A3B8',
        fontSize: 12,
        fontWeight: '800',
        paddingHorizontal: 4,
    },
    controlBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    selectAllBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    selectAllText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#334155',
    },
    deleteActiveBtn: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    deleteActiveBtnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
    },
    sortToggleGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sortTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748B',
    },
    listSection: {
        gap: 12,
        marginBottom: 32,
    },
    listCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    listCardSelected: {
        borderColor: '#2563EB',
        borderWidth: 1.5,
    },
    listCardChecked: {
        backgroundColor: '#F8FAFC',
        borderColor: '#93C5FD',
    },
    cardAccentBar: {
        width: 4,
        backgroundColor: '#CBD5E1',
    },
    cardAccentBarActive: {
        backgroundColor: '#2563EB',
    },
    checkboxTouchArea: {
        paddingLeft: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: '#CBD5E1',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '900',
    },
    cardInner: {
        flex: 1,
        padding: 16,
        paddingLeft: 12,
    },
    cardHeaderArea: {
        width: '100%',
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    placeTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
        flex: 1,
        marginRight: 8,
    },
    distBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    distBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#2563EB',
    },
    roadAddress: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    naviActionArea: {
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        marginTop: 14,
        paddingTop: 12,
    },
    naviActionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94A3B8',
        marginBottom: 8,
    },
    naviBtnGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    naviBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    kakaoBg: {
        backgroundColor: '#FEE500',
    },
    kakaoText: {
        color: '#191919',
        fontWeight: '800',
        fontSize: 12,
    },
    tmapBg: {
        backgroundColor: '#0066FF',
    },
    tmapText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 12,
    },
    naverBg: {
        backgroundColor: '#03CF5D',
    },
    naverText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 12,
    },
    emptyCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 36,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    emptyText: {
        fontSize: 13,
        color: '#94A3B8',
        fontWeight: '600',
    },
    footerArea: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    footerBrandText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#334155',
        letterSpacing: 1.5,
        marginBottom: 2,
    },
    footerCopyright: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '500',
    },
});

export default AdressListScreen;