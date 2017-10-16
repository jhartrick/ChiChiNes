﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;
using Bridge;

namespace ChiChiNES
{
    public partial class CPU2A03
    {
        [Rules(Integer =IntegerRule.Plain)]
        public class Instruction 
        {
            public Instruction(){}
            public Instruction(Instruction inst)
            {
                AddressingMode = inst.AddressingMode;
                Address = inst.Address;
                OpCode = inst.OpCode;
                Parameters0 = inst.Parameters0;
                Parameters1 = inst.Parameters1;
                ExtraTiming = inst.ExtraTiming;
                Length = inst.Length;

                
            }

            public int AddressingMode;
            public int frame;

            public int time;

            public int A;
            public int X;
            public int Y;
            public int SR;
            public int SP;

            // 2 bytes
            public int Address;
            // one byte
            public int OpCode;
            // one byte
            public int Parameters0;
            // one byte
            public int Parameters1;

            // lookedup
            public int ExtraTiming;
            public int Length;
        }

    }
}
