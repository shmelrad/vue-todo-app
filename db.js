import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'



// Create a new instance of lowdb and specify the JSON file as the data source
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')

// Configure lowdb to write data to JSON file
const adapter = new JSONFile(file)
const defaultData = { lists: [], labels: [] }
const db = new Low(adapter, defaultData)
await db.read()

export default db;

export function getListById(id){
    const filteredLists = db.data.lists.filter(list => list.id === id);
    if (!filteredLists[0]){
      return undefined
    }

    return filteredLists[0]
}