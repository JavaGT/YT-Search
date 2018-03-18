# YT-Search
This package returns an array of objects containing information about the top youtube search results for a given string query.

Usage: 
```
npm i --save git+https://git@github.com/JavaGT/YT-Search
```
```
// index.js
let search = require('yt-search')
search('Youtube Video Query')
  .then(results=>console.log)
```
