
import { initializeApp, getApps, getApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccountJson = {
  "type": "service_account",
  "project_id": "voting-app-b7606",
  "private_key_id": "35158092fcb2a66511dcd6f84916c4722218f8b0",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDET47LaQnxf+sc\nAHpcDg1tTwv1++pqPYl0dgjzKzF77BOJO005leetPQMaqcswTUQ5csfzW2HWEb7Q\n/o158YhqIrv1jKpk1mmyqXuIS+ebieaJbVYrJy/GJSfVY4AQtiIky/JTM8nSz+/b\nG/EwxTyRtJNkAOiZl1rDnshD2LZapwqm1wsq1om/6Jwn3TMzydb3kZj5/n9thJkH\nNt4Fxi4UZRgo6vWPLsVG9XF/CwZGwkLSy3cWVsIO+pBwNp753+fuyGBmOOgnAKy1\n1iwMUU/8uQGaTlRqKVwxpznyarUVYwvawfUp35X/Wk5LY1QgIY+RzwRHEgKw8Kx2\nJI0mAcAxAgMBAAECggEAYKHY5H/8CQiyrsH9eTrhmSED/j3XEhzggJdpqGlmnl2C\n8FZkmSgVNs2FraZPAqPGJZE+o6gj7MAncbEb6x7dy4D1jNWFOsXgmbWbvWe/xmyH\nMrbDZ9KOTbcUeJHWBGPjQsGxswsXGdKJew2yGBO+0OpWcy+PT6uVXh3W7q7KdKxQ\nIlR85mYIlpHWaHOv/E7w3huvQ+yTV1EAv+DId3p+A6XOcbWMeg3lrBexaRDwhYP+\nZRGA59oIpduIBGt8brg4+QSlrkDTBLZR6UJrJPiScyXYjhwBlOGg++Hsk0alAeZ0\nN5SNurNbvjhIjVQ/TZ3/+pHRrCAzT1tBFWNnTib8kQKBgQDtCTqw7CPuZJzvHrgm\n+AQfykHi2jklC8nlKCPicN1IMvSZd0s4i5J+/Q3/w+jn2YydzK48yZWaK4cFsYG9\nR+J6FcQRYwRHVWNWp3EBA7zeco+G6SmzEQqQjsVsksMPBWkxiTyV9m4No9u7B0Cr\nN+AY++4d51Nwy47mYAARx4EBVwKBgQDUBDpe63p2kBA/OL3Batq4LzYl7EE3bz+r\nc+aSo+Z5RiB0244q6IweuOU12//bRcgillG+x9O4kd9rIVVMpgy7MYA9d8ZANyWd\nq3PUagfEY4eQsIkYsP0aL5p5X+IdiQtrzt1JfspkIIyVUQxO73NpoVK5okrwHC4g\nOpw9RO6ttwKBgQCn0w4D791szz2xq71UketRmsFVXY5yJUuX/PiTPbfeg31dHvJa\nIa/iS0bbHJlNdmEx5JZEobFTS5g4troWCsxWBg0hBkskOlewJbNDtaLGmLP4ICOP\nDfS97ufm/G4wt3MISJNl1emLrMVJQVRPJat75PttnrgcN3OAtt21uNwk1wKBgQCm\nmJ/pQC2dhnxNwV9R4Y32Fpr815UzYwZrygnPBl0uxEzypicjTlH0PiNV3AZDHaUy\nkF2xhMG4EV+2hZ3KOdxdJ3t2UWyFvw+ewj+lFJ//0JmQtzczILfxYKCIaTB7Ntmz\nn/xAKRIN9YmiNupuCDfvM6WWWpF59RrFlmh4uHa4JwKBgDzYsr6a6WTN8fyJpnol\ng4YliIUB/Qs58naHQojMQa9UiE+4rfkDplsNjfuYrukDUrTOpwIL9Segl6EI4Yy\nAj0B0gwLlXksUFP8nKvWic9xs1xnQFSSaPZ7+TtVb0u2mKXprCo7kukxPqcjucFz\noS5G7wJlFa0UWhY/VfRHqsWD\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
  "client_email": "firebase-adminsdk-mexwt@voting-app-b7606.iam.gserviceaccount.com",
  "client_id": "111315692260711961592",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-mexwt%40voting-app-b7606.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

const serviceAccount = serviceAccountJson as ServiceAccount;

const app = !getApps().length ? initializeApp({ credential: cert(serviceAccount) }) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
