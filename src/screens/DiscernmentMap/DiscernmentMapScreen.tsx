import React, { useMemo, useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Text, Card, Badge, EmptyState, Button, FormField } from '../../components/ui';
import { PillSelect } from '../../components/shared';
import { useAppNavigation } from '../../navigation/hooks';
import { useDiscernmentStore } from '../../store/useDiscernmentStore';
import { layoutGraph } from '../../lib/graphLayout';
import { findSuggestedPairs } from '../../lib/suggestConnections';
import { NODE_TYPE_COLORS, NODE_TYPE_ICONS, NODE_TYPE_LABELS } from '../../constants/discernmentMap';
import { DiscernmentNodeType } from '../../types/models';

const { width: screenWidth } = Dimensions.get('window');
const CANVAS_HEIGHT = 480;

const MANUAL_NODE_TYPES: DiscernmentNodeType[] = ['theme', 'symbol', 'person', 'season', 'biblical-principle', 'fulfilled-outcome'];

export const DiscernmentMapScreen: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const navigation = useAppNavigation();
  const nodes = useDiscernmentStore((s) => s.nodes);
  const connections = useDiscernmentStore((s) => s.connections);
  const suggestedConnections = useDiscernmentStore((s) => s.suggestedConnections);
  const upsertNode = useDiscernmentStore((s) => s.upsertNode);
  const connect = useDiscernmentStore((s) => s.connect);
  const suggestConnection = useDiscernmentStore((s) => s.suggestConnection);
  const approveSuggestion = useDiscernmentStore((s) => s.approveSuggestion);
  const dismissSuggestion = useDiscernmentStore((s) => s.dismissSuggestion);

  const [linkMode, setLinkMode] = useState(false);
  const [selectedForLink, setSelectedForLink] = useState<string | null>(null);
  const [showAddNode, setShowAddNode] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newNodeType, setNewNodeType] = useState<DiscernmentNodeType>('theme');

  const canvasWidth = screenWidth - spacing.lg * 2;

  const laidOut = useMemo(() => layoutGraph(nodes, connections, canvasWidth, CANVAS_HEIGHT), [nodes, connections, canvasWidth]);
  const positionById = useMemo(() => new Map(laidOut.map((n) => [n.id, n])), [laidOut]);

  const handleNodePress = (nodeId: string) => {
    if (linkMode) {
      if (!selectedForLink) {
        setSelectedForLink(nodeId);
      } else if (selectedForLink !== nodeId) {
        connect(selectedForLink, nodeId);
        setSelectedForLink(null);
      }
      return;
    }
    navigation.navigate('NodeDetail', { nodeId });
  };

  const runAiSuggestions = () => {
    const pairs = findSuggestedPairs(nodes, [...connections, ...suggestedConnections]);
    pairs.forEach((p) => suggestConnection(p.sourceNodeId, p.targetNodeId, p.note));
    setShowSuggestions(true);
  };

  const addManualNode = () => {
    if (!newNodeLabel.trim()) return;
    upsertNode(newNodeType, newNodeLabel.trim());
    setNewNodeLabel('');
    setShowAddNode(false);
  };

  return (
    <Screen scroll={false} padded={false}>
      <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md, marginBottom: spacing.md }}>
        <Text variant="display" style={{ marginBottom: 4 }}>
          Discernment Map
        </Text>
        <Text variant="bodySmall" color="secondary">
          See how your journal, dreams, and Scripture connect over time.
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, marginBottom: spacing.md, flexWrap: 'wrap' }}>
        <Button
          label={linkMode ? (selectedForLink ? 'Tap a node to link' : 'Cancel linking') : 'Link Nodes'}
          variant={linkMode ? 'primary' : 'secondary'}
          size="sm"
          onPress={() => {
            setLinkMode((v) => !v);
            setSelectedForLink(null);
          }}
        />
        <Button label="Add Node" variant="secondary" size="sm" onPress={() => setShowAddNode((v) => !v)} />
        <Button label={`Suggestions${suggestedConnections.length ? ` (${suggestedConnections.length})` : ''}`} variant="secondary" size="sm" onPress={runAiSuggestions} />
      </View>

      {showAddNode ? (
        <Card style={{ marginHorizontal: spacing.lg, marginBottom: spacing.md }}>
          <FormField label="New node label" value={newNodeLabel} onChangeText={setNewNodeLabel} placeholder="e.g. Water, Restoration, Grandma…" />
          <PillSelect
            label="Type"
            value={newNodeType}
            onChange={setNewNodeType}
            options={MANUAL_NODE_TYPES.map((t) => ({ value: t, label: NODE_TYPE_LABELS[t] }))}
          />
          <Button label="Add" onPress={addManualNode} size="sm" />
        </Card>
      ) : null}

      {showSuggestions && suggestedConnections.length > 0 ? (
        <Card style={{ marginHorizontal: spacing.lg, marginBottom: spacing.md }}>
          <Text variant="subheading" style={{ marginBottom: spacing.sm }}>
            AI-Suggested Connections
          </Text>
          <Text variant="caption" color="muted" style={{ marginBottom: spacing.md }}>
            Nothing connects until you approve it.
          </Text>
          {suggestedConnections.map((s) => {
            const source = nodes.find((n) => n.id === s.sourceNodeId);
            const target = nodes.find((n) => n.id === s.targetNodeId);
            if (!source || !target) return null;
            return (
              <View key={s.id} style={{ marginBottom: spacing.md }}>
                <Text variant="bodySmall">
                  {source.label} ↔ {target.label}
                </Text>
                <Text variant="caption" color="muted" style={{ marginBottom: spacing.sm }}>
                  {s.note}
                </Text>
                <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                  <Button label="Approve" size="sm" onPress={() => approveSuggestion(s.id)} />
                  <Button label="Dismiss" size="sm" variant="ghost" onPress={() => dismissSuggestion(s.id)} />
                </View>
              </View>
            );
          })}
        </Card>
      ) : null}

      {nodes.length === 0 ? (
        <View style={{ paddingHorizontal: spacing.lg }}>
          <EmptyState
            title="Your map will grow with you"
            message="As you write journal entries and dreams, people, themes, and Scriptures will appear here automatically. You can add your own too."
          />
        </View>
      ) : (
        <View style={{ marginHorizontal: spacing.lg, height: CANVAS_HEIGHT, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden' }}>
          <Svg width={canvasWidth} height={CANVAS_HEIGHT} style={{ position: 'absolute' }}>
            {connections.map((c) => {
              const a = positionById.get(c.sourceNodeId);
              const b = positionById.get(c.targetNodeId);
              if (!a || !b) return null;
              return <Line key={c.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={colors.accentLavender} strokeOpacity={0.35} strokeWidth={1.5} />;
            })}
          </Svg>
          {laidOut.map((node) => {
            const isSelected = selectedForLink === node.id;
            return (
              <TouchableOpacity
                key={node.id}
                onPress={() => handleNodePress(node.id)}
                style={{
                  position: 'absolute',
                  left: node.x - 28,
                  top: node.y - 28,
                  width: 56,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: `${NODE_TYPE_COLORS[node.type]}33`,
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? colors.accentGold : NODE_TYPE_COLORS[node.type],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name={NODE_TYPE_ICONS[node.type] as keyof typeof Ionicons.glyphMap} size={16} color={NODE_TYPE_COLORS[node.type]} />
                </View>
                <Text variant="caption" numberOfLines={1} style={{ marginTop: 4, textAlign: 'center', width: 60 }}>
                  {node.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {nodes.length > 0 ? (
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <Text variant="caption" color="muted" style={{ marginBottom: spacing.sm }}>
            LEGEND
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(NODE_TYPE_LABELS).map(([type, label]) => (
              <Badge key={type} label={label} tone="neutral" />
            ))}
          </View>
        </View>
      ) : null}
    </Screen>
  );
};
