var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var si = require('systeminformation');
var ps = require('ps-node');
var path = require('path');
var favicon = require('serve-favicon');

var loadHistory = {currentload: [], cpus: {}};
loadHistory.currentload = new Array(30);

io.on('connection', function (socket) {
  socket.on('action', function(msg) {
    ps.kill(msg.PID, msg.action, function( err ) {
      if (err) {
        console.log(err);
      } else {
        console.log( 'Process %s has been killed without a clean-up!', msg.PID );
      }
    });
  });
});

setInterval(function() {
  si.mem(function(data) {
    io.emit('memory', data);
  });

  si.currentLoad(function(data) {
    loadHistory['currentload'].push(data.currentload.toFixed(2));
    data.cpus.forEach(function(cpu, index) {
      var cpuName = "CPU " + index;

      if(!loadHistory['cpus'][cpuName]) {
        loadHistory['cpus'][cpuName] = new Array(30);
      };

      loadHistory['cpus'][cpuName].push(Number(cpu.load).toFixed(2));

      if (loadHistory['cpus'][cpuName].length > 30) {
        loadHistory['cpus'][cpuName].shift();
      }
    }, this);


    if (loadHistory['currentload'].length > 30) {
      loadHistory['currentload'].shift();
    }

    data.loadHistory = loadHistory;
    io.emit('currentLoad', data);
  });

  // Does not work on windows (partial support)
  // si.processes(function(processes) {
  //   io.emit('processes', processes.list.map(function(process){
  //     process['CPU%'] = process['pcpu'] + '%'
  //     process['MEM%'] = process['pmem'] + '%'
  //     process['VIRT'] = process['mem_vsz']
  //     process['RES'] = process['mem_rss']
  //     return process;
  //   }));
  // });
}, 1000);
server.listen(3333);

// VIEW ENGINE //
app.set('view engine', 'html');
app.engine('html', function(path, options, callbacks) {
  fs.readFile(path, 'utf-8', callbacks);
});

// MIDDLEWARE //
app.use(express.static(path.join(__dirname, '../client')));
app.use(favicon(path.join(__dirname, 'favicon.ico')));

// ERROR //
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});

// SERVE APP //
var port = 8000;
app.listen(port, function() {
  console.log('running at port:' + port);
});

module.exports = app;
