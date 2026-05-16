import { createFileRoute } from '@tanstack/react-router'
import { MyForms } from '@/form-builder/components/my-forms'
import { templates } from '@/form-builder/constant/templates'

export const Route = createFileRoute("/my-forms/$formTemplate")({
	component: MyFormsRouteComponent,
	head: ({ params }) => {
		const template = templates.find((t) => t.id === params.formTemplate)
		const title = template?.title ?? 'Form Template'
		return {
			meta: [{ title: `${title} | Kamforms` }],
		}
	},
})

function MyFormsRouteComponent() {
	return <MyForms />
}
