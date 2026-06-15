import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Bike, Clock, CheckCircle, Users } from 'lucide-react-native';
import { Stats } from '../types';

interface StatsCardsProps {
  stats: Stats;
  onCardPress?: (label: string) => void;
}

const { width } = Dimensions.get('window');
const isSmall = width < 600;

const StatsCards: React.FC<StatsCardsProps> = ({ stats, onCardPress }) => {
  const cards = [
    { label: 'Motos', value: stats.motos, icon: Bike, color: '#3b82f6' },
    { label: 'Pendentes', value: stats.pendentes, icon: Clock, color: '#f97316' },
    { label: 'Concluídos', value: stats.concluidos, icon: CheckCircle, color: '#10b981' },
    { label: 'Mecânicos', value: stats.mecanicos, icon: Users, color: '#8b5cf6' },
  ];

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <TouchableOpacity 
          key={index} 
          style={[styles.card, { width: isSmall ? '48%' : '23%' }]}
          onPress={() => onCardPress && onCardPress(card.label)}
          activeOpacity={onCardPress ? 0.7 : 1}
        >
          <View style={[styles.iconContainer, { backgroundColor: card.color }]}>
            <card.icon color="#fff" size={24} />
          </View>
          <View>
            <Text style={styles.label}>{card.label}</Text>
            <Text style={styles.value}>{card.value}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    gap: 10,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  label: {
    color: '#94a3b8',
    fontSize: 12,
  },
  value: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StatsCards;
