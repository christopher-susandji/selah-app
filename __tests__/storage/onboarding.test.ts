import {
  hasCompletedOnboarding,
  markOnboardingComplete,
} from "@/storage/onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;

describe("storage/onboarding", () => {
  beforeEach(() => {
    mockGetItem.mockReset();
    mockSetItem.mockReset();
  });

  it("returns false when onboarding flag is missing", async () => {
    mockGetItem.mockResolvedValue(null);

    await expect(hasCompletedOnboarding()).resolves.toBe(false);
  });

  it("returns true when onboarding flag is true", async () => {
    mockGetItem.mockResolvedValue("true");

    await expect(hasCompletedOnboarding()).resolves.toBe(true);
  });

  it("writes onboarding completion flag", async () => {
    mockSetItem.mockResolvedValue(undefined);

    await markOnboardingComplete();

    expect(mockSetItem).toHaveBeenCalledWith("@selah/onboarding_complete", "true");
  });
});
