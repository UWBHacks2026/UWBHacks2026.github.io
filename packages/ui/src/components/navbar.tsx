import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Menu, X, Search, ChevronDown } from "lucide-react"; // Recommended for icons

export function Navbar({ user, onLogout, searchQuery, onSearch, LinkComponent = "a" }: any) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-brand-dark border-b border-[#2A2118]">
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden text-brand-bg p-1"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <LinkComponent href="/" className="flex items-center gap-2.5 no-underline shrink-0">
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-serif text-lg text-brand-bg tracking-tight hidden sm:block">
              Skill Bridge
            </span>
          </LinkComponent>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-1">
          <LinkComponent href="/" className="px-3 py-1.5 text-sm font-medium text-text-light hover:text-brand-green transition-colors rounded-lg">Home</LinkComponent>
          <LinkComponent href="/jobs" className="px-3 py-1.5 text-sm font-medium text-text-light hover:text-brand-green transition-colors rounded-lg">Jobs</LinkComponent>
        </div>

        {/* Search Bar - Responsive */}
        <div className="flex-1 max-w-md hidden sm:flex items-center bg-[#2A2118] border border-[#3D3530] rounded-lg px-3 h-10 focus-within:border-brand-green/50">
          <Search size={16} className="text-text-muted shrink-0" />
          <Input
            placeholder="Search jobs, skills..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="flex-1 bg-transparent border-none text-brand-bg text-sm px-2 outline-none placeholder:text-text-light"
          />
        </div>

        {/* Auth Area */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-[#2A2118] border border-[#3D3530] rounded-lg px-3 py-1.5 text-brand-bg text-sm transition-colors hover:bg-[#32281e]"
              >
                <div className="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center text-xs font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block">{user.name?.split(" ")[0]}</span>
                <ChevronDown size={14} className="text-text-light hidden sm:block" />
              </button>

              {menuOpen && (
                <div className="absolute top-full mt-2 right-0 bg-brand-card border border-brand-border rounded-xl p-1.5 min-w-[180px] shadow-lg z-[100]">
                  <LinkComponent href="/profile" className="block px-3 py-2 text-sm text-text-main rounded-lg hover:bg-[#F5F0E8] transition-colors">
                    My Profile
                  </LinkComponent>
                  <button onClick={() => { onLogout(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-brand-orange rounded-lg hover:bg-[#F5F0E8] transition-colors">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <LinkComponent href="/login">
                <Button variant="ghost" className="hidden sm:flex text-text-light hover:text-brand-bg border border-[#3D3530]">Sign In</Button>
              </LinkComponent>
              <LinkComponent href="/login">
                <Button>Get Started</Button>
              </LinkComponent>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileNavOpen && (
        <div className="md:hidden bg-[#221A14] border-b border-[#2A2118] p-4 flex flex-col gap-4">
           <div className="flex items-center bg-[#2A2118] border border-[#3D3530] rounded-lg px-3 h-11">
            <Search size={18} className="text-text-muted shrink-0" />
            <input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="flex-1 bg-transparent border-none text-brand-bg text-base px-2 outline-none"
            />
          </div>
          <LinkComponent href="/" className="text-brand-bg text-lg font-medium p-2">Home</LinkComponent>
          <LinkComponent href="/jobs" className="text-brand-bg text-lg font-medium p-2">Jobs</LinkComponent>
        </div>
      )}
    </nav>
  );
}