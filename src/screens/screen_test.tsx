import * as React from 'react';
import { StyleSheet, View, ScrollView, FlatList } from 'react-native';
import {
    List,
    Card,
    DataTable,
    Checkbox,
    Switch,
    Badge,
    Text,
    Provider as PaperProvider,
    Divider,
    Avatar,
} from 'react-native-paper';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";


export function TestScreen() {
    // --- 1. List.Item 스위치 상태 ---
    const [isNotificationOn, setIsNotificationOn] = React.useState(true);

    // --- 2. List.Accordion (아코디언) 펼침 상태 ---
    const [accordionExpanded, setAccordionExpanded] = React.useState(true);

    // --- 3. FlatList 테스트용 동적 데이터 ---
    const [flatListData] = React.useState([
        { id: '1', title: '서울시 강남구 테헤란로 123', tag: '기본 주소', date: '2026-08-10' },
        { id: '2', title: '경기도 성남시 분당구 판교역로 45', tag: '회사', date: '2026-08-12' },
        { id: '3', title: '대전광역시 서구 둔산로 78', tag: '자택', date: '2026-08-14' },
    ]);

    // --- 4. DataTable 상태 ---
    const [page, setPage] = React.useState<number>(0);
    const itemsPerPage = 2;
    const [selectedKeys, setSelectedKeys] = React.useState<number[]>([]);

    const tableItems = [
        { key: 1, name: 'Cupcake', calories: 356, fat: 16 },
        { key: 2, name: 'Eclair', calories: 262, fat: 16 },
        { key: 3, name: 'Frozen yogurt', calories: 159, fat: 6 },
    ];

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, tableItems.length);

    return (
        <PaperProvider>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}>
                <SafeAreaView>
                <View style={styles.wrapper}>

                    {/* 📌 1. List.Item & Section (설정/마이페이지/주소록 기본 리스트) */}
                    <Card style={styles.card}>
                        <Card.Title title="1. 기본 리스트 (List.Item & Section)" subtitle="설정, 메뉴, 아이콘 조합에 최적화" />
                        <Card.Content style={styles.noPadding}>
                            <List.Section>
                                <List.Subheader>계정 및 설정</List.Subheader>

                                {/* 아이콘 + 제목 + 설명 + 화살표 */}
                                <List.Item
                                    title="내 프로필 관리"
                                    description="이름, 이메일, 전화번호 변경"
                                    left={(props) => <List.Icon {...props} icon="account-cog" />}
                                    right={(props) => <List.Icon {...props} icon="chevron-right" />}
                                    onPress={() => alert('프로필 클릭')}
                                />
                                <Divider />

                                {/* 배지(Badge)가 달린 리스트 */}
                                <List.Item
                                    title="읽지 않은 알림"
                                    description="새로운 주소 등록 요청이 있습니다."
                                    left={(props) => <List.Icon {...props} icon="bell-ring" />}
                                    right={() => <Badge style={styles.badge}>3</Badge>}
                                />
                                <Divider />

                                {/* 스위치(Switch) 토글 리스트 */}
                                <List.Item
                                    title="푸시 알림 수신"
                                    left={(props) => <List.Icon {...props} icon="cellphone-message" />}
                                    right={() => (
                                        <Switch
                                            value={isNotificationOn}
                                            onValueChange={() => setIsNotificationOn(!isNotificationOn)}
                                        />
                                    )}
                                />
                            </List.Section>
                        </Card.Content>
                    </Card>

                    {/* 📌 2. List.Accordion (접이식/계층형 리스트) */}
                    <Card style={styles.card}>
                        <Card.Title title="2. 아코디언 리스트 (List.Accordion)" subtitle="카테고리, FAQ 등 펼치기/접기 리스트" />
                        <Card.Content style={styles.noPadding}>
                            <List.Accordion
                                title="자주 묻는 질문 (FAQ)"
                                left={(props) => <List.Icon {...props} icon="help-circle" />}
                                expanded={accordionExpanded}
                                onPress={() => setAccordionExpanded(!accordionExpanded)}
                            >
                                <List.Item
                                    title="Q. 주소록은 몇 개까지 등록할 수 있나요?"
                                    description="최대 100개까지 등록 및 관리 가능합니다."
                                />
                                <Divider />
                                <List.Item
                                    title="Q. 비밀번호를 잊어버렸어요."
                                    description="로그인 화면 하단 [비밀번호 찾기]를 이용해 주세요."
                                />
                            </List.Accordion>
                        </Card.Content>
                    </Card>

                    {/* 📌 3. FlatList + Card (모바일 대용량/카드형 동적 리스트) */}
                    <Card style={styles.card}>
                        <Card.Title title="3. 카드형 대용량 리스트 (FlatList)" subtitle="당근마켓, 쿠팡 스타일 (가장 많이 사용)" />
                        <Card.Content style={styles.cardContent}>
                            {/* ScrollView 내부에서 FlatList를 쓸 때는 scrollEnabled={false}로 설정합니다 */}
                            <FlatList
                                data={flatListData}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                                renderItem={({ item }) => (
                                    <View style={styles.listCardItem}>
                                        <View style={styles.rowBetween}>
                                            <Text variant="titleMedium" style={styles.boldText}>
                                                {item.title}
                                            </Text>
                                            <Badge style={styles.tagBadge}>{item.tag}</Badge>
                                        </View>
                                        <Text variant="bodySmall" style={styles.grayText}>
                                            등록일: {item.date}
                                        </Text>
                                    </View>
                                )}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                            />
                        </Card.Content>
                    </Card>

                    {/* 📌 4. DataTable (표 형태 데이터 리스트) */}
                    <Card style={styles.card}>
                        <Card.Title title="4. 표 형태 리스트 (DataTable)" subtitle="수치, 비교, 관리자용 데이터" />
                        <DataTable>
                            <DataTable.Header style={styles.tableHeader}>
                                <DataTable.Title style={styles.checkboxCell}>선택</DataTable.Title>
                                <DataTable.Title>Dessert</DataTable.Title>
                                <DataTable.Title numeric>Calories</DataTable.Title>
                            </DataTable.Header>

                            {tableItems.slice(from, to).map((item) => {
                                const isSelected = selectedKeys.includes(item.key);
                                return (
                                    <DataTable.Row
                                        key={item.key}
                                        onPress={() =>
                                            setSelectedKeys(
                                                isSelected
                                                    ? selectedKeys.filter((k) => k !== item.key)
                                                    : [...selectedKeys, item.key]
                                            )
                                        }
                                    >
                                        <DataTable.Cell style={styles.checkboxCell}>
                                            <Checkbox status={isSelected ? 'checked' : 'unchecked'} />
                                        </DataTable.Cell>
                                        <DataTable.Cell>{item.name}</DataTable.Cell>
                                        <DataTable.Cell numeric>{item.calories}</DataTable.Cell>
                                    </DataTable.Row>
                                );
                            })}

                            <DataTable.Pagination
                                page={page}
                                numberOfPages={Math.ceil(tableItems.length / itemsPerPage)}
                                onPageChange={(page) => setPage(page)}
                                label={`${from + 1}-${to} of ${tableItems.length}`}
                            />
                        </DataTable>
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
        maxWidth: 600,
        alignSelf: 'center',
        gap: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        elevation: 1,
        overflow: 'hidden',
    },
    cardContent: {
        paddingTop: 8,
    },
    noPadding: {
        paddingHorizontal: 0,
        paddingBottom: 0,
    },
    badge: {
        backgroundColor: '#007AFF',
        alignSelf: 'center',
        marginRight: 12,
    },
    // FlatList 전용 스타일
    listCardItem: {
        paddingVertical: 12,
        paddingHorizontal: 4,
        gap: 4,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    boldText: {
        fontWeight: 'bold',
        flex: 1,
    },
    grayText: {
        color: '#6c757d',
    },
    tagBadge: {
        backgroundColor: '#e9ecef',
        color: '#495057',
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: '#f1f3f5',
    },
    // DataTable 스타일
    tableHeader: {
        minHeight: 48,
        alignItems: 'center',
    },
    checkboxCell: {
        maxWidth: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
});