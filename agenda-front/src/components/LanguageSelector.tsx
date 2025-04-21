import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";

const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

const Globe = () => <span role="img" aria-label="Langues" className="text-lg">🌐</span>;

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [selected, setSelected] = React.useState<string>(i18n.language || "fr");
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const stored = localStorage.getItem("agenda-lang");
    if (stored && stored !== i18n.language) {
      i18n.changeLanguage(stored);
      setSelected(stored);
    }
  }, [i18n]);

  // Fermer le menu si clic extérieur
  React.useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setSelected(lang);
    localStorage.setItem("agenda-lang", lang);
    setOpen(false);
  };

  // Accessibilité clavier : ouvrir menu avec Entrée/Espace, naviguer avec Tab, fermer avec Échap
  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      setOpen((v) => !v);
    }
  };

  // Responsive : sur mobile, n'afficher que le globe ou le drapeau
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <div className="relative inline-block text-left">
      <button
        ref={btnRef}
        className="flex items-center gap-1 px-1.5 py-1 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-agenda-light-purple/10 focus:ring-2 focus:ring-agenda-purple focus:outline-none text-xs font-medium transition min-w-[36px] max-h-9"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="lang-menu"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleButtonKeyDown}
        style={{lineHeight: 1.1}}
      >
        {/* Mobile: globe ou drapeau seul, Desktop: drapeau + texte */}
        <span className="sm:hidden">{Globe()}</span>
        <span className="hidden sm:inline text-base">{LANGUAGES.find(l => l.code === selected)?.flag}</span>
        <span className="hidden md:inline text-xs font-semibold ml-0.5">{LANGUAGES.find(l => l.code === selected)?.label}</span>
        <ChevronRight className={`ml-0.5 w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${open ? "rotate-90" : "rotate-0"}`} aria-hidden="true" />
      </button>
      <div
        ref={menuRef}
        id="lang-menu"
        role="menu"
        aria-label="Sélection de langue"
        className={`absolute right-0 z-20 mt-2 w-32 min-w-max bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
        style={{boxShadow: "0 2px 12px 0 rgba(80, 41, 255, 0.08)"}}
      >
        {LANGUAGES.map((lang, idx) => (
          <button
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs md:text-sm transition hover:bg-agenda-light-purple/10 hover:text-agenda-purple focus:bg-agenda-light-purple/20 focus:text-agenda-purple ${selected === lang.code ? "font-bold bg-agenda-light-purple/20 text-agenda-purple" : "text-gray-700"} ${idx === 0 ? "border-b border-gray-100" : ""}`}
            aria-selected={selected === lang.code}
            role="menuitem"
            tabIndex={open ? 0 : -1}
          >
            <span className="text-base">{lang.flag}</span>
            <span className="hidden md:inline text-xs font-medium">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
