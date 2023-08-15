
# MyAwesomeNotesApp

### Steps to run project / Installation:
1. Clone the Repo
2. Run 
```bash
 npm i 
   or 
 npm install
```
3. Go to FE and then run
 ```bash
npm run dev
```
4. To start BE 
```bash
run npm start
```
6. For Database create DB in MongoDB https://account.mongodb.com/account/login
7. After getting Connection string from MongoDB use Connection String as MONGO_URL in your project by creating .env
8. Similiarly create SECRET_KEY in .env you can assign any value to secret key 

```javascript
.env (example)
MONGO_URL="mongodb+srv://test_key:test%56@clus56.test56.mongodb.net/test_db"
SECRET_KEY="test_secret_key_notes_app"
```
