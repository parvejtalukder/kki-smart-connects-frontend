import AllowUserOnly from '@/lib/protection/AllowUserOnly';
import React from 'react';

export const metadata = {
  title: "Chats | KKI Smart Connects",
  description:
    "Kavya Kishor International (KKI) is a global creative and cultural organization connecting writers, poets, creators, and communities through literature, publications, collaboration, and cultural initiatives.",
};

const layout = ({ children }) => {

    return (
        <AllowUserOnly>
        {children}
        </AllowUserOnly>
    );
};

export default layout;