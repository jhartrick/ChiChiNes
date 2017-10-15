using System.Collections.Generic;
namespace ChiChiNES
{
    public interface INESCart : IClockedMemoryMappedIOElement
    {
        void LoadiNESCart(byte[] header, int prgRoms, int chrRoms, byte[] prgRomData, byte[] chrRomData, int chrRomOffset);

        CPU2A03 Whizzler { get; set; }
        CPU2A03 CPU { get; set; }

        void InitializeCart();

        void UpdateScanlineCounter();

        void WriteState(Queue<int> state);
        void ReadState(Queue<int> state);

        int[] ChrRom { get; set; }
        int ChrRamStart { get; }
        int[] PPUBankStarts { get; set; }

        ROMHashFunctionDelegate ROMHashFunction { get; set; }
        string CheckSum { get;  }

        int[] SRAM { get; set; }

        NameTableMirroring Mirroring { get;  }
        string CartName { get;  }
        int NumberOfPrgRoms { get;  }
        int NumberOfChrRoms { get;  }
        int MapperID { get;  }

        int GetPPUByte(int clock, int address);
        void SetPPUByte(int clock, int address, byte data);


        int ActualChrRomOffset(int address);

        /// <summary>
        /// Used for bankswitching
        /// </summary>
        bool BankSwitchesChanged { get; set; }
        int UpdateBankStartCache();
        void ResetBankStartCache();
        int[] BankStartCache { get; }
        int CurrentBank { get; }


        bool UsesSRAM
        {
            get;
            set;
        }

    }
}
