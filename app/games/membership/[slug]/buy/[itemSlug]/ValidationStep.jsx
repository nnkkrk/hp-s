import HelpImagePopup from "@/components/HelpImage/HelpImagePopup";
import RecentVerifiedPlayers from "../../../../../region/RecentVerifiedPlayers";

export default function ValidationStep({
  playerId,
  setPlayerId,
  onValidate,
  loading,
}) {
  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Link Verification</h2>
        {/* <HelpImagePopup /> */}
      </div>

      {/* CHARACTER ID INPUT */}
      <input
        value={playerId}
        onChange={(e) => setPlayerId(e.target.value)}
        placeholder="Enter Linked Mobile Number or Email ID"
        className="p-3 rounded-lg bg-black/20 border border-gray-700 w-full"
        disabled={loading}
      />

      {/* VALIDATE BUTTON */}
      <button
        onClick={onValidate}
        disabled={loading}
        className={`py-3 rounded-lg w-full font-semibold transition
          ${
            loading
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-[var(--accent)] text-black hover:opacity-90"
          }`}
      >
        {loading ? "Validating…" : "Continue"}
      </button>

      {/* RECENT VERIFIED PLAYERS */}
      {/* <RecentVerifiedPlayers
        limit={10}
        onSelect={(player) => {
          setPlayerId(player.playerId); // Character ID
        }}
      /> */}
    </div>
  );
}
