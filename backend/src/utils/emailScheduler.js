import Agenda from "agenda";
import nodemailer from "nodemailer";
import Sequence from "../models/sequence.model.js";

const agenda = new Agenda({
  db: { address: `${process.env.MONGODB_URI}` },
});

agenda.define("send email", async (job, done) => {
  const { to, subject, text } = job.attrs.data;

  let transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  let mailOptions = {
    from: "test@test.com",
    to,
    subject,
    text,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
    done();
  });
});

const scheduleEmails = async () => {
  const sequences = await Sequence.find();
  sequences.forEach((sequence) => {
    sequence.nodes.forEach((node) => {
      if (node.type === "Cold Email") {
        agenda.schedule(node.date, "send email", {
          to: node.to,
          subject: node.subject,
          text: node.text,
        });
      }
    });
  });
};

export { agenda, scheduleEmails };
