const sgMail = require("../config/sendgrid");

// Function to send payment reminder email
exports.sendPaymentReminder = async (
  recipientEmail,
  studentName,
  amountDue
) => {
  const msg = {
    to: recipientEmail,
    from: "your-email@example.com", // Use the verified sender address from SendGrid
    subject: "Payment Reminder",
    text: `Dear ${studentName},\n\nThis is a reminder that your payment of ${amountDue} is due soon. Please make the payment at your earliest convenience.\n\nRegards,\nYour College Name`,
  };

  try {
    await sgMail.send(msg);
    console.log("Payment reminder email sent");
  } catch (error) {
    console.error("Error sending payment reminder email:", error.toString());
  }
};

// Function to send payment confirmation email
exports.sendPaymentConfirmation = async (
  recipientEmail,
  studentName,
  amountPaid
) => {
  const msg = {
    to: recipientEmail,
    from: "your-email@example.com", // Use the verified sender address from SendGrid
    subject: "Payment Confirmation",
    text: `Dear ${studentName},\n\nThis is to confirm that your payment of ${amountPaid} has been successfully processed. Thank you for your payment.\n\nRegards,\nYour College Name`,
  };

  try {
    await sgMail.send(msg);
    console.log("Payment confirmation email sent");
  } catch (error) {
    console.error(
      "Error sending payment confirmation email:",
      error.toString()
    );
  }
};
