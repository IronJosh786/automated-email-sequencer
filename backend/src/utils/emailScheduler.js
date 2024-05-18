import Agenda from "agenda";
import nodemailer from "nodemailer";
import Sequence from "../models/sequence.model.js";

const agenda = new Agenda({
  db: { address: `${process.env.MONGODB_URI}` },
});

agenda.define("send email", async (job, done) => {
  const { to, subject, text } = job.attrs.data;
  console.log(to, subject, text);
  let transport = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
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
      console.log(info);
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
  console.log("to -> ", to);

  let delay = 0;

  for (const node of sequence.nodes) {
    if (node.data.label.startsWith("Cold-Email")) {
      const subject = node.data.label.split("\n- (")[1]?.split(")")[0];
      const text = node.data.label.split(") ")[1] || "";

      if (delay > 0) {
        agenda.schedule(`in ${delay} minutes`, "send email", {
          to,
          subject,
          text,
        });
      } else {
        agenda.now("send email", { to, subject, text });
      }
    } else if (node.data.label.startsWith("Wait/Delay")) {
      delay += parseInt(node.data.label.split("- (")[1]?.split(" min")[0], 10);
    }
  }

  await Sequence.findByIdAndDelete(sequence._id);
};

export { agenda, scheduleEmails };
