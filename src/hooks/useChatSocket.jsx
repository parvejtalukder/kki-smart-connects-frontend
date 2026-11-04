"use client"

import { auth } from '@/config/config.firebase';
import { onIdTokenChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useChatSocket = () => {

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        
        let gtion = 0;
        let disposed = false;
        let activeSocket = null;   
        
        const unsubscribe = onIdTokenChanged(auth,
            async(firebaseUser) => {
                
                let currGtion = ++gtion;
                activeSocket?.disconnect();
                activeSocket = null;
                setSocket(null);

                if (!firebaseUser) return;

                try {
                    const token = await firebaseUser?.getIdToken();
                    if (disposed || currGtion !== gtion) {
                        return;
                    }

                    const newSocket = io(
                        process.env.NEXT_PUBLIC_SOCKET_URL,
                        {
                            autoConnect: false,
                            auth: { token },
                        }
                    );

                    newSocket.on("connect", () => {
                        console.log("Socket Connected: ", newSocket.id);
                    })
                    newSocket.on("connect_error", (error) => {
                        console.log("Socket connection failed:", newSocket.id);
                    })

                    activeSocket = newSocket;
                    setSocket(newSocket);
                    newSocket.connect();

                } catch (error) {
                    console.log("Socket initialization failed: ", error.message);
                }
            }
        );

        return () => {
            disposed = true;
            gtion++;
            unsubscribe();
            activeSocket?.disconnect();
        }

    }, [])

    return socket;
};

export default useChatSocket;