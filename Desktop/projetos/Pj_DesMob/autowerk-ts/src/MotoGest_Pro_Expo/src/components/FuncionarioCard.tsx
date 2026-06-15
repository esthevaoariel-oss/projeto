import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trash2, User as UserIcon } from 'lucide-react-native';
import { Funcionario } from '../types';

interface FuncionarioCardProps {
  funcionario: Funcionario;
  onDelete: (id: string) => void;
}

const FuncionarioCard: React.FC<FuncionarioCardProps> = ({ funcionario, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <UserIcon color="#fff" size={20} />
        </View>
        <View style={styles.info}>
          <Text style={styles.nome}>{funcionario.nome}</Text>
          <Text style={styles.cargo}>{funcionario.cargo}</Text>
          <Text style={styles.telefone}>{funcionario.telefone}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => onDelete(funcionario.id)} style={styles.deleteBtn}>
        <Trash2 color="#ef4444" size={18} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f97316',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    justifyContent: 'center',
  },
  nome: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cargo: {
    color: '#94a3b8',
    fontSize: 12,
  },
  telefone: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
  },
});

export default FuncionarioCard;
