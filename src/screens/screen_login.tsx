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

import {styles} from "../css/login";

interface LoginScreenProps {
    onLoginSuccess?: (userName?: string) => void;
    onNavigateToRegister?: () => void;
}

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

export function LoginScreen({ onLoginSuccess, onNavigateToRegister }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [focusedInput, setFocusedInput] = useState<'email' | 'password' | null>(null);

    const handleLogin = () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('알림', '이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        const displayName = email.includes('@') ? email.split('@')[0] : email.trim();
        onLoginSuccess?.(displayName || '홍길동');
    };

    const handleGuestStart = () => {
        onLoginSuccess?.('게스트');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#F3F5F7" />

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
                                    placeholderTextColor="#94A3B8"
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
                                    placeholderTextColor="#94A3B8"
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}
                                    secureTextEntry
                                    returnKeyType="done"
                                    onSubmitEditing={handleLogin}
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

                        {/* 소셜 간편 로그인 & 바로 시작 */}
                        <View style={styles.socialSection}>
                            <View style={styles.socialDividerRow}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.socialDividerText}>간편 로그인</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <View style={styles.socialIconRow}>
                                <TouchableOpacity
                                    style={[styles.socialCircleBtn, styles.kakaoCircle]}
                                    activeOpacity={0.85}
                                    onPress={() => onLoginSuccess?.('카카오 회원')}
                                >
                                    <View style={styles.kakaoBubbleWrapper}>
                                        <View style={styles.kakaoBubbleBody} />
                                        <View style={styles.kakaoBubbleTail} />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.socialCircleBtn, styles.naverCircle]}
                                    activeOpacity={0.85}
                                    onPress={() => onLoginSuccess?.('네이버 회원')}
                                >
                                    <Text style={styles.naverModernLogo}>N</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.guestStartBtn}
                                onPress={handleGuestStart}
                                activeOpacity={0.75}
                            >
                                <Text style={styles.guestStartText}>로그인 없이 바로 시작하기 →</Text>
                            </TouchableOpacity>
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
