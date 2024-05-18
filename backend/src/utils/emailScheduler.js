import Agenda from "agenda";
import nodemailer from "nodemailer";
import Sequence from "../models/sequence.model.js";

const agenda = new Agenda({
  db: { address: `${process.env.MONGODB_URI}` },
});

agenda.define("send email", async (job, done) => {
  const { to, subject, text } = job.attrs.data;
  let transport = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: `${process.env.USER}`,
      pass: `${process.env.PASS}`,
    },
  });

  let mailOptions = {
    from: "test@test.com",
    to,
    text,
    subject,
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
  const sequence = await Sequence.findOne();

  if (!sequence) {
    console.log("No sequence found");
    return;
  }

  const leadSourceNode = sequence.nodes.find((n) =>
    n.data.label.startsWith("Lead-Source")
  );

  if (!leadSourceNode) {
    console.log("No Lead-Source node found, skipping sequence");
    await Sequence.findByIdAndDelete(sequence._id);
    return;
  }

  const to = leadSourceNode?.data?.label?.split("- (")[1].split(")")[0];

  let totalDelay = 0;

  for (const node of sequence.nodes) {
    if (node.data.label.startsWith("Cold-Email")) {
      const subject = node.data.label.split("\n- (")[1]?.split(")")[0];
      const text = node.data.label.split(") ")[1] || "";

      totalDelay += 5000;
      agenda.schedule(new Date(Date.now() + totalDelay), "send email", {
        to,
        subject,
        text,
      });
    } else if (node.data.label.startsWith("Wait/Delay")) {
      const delay = parseInt(
        node.data.label.split("- (")[1]?.split(" min")[0],
        10
      );
      totalDelay += delay * 60 * 1000;
    }
  }

  await Sequence.findByIdAndDelete(sequence._id);
};

export { agenda, scheduleEmails };
