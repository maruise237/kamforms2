'use client'

import { Bell, Mail, MessageCircle } from 'lucide-react'

const notificationItems = [
	{ label: 'Email', detail: 'Alertes proprietaire', icon: Mail },
	{ label: 'WhatsApp', detail: 'Suivi commercial', icon: MessageCircle },
	{ label: 'Webhook', detail: 'Automatisation', icon: Bell },
] as const

export function SponsorBanner() {
	return (
		<div className="w-full overflow-hidden border-b bg-background">
			<div className="mx-auto grid h-auto min-h-14 max-w-6xl grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
				{notificationItems.map(({ label, detail, icon: Icon }) => (
					<div
						key={label}
						className="flex items-center justify-center gap-3 px-4 py-3"
					>
						<div className="flex size-8 items-center justify-center border bg-muted/40">
							<Icon className="size-4" />
						</div>
						<div className="min-w-0">
							<p className="text-sm font-semibold leading-tight">{label}</p>
							<p className="truncate text-xs text-muted-foreground">{detail}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
