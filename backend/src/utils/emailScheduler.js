import Agenda from "agenda";
import nodemailer from "nodemailer";
import Sequence from "../models/sequence.model.js";

// Initialize Agenda with MongoDB connection URI
const agenda = new Agenda({
  db: { address: `${process.env.MONGODB_URI}` },
});

// Define the "send email" job using Agenda
agenda.define("send email", async (job, done) => {
  const { to, subject, text } = job.attrs.data; // Extract email data from job attributes

  // Create a nodemailer transport using environment variables for Mailtrap
  let transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  // Define email options
  let mailOptions = {
    from: "test@test.com",
    to,
    text,
    subject,
  };

  // Send the email
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
    done(); // Signal completion of job
  });
});

// Function to schedule emails based on the sequence
const scheduleEmails = async () => {
  const sequence = await Sequence.findOne(); // Find the sequence document

  if (!sequence) {
    console.log("No sequence found");
    return;
  }

  // Find the lead source node in the sequence
  const leadSourceNode = sequence.nodes.find((n) =>
    n.data.label.startsWith("Lead-Source")
  );

  if (!leadSourceNode) {
    console.log("No Lead-Source node found, skipping sequence");
    await Sequence.findByIdAndDelete(sequence._id);
    return;
  }

  // Extract the recipient email address from the lead source node label
  const to = leadSourceNode?.data?.label?.split("- (")[1].split(")")[0];

  let totalDelay = 0; // Initialize total delay

  // Iterate through the nodes in the sequence
  for (const node of sequence.nodes) {
    if (node.data.label.startsWith("Cold-Email")) {
      // Extract subject and text from Cold-Email node label
      const subject = node.data.label.split("\n- (")[1]?.split(")")[0];
      const text = node.data.label.split(") ")[1] || "";

      // Add 5 seconds delay between emails to maintain the order
      totalDelay += 5000;

      // Schedule the email with the accumulated delay
      agenda.schedule(new Date(Date.now() + totalDelay), "send email", {
        to,
        subject,
        text,
      });
    } else if (node.data.label.startsWith("Wait/Delay")) {
      // Extract the delay time from the Wait/Delay node label and convert to milliseconds
      const delay = parseInt(
        node.data.label.split("- (")[1]?.split(" min")[0],
        10
      );
      totalDelay += delay * 60 * 1000; // Add the specified delay time to the total delay
    }
  }

  // Delete the sequence after scheduling all emails
  await Sequence.findByIdAndDelete(sequence._id);
};

export { agenda, scheduleEmails };
