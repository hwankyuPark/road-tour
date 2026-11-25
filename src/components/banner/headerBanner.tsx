import {Switch, Text, TextInput, TouchableOpacity, View} from "react-native";
import {styles} from "@/css/home";
import {useHome} from "@/hooks/useHomeRoute";

export function Header(){

    const {
        isDrivingMode,
        isLoggedIn,
        userName,
        handleLoginToggle,
        isFocused,
        setIsFocused,
        text,
        setText,
        handleQuickPaste,
        handleExtractAddress,
        isLoading,
        isAutoSort,
        setIsAutoSort,
        activeTab,
        setActiveTab,
        destinationList,
        savedIds,
        handleClearAllDestinations,
    } = useHome();

    if(true === isDrivingMode)
        return null;

    return (
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
    );
}