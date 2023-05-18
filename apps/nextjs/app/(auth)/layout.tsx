import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex h-full w-full justify-center items-center'>
            {children}
        </div>
    );
};
