// var io = require('socket.io')
import io from 'socket.io-client'
var socket = io.connect("localhost:3000")

socket.emit('event', {aaa: 'aaa'})