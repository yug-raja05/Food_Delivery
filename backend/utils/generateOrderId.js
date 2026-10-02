/**
 * Generates a unique, human-friendly order identifier
 * Format: ZFC-YYYYMMDD-XXXX
 */
function generateOrderId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateSegment = `${year}${month}${day}`;

  // Random 4-character alphanumeric code
  const chars = "0123456789";
  let randomSegment = "";
  for (let i = 0; i < 4; i++) {
    randomSegment += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `ZFC-${dateSegment}-${randomSegment}`;
}

module.exports = generateOrderId;
