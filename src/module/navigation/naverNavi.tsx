import { Linking, Platform, Alert } from 'react-native';
import { NaviTarget } from './kakaoNavi';

export async function openNaverNavi({ title, lat, lon }: NaviTarget) {
    if (!lat || !lon) {
        Alert.alert('알림', '목적지 좌표 정보가 없습니다.');
        return;
    }

    // 네이버지도 URL 스킴: nmap://navigation?dlat=위도&dlng=경도&dname=장소명&appname=roadtour
    const url = `nmap://navigation?dlat=${lat}&dlng=${lon}&dname=${encodeURIComponent(title)}&appname=roadtour`;
    const storeUrl =
        Platform.OS === 'android'
            ? 'market://details?id=com.nhn.android.nmap'
            : 'https://apps.apple.com/app/id311867728';

    try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            await Linking.openURL(storeUrl);
        }
    } catch (error) {
        console.error('네이버지도 실행 오류:', error);
        Alert.alert('오류', '네이버지도를 실행할 수 없습니다.');
    }
}