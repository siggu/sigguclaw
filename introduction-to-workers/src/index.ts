let count = 0;

export default {
	async fetch(request, env, ctx): Promise<Response> {
		count = count + 1;
		return new Response(`Count is ${count}`);
	},
} satisfies ExportedHandler<Env>;
