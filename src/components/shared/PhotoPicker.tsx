import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Text } from '../ui/Text';

interface PhotoPickerProps {
  label: string;
  uris: string[];
  onChange: (uris: string[]) => void;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({ label, uris, onChange }) => {
  const { colors, radius, spacing } = useTheme();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      onChange([...uris, ...result.assets.map((a) => a.uri)]);
    }
  };

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text variant="subheading" style={{ marginBottom: spacing.sm }}>
        {label}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {uris.map((uri) => (
            <TouchableOpacity key={uri} onLongPress={() => onChange(uris.filter((u) => u !== uri))}>
              <Image source={{ uri }} style={{ width: 72, height: 72, borderRadius: radius.md }} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={pickImage}
            style={{
              width: 72,
              height: 72,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.cardBorder,
              borderStyle: 'dashed',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="camera-outline" size={22} color={colors.accentGold} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
