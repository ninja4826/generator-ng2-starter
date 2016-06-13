import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';

describe('generator-ng2-starter:app', () => {
  before(() => {
    console.log(helpers);
    var run = helpers.run(path.join(__dirname, '../lib/generators/app'));
    console.log('run', run);
    var prompted = run.withPrompts({ someAnswer: true });
    console.log('prompted', prompted);
    var prom = prompted.toPromise();
    console.log('prom', prom);
    return prom;
  });
  
  it('creates files', () => {
    assert.file([ 'dummyfile.txt' ]);
  });
});