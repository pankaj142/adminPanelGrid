var express = require("express");
var path    = require("path");
var app =express();

app.use(express.static('client'))

//routes
app.get('*', (req,res)=> {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.listen(3000,()=>{
	console.log("server is listening on 3000")})