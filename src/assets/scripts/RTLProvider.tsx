import { ReactNode } from 'react';

interface RTLProviderProps {
    children: ReactNode;
}

export function RTLProvider({ children }: RTLProviderProps) {
    return (
        <div dir="rtl" className="h-full w-full">
            {children}
        </div>
    );
}