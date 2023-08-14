import { buildServer } from "./utils/server";
import { env } from "./config/env";
import { logger } from "./utils/logger";

async function gracefulShutdown({
    app
}:
{
    app: Awaited<ReturnType<typeof buildServer>>
}) {
    await app.close()
}
async function main() {
    const app = await buildServer()

    app.listen({
        port: env.PORT,
        host: env.HOST,
    })

    const signals = ['SIGINT', 'SIGTERM']

    logger.debug(env, "Database connection IS working")

    for (const signal of signals){
        process.on(signal, () => {
            gracefulShutdown({
                app,
            })
        })
    }
}

main();
