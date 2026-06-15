import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Edit2, Trash2, Bike, ClipboardList } from 'lucide-react-native';
import { Moto } from '../types';

interface MotoCardProps {
  moto: Moto;
  onEdit: (moto: Moto) => void;
  onDelete: (id: string) => void;
  onPressCard?: (moto: Moto) => void;
}

const MotoCard: React.FC<MotoCardProps> = ({ moto, onEdit, onDelete, onPressCard }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPressCard && onPressCard(moto)} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Bike color="#f97316" size={24} />
          <View style={styles.titleText}>
            <Text style={styles.modelo}>{moto.modelo}</Text>
            <Text style={styles.placa}>{moto.placa}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit(moto)} style={styles.actionBtn}>
            <Edit2 color="#94a3b8" size={18} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(moto.id)} style={[styles.actionBtn, styles.deleteBtn]}>
            <Trash2 color="#ef4444" size={18} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Marca:</Text>
          <Text style={styles.detailValue}>{moto.marca}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Proprietário:</Text>
          <Text style={styles.detailValue}>{moto.proprietario}</Text>
        </View>
      </View>

      <View style={styles.servicosContainer}>
        <View style={styles.servicosHeader}>
          <ClipboardList color="#94a3b8" size={14} />
          <Text style={styles.servicosTitle}>Toque para ver o histórico e detalhes</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    marginLeft: 12,
  },
  modelo: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placa: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    padding: 10,
    marginLeft: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  deleteBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  details: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    color: '#94a3b8',
    fontSize: 14,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  servicosContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 12,
    borderRadius: 16,
  },
  servicosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  servicosTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)',
  },
  tagText: {
    color: '#f97316',
    fontSize: 11,
    fontWeight: 'bold',
  },
  noServices: {
    color: '#64748b',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default MotoCard;
