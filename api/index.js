const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const originalDbPath = path.join(__dirname, '..', 'db', 'db.json');
const tempDbPath = '/tmp/db.json';

const port = process.env.PORT || 3000;

if (!fs.existsSync(tempDbPath)) {
  fs.copyFileSync(originalDbPath, tempDbPath);
}

const server = jsonServer.create();
const router = jsonServer.router(tempDbPath);
const middlewares = jsonServer.defaults({ static: path.join(process.cwd(), 'public') });
const db = router.db;

const SECRET_KEY = 'sua_chave_secreta_aqui';

function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

function isAuthenticated({ email, senha }) {
    return db.get('usuarios').find({ email, senha }).value();
}

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
        }
        req.user = user;
        next(); 
    });
}

server.use((req, res, next) => {
  console.log(`[CORS Middleware] Rota acessada: ${req.method} ${req.url}`);
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

server.use(middlewares);

server.use(jsonServer.bodyParser);

server.use((err, req, res, next) => {
    console.error('Erro interno do servidor:', err);
    if (res.headersSent) {
        return next(err); 
    }
    res.status(500).json({ mensagem: 'Erro interno do servidor.', detalhes: err.message });
});

server.post('/register', (req, res) => {
    const { nome, email, senha, celular } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Nome, email e senha são obrigatórios.' });
    }

    const userExists = db.get('usuarios').find({ email }).value();
    if (userExists) {
        return res.status(409).json({ mensagem: 'Email já cadastrado.' });
    }

    const newUserId = db.get('usuarios').size().value() + 1;
    const newUser = { 
        id: newUserId, 
        nome, 
        email, 
        senha, 
        celular,
        bio: '', 
        avatar: '/assets/img/user.png'
    };
    
    db.get('usuarios').push(newUser).write();

    const token = generateToken({ id: newUserId, email, nome });
    return res.status(201).json({ 
        mensagem: 'Usuário registrado com sucesso.', 
        token, 
        usuario: newUser
    });
});

server.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
    }

    const user = isAuthenticated({ email, senha });

    if (!user) {
        return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
    }

    console.log('User object just before response:', user);

    const token = generateToken({ id: user.id, email: user.email, nome: user.nome, celular: user.celular });
    return res.status(200).json({ 
        mensagem: 'Login realizado com sucesso.', 
        token, 
        usuario: user
    });
});

server.get('/api/perfil', verifyToken, (req, res) => {
    res.json({ mensagem: `Bem-vindo ao seu perfil, ${req.user.nome}!`, usuario: req.user });
});

server.patch('/usuarios/:id', verifyToken, (req, res) => {
    if (Number(req.user.id) !== Number(req.params.id)) {
        return res.status(403).json({ mensagem: 'Acesso negado. Você só pode atualizar seu próprio perfil.' });
    }

    const userChain = db.get('usuarios').find({ id: Number(req.params.id) });

    if (!userChain.value()) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    const updatedUser = userChain.assign(req.body).write();

    res.status(200).json({
        mensagem: 'Perfil atualizado com sucesso.',
        usuario: updatedUser
    });
});

server.get('/', (req, res) => {
  res.json({ mensagem: 'Hello World do backend Helpstress!' });
});

server.use(router);

module.exports = server; 