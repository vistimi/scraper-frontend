module.exports = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/pending',
                permanent: true,
            },
        ]
    },
}