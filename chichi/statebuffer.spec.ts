import * as SB from './StateBuffer';
import { expect } from 'chai';
import 'mocha';

const createStateBuffer = () => new SB.StateBuffer();

describe('StateBuffer', () => {

  it('should be createable', () => {
    const result = createStateBuffer();
    expect(result).to.instanceof(SB.StateBuffer);
  });

  it('should be createable with an empty buffer', () => {
    const result = createStateBuffer();
    expect(result.bufferSize).to.eq(0);
  });

  it('should allow allocation of Uint8Array', () => {
    const result = createStateBuffer();
    result.pushSegment(8 * Uint8Array.BYTES_PER_ELEMENT, 'test');
    result.build();
    expect(result.bufferSize).to.eq(8);

    const myArray = result.getUint8Array('test');
    expect(myArray).instanceof(Uint8Array);
    expect(myArray.length).to.eq(8);
  });



});