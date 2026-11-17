import * as React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {
    TextInput,
    HelperText,
    Provider as PaperProvider,
    Card,
} from 'react-native-paper';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";


export function TestInputScreen() {
    // --- 입력 값 상태 관리 ---
    const [flatText, setFlatText] = React.useState('');
    const [outlinedText, setOutlinedText] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false); // 비밀번호 보이기/숨기기 토글
    const [email, setEmail] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [multilineText, setMultilineText] = React.useState('');

    // 이메일 유효성 검사 (에러 표시 테스트용)
    const hasEmailError = () => {
        return email.length > 0 && !email.includes('@');
    };

    return (
        <PaperProvider>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
            >
                <SafeAreaView>
                    <View style={styles.wrapper}>

                        {/* 📌 1. 기본 모드 2가지 (Flat vs Outlined) */}
                        <Card style={styles.card}>
                            <Card.Title title="1. 기본 스타일 모드 (Mode)"/>
                            <Card.Content style={styles.cardContent}>
                                <TextInput
                                    mode="flat"
                                    label="Flat 모드 (밑줄 형태)"
                                    placeholder="기본 밑줄 스타일"
                                    value={flatText}
                                    onChangeText={setFlatText}
                                />
                                <TextInput
                                    mode="outlined"
                                    label="Outlined 모드 (테두리 형태)"
                                    placeholder="테두리 스타일"
                                    value={outlinedText}
                                    onChangeText={setOutlinedText}
                                />
                            </Card.Content>
                        </Card>

                        {/* 📌 2. 비밀번호 입력 (눈 모양 토글 버튼) */}
                        <Card style={styles.card}>
                            <Card.Title title="2. 비밀번호 입력 (눈 모양 토글)"/>
                            <Card.Content style={styles.cardContent}>
                                <TextInput
                                    mode="outlined"
                                    label="비밀번호"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                    right={
                                        <TextInput.Icon
                                            icon={showPassword ? 'eye-off' : 'eye'}
                                            onPress={() => setShowPassword(!showPassword)}
                                        />
                                    }
                                />
                            </Card.Content>
                        </Card>

                        {/* 📌 3. 에러 표시 & 안내 메시지 (HelperText) */}
                        <Card style={styles.card}>
                            <Card.Title title="3. 유효성 검사 & 에러 메시지"/>
                            <Card.Content style={styles.cardContent}>
                                <TextInput
                                    mode="outlined"
                                    label="이메일 입력"
                                    value={email}
                                    onChangeText={setEmail}
                                    error={hasEmailError()} // true일 때 테두리가 빨간색으로 변경됨
                                    right={<TextInput.Icon icon="email"/>}
                                />
                                <HelperText type="error" visible={hasEmailError()}>
                                    올바른 이메일 형식이 아닙니다. (@ 포함 필수)
                                </HelperText>
                            </Card.Content>
                        </Card>

                        {/* 📌 4. 접두사 / 접미사 (Affix) */}
                        <Card style={styles.card}>
                            <Card.Title title="4. 단위 / 기호 붙이기 (Affix)"/>
                            <Card.Content style={styles.cardContent}>
                                <TextInput
                                    mode="outlined"
                                    label="가격"
                                    value={price}
                                    onChangeText={setPrice}
                                    keyboardType="numeric"
                                    left={<TextInput.Affix text="₩"/>}
                                    right={<TextInput.Affix text="원"/>}
                                />
                            </Card.Content>
                        </Card>

                        {/* 📌 5. 여러 줄 입력 (TextArea / Multiline) */}
                        <Card style={styles.card}>
                            <Card.Title title="5. 여러 줄 입력 (TextArea)"/>
                            <Card.Content style={styles.cardContent}>
                                <TextInput
                                    mode="outlined"
                                    label="상세 주소 / 메모"
                                    multiline
                                    numberOfLines={4} // 기본 표시 줄 수
                                    value={multilineText}
                                    onChangeText={setMultilineText}
                                    placeholder="여러 줄을 자유롭게 입력해 보세요."
                                />
                            </Card.Content>
                        </Card>

                        {/* 📌 6. 비활성화 (Disabled) */}
                        <Card style={styles.card}>
                            <Card.Title title="6. 비활성화 (Disabled)"/>
                            <Card.Content style={styles.cardContent}>
                                <TextInput
                                    mode="outlined"
                                    label="수정 불가 항목"
                                    value="수정할 수 없는 값입니다"
                                    disabled
                                />
                            </Card.Content>
                        </Card>

                    </View>
                </SafeAreaView>
            </ScrollView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    wrapper: {
        width: '100%',
        maxWidth: 600, // 모니터나 웹에서도 가로가 너무 늘어나지 않게 제어
        alignSelf: 'center',
        gap: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        elevation: 1,
    },
    cardContent: {
        gap: 8,
    },
});