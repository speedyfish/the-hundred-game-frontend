import { useRouter } from "next/navigation";

type Props = {
  card: {
    title: string;
    description: string;
    href: string;
    accent: string;
  };
  onClick: () => void;
};

const HomeCard = ({ card, onClick }: Props) => {
  const router = useRouter();
  return (
    <button
      key={card.title}
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left transition hover:border-slate-600 hover:bg-slate-900"
    >
      <div
        className={`pointer-events-none absolute inset-x-0 -top-10 h-20 bg-gradient-to-r ${card.accent} opacity-0 blur-2xl transition group-hover:opacity-40`}
      />
      <h2 className="relative text-lg font-medium">{card.title}</h2>
      <p className="relative mt-1 text-sm text-slate-300">{card.description}</p>
    </button>
  );
};

export default HomeCard;
