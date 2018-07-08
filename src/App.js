import React, { Component } from 'react'
import Header from './components/Header'
import Account from './models/Account'
import Match from './models/Match'
import AccountsPage from './components/AccountsPage'
import MatchesPage from './components/MatchesPage'
import MatchFormPage from './components/MatchFormPage'
import './primer.css'
import './ionicons.min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activePage: 'accounts',
      latestRank: 2500,
      isPlacement: false
    }
    this.db = {}
    this.db.accounts = Account.setupDatabase()
    this.db.matches = Match.setupDatabase()
  }

  loadMatchesForAccount = accountID => {
    this.setState(prevState => ({ activeAccountID: accountID, activePage: 'matches' }))
  }

  setIsPlacement = (isPlacement, isLastPlacement) => {
    this.setState(prevState => ({ isPlacement, isLastPlacement }))
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
            isLastPlacement } = this.state

    if (activePage === 'matches') {
      return (
        <MatchesPage
          accountID={activeAccountID}
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
          isLastPlacement={isLastPlacement}
        />
      )
    }

    return (
      <AccountsPage
        dbAccounts={this.db.accounts}
        dbMatches={this.db.matches}
        loadMatchesForAccount={this.loadMatchesForAccount}
      />
    )
  }

  render() {
    const { activePage, activeAccountID } = this.state

    return (
      <div className="layout-container">
        <Header
          activePage={activePage}
          activeAccountID={activeAccountID}
          onPageChange={this.changeActivePage}
        />
        {this.renderActivePage()}
      </div>
    )
  }
}

export default App
