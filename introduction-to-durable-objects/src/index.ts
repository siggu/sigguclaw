import { DurableObject } from 'cloudflare:workers';

export class DurablePractice extends DurableObject<Env> {
	count = 0;

	increase() {
		this.count++;
		return `count is ${this.count}`;
	}
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { pathname } = new URL(request.url);

		if (pathname === '/') {
			const dp = env.DurablePractice.getByName('default');
			return new Response(await dp.increase());
		}
		return new Response(null, {
			status: 404,
		});
	},
} satisfies ExportedHandler<Env>;
