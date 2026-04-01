require('dotenv').config();
const { createClient } = require('redis')

const redisclient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-13430.crce179.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 13430
    }
});

module.exports = redisclient ;