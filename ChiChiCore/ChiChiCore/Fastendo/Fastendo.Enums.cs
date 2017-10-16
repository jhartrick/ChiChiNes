using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ChiChiNES
{
    public static class AddressingModes
    {
        public const int Bullshit = 0;
        public const int Implicit = 1;
        public const int Accumulator = 2;
        public const int Immediate = 3;
        public const int ZeroPage = 4;
        public const int ZeroPageX = 5;
        public const int ZeroPageY = 6;
        public const int Relative = 7;
        public const int Absolute = 8;
        public const int AbsoluteX = 9;
        public const int AbsoluteY = 10;
        public const int Indirect = 11;
        public const int IndexedIndirect = 12;
        public const int IndirectIndexed = 13;
        // funky ass undocumented modes
        public const int IndirectZeroPage = 14;
        public const int IndirectAbsoluteX = 15;
    }

    public static class CPUStatusBits
    {
        public const int Carry = 0;
        public const int ZeroResult = 1;
        public const int InterruptDisable = 2;
        public const int DecimalMode = 3;
        public const int BreakCommand = 4;
        public const int Expansion = 5;
        public const int Overflow = 6;
        public const int NegativeResult = 7;
    }

    public static class CPUStatusMasks
    {
        public const int CarryMask = 0x01;
        public const int ZeroResultMask = 0x02;
        public const int InterruptDisableMask = 0x04;
        public const int DecimalModeMask = 0x08;
        public const int BreakCommandMask = 0x10;
        public const int ExpansionMask = 0x20;
        public const int OverflowMask = 0x40;
        public const int NegativeResultMask = 0x80;
    }
}
