import { setLicenseText } from "@luciad/ria/util/License";

// Specify a path where to find the license file
const licenseText = require("!!url-loader!../../licenses/luciadria_development.txt").default;

function decodeBase64StringToPlainText(licenseBase64) {
  // Base64 String has the format: data:text/plain;base64,code
  const parts = licenseBase64.split(",");
  return parts.length === 2 ? atob(parts[1]) : "";
}

setLicenseText(decodeBase64StringToPlainText(licenseText));
