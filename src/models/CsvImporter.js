import parse from '../lib/csv-parse'
import Match from './Match'

let fs = null
if (typeof window.require === 'function') {
  fs = window.require('fs')
} else {
  fs = require('fs')
}

class CsvImporter {
  constructor(path, season, accountID) {
    this.path = path
    this.season = season
    this.accountID = accountID
  }

  readFile = () => {
    return new Promise((resolve, reject) => {
      console.log('reading', this.path)
      fs.readFile(this.path, 'utf8', (err, data) => {
        if (err) {
          console.error('failed to read file', this.path, err)
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  parseCsv = () => {
    return new Promise((resolve, reject) => {
      this.readFile().then(lines => {
        const options = { columns: true }
        parse(lines, options, (err, data) => {
          if (err) {
            console.error('failed to parse CSV file', this.path, err)
            reject(err)
          } else {
            resolve(data)
          }
        })
      })
    })
  }

  normalizeData = hash => {
    const keys = Object.keys(hash)

    for (const key of keys) {
      const lowerKey = key.toLowerCase()
      let value = hash[key]

      if (typeof value === 'string') {
        const lowerValue = value.toLowerCase()

        if (lowerValue === 'y') {
          value = true
        } else if (lowerValue === 'n') {
          value = false
        }
      }

      hash[lowerKey] = value
    }

    return hash
  }

  importMatch = async (rawData) => {
    const data = this.normalizeData(rawData)
    const matchData = {
      accountID: this.accountID,
      season: this.season,
      rank: data.rank,
      comment: data.comment,
      map: data.map,
      isPlacement: data.placement,
      result: data.placement ? data.result : null,
      group: data.group,
      groupSize: data['group size'],
      heroes: data.heroes,
      playedAt: data.date,
      dayOfWeek: data.day,
      timeOfDay: data.time,
      enemyThrower: data['enemy thrower'],
      allyThrower: data['ally thrower'],
      enemyLeaver: data['enemy leaver'],
      allyLeaver: data['ally leaver'],
      playOfTheGame: data['play of the game'],
      joinedVoice: data['joined voice']
    }
    const match = new Match(matchData)
    await match.save()
    return match
  }

  import(onSave) {
    return this.parseCsv().then(async rows => {
      const matches = []

      for (const row of rows) {
        const match = await this.importMatch(row)
        onSave(match)
        matches.push(match)
      }

      return matches
    })
  }
}

export default CsvImporter
