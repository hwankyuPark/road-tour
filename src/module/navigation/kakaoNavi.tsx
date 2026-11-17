import {Linking, Platform, Alert} from 'react-native';

export interface NaviTarget
{
    title: string;
    lat?: string;
    lon?: string;
}

export async function openKakaoNavi({title, lat, lon}: NaviTarget)
{
    console.log('title :: ', title, 'lat :: ', lat, 'lon :: ', lon);
    if(!lat ||  !lon)
    {
        Alert.alert('알림', '목적지 좌표 정보가 없습니다.');
        return;
    }

    const url = `kakaonavi://navigate?ep=${lat},${lon}&name=${encodeURIComponent(title)}`;
    const storeUrl =
        Platform.OS == 'android'
            ? 'market://details?id=com.locnall.KimGiSa'
            : 'https://apps.apple.com/app/id417698849';

    try {
        const suppored = await Linking.canOpenURL(url);
        if(suppored)
        {
            await Linking.openURL(url);
        }
        else
        {
            // 미 설치시 스토어로 이동
            await Linking.openURL(storeUrl);
        }
    }
    catch (error)
    {
        console.error(error);
        Alert.alert('오류:','카카오 네비를 실행 할 수 없습니다.')
    }
}
