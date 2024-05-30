import http from 'http';

import app from './app';
import config from '@application/Config/config';

const port: number = config.PORT | 8080;

const server: http.Server = app.listen(port, () => {
    console.log(`Server listening on ${port} `);
});

server.on('error', (err) => {
    console.error(`Server failed to start: ${err.message}`);
    process.exit();
});

const unexpectedErrorHandler = (error: Error) => {
    console.log('unexpectedErrorHandler', error);
    // exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
    console.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
