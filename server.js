require('dotenv').config();
const port = process.env.PORT || 3000;
const { red } = require('ansi-styles');
const { count } = require('console');
const express = require('express');
const app = express();

//////////////////////Middleware/////////////////////////
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

//////////////////////Import Data////////////////////////
const budgets = require('./models/budget');

let bankAccount = 0;
let colorIndicator = '';
const countTotal = () => {
	budgets.forEach((item) => {
		bankAccount += parseInt(item.amount);
	});
};
countTotal();

//////////////////////Routes/////////////////////////

//////Index route///////
app.get('/', (req, res) => {
	res.send('Hello World, Budgtr');
});

app.get('/budgets', (req, res) => {
	res.render('index.ejs', {
		allBudgets: budgets,
		total: bankAccount,
		color: colorIndicator,
	});
});

//////New route///////
app.get('/budgets/new', (req, res) => {
	res.render('new.ejs');
});
//////Show route///////
app.get('/budgets/:index', (req, res) => {
	res.render('show.ejs', { budget: budgets[req.params.index] });
});
//////POST route///////
app.post('/budgets', (req, res) => {
	console.log(req.body);
	budgets.push(req.body);
	bankAccount += parseInt(req.body.amount);
	if (bankAccount > 1000) colorIndicator = 'green';
	if (bankAccount <= 0) colorIndicator = 'red';
	res.redirect('/budgets');
});
//////////////////////////////////////////////////////
app.listen(port, () => {
	console.log('Listening at', port);
});
