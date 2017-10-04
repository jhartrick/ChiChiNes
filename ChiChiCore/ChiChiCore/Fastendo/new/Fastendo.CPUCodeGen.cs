using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NES.CPU.Fastendo
{
    public partial class CPU2A03
    {

        
        public void Execute()
        {
            uint udata = 0;
            int carryFlag = 0;
            uint uresult = 0;

            int data = 0;

            byte bdata =0;

            switch (_currentInstruction_OpCode)
            {
                case 0x69:
                case 0x65:
                case 0x75:
                case 0x6d:
                case 0x7d:
                case 0x79:
                case 0x61:
                case 0x71:
                    //ADC();
                    // start the read process
                    udata = (uint)DecodeOperand();
                    carryFlag = (_statusRegister & 0x01);
                    uresult = (uint)(_accumulator + udata + carryFlag);

                    // carry flag

                    SetFlag(0x01, uresult > 0xFF); //CPUStatusMasks.CarryMask

                    // overflow flag
                    // SetFlag(CPUStatusBits.Overflow, (result > 0x7f || ~result > 0x7f));
                    SetFlag(0x40,
                            ((_accumulator ^ udata) & 0x80) != 0x80 &&
                            ((_accumulator ^ uresult) & 0x80) == 0x80);  //CPUStatusMasks.OverflowMask

                    // occurs when bit 7 is set
                    _accumulator = (int)(uresult & 0xFF);
                    SetZNFlags(_accumulator);
                    break;

                case 0x29:
                case 0x25:
                case 0x35:
                case 0x2d:
                case 0x3d:
                case 0x39:
                case 0x21:
                case 0x31:
                    //AND();
                    _accumulator = (_accumulator & DecodeOperand());
                    SetZNFlags(_accumulator);

                    break;

                case 0x0a:
                case 0x06:
                case 0x16:
                case 0x0e:
                case 0x1e:

                    //ASL()
                    data = DecodeOperand();
                    // set carry flag

                    SetFlag(0x01, ((data & 128) == 128)); //CPUStatusMasks.CarryMask
                    data = (data << 1) & 0xFE;
                    if (_currentInstruction_AddressingMode == AddressingModes.Accumulator)
                    {
                        _accumulator = data;
                    }
                    else
                    {
                        SetByte(DecodeAddress(), data);
                    }
                    SetZNFlags(data);
                    break;

                case 0x90:
                    BCC();
                    break;

                case 0xb0:
                    BCS();
                    break;

                case 0xf0:
                    BEQ();
                    break;

                case 0x24:
                case 0x2c:
                    //BIT()
                    data = DecodeOperand();
                    // overflow is bit 6
                    SetFlag(0x40, (data & 64) == 64); // CPUStatusMasks.OverflowMask

                    // negative is bit 7
                    if ((data & 128) == 128)
                    {
                        _statusRegister = _statusRegister | 128;
                    }
                    else
                    {
                        _statusRegister = _statusRegister & 127;
                    }

                    if ((data & _accumulator) == 0)
                    {
                        _statusRegister = _statusRegister | 0x2;
                    }
                    else
                    {
                        _statusRegister = _statusRegister & 0xFD;
                    }
                    break;

                case 0x30:
                    BMI();
                    break;

                case 0xd0:
                    BNE();
                    break;

                case 0x10:
                    BPL();
                    break;

                case 0x00:
                    BRK();
                    break;

                case 0x50:
                    BVC();
                    break;

                case 0x70:
                    BVS();
                    break;

                case 0x18:
                    CLC();
                    break;

                case 0xd8:
                    //CLD();
                    SetFlag(0x08, false);  //CPUStatusMasks.DecimalModeMask
                    break;

                case 0x58:
                    //CLI
                    SetFlag(0x04, false);//CPUStatusMasks.InterruptDisableMask
                    break;

                case 0xb8:
                    //CLV();
                    SetFlag(0x40, false);  //CPUStatusMasks.OverflowMask

                    break;

                case 0xc9:
                case 0xc5:
                case 0xd5:
                case 0xcd:
                case 0xdd:
                case 0xd9:
                case 0xc1:
                case 0xd1:
                    //CMP();
                    data = (_accumulator + 0x100 - DecodeOperand());
                    SetFlag(0x01, data > 0xFF); //CPUStatusMasks.CarryMask
                    SetZNFlags(data & 0xFF);

                    break;

                case 0xe0:
                case 0xe4:
                case 0xec:
                    //CPX()
                    data = (_indexRegisterX + 0x100 - DecodeOperand());
                    SetFlag(0x01, data > 0xFF); //CPUStatusMasks.CarryMask
                    SetZNFlags(data & 0xFF);
                    break;

                case 0xc0:
                case 0xc4:
                case 0xcc:
                    //CPY()
                    data = (_indexRegisterY + 0x100 - DecodeOperand());
                    SetFlag(0x01, data > 0xFF); //CPUStatusMasks.CarryMask
                    SetZNFlags(data & 0xFF);

                    break;

                case 0xc6:
                case 0xd6:
                case 0xce:
                case 0xde:
                    //DEC();
                    byte val = (byte)DecodeOperand();
                    val--;
                    SetByte(DecodeAddress(), val);
                    SetZNFlags(val);
                    break;

                case 0xca:
                    DEX();
                    break;

                case 0x88:
                    DEY();
                    break;

                case 0x49:
                case 0x45:
                case 0x55:
                case 0x4d:
                case 0x5d:
                case 0x59:
                case 0x41:
                case 0x51:
                    // EOR
                    _accumulator = (_accumulator ^ DecodeOperand());
                    SetZNFlags(_accumulator);
                    break;

                case 0xe6:
                case 0xf6:
                case 0xee:
                case 0xfe:
                    //INC();
                    bdata = (byte)DecodeOperand();
                    bdata++;
                    SetByte(DecodeAddress(), bdata);
                    SetZNFlags(bdata);
                    break;

                case 0xe8:
                    INX();
                    break;

                case 0xc8:
                    INY();
                    break;

                case 0x4c:
                case 0x6c:
                    //JMP();
                    // 6052 indirect jmp bug
                    if (_currentInstruction_AddressingMode == AddressingModes.Indirect && _currentInstruction_Parameters0 == 0xFF)
                    {
                        _programCounter = 0xFF | _currentInstruction_Parameters1 << 8;
                    }
                    else
                    {
                        _programCounter = DecodeAddress();
                    }
                    break;

                case 0x20:
                    JSR();
                    break;

                case 0xa9:
                case 0xa5:
                case 0xb5:
                case 0xad:
                case 0xbd:
                case 0xb9:
                case 0xa1:
                case 0xb1:
                    //LDA
                    _accumulator = DecodeOperand();
                    SetZNFlags(_accumulator);
                    break;

                case 0xa2:
                case 0xa6:
                case 0xb6:
                case 0xae:
                case 0xbe:
                    //LDX
                    _indexRegisterX = DecodeOperand();
                    SetZNFlags(_indexRegisterX); 
                    break;

                case 0xa0:
                case 0xa4:
                case 0xb4:
                case 0xac:
                case 0xbc:
                    //LDY
                    _indexRegisterY = DecodeOperand();
                    SetZNFlags(_indexRegisterY);
                    break;

                case 0x4a:
                case 0x46:
                case 0x56:
                case 0x4e:
                case 0x5e:
                    //LSR();
                    data = DecodeOperand();
                    //LSR shifts all bits right one position. 0 is shifted into bit 7 and the original bit 0 is shifted into the Carry. 

                    SetFlag(0x01, (data & 1) == 1);  //CPUStatusMasks.CarryMask
                                                     //target.SetFlag(CPUStatusBits.Carry, (rst & 1) == 1);
                    data = data >> 1 & 0xFF;

                    SetZNFlags(data);

                    if (_currentInstruction_AddressingMode == AddressingModes.Accumulator)
                    {
                        _accumulator = data;
                    }
                    else
                    {
                        SetByte(DecodeAddress(), data);
                    }
                    break;

                case 0xea:
                case 0x1a:
                case 0x3a:
                case 0x5a:
                case 0x7a:
                case 0xda:
                case 0xfa:
                case 0x04:
                case 0x14:
                case 0x34:
                case 0x44:
                case 0x64:
                case 0x80:
                case 0x82:
                case 0x89:
                case 0xc2:
                case 0xd4:
                case 0xe2:
                case 0xf4:
                case 0x0c:
                case 0x1c:
                case 0x3c:
                case 0x5c:
                case 0x7c:
                case 0xdc:
                case 0xfc:
                    NOP();
                    break;

                case 0x09:
                case 0x05:
                case 0x15:
                case 0x0d:
                case 0x1d:
                case 0x19:
                case 0x01:
                case 0x11:
                    //ORA()
                    _accumulator = (_accumulator | DecodeOperand());
                    SetZNFlags(_accumulator);
                    break;

                case 0x48:
                    PHA();
                    break;

                case 0x08:
                    PHP();
                    break;

                case 0x68:
                    PLA();
                    break;

                case 0x28:
                    PLP();
                    break;

                case 0x2a:
                case 0x26:
                case 0x36:
                case 0x2e:
                case 0x3e:
                    ROL();
                    break;

                case 0x6a:
                case 0x66:
                case 0x76:
                case 0x6e:
                case 0x7e:
                    //ROR()
                    data = DecodeOperand();

                    // old carry bit shifted into bit 7
                    int oldbit = (_statusRegister & 0x01) == 0x01 ? 0x80 : 0;
                    // original bit 0 shifted to carry
                    //            target.SetFlag(CPUStatusBits.Carry, (); 

                    SetFlag(0x01, (data & 0x01) == 0x01); //CPUStatusMasks.CarryMask

                    data = (data >> 1) | oldbit;

                    SetZNFlags(data);

                    if (_currentInstruction_AddressingMode == AddressingModes.Accumulator)
                    {
                        _accumulator = data;
                    }
                    else
                    {
                        SetByte(DecodeAddress(), data);
                    }
                    break;

                case 0x40:
                    RTI();
                    break;

                case 0x60:
                    RTS();
                    break;

                case 0xe9:
                case 0xe5:
                case 0xf5:
                case 0xed:
                case 0xfd:
                case 0xf9:
                case 0xe1:
                case 0xf1:
                    //SBC();
                    // start the read process
                    udata = (uint)DecodeOperand();
                    carryFlag = ((_statusRegister ^ 0x01) & 0x1);
                    uresult = (uint)(_accumulator - udata - carryFlag);

                    // set overflow flag if sign bit of accumulator changed
                    SetFlag(0x40,
                            ((_accumulator ^ uresult) & 0x80) == 0x80 &&
                            ((_accumulator ^ udata) & 0x80) == 0x80);  //CPUStatusMasks.OverflowMask

                    SetFlag(0x01, (uresult < 0x100)); //CPUStatusMasks.CarryMask

                    _accumulator = (int)(uresult);
                    SetZNFlags(_accumulator);
                    break;

                case 0x38:
                    //SEC();
                    SetFlag(0x01, true);  //CPUStatusMasks.CarryMask
                    break;

                case 0xf8:
                    //SED();
                    SetFlag(0x08, true); //CPUStatusMasks.DecimalModeMask
                    break;

                case 0x78:
                    //SEI();
                    SetFlag(0x04, true); // CPUStatusMasks.InterruptDisableMask

                    break;

                case 0x85:
                case 0x95:
                case 0x8d:
                case 0x9d:
                case 0x99:
                case 0x81:
                case 0x91:
                    //STA();
                    SetByte(DecodeAddress(), _accumulator);

                    break;

                case 0x86:
                case 0x96:
                case 0x8e:
                    //STX
                    SetByte(DecodeAddress(), _indexRegisterX);
                    break;

                case 0x84:
                case 0x94:
                case 0x8c:
                    //STY();
                    SetByte(DecodeAddress(), _indexRegisterY);

                    break;

                case 0xaa:
                    TAX();
                    break;

                case 0xa8:
                    TAY();
                    break;

                case 0xba:
                    TSX();
                    break;

                case 0x8a:
                    TXA();
                    break;

                case 0x9a:
                    TXS();
                    break;

                case 0x98:
                    TYA();
                    break;

            }
        }
    }
}