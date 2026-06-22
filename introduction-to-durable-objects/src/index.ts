import { DurableObject } from 'cloudflare:workers';

export class DurablePractice extends DurableObject<Env> {
	fetch(request: Request) {
		const url = new URL(request.url);
		const nickname = url.searchParams.get('nickname') ?? 'anonymous';
		const webSocketPair = new WebSocketPair();
		const [client, server] = Object.values(webSocketPair);

		this.ctx.acceptWebSocket(server);

		return new Response(null, { status: 101, webSocket: client });
	}

	webSocketMessage(ws: WebSocket, message: string) {
		console.log(message);
	}

	webSocketClose(ws: WebSocket) {
		console.log('WebSocket closed');
	}
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { pathname, searchParams } = new URL(request.url);
		if (pathname === '/ws') {
			const roomId = searchParams.get('roomId') ?? 'public';
			const upgrade = request.headers.get('Upgrade');
			if (upgrade) {
				const dp = env.DurablePractice.getByName(roomId);
				return dp.fetch(request);
			}
		}
		return new Response(null, {
			status: 404,
		});
	},
} satisfies ExportedHandler<Env>;
