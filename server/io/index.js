'use strict';
var socketio = require('socket.io');
var io = null;
var db = require('../db');
//var Snippet = db.model('snippet');

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        
        //For each snippet id passed with the 'create' event, create/join a room for shared editing of that snippet
    	socket.on('joinSnippetRoom', function (snippetId) {
  			socket.join(snippetId);
		});

        socket.on('leaveSnippetRoom', function (snippetId){
            socket.leave(snippetId);
        })

    	//on client-side: socket.emit('edit', { snippetId: snippetId, changes: changes });
		socket.on('edit', function(data){
		    io.in(data.snippetId).broadcast.emit('edited', data);
		});

        //
        // socket.on('saveEdits', function(data){
        //     Snippet.update(data.changes, {where: {id: data.snippetId}})
        //     .then(function(){
        //         io.in(data.snippetId).broadcast.emit('edited', data);
        //     })
        // });


    });
    
    return io;

};
