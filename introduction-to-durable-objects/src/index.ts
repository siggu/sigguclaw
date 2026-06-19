import { DurableObject } from 'cloudflare:workers';

export class DurablePractice extends DurableObject<Env> {
	ping() {
		return 'pong';
	}
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const stub = env.DurablePractice.getByName('default');
		return new Response(await stub.ping());
	},
} satisfies ExportedHandler<Env>;
