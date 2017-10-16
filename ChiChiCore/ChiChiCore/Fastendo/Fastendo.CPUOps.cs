
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

        void Compare(int data)
        {
            SetFlag(CPUStatusMasks.CarryMask, data > 0xFF);
            SetZNFlags( data & 0xFF);
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


        #endregion













    }

}
