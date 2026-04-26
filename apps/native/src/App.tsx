import { BrowserRouter, useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { RoutingProvider } from "@repo/ui/components/RoutingContext";
import { Navbar } from "@repo/ui/components/navbar";

function AppContent() {
    const navigate = useNavigate();
    const location = useLocation();

    const reactRouting = {
    Link: ({ href, children, ...props }: any) => <RouterLink to={href} {...props}>{children}</RouterLink>,
    useNavigate: () => navigate,
    usePathname: () => location.pathname,
  };

  return (
    <RoutingProvider value={reactRouting}>
      <Navbar />


    </RoutingProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}