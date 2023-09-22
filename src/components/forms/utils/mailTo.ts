import { mailtoConfig } from "../../../config/mailto-config";

export const mailTo: (args: {
  subject?: string | null;
  body?: string;
  address?: string;
}) => void = ({ subject, body, address }) => {
  let mailtoUrl = `mailto:${address ?? mailtoConfig.generalAddress}`;
  if (subject || body) {
    mailtoUrl = mailtoUrl + "?";
  }
  if (subject) {
    mailtoUrl = mailtoUrl + `Subject=${subject}`;
  }
  if (subject && body) {
    mailtoUrl = mailtoUrl + "&";
  }
  if (body) {
    mailtoUrl = mailtoUrl + `body=${body}`;
  }
  window.open(mailtoUrl);
};
