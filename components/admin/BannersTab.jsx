"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit3,
  Eye,
  EyeOff,
  RefreshCcw,
  Gamepad2,
  Link as LinkIcon,
  Type,
  ImageIcon,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default function BannersTab({ banners, onRefresh }) {
  const [form, setForm] = useState({
    bannerImage: "",
    bannerTitle: "",
    bannerSlug: "",
    bannerLink: "",
    bannerSummary: "",
    gameId: "",
    isShow: true,
  });

  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* ================= ADD / UPDATE ================= */

  const addBanner = async () => {
    if (!form.bannerImage || !form.bannerTitle || !form.bannerSlug) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          gameId: form.gameId
            ? form.gameId.split(",").map((g) => g.trim())
            : [],
        }),
      });

      if (res.ok) {
        resetForm();
        onRefresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (b) => {
    setEditingId(b._id);
    setForm({
      bannerImage: b.bannerImage || "",
      bannerTitle: b.bannerTitle || "",
      bannerSlug: b.bannerSlug || "",
      bannerLink: b.bannerLink || "",
      bannerSummary: b.bannerSummary || "",
      gameId: b.gameId?.join(", ") || "",
      isShow: b.isShow ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateBanner = async () => {
    if (!form.bannerSlug) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/banners/editbanner", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          gameId: form.gameId
            ? form.gameId.split(",").map((g) => g.trim())
            : [],
        }),
      });

      if (res.ok) {
        resetForm();
        onRefresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShow = async (id, isShow) => {
    await fetch(`/api/admin/banners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isShow: !isShow }),
    });

    onRefresh();
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      bannerImage: "",
      bannerTitle: "",
      bannerSlug: "",
      bannerLink: "",
      bannerSummary: "",
      gameId: "",
      isShow: true,
    });
  };

  return (
    <div className="space-y-10 pb-10">

      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">Website Banners</h2>
          <p className="text-xs text-[var(--muted)] font-medium mt-1">
            Add or edit banners for the home screen
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-xl bg-[var(--foreground)]/[0.03] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/[0.08] transition-all"
        >
          <RefreshCcw size={14} />
          <span className="text-xs font-semibold">Refresh List</span>
        </button>
      </div>

      {/* ================= FORM CARD ================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          relative rounded-3xl overflow-hidden border backdrop-blur-3xl transition-all duration-500
          ${editingId ? "border-[var(--accent)]/50 shadow-[0_0_40px_rgba(var(--accent-rgb),0.05)]" : "border-[var(--border)]"}
          bg-[var(--card)]
        `}
      >
        <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${editingId ? "bg-[var(--accent)]/20 text-[var(--accent)]" : "bg-[var(--foreground)]/[0.05] text-[var(--muted)]"}`}>
              {editingId ? <Edit3 size={18} /> : <Plus size={18} />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--foreground)]">
                {editingId ? "Update Banner" : "Add Banner"}
              </h3>
              <p className="text-[10px] text-[var(--muted)] font-medium mt-0.5">
                {editingId ? "Change banner details" : "Fill out the fields below"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* FORM FIELDS */}
          <div className="lg:col-span-7 space-y-5">

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--muted)] ml-1">Title</label>
                <input
                  value={form.bannerTitle}
                  onChange={(e) => setForm({ ...form, bannerTitle: e.target.value })}
                  className="w-full h-11 bg-[var(--foreground)]/[0.03] border border-[var(--border)] rounded-xl px-4 text-sm text-[var(--foreground)] focus:border-[var(--accent)]/50 transition-all outline-none placeholder:text-[var(--muted)]/40"
                  placeholder="Banner Title"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--muted)] ml-1">Slug</label>
                <input
                  value={form.bannerSlug}
                  onChange={(e) => setForm({ ...form, bannerSlug: e.target.value })}
                  disabled={!!editingId}
                  className="w-full h-11 bg-[var(--foreground)]/[0.03] border border-[var(--border)] rounded-xl px-4 text-sm text-[var(--foreground)] focus:border-[var(--accent)]/50 transition-all outline-none disabled:opacity-50 placeholder:text-[var(--muted)]/40"
                  placeholder="banner-slug"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--muted)] ml-1">Image URL</label>
              <input
                value={form.bannerImage}
                onChange={(e) => setForm({ ...form, bannerImage: e.target.value })}
                className="w-full h-11 bg-[var(--foreground)]/[0.03] border border-[var(--border)] rounded-xl px-4 text-sm text-[var(--foreground)] focus:border-[var(--accent)]/50 transition-all outline-none placeholder:text-[var(--muted)]/40"
                placeholder="https://..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--muted)] ml-1">Banner Link</label>
                <input
                  value={form.bannerLink}
                  onChange={(e) => setForm({ ...form, bannerLink: e.target.value })}
                  className="w-full h-11 bg-[var(--foreground)]/[0.03] border border-[var(--border)] rounded-xl px-4 text-sm text-[var(--foreground)] focus:border-[var(--accent)]/50 transition-all outline-none placeholder:text-[var(--muted)]/40"
                  placeholder="/games/..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--muted)] ml-1">Associated Games</label>
                <input
                  value={form.gameId}
                  onChange={(e) => setForm({ ...form, gameId: e.target.value })}
                  className="w-full h-11 bg-[var(--foreground)]/[0.03] border border-[var(--border)] rounded-xl px-4 text-sm text-[var(--foreground)] focus:border-[var(--accent)]/50 transition-all outline-none placeholder:text-[var(--muted)]/40"
                  placeholder="mlbb, bgmi"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--muted)] ml-1">Summary</label>
              <textarea
                value={form.bannerSummary}
                onChange={(e) => setForm({ ...form, bannerSummary: e.target.value })}
                className="w-full min-h-[90px] bg-[var(--foreground)]/[0.03] border border-[var(--border)] rounded-xl p-4 text-sm text-[var(--foreground)] focus:border-[var(--accent)]/50 transition-all outline-none resize-none placeholder:text-[var(--muted)]/40"
                placeholder="Short description..."
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
              <div className="flex bg-[var(--foreground)]/[0.03] p-1 rounded-xl border border-[var(--border)] self-start">
                <button
                  onClick={() => setForm({ ...form, isShow: true })}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${form.isShow ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20 font-black" : "text-[var(--muted)]"
                    }`}
                >
                  Visible
                </button>
                <button
                  onClick={() => setForm({ ...form, isShow: false })}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${!form.isShow ? "bg-red-500 text-white shadow-lg shadow-red-500/20 font-black" : "text-[var(--muted)]"
                    }`}
                >
                  Hidden
                </button>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-[var(--border)] text-[10px] font-bold transition-all text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/[0.05]"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={editingId ? updateBanner : addBanner}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-[var(--accent)] text-white text-[10px] font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-[var(--accent)]/20"
                >
                  {isSubmitting ? "Saving..." : (editingId ? "Update Banner" : "Add Banner")}
                </button>
              </div>
            </div>
          </div>

          {/* PREVIEW PANEL */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <label className="text-[10px] font-bold text-[var(--muted)] mb-4 ml-1">Preview</label>

            <div className="flex-1 relative rounded-2xl overflow-hidden border border-[var(--border)] bg-black min-h-[200px]">
              {form.bannerImage ? (
                <>
                  <img
                    src={form.bannerImage}
                    alt="Preview"
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 group">
                    <h4 className="text-white text-lg font-bold leading-tight">
                      {form.bannerTitle || "Title Preview"}
                    </h4>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-[var(--muted)]/20">
                  <ImageIcon size={32} className="mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No Image</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================= LIST SECTION ================= */}
      <div className="space-y-5">
        <h3 className="text-sm font-bold ml-1 text-[var(--foreground)]">Banner List ({banners.length})</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {banners.map((b, idx) => (
              <motion.div
                key={b._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)] transition-all hover:shadow-xl hover:shadow-black/5"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={b.bannerImage}
                    alt={b.bannerTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute top-3 right-3">
                    {b.isShow ? (
                      <span className="px-2 py-1 rounded-md bg-green-500/20 text-[8px] font-black text-green-500 uppercase border border-green-500/20 backdrop-blur-md">Visible</span>
                    ) : (
                      <span className="px-2 py-1 rounded-md bg-red-500/20 text-[8px] font-black text-red-500 uppercase border border-red-500/20 backdrop-blur-md">Hidden</span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-xs font-bold text-white truncate">{b.bannerTitle}</p>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between gap-3 bg-[var(--card)]">
                  <p className="text-[10px] font-black text-[var(--accent)] truncate uppercase italic">/{b.bannerSlug}</p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleShow(b._id, b.isShow)}
                      className="p-2 rounded-lg bg-[var(--foreground)]/[0.05] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      {b.isShow ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={() => startEdit(b)}
                      className="p-2 rounded-lg bg-[var(--foreground)]/[0.05] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
