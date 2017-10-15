
namespace ChiChiNES
{
    public partial class CPU2A03
    {
        void SetZNFlags(int data)
        {

            //zeroResult = (data & 0xFF) == 0;
            //negativeResult = (data & 0x80) == 0x80;

            if ((data & 0xFF) == 0)
                _statusRegister |= 0x02;//(int)CPUStatusMasks.ZeroResultMask;
            else
                _statusRegister &= ~0x02;// ((int)CPUStatusMasks.ZeroResultMask);

            if ((data & 0x80) == 0x80)
                _statusRegister |= 0x80; // (int)CPUStatusMasks.NegativeResultMask;
            else
                _statusRegister &= ~0x80;// ((int)CPUStatusMasks.NegativeResultMask);

        }

        #region load/store operations
        private void LDA()
        {

            _accumulator = DecodeOperand();

            SetZNFlags(_accumulator);

        }

        private void LDX()
        {

            _indexRegisterX = DecodeOperand(); 
            SetZNFlags( _indexRegisterX);
        }

        private void LDY()
        {
            _indexRegisterY = DecodeOperand();
            SetZNFlags( _indexRegisterY);
        }

        private void STA()
        {
            SetByte(DecodeAddress(), _accumulator);
        }

        private void STX()
        {
            SetByte(DecodeAddress(), _indexRegisterX);
        }

        private void STY()
        {
            SetByte(DecodeAddress(), _indexRegisterY);
        }
        #endregion

        #region status bit operations
        private void SED()
        {
            SetFlag(CPUStatusMasks.DecimalModeMask, true);
            // StatusRegister = StatusRegister | 0x8;
        }

        private void CLD()
        {
            SetFlag(CPUStatusMasks.DecimalModeMask, false);
//            StatusRegister = StatusRegister & 0xF7;
        }
        #endregion

        private void LSR()
        {
            int rst = DecodeOperand();
            //LSR shifts all bits right one position. 0 is shifted into bit 7 and the original bit 0 is shifted into the Carry. 

            SetFlag(CPUStatusMasks.CarryMask, (rst & 1) == 1);
            //target.SetFlag(CPUStatusBits.Carry, (rst & 1) == 1);
            rst = rst >> 1 & 0xFF;

            SetZNFlags( rst);

            if (_currentInstruction_AddressingMode == AddressingModes.Accumulator)
            {
                _accumulator = rst;
            }
            else
            {
                SetByte(DecodeAddress(), rst);
            }
        }

        private void SKB() {
            // _programCounter++;
        }



        private void ASL()
        {
            int data = DecodeOperand();
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


            SetZNFlags( data);
        }


        private void SEC()
        {
            // carry flag bit 0
            SetFlag(CPUStatusMasks.CarryMask, true);
        }

        private void CLC()
        {
            SetFlag(CPUStatusMasks.CarryMask, false);
        }

        private void SEI()
        {
            //StatusRegister = StatusRegister | 0x4;
            SetFlag(CPUStatusMasks.InterruptDisableMask, true);
        }

        private void CLI()
        {
//            StatusRegister = StatusRegister & 0xFB;
            SetFlag(CPUStatusMasks.InterruptDisableMask, false);
        }


        private void CLV()
        {
            SetFlag(CPUStatusMasks.OverflowMask, false);

        }


        void Compare(int data)
        {
            SetFlag(CPUStatusMasks.CarryMask, data > 0xFF);
            SetZNFlags( data & 0xFF);
        }

        private void CMP()
        {
            int data = (Accumulator + 0x100 - DecodeOperand());
            Compare(data);
        }

        private void CPX()
        {
            int data = (_indexRegisterX + 0x100 - DecodeOperand());
            Compare(data);
        }

        private void CPY()
        {
            int data = (_indexRegisterY + 0x100 - DecodeOperand());
            Compare(data);
        }

        private void NOP()
        {
            if (_currentInstruction_AddressingMode == AddressingModes.AbsoluteX)
            {
                DecodeAddress();
            }
        }

        #region Branch instructions
        private void Branch()
        {
            //System.Diagnostics.Debug.Assert(cpuTiming[_currentInstruction_OpCode] == 2);

            _currentInstruction_ExtraTiming = 1;
            int addr = _currentInstruction_Parameters0 & 0xFF;
            if ((addr & 128) == 128)
            {
                addr = addr - 0x100;
                _programCounter += addr;
            }
            else
            {
                _programCounter += addr;
            }

            if ((_programCounter & 0xFF) < addr)
            {
                _currentInstruction_ExtraTiming = 2;
            }

        }

        private void BCC()
        {
            
            if ((_statusRegister & 0x1) != 0x1)
                Branch();
        }

        private void BCS()
        {
            if ((_statusRegister & 0x1) == 0x1)
                Branch();
        }

        private void BPL()
        {
            if ((_statusRegister & 0x80) != 0x80)
                Branch();
        }

        private void BMI()
        {
            if ((_statusRegister & 0x80) == 0x80)
                Branch();
        }

        private void BVC()
        {
            if ((_statusRegister & 0x40) != 0x40)
                Branch();
        }

        private void BVS()
        {
            if ((_statusRegister & 0x40) == 0x40)
                Branch();
        }

        private void BNE()
        {
            if ((_statusRegister & 0x2) != 0x2)
                Branch();
        }

        private void BEQ()
        {
            if ((_statusRegister & 0x2) == 0x2)
                Branch();
        }
        #endregion

        #region Register instructions

        private void DEX()
        {
            _indexRegisterX = _indexRegisterX - 1;
            _indexRegisterX = _indexRegisterX & 0xFF;
            SetZNFlags( _indexRegisterX);
        }

        private void DEY()
        {
            _indexRegisterY = _indexRegisterY - 1;
            _indexRegisterY = _indexRegisterY & 0xFF;
            SetZNFlags( _indexRegisterY);
        }

        private void INX()
        {
            _indexRegisterX = _indexRegisterX + 1;
            _indexRegisterX = _indexRegisterX & 0xFF;
            SetZNFlags( _indexRegisterX);
        }

        private void INY()
        {
            _indexRegisterY = _indexRegisterY + 1;
            _indexRegisterY = _indexRegisterY & 0xFF;
            SetZNFlags( _indexRegisterY);
        }


        private void TAX()
        {
            _indexRegisterX = _accumulator;
            SetZNFlags( _indexRegisterX);

        }

        private void TXA()
        {
            _accumulator = _indexRegisterX;
            SetZNFlags(_accumulator);
        }

        private void TAY()
        {
            _indexRegisterY = _accumulator;
            SetZNFlags( _indexRegisterY);
        }

        private void TYA()
        {
            _accumulator = _indexRegisterY;
            SetZNFlags(_accumulator);
        }

        private void TXS()
        {
            _stackPointer = _indexRegisterX;
        }
        private void TSX()
        {
            _indexRegisterX = _stackPointer;
            SetZNFlags( _indexRegisterX);
        }
        #endregion

        private void PHA()
        {
            PushStack(_accumulator);
        }

        private void PLA()
        {
            _accumulator = PopStack();
            SetZNFlags(_accumulator);
        }

        private void PHP()
        {
             //PHP and BRK push the current status with bits 4 and 5 set on the stack; 
            // BRK then sets the I flag.
            int newStatus = _statusRegister | 0x10 | 0x20;
            PushStack(newStatus);
        }

        private void PLP()
        {
            _statusRegister = PopStack(); // | 0x20;
        }

        private void JSR()
        {
            PushStack( (_programCounter >> 8) & 0xFF);
            PushStack((_programCounter - 1) & 0xFF);

            _programCounter = DecodeAddress();
        }



        private void RTS()
        {
            int high, low;
            low = (PopStack() + 1) & 0xFF;
            high = PopStack();
            _programCounter = ((high << 8) | low) ;
        }

        private void RTI()
        {
            _statusRegister = PopStack();// | 0x20;
            int low = PopStack();
            int high = PopStack();
            _programCounter = ((256 * high) + low);
        }


        private void AAC() {
            //AND byte with accumulator. If result is negative then carry is set.
            //Status flags: N,Z,C
            _accumulator = DecodeOperand() & _accumulator & 0xFF;

            SetFlag(CPUStatusMasks.CarryMask, (_accumulator & 0x80) == 0x80);

            SetZNFlags(_accumulator);

        }

        private void ASR()
        {
            //AND byte with accumulator, then shift right one bit in accumu-lator.
            //Status flags: N,Z,C
            _accumulator = DecodeOperand() & _accumulator;

            SetFlag(CPUStatusMasks.CarryMask, (_accumulator & 1) == 1);
            _accumulator = _accumulator >> 1;

            SetZNFlags(_accumulator);

        }

        private void ARR() {
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
            else {
                _accumulator = (_accumulator >> 1) ;
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
        }

        private void ATX() {
            //AND byte with accumulator, then transfer accumulator to X register.
            //Status flags: N,Z
            _indexRegisterX = _accumulator = DecodeOperand() & _accumulator;
            SetZNFlags(_indexRegisterX);
        }

    }

}
