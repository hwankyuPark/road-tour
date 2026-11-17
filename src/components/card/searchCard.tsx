import React, { JSX, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { styles } from '../../css/card';
import { openNaverNavi, openTmapNavi, openKakaoNavi } from '../../module/navigation';

export interface NearbyFacility {
    id: string;
    name: string;
    badge: string;
    distanceText: string;
    isOnWay: boolean;
    roadAddress: string;
    lat: string;
    lon: string;
}

export interface AddressItem {
    id: string;
    title: string;
    roadAddress: string;
    placeName?: string;
    lat?: string;
    lon?: string;
    distance?: string;
    distanceKm?: number;
    memo?: string;
    isOpen?: boolean;
    businessHours?: string;
    closedDays?: string;
    isWayPoint?: boolean;
    isCompleted?: boolean;
    nearbyList?: NearbyFacility[];
}

export interface SearchCardProps {
    item: AddressItem;
    orderNumber: number;
    isSelected: boolean;
    isSaved: boolean;
    isDrivingMode: boolean;
    onSelect: () => void;
    onToggleSave: (item: AddressItem) => void;
    onDelete?: (id: string) => void;
    onUpdateMemo?: (id: string, newMemo: string) => void;
    onAddWaypoint?: (facility: NearbyFacility, parentIndex: number) => void;
    onComplete?: (id: string) => void;
}

export function SearchCard(props: SearchCardProps): JSX.Element {
    const {
        item,
        orderNumber,
        isSelected,
        isSaved,
        isDrivingMode,
        onSelect,
        onToggleSave,
        onDelete,
        onUpdateMemo,
        onAddWaypoint,
        onComplete,
    } = props;

    // 1단계 아코디언 패널 상태 ('none' | 'business' | 'nearby')
    const [activePanel, setActivePanel] = useState<'none' | 'business' | 'nearby'>('nearby');
    const [isEditingMemo, setIsEditingMemo] = useState(false);
    const [memoDraft, setMemoDraft] = useState(item.memo || '');

    const isWithinRadius = item.distanceKm === undefined || item.distanceKm <= 0.15;
    const lockedLabel = `🔒 반경 150m 진입 시 완료 활성 (${item.distance || '이동중'})`;

    const handleStartEditMemo = () => {
        if (isDrivingMode) return;
        setMemoDraft(item.memo || '');
        setIsEditingMemo(true);
    };

    const handleSaveMemo = () => {
        onUpdateMemo?.(item.id, memoDraft.trim());
        setIsEditingMemo(false);
    };

    const handleCancelMemo = () => {
        setMemoDraft(item.memo || '');
        setIsEditingMemo(false);
    };

    const togglePanel = (target: 'business' | 'nearby') => {
        setActivePanel((prev) => (prev === target ? 'none' : target));
    };

    return (
        <View
            style={[
                styles.accentCard,
                isSelected && styles.accentCardSelected,
                item.isCompleted && extraStyles.cardCompleted,
            ]}
        >
            <View
                style={[
                    styles.cardColorBar,
                    isSelected && styles.cardColorBarActive,
                    item.isCompleted && extraStyles.colorBarDone,
                ]}
            />

            <View style={styles.cardInner}>
                {/* 상단 카드 헤더 */}
                <TouchableOpacity
                    onPress={onSelect}
                    activeOpacity={isDrivingMode ? 1 : 0.7}
                    style={styles.cardHeaderArea}
                >
                    <View style={styles.titleRow}>
                        <View style={extraStyles.titleLeftGroup}>
                            <View style={[extraStyles.orderBadge, item.isCompleted && extraStyles.orderBadgeDone]}>
                                <Text style={extraStyles.orderBadgeText}>
                                    {item.isCompleted ? '✓' : orderNumber}
                                </Text>
                            </View>

                            {item.isWayPoint && (
                                <View style={extraStyles.wayPointBadge}>
                                    <Text style={extraStyles.wayPointText}>경유</Text>
                                </View>
                            )}

                            <Text
                                style={[
                                    styles.placeTitle,
                                    { marginRight: 0 },
                                    item.isCompleted && extraStyles.titleDone,
                                ]}
                                numberOfLines={1}
                            >
                                {item.title}
                            </Text>
                        </View>

                        <View style={styles.rightGroup}>
                            {item.distance && <Text style={styles.distanceBadge}>{item.distance}</Text>}
                            {!isDrivingMode && (
                                <>
                                    <TouchableOpacity
                                        onPress={() => onToggleSave(item)}
                                        activeOpacity={0.6}
                                        hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
                                    >
                                        <Text style={[styles.starIcon, isSaved && styles.starIconActive]}>
                                            {isSaved ? '★' : '☆'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => onDelete?.(item.id)}
                                        activeOpacity={0.6}
                                        style={extraStyles.deleteIconBtn}
                                        hitSlop={{ top: 10, bottom: 10, left: 6, right: 10 }}
                                    >
                                        <Text style={extraStyles.deleteIconText}>✕</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>

                    <View style={extraStyles.subInfoWrap}>
                        <Text style={styles.roadAddress} numberOfLines={1}>
                            {item.roadAddress}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* 📝 현장 메모 영역 (1단계에서는 직접 수정/추가 가능, 2단계에서는 읽기 전용) */}
                <View style={extraStyles.memoSection}>
                    {isEditingMemo && !isDrivingMode ? (
                        <View style={extraStyles.memoEditBox}>
                            <TextInput
                                style={extraStyles.memoInput}
                                value={memoDraft}
                                onChangeText={setMemoDraft}
                                placeholder="공동현관 비번, 층수, 주차 팁 입력"
                                placeholderTextColor="#94A3B8"
                                autoFocus
                                returnKeyType="done"
                                onSubmitEditing={handleSaveMemo}
                            />
                            <TouchableOpacity style={extraStyles.memoSaveBtn} onPress={handleSaveMemo}>
                                <Text style={extraStyles.memoSaveText}>저장</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={extraStyles.memoCancelBtn} onPress={handleCancelMemo}>
                                <Text style={extraStyles.memoCancelText}>취소</Text>
                            </TouchableOpacity>
                        </View>
                    ) : item.memo ? (
                        <TouchableOpacity
                            style={extraStyles.memoBadge}
                            activeOpacity={isDrivingMode ? 1 : 0.7}
                            onPress={handleStartEditMemo}
                        >
                            <Text style={extraStyles.memoText}>
                                🔑 {item.memo} {!isDrivingMode && <Text style={extraStyles.memoEditHint}>✎</Text>}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        !isDrivingMode && (
                            <TouchableOpacity
                                style={extraStyles.addMemoBtn}
                                activeOpacity={0.7}
                                onPress={handleStartEditMemo}
                            >
                                <Text style={extraStyles.addMemoText}>+ 현장 메모 추가 (비번·호수 등)</Text>
                            </TouchableOpacity>
                        )
                    )}
                </View>

                {/* [1단계: 동선 세팅 모드] 유틸리티 칩 + 인라인 아코디언 패널 */}
                {isSelected && !isDrivingMode && (
                    <View style={extraStyles.setupSection}>
                        <View style={extraStyles.chipRow}>
                            <TouchableOpacity style={extraStyles.chipBtn}>
                                <Text style={extraStyles.chipText}>📞 전화</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    extraStyles.chipBtn,
                                    activePanel === 'business' && extraStyles.chipBtnActive,
                                ]}
                                onPress={() => togglePanel('business')}
                            >
                                <Text
                                    style={[
                                        extraStyles.chipText,
                                        activePanel === 'business' && extraStyles.chipTextActive,
                                    ]}
                                >
                                    ℹ️ 영업정보 {activePanel === 'business' ? '▴' : '▾'}
                                </Text>
                            </TouchableOpacity>

                            {item.nearbyList && item.nearbyList.length > 0 && (
                                <TouchableOpacity
                                    style={[
                                        extraStyles.chipBtn,
                                        activePanel === 'nearby' && extraStyles.chipBtnActive,
                                    ]}
                                    onPress={() => togglePanel('nearby')}
                                >
                                    <Text
                                        style={[
                                            extraStyles.chipText,
                                            activePanel === 'nearby' && extraStyles.chipTextActive,
                                        ]}
                                    >
                                        🅿️ 주변 추천 {item.nearbyList.length}{' '}
                                        {activePanel === 'nearby' ? '▴' : '▾'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* ℹ️ 영업정보 인라인 펼침 패널 */}
                        {activePanel === 'business' && (
                            <View style={extraStyles.infoBox}>
                                <View style={extraStyles.businessStatusRow}>
                                    <Text
                                        style={[
                                            extraStyles.businessStatusText,
                                            item.isOpen === false
                                                ? extraStyles.statusClosed
                                                : extraStyles.statusOpen,
                                        ]}
                                    >
                                        {item.isOpen === false
                                            ? '🔴 영업 종료 / 브레이크타임'
                                            : '🟢 현재 영업 중'}
                                    </Text>
                                </View>
                                <Text style={extraStyles.businessDetailText}>
                                    🕒 {item.businessHours || '매일 10:00 - 22:00 (매장 상황에 따라 변동)'}
                                </Text>
                                <Text style={extraStyles.businessSubText}>
                                    📅 {item.closedDays || '연중무휴 (공휴일 정상영업)'}
                                </Text>
                            </View>
                        )}

                        {/* 🅿️ 주변 추천 인라인 펼침 패널 */}
                        {activePanel === 'nearby' && item.nearbyList && item.nearbyList.length > 0 && (
                            <View style={extraStyles.infoBox}>
                                {item.nearbyList.map((fac) => (
                                    <View key={fac.id} style={extraStyles.nearbyRow}>
                                        <View style={{ flex: 1, marginRight: 8 }}>
                                            <View style={extraStyles.facTitleRow}>
                                                <View style={extraStyles.facTypeBadge}>
                                                    <Text style={extraStyles.facTypeText}>{fac.badge}</Text>
                                                </View>
                                                <Text style={extraStyles.facName} numberOfLines={1}>
                                                    {fac.name}
                                                </Text>
                                            </View>
                                            <Text style={extraStyles.facMeta}>
                                                {fac.distanceText} ·{' '}
                                                <Text style={{ color: '#059669', fontWeight: '700' }}>
                                                    {fac.isOnWay ? '🟢 가는 길' : '🟡 목적지 인근'}
                                                </Text>
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            style={extraStyles.addWaypointBtn}
                                            activeOpacity={0.8}
                                            onPress={() => onAddWaypoint?.(fac, orderNumber - 1)}
                                        >
                                            <Text style={extraStyles.addWaypointText}>+ 경유지</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* [2단계: 주행 모드] 현재 1순위 카드에서만 도착 완료 & 3사 내비 버튼 노출 */}
                {isSelected && isDrivingMode && !item.isCompleted && (
                    <View style={extraStyles.drivingSection}>
                        <TouchableOpacity
                            style={[
                                extraStyles.completeBtn,
                                isWithinRadius ? extraStyles.completeBtnReady : extraStyles.completeBtnLocked,
                            ]}
                            activeOpacity={0.85}
                            onPress={() => onComplete?.(item.id)}
                        >
                            <Text
                                style={[
                                    extraStyles.completeBtnText,
                                    isWithinRadius
                                        ? extraStyles.completeBtnTextReady
                                        : extraStyles.completeBtnTextLocked,
                                ]}
                            >
                                {isWithinRadius ? '✅ 도착 완료 (다음 목적지로)' : lockedLabel}
                            </Text>
                        </TouchableOpacity>

                        <View style={[styles.naviButtonGroup, { marginTop: 0, paddingTop: 0, borderTopWidth: 0 }]}>
                            <TouchableOpacity
                                style={[styles.naviBtn, styles.kakaoBg]}
                                activeOpacity={0.85}
                                onPress={() => openKakaoNavi({ title: item.title, lat: item.lat, lon: item.lon })}
                            >
                                <Text style={styles.kakaoText}>카카오내비</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.naviBtn, styles.tmapBg]}
                                activeOpacity={0.85}
                                onPress={() => openTmapNavi({ title: item.title, lat: item.lat, lon: item.lon })}
                            >
                                <Text style={styles.tmapText}>T map</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.naviBtn, styles.naverBg]}
                                activeOpacity={0.85}
                                onPress={() => openNaverNavi({ title: item.title, lat: item.lat, lon: item.lon })}
                            >
                                <Text style={styles.naverText}>네이버지도</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

const extraStyles = StyleSheet.create({
    cardCompleted: { opacity: 0.5 },
    colorBarDone: { backgroundColor: '#10B981' },
    titleLeftGroup: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 6, marginRight: 8 },
    orderBadge: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderBadgeDone: { backgroundColor: '#10B981' },
    orderBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
    wayPointBadge: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#2563EB',
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 4,
    },
    wayPointText: { fontSize: 10, fontWeight: '800', color: '#2563EB' },
    titleDone: { textDecorationLine: 'line-through', color: '#64748B' },
    deleteIconBtn: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteIconText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#94A3B8',
    },
    subInfoWrap: { paddingLeft: 28 },

    // 메모 편집/추가 스타일
    memoSection: {
        paddingLeft: 28,
        marginTop: 6,
    },
    memoBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#FEF3C7',
        borderWidth: 1,
        borderColor: '#FDE68A',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    memoText: { fontSize: 11, fontWeight: '700', color: '#B45309' },
    memoEditHint: { fontSize: 11, color: '#D97706' },
    addMemoBtn: {
        alignSelf: 'flex-start',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#CBD5E1',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    addMemoText: { fontSize: 11, fontWeight: '600', color: '#64748B' },
    memoEditBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    },
    memoInput: {
        flex: 1,
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#F59E0B',
        borderRadius: 7,
        paddingHorizontal: 8,
        paddingVertical: 5,
        fontSize: 12,
        color: '#0F172A',
    },
    memoSaveBtn: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 7,
    },
    memoSaveText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
    memoCancelBtn: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 7,
    },
    memoCancelText: { fontSize: 11, fontWeight: '700', color: '#64748B' },

    // 1단계 세팅 스타일
    setupSection: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        gap: 10,
    },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    chipBtn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    chipBtnActive: { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' },
    chipText: { fontSize: 12, fontWeight: '700', color: '#475569' },
    chipTextActive: { color: '#2563EB' },
    infoBox: {
        backgroundColor: '#F8FAFC',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 6,
    },
    businessStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    businessStatusText: {
        fontSize: 12,
        fontWeight: '800',
    },
    statusOpen: { color: '#059669' },
    statusClosed: { color: '#DC2626' },
    businessDetailText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#334155',
    },
    businessSubText: {
        fontSize: 11,
        color: '#64748B',
    },
    nearbyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    facTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    facTypeBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
    facTypeText: { fontSize: 10, fontWeight: '800', color: '#1D4ED8' },
    facName: { fontSize: 12, fontWeight: '700', color: '#1E293B', flex: 1 },
    facMeta: { fontSize: 11, color: '#64748B', marginTop: 2 },
    addWaypointBtn: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#2563EB',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 7,
    },
    addWaypointText: { fontSize: 11, fontWeight: '800', color: '#2563EB' },

    // 2단계 주행 스타일
    drivingSection: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        gap: 10,
    },
    completeBtn: { paddingVertical: 11, borderRadius: 10, alignItems: 'center', borderWidth: 1.5 },
    completeBtnReady: { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
    completeBtnLocked: { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' },
    completeBtnText: { fontSize: 13, fontWeight: '800' },
    completeBtnTextReady: { color: '#047857' },
    completeBtnTextLocked: { color: '#64748B' },
});