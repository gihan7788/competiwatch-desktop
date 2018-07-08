import React, { Component } from 'react'
import Header from './components/Header'
import Account from './models/Account'
import Match from './models/Match'
import Season from './models/Season'
import AccountsPage from './components/AccountsPage'
import MatchesPage from './components/MatchesPage'
import MatchFormPage from './components/MatchFormPage'
import './primer.css'
import './ionicons.min.css'
import './App.css'

const latestKnownSeason = 11

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activePage: 'accounts',
      latestRank: 2500,
      isPlacement: false,
      latestSeason: latestKnownSeason
    }
    this.db = {}
    this.db.accounts = Account.setupDatabase()
    this.db.matches = Match.setupDatabase()
    this.db.seasons = Season.setupDatabase()
  }

  setActiveSeason = season => {
    this.setState(prevState => {
      const newState = { activeSeason: season }
      if (season > prevState.latestSeason) {
        newState.latestSeason = season
      }
      return newState
    })
  }

  componentDidMount() {
    Season.latest(this.db.seasons).then(number => {
      if (number) {
        this.setActiveSeason(number)
      } else {
        this.setState(prevState => ({ activeSeason: latestKnownSeason }))
      }
    })
  }

  loadMatchesForAccount = accountID => {
    this.setState(prevState => ({ activeAccountID: accountID, activePage: 'matches' }))
  }

  setIsPlacement = (isPlacement, isLastPlacement) => {
    this.setState(prevState => ({ isPlacement, isLastPlacement }))
  }

  changeActiveSeason = activeSeason => {
    this.setState(prevState => ({ activeSeason }))
  }

  changeActivePage = (activePage, latestRank) => {
    this.setState(prevState => {
      const newState = { activePage }

      if (typeof latestRank === 'number') {
        newState.latestRank = latestRank
        newState.isPlacement = false
        newState.isLastPlacement = false
      }

      if (activePage === 'accounts') {
        newState.activeAccountID = null
        newState.latestRank = 2500
        newState.isPlacement = false
        newState.isLastPlacement = false
      }

      return newState
    })
  }

  renderActivePage = () => {
    const { activePage, activeAccountID, latestRank, isPlacement,
            isLastPlacement, activeSeason } = this.state

    if (activePage === 'matches') {
      return (
        <MatchesPage
          accountID={activeAccountID}
          season={activeSeason}
          dbAccounts={this.db.accounts}
          dbMatches={this.db.matches}
          onPageChange={this.changeActivePage}
          setIsPlacement={this.setIsPlacement}
        />
      )
    }

    if (activePage === 'log-match') {
      return (
        <MatchFormPage
          accountID={activeAccountID}
          dbAccounts={this.db.accounts}
          dbMatches={this.db.matches}
          onPageChange={this.changeActivePage}
          latestRank={latestRank}
          isPlacement={isPlacement}
          season={activeSeason}
          isLastPlacement={isLastPlacement}
        />
      )
    }

    return (
      <AccountsPage
        dbAccounts={this.db.accounts}
        dbMatches={this.db.matches}
        season={activeSeason}
        loadMatchesForAccount={this.loadMatchesForAccount}
      />
    )
  }

  render() {
    const { activePage, activeAccountID, activeSeason, latestSeason } = this.state

    return (
      <div className="layout-container">
        <Header
          dbSeasons={this.db.seasons}
          activePage={activePage}
          activeAccountID={activeAccountID}
          onPageChange={this.changeActivePage}
          activeSeason={activeSeason}
          latestSeason={latestSeason}
          onSeasonChange={this.changeActiveSeason}
          onSeasonCreate={this.setActiveSeason}
        />
        {this.renderActivePage()}
      </div>
    )
  }
}

export default App
