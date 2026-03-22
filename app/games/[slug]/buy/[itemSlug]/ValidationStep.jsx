import HelpImagePopup from "../../../../../components/HelpImage/HelpImagePopup";
import RecentVerifiedPlayers from "../../../../region/RecentVerifiedPlayers";

export default function ValidationStep({
  playerId,
  setPlayerId,
  zoneId,
  setZoneId,
  onValidate,
  loading,
  error,
  setError,
}) {
  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError("");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Player Verification</h2>
        <HelpImagePopup />
      </div>

      <input
        value={playerId}
        onChange={handleChange(setPlayerId)}
        placeholder="Enter Player ID"
        className="p-3 rounded-lg bg-black/20 border border-gray-700 w-full outline-hidden focus:border-[var(--accent)] transition"
        disabled={loading}
      />

      <input
        value={zoneId}
        onChange={handleChange(setZoneId)}
        placeholder="Enter Zone ID"
        className="p-3 rounded-lg bg-black/20 border border-gray-700 w-full outline-hidden focus:border-[var(--accent)] transition"
        disabled={loading}
      />

      {error && (
        <div className="p-3 rounded-lg bg-red-600/20 border border-red-600/50 text-red-500 text-sm font-medium animate-in fade-in zoom-in-95 duration-200">
          ⚠️ {error}
        </div>
      )}

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
        {loading ? "Validating…" : "Validate"}
      </button>

      <RecentVerifiedPlayers
        limit={10}
        onSelect={(player) => {
          setPlayerId(player.playerId);
          setZoneId(player.zoneId);
        }}
      />
    </div>
  );
}
