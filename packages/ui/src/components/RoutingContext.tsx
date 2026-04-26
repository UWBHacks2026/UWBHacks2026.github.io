import React, { Children, createContext, useContext } from "react";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
}

export interface RoutingContextType {
    Link: React.ComponentType<LinkProps>;
    useNavigate: () => (path: string) => void;
    usePathname: () => string;
}

// Basic HTML behavior fallback
const defaultContext: RoutingContextType = {
    Link: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>,
    useNavigate: () => (path: string) => { window.location.href = path; },
    usePathname: () => window.location.pathname,
};

export const RoutingContext = createContext<RoutingContextType>(defaultContext);

export const useRouting = () => useContext(RoutingContext);

export const RoutingProvider = ({
    value,
    children
}: {
    value: RoutingContextType;
    children: React.ReactNode;
}) => {
    return <RoutingContext.Provider value={value}>{children}</RoutingContext.Provider>;
}
