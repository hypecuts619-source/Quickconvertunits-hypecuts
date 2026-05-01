import fetch from 'node-fetch';

async function test() {
  const res = await fetch('http://localhost:3000/meter-to-foot');
  const text = await res.text();
  console.log(text);
}

test();
