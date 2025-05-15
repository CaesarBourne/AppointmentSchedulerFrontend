import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, Users } from "lucide-react";
import { ModeToggle } from "../mode-toggle";

export default function Navbar() {
  const navLinks = [
    {
      to: "/",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      to: "/appointments",
      label: "Appointments",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      to: "/participants",
      label: "Participants",
      icon: <Users className="h-4 w-4" />,
    },
  ];

  return (
    <nav className="border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary mr-8 flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              <span>Appointment Manager</span>
            </h1>

            <div className="hidden md:flex space-x-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }: { isActive: boolean }) =>
                    cn(
                      "px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-primary"
                    )
                  }
                  end
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t">
        <div className="flex justify-between px-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  "flex-1 py-3 text-center text-sm flex flex-col items-center justify-center gap-1",
                  isActive
                    ? "text-primary border-t-2 border-primary"
                    : "text-muted-foreground hover:text-primary"
                )
              }
              end
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
