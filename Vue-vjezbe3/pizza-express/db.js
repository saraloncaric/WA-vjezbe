import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const cluster = 'Cluster0';

const mongoURI = `mongodb+srv://${username}:${password}@cluster0.rjsnefl.mongodb.net/?appName=${cluster}`;

async function connectToDatabase() {
    try {
        const client = new MongoClient(mongoURI); 
        await client.connect(); 
        console.log('Uspješno spajanje na bazu podataka');
        let db = client.db('pizza'); 
        return db;
    } catch (error) {
        console.error('Greška prilikom spajanja na bazu podataka', error);
        throw error;
    }
}
export { connectToDatabase };