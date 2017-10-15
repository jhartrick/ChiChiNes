using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ChiChiNES
{
    public partial class CPU2A03
    {
        int[] instructionUsage = new int[256];
        bool _debugging = false;

        public bool Debugging
        {
            get { return _debugging; }
            set { _debugging = value; }
        }

        public int[] InstructionUsage
        {
            get { return instructionUsage; }
        }

        // track last 256 instructions
        private int instructionHistoryPointer = 0xFF;

        public int InstructionHistoryPointer
        {
            get { return instructionHistoryPointer; }
        }
        private Instruction[] _instructionHistory = new Instruction[0x100];

        public Instruction[] InstructionHistory
        {
            get { return _instructionHistory; }
        }

        public void ResetInstructionHistory() {
            //_instructionHistory = new Instruction[0x100];
            instructionHistoryPointer = 0xFF;

        }
        [Rules(Integer=IntegerRule.Plain)]
        public void WriteInstructionHistoryAndUsage()
        {

            _instructionHistory[(instructionHistoryPointer--) & 0xFF] = new Instruction() {
                time = systemClock,
                A = _accumulator,
                X = _indexRegisterX,
                Y = _indexRegisterY,
                SR = _statusRegister,
                SP = _stackPointer,
                frame = clock,
                OpCode = _currentInstruction_OpCode,
                Parameters0 = _currentInstruction_Parameters0,
                Parameters1 = _currentInstruction_Parameters1,
                Address = _currentInstruction_Address,
                AddressingMode = (int)_currentInstruction_AddressingMode,
                ExtraTiming = _currentInstruction_ExtraTiming
            };
            instructionUsage[_currentInstruction_OpCode]++;
            if ((instructionHistoryPointer & 0xFF) == 0xFF)
            {
                FireDebugEvent("instructionHistoryFull");
            }

        }
        public event EventHandler DebugEvent;

        private void FireDebugEvent(string s)
        {
            DebugEvent?.Invoke(this, new EventArgs() );
        }

        public Instruction PeekInstruction(int address)
        {
            //TODO: this needs to be non-invasive
            Instruction inst = new Instruction();

            //inst.OpCode = GetByte(address++);
            //inst.AddressingMode = addressmode[inst.OpCode];
            //inst.Length = 1;
            //FetchInstructionParameters(ref inst, address);
            return inst;
        }
    }
}
