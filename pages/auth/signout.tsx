import Footer from '@components/next-auth/footer';
import { signOut, useSession } from 'next-auth/react';

export default function SignIn() {
    const { data: session } = useSession()

    return (
        <>
            {session && (
                <>
                    <p>
                        Signed in as {session.user.name}
                        <br />
                    </p>
                    <button onClick={() => signOut(
                        { callbackUrl: 'http://localhost:3000/auth/session' },
                    )}>
                        Sign out
                    </button>
                </>
            )}
            <Footer />
        </>
    );
}