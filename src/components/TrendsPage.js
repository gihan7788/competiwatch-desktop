import React, { Component } from 'react'
import { defaults } from 'react-chartjs-2'
import LoadingPage from './LoadingPage'
import WinLossChart from './WinLossChart'
import ThrowerLeaverChart from './ThrowerLeaverChart'
import StreaksChart from './StreaksChart'
import Match from '../models/Match'
import Color from '../models/Color'
import './TrendsPage.css'

class TrendsPage extends Component {
  constructor(props) {
    super(props)
    this.state = { matches: [], hasLoaded: false }
  }

  refreshMatches = () => {
    const { accountID, season } = this.props

    Match.findAll(accountID, season).then(matches => {
      this.setState(prevState => ({ matches, hasLoaded: true }))
    })
  }

  chartFontColor = () => {
    if (this.props.theme === 'dark') {
      return Color.darkThemeText
    }

    return Color.lightThemeText
  }

  componentDidMount() {
    this.refreshMatches()
    defaults.global.defaultFontColor = this.chartFontColor()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.season !== this.props.season ||
        prevProps.accountID !== this.props.accountID) {
      this.refreshMatches()
    }
  }

  render() {
    const { matches, hasLoaded } = this.state
    if (!hasLoaded) {
      return <LoadingPage />
    }

    const { season } = this.props
    return (
      <div className="container mb-4 layout-children-container">
        <div className="clearfix">
          <div className="col-md-5 float-md-left">
            <WinLossChart season={season} matches={matches} />
          </div>
          <div className="col-md-5 offset-md-2 float-md-left">
            <ThrowerLeaverChart season={season} matches={matches} />
          </div>
        </div>
        <hr className="mb-4 pt-4" />
        <StreaksChart season={season} matches={matches} />
      </div>
    )
  }
}

export default TrendsPage