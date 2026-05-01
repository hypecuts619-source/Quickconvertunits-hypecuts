import fetch from "node-fetch";

async function test() {
  const res = await fetch("http://localhost:3000/meter-to-foot");
  const html = await res.text();
  console.log(html.substring(html.indexOf('<div style="display:none;" aria-hidden="true"'), html.indexOf('</div>', html.indexOf('<div style="display:none;" aria-hidden="true"')) + 2000));
}

test();
