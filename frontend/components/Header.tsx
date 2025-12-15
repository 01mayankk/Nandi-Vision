/* ========================================
   FILE: Header.tsx (Optional Component)
   ======================================== */

export default function Header() {
  return (
    <header className="border-b border-blue-400/30 bg-gradient-to-r from-blue-900 to-blue-700 shadow-2xl">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
          NandiVision
        </h1>
        <p className="text-sm md:text-base text-blue-100 mt-1 drop-shadow">
          AI-powered Cattle Type & Breed Identification
        </p>
      </div>
    </header>
  );
}