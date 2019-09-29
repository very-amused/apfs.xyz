['MIGADU_PASS'].forEach(envVar => {
    if (!process.env[envVar]) {
        // eslint-disable-next-line no-console
        console.error(`The environment variable ${envVar} isn't set and needs to be.`);
        process.exit(1);
    }
});