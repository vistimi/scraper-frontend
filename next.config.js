module.exports = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/imagesPending',
                permanent: true,
            },
        ]
    },
    compiler: {
        // see https://styled-components.com/docs/tooling#babel-plugin for more info on the options.
        styledComponents: true,
      },
    images: {
        domains: ['localhost'],
    },
}