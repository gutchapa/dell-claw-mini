import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Layout, Text } from '@ui-kitten/components';
import { RootStackParamList, UserProfile } from '../types';
import { loadProfiles, saveProfiles, createInitialStats } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSelection'>;

const avatars = ['🦉', '🦊', '🦁', '🐻', '🐼', '🐨', '🐯', '🐸'];

export const ProfileSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await loadProfiles();
    setProfiles(data);
  };

  const handleAddProfile = async () => {
    if (!newUserName.trim()) return;

    const newProfile: UserProfile = {
      id: Date.now().toString(),
      name: newUserName.trim(),
      avatar: selectedAvatar,
      stats: createInitialStats(),
    };

    const updatedProfiles = [...profiles, newProfile];
    await saveProfiles(updatedProfiles);
    setProfiles(updatedProfiles);
    setNewUserName('');
    setModalVisible(false);
  };

  const handleSelectProfile = (profileId: string) => {
    navigation.navigate('Home', { profileId });
  };

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Who's learning?</Text>
        
        <View style={styles.profilesGrid}>
          {profiles.map((profile) => (
            <TouchableOpacity
              key={profile.id}
              style={styles.profileCard}
              onPress={() => handleSelectProfile(profile.id)}
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>{profile.avatar}</Text>
              </View>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileScore}>XP: {profile.stats.totalScore}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.profileCard, styles.addCard]}
            onPress={() => setModalVisible(true)}
          >
            <View style={[styles.avatarCircle, styles.addCircle]}>
              <Text style={styles.addPlus}>+</Text>
            </View>
            <Text style={styles.profileName}>Add Student</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Student</Text>
            
            <View style={styles.avatarPicker}>
              {avatars.map(a => (
                <TouchableOpacity
                  key={a}
                  style={[styles.avatarOption, selectedAvatar === a && styles.selectedAvatar]}
                  onPress={() => setSelectedAvatar(a)}
                >
                  <Text style={styles.pickerEmoji}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter name"
              value={newUserName}
              onChangeText={setNewUserName}
              autoFocus={true}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddProfile}
                style={[styles.modalButton, styles.saveButton]}
              >
                <Text style={styles.saveButtonText}>ADD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 24,
    alignItems: 'center',
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#4B4B4B',
    marginBottom: 40,
  },
  profilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  profileCard: {
    alignItems: 'center',
    width: 140,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F7F7F7',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarEmoji: {
    fontSize: 50,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4B4B4B',
  },
  profileScore: {
    fontSize: 14,
    color: '#777777',
    fontWeight: '700',
  },
  addCard: {
    opacity: 0.8,
  },
  addCircle: {
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  addPlus: {
    fontSize: 40,
    color: '#AFAFAF',
    fontWeight: '300',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#4B4B4B',
    marginBottom: 25,
  },
  avatarPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 25,
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatar: {
    borderColor: '#58CC02',
    backgroundColor: '#E5FFD1',
  },
  pickerEmoji: {
    fontSize: 30,
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#F7F7F7',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#4B4B4B',
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 5,
  },
  cancelButton: {
    backgroundColor: '#E5E5E5',
    borderBottomColor: '#D1D1D1',
  },
  cancelButtonText: {
    color: '#777777',
    fontWeight: '900',
  },
  saveButton: {
    backgroundColor: '#58CC02',
    borderBottomColor: '#46A302',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
});

export default ProfileSelectionScreen;
