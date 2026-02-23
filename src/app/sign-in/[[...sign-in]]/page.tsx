import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <img src="/logo-white.png" alt="Kaos Kami" className="h-10 w-auto" />
                        <span className="text-2xl font-black tracking-tight uppercase">
                            KAOS<span className="text-[#00d4ff]">KAMI</span>
                        </span>
                    </div>
                    <p className="text-sm text-white/40">ログイン · 로그인</p>
                </div>
                <SignIn
                    afterSignInUrl="/"
                    appearance={{
                        variables: {
                            colorBackground: '#1a1a24',
                        },
                        elements: {
                            rootBox: 'w-full',
                            card: 'w-full !bg-[#1a1a24] border border-white/10 shadow-2xl',
                            socialButtonsBlockButtonText: '!text-white',
                        }
                    }}
                />
            </div>
        </div>
    );
}
