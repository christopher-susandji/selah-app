import { signInWithEmail, signOut, signUpWithEmail } from "@/storage/auth";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

import { supabase } from "@/lib/supabase";

const mockSignIn = supabase.auth.signInWithPassword as jest.Mock;
const mockSignUp = supabase.auth.signUp as jest.Mock;
const mockSignOut = supabase.auth.signOut as jest.Mock;

describe("storage/auth", () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    mockSignUp.mockReset();
    mockSignOut.mockReset();
  });

  it("signInWithEmail calls supabase auth and succeeds", async () => {
    mockSignIn.mockResolvedValue({ error: null });

    await expect(signInWithEmail("a@b.com", "pw")).resolves.toBeUndefined();

    expect(mockSignIn).toHaveBeenCalledWith({ email: "a@b.com", password: "pw" });
  });

  it("signInWithEmail throws when supabase returns an error", async () => {
    mockSignIn.mockResolvedValue({ error: { message: "invalid" } });

    await expect(signInWithEmail("a@b.com", "pw")).rejects.toThrow(
      "Failed to sign in: invalid",
    );
  });

  it("signUpWithEmail throws on error", async () => {
    mockSignUp.mockResolvedValue({ error: { message: "exists" } });

    await expect(signUpWithEmail("a@b.com", "pw")).rejects.toThrow(
      "Failed to sign up: exists",
    );
  });

  it("signOut throws on error", async () => {
    mockSignOut.mockResolvedValue({ error: { message: "network" } });

    await expect(signOut()).rejects.toThrow("Failed to sign out: network");
  });
});
