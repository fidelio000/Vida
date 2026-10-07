const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const schedule = require('node-schedule');
const crypto = require('crypto');

// Schedule a job to run every minute to check for expired roles
function scheduleRoleExpiryCheck() {
    schedule.scheduleJob('* * * * *', checkRoleExpiryations); // This runs every minute
}

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Define constants
const PREDICTOR_SIZE = 5;
const MAX_MINES = 24;
const REQUIRED_ROLE_ID = '1260603803674087476';
const COMMAND_USAGE = '!predict <hashed-seed> <mines 1-24>';
const GREEN_EMOJI = 'o'; // Safe
const YELLOW_EMOJI = 'o'; // Uncertain
const RED_EMOJI = 'o'; // Not safe

// Define a function to generate mines
function generateMines(numMines, size) {
    const mineLocations = new Set();
    const grid = Array(size).fill(0).map(() => Array(size).fill(GREEN_EMOJI)); // Start with all safe

    for (let i = 0; i < numMines; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * size);
            y = Math.floor(Math.random() * size);
        } while (mineLocations.has(`${x},${y}`));
        mineLocations.add(`${x},${y}`);
        grid[x][y] = RED_EMOJI; // Mark mines as not safe
    }

    // Randomly mark some safe spots as uncertain
    for (let i = 0; i < Math.floor(size * size * 0.2); i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * size);
            y = Math.floor(Math.random() * size);
        } while (mineLocations.has(`${x},${y}`) || grid[x][y] === RED_EMOJI);
        grid[x][y] = YELLOW_EMOJI; // Mark safe spots as uncertain
    }

    return { mineLocations, grid };
}

client.once('ready', () => {
    console.log(`¡Bot conectado exitosamente como ${client.user.tag}!`);
    scheduleRoleExpiryCheck();
});

client.login('TU_TOKEN_DE_DISCORD_AQUI');
