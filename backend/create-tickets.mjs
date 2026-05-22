import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({ region: "us-east-1" });
const db = DynamoDBDocumentClient.from(client);

const STOP_WORDS = new Set([
  'in','on','an','upon','the','is','are','was','were','a','of',
  'to','for','at','by','with','from','that','this','it','be',
  'as','or','and','but','not','have','has','had','do','does',
  'did','will','would','could','should','may','might','i','my',
  'we','our','you','your','he','his','she','her','they','their',
  'me','him','us','them','its','also','just','very','so','if',
  'then','than','when','where','how','what','which','who','after',
  'before','about','into','through','during','up','down','out'
]);

function generateTags(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  const words = text.match(/[a-z]+/g) || [];
  return [...new Set(words.filter(w => w.length > 2 && !STOP_WORDS.has(w)))].slice(0, 20);
}

const tickets = [
  { title: "WiFi not connecting after Windows update", description: "After updating Windows 11, my laptop WiFi stopped working completely. Network adapter shows error.", priority: "High", category: "Technical" },
  { title: "Unable to login to email account", description: "Getting invalid password error even after reset. Account seems locked.", priority: "High", category: "General" },
  { title: "Printer not detected by computer", description: "HP printer installed but not showing in devices list. Tried reinstalling drivers.", priority: "Medium", category: "Technical" },
  { title: "Slow internet speed issue", description: "Internet speed dropped from 100Mbps to 5Mbps suddenly. Router restarted multiple times.", priority: "Medium", category: "Technical" },
  { title: "Blue screen error on startup", description: "Computer shows BSOD with error KERNEL_SECURITY_CHECK_FAILURE on every boot.", priority: "High", category: "Technical" },
  { title: "Software license expired", description: "Adobe Creative Cloud license expired. Need renewal or alternative solution.", priority: "Low", category: "Billing" },
  { title: "Mouse cursor freezing randomly", description: "Mouse cursor freezes for 2-3 seconds randomly while working. Tried different USB ports.", priority: "Medium", category: "Technical" },
  { title: "Cannot open PDF files", description: "PDF files not opening in Adobe Reader. Getting error file is corrupted.", priority: "Low", category: "Technical" },
  { title: "Email attachments not downloading", description: "Gmail attachments showing download error. Works on mobile but not desktop.", priority: "Medium", category: "General" },
  { title: "Computer running very slow", description: "Laptop takes 10 minutes to boot. CPU usage always at 100% even with no apps open.", priority: "High", category: "Technical" },
  { title: "Monitor showing no signal", description: "External monitor shows no signal message. HDMI cable replaced but same issue.", priority: "High", category: "Technical" },
  { title: "Keyboard keys not working", description: "Several keys on keyboard stopped responding. Coffee spilled yesterday.", priority: "Medium", category: "Technical" },
  { title: "Cannot connect to VPN", description: "Company VPN gives authentication error. Credentials are correct.", priority: "High", category: "Technical" },
  { title: "Billing amount incorrect", description: "Charged twice for same subscription this month. Need refund for duplicate charge.", priority: "High", category: "Billing" },
  { title: "Software installation failing", description: "Getting error 1603 when installing Microsoft Office. Tried as administrator.", priority: "Medium", category: "Technical" },
  { title: "Data backup not completing", description: "Backup job fails at 67% every time. External drive has enough space.", priority: "High", category: "Technical" },
  { title: "Screen brightness not adjusting", description: "Brightness slider not working after driver update. Screen stuck at maximum brightness.", priority: "Low", category: "Technical" },
  { title: "Zoom calls keep disconnecting", description: "Getting disconnected from Zoom meetings every 10 minutes. Internet is stable.", priority: "High", category: "Technical" },
  { title: "Files deleted accidentally", description: "Important project files deleted from shared drive. Need recovery assistance.", priority: "High", category: "General" },
  { title: "Password reset not working", description: "Reset email not received even after multiple attempts. Checked spam folder.", priority: "High", category: "General" },
  { title: "USB drive not recognized", description: "USB flash drive not showing in file explorer. Works on other computers.", priority: "Medium", category: "Technical" },
  { title: "Excel file corrupted", description: "Cannot open Excel file. Shows repair message but repair fails.", priority: "High", category: "Technical" },
  { title: "Antivirus blocking application", description: "Windows Defender blocking our internal tool. Need whitelist exception.", priority: "Medium", category: "Technical" },
  { title: "Website loading very slowly", description: "Company website takes 30 seconds to load. Other websites are fast.", priority: "Medium", category: "Technical" },
  { title: "Two factor authentication issue", description: "OTP not received on registered mobile number. Account locked.", priority: "High", category: "General" },
  { title: "Laptop battery draining fast", description: "Battery from 100% to 0% in 1 hour. Previously lasted 6 hours.", priority: "Medium", category: "Technical" },
  { title: "Camera not working in meetings", description: "Webcam shows black screen in Zoom and Teams. Works in camera app.", priority: "Medium", category: "Technical" },
  { title: "Microphone not detected", description: "External microphone not showing in sound settings. Tried different USB ports.", priority: "Medium", category: "Technical" },
  { title: "Subscription cancellation request", description: "Want to cancel premium subscription and get prorated refund.", priority: "Low", category: "Billing" },
  { title: "Software update breaking functionality", description: "After updating to version 5.2, export feature stopped working.", priority: "High", category: "Technical" },
  { title: "Network drive not accessible", description: "Cannot access shared network drive. Getting access denied error.", priority: "High", category: "Technical" },
  { title: "Email signature not saving", description: "Custom email signature gets deleted after Outlook restarts.", priority: "Low", category: "General" },
  { title: "Touchpad not responding", description: "Laptop touchpad completely stopped working. External mouse works fine.", priority: "Medium", category: "Technical" },
  { title: "System clock wrong time", description: "Computer clock shows wrong time zone even after manual correction.", priority: "Low", category: "Technical" },
  { title: "Cannot print from browser", description: "Print option from Chrome browser not working. Desktop apps print fine.", priority: "Medium", category: "Technical" },
  { title: "Mobile app crashing on launch", description: "Company mobile app crashes immediately after opening on Android.", priority: "High", category: "Technical" },
  { title: "Scanner not working", description: "Document scanner connected but not showing in scan applications.", priority: "Medium", category: "Technical" },
  { title: "Duplicate invoice received", description: "Received two invoices for same order. Need clarification on billing.", priority: "Medium", category: "Billing" },
  { title: "Remote desktop connection failing", description: "RDP connection timeout error when connecting to office computer from home.", priority: "High", category: "Technical" },
  { title: "Audio not working after update", description: "No sound from speakers after Windows update. Audio driver reinstalled.", priority: "Medium", category: "Technical" },
  { title: "Account suspended without notice", description: "Account shows suspended status. No email notification received.", priority: "High", category: "General" },
  { title: "File sharing permission denied", description: "Cannot share files with team members. Getting permission denied error.", priority: "Medium", category: "General" },
  { title: "Laptop overheating problem", description: "Laptop gets very hot within 20 minutes and shuts down automatically.", priority: "High", category: "Technical" },
  { title: "Download speed very slow", description: "Downloads taking 10x longer than usual. Upload speed is normal.", priority: "Medium", category: "Technical" },
  { title: "Auto-correct not working", description: "Spell check and auto-correct stopped working in Word documents.", priority: "Low", category: "Technical" },
  { title: "Cannot access cloud storage", description: "OneDrive showing sync error. Files not uploading from past 2 days.", priority: "Medium", category: "Technical" },
  { title: "Projector not connecting", description: "Laptop not detecting projector via HDMI in conference room.", priority: "High", category: "Technical" },
  { title: "Wrong charge on credit card", description: "Unauthorized charge of 999 rupees found on credit card from our platform.", priority: "High", category: "Billing" },
  { title: "Application crashing frequently", description: "Design software crashes every 30 minutes causing loss of unsaved work.", priority: "High", category: "Technical" },
  { title: "Cannot change account password", description: "Password change form gives error after submitting. Tried different browsers.", priority: "Medium", category: "General" },
]

// Generate 200 tickets by repeating with variations
const statuses = ["Open", "In Progress", "Resolved", "Closed"]
const priorities = ["Low", "Medium", "High"]
const categories = ["Technical", "General", "Billing", "Other"]

const customerIds = [
  { sub: "84a8a4a8-b081-70cd-6233-b9f2b076aa97", email: "jaikumarnaidu123@gmail.com" }
]

async function createTickets() {
  console.log("Creating 200 dummy tickets...")
  let count = 0

  for (let i = 0; i < 200; i++) {
    const base = tickets[i % tickets.length]
    const customer = customerIds[i % customerIds.length]
    const status = statuses[i % statuses.length]
    const daysAgo = Math.floor(Math.random() * 30)
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()

    const title = i < tickets.length ? base.title : `${base.title} - Case ${i + 1}`
    const description = base.description

    const ticket = {
      ticketId: randomUUID(),
      title,
      description,
      priority: base.priority,
      category: base.category,
      status,
      createdBy: customer.sub,
      createdByEmail: customer.email,
      assignee: status !== "Open" ? "jaikumarnaidu123+agent@gmail.com" : null,
      attachmentUrl: null,
      tags: generateTags(title, description),
      createdAt,
      updatedAt: createdAt
    }

    await db.send(new PutCommand({ TableName: "Tickets", Item: ticket }))
    count++
    if (count % 20 === 0) console.log(`Created ${count} tickets...`)
  }

  console.log("✅ Done! 200 tickets created successfully.")
}

createTickets().catch(console.error)