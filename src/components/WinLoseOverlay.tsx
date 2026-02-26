"use client";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

interface WinLoseOverlayProps {
  status: "won" | "lost";
  cumulativeProfit: number;
  onReset: () => void;
}

export function WinLoseOverlay({
  status,
  cumulativeProfit,
  onReset,
}: WinLoseOverlayProps) {
  const isWon = status === "won";

  return (
    <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-6">
      <div className="flex flex-col items-center text-center">
        <h2
          className={`text-2xl font-bold ${
            isWon ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {isWon ? "Congratulations — You Won!" : "Game Over"}
        </h2>
        <p className="mt-2 text-slate-600">
          {isWon
            ? `You reached Year 10 with positive cash. Cumulative profit: ${formatCurrency(cumulativeProfit)}`
            : "Your cash reached zero. Better luck next time!"}
        </p>
        <button
          onClick={onReset}
          className="mt-4 rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700"
        >
          Start New Game
        </button>
      </div>
    </div>
  );
}
