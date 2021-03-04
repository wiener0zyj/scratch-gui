let express         = require('express');
let path             = require('path');
let router           = express.Router();

router.get('/', function(req, res, next){
  console.log('scratch home page');
  res.sendFile(path.join(__dirname, '../build', 'index.html')); 
});

module.exports = router;