using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ChiChiNES.BeepsBoops
{
    public interface IWavReader
    {
        // void ReadWaves(ref byte[] destBuffer);
        void StartReadWaves();
        void ReadWaves();
        //byte[] ReadWaveBytes();
        float[] SharedBuffer { get; set; }
        
        void SetSharedBuffer(float[] values);
        
        int SharedBufferLength { get; set; }
		float Frequency { get; }
		
        bool BufferAvailable { get; }

        EventHandler BytesWritten { get; set; }
    }
}
