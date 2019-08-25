const WebSocket = require('ws');
const fs = require('fs');
 
const wss = new WebSocket.Server({ port: 30002 });

noop = () => {}

function heartbeat() {
	console.log('pong');
	this.isAlive = true;
}
 
wss.on('connection', function connection(ws, req) {
	ws.isAlive = true;
	const ip = req.connection.remoteAddress;
	console.log(`${ip} is connected`);
	ws.url = req.url;

	ws.on('pong', heartbeat);

	ws.on('close', () => {
		console.log(ws.url, 'is disconnected');
	})

	ws.on('message', function incoming(data) {
		const dataArray = data.split('_$_');

		const dataTime = dataArray[0];
		const dataUser = dataArray[1];
		const dataTeam = dataArray[2];
		const dataMessage = dataArray[3];
		const dataFlag = dataArray[4];


		if (dataFlag === 't') {
			fs.appendFile(`./chatLog/${dataTeam}.txt`, `${data}_%_`, (err) =>{
				if(err) {
					console.log('append File error', dataTeam);
				}
			})

			if (dataMessage === 'init') {
				ws.userId = dataArray[1];
				console.log('new Init');
				fs.readFile(`./chatLog/${dataTeam}.txt`, 'utf-8', (err, data) => {
					if (err){
						throw err;
					}
					const dataArray = data.split('_%_');
					for(let i=0; i<(dataArray.length-1); i++){
						if(dataArray[i].split('_$_')[3] !== 'init') {
							ws.send(dataArray[i]);
						}
					}
				})
			} else {
				console.log(ws.url, data);
				console.log('userId : ', ws.userId);
				wss.clients.forEach(function each(client) {
					console.log('client id', client.userId);
					if (client.readyState === WebSocket.OPEN && client.url === ws.url) {
						client.send(data);
					}
				});
			}
		}
	});
});

const interval = setInterval(function ping() {
	wss.clients.forEach(function each(ws) {
		if (ws.isAlive === false) {
			return ws.terminate();
		}
		ws.isAlive = false;
		ws.ping(noop);
	});
}, 30000);