using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ChiChiNES;

namespace ChiChiNES
{
    public partial class PixelWhizzler
    {
        protected INESCart chrRomHandler;

        public INESCart ChrRomHandler
        {
            get { return chrRomHandler; }
            set { chrRomHandler = value; }
        }

    }
}
