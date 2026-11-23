import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    accentCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    accentCardSelected: {
        borderColor: '#2563EB',
        borderWidth: 1.5,
        shadowColor: '#2563EB',
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 5,
    },
    cardColorBar: {
        width: 5,
        backgroundColor: '#CBD5E1',
    },
    cardColorBarActive: {
        backgroundColor: '#2563EB',
    },
    cardInner: {
        flex: 1,
        padding: 16,
    },
    cardHeaderArea: {
        width: '100%',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    placeTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
        flex: 1,
        marginRight: 8,
    },
    rightGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    distanceBadge: {
        fontSize: 11,
        fontWeight: '700',
        color: '#2563EB',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    roadAddress: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    starIcon: {
        fontSize: 20,
        color: '#CBD5E1',
    },
    starIconActive: {
        color: '#F59E0B',
    },
    naviButtonGroup: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    naviBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    kakaoBg: {
        backgroundColor: '#FEE500',
    },
    kakaoText: {
        color: '#191919',
        fontWeight: '800',
        fontSize: 12,
    },
    tmapBg: {
        backgroundColor: '#0066FF',
    },
    tmapText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 12,
    },
    naverBg: {
        backgroundColor: '#03CF5D',
    },
    naverText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 12,
    },
});