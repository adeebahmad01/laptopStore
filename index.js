const fs = require('fs');
const http = require('http');
const url = require('url');


const json =fs.readFileSync(`${__dirname}/data/data.json`, `utf-8`);
const laptopData = JSON.parse(json)


const server = http.createServer((req,res)=>{

  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;

  if(pathName === `/products` || pathName === '/'){
    res.writeHead(200, {'Content-type': 'text/html'});
    fs.readFile(`${__dirname}/templates/template-overview.html`, `utf-8`,(err,data)=>{
      fs.readFile(`${__dirname}/templates/template-cards.html`, `utf-8`,(err,data2)=>{
        const output = laptopData.map(el => replaceTemplate(data2,el)).join('');
        data = data.replace(/{%CARDS%}/g, output)
        res.end(data)
      })
    })
  }
  
  else if(pathName === `/laptop` && id >= 0 && id < laptopData.length){
    res.writeHead(200, {'Content-type': 'text/html'});
    fs.readFile(`${__dirname}/templates/template-laptop.html`, `utf-8`, (err, data)=>{
      const laptop = laptopData[id]
      const output = replaceTemplate(data, laptop)
      res.end(output)
    })
  }

  else if(/\.(jpg|jpeg|png|gif)$/i.test(pathName)){
    fs.readFile(`${__dirname}/data/img/${pathName}`, (err,data)=>{
      res.writeHead(200, {'Content-type': 'image/jpg'});
      res.end(data)
    })
  }
  else if(/\.(css)$/i.test(pathName)){
    fs.readFile(`${__dirname}/data/css/${pathName}`, (err,data)=>{
      res.writeHead(200);
      res.end(data)
    })
  }
  
  else {
    res.writeHead(404, {'Content-type': 'text/html'});
    res.end('URL not Found')
  }

})
server.listen(process.env.PORT || 3000,()=>{

  console.log(`server is running on port 3000`);
  
})

function replaceTemplate(html,laptop) {
  let output = html.replace(/{%PRODUCTNAME%}/g, laptop.productName);
  output = output.replace(/{%IMAGE%}/g, laptop.image);
  output = output.replace(/{%PRICE%}/g, laptop.price);
  output = output.replace(/{%SCREEN%}/g, laptop.screen);
  output = output.replace(/{%CPU%}/g, laptop.cpu);
  output = output.replace(/{%STORAGE%}/g, laptop.storage);
  output = output.replace(/{%RAM%}/g, laptop.ram);
  output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
  output = output.replace(/{%ID%}/g, laptop.id);
  return output
}
// const laptopPages = laptopData.map((el)=>{
//   store = data.replace(/{%PRODUCTNAME%}/g, el.productName)
//   store = store.replace(/{%IMAGE%}/g, el.image)
//   store = store.replace(/{%PRICE%}/g, el.price)
//   store = store.replace(/{%SCREEN%}/g, el.screen)
//   return store = store.replace(/{%CPU%}/g, el.cpu)
// }).join('')
// res.end(laptopPages)