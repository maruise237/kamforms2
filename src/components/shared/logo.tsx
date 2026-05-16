export function Logo() {
	return (
		<div className="flex items-center gap-2" aria-label="Kamforms">
			<div className="flex size-8 items-center justify-center border border-foreground bg-foreground text-background">
				<span className="font-mono text-sm font-bold">K</span>
			</div>
			<div className="leading-none">
				<p className="text-sm font-black tracking-tight">Kamforms</p>
				<p className="mt-0.5 font-mono text-[10px] uppercase text-muted-foreground">
					V2
				</p>
			</div>
		</div>
	)
}
