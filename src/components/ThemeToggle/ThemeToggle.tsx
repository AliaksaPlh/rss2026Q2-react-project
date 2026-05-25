import { useTheme } from '../../Context/useTheme';
import imgDay from '../../assets/dayIcon.svg';
import imgNight from '../../assets/nightIcon.svg';
import { LIGHT, DARK } from '../../consts';

const mapThemeToImage = {
  [LIGHT]: imgDay,
  [DARK]: imgNight,
};

const ToggleThemeButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const icon = mapThemeToImage[theme];
  const nextTheme = theme === DARK ? LIGHT : DARK;

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextTheme} theme`}
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-all duration-200 ${
        theme === DARK
          ? 'border-slate-700 bg-slate-950/70 text-slate-100 hover:border-slate-500 hover:bg-slate-800'
          : 'border-amber-200 bg-white text-slate-800 shadow-sm hover:border-amber-300 hover:bg-amber-50'
      }`}
    >
      <img
        src={icon}
        alt=""
        aria-hidden
        className="h-5 w-5"
      />
      <span className="capitalize">{theme}</span>
    </button>
  );
};
export default ToggleThemeButton;
