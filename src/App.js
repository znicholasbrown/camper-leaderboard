import React, { Component } from 'react';
import logo from './fcclogo.svg';
import './App.css';
import { Button, Table } from 'react-materialize';

class App extends Component {
  render() {
    return (
      <div>
        <AppHeader/>
        <DataMain/>
        <div className="copyright">
          <p>
            &#169;2017&nbsp;
             <a href="https://znicholasbrown.github.io" rel="noopener noreferrer" target="_blank">Z Nicholas Brown</a>
          </p>
        </div>
      </div>
    );
  }
}

class AppHeader extends Component {
  render() {
    return (
        <div className="header">
          <img src={logo} className="logo" alt="logo" />
          <h1>Camper Leaderboard</h1>
        </div>
    )
  }
}
class DataMain extends Component {
  constructor(props) {
    super(props);

    this.state = { RecentorAll: 1, thirtyActive: "active", allActive: "" };
  }
  changeAll = () => {
    this.setState({ RecentorAll: 2 });
    this.setState({ allActive: "active" });
    this.setState({ thirtyActive: "" });
  }
  changeRecent = () => {
    this.setState({ RecentorAll: 1 });
    this.setState({ allActive: "" });
    this.setState({ thirtyActive: "active" });
  }
  render() {
    return (
      <div className="data-container">
        <h4>Top Campers</h4>
        <Button className={"sort-button " + this.state.thirtyActive} waves='light' onClick={ this.changeRecent }>Last 30 days</Button>
        <Button className={"sort-button " + this.state.allActive} waves='light' onClick={ this.changeAll }>All time</Button>
        <CamperTable RecentorAll={ this.state.RecentorAll }/>
      </div>
    )
  }
}

class CamperRows extends Component {
  constructor(props) {
    super(props);

    this.state = {campersAllTime: [], campersRecent: []};
  }
  componentDidMount() {
    this.getAllTime();
    this.getRecent();
  }
  getAllTime() {
    return fetch('https://fcctop100.herokuapp.com/api/fccusers/top/alltime')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({campersAllTime: responseJson})
      });
  }
  getRecent() {
    return fetch('https://fcctop100.herokuapp.com/api/fccusers/top/recent')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({campersRecent: responseJson})
    });
  }
  render() {
    const sortVariable = this.props.sortVariable, sortOrder = this.props.sortOrder, recentAll = this.props.RecentorAll;

    const camperList = (recentAll === 1 ? (this.state.campersRecent) : (this.state.campersAllTime))
    .sort(function(a,b){
        return (sortVariable === 1 ? (
          sortOrder === 1 ? (b.recent - a.recent) : (a.recent - b.recent)) : (
            sortOrder === 1 ? (b.alltime - a.alltime) : (a.alltime - b.alltime)))})
            .map((item, i) => {
      return (
        <tr key={i}>
            <td className="camper-rank-cell"> { i + 1 } </td>
            <td className="camper-icon-cell"><img className="camper-icons" src={ item.img } alt="icon"/></td>
            <td className="camper-name-cell"><a href={"https://www.freecodecamp.org/" + item.username} className="row-link" rel="noopener noreferrer" target="_blank">{ item.username }</a></td>
            <td className="camper-points-cell">{ item.recent }</td>
            <td className="camper-points-cell">{ item.alltime }</td>
        </tr>
      )
    })
    return (
      <tbody>
        { camperList }
      </tbody>
    )
  }
}

class CamperTable extends Component {
  constructor(props) {
    super(props);

    this.state = { sortOrder: 1, sortVariable: 1 };
  }

  sortVariableOne = () => {
    this.setState({ sortOrder: this.state.sortOrder === 1 ? 2 : 1 });
    this.setState({ sortVariable: 1 })
  }
  sortVariableTwo = () => {
    this.setState({ sortOrder: this.state.sortOrder === 1 ? 2 : 1 });
    this.setState({ sortVariable: 2 })
  }
  render() {
    return (
      <Table striped={true} className="camper-table">
        <thead>
          <tr>
            <th className="camper-rank-cell"></th>
            <th className="camper-icon-cell">Icon</th>
            <th className="camper-name-cell">Camper</th>
            <th className="camper-points-cell pointer" onClick={ this.sortVariableOne }>Points (last 30 days)<div className="table-sort">(click to sort)</div></th>
            <th className="camper-points-cell pointer" onClick={ this.sortVariableTwo }>Points (all time)<div className="table-sort">(click to sort)</div></th>
          </tr>
        </thead>
          <CamperRows RecentorAll = { this.props.RecentorAll } sortOrder = { this.state.sortOrder } sortVariable = { this.state.sortVariable }/>
      </Table>
    )
  }
}

export default App;
