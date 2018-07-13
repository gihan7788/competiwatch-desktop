import React, { Component } from 'react'
import Match from '../models/Match'
import MapSelect from './MapSelect'
import HeroSelect from './HeroSelect'
import './MatchForm.css'

const currentDatetime = () => {
  const date = new Date()
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  if (month <= 9) {
    month = `0${month}`
  }
  let day = date.getDate()
  if (day <= 9) {
    day = `0${day}`
  }
  let hour = date.getHours()
  if (hour <= 9) {
    hour = `0${hour}`
  }
  let minute = date.getMinutes()
  if (minute <= 9) {
    minute = `0${minute}`
  }
  return `${year}-${month}-${day}T${hour}:${minute}`
}

class MatchForm extends Component {
  constructor(props) {
    super(props)
    let playedAt = props.playedAt
    if (!props.id && !playedAt) {
      playedAt = currentDatetime()
    }
    this.state = {
      rank: props.rank || '',
      result: props.result || '',
      comment: props.comment || '',
      map: props.map || '',
      group: props.group || '',
      heroes: props.heroes || '',
      playedAt,
      playOfTheGame: typeof props.playOfTheGame === 'boolean' ? props.playOfTheGame : false,
      allyThrower: typeof props.allyThrower === 'boolean' ? props.allyThrower : false,
      allyLeaver: typeof props.allyLeaver === 'boolean' ? props.allyLeaver : false,
      enemyThrower: typeof props.enemyThrower === 'boolean' ? props.enemyThrower : false,
      enemyLeaver: typeof props.enemyLeaver === 'boolean' ? props.enemyLeaver : false
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.rank !== this.props.rank) {
      this.setState(prevState => ({ rank: this.props.rank }))
    }
    if (prevProps.result !== this.props.result) {
      this.setState(prevState => ({ result: this.props.result }))
    }
    if (prevProps.comment !== this.props.comment) {
      this.setState(prevState => ({ comment: this.props.comment }))
    }
    if (prevProps.map !== this.props.map) {
      this.setState(prevState => ({ map: this.props.map }))
    }
    if (prevProps.group !== this.props.group) {
      this.setState(prevState => ({ group: this.props.group }))
    }
    if (prevProps.heroes !== this.props.heroes) {
      this.setState(prevState => ({ heroes: this.props.heroes }))
    }
    if (prevProps.playedAt !== this.props.playedAt) {
      this.setState(prevState => ({ playedAt: this.props.playedAt }))
    }
    if (prevProps.playOfTheGame !== this.props.playOfTheGame) {
      this.setState(prevState => ({ playOfTheGame: this.props.playOfTheGame }))
    }
    if (prevProps.allyThrower !== this.props.allyThrower) {
      this.setState(prevState => ({ allyThrower: this.props.allyThrower }))
    }
    if (prevProps.allyLeaver !== this.props.allyLeaver) {
      this.setState(prevState => ({ allyLeaver: this.props.allyLeaver }))
    }
    if (prevProps.enemyThrower !== this.props.enemyThrower) {
      this.setState(prevState => ({ enemyThrower: this.props.enemyThrower }))
    }
    if (prevProps.enemyLeaver !== this.props.enemyLeaver) {
      this.setState(prevState => ({ enemyLeaver: this.props.enemyLeaver }))
    }
  }

  onSubmit = event => {
    event.preventDefault()
    const { rank, comment, map, group, heroes, playedAt,
            allyThrower, allyLeaver, enemyThrower, enemyLeaver,
            playOfTheGame, result } = this.state
    const { accountID, db, season, isPlacement, id } = this.props
    const data = {
      comment,
      map,
      group,
      accountID,
      heroes,
      playedAt,
      allyThrower,
      allyLeaver,
      enemyThrower,
      enemyLeaver,
      playOfTheGame,
      season,
      isPlacement,
      _id: id,
      result: result === '' ? null : result
    }
    if (typeof rank === 'string' && rank.length > 0) {
      data.rank = parseFloat(rank)
    } else if (typeof rank === 'number') {
      data.rank = rank
    }
    const match = new Match(data)
    match.save(db).then(() => {
      if (id) {
        this.props.onUpdate()
      } else {
        this.props.onCreate()
      }
    })
  }

  onCommentChange = event => {
    const comment = event.target.value
    this.setState(prevState => ({ comment }))
  }

  onMapChange = map => {
    this.setState(prevState => ({ map }))
  }

  onRankChange = event => {
    const rank = event.target.value
    this.setState(prevState => ({ rank }))
  }

  onResultChange = event => {
    const result = event.target.value
    this.setState(prevState => ({ result }))
  }

  onGroupChange = event => {
    const group = event.target.value
    this.setState(prevState => ({ group }))
  }

  onPlayedAtChange = event => {
    const playedAt = event.target.value
    this.setState(prevState => ({ playedAt }))
  }

  onHeroChange = (hero, isSelected) => {
    this.setState(prevState => {
      const heroes = prevState.heroes.split(',')
        .map(str => str.trim())
        .filter(str => str && str.length > 0)
      const heroIndex = heroes.indexOf(hero)
      if (isSelected && heroIndex < 0) {
        heroes.push(hero)
      }
      if (!isSelected && heroIndex > -1) {
        delete heroes[heroIndex]
      }
      return { heroes: heroes.join(', ') }
    })
  }

  onAllyThrowerChange = event => {
    const allyThrower = event.target.checked
    this.setState(prevState => ({ allyThrower }))
  }

  onAllyLeaverChange = event => {
    const allyLeaver = event.target.checked
    this.setState(prevState => ({ allyLeaver }))
  }

  onEnemyThrowerChange = event => {
    const enemyThrower = event.target.checked
    this.setState(prevState => ({ enemyThrower }))
  }

  onEnemyLeaverChange = event => {
    const enemyLeaver = event.target.checked
    this.setState(prevState => ({ enemyLeaver }))
  }

  onPlayOfTheGameChange = event => {
    const playOfTheGame = event.target.checked
    this.setState(prevState => ({ playOfTheGame }))
  }

  render() {
    const { rank, comment, map, group, heroes, playedAt,
            allyThrower, allyLeaver, enemyThrower, enemyLeaver,
            playOfTheGame, result } = this.state
    const { season, latestRank, isPlacement, isLastPlacement } = this.props

    return (
      <form
        onSubmit={this.onSubmit}
        className="mb-4"
      >
        <div className="clearfix">
          <div className="col-md-12 col-lg-5 float-left pr-3-md">
            <div className="d-flex-md mb-2 flex-items-center-md flex-justify-between-md">
              <dl className="form-group my-0">
                <dt>
                  {isPlacement ? (
                    <label
                      htmlFor="match-result"
                      className="label-lg"
                    >What was the outcome?</label>
                  ) : (
                    <label
                      htmlFor="match-rank"
                      className="label-lg"
                    >New SR:</label>
                  )}
                </dt>
                <dd>
                  {isPlacement ? (
                    <select
                      className="form-select select-lg"
                      value={result}
                      id="match-result"
                      autoFocus
                      onChange={this.onResultChange}
                    >
                      <option value=""></option>
                      <option value="win">Win</option>
                      <option value="loss">Loss</option>
                      <option value="draw">Draw</option>
                    </select>
                  ) : (
                    <input
                      id="match-rank"
                      type="number"
                      className="form-control sr-field"
                      value={rank}
                      onChange={this.onRankChange}
                      placeholder={latestRank}
                      autoFocus
                    />
                  )}
                </dd>
              </dl>
              <dl className="form-group my-0">
                <dt>
                  <label
                    htmlFor="match-map"
                  >Map:</label>
                </dt>
                <dd>
                  <MapSelect map={map} onChange={this.onMapChange} />
                </dd>
              </dl>
            </div>
            {isPlacement && isLastPlacement ? (
              <dl className="form-group mt-0">
                <dt>
                  <label
                    htmlFor="match-rank"
                    className="sr-field-label"
                  >Where did you place?</label>
                </dt>
                <dd>
                  <input
                    id="match-rank"
                    type="number"
                    className="form-control sr-field"
                    value={rank}
                    onChange={this.onRankChange}
                    placeholder={latestRank}
                  />
                </dd>
              </dl>
            ) : ''}
            <dl className="form-group mt-0">
              <dt>
                <label
                  htmlFor="match-comment"
                >Comment:</label>
              </dt>
              <dd>
                <input
                  id="match-comment"
                  type="text"
                  className="form-control"
                  value={comment}
                  onChange={this.onCommentChange}
                  placeholder="Notes about this game"
                />
              </dd>
            </dl>
            <dl className="form-group">
              <dt>
                <label
                  htmlFor="match-group"
                >Group members:</label>
              </dt>
              <dd>
                <input
                  id="match-group"
                  type="text"
                  className="form-control"
                  value={group}
                  onChange={this.onGroupChange}
                  placeholder="Separate names with commas"
                />
              </dd>
            </dl>
            <dl className="form-group">
              <dt>
                <label
                  htmlFor="match-played-at"
                >Date played:</label>
              </dt>
              <dd>
                <input
                  id="match-played-at"
                  type="datetime-local"
                  className="form-control"
                  value={playedAt}
                  onChange={this.onPlayedAtChange}
                />
              </dd>
            </dl>
            <div className="form-checkbox mr-4 my-1">
              <label className="text-normal">
                <input
                  type="checkbox"
                  checked={playOfTheGame}
                  onChange={this.onPlayOfTheGameChange}
                />
                Play of the game
              </label>
            </div>
          </div>
          <div className="col-md-12 col-lg-6 float-right">
            <dl className="form-group my-0">
              <dt className="text-bold">Heroes played:</dt>
              <dd>
                <HeroSelect
                  heroes={heroes}
                  season={season}
                  onToggle={this.onHeroChange}
                />
              </dd>
            </dl>
          </div>
        </div>
        <div className="d-flex flex-wrap mb-3">
          <div className="rounded-2 border bg-gray-light d-flex mr-4 px-2">
            <div className="form-checkbox mr-4 my-1">
              <label className="text-normal text-ally">
                <input
                  type="checkbox"
                  checked={allyThrower}
                  onChange={this.onAllyThrowerChange}
                />
                Thrower on my team
              </label>
            </div>
            <div className="form-checkbox my-1">
              <label className="text-normal text-enemy">
                <input
                  type="checkbox"
                  checked={enemyThrower}
                  onChange={this.onEnemyThrowerChange}
                />
                Thrower on the enemy team
              </label>
            </div>
          </div>
          <div className="rounded-2 border bg-gray-light d-flex px-2">
            <div className="form-checkbox mr-4 my-1">
              <label className="text-normal text-ally">
                <input
                  type="checkbox"
                  checked={allyLeaver}
                  onChange={this.onAllyLeaverChange}
                />
                Leaver on my team
              </label>
            </div>
            <div className="form-checkbox my-1">
              <label className="text-normal text-enemy">
                <input
                  type="checkbox"
                  checked={enemyLeaver}
                  onChange={this.onEnemyLeaverChange}
                />
                Leaver on the enemy team
              </label>
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-large">Save match</button>
        </div>
      </form>
    )
  }
}

export default MatchForm
