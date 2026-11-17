// src/module/address/kakaoapi.tsx
import { Platform } from 'react-native';

const KAKAO_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_KEY;

export async function searchKakaoKeyword(keyword: string) {
    if (!keyword?.trim()) return null;

    try {
        const targetUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword.trim())}`;

        // 💡 웹 브라우저에서는 CORS 우회 프록시 통과, 모바일에서는 직접 호출
        const requestUrl = Platform.OS === 'web'
            ? `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
            : targetUrl;

        const response = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                Authorization: `KakaoAK ${KAKAO_KEY}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[카카오 API 에러 상세] status: ${response.status}`, errorText);
            return null;
        }

        const data = await response.json();
        return data.documents?.[0] || null;
    } catch (err) {
        console.error('카카오 로컬 API 요청 실패:', err);
        return null;
    }
}