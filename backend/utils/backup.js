// backend/utils/backup.js
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

// تأكد من وجود مجلد النسخ الاحتياطية
const backupDir = path.join(__dirname, '../backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// تاريخ النسخة الاحتياطية
const date = new Date();
const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
const timeString = `${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}`;
const backupFile = path.join(backupDir, `backup-${dateString}_${timeString}.gz`);

// استخراج معلومات الاتصال من متغيرات البيئة
const MONGO_URI = process.env.MONGO_URI;
const uri = new URL(MONGO_URI);
const host = uri.hostname;
const port = uri.port || '27017';
const database = uri.pathname.substring(1);
const username = uri.username;
const password = uri.password;

// أمر النسخ الاحتياطي
const command = 'mongodump';
const args = [
  `--host=${host}`,
  `--port=${port}`,
  `--db=${database}`,
  `--username=${username}`,
  `--password=${password}`,
  `--archive=${backupFile}`,
  '--gzip'
];

// تنفيذ أمر النسخ الاحتياطي
const backup = spawn(command, args);

backup.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

backup.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

backup.on('close', (code) => {
  if (code === 0) {
    console.log(`النسخ الاحتياطي اكتمل بنجاح: ${backupFile}`);
    
    // حذف النسخ الاحتياطية القديمة (الاحتفاظ بآخر 7 نسخ فقط)
    fs.readdir(backupDir, (err, files) => {
      if (err) throw err;
      
      const backupFiles = files
        .filter(file => file.startsWith('backup-'))
        .map(file => ({
          name: file,
          time: fs.statSync(path.join(backupDir, file)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);
      
      // الاحتفاظ بآخر 7 نسخ فقط
      if (backupFiles.length > 7) {
        backupFiles.slice(7).forEach(file => {
          fs.unlink(path.join(backupDir, file.name), err => {
            if (err) console.error(`خطأ في حذف النسخة الاحتياطية القديمة: ${file.name}`);
            else console.log(`تم حذف النسخة الاحتياطية القديمة: ${file.name}`);
          });
        });
      }
    });
  } else {
    console.error(`فشل النسخ الاحتياطي مع الرمز: ${code}`);
  }
});