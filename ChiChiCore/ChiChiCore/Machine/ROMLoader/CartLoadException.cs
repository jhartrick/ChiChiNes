﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ChiChiNES.ROMLoader
{
    public class CartLoadException : Exception
    {
        public CartLoadException(string message, Exception innerException) : base(message, innerException) { }
        public CartLoadException(string message) : base(message) { }
    }
}
