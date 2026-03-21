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
    hint: "Swipe down → Focus / Do Not Disturb",
  },
  {
    id: "facedown",
    label: "Place Phone Face Down",
    hint: "Or set it aside — your call.",
  },
];

export default function FocusSetupChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggleItem(id: string) {
    setChecked((prev) => {
      // don't mutate state directly
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
            {/* Checkbox */}
            <View
              style={[styles.checkbox, isChecked && styles.checkboxChecked]}
            >
              {isChecked && <Text style={styles.checkmark}>✓</Text>}
            </View>

            {/* Label + hint */}
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
    gap: 12,
    width: "100%",
  },
  row: {
    flexDirection: "row", // ← horizontal layout: checkbox on left, text on right
    alignItems: "center",
    backgroundColor: "#F5F0E8",
    borderRadius: 12,
    padding: 16,
    gap: 14,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#9B8FA0",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#3D2C4E",
    borderColor: "#3D2C4E",
  },
  checkmark: {
    color: "#FAF8F5",
    fontSize: 14,
    fontWeight: "700",
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#3D2C4E",
  },
  labelChecked: {
    color: "#9B8FA0", // dims when checked — visual confirmation
  },
  textGroup: {
    flex: 1, // takes remaining width after the checkbox
  },
  hint: {
    fontSize: 12,
    color: "#9B8FA0",
    marginTop: 2,
  },
});
