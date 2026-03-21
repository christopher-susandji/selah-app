import { useKeepAwake } from "expo-keep-awake";

export function useConditionalKeepAwake(isActive: boolean) {
  useKeepAwake(isActive ? "session" : undefined);
}
