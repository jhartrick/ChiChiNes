namespace ChiChiNES
{
    public partial class CPU2A03
    {

        public void Execute()
        {
            int data = 0 | 0;
            int lowByte = 0 | 0;
            int highByte = 0 | 0;
            int carryFlag = 0 | 0;
            int result= 0 | 0;
            int oldbit = 0 | 0;

            switch (_currentInstruction_OpCode)
            {
                case 0x80:
                case 0x82:
                case 0xC2:
                case 0xE2:
                case 0x04:
                case 0x14:
                case 0x34:
                case 0x44:
                case 0x54:
                case 0x64:
                case 0x74:
                case 0xD4:
                case 0xF4:
                    //SKB()
                case 0x0C:
                case 0x1C:
                case 0x3C:
                case 0x5C:
                case 0x7C:
                case 0xDC:
                case 0xFC:
                    //SKW();
                    DecodeAddress();
                    break;
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
                    data = DecodeOperand();
                    carryFlag = (_statusRegister & 0x01);
                    result = (_accumulator + data + carryFlag) | 0;

                    // carry flag
                    SetFlag(CPUStatusMasks.CarryMask, result > 0xFF);

                    // overflow flag
                    SetFlag(CPUStatusMasks.OverflowMask,
                            ((_accumulator ^ data) & 0x80) != 0x80 &&
                            ((_accumulator ^ result) & 0x80) == 0x80);

                    // occurs when bit 7 is set
                    _accumulator = result & 0xFF;
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
                    //ASL();
                    data = DecodeOperand();
                    // set carry flag

                    SetFlag(CPUStatusMasks.CarryMask, ((data & 128) == 128));

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
                    //BCC();
                    if ((_statusRegister & 0x1) != 0x1)
                        Branch();
                    break;

                case 0xb0:
                    //BCS();
                    if ((_statusRegister & 0x1) == 0x1)
                        Branch();
                    break;
                case 0xf0:
                    //BEQ();
                    if ((_statusRegister & 0x2) == 0x2)
                        Branch();
                    break;
                case 0x24:
                case 0x2c:
                    //BIT();
                    data = DecodeOperand();
                    // overflow is bit 6
                    SetFlag(CPUStatusMasks.OverflowMask, (data & 64) == 64);
                    //if ((operand & 64) == 64)
                    //{
                    //    _statusRegister = _statusRegister | 0x40;
                    //}
                    //else
                    //{
                    //    _statusRegister = _statusRegister & 0xBF;
                    //}

                    // negative is bit 7
                    if ((data & 128) == 128)
                    {
                        _statusRegister = _statusRegister | 128;
                    }
                    else
                    {
                        _statusRegister = _statusRegister & 127;
                    }

                    if ((data & Accumulator) == 0)
                    {
                        _statusRegister = _statusRegister | 0x2;
                    }
                    else
                    {
                        _statusRegister = _statusRegister & 0xFD;
                    }
                    break;
                case 0x30:
                    //BMI();
                    if ((_statusRegister & 0x80) == 0x80)
                        Branch();

                    break;
                case 0xd0:
                    //BNE();
                    if ((_statusRegister & 0x2) != 0x2)
                        Branch();
                    break;
                case 0x10:
                    //BPL();
                    if ((_statusRegister & 0x80) != 0x80)
                        Branch();
                    break;
                case 0x00:
                    //BRK();
                    //BRK causes a non-maskable interrupt and increments the program counter by one. 
                    //Therefore an RTI will go to the address of the BRK +2 so that BRK may be used to replace a two-byte instruction 
                    // for debugging and the subsequent RTI will be correct. 
                    // push pc onto stack (high byte first)
                    _programCounter = _programCounter + 1;
                    PushStack(_programCounter >> 8 & 0xFF);
                    PushStack(_programCounter & 0xFF);
                    // push sr onto stack

                    //PHP and BRK push the current status with bits 4 and 5 set on the stack; 

                    data = _statusRegister | 0x10 | 0x20;

                    PushStack(data);

                    // set interrupt disable, and break flags
                    // BRK then sets the I flag.
                    _statusRegister = _statusRegister | 0x14;

                    // point pc to interrupt service routine
                    _addressBus = 0xFFFE;
                    lowByte = GetByte();
                    _addressBus = 0xFFFF;
                    highByte = GetByte();

                    _programCounter = lowByte + highByte * 0x100;
                    break;

                case 0x50:
                    //BVC();
                    if ((_statusRegister & 0x40) != 0x40)
                        Branch();

                    break;

                case 0x70:
                    //BVS();
                    if ((_statusRegister & 0x40) == 0x40)
                        Branch();

                    break;
                case 0x18:
                    //CLC();
                    SetFlag(CPUStatusMasks.CarryMask, false);

                    break;

                case 0xd8:
                    //CLD();
                    SetFlag(CPUStatusMasks.DecimalModeMask, false);
                    break;

                case 0x58:
                    //CLI();
                    SetFlag(CPUStatusMasks.InterruptDisableMask, false);

                    break;

                case 0xb8:
                    //CLV();
                    SetFlag(CPUStatusMasks.OverflowMask, false);

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
                    data = (Accumulator + 0x100 - DecodeOperand());
                    Compare(data);

                    break;

                case 0xe0:
                case 0xe4:
                case 0xec:
                    //CPX();
                    data = (_indexRegisterX + 0x100 - DecodeOperand());
                    Compare(data);

                    break;

                case 0xc0:
                case 0xc4:
                case 0xcc:
                    //CPY();
                    data = (_indexRegisterY + 0x100 - DecodeOperand());
                    Compare(data);

                    break;

                case 0xc6:
                case 0xd6:
                case 0xce:
                case 0xde:
                    //DEC();
                    data = DecodeOperand();
                    data = (data - 1) & 0xFF;
                    SetByte(DecodeAddress(), data);
                    SetZNFlags(data);
                    break;

                case 0xca:
                    //DEX();
                    _indexRegisterX = _indexRegisterX - 1;
                    _indexRegisterX = _indexRegisterX & 0xFF;
                    SetZNFlags(_indexRegisterX);

                    break;

                case 0x88:
                    //DEY();
                    _indexRegisterY = _indexRegisterY - 1;
                    _indexRegisterY = _indexRegisterY & 0xFF;
                    SetZNFlags(_indexRegisterY);

                    break;

                case 0x49:
                case 0x45:
                case 0x55:
                case 0x4d:
                case 0x5d:
                case 0x59:
                case 0x41:
                case 0x51:
                    //EOR();
                    _accumulator = (_accumulator ^ DecodeOperand());
                    SetZNFlags(Accumulator);

                    break;

                case 0xe6:
                case 0xf6:
                case 0xee:
                case 0xfe:
                    //INC();
                    data = DecodeOperand();
                    data = (data + 1) & 0xFF;
                    SetByte(DecodeAddress(), data);
                    SetZNFlags(data);
                    break;

                case 0xe8:
                    //INX();
                    _indexRegisterX = _indexRegisterX + 1;
                    _indexRegisterX = _indexRegisterX & 0xFF;
                    SetZNFlags(_indexRegisterX);

                    break;

                case 0xc8:
                    _indexRegisterY = _indexRegisterY + 1;
                    _indexRegisterY = _indexRegisterY & 0xFF;
                    SetZNFlags(_indexRegisterY);
                    break;

                case 0x4c:
                case 0x6c:
                    // JMP();
                    // 6052 indirect jmp bug
                    if (_currentInstruction_AddressingMode == AddressingModes.Indirect
                        && _currentInstruction_Parameters0 == 0xFF)
                    {
                        _programCounter = 0xFF | _currentInstruction_Parameters1 << 8;
                    }
                    else
                    {
                        _programCounter = DecodeAddress();
                    }
                    break;

                case 0x20:
                    //JSR();
                    PushStack((_programCounter >> 8) & 0xFF);
                    PushStack((_programCounter - 1) & 0xFF);

                    _programCounter = DecodeAddress();
                    break;

                case 0xa9:
                case 0xa5:
                case 0xb5:
                case 0xad:
                case 0xbd:
                case 0xb9:
                case 0xa1:
                case 0xb1:
                    //LDA();
                    _accumulator = DecodeOperand();
                    SetZNFlags(_accumulator);
                    break;
                case 0xa2:
                case 0xa6:
                case 0xb6:
                case 0xae:
                case 0xbe:
                    //LDX();
                    _indexRegisterX = DecodeOperand();
                    SetZNFlags(_indexRegisterX);
                    break;

                case 0xa0:
                case 0xa4:
                case 0xb4:
                case 0xac:
                case 0xbc:
                    //LDY();
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

                    SetFlag(CPUStatusMasks.CarryMask, (data & 1) == 1);
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
                //case 0x04:
                //case 0x14:
                //case 0x34:
                //case 0x44:
                //case 0x64:
                //case 0x80:
                //case 0x82:
                case 0x89:
                    //case 0xc2:
                    //case 0xd4:
                    //case 0xe2:
                    //case 0xf4:
                    //case 0x0c:
                    //case 0x1c:
                    //case 0x3c:
                    //case 0x5c:
                    //case 0x7c:
                    //case 0xdc:
                    //case 0xfc:
                    //NOP();
                    if (_currentInstruction_AddressingMode == AddressingModes.AbsoluteX)
                    {
                        DecodeAddress();
                    }
                    break;

                case 0x09:
                case 0x05:
                case 0x15:
                case 0x0d:
                case 0x1d:
                case 0x19:
                case 0x01:
                case 0x11:
                    //ORA();

                    _accumulator = (_accumulator | DecodeOperand());
                    SetZNFlags(_accumulator);
                    break;

                case 0x48:
                    //PHA();
                    PushStack(_accumulator);

                    break;

                case 0x08:
                    //PHP();
                    data = _statusRegister | 0x10 | 0x20;
                    PushStack(data);

                    break;

                case 0x68:
                    //PLA();
                    _accumulator = PopStack();
                    SetZNFlags(_accumulator);
                    break;
                case 0x28:
                    //PLP();
                    _statusRegister = PopStack(); // | 0x20;
                    break;
                case 0x2a:
                case 0x26:
                case 0x36:
                case 0x2e:
                case 0x3e:
                    //ROL();
                    data = DecodeOperand();

                    // old carry bit shifted into bit 1
                    oldbit = (_statusRegister & 1) == 1 ? 0x1 : 0;

                    SetFlag(CPUStatusMasks.CarryMask, (data & 128) == 128);

                    data = ((data << 1) | oldbit) & 0xFF;
                    //data = data & 0xFF;
                    //data = data | oldbit;
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

                case 0x6a:
                case 0x66:
                case 0x76:
                case 0x6e:
                case 0x7e:
                    //ROR();
                    data = DecodeOperand();

                    // old carry bit shifted into bit 7
                    oldbit = (_statusRegister & 1) == 1 ? 0x80 : 0;

                    // original bit 0 shifted to carry
                    SetFlag(CPUStatusMasks.CarryMask, (data & 0x01) == 0x01);

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
                    //RTI();
                    _statusRegister = PopStack();// | 0x20;
                    lowByte = PopStack();
                    highByte = PopStack();
                    _programCounter = ((highByte << 8) | lowByte);
                    break;

                case 0x60:
                    //RTS();
                    lowByte = (PopStack() + 1) & 0xFF;
                    highByte = PopStack();
                    _programCounter = ((highByte << 8) | lowByte);

                    break;

                case 0xeb: // undocumented sbc immediate
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

                    data = DecodeOperand() & 0xFFF;

                    carryFlag = ((_statusRegister ^ 0x01) & 0x1);

                    result = (((_accumulator - data) & 0xFFF) - carryFlag) & 0xFFF;

                    // set overflow flag if sign bit of accumulator changed
                    SetFlag(CPUStatusMasks.OverflowMask,
                            ((_accumulator ^ result) & 0x80) == 0x80 &&
                            ((_accumulator ^ data) & 0x80) == 0x80);

                    SetFlag(CPUStatusMasks.CarryMask, (result < 0x100));

                    _accumulator = (int)(result) & 0xFF;
                    SetZNFlags(_accumulator);


                    break;

                case 0x38:
                    //SEC();
                    SetFlag(CPUStatusMasks.CarryMask, true);

                    break;

                case 0xf8:
                    //SED();
                    SetFlag(CPUStatusMasks.DecimalModeMask, true);

                    break;

                case 0x78:
                    //SEI();
                    SetFlag(CPUStatusMasks.InterruptDisableMask, true);
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
                    //STX();
                    SetByte(DecodeAddress(), _indexRegisterX);

                    break;

                case 0x84:
                case 0x94:
                case 0x8c:
                    //STY();
                    SetByte(DecodeAddress(), _indexRegisterY);

                    break;

                case 0xaa:
                    //TAX();
                    _indexRegisterX = _accumulator;
                    SetZNFlags(_indexRegisterX);

                    break;

                case 0xa8:
                    //TAY();
                    _indexRegisterY = _accumulator;
                    SetZNFlags(_indexRegisterY);

                    break;

                case 0xba:
                    //TSX();
                    _indexRegisterX = _stackPointer;
                    SetZNFlags(_indexRegisterX);

                    break;

                case 0x8a:
                    //TXA();
                    _accumulator = _indexRegisterX;
                    SetZNFlags(_accumulator);

                    break;

                case 0x9a:
                    //TXS();
                    _stackPointer = _indexRegisterX;

                    break;

                case 0x98:
                    //TYA();
                    _accumulator = _indexRegisterY;
                    SetZNFlags(_accumulator);

                    break;
                    //undocumented opcodes
                case 0x0b:
                case 0x2b:
                    //AAC();
                    //AND byte with accumulator. If result is negative then carry is set.
                    //Status flags: N,Z,C
                    _accumulator = DecodeOperand() & _accumulator & 0xFF;

                    SetFlag(CPUStatusMasks.CarryMask, (_accumulator & 0x80) == 0x80);

                    SetZNFlags(_accumulator);

                    break;
                case 0x4b:
                    //AND byte with accumulator, then shift right one bit in accumu-lator.
                    //Status flags: N,Z,C
                    _accumulator = DecodeOperand() & _accumulator;

                    SetFlag(CPUStatusMasks.CarryMask, (_accumulator & 1) == 1);
                    _accumulator = _accumulator >> 1;

                    SetZNFlags(_accumulator);
                    break;
                case 0x6b:
                    //ARR();
                    //AND byte with accumulator, then rotate one bit right in accu - mulator and
                    //  check bit 5 and 6:
                    //If both bits are 1: set C, clear V. 0x30
                    //If both bits are 0: clear C and V.
                    //If only bit 5 is 1: set V, clear C.
                    //If only bit 6 is 1: set C and V.
                    //Status flags: N,V,Z,C
                    _accumulator = DecodeOperand() & _accumulator;

                    if ((_statusRegister & 0x01) == 0x01)
                    {
                        _accumulator = (_accumulator >> 1) | 0x80;
                    }
                    else
                    {
                        _accumulator = (_accumulator >> 1);
                    }

                    // original bit 0 shifted to carry
                    //            target.SetFlag(CPUStatusBits.Carry, (); 

                    SetFlag(CPUStatusMasks.CarryMask, (_accumulator & 0x01) == 0x01);


                    switch (_accumulator & 0x30)
                    {
                        case 0x30:
                            SetFlag(CPUStatusMasks.CarryMask, true);
                            SetFlag(CPUStatusMasks.InterruptDisableMask, false);
                            break;
                        case 0x00:
                            SetFlag(CPUStatusMasks.CarryMask, false);
                            SetFlag(CPUStatusMasks.InterruptDisableMask, false);
                            break;
                        case 0x10:
                            SetFlag(CPUStatusMasks.CarryMask, false);
                            SetFlag(CPUStatusMasks.InterruptDisableMask, true);
                            break;
                        case 0x20:
                            SetFlag(CPUStatusMasks.CarryMask, true);
                            SetFlag(CPUStatusMasks.InterruptDisableMask, true);
                            break;
                    }
                    break;
                case 0xab:
                    //ATX();
                    //AND byte with accumulator, then transfer accumulator to X register.
                    //Status flags: N,Z
                    _indexRegisterX = _accumulator = DecodeOperand() & _accumulator;
                    SetZNFlags(_indexRegisterX);
                    break;
            }
        }
    }
}