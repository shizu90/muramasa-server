import logger, { transport } from 'pino'
import dayjs from 'dayjs'

const log = logger({
    base: {
        pid: false,
    },
    timestamp: () => `,"time": "${dayjs().format()}"`,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})

export default log