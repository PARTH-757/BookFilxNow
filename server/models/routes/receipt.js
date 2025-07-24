const express = require("express");
const PDFDocument = require("pdfkit");//useedx to dynamically create pdf
const User = require("../User");
const Show = require("../Show");
const Seat = require("../Seat");
const transporter = require("../../mail-config");

const router = express.Router();

router.post("/send", async (req, res) => {
  const { userId, seatIds, showId, amount } = req.body;

  console.log(" API hit: /api/receipt/send");//debugging logs
  console.log(" Request body:", req.body);

  try {
    console.log(" Fetching user...");//debug
    const user = await User.findById(userId);
    if (!user) {
      console.error(" User not found");
      return res.status(404).json({ msg: "User not found" });
    }
    console.log(" User fetched:", user.email);//debugg

    console.log(" Fetching show...");//debugg
    const show = await Show.findById(showId).populate("movie theater");
    if (!show) {
      console.error(" Show not found");//debugg
      return res.status(404).json({ msg: "Show not found" });
    }
    console.log(" Show fetched:", show.movie.title, "at", show.theater.name);//debugg

    console.log(" Fetching seats...");//debugg
    const seats = await Seat.find({ _id: { $in: seatIds } });// all ids in Seat that match with seatids in the list seatIds.
    console.log("Seats fetched:", seats.map(s => s.seatNumber).join(", "));//debugg

    console.log(" Generating PDF...");//debugg
    const doc = new PDFDocument();
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));// This listens for "data" events from the doc object. Every time a chunk of PDF data is ready, it will be pushed into the buffers array.
    doc.on("end", async () => {//This listens for the "end" event, which is triggered when PDF generation is finished.
      const pdfBuffer = Buffer.concat(buffers);
      console.log(" PDF generation complete");

      const mailOptions = {//This creates an object called mailOptions — this object tells the email system who to send to, what to send, and what to attach.
        from: `"BookFkixNow " <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: "🎟 Your Movie Ticket Receipt (ticket PDF Attached)",
        html: `
          <h2>Hi ${user.name},</h2>
          <p>Thank you for booking with <b>BookFkixNow</b>!</p>
          <p>We've attached your ticket as a PDF.</p>
          <hr/>
          <p><strong> Movie:</strong> ${show.movie.title}</p>
          <p><strong> Theater:</strong> ${show.theater.name}, ${show.theater.location}</p>
          <p><strong> Show Time:</strong> ${new Date(show.showTime).toLocaleString()}</p>
          <p><strong> Seats:</strong> ${seats.map(s => s.seatNumber).join(", ")}</p>
          <p><strong> Total Paid:</strong> ₹${amount}</p>
          <hr/>
          <p>Enjoy your movie! 🍿</p>
        `,
        attachments: [
          {
            filename: "Movie_Ticket_Receipt.pdf",
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      };

      console.log(" Sending email to:", user.email);//debugg
      await transporter.sendMail(mailOptions);
      console.log(" Email sent successfully");
      res.status(200).json({ msg: "Email with PDF sent successfully" });
    });

    // Fill PDF content
    doc.fontSize(20).text(" Movie Ticket ", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Movie: ${show.movie.title}`);
    doc.text(`Theater: ${show.theater.name}, ${show.theater.location}`);
    doc.text(`Show Time: ${new Date(show.showTime).toLocaleString()}`);
    doc.text(`Seats: ${seats.map(s => s.seatNumber).join(", ")}`);
    doc.text(`Amount Paid: ₹${amount}`);
    doc.end();

  } catch (error) {
    console.error(" Email sending error:", error);
    res.status(500).json({ msg: "Failed to send email with PDF" });
  }
});

module.exports = router;
