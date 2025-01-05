interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
}

export function HamburgerMenu({ isOpen, onClick }: HamburgerMenuProps) {
  return (
    <button
      className="relative w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 md:hidden focus:outline-none group"
      onClick={onClick}
      aria-label="Toggle Menu"
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5">
        <span
          className={`absolute top-0.5 block h-0.5 w-5 rounded-full bg-current transform transition-all duration-300 ease-in-out ${
            isOpen ? "rotate-45 translate-y-1" : ""
          }`}
        />
        <span
          className={`absolute top-2 block h-0.5 w-5 rounded-full bg-current transform transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`absolute top-3.5 block h-0.5 w-5 rounded-full bg-current transform transition-all duration-300 ease-in-out ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </div>
    </button>
  );
}
