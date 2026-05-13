export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#2a2a2e] border-t-amber-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-[#8b8b8b] text-sm animate-pulse">Loading...</p>
    </div>
  );
}
