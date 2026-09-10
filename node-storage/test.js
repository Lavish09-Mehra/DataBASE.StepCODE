import http from 'http';

const BASE = 'http://localhost:3000';

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  PASS: ${label}`);
    passed++;
  } else {
    console.log(`  FAIL: ${label}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- Health ---');
  const health = await request('GET', '/health');
  assert('GET /health returns 200', health.status === 200);
  assert('health status is ok', health.body.status === 'ok');

  console.log('\n--- CREATE ---');
  const create1 = await request('POST', '/storeData', { val: { name: 'Lavish', age: 18 } });
  assert('POST /storeData returns 201', create1.status === 201);
  assert('record has pass_id 1', create1.body.data.pass_id === 1);
  assert('record val matches', create1.body.data.val.name === 'Lavish');

  const create2 = await request('POST', '/storeData', { val: { code: "import express from 'express';\n\nconst app = express();", language: 'javascript' } });
  assert('POST code record returns 201', create2.status === 201);
  assert('code record has pass_id 2', create2.body.data.pass_id === 2);

  console.log('\n--- VALIDATION ---');
  const noVal = await request('POST', '/storeData', { foo: 'bar' });
  assert('missing val returns 400', noVal.status === 400);
  assert('error message for missing val', noVal.body.error === 'val is required');

  const badVal = await request('POST', '/storeData', { val: 'string' });
  assert('non-object val returns 400', badVal.status === 400);

  const proto = await request('POST', '/storeData', { val: { __proto__: { polluted: true } } });
  assert('proto pollution blocked', proto.status === 400);

  console.log('\n--- GET ALL ---');
  const all = await request('GET', '/storeData');
  assert('GET /storeData returns 200', all.status === 200);
  assert('returns 2 records', all.body.data.length === 2);

  console.log('\n--- GET ONE ---');
  const one = await request('GET', '/storeData/1');
  assert('GET /storeData/1 returns 200', one.status === 200);
  assert('correct record returned', one.body.data.pass_id === 1);

  const notFound = await request('GET', '/storeData/999');
  assert('GET /storeData/999 returns 404', notFound.status === 404);

  const badId = await request('GET', '/storeData/abc');
  assert('GET /storeData/abc returns 400', badId.status === 400);

  console.log('\n--- PUT ---');
  const put = await request('PUT', '/storeData/1', { val: { name: 'Lavish Mehra', age: 19 } });
  assert('PUT returns 200', put.status === 200);
  assert('PUT replaces val', put.body.data.val.name === 'Lavish Mehra');
  assert('PUT id unchanged', put.body.data.pass_id === 1);

  const putNotFound = await request('PUT', '/storeData/999', { val: { x: 1 } });
  assert('PUT nonexistent returns 404', putNotFound.status === 404);

  console.log('\n--- PATCH ---');
  const patch = await request('PATCH', '/storeData/1', { val: { age: 20 } });
  assert('PATCH returns 200', patch.status === 200);
  assert('PATCH merges fields', patch.body.data.val.age === 20);
  assert('PATCH preserves other fields', patch.body.data.val.name === 'Lavish Mehra');

  const patchNotFound = await request('PATCH', '/storeData/999', { val: { x: 1 } });
  assert('PATCH nonexistent returns 404', patchNotFound.status === 404);

  console.log('\n--- SEARCH ---');
  const search1 = await request('GET', '/storeData/search?q=Lavish');
  assert('search Lavish returns results', search1.body.data.length > 0);
  assert('search Lavish finds record 1', search1.body.data.some(r => r.pass_id === 1));

  const searchJs = await request('GET', '/storeData/search?q=javascript');
  assert('search javascript finds code record', searchJs.body.data.some(r => r.pass_id === 2));

  const searchEmpty = await request('GET', '/storeData/search?q=zzzznotfound');
  assert('search no match returns empty', searchEmpty.body.data.length === 0);

  const searchNoQ = await request('GET', '/storeData/search');
  assert('search without q returns 400', searchNoQ.status === 400);

  console.log('\n--- NESTED / ARRAY ---');
  const nested = await request('POST', '/storeData', {
    val: { user: { name: 'Rahul', age: 20 }, skills: ['Rust', 'Node.js', 'Python'] }
  });
  assert('nested record created', nested.status === 201);
  const searchRust = await request('GET', '/storeData/search?q=Rust');
  assert('search Rust finds nested record', searchRust.body.data.some(r => r.pass_id === nested.body.data.pass_id));

  console.log('\n--- UNICODE ---');
  const unicode = await request('POST', '/storeData', { val: { greeting: 'नमस्ते दुनिया', emoji: '🎉🚀' } });
  assert('unicode record created', unicode.status === 201);
  const searchUnicode = await request('GET', '/storeData/search?q=नमस्ते');
  assert('search unicode finds record', searchUnicode.body.data.some(r => r.pass_id === unicode.body.data.pass_id));

  console.log('\n--- LONG STRING ---');
  const longStr = 'x'.repeat(100000);
  const longRec = await request('POST', '/storeData', { val: { data: longStr } });
  assert('long string record created', longRec.status === 201);

  console.log('\n--- SPECIAL CHARS ---');
  const special = await request('POST', '/storeData', { val: { code: 'fn(a, b) { return a < b ? a : b; }' } });
  assert('special chars record created', special.status === 201);
  const searchSpecial = await request('GET', '/storeData/search?q=< b');
  assert('search special chars finds record', searchSpecial.body.data.some(r => r.pass_id === special.body.data.pass_id));

  console.log('\n--- ENCODED ---');
  const encoded = await request('GET', '/storeData/encoded');
  assert('GET /storeData/encoded returns 200', encoded.status === 200);
  assert('encoded data is array', Array.isArray(encoded.body.data));

  console.log('\n--- DELETE ---');
  const del = await request('DELETE', '/storeData/1');
  assert('DELETE returns correct format', del.status === 200 && del.body.message === 'Record deleted');
  assert('DELETE includes pass_id', del.body.pass_id === 1);

  const delNotFound = await request('DELETE', '/storeData/999');
  assert('DELETE nonexistent returns 404', delNotFound.status === 404);

  const afterDel = await request('GET', '/storeData/1');
  assert('deleted record returns 404', afterDel.status === 404);

  console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
