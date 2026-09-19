const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "public", "uploads");

// تأكد من وجود المجلد
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// تغيير الأذونات
fs.chmodSync(uploadDir, 0o755);
console.log("Permissions set to 755 for uploads directory");
