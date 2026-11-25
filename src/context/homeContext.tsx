import { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addressFilter } from '../module/address/openapi';
import { AddressItem, NearbyFacility } from '../components/card/searchCard';

const STORAGE_KEY_DESTINATIONS = '@roadtour_destinations_v1';
const STORAGE_KEY_SAVED = '@roadtour_saved_ids_v1';

const MOCK_RESULTS: AddressItem[] = [
    {
        id: '1',
        title: '전민동 광세족발',
        roadAddress: '대전 유성구 전민로30번길 53',
        placeName: '광세족발 전민점',
        lat: '36.3982',
        lon: '127.4025',
        phone: '042-861-1234',
        distance: '120m',
        distanceKm: 0.12,
        memo: '공동현관 #1234',
        isOpen: true,
        businessHours: '16:00 - 24:00 (라스트오더 23:20)',
        closedDays: '매주 일요일 정기휴무',
        nearbyList: [
            {
                id: 'wp_p1',
                name: '전민동 제1공영주차장',
                badge: '공영',
                distanceText: '120m (도보 2분)',
                isOnWay: true,
                roadAddress: '대전 유성구 전민동 302-4',
                lat: '36.3985',
                lon: '127.4021',
            },
        ],
    },
    {
        id: '2',
        title: '충남대학교병원',
        roadAddress: '대전 중구 문화로 282',
        placeName: '충남대학교병원',
        lat: '36.3168',
        lon: '127.4152',
        phone: '1599-7123',
        distance: '2.4km',
        distanceKm: 2.4,
        memo: '본관 1층 접수처',
        isOpen: true,
        businessHours: '평일 08:30 - 17:30 (응급실 24시간)',
        closedDays: '토·일·공휴일 외래 휴진',
        nearbyList: [
            {
                id: 'wp_pm1',
                name: '대학로 온누리약국',
                badge: '약국',
                distanceText: '85m (정문 앞)',
                isOnWay: true,
                roadAddress: '대전 중구 문화로 278',
                lat: '36.3165',
                lon: '127.4148',
            },
        ],
    },
    {
        id: '3',
        title: '유성온천역 스타벅스',
        roadAddress: '대전 유성구 온천로 92',
        placeName: '스타벅스 유성온천역점',
        lat: '36.3538',
        lon: '127.3415',
        phone: '1522-3232',
        distance: '4.1km',
        distanceKm: 4.1,
        isOpen: true,
        businessHours: '매일 07:00 - 22:00',
        closedDays: '연중무휴',
        nearbyList: [
            {
                id: 'wp_p2',
                name: '유성온천 공영주차장',
                badge: '공영',
                distanceText: '90m (도보 1분)',
                isOnWay: true,
                roadAddress: '대전 유성구 봉명동 574',
                lat: '36.3541',
                lon: '127.3410',
            },
        ],
    },
];

// 👇 여기서부터 훅 함수 시작!
export function useHomeContext() {
    const [text, setText] = useState('오늘 전민동 광세족발(공동현관 #1234) 갔다가 충남대병원 들러서 유성온천역 스벅 가자!');
    const [isFocused, setIsFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
    const [savedIds, setSavedIds] = useState<string[]>(['3']);
    const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
    const [isAutoSort, setIsAutoSort] = useState(true);

    // 1단계(동선 세팅) <-> 2단계(주행 모드) 전환 상태
    const [isDrivingMode, setIsDrivingMode] = useState(false);

    // 목적지 목록 상태
    const [destinationList, setDestinationList] = useState<AddressItem[]>(MOCK_RESULTS);
    const [isLoading, setIsLoading] = useState(false);

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

    // 로컬 저장소(AsyncStorage) 동기화
    const syncStorage = async (nextList: AddressItem[], nextSavedIds: string[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY_DESTINATIONS, JSON.stringify(nextList));
            await AsyncStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(nextSavedIds));
        } catch (error) {
            console.log('저장소 동기화 오류:', error);
        }
    };

    // 앱 시작 시 저장된 목록 불러오기
    useEffect(() => {
        const loadStorage = async () => {
            try {
                const rawList = await AsyncStorage.getItem(STORAGE_KEY_DESTINATIONS);
                const rawSaved = await AsyncStorage.getItem(STORAGE_KEY_SAVED);
                if (rawList !== null) {
                    const parsed: AddressItem[] = JSON.parse(rawList);
                    if (parsed.length > 0) {
                        setDestinationList(parsed);
                    }
                }
                if (rawSaved !== null) {
                    setSavedIds(JSON.parse(rawSaved));
                }
            } catch (error) {
                console.log('저장소 불러오기 오류:', error);
            }
        };
        loadStorage();
    }, []);

    // 즐겨찾기 토글 + 영구 저장
    const handleToggleSave = (item: AddressItem) => {
        if (!isLoggedIn) {
            triggerToast('로그인이 필요한 기능입니다.');
            return;
        }
        const isAlreadySaved = savedIds.includes(item.id);
        const nextSaved = isAlreadySaved
            ? savedIds.filter((id) => id !== item.id)
            : [...savedIds, item.id];

        setSavedIds(nextSaved);
        syncStorage(destinationList, nextSaved);
        triggerToast(isAlreadySaved ? '보관함에서 삭제되었습니다.' : '보관함에 저장되었습니다.');
    };

    // 목적지/경유지 개별 삭제
    const handleDeleteDestination = (id: string) => {
        const target = destinationList.find((item) => item.id === id);
        const nextList = destinationList.filter((item) => item.id !== id);
        const nextSaved = savedIds.filter((savedId) => savedId !== id);

        setDestinationList(nextList);
        setSavedIds(nextSaved);
        setSelectedIndex(nextList.length > 0 ? 0 : null);
        syncStorage(nextList, nextSaved);
        triggerToast(`'${target?.title || '목적지'}' 삭제 완료`);
    };

    // 전체 비우기 (퇴근/새 동선 초기화)
    const handleClearAllDestinations = () => {
        if (destinationList.length === 0) return;
        setDestinationList([]);
        setSelectedIndex(null);
        syncStorage([], savedIds);
        triggerToast('목적지 리스트를 모두 비웠습니다.');
    };

    // 샘플 데이터 복원
    const handleResetMockData = () => {
        setDestinationList(MOCK_RESULTS);
        setSavedIds(['3']);
        setSelectedIndex(0);
        syncStorage(MOCK_RESULTS, ['3']);
        triggerToast('샘플 목적지 3건이 복원되었습니다.');
    };

    // 수동 정렬 모드일 때 ▲/▼ 순서 이동
    const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= destinationList.length) return;

        const nextList = [...destinationList];
        const [moved] = nextList.splice(index, 1);
        nextList.splice(targetIndex, 0, moved);

        setDestinationList(nextList);
        setSelectedIndex(targetIndex);
        syncStorage(nextList, savedIds);
    };

    // 보관함에서 오늘 동선에 담기
    const handleAddFromSaved = (item: AddressItem) => {
        const cloned: AddressItem = {
            ...item,
            id: `today_${Date.now()}`,
            isCompleted: false,
        };
        const nextList = [cloned, ...destinationList];
        setDestinationList(nextList);
        setActiveTab('all');
        setSelectedIndex(0);
        syncStorage(nextList, savedIds);
        triggerToast(`'${item.title}' 오늘 동선에 추가됨`);
    };

    // 현장 메모 수정/추가 저장 + 영구 저장
    const handleUpdateMemo = (id: string, newMemo: string) => {
        const nextList = destinationList.map((item) =>
            item.id === id ? { ...item, memo: newMemo || undefined } : item
        );
        setDestinationList(nextList);
        syncStorage(nextList, savedIds);
        triggerToast(newMemo ? '현장 메모가 저장되었습니다.' : '메모가 삭제되었습니다.');
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

    // 1단계: 부류별 추천에서 [+ 경유지] 담기 + 영구 저장
    const handleAddWaypoint = (fac: NearbyFacility, parentIndex: number) => {
        const newWaypoint: AddressItem = {
            id: `wp_${Date.now()}`,
            title: fac.name,
            roadAddress: fac.roadAddress,
            lat: fac.lat,
            lon: fac.lon,
            distance: fac.distanceText.split(' ')[0],
            distanceKm: 0.1,
            isWayPoint: true,
            isCompleted: false,
        };

        const nextList = [...destinationList];
        nextList.splice(parentIndex, 0, newWaypoint);

        setDestinationList(nextList);
        syncStorage(nextList, savedIds);
        triggerToast(`'${fac.name}' 경유지로 추가됨`);
    };

    // 1단계 -> 2단계 주행 시작
    const handleStartDriving = () => {
        const remaining = destinationList.filter((item) => !item.isCompleted);
        if (remaining.length === 0) {
            triggerToast('안내할 목적지가 없습니다.');
            return;
        }
        setActiveTab('all');
        setIsDrivingMode(true);
        setSelectedIndex(0);
    };

    // 2단계: 도착 완료 클릭 시 하단 이동 + 모두 완료 시 처음 화면으로 자동 복귀
    const handleCompleteDestination = (id: string) => {
        const updated = destinationList.map((item) =>
            item.id === id ? { ...item, isCompleted: true } : item
        );
        const nextList = [
            ...updated.filter((item) => !item.isCompleted),
            ...updated.filter((item) => item.isCompleted),
        ];

        const remaining = nextList.filter((item) => !item.isCompleted).length;

        setDestinationList(nextList);
        syncStorage(nextList, savedIds);

        if (remaining === 0) {
            setIsDrivingMode(false);
            setSelectedIndex(null);
            triggerToast('🏁 모든 목적지 방문을 완료했습니다!');
        } else {
            setSelectedIndex(0);
            triggerToast('🎉 도착 완료! 다음 목적지를 안내합니다.');
        }
    };

    // 주소 추출 핸들러 + 영구 저장
    const handleExtractAddress = async () => {
        if (!text.trim()) {
            triggerToast('텍스트를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            const filterResult = await addressFilter(text);
            if (filterResult) {
                const newItem: AddressItem = { ...filterResult, isCompleted: false };
                const nextList = [newItem, ...destinationList];

                setDestinationList(nextList);
                setSelectedIndex(0);
                setText('');
                syncStorage(nextList, savedIds);
                triggerToast(`[추출 결과] ::: ${filterResult.title}`);
            } else {
                triggerToast('목적지를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredResults = destinationList
        .filter((item) => {
            if (!isDrivingMode && activeTab === 'saved') return savedIds.includes(item.id);
            return true;
        })
        .sort((a, b) => {
            if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
            return isAutoSort ? (a.distanceKm || 0) - (b.distanceKm || 0) : 0;
        });

    const completedCount = destinationList.filter((i) => i.isCompleted).length;
    const remainingCount = destinationList.length - completedCount;

    // 👇 마지막에 모든 상태와 함수를 객체로 묶어서 내보냄!
    return {
        text,
        setText,
        isFocused,
        setIsFocused,
        selectedIndex,
        setSelectedIndex,
        savedIds,
        activeTab,
        setActiveTab,
        isAutoSort,
        setIsAutoSort,
        isDrivingMode,
        setIsDrivingMode,
        destinationList,
        filteredResults,
        completedCount,
        remainingCount,
        isLoading,
        isLoggedIn,
        userName,
        toastMsg,
        fadeAnim,
        triggerToast,
        handleToggleSave,
        handleDeleteDestination,
        handleClearAllDestinations,
        handleResetMockData,
        handleMoveOrder,
        handleAddFromSaved,
        handleUpdateMemo,
        handleQuickPaste,
        handleLoginToggle,
        handleAddWaypoint,
        handleStartDriving,
        handleCompleteDestination,
        handleExtractAddress,
    };
}
