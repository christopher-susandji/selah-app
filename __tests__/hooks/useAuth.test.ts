import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useAuth } from "@/hooks/useAuth";

const mockGetSession = jest.fn();
const mockUnsubscribe = jest.fn();
let mockAuthStateListener: ((event: string, session: any) => void) | undefined;

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
      onAuthStateChange: (listener: (event: string, session: any) => void) => {
        mockAuthStateListener = listener;
        return {
          data: {
            subscription: {
              unsubscribe: mockUnsubscribe,
            },
          },
        };
      },
    },
  },
}));

describe("useAuth", () => {
  beforeEach(() => {
    mockGetSession.mockReset();
    mockUnsubscribe.mockReset();
    mockAuthStateListener = undefined;
  });

  it("loads initial session and exposes user", async () => {
    const session = {
      user: { id: "user-1", email: "test@example.com" },
    } as any;

    mockGetSession.mockResolvedValue({ data: { session } });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.session).toEqual(session);
    expect(result.current.user?.id).toBe("user-1");
  });

  it("reacts to auth changes and unsubscribes on unmount", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });

    const { result, unmount } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const nextSession = {
      user: { id: "user-2", email: "next@example.com" },
    } as any;

    act(() => {
      mockAuthStateListener?.("SIGNED_IN", nextSession);
    });

    expect(result.current.user?.id).toBe("user-2");

    act(() => {
      mockAuthStateListener?.("SIGNED_OUT", null);
    });

    expect(result.current.user).toBeNull();

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
