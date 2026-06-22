import { DurableObject } from 'cloudflare:workers';

export class DurablePractice extends DurableObject<Env> {
	fetch(request: Request) {
		return new Response(`Hello`);
	}
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { pathname, searchParams } = new URL(request.url);
		const roomId = searchParams.get('roomId') ?? 'public';
		const upgrade = request.headers.get('Upgrade');
		if (upgrade) {
			const dp = env.DurablePractice.getByName(roomId);
			return dp.fetch(request);
		}
		return new Response(null, {
			status: 404,
		});
	},
} satisfies ExportedHandler<Env>;
