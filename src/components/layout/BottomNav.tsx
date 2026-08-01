import { NavLink } from "react-router-dom";
import { Home, Users, Compass, Route, Settings } from "lucide-react";
import { cn } from "@/lib/tw";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/people", icon: Users, label: "People" },
  { to: "/discover", icon: Compass, label: "Discover" },
  { to: "/journey", icon: Route, label: "Journey" },
  { to: "/more", icon: Settings, label: "More" },
];

export function BottomNav() {
  return (
    <nav className="nav-glass fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-auto grid max-w-[var(--page-width)] grid-cols-5 items-center safe-bottom px-2" style={{ height: "var(--nav-height)" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className="relative flex flex-col items-center gap-1.5 py-2"
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 1.5 : 1.6}
                    fill={isActive ? "currentColor" : "none"}
                    className={cn(
                      "transition-colors duration-300",
                      isActive ? "text-text" : "text-text-muted"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium tracking-[0.12em] uppercase transition-colors duration-300",
                      isActive ? "text-text" : "text-text-muted"
                    )}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute top-0 h-[2px] w-6 rounded-full bg-green" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}