const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://ashirxhk1:XIhy19z823IU0zZe@cluster0.d85qmua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function listDatabasesAndCollections() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const admin = client.db().admin();

    const dbs = await admin.listDatabases();
    console.log('📂 Databases found:');

    for (const dbInfo of dbs.databases) {
      const dbName = dbInfo.name;
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();

      console.log(`\n🔹 ${dbName} (${collections.length} collections)`);
      for (const col of collections) {
        console.log(`   - ${col.name}`);
      }
    }
  } catch (err) {
    console.error('❌ Error listing databases:', err);
  } finally {
    await client.close();
  }
}

listDatabasesAndCollections();