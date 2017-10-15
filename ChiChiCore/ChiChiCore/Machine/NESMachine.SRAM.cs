using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ChiChiNES
{
    public delegate void SRAMWriterDelegate(string RomID, int[] SRAM);
    public delegate int[] SRAMReaderDelegate(string RomID);
    
    public partial class NESMachine
    {
        public SRAMReaderDelegate SRAMReader { get; set; }
        public SRAMWriterDelegate SRAMWriter { get; set; }
    }

}
