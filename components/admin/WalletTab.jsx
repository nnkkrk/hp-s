"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiMinus, FiClock, FiUser, FiActivity, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function WalletTab() {
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [adjustAmount, setAdjustAmount] = useState("");
    const [adjustType, setAdjustType] = useState("add");
    const [adjustDescription, setAdjustDescription] = useState("");
    const [adjusting, setAdjusting] = useState(false);
    const [totalWalletCredit, setTotalWalletCredit] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                search,
                page: page.toString(),
                limit: limit.toString(),
                sortBy: "wallet",
                order: "desc"
            });
            const res = await fetch(`/api/admin/users?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setUsers(data.data);
                setTotalWalletCredit(data.totalWalletCredit || 0);
                setTotalPages(data.pagination?.totalPages || 1);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTransactions = async () => {
        try {
            const res = await fetch("/api/admin/wallet/transactions", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setTransactions(data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdjustWallet = async () => {
        if (!selectedUser || !adjustAmount || isNaN(adjustAmount)) {
            alert("Please enter a valid amount and select a user");
            return;
        }

        setAdjusting(true);
        try {
            const res = await fetch("/api/admin/wallet/adjust", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: selectedUser.userId,
                    amount: parseFloat(adjustAmount),
                    type: adjustType,
                    description: adjustDescription,
                }),
            });

            const data = await res.json();
            if (data.success) {
                alert("Wallet adjusted successfully!");
                setAdjustAmount("");
                setAdjustDescription("");
                setSelectedUser(null);
                fetchUsers();
                fetchTransactions();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to adjust wallet");
        } finally {
            setAdjusting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* TOTAL SYSTEM BALANCE STAT */}
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm flex items-center justify-between group hover:border-[var(--accent)] transition-all">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Total System Liability</p>
                    <h2 className="text-3xl font-black text-[var(--accent)] tabular-nums">₹{totalWalletCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
                </div>
                <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform">
                    <FiActivity size={24} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* LEFT: USER WALLET MANAGEMENT */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <FiUser className="text-[var(--accent)]" />
                            User Wallets
                        </h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search user..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                                className="pl-9 pr-4 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:ring-1 focus:ring-[var(--accent)] outline-none"
                            />
                            <FiSearch className="absolute left-3 top-2.5 text-[var(--muted)]" />
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--background)]/50">
                        {loading ? (
                            <div className="p-10 text-center animate-pulse text-[var(--muted)]">Loading users...</div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="sticky top-0 bg-[var(--card)] border-b border-[var(--border)] z-10">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">User</th>
                                        <th className="px-4 py-3 font-semibold text-right">Balance</th>
                                        <th className="px-4 py-3 font-semibold text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {users.map(user => (
                                        <tr key={user._id} className="hover:bg-[var(--accent)]/5 transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-medium">{user.name || "N/A"}</p>
                                                <p className="text-xs text-[var(--muted)]">{user.email || user.phone}</p>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="font-bold text-[var(--accent)]">₹{user.wallet?.toFixed(2) || "0.00"}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="px-3 py-1 bg-[var(--accent)] text-white text-xs rounded-md shadow-sm hover:brightness-110"
                                                >
                                                    Manage
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr><td colSpan="3" className="p-10 text-center text-[var(--muted)]">No users found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white disabled:opacity-20 transition-all"
                            >
                                <FiChevronLeft />
                            </button>
                            <span className="text-xs font-bold text-[var(--muted)]">
                                {page} / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white disabled:opacity-20 transition-all"
                            >
                                <FiChevronRight />
                            </button>
                        </div>
                    )}
                </div>

                {/* RIGHT: ADJUSTMENT FORM OR RECENT ACTIVITY */}
                <div className="space-y-6">
                    {selectedUser ? (
                        <div className="p-6 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 space-y-5 animate-in slide-in-from-right duration-300">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold">Adjust Wallet</h3>
                                <button onClick={() => setSelectedUser(null)} className="text-xs text-[var(--muted)] hover:text-red-500">Cancel</button>
                            </div>

                            <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-bold">
                                    {selectedUser.name?.charAt(0).toUpperCase() || "?"}
                                </div>
                                <div>
                                    <p className="font-bold">{selectedUser.name}</p>
                                    <p className="text-xs text-[var(--muted)]">Current: ₹{selectedUser.wallet?.toFixed(2) || "0.00"}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-2 p-1 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                                    <button
                                        onClick={() => setAdjustType("add")}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-all ${adjustType === 'add' ? 'bg-green-500 text-white shadow-md' : 'text-[var(--muted)]'}`}
                                    >
                                        <FiPlus /> Add Credits
                                    </button>
                                    <button
                                        onClick={() => setAdjustType("remove")}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-all ${adjustType === 'remove' ? 'bg-red-500 text-white shadow-md' : 'text-[var(--muted)]'}`}
                                    >
                                        <FiMinus /> Remove Credits
                                    </button>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-[var(--muted)] uppercase">Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={adjustAmount}
                                        onChange={(e) => setAdjustAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        className="w-full mt-1 p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-[var(--muted)] uppercase">Description (Optional)</label>
                                    <input
                                        type="text"
                                        value={adjustDescription}
                                        onChange={(e) => setAdjustDescription(e.target.value)}
                                        placeholder="e.g. Refund for Order #123"
                                        className="w-full mt-1 p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
                                    />
                                </div>

                                <button
                                    onClick={handleAdjustWallet}
                                    disabled={adjusting}
                                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${adjustType === 'add' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'} disabled:opacity-50`}
                                >
                                    {adjusting ? "Processing..." : `Confirm ${adjustType.toUpperCase()}`}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col justify-center items-center p-10 border-2 border-dashed border-[var(--border)] rounded-2xl text-[var(--muted)]">
                            <FiActivity className="text-4xl mb-4 opacity-20" />
                            <p>Select a user to manage their wallet balance</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RECENT WALLET TRANSACTIONS */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <FiClock className="text-orange-500" />
                    Global Wallet Activity
                </h3>

                <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[var(--background)] border-b border-[var(--border)]">
                            <tr>
                                <th className="px-6 py-4 font-semibold">TID</th>
                                <th className="px-6 py-4 font-semibold">User ID</th>
                                <th className="px-6 py-4 font-semibold">Type</th>
                                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                                <th className="px-6 py-4 font-semibold text-right">Balance After</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Description</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {transactions.map(tx => (
                                <tr key={tx._id} className="hover:bg-[var(--background)]/30">
                                    <td className="px-6 py-4 font-mono text-xs">{tx.transactionId}</td>
                                    <td className="px-6 py-4 text-xs">{tx.userId}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${tx.type === 'deposit' || tx.type === 'admin_add' || tx.type === 'refund' ? 'bg-green-500/10 text-green-500' :
                                            tx.type === 'payment' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${tx.type === 'deposit' || tx.type === 'admin_add' ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                        {tx.type === 'deposit' || tx.type === 'admin_add' ? '+' : '-'}₹{tx.amount}
                                    </td>
                                    <td className="px-6 py-4 text-right">₹{tx.balanceAfter?.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${tx.status === 'success' ? 'bg-green-500/10 text-green-500' :
                                            tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-[var(--muted)] truncate max-w-[150px]">{tx.description}</td>
                                    <td className="px-6 py-4 text-xs">{new Date(tx.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-wrap items-center justify-center gap-1.5 min-w-[120px]">
                                            {/* GATEWAY VERIFY (PENDING DEPOSITS ONLY) */}
                                            {tx.status === "pending" && tx.type === "deposit" && (
                                                <button
                                                    onClick={async () => {
                                                        if (!confirm("Check gateway for this payment?")) return;
                                                        try {
                                                            const res = await fetch("/api/admin/wallet/verify", {
                                                                method: "POST",
                                                                headers: {
                                                                    "Content-Type": "application/json",
                                                                    Authorization: `Bearer ${token}`
                                                                },
                                                                body: JSON.stringify({ orderId: tx.transactionId })
                                                            });
                                                            const data = await res.json();
                                                            alert(data.message);
                                                            fetchTransactions();
                                                            fetchUsers();
                                                        } catch (err) {
                                                            alert("Verification failed");
                                                        }
                                                    }}
                                                    className="px-2 py-1 bg-[var(--accent)] text-black text-[9px] font-bold rounded hover:brightness-110"
                                                    title="Gateway Verify"
                                                >
                                                    Verify
                                                </button>
                                            )}

                                            {/* MANUAL SUCCESS (ANY NON-SUCCESS) */}
                                            {tx.status !== "success" && (
                                                <button
                                                    onClick={async () => {
                                                        if (!confirm("Manually mark this as SUCCESS? (Overwrites gateway check and credits user)")) return;
                                                        try {
                                                            const res = await fetch("/api/admin/wallet/mark-success", {
                                                                method: "POST",
                                                                headers: {
                                                                    "Content-Type": "application/json",
                                                                    Authorization: `Bearer ${token}`
                                                                },
                                                                body: JSON.stringify({ orderId: tx.transactionId })
                                                            });
                                                            const data = await res.json();
                                                            alert(data.message);
                                                            fetchTransactions();
                                                            fetchUsers();
                                                        } catch (err) {
                                                            alert("Failed to mark success");
                                                        }
                                                    }}
                                                    className="px-2 py-1 bg-green-600 text-white text-[9px] font-bold rounded hover:bg-green-500"
                                                    title="Manual Success"
                                                >
                                                    M-Success
                                                </button>
                                            )}

                                            {/* MARK FAILED (ALWAYS SHOW) */}
                                            <button
                                                onClick={async () => {
                                                    const msg = tx.status === "success"
                                                        ? "CAUTION: This transaction is already SUCCESS. Marking as failed will DEDUCT the amount from the user's wallet to revert it. Continue?"
                                                        : "Mark this transaction as failed?";
                                                    if (!confirm(msg)) return;
                                                    try {
                                                        const res = await fetch("/api/admin/wallet/mark-failed", {
                                                            method: "POST",
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                                Authorization: `Bearer ${token}`
                                                            },
                                                            body: JSON.stringify({ orderId: tx.transactionId })
                                                        });
                                                        const data = await res.json();
                                                        alert(data.message);
                                                        fetchTransactions();
                                                        fetchUsers();
                                                    } catch (err) {
                                                        alert("Failed to update transaction");
                                                    }
                                                }}
                                                className="px-2 py-1 bg-red-600 text-white text-[9px] font-bold rounded hover:bg-red-500"
                                                title="Mark Failed"
                                            >
                                                Fail
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr><td colSpan="9" className="p-10 text-center text-[var(--muted)]">No transactions found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
