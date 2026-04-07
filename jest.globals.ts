Object.defineProperty(globalThis, "__ExpoImportMetaRegistry", {
  configurable: true,
  value: {},
});

if (typeof globalThis.structuredClone !== "function") {
  globalThis.structuredClone = <T>(value: T): T => {
    return JSON.parse(JSON.stringify(value)) as T;
  };
}
