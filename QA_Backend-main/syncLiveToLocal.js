const mongoose = require('mongoose');

const liveUri = 'mongodb+srv://ashirxhk1:XIhy19z823IU0zZe@cluster0.d85qmua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const liveDbName = "test";
const localUri = 'mongodb://127.0.0.1:27017/bicc'; // 👈 Replace with your local DB name

async function syncCollections() {
  const liveConnection = await mongoose.createConnection(`${liveUri}&dbName=${liveDbName}`).asPromise();
  const localConnection = await mongoose.createConnection(localUri).asPromise();

  const collections = await liveConnection.db.listCollections().toArray();

  console.log(`🔍 Found ${collections.length} collections.`);

  for (const { name } of collections) {
    console.log(`⏳ Syncing "${name}"...`);

    const LiveModel = liveConnection.model(name, new mongoose.Schema({}, { strict: false }), name);
    const LocalModel = localConnection.model(name, new mongoose.Schema({}, { strict: false }), name);

    const data = await LiveModel.find({}).lean();

    await LocalModel.deleteMany({});
    if (data.length > 0) {
      await LocalModel.insertMany(data);
    }

    console.log(`✅ Synced ${data.length} documents from "${name}".`);
  }

  await liveConnection.close();
  await localConnection.close();
  console.log('🎉 All collections synced from live to local.');
}

syncCollections().catch(err => {
  console.error('❌ Sync failed:', err);
});