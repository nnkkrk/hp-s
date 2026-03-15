"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Percent,
  Coins,
  Settings2,
  Trash2,
  RefreshCcw,
  Gamepad2,
  Save,
  ChevronDown,
  Info,
  Shield,
  IndianRupee,
  Loader2,
  Package
} from "lucide-react";

const API_BASE = "https://game-off-ten.vercel.app/api/v1";

export default function PricingTab({
  pricingType,
  setPricingType,
  slabs,
  setSlabs,
  overrides,
  setOverrides,
  savingPricing,
  onSave,
}) {
  const [pricingMode, setPricingMode] = useState("percent");
  const [games, setGames] = useState([]);
  const [itemsByGame, setItemsByGame] = useState({});
  const [fixedGameFilter, setFixedGameFilter] = useState("");
  const [fixedItemFilter, setFixedItemFilter] = useState("");
  const [loadingFixedPrices, setLoadingFixedPrices] = useState(false);
  const [bulkPercent, setBulkPercent] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/games/list`);
        const json = await res.json();
        if (json.success) setGames(json.data.games);
      } catch (e) {
        console.error("Game fetch failed", e);
      }
    })();
  }, []);

  const fetchItemsForGame = async (gameSlug) => {
    if (!gameSlug) return [];
    if (itemsByGame[gameSlug]) return itemsByGame[gameSlug];

    try {
      const res = await fetch(`${API_BASE}/games/${gameSlug}/items`);
      const json = await res.json();
      if (json.success) {
        const items = json.data.items || [];
        setItemsByGame((p) => ({ ...p, [gameSlug]: items }));
        return items;
      }
    } catch (e) {
      console.error("Item fetch failed", e);
    }
    return [];
  };

  const hydrateFixedPricing = async (gameSlug) => {
    if (!gameSlug) return;
    setLoadingFixedPrices(true);
    try {
      const items = await fetchItemsForGame(gameSlug);
      const hydrated = items.map((item) => {
        const existing = overrides.find(
          (o) => o.gameSlug === gameSlug && o.itemSlug === item.itemSlug
        );
        return {
          gameSlug,
          itemSlug: item.itemSlug,
          itemName: item.itemName,
          fixedPrice: existing?.fixedPrice ?? Number(item.sellingPrice) ?? 0,
        };
      });
      setOverrides(hydrated);
      setFixedItemFilter("");
    } finally {
      setLoadingFixedPrices(false);
    }
  };

  useEffect(() => {
    if (pricingMode !== "fixed") return;
    if (!fixedGameFilter) return;
    hydrateFixedPricing(fixedGameFilter);
  }, [pricingMode, pricingType, fixedGameFilter]);

  const visibleOverrides = useMemo(() => {
    return overrides.filter((o) => {
      if (fixedGameFilter && o.gameSlug !== fixedGameFilter) return false;
      if (fixedItemFilter && o.itemSlug !== fixedItemFilter) return false;
      return true;
    });
  }, [overrides, fixedGameFilter, fixedItemFilter]);

  const updateOverridePrice = (i, value) => {
    const next = [...overrides];
    next[i].fixedPrice = Math.max(0, Number(value) || 0);
    setOverrides(next);
  };

  const applyBulkPercentage = () => {
    const percent = Number(bulkPercent);
    if (!Number.isFinite(percent) || percent === 0) return;
    const multiplier = 1 + percent / 100;
    const next = overrides.map((o) => {
      if ((fixedGameFilter && o.gameSlug !== fixedGameFilter) || (fixedItemFilter && o.itemSlug !== fixedItemFilter)) {
        return o;
      }
      return { ...o, fixedPrice: Math.round(o.fixedPrice * multiplier) };
    });
    setOverrides(next);
    setBulkPercent("");
  };

  const updateSlab = (i, key, value) => {
    const next = [...slabs];
    next[i][key] = Math.max(0, Number(value) || 0);
    setSlabs(next);
  };

  const addSlab = () => setSlabs([...slabs, { min: 0, max: 0, percent: 0 }]);
  const deleteSlab = (i) => setSlabs(slabs.filter((_, idx) => idx !== i));
  const canSave = !savingPricing && ((pricingMode === "percent" && slabs.length) || (pricingMode === "fixed" && overrides.length));

  return (
    <div className="space-y-4 pb-20 max-w-full overflow-x-hidden">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 md:px-0">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">Pricing Management</h2>
          <p className="text-sm text-[var(--muted)]">Configure markups and asset pricing limits.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[var(--foreground)]/[0.03] p-1 rounded-xl border border-[var(--border)] w-full sm:w-auto">
            {[{ id: "percent", label: "Markup", icon: <Percent size={14} /> }, { id: "fixed", label: "Fixed", icon: <Coins size={14} /> }].map((m) => (
              <button
                key={m.id}
                onClick={() => setPricingMode(m.id)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${pricingMode === m.id
                  ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/10"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 px-0 md:px-0">
        {/* ================= MAIN CONFIGURATION AREA ================= */}
        <div className="lg:col-span-8 space-y-4">
          {/* TARGET ROLE SELECTOR */}
          <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-4">
            <div className="flex items-center gap-3">
              <Settings2 size={16} className="text-[var(--accent)]" />
              <h3 className="text-xs font-bold text-[var(--muted)]">Target Roles</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {["user", "member", "admin"].map((type) => (
                <button
                  key={type}
                  onClick={() => setPricingType(type)}
                  className={`h-10 rounded-xl border text-xs font-semibold capitalize transition-all ${pricingType === type
                    ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/10"
                    : "bg-[var(--foreground)]/[0.03] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                >
                  {type}s
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {pricingMode === "percent" ? (
              <motion.div
                key="markup"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                className="p-4 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                      <Percent size={18} />
                    </div>
                    <h3 className="text-base font-bold text-[var(--foreground)]">Markup Ranges</h3>
                  </div>
                  <button
                    onClick={addSlab}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all outline-none"
                  >
                    + Add New Range
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="hidden sm:grid grid-cols-12 gap-3 px-2 text-[10px] font-bold text-[var(--muted)]">
                    <div className="col-span-4">Min Price (₹)</div>
                    <div className="col-span-4">Max Price (₹)</div>
                    <div className="col-span-3">Markup (%)</div>
                    <div className="col-span-1"></div>
                  </div>

                  {slabs.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center p-3 sm:p-3.5 rounded-xl border border-[var(--border)] bg-[var(--foreground)]/[0.01] hover:bg-[var(--foreground)]/[0.03] transition-colors"
                    >
                      <div className="col-span-4 space-y-1 sm:space-y-0">
                        <label className="sm:hidden text-[10px] font-bold text-[var(--muted)] ml-1">Min Price (₹)</label>
                        <input
                          type="number"
                          value={s.min}
                          onChange={(e) => updateSlab(i, "min", e.target.value)}
                          className="w-full h-10 px-4 rounded-xl bg-[var(--foreground)]/[0.03] border border-[var(--border)] text-[var(--foreground)] font-semibold text-sm outline-none focus:border-[var(--accent)]/50 transition-all font-mono"
                          placeholder="0"
                        />
                      </div>
                      <div className="col-span-4 space-y-1 sm:space-y-0">
                        <label className="sm:hidden text-[10px] font-bold text-[var(--muted)] ml-1">Max Price (₹)</label>
                        <input
                          type="number"
                          value={s.max}
                          onChange={(e) => updateSlab(i, "max", e.target.value)}
                          className="w-full h-10 px-4 rounded-xl bg-[var(--foreground)]/[0.03] border border-[var(--border)] text-[var(--foreground)] font-semibold text-sm outline-none focus:border-[var(--accent)]/50 transition-all font-mono"
                          placeholder="1000"
                        />
                      </div>
                      <div className="col-span-3 space-y-1 sm:space-y-0">
                        <label className="sm:hidden text-[10px] font-bold text-[var(--muted)] ml-1">Markup (%)</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={s.percent}
                            onChange={(e) => updateSlab(i, "percent", e.target.value)}
                            className="w-full h-10 px-4 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] font-bold text-sm outline-none transition-all placeholder:text-[var(--accent)]/40"
                            placeholder="5"
                          />
                          <Percent size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--accent)]/50" />
                        </div>
                      </div>
                      <div className="col-span-1 flex justify-end sm:justify-center">
                        <button
                          onClick={() => deleteSlab(i)}
                          className="p-2 sm:p-0 text-[var(--muted)] hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {!slabs.length && (
                    <div className="py-16 text-center border border-dashed border-[var(--border)] rounded-2xl">
                      <p className="text-xs font-medium text-[var(--muted)]">No markup ranges defined.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="fixed"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                className="space-y-4"
              >
                {/* GAME SELECTION */}
                <div className="p-4 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Coins size={18} />
                    </div>
                    <h3 className="text-base font-bold text-[var(--foreground)]">Asset Pricing Overrides</h3>
                  </div>

                  <div className="relative">
                    <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]/60" size={18} />
                    <select
                      value={fixedGameFilter}
                      onChange={(e) => setFixedGameFilter(e.target.value)}
                      className="w-full h-11 pl-11 pr-10 rounded-xl border border-[var(--border)] bg-[var(--foreground)]/[0.03] text-[var(--foreground)] font-semibold text-sm outline-none appearance-none cursor-pointer focus:border-[var(--accent)]/50 transition-all [color-scheme:dark]"
                    >
                      <option value="">Select Target Game</option>
                      {games.map((g) => (
                        <option key={g.gameSlug} value={g.gameSlug}>
                          {g.gameName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]/40 pointer-events-none" size={18} />
                  </div>

                  {fixedGameFilter && (
                    <div className="flex flex-col gap-3 p-4 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/10">
                      <div className="flex items-center gap-2.5">
                        <Info size={14} className="text-[var(--accent)]" />
                        <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Bulk adjustment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--accent)]">%</span>
                          <input
                            type="number"
                            placeholder="+10 or -5"
                            value={bulkPercent}
                            onChange={(e) => setBulkPercent(e.target.value)}
                            className="w-full h-10 pl-9 pr-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] font-bold text-sm outline-none focus:border-[var(--accent)]/40 transition-all"
                          />
                        </div>
                        <button
                          onClick={applyBulkPercentage}
                          disabled={!bulkPercent}
                          className="px-6 h-10 rounded-xl bg-[var(--accent)] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[var(--accent)]/10 disabled:opacity-30 transition-all"
                        >
                          Apply
                        </button>
                      </div>
                      <p className="text-[10px] text-[var(--muted)]/50 px-1 italic">
                        Applies percentage change to all visible items.
                      </p>
                    </div>
                  )}
                </div>

                {/* ITEMS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <AnimatePresence>
                    {loadingFixedPrices ? (
                      <div className="col-span-full py-16 flex flex-col items-center justify-center opacity-40">
                        <Loader2 size={28} className="animate-spin text-[var(--accent)] mb-3" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Fetching Prices...</p>
                      </div>
                    ) : (
                      visibleOverrides.map((o, idx) => (
                        <motion.div
                          key={o.itemSlug}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.01 }}
                          className="p-3 sm:p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--foreground)]/[0.02] transition-all group"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-[var(--foreground)]/[0.05] flex items-center justify-center text-[var(--accent)]">
                              <Package size={14} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-[var(--muted)]/40 uppercase truncate">{o.gameSlug}</p>
                              <p className="text-xs font-bold text-[var(--foreground)] truncate">{o.itemName || o.itemSlug}</p>
                            </div>
                          </div>
                          <div className="relative">
                            <IndianRupee size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)]" />
                            <input
                              type="number"
                              value={o.fixedPrice}
                              onChange={(e) =>
                                updateOverridePrice(
                                  overrides.findIndex((x) => x.itemSlug === o.itemSlug),
                                  e.target.value
                                )
                              }
                              className="w-full h-10 pl-11 pr-4 rounded-xl bg-[var(--foreground)]/[0.03] border border-[var(--border)] text-[var(--foreground)] font-bold text-sm tabular-nums outline-none focus:bg-[var(--foreground)]/[0.06] transition-all font-mono"
                              placeholder="0"
                            />
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ================= PRICING SUMMARY SIDEBAR ================= */}
        <div className="lg:col-span-4 space-y-4">
          <div className="lg:sticky lg:top-6 p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-5">
            <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
              <Shield size={18} className="text-[var(--accent)]" />
              <h3 className="text-base font-bold text-[var(--foreground)]">Pricing Summary</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-[var(--muted)]">Pricing Mode</span>
                <span className="text-[var(--foreground)] font-bold capitalize">{pricingMode === 'percent' ? 'Markup %' : 'Fixed Price'}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-[var(--muted)]">Applies To</span>
                <span className="text-white bg-[var(--accent)] px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize tracking-wide">{pricingType}s</span>
              </div>
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-[var(--muted)]">Total Items</span>
                <span className="text-[var(--foreground)] font-bold tabular-nums">{pricingMode === 'percent' ? slabs.length : visibleOverrides.length}</span>
              </div>
            </div>

            <div className="h-px bg-[var(--border)] w-full opacity-30 shadow-sm" />

            <button
              onClick={onSave}
              disabled={!canSave}
              className={`
                  w-full h-12 rounded-xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-wider transition-all outline-none
                  ${canSave
                  ? "bg-[var(--accent)] text-white shadow-xl shadow-[var(--accent)]/10 hover:brightness-110 active:scale-95"
                  : "bg-[var(--foreground)]/[0.05] text-[var(--muted)]/40 cursor-not-allowed"}
                `}
            >
              {savingPricing ? (
                <>
                  <RefreshCcw size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Pricing
                </>
              )}
            </button>

            <div className="p-3.5 rounded-xl bg-[var(--foreground)]/[0.02] border border-[var(--border)] space-y-2">
              <div className="flex items-center gap-2 text-[var(--accent)]/60">
                <Info size={14} />
                <span className="text-[10px] font-bold uppercase">Important</span>
              </div>
              <p className="text-[10px] font-medium text-[var(--muted)] leading-relaxed">
                Changes will be applied to the website immediately after saving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
