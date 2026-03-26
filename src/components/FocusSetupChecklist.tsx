import { Colors } from "@/constants/colors";
import { Radii, Spacing, Type } from "@/constants/theme";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ChecklistItem {
  id: string;
  label: string;
  hint: string;
}

const ITEMS: ChecklistItem[] = [
  {
    id: "dnd",
    label: "Enable Do Not Disturb",
    hint: "Swipe down to Focus or Do Not Disturb.",
  },
  {
    id: "facedown",
    label: "Place Phone Face Down",
    hint: "Or set it aside. Your call.",
  },
];

export default function FocusSetupChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggleItem(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <View style={styles.container}>
      {ITEMS.map((item) => {
        const isChecked = checked.has(item.id);

        return (
          <Pressable
            key={item.id}
            style={styles.row}
            onPress={() => toggleItem(item.id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isChecked }}
          >
            <View
              style={[styles.checkbox, isChecked && styles.checkboxChecked]}
            >
              {isChecked && <Text style={styles.checkmark}>✓</Text>}
            </View>

            <View style={styles.textGroup}>
              <Text style={[styles.label, isChecked && styles.labelChecked]}>
                {item.label}
              </Text>
              <Text style={styles.hint}>{item.hint}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing[3],
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.lg,
    padding: Spacing[4],
    gap: Spacing[4],
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: Radii.sm,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  checkmark: {
    color: Colors.onPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  textGroup: {
    flex: 1,
  },
  label: {
    ...Type.bodyMd,
    fontWeight: "500",
  },
  labelChecked: {
    color: Colors.textTertiary,
  },
  hint: {
    ...Type.bodySm,
    marginTop: 2,
  },
});
