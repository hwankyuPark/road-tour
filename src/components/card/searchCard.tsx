import React, {JSX, useState} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../css/card';
import {openNaverNavi, openTmapNavi, openKakaoNavi} from '../../module/navigation';

export interface AddressItem {
    id: string;
    title: string;
    roadAddress: string;
    placeName?: string;
    lat?: string; // 👈 추가
    lon?: string; // 👈 추가
    distance?: string;
    distanceKm?: number;
}

// 💡 1. Props 전체 인터페이스 선언
export interface SearchCardProps {
    item: AddressItem;
    isSelected: boolean;
    isSaved: boolean;
    onSelect: () => void;
    onToggleSave: (item: AddressItem) => void;
}

export function SearchCard(props: SearchCardProps): JSX.Element
{
    const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
    const { item, isSelected, isSaved, onSelect, onToggleSave } = props;

    return(
        <View
            key={item.id}
            style={[styles.accentCard, isSelected && styles.accentCardSelected]}>
            <View style={[styles.cardColorBar, isSelected && styles.cardColorBarActive]} />

            <View style={styles.cardInner}>
                <TouchableOpacity
                    onPress={onSelect}
                    activeOpacity={0.7}
                    style={styles.cardHeaderArea}>
                    <View style={styles.titleRow}>
                        <Text style={styles.placeTitle}>{item.title}</Text>

                        <View style={styles.rightGroup}>
                            {item.distance && <Text style={styles.distanceBadge}>{item.distance}</Text>}
                            <TouchableOpacity
                                /*onPress={() => handleToggleSave(item)}*/
                                activeOpacity={0.6}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Text style={[styles.starIcon, isSaved && styles.starIconActive]}>
                                    {isSaved ? '★' : '☆'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.roadAddress}>{item.roadAddress}</Text>
                </TouchableOpacity>

                {isSelected && (
                    <View style={styles.naviButtonGroup}>
                        <TouchableOpacity
                            style={[styles.naviBtn, styles.kakaoBg]}
                            activeOpacity={0.85}
                            onPress={()=> openKakaoNavi({title: item.title, lat: item.lat, lon: item.lon})}
                        >
                            <Text style={styles.kakaoText}>카카오내비</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.naviBtn, styles.tmapBg]}
                            activeOpacity={0.85}
                            onPress={()=> openTmapNavi({title: item.title, lat: item.lat, lon: item.lon})}
                        >
                            <Text style={styles.tmapText}>T map</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.naviBtn, styles.naverBg]}
                            activeOpacity={0.85}
                            onPress={()=> openNaverNavi({title: item.title, lat: item.lat, lon: item.lon})}
                        >
                            <Text style={styles.naverText}>네이버지도</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    )
}
