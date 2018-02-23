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


    it('should allow arrays to be pushed', () => {
        const result = createStateBuffer();
        result.pushArray(new Uint8Array(8), 'test');
        result.pushArray(new Uint32Array(2), 'test2');
        result.build();
        expect(result.bufferSize).to.eq(16);

        const myArray = result.getUint8Array('test');
        expect(myArray).instanceof(Uint8Array);
        expect(myArray.length).to.eq(8);

        expect(result.getUint32Array('test')).instanceof(Uint32Array);

    });

    it('should allow multiple arrays built from underlying buffer', () => {
        const result = createStateBuffer();
        result.pushArray(new Uint8Array(8), 'test');
        result.build();
        expect(result.bufferSize).to.eq(8);

        const myOtherArray = result.getUint8Array('test');

        expect(result.getUint32Array('test')).instanceof(Uint32Array);
        expect(result.getUint32Array('test').length).to.eq(2);

        expect(result.getFloat32Array('test')).instanceof(Float32Array);
        expect(result.getFloat32Array('test').length).to.eq(2);
        
        expect(result.getUint16Array('test')).instanceof(Uint16Array);
        expect(result.getUint16Array('test').length).to.eq(4);
    });

    it('should create arrays using same shared data segments', () => {
        const result = createStateBuffer();
        result.pushArray(new Uint8Array(8), 'test');
        result.build();
        expect(result.bufferSize).to.eq(8);

        const myArray = result.getUint32Array('test');
        const myOtherArray = result.getUint8Array('test');

        expect(myArray).instanceof(Uint32Array);
        expect(myArray.length).to.eq(2);

        expect(myOtherArray).instanceof(Uint8Array);
        expect(myOtherArray.length).to.eq(8);

        myOtherArray[3] = 0xff;
        expect(myArray[0]).to.eq(0xff000000);

        expect(result.getFloat32Array('test')[0]).to.eq(-1.7014118346046923e+38);
        

    });



});