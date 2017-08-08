import React from 'react';

const socketClient = require('socket.io-client');

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      memory: [],
      currentLoad: [],
      processes: [],
    };
  }

  componentDidMount() {
    this.initSocketEvents();
  }

  initSocketEvents() {
    const socket = socketClient('http://localhost:3333');
    if (process.argv[2] && process.argv[3]) {
      socket.on('connect', () => {
        socket.emit(process.argv[2], process.argv[3]);
        setTimeout(() => {
          process.exit(0);
        }, 10);
      });
    } else {
      socket.on('memory', (msg) => {
        console.log('memory', msg);
      });
      socket.on('currentLoad', (msg) => {
        console.log('currentLoad', msg);
      });
      socket.on('processes', (msg) => {
        console.log('processes', msg);
      });
    }
  }

  updateMemory() {

  }

  updatecurrentLoad() {

  }

  render() {
    return <h1>Hello</h1>;
  }
}
