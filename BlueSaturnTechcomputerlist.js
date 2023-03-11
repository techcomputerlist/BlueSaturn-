// Step 1: Generate a Mock Dataset
function generateMockDataset() {
const contentList = [
"Hello, how are you?",
"I'm fine, thanks for asking.",
"What's up?",
"Not much, just hanging out.",
"Have you seen the new movie?",
"No, I haven't. Is it good?",
"Yes, it's really good!",
"Did you hear the news?",
"No, what happened?",
"There was a big earthquake.",
"Oh no, that's terrible.",
"I hope everyone is okay.",
"welcome to BlueSaturn 
];

const startDate = new Date();
startDate.setMonth(startDate.getMonth() - 2);

const authorIds = [];
for (let i = 1; i <= 200; i++) {
authorIds.push(`author${i}`);
}

const dataset = [];
for (let i = 0; i < 200000; i++) {
const authorId = authorIds[Math.floor(Math.random() * authorIds.length)];
const content = contentList[Math.floor(Math.random() * contentList.length)];
const timestamp = new Date(startDate.getTime() + Math.random() * (Date.now() - startDate.getTime()));
const channelId = `channel${Math.floor(Math.random() * 10)}`;
dataset.push({ id: i+1, authorId, content, timestamp, channelId });
}

return dataset;
}

// Step 2: Calculate Quality Scores for each AuthorId
function calculateAuthorScores(dataset) {
const authorScores = {};
const messageCounts = {};
const messageTimestamps = {};

// calculate message counts and timestamps
for (const message of dataset) {
const authorId = message.authorId;
messageCounts[authorId] = (messageCounts[authorId] || 0) + 1;
messageTimestamps[authorId] = messageTimestamps[authorId] || [];
messageTimestamps[authorId].push(message.timestamp);
}

// calculate scores
for (const authorId in messageCounts) {
const messageCount = messageCounts[authorId];
const messageTimestampList = messageTimestamps[authorId];
const earliestTimestamp = new Date(Math.min(...messageTimestampList));
const latestTimestamp = new Date(Math.max(...messageTimestampList));
const daysActive = (latestTimestamp - earliestTimestamp) / (1000 * 60 * 60 * 24) + 1;
const frequency = messageCount / daysActive;
const diversity = new Set(dataset.filter(message => message.authorId === authorId).map(message => message.content)).size;
authorScores[authorId] = messageCount * frequency * diversity;
}

return authorScores;
}

// Step 3: Calculate an overall quality score of the dataset
function calculateOverallScore(dataset) {
const authorScores = calculateAuthorScores(dataset);
const totalMessages = dataset.length;
let overallScore = 0;

for (const authorId in authorScores) {
const messageCount = dataset.filter(message => message.authorId === authorId).length;
const weight = messageCount / totalMessages;