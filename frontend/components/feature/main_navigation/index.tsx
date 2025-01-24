import logo from "@assets/logo/header.svg";
import logoDark from "@assets/logo/header-dark.svg";

interface IProps {
  languages?: string[];
  userName: string;
  onLogout(): void;
}

export function MainNav({ languages = [], userName, onLogout }: IProps) {
  return (
    <header className="h-15 bg-gray-800 text-white flex items-center justify-between px-4">
      <div className="flex space-x-3 items-center">
        <img src={logo} alt="Logo" className="h-8 w-auto dark:hidden" />
        <img
          src={logoDark}
          alt="Logo"
          className="h-8 w-auto hidden dark:block"
        />

        {/* <img src={logo} alt="Logo" className="h-8 w-auto" /> */}
        <div className="text-lg font-bold">My App</div>
        <nav>
          <a href="#" className="px-4 py-2 hover:bg-gray-700">
            Dashboard
          </a>
          <a href="#" className="px-4 py-2 hover:bg-gray-700">
            Variant
          </a>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        {languages.length > 0 && (
          <select className="text-white py-2 px-4">
            {languages.map((lang) => (
              <option key={lang}>{lang}</option>
            ))}
          </select>
        )}

        <div className="relative">
          <button className="py-2 px-3">{userName}</button>
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow hidden group-hover:block">
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">
              Profile
            </a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">
              Settings
            </a>
          </div>
        </div>

        <button className="text-white py-2 px-3 " onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
