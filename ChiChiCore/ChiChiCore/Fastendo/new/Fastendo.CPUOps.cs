using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NES.CPU.Fastendo
{
    public partial class CPU2A03
    {
        [Rules(Integer = IntegerRule.Managed)]
        void SetZNFlags(int data)
        {

            //zeroResult = (data & 0xFF) == 0;
            //negativeResult = (data & 0x80) == 0x80;

            if ((data & 0xFF) == 0)
                _statusRegister |= 0x02;//(int)CPUStatusMasks.ZeroResultMask;
            else
                _statusRegister &= ~(0x02 & 0xFF);// ((int)CPUStatusMasks.ZeroResultMask);

            if ((data & 0x80) == 0x80)
                _statusRegister |= 0x80; // (int)CPUStatusMasks.NegativeResultMask;
            else
                _statusRegister &= ~(0x80 & 0xFF);// ((int)CPUStatusMasks.NegativeResultMask);
            //SetFlag(CPUStatusBits.ZeroResult, (data & 0xFF) == 0);
            //SetFlag(CPUStatusBits.NegativeResult, (data & 0x80) == 0x80);
        }

        #region load/store operations
        public void LDA()
        {

        }

        public void LDX()
        {

        }

        public void LDY()
        {

        }

        public void STA()
        {
        }

        public void STX()
        {
        }

        public void STY()
        {
        }
        #endregion

        #region status bit operations
        public void SED()
        {
            // StatusRegister = StatusRegister | 0x8;
        }

        public void CLD()
        {
//            SetFlag(CPUStatusMasks.DecimalModeMask, false);
//            StatusRegister = StatusRegister & 0xF7;
        }
        #endregion

        public void JMP()
        {

        }

        public void DEC()
        {

        }

        public void INC()
        {

        }

        public void ADC()
        {


        }

        public void LSR()
        {

        }

        public void SBC()
        {
        }

        public void AND()
        {
        }

        public void ORA()
        {

        }

        public void EOR()
        {

        }

        public void ASL()
        {

        }

        public void BIT()
        {



        }

        public void SEC()
        {
            // carry flag bit 0
        }

        public void CLC()
        {
        }

        public void SEI()
        {
            //StatusRegister = StatusRegister | 0x4;
        }

        public void CLI()
        {
//            StatusRegister = StatusRegister & 0xFB;
        }


        public void CLV()
        {
        }


        void Compare(int data)
        {
        }

        public void CMP()
        {
        }

        public void CPX()
        {

        }

        public void CPY()
        {
        }

        public void NOP()
        {
  
        }

        #region Branch instructions
        private void Branch()
        {
            // System.Diagnostics.Debug.Assert(cpuTiming[_currentInstruction_OpCode] == 2);

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

        public void BCC()
        {
            
            if ((_statusRegister & 0x1) != 0x1)
                Branch();
        }

        public void BCS()
        {
            if ((_statusRegister & 0x1) == 0x1)
                Branch();
        }

        public void BPL()
        {
            if ((_statusRegister & 0x80) != 0x80)
                Branch();
        }

        public void BMI()
        {
            if ((_statusRegister & 0x80) == 0x80)
                Branch();
        }

        public void BVC()
        {
            if ((_statusRegister & 0x40) != 0x40)
                Branch();
        }

        public void BVS()
        {
            if ((_statusRegister & 0x40) == 0x40)
                Branch();
        }

        public void BNE()
        {
            if ((_statusRegister & 0x2) != 0x2)
                Branch();
        }

        public void BEQ()
        {
            if ((_statusRegister & 0x2) == 0x2)
                Branch();
        }
        #endregion

        #region Register instructions

        public void DEX()
        {
            _indexRegisterX = _indexRegisterX - 1;
            _indexRegisterX = _indexRegisterX & 0xFF;
            SetZNFlags( _indexRegisterX);
        }

        public void DEY()
        {
            _indexRegisterY = _indexRegisterY - 1;
            _indexRegisterY = _indexRegisterY & 0xFF;
            SetZNFlags( _indexRegisterY);
        }

        public void INX()
        {
            _indexRegisterX = _indexRegisterX + 1;
            _indexRegisterX = _indexRegisterX & 0xFF;
            SetZNFlags( _indexRegisterX);
        }

        public void INY()
        {
            _indexRegisterY = _indexRegisterY + 1;
            _indexRegisterY = _indexRegisterY & 0xFF;
            SetZNFlags( _indexRegisterY);
        }


        public void TAX()
        {
            _indexRegisterX = _accumulator;
            SetZNFlags( _indexRegisterX);

        }

        public void TXA()
        {
            _accumulator = _indexRegisterX;
            SetZNFlags(_accumulator);
        }

        public void TAY()
        {
            _indexRegisterY = _accumulator;
            SetZNFlags( _indexRegisterY);
        }

        public void TYA()
        {
            _accumulator = _indexRegisterY;
            SetZNFlags(_accumulator);
        }

        public void TXS()
        {
            _stackPointer = _indexRegisterX;
        }
        public void TSX()
        {
            _indexRegisterX = _stackPointer;
            SetZNFlags( _indexRegisterX);
        }
        #endregion

        public void PHA()
        {
            PushStack(_accumulator);
        }

        public void PLA()
        {
            _accumulator = PopStack();
            SetZNFlags(_accumulator);
        }

        public void PHP()
        {
             //PHP and BRK push the current status with bits 4 and 5 set on the stack; 
            // BRK then sets the I flag.
            int newStatus = _statusRegister | 0x10 | 0x20;
            PushStack(newStatus);
        }

        public void PLP()
        {
            _statusRegister = PopStack(); // | 0x20;
        }

        public void JSR()
        {
            PushStack( (_programCounter >> 8) & 0xFF);
            PushStack((_programCounter - 1) & 0xFF);

            _programCounter = DecodeAddress();
        }

        public void ROR()
        {

        }

        public void ROL()
        {
            int data= DecodeOperand();

            int oldbit = 0;
            if (GetFlag(CPUStatusMasks.CarryMask))
            {
                oldbit = 1;
            }
            SetFlag(0x01, (data & 128) == 128);//CPUStatusMasks.CarryMask

            data = data << 1;
            data = data & 0xFF;
            data = data | oldbit;
            SetZNFlags( data);

            if (_currentInstruction_AddressingMode == AddressingModes.Accumulator)
            {
                _accumulator = data;
            }
            else
            {
                SetByte(DecodeAddress(), data);
            }
        }

        public void RTS()
        {
            int high, low;
            low = (PopStack() + 1) & 0xFF;
            high = PopStack();
            _programCounter = ((high << 8) | low) ;
        }

        public void RTI()
        {
            _statusRegister = PopStack();// | 0x20;
            int low = PopStack();
            int high = PopStack();
            _programCounter = ((256 * high) + low);
        }

        public void BRK()
        {
            //BRK causes a non-maskable interrupt and increments the program counter by one. 
            //Therefore an RTI will go to the address of the BRK +2 so that BRK may be used to replace a two-byte instruction 
            // for debugging and the subsequent RTI will be correct. 
            // push pc onto stack (high byte first)
            _programCounter = _programCounter + 1;
            PushStack(_programCounter >> 8 & 0xFF);
            PushStack(_programCounter & 0xFF);
            // push sr onto stack

            //PHP and BRK push the current status with bits 4 and 5 set on the stack; 

            int newStatus = _statusRegister | 0x10 | 0x20;

            PushStack(newStatus);

            // set interrupt disable, and break flags
            // BRK then sets the I flag.
            _statusRegister = _statusRegister | 0x14;

            // point pc to interrupt service routine
            AddressBus = 0xFFFE;
            int lowByte = GetByte();
            AddressBus = 0xFFFF;
            int highByte = GetByte();

            _programCounter = lowByte + highByte * 0x100;
        }
    }

}
