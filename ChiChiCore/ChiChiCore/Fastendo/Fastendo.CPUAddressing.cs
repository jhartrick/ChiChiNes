using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ChiChiNES
{
    [Bridge.Rules(Integer = Bridge.IntegerRule.Plain)]

    public partial class CPU2A03
    {
        int lowByte, highByte;

        [Bridge.Rules(Integer = Bridge.IntegerRule.Managed)]

        int DecodeAddress()
        {
            _currentInstruction_ExtraTiming = 0;
            int result = 0;
            switch (_currentInstruction_AddressingMode)
            {
                case AddressingModes.Absolute:
                    // two parameters refer to the memory position
                    result = ((_currentInstruction_Parameters1 << 8) | _currentInstruction_Parameters0);
                    break;
                case AddressingModes.AbsoluteX:
                    // absolute, x indexed - two paramaters + Index register x
                    result = (((_currentInstruction_Parameters1 << 8) | _currentInstruction_Parameters0) + _indexRegisterX);
                    if ((result & 0xFF) <_indexRegisterX)
                    {
                        _currentInstruction_ExtraTiming = 1;
                    }
                    break;
                case AddressingModes.AbsoluteY:
                    // absolute, y indexed - two paramaters + Index register y
                    result = (((_currentInstruction_Parameters1 << 8) | _currentInstruction_Parameters0) + _indexRegisterY);
                    if ((result & 0xFF) < _indexRegisterY)
                    {
                        _currentInstruction_ExtraTiming = 1;
                    }
                    break;
                case AddressingModes.ZeroPage:
                    // first parameter represents offset in zero page
                    result =  _currentInstruction_Parameters0 & 0xFF;
                    break;
                case AddressingModes.ZeroPageX:
                    result = (_currentInstruction_Parameters0 + _indexRegisterX) & 0xFF;
                    break;
                case AddressingModes.ZeroPageY:
                    result = ((_currentInstruction_Parameters0 & 0xFF) + (_indexRegisterY & 0xFF)) & 0xFF;
                    break;
                case AddressingModes.Indirect:
                    lowByte = _currentInstruction_Parameters0;
                    highByte = _currentInstruction_Parameters1 << 8;

                    int indAddr = (highByte | lowByte ) & 0xFFFF;
                    int indirectAddr = (GetByte(indAddr));

                    lowByte = (lowByte + 1) & 0xFF;
                    indAddr = (highByte | lowByte) & 0xFFFF;
                    indirectAddr |= (GetByte(indAddr) << 8);
                    result = indirectAddr;
                    break;
                case AddressingModes.IndexedIndirect:
                    int addr = (_currentInstruction_Parameters0 + _indexRegisterX) & 0xFF;
                    lowByte = GetByte(addr);
                    addr = addr + 1;
                    highByte = GetByte(addr & 0xFF);
                    highByte = highByte  << 8;
                    result = highByte | lowByte;
                    break;
                case AddressingModes.IndirectIndexed:
                    lowByte = GetByte(_currentInstruction_Parameters0 & 0xFF) ;
                    highByte = GetByte((_currentInstruction_Parameters0 + 1) & 0xFF )  << 8;
                    addr = (lowByte | highByte) ;
                    result = addr + _indexRegisterY;
                    if ((result & 0xFF) > _indexRegisterY)
                    {
                        _currentInstruction_ExtraTiming = 1;
                    }
                    break;
                // used by branches
                case AddressingModes.Relative:
                    result = (_programCounter + _currentInstruction_Parameters0);
                    break;
                default:
                    HandleBadOperation();
                    break;
            }
            return (ushort)result;
        }

        private void HandleBadOperation()
        {
            throw new NotImplementedException("Executors.DecodeAddress() recieved an invalid addressmode");
        }

        int DecodeOperand()
        {
            switch (_currentInstruction_AddressingMode)
            {
                case AddressingModes.Immediate:
                    DataBus = _currentInstruction_Parameters0;
                    return _currentInstruction_Parameters0;
                case AddressingModes.Accumulator:
                    return _accumulator;
                default:
                    DataBus = GetByte(DecodeAddress());
                    return DataBus;
            }
        }


    }
}
