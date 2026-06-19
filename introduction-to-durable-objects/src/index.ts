import { DurableObject } from 'cloudflare:workers';

export class DurablePractice extends DurableObject<Env> {}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		return new Response('Hello World!');
	},
} satisfies ExportedHandler<Env>;
