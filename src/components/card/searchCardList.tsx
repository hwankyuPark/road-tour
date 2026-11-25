import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "@/css/home";
import { SearchCard } from "@/components/card/searchCard";
import { useHome } from "@/hooks/useHomeRoute";

export function CardList()
{
    const {
        filteredResults,
        activeTab,
        selectedIndex,
        setSelectedIndex,
        savedIds,
        isDrivingMode,
        isAutoSort,
        triggerToast,
        handleResetMockData,
        handleToggleSave,
        handleDeleteDestination,
        handleUpdateMemo,
        handleMoveOrder,
        handleAddFromSaved,
        handleAddWaypoint,
        handleCompleteDestination,
    } = useHome();

    return (
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
    );
}