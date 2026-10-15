"use client"

import Loader from '@/components/Loader';
import useAuth from '@/hooks/useAuth';
import React from 'react';

const Chat = () => {

    const { loading, user } = useAuth();
    const language = user.dbUser.language;

    if (loading) {
        return <Loader></Loader>
    }

    if (language == "") {
        
    }

    return (
        <div>
        </div>
    );
};

export default Chat;