using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
//using System.Windows.Threading;
//using NES.FastendoDebugging;
//using CPU6502.Machine;

namespace ChiChiNES
{
    public partial class NESMachine : IDisposable
    {

        #region IDisposable Members

        public void Dispose()
        {


            if (_cart != null && _cart.CheckSum != null && SRAMWriter != null)
            {
                SRAMWriter(_cart.CheckSum, _cart.SRAM);
            }


            Thread.Sleep(100);
            _sharedWave.Dispose();
            soundThreader.Dispose();
        }

        #endregion
    }
}
