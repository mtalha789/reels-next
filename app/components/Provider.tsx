import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./Notification";
import { ImageKitProvider } from "imagekitio-next";
import { ReactNode } from "react";

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const URLEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

export default function Provider({ children } : { children : ReactNode}) {
const authenticator = async () => {
  try {
    const response = await fetch("/api/imagekit-auth", );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    console.log("ImageKit authentication error:", error);
    throw error
  }
};
  return (
    <SessionProvider refetchInterval={5*60}>
        <NotificationProvider>
            <ImageKitProvider publicKey={publicKey} urlEndpoint={URLEndpoint} authenticator={authenticator} >
                {children}
            </ImageKitProvider>
        </NotificationProvider>
    </SessionProvider>
  )
}
