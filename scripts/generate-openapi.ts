import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { getSpec } from '../src/config/swagger';

mkdirSync(path.resolve('docs'), { recursive: true });
writeFileSync(path.resolve('docs/openapi.json'), JSON.stringify(getSpec(), null, 2));
console.log('Wrote docs/openapi.json');
