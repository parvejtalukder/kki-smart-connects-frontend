import React from 'react';

export const metadata = {
  title: "Register | KKI Smart Connects",
  description:
    "Kavya Kishor International (KKI) is a global creative and cultural organization connecting writers, poets, creators, and communities through literature, publications, collaboration, and cultural initiatives.",
};


const layout = ({children}) => {
    return (
        <div className="min-h-full flex flex-col">
              {children}
        </div>
    );
};

export default layout;
