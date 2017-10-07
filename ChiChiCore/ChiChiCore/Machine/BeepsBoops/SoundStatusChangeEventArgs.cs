using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ChiChiNES.BeepsBoops
{
    public class SoundStatusChangeEventArgs : EventArgs
    {
        private bool muted;

        public bool Muted
        {
            get { return muted; }
            set { muted = value; }
        }


    }
}
