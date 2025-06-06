import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-200 to-pink-100 backdrop-blur-xl overflow-hidden">
      {/* Rotating Loader Icon */}
      <div className="z-10 flex flex-col items-center space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-800 animate-spin" />

        <h1 className="text-xl font-semibold text-indigo-900">
          Please wait...
        </h1>
      </div>

      {/* Sparkling Background Dots */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-indigo-500 rounded-full animate-pulse-custom"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;
