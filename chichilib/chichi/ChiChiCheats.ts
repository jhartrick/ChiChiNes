export class GameGenieCode {
    code: string;
    description: string;
    active = false;
}

export class MemoryPatch {
    address: number = -1;
    data: number = -1;
    compare: number = -1;
    active: boolean = true;
}

export class ChiChiCheats {


    gameGenieCodeToPatch(code: string) : MemoryPatch
    {
        const hexCode = new Uint8Array(code.length);
        let i = 0;
        let patch: MemoryPatch = null;

        for (let j=0;j<code.length;++j)
        {
            let c = code.charAt(j);

            let digit = 0;
            switch (c)
            {
                case 'A':
                    digit = 0x0;
                    break;
                case 'P':
                    digit = 0x1;
                    break;
                case 'Z':
                    digit = 0x2;
                    break;
                case 'L':
                    digit = 0x3;
                    break;
                case 'G':
                    digit = 0x4;
                    break;
                case 'I':
                    digit = 0x5;
                    break;
                case 'T':
                    digit = 0x6;
                    break;
                case 'Y':
                    digit = 0x7;
                    break;
                case 'E':
                    digit = 0x8;
                    break;
                case 'O':
                    digit = 0x9;
                    break;
                case 'X':
                    digit = 0xA;
                    break;
                case 'U':
                    digit = 0xB;
                    break;
                case 'K':
                    digit = 0xC;
                    break;
                case 'S':
                    digit = 0xD;
                    break;
                case 'V':
                    digit = 0xE;
                    break;
                case 'N':
                    digit = 0xF;
                    break;
            }
            hexCode[i++] = digit;
        }

        // magic spell that makes the genie appear!
        // http://tuxnes.sourceforge.net/gamegenie.html
        let address = 0x8000 +
              ((hexCode[3] & 7) << 12)
            | ((hexCode[5] & 7) << 8) | ((hexCode[4] & 8) << 8)
            | ((hexCode[2] & 7) << 4) | ((hexCode[1] & 8) << 4)
            | (hexCode[4] & 7) | (hexCode[3] & 8);


        let data = 0;
        let compare = 0;
        if (hexCode.length == 6)
        {
            data =
                 ((hexCode[1] & 7) << 4) | ((hexCode[0] & 8) << 4)
                | (hexCode[0] & 7) | (hexCode[5] & 8);

            patch = new MemoryPatch();
            patch.address = address;
            patch.data = data;
        }
        else if (hexCode.length == 8)
        {
            data =
                 ((hexCode[1] & 7) << 4) | ((hexCode[0] & 8) << 4)
                | (hexCode[0] & 7) | (hexCode[7] & 8);
            compare =
                 ((hexCode[7] & 7) << 4) | ((hexCode[6] & 8) << 4)
                | (hexCode[6] & 7) | (hexCode[5] & 8);

            patch = new MemoryPatch();
            patch.address = address;
            patch.data = data;
            patch.compare = compare;
            
        }
        else
        {
            // not a genie code!  
            patch = null;
            
        }
        return patch;
    }

}

class XmlHolder {
    static ggXML = ``;
    }
    