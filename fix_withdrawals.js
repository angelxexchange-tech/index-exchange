const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://aviinyou:aviinyou07@cluster0.e4v7x.mongodb.net/indexexchange?appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('indexexchange');
    const transactions = db.collection('transactions');
    const bankAccounts = db.collection('bankaccounts');

    // Find all withdrawals
    const cursor = transactions.find({ type: "withdrawal" });
    let updatedCount = 0;

    for await (const doc of cursor) {
      const address = doc.address || "";
      
      // If it already has "Name:" it's probably already updated
      if (address.includes("Name:")) {
        continue;
      }
      
      // Try to extract account number. Format is usually "... A/C: 123456 ..."
      const match = address.match(/A\/C:\s*(\d+)/);
      if (match && match[1]) {
        const accNum = match[1];
        // Find corresponding bank account for this user
        const bankAcc = await bankAccounts.findOne({ userId: doc.userId, accountNumber: accNum });
        if (bankAcc) {
          // Replace the address with the new format containing the name
          const newAddress = `${bankAcc.bankName} | A/C: ${bankAcc.accountNumber} | IFSC: ${bankAcc.ifscCode} | Name: ${bankAcc.accountHolderName}`;
          
          await transactions.updateOne(
            { _id: doc._id },
            { $set: { address: newAddress } }
          );
          updatedCount++;
          console.log(`Updated tx ${doc._id} for user ${doc.userId}`);
        } else {
           console.log(`Bank account not found for tx ${doc._id}`);
        }
      }
    }
    
    console.log(`Finished! Updated ${updatedCount} old transactions.`);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
