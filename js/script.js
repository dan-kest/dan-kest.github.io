/// <reference path="./dterm.js" />

const terminal = document.getElementById('terminal');
const dTerm = new DTerm(terminal);
const container1 = dTerm.newContainer();
container1.setBorder('double');

const text = `\
DDD DDD DDDD
DDD DDD DDDD
DDD DDD DDD
`;

container1.setText(text);
