import React, { useState, useRef } from 'react';
import {addressFilter} from '../module/address/openapi';
import {SearchCard} from '../components/card/searchCard';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    StatusBar,
    Animated,
} from 'react-native';

interface AddressResult {
    id: string;
    title: string;
    roadAddress: string;
    placeName: string;
    lat : string;
    lon: string;
    distance: string;
}
/*
const MOCK_RESULTS: AddressResult[] = [
    { id: '1', title: '스타벅스 강남역R점', roadAddress: '서울 강남구 테헤란로 111', distance: '2.1km' },
    { id: '2', title: '강남역 2번출구', roadAddress: '서울 강남구 강남대로 지하 396', distance: '2.3km' },
    { id: '3', title: '미즈컨테이너 강남이스트점', roadAddress: '서울 서초구 강남대로69길 8', distance: '2.5km' },
    { id: '4', title: '스파오 강남점', roadAddress: '서울 강남구 강남대로 432', distance: '2.8km' },
    { id: '5', title: '카카오프렌즈 강남플래그십 스토어', roadAddress: '서울 서초구 강남대로 429', distance: '2.9km' },
    { id: '6', title: 'CGV 강남', roadAddress: '서울 강남구 강남대로 438', distance: '3.0km' },
    { id: '7', title: '쉐이크쉑 강남점', roadAddress: '서울 강남구 강남대로 452', distance: '3.2km' },
    { id: '8', title: '교보문고 강남점', roadAddress: '서울 서초구 강남대로 465', distance: '3.5km' },
    { id: '9', title: '신논현역 3번출구', roadAddress: '서울 강남구 강남대로 470', distance: '3.6km' },
    { id: '10', title: '역삼역 1번출구', roadAddress: '서울 강남구 테헤란로 156', distance: '4.0km' },
];
*/

export function HomeScreen() {
    const [text, setText] = useState('내일 강남역 2번출구 스벅에서 3시에 보자!');
    const [isFocused, setIsFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
    const [savedIds, setSavedIds] = useState<string[]>(['1']);
    const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');

    // 로그인 상태 관리
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const userName = '홍길동';

    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const triggerToast = (msg: string) => {
        setToastMsg(msg);
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
            Animated.delay(1400),
            Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        ]).start(() => setToastMsg(null));
    };

    const handleToggleSave = (item: AddressResult) => {
        if (!isLoggedIn) {
            triggerToast('로그인이 필요한 기능입니다.');
            return;
        }
        const isAlreadySaved = savedIds.includes(item.id);
        if (isAlreadySaved) {
            setSavedIds((prev) => prev.filter((id) => id !== item.id));
            triggerToast('보관함에서 삭제되었습니다.');
        } else {
            setSavedIds((prev) => [...prev, item.id]);
            triggerToast('보관함에 저장되었습니다.');
        }
    };

    const handleQuickPaste = () => {
        setText('오늘 저녁 7시에 강남역 2번출구 근처 스벅에서 보자!');
        triggerToast('클립보드 내용을 붙여넣었습니다.');
    };

    const handleLoginToggle = () => {
        if (isLoggedIn) {
            setIsLoggedIn(false);
            triggerToast('로그아웃 되었습니다.');
        } else {
            setIsLoggedIn(true);
            triggerToast('로그인 되었습니다.');
        }
    };

    // Openapi + 카카오 검색 결과
    const MOCK_RESULTS: AddressResult[] = [];
    // 1. 상태로 리스트 관리
    const [destinationList, setDestinationList] = useState<AddressResult[]>(MOCK_RESULTS);
    const [isLoading, setIsLoading] = useState(false);

    // 2. 필터링 대상 교체
    const filteredResults = destinationList.filter((item)=>{
        if(activeTab ==='saved')
        {
            return savedIds.includes(item.id);
        }
        return true;
    });

    // 3. 주소 추출 핸들러
    const handleExtractAddress = async () => {
        if(!text.trim())
        {
            triggerToast('텍스트를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        try{
            const filterResult = await addressFilter(text);
            console.log("====>>>>>");
            console.log(filterResult);
            if (filterResult)
            {
                setDestinationList((prev)=>[filterResult, ...prev]);
                setSelectedIndex(0);
                triggerToast(`[추출 결과] :::  ${filterResult.title}`);
                console.log('[추출 결과] ::: ', filterResult);
            }
            else
            {
                triggerToast('목적지를 찾을 수 없습니다.');
                console.log('목적지를 찾을 수 없습니다.');
            }
        }catch (error)
        {
            console.log(error);
        }finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F5F7" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.contentWrapper}>

                    {/* 🔥 1. 로드투어 전용 모던 커머셜 헤더 */}
                    <View style={styles.topBar}>
                        <View style={styles.brandBox}>
                            <View style={styles.logoSymbol}>
                                <Text style={styles.logoSymbolText}>RT</Text>
                            </View>
                            <View style={styles.titleTextGroup}>
                                <Text style={styles.brandTitle}>로드투어</Text>
                                <Text style={styles.brandSubTitle}>ROAD TOUR</Text>
                            </View>
                        </View>

                        {isLoggedIn ? (
                            <TouchableOpacity style={styles.profileBtn} onPress={handleLoginToggle} activeOpacity={0.7}>
                                <View style={styles.profileDot} />
                                <Text style={styles.profileName}>{userName}</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.loginBtn} onPress={handleLoginToggle} activeOpacity={0.8}>
                                <Text style={styles.loginBtnText}>로그인</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* 🔥 2. 깔끔한 검색 카드 모듈 */}
                    <View style={[styles.cleanSearchCard, isFocused && styles.cleanSearchCardFocused]}>
                        <View style={styles.inputArea}>
                            <TextInput
                                style={styles.cleanTextInput}
                                value={text}
                                onChangeText={setText}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="문자/카톡 내용을 여기에 붙여넣으세요"
                                placeholderTextColor="#94A3B8"
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                            />

                            <View style={styles.inputActionRow}>
                                <TouchableOpacity onPress={handleQuickPaste} activeOpacity={0.7} style={styles.pasteBtn}>
                                    <Text style={styles.pasteBtnText}>📋 클립보드 붙여넣기</Text>
                                </TouchableOpacity>

                                {text.length > 0 && (
                                    <TouchableOpacity style={styles.clearBtn} onPress={() => setText('')} activeOpacity={0.7}>
                                        <Text style={styles.clearBtnText}>지우기</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <TouchableOpacity onPress={handleExtractAddress} style={styles.extractBtn} activeOpacity={0.88}>
                            <Text style={styles.extractBtnText}>주소 추출하기</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 탭 구분 */}
                    <View style={styles.tabRow}>
                        <TouchableOpacity onPress={() => setActiveTab('all')}>
                            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
                                목적지 {destinationList.length}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab('saved')}>
                            <Text style={[styles.tabText, activeTab === 'saved' && styles.tabTextActive]}>
                                보관함 {savedIds.length}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* 결과 카드 리스트 (유지) */}
                    <View style={styles.resultList}>
                        {filteredResults.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>저장된 목적지가 없습니다.</Text>
                            </View>
                        ) : (
                            filteredResults.map((item, index) => {
                                const isSelected = selectedIndex === index;
                                const isSaved = savedIds.includes(item.id);

                                const cardProps = {
                                    item,
                                    isSelected,
                                    isSaved,
                                    onSelect: () => setSelectedIndex(isSelected ? null : index),
                                    onToggleSave: handleToggleSave,
                                };

                                return (<SearchCard key={item.id} {...cardProps} />);
                            })
                        )}
                    </View>

                </View>
            </ScrollView>

            {toastMsg && (
                <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.toastText}>{toastMsg}</Text>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F5F7',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 48,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        alignItems: 'center',
    },
    contentWrapper: {
        width: '100%',
        maxWidth: 440,
    },

    // 🔥 1. 로드투어 모던 브랜딩 헤더
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 12,
    },
    brandBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logoSymbol: {
        width: 32,
        height: 32,
        borderRadius: 9,
        backgroundColor: '#2563EB', // 메인 브랜드 블루
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoSymbolText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    titleTextGroup: {
        justifyContent: 'center',
    },
    brandTitle: {
        fontSize: 17,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    brandSubTitle: {
        fontSize: 9,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 0.8,
        marginTop: -2,
    },
    loginBtn: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
    },
    loginBtnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    profileBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E2E8F0',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
        gap: 6,
    },
    profileDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
    },
    profileName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#334155',
    },

    // 🔥 2. 검색 모듈 스타일
    cleanSearchCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 14,
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    cleanSearchCardFocused: {
        borderColor: '#2563EB',
        shadowColor: '#2563EB',
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    inputArea: {
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginBottom: 10,
    },
    cleanTextInput: {
        fontSize: 14,
        color: '#0F172A',
        minHeight: 60,
        lineHeight: 20,
    },
    inputActionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    pasteBtn: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    pasteBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#2563EB',
    },
    clearBtn: {
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    clearBtnText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#94A3B8',
    },
    extractBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        paddingVertical: 13,
        alignItems: 'center',
    },
    extractBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
    },

    // 탭 스타일
    tabRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#94A3B8',
    },
    tabTextActive: {
        color: '#0F172A',
        fontWeight: '800',
    },

    // 결과 카드 스타일 (유지)
    resultList: {
        gap: 12,
    },
    accentCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    accentCardSelected: {
        borderColor: '#2563EB',
        borderWidth: 1.5,
        shadowColor: '#2563EB',
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 5,
    },
    cardColorBar: {
        width: 5,
        backgroundColor: '#CBD5E1',
    },
    cardColorBarActive: {
        backgroundColor: '#2563EB',
    },
    cardInner: {
        flex: 1,
        padding: 16,
    },
    cardHeaderArea: {
        width: '100%',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    placeTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
        flex: 1,
        marginRight: 8,
    },
    rightGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    distanceBadge: {
        fontSize: 11,
        fontWeight: '700',
        color: '#2563EB',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    roadAddress: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    starIcon: {
        fontSize: 20,
        color: '#CBD5E1',
    },
    starIconActive: {
        color: '#F59E0B',
    },

    naviButtonGroup: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
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

    emptyState: {
        paddingVertical: 30,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 13,
        color: '#94A3B8',
    },

    toastContainer: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        backgroundColor: '#0F172A',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        elevation: 4,
    },
    toastText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
});