import Footer from '@components/next-auth/footer';
import { signIn, useSession } from 'next-auth/react';

export default function SignIn() {
    const { data: session } = useSession()

    return (
        <>
            {!session && <>
                <button onClick={() => signIn(
                    'zitadel',
                    { callbackUrl: 'http://localhost:3000/auth/session' }
                )}>
                    Sign in
                </button>
            </>}
            <Footer />
        </>
    );
}