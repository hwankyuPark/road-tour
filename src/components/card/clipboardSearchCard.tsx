import {styles} from "../../css/home";
import {SearchCard} from "./searchCard";
import React from "react";

import {styles} from "../css/home";

export function Clipboard() {

    return(
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.contentWrapper}>
                {!isDrivingMode && (
                    <>
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
                                        <Text style={styles.pasteBtnText}>📋 클립보드 자동감지 ON</Text>
                                    </TouchableOpacity>

                                    {text.length > 0 && (
                                        <TouchableOpacity style={styles.clearBtn} onPress={() => setText('')} activeOpacity={0.7}>
                                            <Text style={styles.clearBtnText}>지우기</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleExtractAddress}
                                style={styles.extractBtn}
                                activeOpacity={0.88}
                                disabled={isLoading}
                            >
                                <Text style={styles.extractBtnText}>
                                    {isLoading ? '주소 추출 중...' : '주소 추출하기'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.sortCard}>
                            <View>
                                <Text style={styles.sortTitle}>📍 내 위치 기준 실시간 거리 정렬</Text>
                                <Text style={styles.sortSub}>
                                    {isAutoSort ? '가까운 순서로 자동 정렬 중' : '수동 순서 모드 (카드 우측 ▲▼ 이동)'}
                                </Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                                thumbColor={isAutoSort ? '#2563EB' : '#F8FAFC'}
                                value={isAutoSort}
                                onValueChange={setIsAutoSort}
                            />
                        </View>

                        <View style={styles.tabHeaderRow}>
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

                            {activeTab === 'all' && destinationList.length > 0 && (
                                <TouchableOpacity
                                    onPress={handleClearAllDestinations}
                                    style={styles.clearAllBtn}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.clearAllText}>전체 비우기</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </>
                )}

                {/* 결과 카드 리스트 */}
                <View style={styles.resultList}>
                    {filteredResults.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>
                                {activeTab === 'saved' ? '보관함에 저장된 장소가 없습니다.' : '저장된 목적지가 없습니다.'}
                            </Text>
                            {activeTab === 'all' && (
                                <TouchableOpacity
                                    onPress={handleResetMockData}
                                    activeOpacity={0.8}
                                    style={styles.resetMockBtn}
                                >
                                    <Text style={styles.resetMockBtnText}>🔄 샘플 데이터 다시 불러오기</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        filteredResults.map((item, index) => {
                            const isSelected = selectedIndex === index;
                            const isSaved = savedIds.includes(item.id);

                            return (
                                <SearchCard
                                    key={item.id}
                                    item={item}
                                    orderNumber={index + 1}
                                    totalCount={filteredResults.length}
                                    isSelected={isSelected}
                                    isSaved={isSaved}
                                    isDrivingMode={isDrivingMode}
                                    isAutoSort={isAutoSort}
                                    isSavedTab={activeTab === 'saved'}
                                    onSelect={() => {
                                        if (isDrivingMode) {
                                            if (!item.isCompleted && selectedIndex !== index) {
                                                setSelectedIndex(index);
                                                triggerToast(`'${item.title}'(으)로 목적지 변경`);
                                            }
                                        } else {
                                            setSelectedIndex(isSelected ? null : index);
                                        }
                                    }}
                                    onToggleSave={handleToggleSave}
                                    onDelete={handleDeleteDestination}
                                    onUpdateMemo={handleUpdateMemo}
                                    onMoveOrder={handleMoveOrder}
                                    onAddFromSaved={handleAddFromSaved}
                                    onAddWaypoint={handleAddWaypoint}
                                    onComplete={handleCompleteDestination}
                                />
                            );
                        })
                    )}
                </View>

                {/* 하단 고정 바 여백 확보 */}
                <View style={{ height: 96 }} />
            </View>
        </ScrollView>
    );
}