import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal as RNModal, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { X } from 'lucide-react-native';

interface ModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSave?: (data: any) => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ visible, title, onClose, onSave, children }) => {
  return (
    <RNModal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X color="#94a3b8" size={24} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.body}>
            {children}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={[styles.btn, styles.btnCancel]}>
              <Text style={styles.btnTextCancel}>{onSave ? 'Cancelar' : 'Fechar'}</Text>
            </TouchableOpacity>
            {onSave && (
              <TouchableOpacity onPress={() => onSave(null)} style={[styles.btn, styles.btnSave]}>
                <Text style={styles.btnTextSave}>Salvar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 5,
  },
  body: {
    padding: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 10,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  btnCancel: {
    borderWidth: 1,
    borderColor: '#94a3b8',
  },
  btnSave: {
    backgroundColor: '#f97316',
  },
  btnTextCancel: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  btnTextSave: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Modal;
