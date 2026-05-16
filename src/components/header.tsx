import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { AuthActions } from '@/components/auth/clerk-auth'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ModeToggle } from './mode-toggle'
import { Logo } from './shared/logo'

const navLinks = [
	{ label: 'Templates', to: '/form-templates' },
	{ label: 'Builder', to: '/form-builder' },
	{ label: 'IA', to: '/ai-form-generator' },
	{ label: 'Mes formulaires', to: '/my-forms' },
] as const

export function Header() {
	return (
		<header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
			<div className="mx-auto flex h-14 w-full max-w-[88rem] items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link to="/" className="shrink-0">
					<Logo />
				</Link>

				<nav className="hidden items-center gap-1 md:flex">
					{navLinks.map((link) => (
						<Button key={link.to} variant="ghost" size="sm" asChild>
							<Link to={link.to}>{link.label}</Link>
						</Button>
					))}
				</nav>

				<div className="hidden items-center gap-2 md:flex">
					<ModeToggle />
					<AuthActions compact />
					<Button size="sm" asChild className="rounded-none font-semibold">
						<Link to="/ai-form-generator">Creer</Link>
					</Button>
				</div>

				<div className="flex items-center gap-2 md:hidden">
					<ModeToggle />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="rounded-none">
								<Menu className="size-5" />
								<span className="sr-only">Ouvrir le menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-64 p-2">
							{navLinks.map((link) => (
								<DropdownMenuItem key={link.to} asChild>
									<Link to={link.to} className="w-full">
										{link.label}
									</Link>
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
							<DropdownMenuItem onSelect={(event) => event.preventDefault()}>
								<div className="w-full py-1">
									<AuthActions compact />
								</div>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link to="/ai-form-generator" className="w-full font-medium">
									Creer avec l'IA
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	)
}
