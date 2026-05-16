import { createFileRoute, Link } from '@tanstack/react-router'
import {
	ArrowRight,
	BarChart3,
	Bot,
	CheckCircle2,
	Download,
	FileText,
	Mail,
	MessageCircle,
	MousePointer2,
	ShieldCheck,
	Sparkles,
} from 'lucide-react'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({ component: App })

const steps = [
	{
		title: 'Decris le besoin',
		text: 'L’IA propose un formulaire multi-etapes avec champs, validations et message de fin.',
	},
	{
		title: 'Ajuste le formulaire',
		text: 'Ajoute des champs, change les couleurs, previsualise mobile et publie en quelques minutes.',
	},
	{
		title: 'Recois les reponses',
		text: 'Les soumissions arrivent dans le dashboard, par email ou WhatsApp, puis s’exportent en CSV.',
	},
]

const quickActions = [
	{
		title: 'Creation IA',
		text: 'Genere une premiere version exploitable a partir d’une phrase.',
		to: '/ai-form-generator',
		icon: Bot,
	},
	{
		title: 'Templates metiers',
		text: 'Recrutement, devis, inscription, satisfaction ou contact.',
		to: '/form-templates',
		icon: FileText,
	},
	{
		title: 'Mes formulaires',
		text: 'Reprends un brouillon, publie, duplique ou consulte les reponses.',
		to: '/my-forms',
		icon: BarChart3,
	},
]

const capabilities = [
	{ label: 'Champs avances', icon: MousePointer2 },
	{ label: 'Validation Zod', icon: ShieldCheck },
	{ label: 'Email', icon: Mail },
	{ label: 'WhatsApp', icon: MessageCircle },
	{ label: 'Export CSV', icon: Download },
]

const liveRows = [
	{ form: 'Demande de devis', status: 'Publie', answers: '128', channel: 'Email + WhatsApp' },
	{ form: 'Recrutement commercial', status: 'Brouillon', answers: '0', channel: 'Dashboard' },
	{ form: 'Satisfaction client', status: 'Publie', answers: '47', channel: 'CSV pret' },
]

function App() {
	return (
		<div className="min-h-[100dvh] bg-background text-foreground">
			<Header />
			<main className="mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-8">
				<section className="grid min-h-[calc(100dvh-5rem)] grid-cols-1 gap-8 py-10 md:grid-cols-[1.03fr_0.97fr] md:items-center md:py-16 lg:gap-14">
					<div className="max-w-3xl">
						<div className="mb-6 inline-flex items-center gap-2 border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
							<Sparkles className="size-3.5" />
							Kamforms V2 · IA, publication, reponses, export
						</div>
						<h1 className="text-balance text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl lg:text-7xl">
							Cree ton formulaire en quelques secondes avec l’IA.
						</h1>
						<p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
							Publie-le, recois les reponses dans ton dashboard, par email ou
							WhatsApp, puis exporte les donnees sans recoder un formulaire a
							chaque campagne.
						</p>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Button size="lg" asChild className="h-11 rounded-none font-semibold">
								<Link to="/ai-form-generator">
									Creer avec l’IA
									<ArrowRight className="size-4" />
								</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								asChild
								className="h-11 rounded-none font-semibold"
							>
								<Link to="/form-templates">Choisir un template</Link>
							</Button>
						</div>
						<div className="mt-8 grid grid-cols-2 gap-4 border-t border-dashed pt-6 sm:grid-cols-4">
							{[
								['13', 'champs P0'],
								['2 min', 'pour publier'],
								['24/7', 'collecte publique'],
								['CSV', 'export direct'],
							].map(([value, label]) => (
								<div key={label}>
									<p className="font-mono text-2xl font-semibold tabular-nums">
										{value}
									</p>
									<p className="mt-1 text-xs text-muted-foreground">{label}</p>
								</div>
							))}
						</div>
					</div>

					<div className="relative">
						<div className="absolute -inset-4 -z-10 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--foreground)_9%,transparent),transparent_35%),radial-gradient(circle_at_80%_70%,color-mix(in_oklab,var(--foreground)_7%,transparent),transparent_30%)]" />
						<div className="border border-border bg-card shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)]">
							<div className="flex items-center justify-between border-b border-border px-4 py-3">
								<div>
									<p className="text-sm font-semibold">Assistant formulaire</p>
									<p className="text-xs text-muted-foreground">
										Generation schema Kamforms V2
									</p>
								</div>
								<span className="bg-foreground px-2 py-1 text-[10px] font-medium text-background">
									LIVE
								</span>
							</div>
							<div className="grid gap-4 p-4 sm:p-5">
								<div className="border border-border bg-muted/35 p-4">
									<p className="text-xs text-muted-foreground">Prompt</p>
									<p className="mt-2 text-sm leading-6">
										Creer un formulaire de demande de devis pour une agence
										digitale avec budget, fichiers et contact WhatsApp.
									</p>
								</div>
								<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
									{[
										'Informations client',
										'Details du projet',
										'Budget et delai',
										'Fichiers joints',
									].map((item, index) => (
										<div
											key={item}
											className="flex items-center gap-3 border border-border bg-background p-3"
										>
											<span className="flex size-7 items-center justify-center bg-muted font-mono text-xs">
												{index + 1}
											</span>
											<span className="text-sm font-medium">{item}</span>
										</div>
									))}
								</div>
								<div className="overflow-hidden border border-border">
									<div className="grid grid-cols-[1.4fr_.7fr_.5fr] border-b border-border bg-muted/45 px-3 py-2 text-[11px] font-medium text-muted-foreground">
										<span>Formulaire</span>
										<span>Canal</span>
										<span className="text-right">Rep.</span>
									</div>
									{liveRows.map((row, index) => (
										<div
											key={row.form}
											className={cn(
												'grid grid-cols-[1.4fr_.7fr_.5fr] px-3 py-3 text-xs',
												index !== liveRows.length - 1 && 'border-b border-border',
											)}
										>
											<div>
												<p className="font-medium">{row.form}</p>
												<p className="text-muted-foreground">{row.status}</p>
											</div>
											<span className="text-muted-foreground">{row.channel}</span>
											<span className="text-right font-mono tabular-nums">
												{row.answers}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="border-t border-dashed py-10 md:py-14">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						{quickActions.map(({ title, text, to, icon: Icon }) => (
							<Link
								key={title}
								to={to}
								className="group border border-border bg-card p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-muted/40 active:translate-y-0"
							>
								<div className="flex items-start justify-between gap-4">
									<Icon className="size-5 text-muted-foreground transition group-hover:text-foreground" />
									<ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
								</div>
								<h2 className="mt-7 text-lg font-semibold">{title}</h2>
								<p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
							</Link>
						))}
					</div>
				</section>

				<section className="grid grid-cols-1 gap-8 border-t border-dashed py-10 md:grid-cols-[.8fr_1.2fr] md:py-14">
					<div>
						<p className="text-sm font-medium text-muted-foreground">
							Prise en main
						</p>
						<h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
							Une logique simple pour les PME, agences et services locaux.
						</h2>
					</div>
					<div className="grid gap-3">
						{steps.map((step, index) => (
							<div
								key={step.title}
								className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-border py-5 first:border-t-0"
							>
								<span className="font-mono text-sm text-muted-foreground">
									0{index + 1}
								</span>
								<div>
									<h3 className="font-semibold">{step.title}</h3>
									<p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
										{step.text}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="border-t border-dashed py-10 md:py-14">
					<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Fondations V2
							</p>
							<h2 className="mt-3 text-3xl font-bold tracking-tight">
								Le moteur est pret pour le dashboard.
							</h2>
						</div>
						<Button asChild variant="outline" className="rounded-none">
							<Link to="/form-builder" search={{ id: undefined }}>
								Ouvrir le builder
							</Link>
						</Button>
					</div>
					<div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-5">
						{capabilities.map(({ label, icon: Icon }) => (
							<div
								key={label}
								className="flex min-h-28 flex-col justify-between border border-border bg-muted/25 p-4"
							>
								<Icon className="size-5 text-muted-foreground" />
								<p className="text-sm font-medium">{label}</p>
							</div>
						))}
					</div>
				</section>

				<section className="border-t border-dashed py-10 md:py-16">
					<div className="grid gap-6 border border-border bg-foreground p-6 text-background md:grid-cols-[1fr_auto] md:items-center md:p-8">
						<div>
							<h2 className="text-2xl font-bold tracking-tight md:text-3xl">
								Lance un formulaire test maintenant.
							</h2>
							<p className="mt-2 max-w-2xl text-sm leading-6 text-background/70">
								La V2 garde une base TanStack rapide, mais le produit cible reste
								Kamforms: publication, collecte, notifications et export.
							</p>
						</div>
						<Button
							asChild
							variant="secondary"
							className="h-11 rounded-none font-semibold"
						>
							<Link to="/ai-form-generator">
								Commencer
								<CheckCircle2 className="size-4" />
							</Link>
						</Button>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	)
}
