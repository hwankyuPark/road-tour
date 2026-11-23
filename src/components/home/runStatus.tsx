import {styles} from "../../css/home";
import React from "react";
import {Text, View, TouchableOpacity} from 'react-native';

interface RunStatusProps
{
    isDrivingMode: boolean;
    completedCount: number;
    destinationTotalCount: number;
    onBackToSetup : ()=>void;
}

export function RunStatus ({isDrivingMode, completedCount, destinationTotalCount, onBackToSetup}: RunStatusProps)
{
    if(false === isDrivingMode)
        return null;

    return (
        <View style={styles.drivingTopBar}>
            <View>
                <Text style={styles.drivingStatusText}>
                    🟢 주행 중 ({Math.min(completedCount + 1, destinationTotalCount)} / {destinationTotalCount}번째 목적지)
                </Text>
                <Text style={styles.drivingHintText}>노선 변경 시 다른 목적지 카드를 터치하세요</Text>
            </View>
            <TouchableOpacity
                style={styles.backToSetupBtn}
                onPress={onBackToSetup}
                activeOpacity={0.8}
            >
                <Text style={styles.backToSetupText}>동선 수정 ✎</Text>
            </TouchableOpacity>
        </View>
    );
}