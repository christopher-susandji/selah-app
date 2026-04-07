import SessionCard from "@/components/SessionCard";
import type { Session } from "@/types/session";
import { render } from "@testing-library/react-native";

function buildSession(overrides: Partial<Session> = {}): Session {
  return {
    id: "session-1",
    startAt: "2026-04-07T13:05:00.000Z",
    endAt: "2026-04-07T13:25:00.000Z",
    elapsedSec: 125,
    distractionTaps: 2,
    leaveAppCount: 1,
    reflection: "Steadier than yesterday",
    ...overrides,
  };
}

describe("SessionCard", () => {
  it("renders duration, stats, and reflection", () => {
    const { getByText } = render(<SessionCard session={buildSession()} />);

    expect(getByText("2m 5s")).toBeTruthy();
    expect(getByText("2 distractions")).toBeTruthy();
    expect(getByText("left app 1x")).toBeTruthy();
    expect(getByText('"Steadier than yesterday"')).toBeTruthy();
  });

  it("hides leave-app and reflection when unavailable", () => {
    const session = buildSession({
      elapsedSec: 60,
      distractionTaps: 1,
      leaveAppCount: 0,
      reflection: null,
    });

    const { getByText, queryByText } = render(
      <SessionCard session={session} />,
    );

    expect(getByText("1m")).toBeTruthy();
    expect(getByText("1 distraction")).toBeTruthy();
    expect(queryByText(/left app/)).toBeNull();
    expect(queryByText(/Steadier than yesterday/)).toBeNull();
  });
});
