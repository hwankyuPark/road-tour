import { Linking, Platform, Alert } from 'react-native';
import { NaviTarget } from './kakaoNavi';

export async function openTmapNavi({ title, lat, lon }: NaviTarget) {
    if (!lat || !lon) {
        Alert.alert('알림', '목적지 좌표 정보가 없습니다.');
        return;
    }

    // 티맵 URL 스킴: tmap://route?goalname=장소명&goalx=경도&goaly=위도
    const url = `tmap://route?goalname=${encodeURIComponent(title)}&goalx=${lon}&goaly=${lat}`;
    const storeUrl =
        Platform.OS === 'android'
            ? 'market://details?id=com.skt.tmap.ku'
            : 'https://apps.apple.com/app/id431589174';

    try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            await Linking.openURL(storeUrl);
        }
    } catch (error) {
        console.error('티맵 실행 오류:', error);
        Alert.alert('오류', 'T map을 실행할 수 없습니다.');
    }
}
