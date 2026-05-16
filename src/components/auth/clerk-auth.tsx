import {
	ClerkProvider,
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from '@clerk/clerk-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
	| string
	| undefined

const ClerkReadyContext = React.createContext(false)

export function KamformsAuthProvider({
	children,
}: {
	children: React.ReactNode
}) {
	if (!publishableKey) {
		return (
			<ClerkReadyContext.Provider value={false}>
				{children}
			</ClerkReadyContext.Provider>
		)
	}

	return (
		<ClerkProvider
			publishableKey={publishableKey}
			afterSignOutUrl="/"
			signInFallbackRedirectUrl="/my-forms"
			signUpFallbackRedirectUrl="/ai-form-generator"
		>
			<ClerkReadyContext.Provider value>{children}</ClerkReadyContext.Provider>
		</ClerkProvider>
	)
}

export function AuthActions({ compact = false }: { compact?: boolean }) {
	const clerkReady = React.useContext(ClerkReadyContext)

	if (!clerkReady) {
		return (
			<Button
				size={compact ? 'sm' : 'default'}
				variant="secondary"
				className="rounded-none font-semibold"
				disabled
			>
				Auth
			</Button>
		)
	}

	return (
		<div className="flex items-center gap-2">
			<SignedOut>
				<SignInButton mode="modal">
					<Button size={compact ? 'sm' : 'default'} variant="ghost">
						Connexion
					</Button>
				</SignInButton>
				<SignUpButton mode="modal">
					<Button
						size={compact ? 'sm' : 'default'}
						className="rounded-none font-semibold"
					>
						Inscription
					</Button>
				</SignUpButton>
			</SignedOut>
			<SignedIn>
				<UserButton
					afterSignOutUrl="/"
					appearance={{
						elements: {
							userButtonAvatarBox: 'size-8 rounded-none',
						},
					}}
				/>
			</SignedIn>
		</div>
	)
}
