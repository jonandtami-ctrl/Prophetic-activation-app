import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme';
import { Screen, Text, Card, Badge, EmptyState } from '../../components/ui';
import { RootStackParamList } from '../../navigation/types';
import { useAppNavigation } from '../../navigation/hooks';
import { useDiscernmentStore } from '../../store/useDiscernmentStore';
import { useJournalStore } from '../../store/useJournalStore';
import { useDreamStore } from '../../store/useDreamStore';
import { NODE_TYPE_COLORS, NODE_TYPE_ICONS, NODE_TYPE_LABELS } from '../../constants/discernmentMap';
import { formatFriendlyDate } from '../../lib/dates';

type Props = NativeStackScreenProps<RootStackParamList, 'NodeDetail'>;

export const NodeDetailScreen: React.FC<Props> = ({ route }) => {
  const { colors, spacing } = useTheme();
  const navigation = useAppNavigation();
  const nodes = useDiscernmentStore((s) => s.nodes);
  const connections = useDiscernmentStore((s) => s.connections);
  const removeConnection = useDiscernmentStore((s) => s.removeConnection);
  const removeNode = useDiscernmentStore((s) => s.removeNode);
  const entries = useJournalStore((s) => s.entries);
  const dreams = useDreamStore((s) => s.dreams);

  const node = nodes.find((n) => n.id === route.params.nodeId);

  const relatedConnections = useMemo(
    () => connections.filter((c) => c.sourceNodeId === route.params.nodeId || c.targetNodeId === route.params.nodeId),
    [connections, route.params.nodeId],
  );

  const linkedEntry = node?.type === 'journal-entry' ? entries.find((e) => e.id === node.refId) : undefined;
  const linkedDream = node?.type === 'dream' ? dreams.find((d) => d.id === node.refId) : undefined;

  if (!node) {
    return (
      <Screen>
        <EmptyState title="Node not found" message="This node may have been removed." />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.lg }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            removeNode(node.id);
            navigation.goBack();
          }}
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <Badge label={NODE_TYPE_LABELS[node.type]} tone="lavender" />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md, marginBottom: spacing.lg }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: `${NODE_TYPE_COLORS[node.type]}33`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={NODE_TYPE_ICONS[node.type] as keyof typeof Ionicons.glyphMap} size={22} color={NODE_TYPE_COLORS[node.type]} />
        </View>
        <Text variant="title">{node.label}</Text>
      </View>

      {linkedEntry ? (
        <Card style={{ marginBottom: spacing.lg }} onPress={() => navigation.navigate('JournalEntry', { entryId: linkedEntry.id })}>
          <Text variant="subheading" style={{ marginBottom: spacing.xs }}>
            Open journal entry
          </Text>
          <Text variant="bodySmall" color="secondary">
            {formatFriendlyDate(linkedEntry.entryDate)}
          </Text>
        </Card>
      ) : null}

      {linkedDream ? (
        <Card style={{ marginBottom: spacing.lg }} onPress={() => navigation.navigate('DreamEntry', { dreamId: linkedDream.id })}>
          <Text variant="subheading" style={{ marginBottom: spacing.xs }}>
            Open dream entry
          </Text>
          <Text variant="bodySmall" color="secondary">
            {formatFriendlyDate(linkedDream.dreamDate)}
          </Text>
        </Card>
      ) : null}

      <Text variant="heading" style={{ marginBottom: spacing.md }}>
        Connected ({relatedConnections.length})
      </Text>
      {relatedConnections.length === 0 ? (
        <Text variant="bodySmall" color="muted">
          No connections yet. Use "Link Nodes" on the map to connect this to something else.
        </Text>
      ) : (
        relatedConnections.map((c) => {
          const otherId = c.sourceNodeId === node.id ? c.targetNodeId : c.sourceNodeId;
          const other = nodes.find((n) => n.id === otherId);
          if (!other) return null;
          return (
            <Card key={c.id} style={{ marginBottom: spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.push('NodeDetail', { nodeId: other.id })} style={{ flex: 1 }}>
                  <Text variant="subheading">{other.label}</Text>
                  <Text variant="caption" color="muted">
                    {NODE_TYPE_LABELS[other.type]}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeConnection(c.id)}>
                  <Ionicons name="close-circle-outline" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </Card>
          );
        })
      )}
    </Screen>
  );
};
