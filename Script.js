// Generate a mock dataset of DataMessage
function generateMockDataset() {
  const dataset = [];
  const authorIds = new Set();
  const startDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // 2 months ago
  const endDate = new Date();
  const timeRange = endDate - startDate;

  for (let i = 0; i < 200000; i++) {
    const id = i + 1;
    const content = `Message ${id}`;
    const timestamp = new Date(startDate.getTime() + Math.random() * timeRange);
    const authorId = Math.floor(Math.random() * 200) + 1; // random authorId between 1 and 200
    authorIds.add(authorId);
    const channelId = Math.floor(Math.random() * 10) + 1; // random channelId between 1 and 10

    const dataMessage = { id, content, timestamp, authorId, channelId };
    dataset.push(dataMessage);
  }

  return { dataset, authorIds: Array.from(authorIds) };
}

// Calculate quality scores for each author
function calculateQualityScores(dataset) {
  const authorScores = {};

  for (const dataMessage of dataset) {
    const authorId = dataMessage.authorId;

    // Initialize the author's score if not already done
    if (!authorScores.hasOwnProperty(authorId)) {
      authorScores[authorId] = {
        amountOfMessages: 0,
        frequency: 0,
        contentVariety: new Set(),
      };
    }

    // Increase the amount of messages
    authorScores[authorId].amountOfMessages++;

    // Calculate the frequency
    const lastMessage = authorScores[authorId].lastMessage;
    if (lastMessage) {
      const timeDiff = dataMessage.timestamp - lastMessage.timestamp;
      const frequency = authorScores[authorId].frequency;
      authorScores[authorId].frequency = (frequency * (authorScores[authorId].amountOfMessages - 1) + timeDiff) / authorScores[authorId].amountOfMessages;
    }
    authorScores[authorId].lastMessage = dataMessage;

    // Add the content to the content variety set
    authorScores[authorId].contentVariety.add(dataMessage.content);
  }

  // Calculate the final score for each author
  for (const authorId in authorScores) {
    const score = authorScores[authorId].amountOfMessages * authorScores[authorId].frequency * authorScores[authorId].contentVariety.size;
    authorScores[authorId] = score;
  }

  return authorScores;
}

// Calculate the overall quality score of the dataset
function calculateOverallScore(dataset) {
  const authorScores = calculateQualityScores(dataset.dataset);

  // Calculate the total number of messages
  const totalMessages = dataset.dataset.length;

  // Calculate the sum of author scores
  let sumOfAuthorScores = 0;
  for (const authorId in authorScores) {
