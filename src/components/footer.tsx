import { Link } from '@tanstack/react-router'
import { urls } from '@/constants/urls'
import { Logo } from './shared/logo'

const productLinks = [
	{ name: 'Creation IA', to: '/ai-form-generator' },
	{ name: 'Templates', to: '/form-templates' },
	{ name: 'Builder', to: '/form-builder' },
	{ name: 'Mes formulaires', to: '/my-forms' },
] as const

export function Footer() {
	return (
		<footer className="border-t">
			<div className="mx-auto grid w-full max-w-[88rem] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_.7fr_.7fr] lg:px-8">
				<div className="max-w-md">
					<Link to="/" className="inline-flex">
						<Logo />
					</Link>
					<p className="mt-4 text-sm leading-6 text-muted-foreground">
						Kamforms aide les equipes a creer, publier et suivre des formulaires
						avec IA, notifications et exports.
					</p>
				</div>
				<div>
					<h2 className="text-sm font-semibold">Produit</h2>
					<ul className="mt-4 space-y-2 text-sm">
						{productLinks.map((link) => (
							<li key={link.to}>
								<Link
									to={link.to}
									className="text-muted-foreground transition hover:text-foreground"
								>
									{link.name}
								</Link>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h2 className="text-sm font-semibold">Projet</h2>
					<ul className="mt-4 space-y-2 text-sm">
						<li>
							<a
								href={urls.github}
								className="text-muted-foreground transition hover:text-foreground"
							>
								GitHub
							</a>
						</li>
						<li>
							<a
								href="https://kamtech.online"
								className="text-muted-foreground transition hover:text-foreground"
							>
								Kamtech
							</a>
						</li>
					</ul>
				</div>
				<div className="border-t border-dashed pt-5 text-xs text-muted-foreground md:col-span-3">
					&copy; {new Date().getFullYear()} Kamforms. Tous droits reserves.
				</div>
			</div>
		</footer>
	)
}
