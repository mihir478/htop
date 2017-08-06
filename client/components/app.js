import React from 'react';

export default class App extends React.Component {
  render() {
    const socket = require('socket.io-client')('http://localhost:3333');
    if (process.argv[2] && process.argv[3]) {
      socket.on('connect', function () {
        socket.emit(process.argv[2], process.argv[3]);
        setTimeout(() => {
          process.exit(0);
        }, 10);
      });
    } else {
      socket.on('memory', function(msg) {
        console.log('memory', msg);
      })
      socket.on('currentLoad', function(msg) {
        console.log('currentLoad', msg);
      })
      socket.on('processes', function(msg) {
        console.log('processes', msg);
      })
    }
    return <h1>Hello</h1>;
  }
}
