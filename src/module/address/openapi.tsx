import  {useState} from 'react'
import {searchKakaoKeyword} from "@/module/address/kakaoapi";

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export interface FinalDestination{
    id: string;
    title: string;
    roadAddress: string;
    placeName: string;
    lat : string;
    lon: string;
    distance: string;
}
// @ts-ignore
export async function addressFilter(rawText: string): Promise<FinalDestination | null>
{
    console.log("[원문] : "+rawText)
    if(!rawText.trim()) return null;

    try
    {
        const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                temperature: 0,
                messages:[
                    {
                        role: 'system',
                        content: `너는 한국어 비정형 문장(카톡/문자)에서 장소 및 주소 키워드를 정제하는 엔진이다.

[필수 정제 규칙]
[수정 및 추출 규칙]
1. 지역명+상호명 조합에서 오타가 의심되면 발음이나 글자가 비슷한 유명 상호로 적극 추측하여 교정한다.
2. 약칭이나 브랜드 줄임말("이비가" -> "이비가짬뽕", "스벅" -> "스타벅스")은 지도 검색에 유리한 유명 정식 상호로 보정한다.
3. 인사말, 시간, 오라는 명령어("와라", "오세요" 등), 단순 위치 상태 문구("나 여기 있어", "지금 도착함" 등), 방문/약속 제안 문구("올래??", "갈래?", "보자" 등)는 완전히 삭제하고 장소/주소 명칭만 남긴다.
4. 특수문자나 쉼표는 지우고 띄어쓰기로 연결해 하나의 검색어 문장으로 만든다.
5. 장소나 주소에 관한 정보(지역/동/역/가게명 등)가 아예 없는 일반 대화일 때만 "NO_ADDRESS"라고 응답한다.

[입출력 예시 - 반드시 이 양식을 따른다]
- 입력: "이비가 시청점으로와ㅓ" -> 출력: "이비가짬뽕 시청점"
- 입력: "강남역 2번출구 스벅 오세여" -> 출력: "강남역 2번출구 스타벅스"
- 입력: "내일 홍대 투썸 ㄱㄱ" -> 출력: "홍대입구역 투썸플레이스"
- 입력: "오늘 저녁에 뭐먹을까?" -> 출력: "NO_ADDRESS"`,
                    },
                    {
                        role: 'user',
                        content: rawText,
                    },
                ]
            })
        })

        const data = await response.json();
        const opanaiResult = data.choices?.[0]?.message?.content?.trim();
        console.log("[1차] 파싱결과  ",opanaiResult);

        if (!opanaiResult || opanaiResult === 'NO_ADDRESS') {
            return null;
        }

        // 2단계 ::: 카카오 키워드 검색으로 좌표 및 공식 주소 획득
        const kakaoResult = await searchKakaoKeyword(opanaiResult);
        console.log("[2차] 파싱결과", kakaoResult);

        if(false === kakaoResult)
        {
            console.warn("[2단계 결과없읍] ", opanaiResult);
            return null;
        }

        return {
            id: kakaoResult.id || Date.now().toString(),
            title: kakaoResult.place_name,
            roadAddress: kakaoResult.road_address_name || kakaoResult.address_name,
            placeName: kakaoResult.place_name,
            lon: kakaoResult.x, // 경도 (내비 목적지 x)
            lat: kakaoResult.y, // 위도 (내비 목적지 y)
            distance: '계산중...'
        };
    }
    catch (error)
    {
        console.error('파싱 오류: ', error);
        return null;
    }
}