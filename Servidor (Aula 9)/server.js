require("colors")
var http = require("http")
var express = require("express")
let bodyParser = require("body-parser")
var mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const uri = "mongodb+srv://alessandrafernds29:FX1wReuNNwV3CQOr@cluster0.jvi8m5z.mongodb.net/?appName=Cluster0"

const client = new MongoClient(uri, { useNewUrlParser: true })

var dbo = client.db("exemplo_bd");
var usuarios = dbo.collection("usuarios");

var app = express()

app.use(express.static("./public"))
app.use(bodyParser.urlencoded({extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'ejs')
app.set('views', './views');

var server = http.createServer(app)
server.listen(80)

console.log("Servidor rodando...".rainbow)

app.get("/", function(req, res){
    res.redirect("home.html")
})

app.get("/inicio", function(req, res){
    var text = req.query.text
    var number = req.query.number
    var color = req.query.color

    console.log(text, number, color);
    console.log("requisição feita por GET")
})

app.post("/inicio", function(req, res){
    var text = req.body.text
    var number = req.body.number
    var color = req.body.color

    console.log(text, number, color);
    console.log("requisição feita por POST")
})

app.post("/cadastro", function(req, res){
    var nome = req.body.nome
    var login = req.body.login
    var senha = req.body.senha

    console.log(nome, login, senha);

    res.render("resposta.ejs", {resposta: "Usuário cadastrado com sucesso!"})
    })

app.get("/for", function(req, res){
    var qtde = req.query.qtde;
    res.render("exemplo_for.ejs",{qtde: qtde})
})

app.post("/cadastrar_usuario", function(req, res){

    var data = {
        db_nome: req.body.nome, 
        db_login: req.body.login, 
        db_senha: req.body.senha
    }

    usuarios.insertOne(data, function (err) {
        console.log(err);
        if (err) {
            res.render('resposta_usuario.ejs', {resposta: "Erro ao cadastrar usuário!"})
        }else {
            res.render('resposta_usuario.ejs', {resposta: "Usuário cadastrado com sucesso!"})        
      };
    });
 
}) 

app.post("/logar_usuario", function(req, res) {
    var data = {
        db_login: req.body.login,
         db_senha: req.body.senha
};

    usuarios.find(data).toArray(function(err, items) {
      console.log(items);
      if (items.length == 0) {
        res.render('resposta_usuario.ejs', {resposta: "Usuário/senha não encontrado!"})
      }else if (err) {
        res.render('resposta_usuario.ejs', {resposta: "Erro ao logar usuário!"})
      }else {
        res.render('resposta_usuario.ejs', {resposta: "Usuário logado com sucesso!"})        
      };
    });

  });
