
import AuthGuard from "@/components/AuthGuard";
export default function AdminPanalPage() {
  return (
    <AuthGuard>
    <section className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-6">
      <div className="text-center bg-[var(--card)] border border-[var(--border)] rounded-2xl p-10 shadow-lg max-w-lg w-full">
        
        <h1 className="text-3xl font-extrabold mb-4 text-[var(--accent)]">
          🎉 Congratulations!
        </h1>

        <p className="text-lg font-medium mb-6">
          You are the <span className="font-bold">Reseller</span> now 🚀
        </p>

        <div className="border-t border-[var(--border)] pt-6">
          <p className="text-[var(--muted)] text-base">
            More features coming soon...
          </p>
        </div>

      </div>
    </section>
    </AuthGuard>
  );
}
