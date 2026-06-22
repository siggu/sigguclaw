import { DurableObject } from 'cloudflare:workers';

export class DurablePractice extends DurableObject<Env> {
	sql: SqlStorage;
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);

		this.sql = ctx.storage.sql;

		ctx.storage.sql.exec(`
			CREATE TABLE IF NOT EXISTS counts (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				total INTEGER
			);
		`);

		ctx.storage.sql.exec(`
			INSERT OR IGNORE INTO counts (id, total) VALUES (1, 0);
		`);
	}

	async increase() {
		const { total } = this.sql.exec(`UPDATE counts SET total = total + 1 WHERE id = 1 RETURNING total;`).one() as { total: number };
		if (total >= 30) {
			const currentAlarm = await this.ctx.storage.getAlarm();
			console.log('alarm', currentAlarm);
			if (currentAlarm === null) {
				this.ctx.storage.setAlarm(Date.now() + 5_000);
			}
		}
		return `count is ${total}`;
	}

	alarm() {
		this.sql.exec(`UPDATE counts SET total = 0 WHERE id = 1`);
	}
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { pathname, searchParams } = new URL(request.url);
		const nickname = searchParams.get('nickname') || 'anonymous';
		if (pathname === '/') {
			const dp = env.DurablePractice.getByName(nickname);
			return new Response(await dp.increase());
		}
		return new Response(null, {
			status: 404,
		});
	},
} satisfies ExportedHandler<Env>;
