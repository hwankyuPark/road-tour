import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    Platform,
    StatusBar,
    KeyboardAvoidingView,
    ScrollView,
    Dimensions,
} from 'react-native';

interface LoginScreenProps {
    onLoginSuccess?: () => void;
    onNavigateToRegister?: () => void;
}

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

export function LoginScreen({ onLoginSuccess, onNavigateToRegister }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [focusedInput, setFocusedInput] = useState<'email' | 'password' | null>(null);

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('알림', '이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        Alert.alert('성공', `${email}님 환영합니다!`);
        if (onLoginSuccess) {
            onLoginSuccess();
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <View style={styles.screenWrapper}>

                    {/* 1. 화면 정중앙 고정 로그인 영역 */}
                    <View style={styles.centerFormContainer}>
                        {/* 상단 인라인 브랜드 헤더 */}
                        <View style={styles.headerArea}>
                            <View style={styles.brandInlineHeader}>
                                <View style={styles.logoTag}>
                                    <Text style={styles.logoTagText}>RT</Text>
                                </View>
                                <Text style={styles.appTitle}>로드투어</Text>
                            </View>
                            <Text style={styles.subtitle}>복사한 문자로 1초 만에 내비 연결</Text>
                        </View>

                        {/* 메인 로그인 폼 카드 */}
                        <View style={styles.cardForm}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>이메일 주소</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        focusedInput === 'email' && styles.inputFocused,
                                    ]}
                                    placeholder="example@roadtour.com"
                                    placeholderTextColor="#A1A1AA"
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => setFocusedInput('email')}
                                    onBlur={() => setFocusedInput(null)}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>비밀번호</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        focusedInput === 'password' && styles.inputFocused,
                                    ]}
                                    placeholder="비밀번호를 입력하세요"
                                    placeholderTextColor="#A1A1AA"
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}
                                    secureTextEntry
                                />
                            </View>

                            {/* 메인 로그인 버튼 */}
                            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} activeOpacity={0.88}>
                                <Text style={styles.primaryButtonText}>로그인</Text>
                            </TouchableOpacity>

                            {/* 서브 옵션 */}
                            <View style={styles.linkRow}>
                                <TouchableOpacity activeOpacity={0.6}>
                                    <Text style={styles.linkText}>비밀번호 찾기</Text>
                                </TouchableOpacity>
                                <Text style={styles.linkDivider}>·</Text>
                                <TouchableOpacity onPress={onNavigateToRegister} activeOpacity={0.6}>
                                    <Text style={styles.linkHighlightText}>회원가입</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* 소셜 간편 로그인 */}
                        <View style={styles.socialSection}>
                            <View style={styles.socialDividerRow}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.socialDividerText}>간편 로그인</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <View style={styles.socialIconRow}>
                                {/* 🔥 진짜 카카오 말풍선 심볼 디자인 */}
                                <TouchableOpacity style={[styles.socialCircleBtn, styles.kakaoCircle]} activeOpacity={0.85}>
                                    <View style={styles.kakaoBubbleWrapper}>
                                        <View style={styles.kakaoBubbleBody} />
                                        <View style={styles.kakaoBubbleTail} />
                                    </View>
                                </TouchableOpacity>

                                {/* 네이버 심볼 */}
                                <TouchableOpacity style={[styles.socialCircleBtn, styles.naverCircle]} activeOpacity={0.85}>
                                    <Text style={styles.naverModernLogo}>N</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* 2. 최하단 푸터 */}
                    <View style={styles.bottomAbsoluteFooter}>
                        <Text style={styles.footerBrandText}>THE PARK</Text>
                        <Text style={styles.footerCopyright}>© The Park Corp. All rights reserved.</Text>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
    },
    screenWrapper: {
        flex: 1,
        minHeight: WINDOW_HEIGHT - (Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 80,
        position: 'relative',
    },

    // 1. 화면 정중앙 폼 컨테이너
    centerFormContainer: {
        width: '100%',
        maxWidth: 380,
        alignItems: 'center',
        marginTop: -20,
    },

    // 헤더
    headerArea: {
        alignItems: 'center',
        marginBottom: 24,
    },
    brandInlineHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    logoTag: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    logoTagText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    appTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -0.8,
    },
    subtitle: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
        letterSpacing: -0.2,
    },

    // 폼 카드
    cardForm: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 3,
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 14,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#475569',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: 15,
        color: '#0F172A',
    },
    inputFocused: {
        borderColor: '#2563EB',
        backgroundColor: '#FFFFFF',
    },
    primaryButton: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 16,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 2,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
    },
    linkRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    linkText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    linkHighlightText: {
        fontSize: 12,
        color: '#2563EB',
        fontWeight: '700',
    },
    linkDivider: {
        fontSize: 12,
        color: '#CBD5E1',
    },

    // 소셜 로그인
    socialSection: {
        width: '100%',
        alignItems: 'center',
    },
    socialDividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#F1F5F9',
    },
    socialDividerText: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
        paddingHorizontal: 12,
    },
    socialIconRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    socialCircleBtn: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // 🔥 정밀하게 재현된 카카오톡 말풍선 아이콘
    kakaoCircle: {
        backgroundColor: '#FEE500',
    },
    kakaoBubbleWrapper: {
        width: 22,
        height: 20,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    kakaoBubbleBody: {
        width: 20,
        height: 16,
        backgroundColor: '#191919',
        borderRadius: 8,
    },
    kakaoBubbleTail: {
        position: 'absolute',
        bottom: 1,
        left: 1,
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderRightColor: 'transparent',
        borderTopColor: '#191919',
        transform: [{ rotate: '15deg' }],
    },

    naverCircle: {
        backgroundColor: '#03CF5D',
    },
    naverModernLogo: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '900',
        letterSpacing: -0.5,
    },

    // 2. 푸터
    bottomAbsoluteFooter: {
        position: 'absolute',
        bottom: 36,
        alignItems: 'center',
        width: '100%',
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