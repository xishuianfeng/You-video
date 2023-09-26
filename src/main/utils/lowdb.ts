import { app } from "electron"
import path from "path"
import { JSONFile } from 'lowdb/node'
import { Low } from "lowdb"

export const appConfigDbPath = path.join(
  app.getPath('appData'),
  app.name,
  'app-data-db.json'
)

interface AppDataDB {
  playlistLocations: Array<Common.PlaylistLocation>
}

const jsonAdapter = new JSONFile<AppDataDB>(appConfigDbPath)
const appDataDb = new Low(jsonAdapter, {
  playlistLocations: [],
})

export const init = appDataDb.read()
init.then(() => {
  console.log('res ==>', appDataDb.data);
})

export default appDataDb
