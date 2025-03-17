/**
 * Splits a message into chunks that respect a maximum length while trying to preserve formatting.
 * First attempts to split on double newlines (paragraphs), then falls back to single newlines if needed.
 */
export function splitMessage(
  message: string,
  maxLength: number = 3500
): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  // Split by double newline to preserve paragraph structure
  const paragraphs = message.split(/\n\n+/);

  for (const paragraph of paragraphs) {
    // If the paragraph fits in the current chunk, add it
    if (currentChunk.length + paragraph.length + 2 <= maxLength) {
      currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
    } else {
      // If the paragraph itself is too long, split it on single line breaks
      if (paragraph.length > maxLength) {
        // First push the current chunk if it exists
        if (currentChunk) {
          chunks.push(currentChunk);
          currentChunk = "";
        }

        // Split the large paragraph on single line breaks
        const lines = paragraph.split(/\n/);
        for (const line of lines) {
          if (currentChunk.length + line.length + 1 <= maxLength) {
            currentChunk += (currentChunk ? "\n" : "") + line;
          } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = line;
          }
        }
      } else {
        // Normal case - push current chunk and start new one with this paragraph
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = paragraph;
      }
    }
  }
  if (currentChunk) chunks.push(currentChunk);

  return chunks;
}
