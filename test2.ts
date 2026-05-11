import { getParsedParamsFromPath, getUnitIdsFromPath, getCanonicalUnitId } from './src/lib/units.js';

console.log('jpy-to-usd ->', getParsedParamsFromPath('jpy-to-usd'));
console.log('usd-to-jpy ->', getParsedParamsFromPath('usd-to-jpy'));
console.log('btc-to-usd ->', getParsedParamsFromPath('btc-to-usd'));
