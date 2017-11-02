import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Emulator } from '../../services/NESService';
import { Observable } from 'rxjs/Observable';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { MatDialog } from '@angular/material';
import { GameGenieDialogComponent } from './chichi.gamegenie.dialog';

export class GameGenieCode {
    code: string;
    description: string;
    active = false;
}


@Component({
  selector: 'chichi-gamegenie',
  templateUrl: './chichi.gamegenie.html',
  styleUrls: ['./chichi.gamegenie.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class GameGenieComponent {
    ggCodes = new Array<GameGenieCode>();
    wishbone: WishboneMachine;
    xmlDoc: Document;
    constructor(public nesService: Emulator, private dialog: MatDialog ) {
        // debugger;
        this.wishbone = nesService.wishbone;
        const parser = new DOMParser();
        this.xmlDoc = parser.parseFromString(XmlHolder.ggXML, 'text/xml');

        // this.wishbone.asObservable().subscribe((machine) => {
        //     if (machine && machine.SoundBopper) {
        //     }
        // });
    }

    cheat() {

        const nodes = this.xmlDoc.evaluate('/database/game[@crc="171251E3"]/gamegenie', this.xmlDoc, null, XPathResult.ANY_TYPE, null);
        let result = nodes.iterateNext();
        while (result) {
            const ggCode = {
                code: (<any>result.attributes).code.value,
                description:  (<any>result.attributes).description.value,
                active: false
            };
            this.ggCodes.push(ggCode);
            result = nodes.iterateNext();
        }

        const dialogRef = this.dialog.open(GameGenieDialogComponent, {
            height: '80%',
            width: '60%',
            data: { wishbone: this.wishbone, codes: this.ggCodes }
          });
        dialogRef.afterClosed().subscribe(() => {
            console.log(this.ggCodes[0].active);
        });

    }
}

class XmlHolder {
static ggXML = `<database>
<game code="CLV-H-FKTWT" name="10-Yard Fight" crc="3D564757">
  <gamegenie code="ZEEXIPIE" description="Your team runs faster" />
</game>
<game code="CLV-H-THQIF" name="1942" crc="171251E3">
  <gamegenie code="SZXLKEVK" description="Infinite lives - 1P game" />
  <gamegenie code="OLZNEE" description="Don't die when touched" />
  <gamegenie code="PAEIXKNY" description="Most enemies die instantly" />
  <gamegenie code="SZESPUVK" description="Infinite rolls" />
  <gamegenie code="AEUSGZAP" description="Rapid fire" />
  <gamegenie code="ALKUTGEL" description="Hit anywhere (1 of 4)" />
  <gamegenie code="SXULIKSO" description="Hit anywhere (2 of 4)" />
  <gamegenie code="SZELGKSO" description="Hit anywhere (3 of 4)" />
  <gamegenie code="SZKULGAX" description="Hit anywhere (4 of 4)" />
  <gamegenie code="IESUTYZA" description="Start with 6 lives - 1P game" />
  <gamegenie code="AESUTYZE" description="Start with 9 lives - 1P game" />
  <gamegenie code="IAKUUAZA" description="After continue, P1 has 6 lives in 2P game" />
  <gamegenie code="AAKUUAZE" description="After continue, P1 has 9 lives in 2P game" />
  <gamegenie code="IASUOAZA" description="P2 has 6 lives - 2P game" />
  <gamegenie code="AASUOAZE" description="P2 has 9 lives - 2P game" />
  <gamegenie code="PASIOALE" description="Start with 9 rolls - both players" />
</game>
<game code="CLV-H-LSFTO" name="1943: The Battle of Midway" crc="12C6D5C7">
  <gamegenie code="SUTXGN" description="Infinite power-ups" />
  <gamegenie code="SGOUZUVK" description="Infinite weapon upgrade time" />
  <gamegenie code="OUNLAZGA" description="Infinite energy" />
  <gamegenie code="SXVLZXSE" description="Infinite energy (alt 2) (1 of 2)" />
  <gamegenie code="VVOULXVK" description="Infinite energy (alt 2) (2 of 2)" />
  <gamegenie code="NSKIELGA" description="Don't instantly die from touching boss planes" />
  <gamegenie code="LEEPXLAE" description="Always shoot power shots" />
  <gamegenie code="ZESNLLLE" description="10 power points" />
  <gamegenie code="GOSNLLLA" description="20 power points" />
  <gamegenie code="TOSNLLLE" description="30 power points" />
  <gamegenie code="AENSKLAP" description="Hit anywhere (1 of 7)" />
  <gamegenie code="GZESEGEL" description="Hit anywhere (2 of 7)" />
  <gamegenie code="SLSKOEOO" description="Hit anywhere (3 of 7)" />
  <gamegenie code="SXOINUOO" description="Hit anywhere (4 of 7)" />
  <gamegenie code="SXXGVEOO" description="Hit anywhere (5 of 7)" />
  <gamegenie code="SZKTSXOO" description="Hit anywhere (6 of 7)" />
  <gamegenie code="SZVGSVOO" description="Hit anywhere (7 of 7)" />
  <gamegenie code="AEVYZLAE" description="Start on mission 5" />
  <gamegenie code="ZOVYZLAA" description="Start on mission 10" />
  <gamegenie code="GOVYZLAE" description="Start on mission 15" />
  <gamegenie code="TXVYZLAA" description="Start on mission 20" />
</game>
<game code="CLV-H-IHFWY" name="3-D Battles of Worldrunner, The" crc="E6A477B2">
  <gamegenie code="ATPXIG" description="Invincibility" />
  <gamegenie code="AEUOLTPA" description="Infinite lives" />
  <gamegenie code="SXUPZGVG" description="Infinite time" />
  <gamegenie code="NNXOYGEK" description="Slow down timer" />
  <gamegenie code="AVXOYGEG" description="Speed up timer" />
  <gamegenie code="OXUONISX" description="Autofire" />
  <gamegenie code="AEUOVIGA" description="Start with and keep laser missiles" />
  <gamegenie code="PEUPPTLA" description="Start with 1 life (1 of 2)" />
  <gamegenie code="PLVOLTLL" description="Start with 1 life (2 of 2)" />
  <gamegenie code="TEUPPTLA" description="Start with 6 lives (1 of 2)" />
  <gamegenie code="TLVOLTLL" description="Start with 6 lives (2 of 2)" />
  <gamegenie code="PEUPPTLE" description="Start with 9 lives (1 of 2)" />
  <gamegenie code="PLVOLTLU" description="Start with 9 lives (2 of 2)" />
  <gamegenie code="XZEAUOOZ" description="Start on world XX (1 of 3)" />
  <gamegenie code="VAEASPSA" description="Start on world XX (2 of 3)" />
  <gamegenie code="PAEAKPAA" description="Start on world 2 (3 of 3)" />
  <gamegenie code="ZAEAKPAA" description="Start on world 3 (3 of 3)" />
  <gamegenie code="LAEAKPAA" description="Start on world 4 (3 of 3)" />
  <gamegenie code="GAEAKPAA" description="Start on world 5 (3 of 3)" />
  <gamegenie code="IAEAKPAA" description="Start on world 6 (3 of 3)" />
  <gamegenie code="TAEAKPAA" description="Start on world 7 (3 of 3)" />
</game>
<game code="CLV-H-IXXON" name="720°" crc="49F745E0">
  <gamegenie code="SZUYASVK" description="Infinite continues" />
  <gamegenie code="PEXKLZLE" description="9 continues" />
  <gamegenie code="TEXKLZLA" description="6 continues" />
  <gamegenie code="PEXKLZLA" description="No continues instead of 2" />
  <gamegenie code="GEKKYZAA" description="Start with all equipment" />
  <gamegenie code="ZEKKYZAA" description="Start with half equipment" />
  <gamegenie code="XVXGGXSX" description="Start on level XX (1 of 2)" />
  <gamegenie code="OXXGIXTE" description="Start on level XX (2 of 2)" />
  <gamegenie code="ZEXGTZZA" description="Start on level 2 (3 of 3)" />
  <gamegenie code="LEXGTZZA" description="Start on level 3 (3 of 3)" />
  <gamegenie code="GEXGTZZA" description="Start on level 4 (3 of 3)" />
</game>
<game code="CLV-H-QZIVA" name="8 Eyes" crc="326AB3B6">
  <gamegenie code="EIUUSLEY" description="Invincibility - Orin" />
  <gamegenie code="EINGVPEY" description="Invincibility - Cutrus" />
  <gamegenie code="SXOUSUSE" description="Infinite health - Orin" />
  <gamegenie code="SXNGNOSE" description="Infinite health - Cutrus" />
  <gamegenie code="GXOUSUSE" description="Most attacks won't damage Orin" />
  <gamegenie code="GXNGNOSE" description="Most attacks won't damage Cutrus" />
  <gamegenie code="AGVXGXYZ" description="Start with more health - Orin" />
  <gamegenie code="AGVXIXYZ" description="Start with more health - Cutrus" />
  <gamegenie code="SAOVUTVA" description="Start with all weapons" />
  <gamegenie code="YGVXTXYX" description="Start with max ammo" />
  <gamegenie code="SXSLKVSE" description="Infinite ammo" />
  <gamegenie code="YZVXTZAE" description="Start with some item power" />
  <gamegenie code="GXSLKVSE" description="Never lose item power once gained" />
  <gamegenie code="VTOVNTVA" description="Start with Dagger" />
</game>
<game code="CLV-H-ZOHPB" name="Abadox: The Deadly Inner War" crc="B134D713">
  <gamegenie code="PEIGPN" description="Infinite lives (lives never decrease)" />
  <gamegenie code="VVIGAY" description="Infinite lives (lives increase when you die)" />
  <gamegenie code="AVVTXYSZ" description="Invincible against touching enemies" />
  <gamegenie code="AEXSLIEG" description="Invincible against walls (does not stop music)" />
  <gamegenie code="EIESEIEY" description="Invincibility (1 of 2)" />
  <gamegenie code="EYESKTEI" description="Invincibility (2 of 2)" />
  <gamegenie code="ESSYIPEP" description="Hit anywhere (1 of 4)" />
  <gamegenie code="EUNNZPEI" description="Hit anywhere (2 of 4)" />
  <gamegenie code="EUUYPPEP" description="Hit anywhere (3 of 4)" />
  <gamegenie code="GZOYAZAL" description="Hit anywhere (4 of 4)" />
  <gamegenie code="ZANGKGPA" description="Start on level 2" />
  <gamegenie code="LANGKGPA" description="Start on level 3" />
  <gamegenie code="IANGKGPA" description="Start on level 4" />
  <gamegenie code="TANGKGPA" description="Start on level 6" />
</game>
<game code="CLV-H-CLHFJ" name="Addams Family, The" crc="65518EAE">
  <gamegenie code="SXPATK" description="Invincibility" />
  <gamegenie code="PEVGGALA" description="Start with 1 life - 1st game only" />
  <gamegenie code="TEVGGALA" description="Start with 6 lives - 1st game only" />
  <gamegenie code="PEVGGALE" description="Start with 9 lives - 1st game only" />
  <gamegenie code="GXSVAUVK" description="Infinite lives" />
  <gamegenie code="GXKKZSVK" description="Infinite life" />
  <gamegenie code="GXEVLVVK" description="Infinite Things" />
  <gamegenie code="AINEGYEI" description="Walk through walls (1 of 2)" />
  <gamegenie code="ASEAYYEI" description="Walk through walls (2 of 2)" />
  <gamegenie code="GXEZGTEP" description="Get items from anywhere - from above" />
  <gamegenie code="GXEXLTEL" description="Get items from anywhere - from below" />
  <gamegenie code="GXOZITEP" description="Get items from anywhere - from the right" />
  <gamegenie code="GXOXYTEP" description="Get items from anywhere - from the left" />
  <gamegenie code="ELEZOGEP" description="No Piranha Plant enemies" />
  <gamegenie code="PEKGTAAA" description="Start in the tree" />
  <gamegenie code="ZEKGTAAA" description="Start in the crypt" />
  <gamegenie code="LEKGTAAA" description="Start in the hallway" />
  <gamegenie code="AEKGTAAE" description="Start in Fester's room" />
  <gamegenie code="PEKGTAAE" description="Start in Pugsly's room" />
  <gamegenie code="ZEKGTAAE" description="Start in the toy room" />
  <gamegenie code="LEKGTAAE" description="Start in Wednesday's room" />
  <gamegenie code="GEKGTAAE" description="Start in the attic" />
  <gamegenie code="YEKGTAAE" description="Start in a secret room" />
  <gamegenie code="AOKGTAAA" description="Start in a secret room" />
  <gamegenie code="POKGTAAA" description="Start in a secret room" />
  <gamegenie code="IOKGTAAE" description="Start in the bone room" />
  <gamegenie code="PXKGTAAA" description="Start in the freezer" />
  <gamegenie code="ZXKGTAAA" description="Start in the furnace" />
  <gamegenie code="AXKGTAAA" description="Start in Gomez's room" />
</game>
<game code="CLV-H-JUJYV" name="Addams Family, The: Pugsley's Scavenger Hunt" crc="063E5653">
  <gamegenie code="ATGKAG" description="Invincibility" />
  <gamegenie code="SZGKAK" description="Infinite health" />
  <gamegenie code="AAKGYGPA" description="Infinite health (alt)" />
  <gamegenie code="ESVONGEY" description="Enemies can't move horizontally" />
  <gamegenie code="EIEOEIEY" description="Enemies can't move vertically" />
  <gamegenie code="APKOOIAL" description="No enemies" />
  <gamegenie code="EIEKYGEY" description="Sweets count as extra lives also" />
  <gamegenie code="GXOVPYEY" description="Always able to fly (alt)" />
  <gamegenie code="GXUTKPEY" description="Invincibility status effect" />
  <gamegenie code="PEVKZTIA" description="Start with 1 life" />
  <gamegenie code="PEVKZTIE" description="Start with 9 lives" />
  <gamegenie code="SXUGZKVK" description="Infinite lives" />
  <gamegenie code="SULGZK" description="Infinite lives (alt)" />
  <gamegenie code="PENKZTZA" description="Start with 1 heart" />
  <gamegenie code="GENKZTZA" description="Start with 4 hearts" />
  <gamegenie code="AASVUGIL" description="Always able to fly" />
  <gamegenie code="AOVTETAO" description="Mega-jump" />
</game>
<game code="CLV-H-RTYIH" name="DragonStrike, Advanced Dungeons &amp; Dragons" crc="2C5908A7">
  <gamegenie code="ATGGNY" description="Invincibility" />
  <gamegenie code="SZGGNN" description="Infinite health" />
  <gamegenie code="OTKGSYSV" description="Infinite health (alt)" />
  <gamegenie code="GPKZGEAZ" description="Start with less health - bronze dragon" />
  <gamegenie code="AIKZGEAZ" description="Start with more health - bronze dragon" />
  <gamegenie code="TPKZIEGU" description="Start with less health - silver dragon" />
  <gamegenie code="AIKZIEGL" description="Start with more health - silver dragon" />
  <gamegenie code="ZZKZTAAS" description="Start with less health - gold dragon" />
  <gamegenie code="ITKZTAAI" description="Start with more health - gold dragon" />
  <gamegenie code="GZKKNNSE" description="Weapon power doesn't weaken with health" />
  <gamegenie code="TTXGIALT" description="Gold dragon has excellent armor class" />
  <gamegenie code="YGXKAAPG" description="Gold dragon flies faster" />
  <gamegenie code="ATXGYAGV" description="Silver dragon flies faster" />
  <gamegenie code="YIXGTALI" description="Bronze dragon flies faster" />
</game>
<game code="CLV-H-VJJOF" name="Heroes of the Lance, Advanced Dungeons &amp; Dragons" crc="B17574F3">
  <gamegenie code="SUOAZGSP" description="Infinite HP for party in most battles" />
</game>
<game code="CLV-H-LPRCU" name="Hillsfar, Advanced Dungeons &amp; Dragons" crc="5DE61639">
  <gamegenie code="AOULILAZ" description="Faster timer when lock-picking" />
  <gamegenie code="ASULILAZ" description="Slower timer when lock-picking" />
  <gamegenie code="ENULILAZ" description="Very slow timer when lock-picking" />
  <gamegenie code="SXKUTSVK" description="Infinite Knock Rings (1 of 2)" />
  <gamegenie code="AEKUISAI" description="Infinite Knock Rings (2 of 2)" />
  <gamegenie code="IEVANKZA" description="Start with 50% less gold on a character that you create" />
  <gamegenie code="YEVANKZE" description="Start with 50% more gold on a character that you create" />
  <gamegenie code="GOVANKZA" description="Start with 100% more gold on a character that you create" />
</game>
<game code="CLV-H-BAUCD" name="Pool of Radiance, Advanced Dungeons &amp; Dragons" crc="25952141">
  <gamegenie code="SOLAUN" description="Create super characters" />
  <gamegenie code="XGLAUN" description="Girdle Of Giant strength (Must be used to be effective) (1 of 2)" />
  <gamegenie code="GGLAUP" description="Girdle Of Giant strength (Must be used to be effective) (2 of 2)" />
  <gamegenie code="TLGAXL" description="Extra EXP points" />
  <gamegenie code="AXLALN" description="One hit ends battle with no gold or EXP" />
</game>
<game code="CLV-H-NYMYR" name="Adventures in the Magic Kingdom, Disney's" crc="5DBD6099">
  <gamegenie code="ATPNTI" description="Invincibility" />
  <gamegenie code="AVXNXPVG" description="Infinite health" />
  <gamegenie code="ATXYKZEL" description="Infinite time" />
  <gamegenie code="SZSTGVVK" description="Infinite candles" />
  <gamegenie code="SXKYUOVK" description="Infinite lives" />
  <gamegenie code="LAKUTGTA" description="'Life' costs less" />
  <gamegenie code="GAKUTGTE" description="'Life' costs more" />
  <gamegenie code="GAKUYKAA" description="'Freeze' costs less" />
  <gamegenie code="YAKUYKAE" description="'Freeze' costs more" />
  <gamegenie code="IASLAKZA" description="'Invincible' costs less" />
  <gamegenie code="GPSLAKZA" description="'Invincible' costs more" />
  <gamegenie code="TASLPKGA" description="'Life Up' costs less" />
  <gamegenie code="APSLPKGE" description="'Life Up' costs more" />
  <gamegenie code="PEVEIALA" description="Start with 1 life" />
  <gamegenie code="TEVEIALA" description="Start with 6 lives" />
  <gamegenie code="PEVEIALE" description="Start with 9 lives" />
  <gamegenie code="SXKYUOVK" description="Never lose a life in 'attractions'" />
  <gamegenie code="NYKULZKU" description="More 'Freeze' time" />
  <gamegenie code="AGKULZKL" description="Less 'Freeze' time" />
  <gamegenie code="EGSUYXGL" description="More 'Invincible' time" />
  <gamegenie code="EYKVNKXN" description="Mega-jump" />
  <gamegenie code="PAVAZPLA" description="Start with less health in attractions" />
  <gamegenie code="IAVAZPLA" description="Start with more health in attractions" />
  <gamegenie code="PAVAZPLE" description="Start with even more health in attractions" />
  <gamegenie code="SXXNXPVG" description="Almost infinite health in attractions" />
  <gamegenie code="GXELLXSN" description="All items for free (1 of 2)" />
  <gamegenie code="AAXUAXGY" description="All items for free (2 of 2)" />
</game>
<game code="CLV-H-SEAIR" name="Adventures of Bayou Billy, The" crc="67751094">
  <gamegenie code="GZOVLLVG" description="Infinite lives" />
  <gamegenie code="PEKVIZYA" description="Infinite health (1 of 2)" />
  <gamegenie code="SXOOUKVK" description="Infinite health (2 of 2)" />
  <gamegenie code="EZNATKKZ" description="Always have X weapon (1 of 3)" />
  <gamegenie code="XTNEAGYE" description="Always have X weapon (2 of 3)" />
  <gamegenie code="PANAYGOG" description="Always have pistol (3 of 3)" />
  <gamegenie code="ZANAYGOG" description="Always have knife (3 of 3)" />
  <gamegenie code="LANAYGOG" description="Always have ugly stick (3 of 3)" />
  <gamegenie code="IANAYGOG" description="Always have whip (3 of 3)" />
  <gamegenie code="IEOVAYGA" description="Start a new game to view the ending (game A or B)" />
  <gamegenie code="AAETAGZA" description="Start with 1 life" />
  <gamegenie code="IAETAGZA" description="Start with 6 lives" />
  <gamegenie code="AAETAGZE" description="Start with 9 lives" />
  <gamegenie code="UYEVGKPU" description="Start on level XX (1 of 3)" />
  <gamegenie code="AAEVAGGA" description="Start on level XX (2 of 3)" />
  <gamegenie code="PAEVZGAA" description="Start on level 2 (3 of 3)" />
  <gamegenie code="ZAEVZGAA" description="Start on level 3 (3 of 3)" />
  <gamegenie code="LAEVZGAA" description="Start on level 4 (3 of 3)" />
  <gamegenie code="GAEVZGAA" description="Start on level 5 (3 of 3)" />
  <gamegenie code="IAEVZGAA" description="Start on level 6 (3 of 3)" />
  <gamegenie code="TAEVZGAA" description="Start on level 7 (3 of 3)" />
  <gamegenie code="YAEVZGAA" description="Start on level 8 (3 of 3)" />
</game>
<game code="CLV-H-BBXDC" name="Captain Comic: The Adventure" crc="A5E89675">
  <gamegenie code="SLATVK" description="Infinite health" />
  <gamegenie code="SZATZN" description="Infinite lives" />
  <gamegenie code="SZATEK" description="Invincibility" />
</game>
<game code="CLV-H-JJUKX" name="Adventures of Dino Riki" crc="9BDE3267">
  <gamegenie code="ATLAEZ" description="Invincibility" />
  <gamegenie code="GKNONOSU" description="Hit anywhere (1 of 3)" />
  <gamegenie code="XPEPOZLE" description="Hit anywhere (1 of 3)" />
  <gamegenie code="YGEPEZGV" description="Hit anywhere (1 of 3)" />
  <gamegenie code="SZEETTVG" description="Start with infinite lives" />
  <gamegenie code="AESEPGZA" description="Start with 1 life" />
  <gamegenie code="IESEPGZA" description="Start with 6 lives" />
  <gamegenie code="AESEPGZE" description="Start with 9 lives" />
  <gamegenie code="SZUENZVG" description="Start with infinite life hearts" />
  <gamegenie code="GESEIGZA" description="Start with 4 life hearts" />
  <gamegenie code="AESEIGZE" description="Start with 8 life hearts" />
  <gamegenie code="VVEAPISA" description="Start as Macho-Riki" />
  <gamegenie code="IEVASPIG" description="Once Macho, stay Macho" />
  <gamegenie code="VKEAPISA" description="Start and stay as Macho-Riki" />
  <gamegenie code="AEKAOPZA" description="Don't fall into the pits (you'll still lose any special ability you currently have)" />
  <gamegenie code="TKSAAGSA" description="Start on stage XX (1 of 2)" />
  <gamegenie code="ZEKEIGAA" description="Start on stage 2-1 (2 of 2)" />
  <gamegenie code="GEKEIGAA" description="Start on stage 3-1 (2 of 2)" />
  <gamegenie code="TEKEIGAA" description="Start on stage 4-1 (2 of 2)" />
  <gamegenie code="AEKEIGAE" description="Start on stage 4-2 (2 of 2)" />
  <gamegenie code="ZEKEIGAE" description="Start on stage 4-3 (2 of 2)" />
  <gamegenie code="GEKEIGAE" description="Start on stage 4-4 (2 of 2)" />
</game>
<game code="CLV-H-WDTDT" name="After Burner" crc="F699EE7E">
  <gamegenie code="SKXVPZVG" description="Infinite lives" />
  <gamegenie code="SKNAXZVG" description="Infinite missiles" />
  <gamegenie code="SZKOLZSA" description="Invincibility" />
</game>
<game code="CLV-H-AOXUC" name="Air Fortress" crc="35C41CD4">
  <gamegenie code="SXKKNSSE" description="Infinite energy (1 of 2)" />
  <gamegenie code="SZEGOVSE" description="Infinite energy (2 of 2)" />
  <gamegenie code="ESSXAYEY" description="Invincibility (1 of 2)" />
  <gamegenie code="ENSXIYEI" description="Invincibility (2 of 2)" />
  <gamegenie code="SGUPKGVG" description="Infinite lives" />
  <gamegenie code="SZUPKGVG" description="Infinite lives outside fortress" />
  <gamegenie code="PAVPKZLA" description="Start with 1 life" />
  <gamegenie code="TAVPKZLA" description="Start with 6 lives" />
  <gamegenie code="PAVPKZLE" description="Start with 9 lives" />
  <gamegenie code="APKZNGIA" description="Double Bombs on pick-up" />
  <gamegenie code="AAKPSTPA" description="Infinite Beam Bullets" />
  <gamegenie code="GXKKSIST" description="Don't take damage inside fortress (1 of 2)" />
  <gamegenie code="GXNKNIST" description="Don't take damage inside fortress (2 of 2)" />
  <gamegenie code="YYNXUZGV" description="Extra energy on pick-up(1 of 2)" />
  <gamegenie code="YNEZEZGV" description="Extra energy on pick-up(2 of 2)" />
  <gamegenie code="XZSOXXPZ" description="Start on level XX (1 of 3)" />
  <gamegenie code="VASOKZSA" description="Start on level XX (2 of 3)" />
  <gamegenie code="PASOUZYA" description="Start on level 2 (3 of 3)" />
  <gamegenie code="ZASOUZYA" description="Start on level 3 (3 of 3)" />
  <gamegenie code="LASOUZYA" description="Start on level 4 (3 of 3)" />
  <gamegenie code="GASOUZYA" description="Start on level 5 (3 of 3)" />
  <gamegenie code="IASOUZYA" description="Start on level 6 (3 of 3)" />
  <gamegenie code="TASOUZYA" description="Start on level 7 (3 of 3)" />
</game>
<game code="CLV-H-KXJBR" name="Airwolf" crc="489EF6A2">
  <gamegenie code="SUTAPX" description="Infinite lives" />
  <gamegenie code="SLTXSN" description="Infinite health" />
  <gamegenie code="PAUGVILA" description="Start with 1 life" />
  <gamegenie code="TAUGVILA" description="Start with 6 lives" />
  <gamegenie code="PAUGVILE" description="Start with 9 lives" />
  <gamegenie code="PVXKKKLI" description="Start at last mission reached" />
  <gamegenie code="TPVAPXYE" description="Start with 30 missiles" />
  <gamegenie code="IZVAPXYE" description="Start with 45 missiles" />
  <gamegenie code="GXSZAPVG" description="Start with infinite missiles" />
  <gamegenie code="IEVAISYA" description="Sets missiles to 5 when you refuel" />
  <gamegenie code="TOVAISYE" description="Sets missiles to 30 when you refuel" />
</game>
<game code="CLV-H-VZVNM" name="Al Unser Jr. Turbo Racing" crc="5BC9D7A1">
  <gamegenie code="AENSANPZ" description="Can't be slowed down by signs and grass, prevents suspension from being shot (1 of 3)" />
  <gamegenie code="SZEIOAVG" description="Can't be slowed down by signs and grass, prevents suspension from being shot (2 of 3)" />
  <gamegenie code="SZSIOASA" description="Can't be slowed down by signs and grass, prevents suspension from being shot (3 of 3)" />
</game>
<game code="CLV-H-WTENM" name="Alfred Chicken" crc="63E992AC">
  <gamegenie code="SXZNIG" description="Invincibility" />
  <gamegenie code="AVGLXA" description="Infinite time (alt)" />
  <gamegenie code="SXGNXE" description="Infinite lives (alt)" />
  <gamegenie code="AASGITZA" description="Start with 1 life" />
  <gamegenie code="PASGITZA" description="Start with 2 lives" />
  <gamegenie code="EVKNKAPA" description="Infinite lives" />
  <gamegenie code="AVULEESZ" description="Infinite time" />
  <gamegenie code="NNXYKPZU" description="255 points for each present collected" />
  <gamegenie code="GVXYKPZL" description="108 points for each present collected" />
  <gamegenie code="PAKLTPTA" description="Only need 1 diamond for an extra life" />
  <gamegenie code="OZXKXZOU" description="X balloons needed to complete a level (1 of 2)" />
  <gamegenie code="LAXKUZPI" description="3 balloons needed to complete a level (2 of 2)" />
  <gamegenie code="ZAXKUZPI" description="2 balloons needed to complete a level (2 of 2)" />
  <gamegenie code="PAXKUZPI" description="1 balloon needed to complete a level (2 of 2)" />
</game>
<game code="CLV-H-BSELI" name="Alien³" crc="C527C297">
  <gamegenie code="SXOPNKVK" description="Invincibility (1 of 3)" />
  <gamegenie code="YEKVUPGV" description="Invincibility (2 of 3)" />
  <gamegenie code="YESIGIGV" description="Invincibility (3 of 3)" />
  <gamegenie code="AEOLYVIA" description="Hit anywhere (1 of 2)" />
  <gamegenie code="ATKYZIST" description="Hit anywhere (2 of 2)" />
  <gamegenie code="SXUYUXSE" description="Infinite health" />
  <gamegenie code="SUEUTXSO" description="Infinite time" />
  <gamegenie code="SZKVZXVK" description="Infinite lives" />
  <gamegenie code="SXOSNKVT" description="Infinite gun heat" />
  <gamegenie code="IPUZTALA" description="Super-jump (1 of 2)" />
  <gamegenie code="IPUXPALA" description="Super-jump (2 of 2)" />
  <gamegenie code="AASGKNYA" description="Invincible against long falls" />
  <gamegenie code="NNKVNPAE" description="Always have Radar" />
  <gamegenie code="SZVXVXVK" description="Infinite Radar" />
  <gamegenie code="SXXSNKVK" description="Infinite ammo for Machine gun" />
  <gamegenie code="SZVSSKVK" description="Infinite ammo for Grenade Launcher" />
  <gamegenie code="SZKLVSVK" description="Infinite ammo for Grenade Launcher 2" />
  <gamegenie code="SZEIUOVK" description="Infinite ammo for Flame Thrower" />
  <gamegenie code="TUVUYLZG" description="Level skip (pause and press any key (except left)" />
</game>
<game code="CLV-H-LVJIN" name="Alien Syndrome" crc="CBF4366F">
  <gamegenie code="SZUNYXVK" description="Infinite time" />
  <gamegenie code="GUONPPLL" description="Set timer to 440" />
  <gamegenie code="PAOGPIGA" description="Start with 1 life - both players" />
  <gamegenie code="AAOGPIGE" description="Start with 8 lives - both players" />
  <gamegenie code="PAVKGIAA" description="Start with Flame Thrower" />
  <gamegenie code="ZAVKGIAA" description="Start with Fireball" />
  <gamegenie code="LAVKGIAA" description="Start with Laser" />
  <gamegenie code="AEEKXONY" description="Don't lose life when shot or touched" />
  <gamegenie code="AANGVXNY" description="Don't lose life from falling down holes" />
  <gamegenie code="PEXGGLGA" description="1 life after continue" />
  <gamegenie code="AEXGGLGE" description="8 lives after continue" />
  <gamegenie code="KUNNXLAA" description="Start on round X (1 of 3)" />
  <gamegenie code="LENNULAZ" description="Start on round X (2 of 3)" />
  <gamegenie code="PENNELAP" description="Start on round 2 (3 of 3)" />
  <gamegenie code="ZENNELAP" description="Start on round 3 (3 of 3)" />
  <gamegenie code="LENNELAP" description="Start on round 4 (3 of 3)" />
  <gamegenie code="GENNELAP" description="Start on round 5 (3 of 3)" />
  <gamegenie code="IENNELAP" description="Start on round 6 (3 of 3)" />
  <gamegenie code="TENNELAP" description="Start on round 7 (3 of 3)" />
</game>
<game code="CLV-H-MZRUJ" name="Alpha Mission" crc="DBF90772">
  <gamegenie code="OUXKZPOP" description="Invincibility" />
  <gamegenie code="SXSPYZVG" description="Infinite lives" />
  <gamegenie code="PASATLLA" description="Start with 1 life" />
  <gamegenie code="TASATLLA" description="Start with double lives" />
  <gamegenie code="PASATLLE" description="Start with triple lives" />
  <gamegenie code="NYKAYLLE" description="Start with all weapons available" />
  <gamegenie code="GZNAILSA" description="Keep power up after death" />
  <gamegenie code="GZNAYLSA" description="Keep energy after death" />
  <gamegenie code="GAEOUEAA" description="Thunder uses 25% normal energy" />
  <gamegenie code="TEXLPTZA" description="Triple energy gained on 'E' pick-up" />
  <gamegenie code="ZEULGTGA" description="Less energy lost on 'Bad E' pick-ups" />
  <gamegenie code="SZEGGASA" description="Shield doesn't use energy" />
  <gamegenie code="IZNAEGSA" description="You can re-use weapon after selecting" />
</game>
<game code="CLV-H-OBKIN" name="Amagon" crc="E2B43A68">
  <gamegenie code="ESNIZLEY" description="Invincibility" />
  <gamegenie code="AVOXGOOZ" description="Invincible against enemies" />
  <gamegenie code="ATXZPOOZ" description="Invincible against bullets" />
  <gamegenie code="AVNZAOOZ" description="Invincible against area boss" />
  <gamegenie code="AAXGNYPA" description="Start with infinite lives" />
  <gamegenie code="PEOVIZGA" description="Start with 1 life" />
  <gamegenie code="AEOVIZGE" description="Start with 8 lives" />
  <gamegenie code="GZSZIZSP" description="Infinite mega-power" />
  <gamegenie code="PEOVPZGA" description="Start with no bullets" />
  <gamegenie code="YEOVPZGA" description="Start with 600 bullets" />
  <gamegenie code="AAVYLTPA" description="Infinite ammo" />
  <gamegenie code="SLVYGTSP" description="Infinite ammo (alt)" />
  <gamegenie code="PAVKUIZA" description="Gain 10 bullets on pick-up" />
  <gamegenie code="LAVKUIZA" description="Gain 30 bullets on pick-up" />
</game>
<game code="CLV-H-YHPFR" name="American Gladiators" crc="1973AEA8">
  <gamegenie code="PEXALTIA" description="Start with 1 life - P1" />
  <gamegenie code="AEXALTIE" description="Start with 8 lives - P1" />
  <gamegenie code="ZEXALTIE" description="Start with 10 lives - P1" />
  <gamegenie code="GOXALTIA" description="Start with 20 lives - P1" />
  <gamegenie code="PEVALTIA" description="Start with 1 life - P2" />
  <gamegenie code="AEVALTIE" description="Start with 8 lives - P2" />
  <gamegenie code="ZEVALTIE" description="Start with 10 lives - P2" />
  <gamegenie code="GOVALTIA" description="Start with 20 lives - P2" />
  <gamegenie code="PEXAPTAA" description="Start on level 2 - P1" />
  <gamegenie code="ZEXAPTAA" description="Start on level 3 - P1" />
  <gamegenie code="LEXAPTAA" description="Start on level 4 - P1" />
  <gamegenie code="PEVAPTAA" description="Start on level 2 - P2" />
  <gamegenie code="ZEVAPTAA" description="Start on level 3 - P2" />
  <gamegenie code="LEVAPTAA" description="Start on level 4 - P2" />
  <gamegenie code="GLUOZGLV" description="Less joust time" />
  <gamegenie code="GZXXLUVK" description="Stop joust timer" />
  <gamegenie code="GLOEGALV" description="Less cannonball time" />
  <gamegenie code="GZEPGOVK" description="Stop cannonball time" />
  <gamegenie code="GLKXXZLV" description="Less wall time" />
  <gamegenie code="GXOXEXVS" description="Stop wall timer" />
  <gamegenie code="LTXATNIL" description="More assault time" />
  <gamegenie code="PZXATNIU" description="Less assault time" />
  <gamegenie code="GZSAINVK" description="Stop assault timer" />
  <gamegenie code="LTSOZOIL" description="More power ball time - level 1" />
  <gamegenie code="LTSOLOAL" description="More power ball time - level 2" />
  <gamegenie code="LTSOGPLL" description="More power ball time - level 3" />
  <gamegenie code="LTSOIOTZ" description="More power ball time - level 4" />
</game>
<game code="CLV-H-OTXZO" name="Anticipation" crc="99A9F57E">
  <gamegenie code="ZUUPYNPP" description="More time to answer questions" />
  <gamegenie code="YEUPYNPO" description="Less time to answer questions" />
  <gamegenie code="AANZATEG" description="Infinite chances" />
</game>
<game code="CLV-H-CIKTQ" name="Arch Rivals: A Basketbrawl!" crc="C740EB46">
  <gamegenie code="GZVPOZEI" description="Never miss a shot - both players" />
  <gamegenie code="ALXLNZGU" description="More time for a quarter (1 of 2)" />
  <gamegenie code="ALNLPPGU" description="More time for a quarter (2 of 2)" />
  <gamegenie code="ZLXLNZGL" description="Less time for a quarter (1 of 2)" />
  <gamegenie code="ZLNLPPGL" description="Less time for a quarter (2 of 2)" />
  <gamegenie code="AVNPLAAZ" description="Run faster without ball (1 of 2)" />
  <gamegenie code="ATVPAPAZ" description="Run faster without ball (2 of 2)" />
  <gamegenie code="IXVOPAGA" description="Super speed (1 of 2)" />
  <gamegenie code="IZSPGPGA" description="Super speed (2 of 2)" />
</game>
<game code="CLV-H-JTOPO" name="Archon" crc="F304F1B9">
  <gamegenie code="AASSIEUT" description="Unrestricted ground movement" />
  <gamegenie code="AAKIGAGA" description="Unrestricted flying movement" />
</game>
<game code="CLV-H-RYPYJ" name="Arkanoid" crc="32FB0583">
  <gamegenie code="OZNEATVK" description="Infinite lives - both players" />
  <gamegenie code="SZNEATVG" description="Infinite lives (alt)" />
  <gamegenie code="AESXNALL" description="Paddle hits ball anywhere (1 of 2)" />
  <gamegenie code="ASVZNAEP" description="Paddle hits ball anywhere (2 of 2)" />
  <gamegenie code="PAOPUGLA" description="Start with 1 life - P1" />
  <gamegenie code="TAOPUGLA" description="Start with 6 lives - P1" />
  <gamegenie code="PAOPUGLE" description="Start with 9 lives - P1" />
  <gamegenie code="SXVATAAX" description="No lasers" />
  <gamegenie code="VVZZPP" description="Square ball" />
  <gamegenie code="GZOONGPA" description="Start on boss level" />
  <gamegenie code="AAOONGPA" description="Start on level 00" />
  <gamegenie code="PAOONGPA" description="Start on level 01" />
  <gamegenie code="ZAOONGPA" description="Start on level 02" />
  <gamegenie code="LAOONGPA" description="Start on level 03" />
  <gamegenie code="GAOONGPA" description="Start on level 04" />
  <gamegenie code="IAOONGPA" description="Start on level 05" />
  <gamegenie code="TAOONGPA" description="Start on level 06" />
  <gamegenie code="YAOONGPA" description="Start on level 07" />
  <gamegenie code="AAOONGPE" description="Start on level 08" />
  <gamegenie code="PAOONGPE" description="Start on level 09" />
  <gamegenie code="ZAOONGPE" description="Start on level 10" />
  <gamegenie code="LAOONGPE" description="Start on level 11" />
  <gamegenie code="GAOONGPE" description="Start on level 12" />
  <gamegenie code="IAOONGPE" description="Start on level 13" />
  <gamegenie code="TAOONGPE" description="Start on level 14" />
  <gamegenie code="YAOONGPE" description="Start on level 15" />
  <gamegenie code="APOONGPA" description="Start on level 16" />
  <gamegenie code="PPOONGPA" description="Start on level 17" />
  <gamegenie code="ZPOONGPA" description="Start on level 18" />
  <gamegenie code="LPOONGPA" description="Start on level 19" />
  <gamegenie code="GPOONGPA" description="Start on level 20" />
  <gamegenie code="IPOONGPA" description="Start on level 21" />
  <gamegenie code="YPOONGPA" description="Start on level 22" />
  <gamegenie code="YPOONGPA" description="Start on level 23" />
  <gamegenie code="APOONGPE" description="Start on level 24" />
  <gamegenie code="PPOONGPE" description="Start on level 25" />
  <gamegenie code="ZPOONGPE" description="Start on level 26" />
  <gamegenie code="LPOONGPE" description="Start on level 27" />
  <gamegenie code="GPOONGPE" description="Start on level 28" />
  <gamegenie code="IPOONGPE" description="Start on level 29" />
  <gamegenie code="TPOONGPE" description="Start on level 30" />
  <gamegenie code="YPOONGPE" description="Start on level 31" />
  <gamegenie code="AZOONGPA" description="Start on level 32" />
  <gamegenie code="PZOONGPA" description="Start on level 33" />
  <gamegenie code="ZZOONGPA" description="Start on level 34" />
  <gamegenie code="LZOONGPA" description="Start on level 35" />
  <gamegenie code="GZOONGPA" description="Start on level 36" />
</game>
<game code="CLV-H-WJFTK" name="Arkista's Ring" crc="1425D7F4">
  <gamegenie code="AAXXXTEG" description="Hit anywhere" />
  <gamegenie code="AAKPZNAP" description="Walk through walls (1 of 4)" />
  <gamegenie code="AAOPYNYA" description="Walk through walls (2 of 4)" />
  <gamegenie code="AEEOZNKP" description="Walk through walls (3 of 4)" />
  <gamegenie code="AESOGTTP" description="Walk through walls (4 of 4)" />
  <gamegenie code="PAKETILA" description="Start with 1 life" />
  <gamegenie code="TAKETILA" description="Start with 6 lives" />
  <gamegenie code="PAKETILE" description="Start with 9 lives" />
  <gamegenie code="SZULXKVK" description="Infinite lives" />
  <gamegenie code="ZAKATIIA" description="Start with fewer hearts" />
  <gamegenie code="PAKATIIE" description="Start with more hearts" />
  <gamegenie code="LAEPYSYA" description="Less damage from powerful monsters" />
  <gamegenie code="GZOPTIST" description="Infinite health" />
  <gamegenie code="IPUAGSLA" description="Start with 20 continues" />
  <gamegenie code="TAUAGSLA" description="Start with 5 continues" />
</game>
<game code="CLV-H-VTPJG" name="Astyanax" crc="054CB4EB">
  <gamegenie code="EYNAGPEI" description="Invincibility" />
  <gamegenie code="AUEKGUAP" description="Infinite SP (spell)" />
  <gamegenie code="SZUGTISA" description="Infinite health" />
  <gamegenie code="GXKSKPEL" description="Hit anywhere (1 of 2)" />
  <gamegenie code="GXUISPAL" description="Hit anywhere (2 of 2)" />
  <gamegenie code="EEEEIZYY" description="Multi-jump (1 of 3)" />
  <gamegenie code="EEEEYZAP" description="Multi-jump (2 of 3)" />
  <gamegenie code="ZUOAPZIL" description="Multi-jump (3 of 3)" />
  <gamegenie code="AZKAVZGO" description="Double health and SP" />
  <gamegenie code="PAKEKZAA" description="Start with Blast Spell" />
  <gamegenie code="ZAKEKZAA" description="Start with Bind Spell" />
  <gamegenie code="GPKAXZGA" description="Start with extra weapon power" />
  <gamegenie code="SZUGEUVK" description="Keep weapons after death" />
  <gamegenie code="IEUEUGZA" description="Start with double lives (1 of 2)" />
  <gamegenie code="IASAXZZA" description="Start with double lives (2 of 2)" />
  <gamegenie code="AEUEUGZE" description="Start with triple lives (1 of 2)" />
  <gamegenie code="AASAXZZE" description="Start with triple lives (2 of 2)" />
</game>
<game code="CLV-H-HNIBN" name="Athena" crc="27DDF227">
  <gamegenie code="GZUZLISA" description="Infinite health (after first 2 units)" />
  <gamegenie code="AAULLYPA" description="Infinite time" />
  <gamegenie code="AOKEOPEL" description="Collect items from anywhere" />
  <gamegenie code="AEKNLPZA" description="Start with 1 life" />
  <gamegenie code="IEKNLPZA" description="Start with 6 lives" />
  <gamegenie code="AEKNLPZE" description="Start with 9 lives" />
  <gamegenie code="AXKNYOGA" description="Start with energy boost" />
  <gamegenie code="YASVAYIA" description="Start with extra time" />
  <gamegenie code="GASVAYIA" description="Start with less time" />
</game>
<game code="CLV-H-VUGKO" name="Attack of the Killer Tomatoes" crc="7C6F615F">
  <gamegenie code="SXYYTO" description="Infinite health" />
  <gamegenie code="SKYYGK" description="Infinite lives" />
  <gamegenie code="AVTYTP" description="Invincibility" />
</game>
<game code="CLV-H-OGDAQ" name="Baby Boomer" crc="BBE40DC4">
  <gamegenie code="SGKTZXVK" description="Infinite lives" />
</game>
<game code="CLV-H-BSUPT" name="Back to the Future" crc="A55FA397">
  <gamegenie code="AENEXZIA" description="Invincibility - Street stages (1 of 3)" />
  <gamegenie code="AONENZYL" description="Invincibility - Street stages (2 of 3)" />
  <gamegenie code="APUEKLEY" description="Invincibility - Street stages (3 of 3)" />
  <gamegenie code="SZKEGOVK" description="Never lose a life in Hill Valley game" />
  <gamegenie code="SXOELOVK" description="Never lose a life in Cafe game" />
  <gamegenie code="SXKALOVK" description="Never lose a life in School game" />
  <gamegenie code="SXVELOVK" description="Never lose a life in Dancing Hall game" />
  <gamegenie code="AVVOUZSZ" description="Disable all timers" />
  <gamegenie code="PEXEGAGA" description="Start with 1 life" />
  <gamegenie code="AEXEGAGE" description="Start with 8 lives" />
</game>
<game code="CLV-H-DJUKH" name="Back to the Future II &amp; III" crc="37BA3261">
  <gamegenie code="ZAXKZZPA" description="Start with 20 lives" />
  <gamegenie code="LAXKZZPA" description="Start with 30 lives" />
  <gamegenie code="SXXELOVK" description="Infinite lives" />
  <gamegenie code="ZAXKYZPA" description="Start with 20 nuclear fuel units" />
  <gamegenie code="LAXKYZPA" description="Start with 30 nuclear fuel units" />
  <gamegenie code="PEKASEPO" description="Quicker shots" />
  <gamegenie code="GZKAKGSA" description="Keep shots" />
  <gamegenie code="GZEEPZST" description="Infinite fuel (1 of 2)" />
  <gamegenie code="GZOEZZST" description="Infinite fuel (2 of 2)" />
</game>
<game code="CLV-H-BNWMP" name="Bad Dudes" crc="161D717B">
  <gamegenie code="APEETPEY" description="Infinite health" />
  <gamegenie code="SZOEAOSE" description="Infinite health (alt)" />
  <gamegenie code="SZNKASVK" description="Infinite lives" />
  <gamegenie code="GXOKASVK" description="Infinite continues" />
  <gamegenie code="SGVYOUVK" description="Infinite time" />
  <gamegenie code="AAUPIOGI" description="Hit anywhere" />
  <gamegenie code="AIEAZPAP" description="Invincibility (1 of 3)" />
  <gamegenie code="AVSOYOSZ" description="Invincibility (2 of 3)" />
  <gamegenie code="ELEAPOZE" description="Invincibility (3 of 3)" />
  <gamegenie code="AOUSNGEY" description="One hit kills" />
  <gamegenie code="PENXYZLA" description="Start with 1 life and 1 continue" />
  <gamegenie code="TENXYZLA" description="Start with double lives and continues" />
  <gamegenie code="PENXYZLE" description="Start with triple lives and continues" />
  <gamegenie code="PESAIYIE" description="Gain double usual energy from drinks" />
</game>
<game code="CLV-H-ANXDX" name="Bad News Baseball" crc="40DAFCBA">
  <gamegenie code="XTOPAKEV" description="Balls are considered strikes" />
  <gamegenie code="PAEGAPEP" description="Play as girls team (2 of 2)" />
  <gamegenie code="PYEGZPLP" description="Play as girls team (1 of 2)" />
</game>
<game code="CLV-H-RRKVO" name="Bad Street Brawler" crc="1AE7B933">
  <gamegenie code="SUNGXOSO" description="Infinite health" />
  <gamegenie code="SIXILYVI" description="Infinite time" />
  <gamegenie code="SZOITNVK" description="Don't die at time out" />
  <gamegenie code="OZOIYPVK" description="Infinite lives" />
  <gamegenie code="SGESGZVG" description="Infinite lives (alt)" />
  <gamegenie code="PAXITALA" description="Start with 1 life" />
  <gamegenie code="TAXITALA" description="Start with 6 lives" />
  <gamegenie code="PAXITALE" description="Start with 9 lives" />
  <gamegenie code="GEUZZYAA" description="Start on level 5" />
  <gamegenie code="PEUZZYAE" description="Start on level 10" />
  <gamegenie code="TEUZZYAE" description="Start on level 15" />
</game>
<game code="CLV-H-BVOIF" name="Barbie" crc="18B249E5">
  <gamegenie code="ESUSAIEY" description="Invincibility (blinks)" />
  <gamegenie code="SXKSKNVK" description="Infinite Z's" />
  <gamegenie code="SZVAAVVK" description="Can re-enter Barbie's dream an infinite number of times" />
  <gamegenie code="AEEEYAZA" description="Cannot re-enter Barbie's dream" />
  <gamegenie code="PEEZEZIE" description="Start with 9 Z's - 1st credit only" />
  <gamegenie code="PEEZEZIA" description="Start with 1 Z - 1st credit only" />
</game>
<game code="CLV-H-YZHDF" name="Baseball" crc="AFDCBD24">
  <gamegenie code="OZSIZYSX" description="Balls are considered strikes" />
</game>
<game code="CLV-H-NTDZI" name="Baseball Simulator 1.000" crc="1F6EA423">
  <gamegenie code="PESEPTLA" description="1 strike and you're out" />
  <gamegenie code="ZESEPTLA" description="2 strikes and you're out" />
  <gamegenie code="IESEPTLA" description="5 strikes and you're out" />
  <gamegenie code="SZVAYTVT" description="Strikes aren't counted" />
  <gamegenie code="SZNAATVT" description="Balls aren't counted" />
  <gamegenie code="PESALTGA" description="1 ball and you walk" />
  <gamegenie code="ZESALTGA" description="2 balls and you walk" />
  <gamegenie code="LESALTGA" description="3 balls and you walk" />
  <gamegenie code="PESALTGE" description="9 balls and you walk" />
  <gamegenie code="OXVZITVV" description="Strike outs aren't allowed" />
</game>
<game code="CLV-H-KLEKX" name="Baseball Stars" crc="40D159B6">
  <gamegenie code="AEVSPGLA" description="Balls are considered strikes" />
</game>
<game code="CLV-H-JGARE" name="Baseball Stars II" crc="18A9F0D9">
  <gamegenie code="OXKILGEN" description="Balls are considered strikes" />
  <gamegenie code="SZSSZSVV" description="Strikes do not count" />
  <gamegenie code="SXSITKVV" description="Balls do not count" />
  <gamegenie code="PAVIPILA" description="One strike for an out" />
  <gamegenie code="ZAVIPILA" description="Two strikes for an out" />
  <gamegenie code="GAVIPILA" description="Four strikes for an out" />
  <gamegenie code="IAVIPILA" description="Five strikes for an out (only 3 show on screen)" />
  <gamegenie code="PESSIGGA" description="One ball for a walk" />
  <gamegenie code="ZESSIGGA" description="Two balls for a walk" />
  <gamegenie code="LESSIGGA" description="Three balls for a walk" />
  <gamegenie code="IESSIGGA" description="Five balls for a walk (only 3 show on screen)" />
  <gamegenie code="TESSIGGA" description="Six balls for a walk (only 3 show on screen)" />
  <gamegenie code="PANILTLA" description="One out per side instead of 3 - against human players" />
  <gamegenie code="ZANILTLA" description="Two outs per side - against human players" />
  <gamegenie code="GANILTLA" description="Four outs per side - against human players" />
  <gamegenie code="PAOAILLA" description="One out per side instead of 3 - against computer" />
  <gamegenie code="ZAOAILLA" description="Two outs per side - against computer" />
  <gamegenie code="GAOAILLA" description="Four outs per side - against computer" />
  <gamegenie code="PEXPVGLZ" description="Game ends after 1 inning" />
  <gamegenie code="LEXPVGLZ" description="Game ends after 2 innings" />
  <gamegenie code="TEXPVGLZ" description="Game ends after 3 innings" />
  <gamegenie code="AEXPVGLX" description="Game ends after 4 innings" />
  <gamegenie code="ZEXPVGLX" description="Game ends after 5 innings" />
  <gamegenie code="GEXPVGLX" description="Game ends after 6 innings" />
  <gamegenie code="TEXPVGLX" description="Game ends after 7 innings" />
  <gamegenie code="AOXPVGLZ" description="Game ends after 8 innings" />
</game>
<game code="CLV-H-SQJMQ" name="Bases Loaded 3, Ryne Sandberg Plays" crc="3ECA3DDA">
  <gamegenie code="NYVPOETE" description="Balls are counted as strikes (1 of 2)" />
  <gamegenie code="TAVPUEON" description="Balls are counted as strikes (2 of 2)" />
  <gamegenie code="SXOPSEVV" description="Some strikes aren't counted" />
  <gamegenie code="AEOPXAZA" description="1 strike and you're out" />
  <gamegenie code="PEOPXAZA" description="2 strikes and you're out" />
  <gamegenie code="SXKOXEVV" description="Balls aren't counted" />
  <gamegenie code="SXOAIUVV" description="Strike outs aren't counted" />
  <gamegenie code="PEOEGLLA" description="Each strike out counts as 3 outs" />
  <gamegenie code="ZEOEGLLA" description="Each strike out counts as 2 outs" />
  <gamegenie code="IEOEGLLA" description="5 strike outs allowed" />
  <gamegenie code="PEOEGLLA" description="9 strike outs allowed" />
  <gamegenie code="SZSYGNVV" description="Computer can't score (1 of 2)" />
  <gamegenie code="SZSNTNVN" description="Computer can't score (2 of 2)" />
</game>
<game code="CLV-H-HWVXF" name="Bases Loaded 4" crc="28F9B41F">
  <gamegenie code="SZNXGUVV" description="Balls do not count" />
  <gamegenie code="SXOXYUVV" description="Strikes do not count" />
  <gamegenie code="PEOXGLZA" description="2 strikes and you're out" />
  <gamegenie code="LEOXGLZA" description="4 strikes and you're out" />
  <gamegenie code="AANZGLLA" description="1 ball and you walk" />
  <gamegenie code="PANZGLLA" description="2 balls and you walk" />
  <gamegenie code="ZANZGLLA" description="3 balls and you walk" />
  <gamegenie code="PANPUTAA" description="Some batters start with count of 1 and 1 - 2P mode (1 of 2)" />
  <gamegenie code="PEOETGAA" description="Some batters start with count of 1 and 1 - 2P mode (2 of 2)" />
  <gamegenie code="ZEOETGAA" description="Some batters start with count of 2 and 2 - 2P mode (1 of 2)" />
  <gamegenie code="ZANPUTAA" description="Some batters start with count of 2 and 2 - 2P mode (2 of 2)" />
</game>
<game code="CLV-H-RCFAI" name="Bases Loaded II: Second Season" crc="B9CF171F">
  <gamegenie code="SXKKIVGK" description="Balls are considered strikes" />
  <gamegenie code="PEOGOALA" description="1 strike and you're out - most of the time" />
  <gamegenie code="ZEOGOALA" description="2 strikes and you're out - most of the time" />
  <gamegenie code="SZOEVXVV" description="Outs aren't counted" />
  <gamegenie code="PAOEUZZA" description="Only 2 outs allowed" />
  <gamegenie code="AAOEUZZA" description="Only 1 out allowed" />
  <gamegenie code="SXNAXOVV" description="Strikes aren't counted (1 of 2)" />
  <gamegenie code="SXSGUKVV" description="Strikes aren't counted (2 of 2)" />
  <gamegenie code="SZEEXXVV" description="Balls aren't counted (1 of 2)" />
  <gamegenie code="SZEESXVV" description="Balls aren't counted (2 of 2)" />
</game>
<game code="CLV-H-VBBGK" name="Batman: Return of the Joker" crc="03EC46AF">
  <gamegenie code="SXOLZOSE" description="Invincibility (1 of 3)" />
  <gamegenie code="SZSZKXSE" description="Invincibility (2 of 3)" />
  <gamegenie code="SZXZONSE" description="Invincibility (3 of 3)" />
  <gamegenie code="SZEGLVSE" description="Infinite health" />
  <gamegenie code="SKSKGKVK" description="Infinite weapons" />
  <gamegenie code="SZVUIASE" description="Invincible to bosses" />
  <gamegenie code="SZXZONSE" description="Protection from enemy bullets" />
  <gamegenie code="SZSZKXSE" description="Protection from collisions" />
  <gamegenie code="SXSATXSE" description="Protection from electric grids" />
  <gamegenie code="AEUAOLZE" description="Jump higher" />
  <gamegenie code="AOUAOLZA" description="Jump very high" />
  <gamegenie code="AEXILGZA" description="Start with 1 life" />
  <gamegenie code="GVXILGZA" description="Start with 100 lives" />
  <gamegenie code="GAVXVLZA" description="Each Backpack Energy Capsule counts as two" />
  <gamegenie code="AAVXVLZE" description="Each Backpack Energy Capsule counts as four" />
  <gamegenie code="AAKOPIZA" description="Invincibility lasts until the end of stage" />
  <gamegenie code="GEOSPKVN" description="Start with 7 Backpack Energy Capsules instead of none" />
  <gamegenie code="GEOSTKTA" description="Start with 3 life increments instead of 8" />
  <gamegenie code="GASOTOTA" description="Continue game with 3 life increments instead of 8" />
  <gamegenie code="SZXSZSVK" description="Infinite lives" />
  <gamegenie code="GXEUIOSE" description="Don't get stunned when hit" />
  <gamegenie code="AEUUAPGA" description="Stand your ground (1 of 2)" />
  <gamegenie code="GXKLAOKE" description="Stand your ground (2 of 2)" />
  <gamegenie code="VNULTONN" description="Intense knock-back when hit (may get stuck if you knock back into a wall) (1 of 2)" />
  <gamegenie code="PEUUGPAA" description="Intense knock-back when hit (may get stuck if you knock back into a wall) (2 of 2)" />
</game>
<game code="CLV-H-AVGKE" name="Batman" crc="13C6617E">
  <gamegenie code="PPOPEZVG" description="Infinite health" />
  <gamegenie code="SKGGTT" description="Infinite health (alt)" />
  <gamegenie code="SKGGGT" description="Regenerates health meter (except Joker's gun)" />
  <gamegenie code="SXEPOGSA" description="Infinite weapons" />
  <gamegenie code="SZKPNUGK" description="Hit anywhere + one hit kills" />
  <gamegenie code="SZUGGTVG" description="Infinite lives" />
  <gamegenie code="AEESKGZA" description="Start with 1 life" />
  <gamegenie code="IEESKGZA" description="Start with 6 lives" />
  <gamegenie code="AEESKGZE" description="Start with 9 lives" />
  <gamegenie code="GEEPOTPA" description="Extra health on heart pick-up" />
  <gamegenie code="GZNOUGST" description="Infinite bullets on pick-up" />
  <gamegenie code="GPSPXVZA" description="Double usual bullets on pick-up" />
  <gamegenie code="IASPXVZA" description="Half usual bullets on pick-up" />
  <gamegenie code="SNUPIKKI" description="Multi-jump" />
</game>
<game code="CLV-H-PPEVO" name="Batman Returns" crc="C247A23D">
  <gamegenie code="PAOGVSPX" description="Enable level select" />
  <gamegenie code="SXSKGKVK" description="Infinite Batarangs" />
  <gamegenie code="ESUXIPEP" description="Hit anywhere (excludes driving stages) (1 of 2)" />
  <gamegenie code="ESUZZPEP" description="Hit anywhere (excludes driving stages) (2 of 2)" />
  <gamegenie code="GZOZIZEL" description="One hit kills (excludes driving stages)" />
  <gamegenie code="AAVASZZA" description="Don't lose health from spin attack" />
  <gamegenie code="GZEGLVSE" description="Almost infinite lives and health" />
  <gamegenie code="AUSAPPAP" description="Small hearts give more health" />
  <gamegenie code="YAKZTIZE" description="Power punch" />
  <gamegenie code="YAKXLIIE" description="Power slide attack" />
  <gamegenie code="ZPKXZIIE" description="Power jump kick" />
  <gamegenie code="GESAKIPA" description="Walk faster horizontally (1 of 2)" />
  <gamegenie code="GEVEVIPA" description="Walk faster horizontally (2 of 2)" />
  <gamegenie code="PAXELAIE" description="Start with 9 Batarangs" />
  <gamegenie code="YLOALEAX" description="Start with full health" />
  <gamegenie code="APOALEAZ" description="Start with less health" />
</game>
<game code="CLV-H-UTUMB" name="Battle of Olympus, The" crc="6B53006A">
  <gamegenie code="SXSSNASA" description="Infinite health" />
  <gamegenie code="ENOAPGEI" description="Invincibility" />
  <gamegenie code="APVEIGES" description="Hit anywhere (1 of 2)" />
  <gamegenie code="ATVETKVT" description="Hit anywhere (2 of 2)" />
  <gamegenie code="AEVESSOT" description="Get items from anywhere (press down) (1 of 2)" />
  <gamegenie code="GXVANIEL" description="Get items from anywhere (press down) (2 of 2)" />
  <gamegenie code="AAUGPAAO" description="Start with less stamina" />
  <gamegenie code="AZUGPAAP" description="Start with more stamina" />
  <gamegenie code="AAEGOZZA" description="Start with Sandals of Hermes" />
  <gamegenie code="GZUKGASA" description="Start with XX (1 of 3)" />
  <gamegenie code="GZUKTASA" description="Start with XX (2 of 3)" />
  <gamegenie code="PAUGYAAA" description="Start with Staff of Fennel (3 of 3)" />
  <gamegenie code="ZAUGYAAA" description="Start with Sword (3 of 3)" />
  <gamegenie code="LAUGYAAA" description="Start with Divine Sword (3 of 3)" />
</game>
<game code="CLV-H-PCGFD" name="Battle Tank, Garry Kitchen's" crc="90D68A43">
  <gamegenie code="SKOPAAVT" description="Infinite energy" />
  <gamegenie code="SKUAANSE" description="Infinite fuel" />
  <gamegenie code="SIXTEEVS" description="Infinite weapons (1 of 2)" />
  <gamegenie code="SGKVINVK" description="Infinite weapons (2 of 2)" />
  <gamegenie code="SLXTEEVS" description="Infinite ammo" />
  <gamegenie code="TOVZIAZL" description="Start with half 150mm ammo" />
  <gamegenie code="LVVZIAZL" description="Start with double 150mm ammo" />
  <gamegenie code="ZUVXTAPA" description="Start with more wire guided shells" />
  <gamegenie code="LVVXTAPA" description="Start with max wire guided shells" />
  <gamegenie code="ZUNXAAPA" description="Start with more smoke shells" />
  <gamegenie code="LVNXAAPA" description="Start with max smoke shells" />
  <gamegenie code="LGEZPPVO" description="Start with less 50mm shells" />
  <gamegenie code="NYEZPPVO" description="Start with max 50mm shells" />
  <gamegenie code="GTEZIOEG" description="Start with less 50mm ammo after mission 5" />
  <gamegenie code="NYEZIOEK" description="Start with max 50mm ammo after mission 5" />
  <gamegenie code="SXOPAAVT" description="Take infinite hits (1 of 2)" />
  <gamegenie code="SXSLNPSA" description="Take infinite hits (2 of 2)" />
</game>
<game code="CLV-H-ZPKDS" name="Battleship" crc="50CCC8ED">
  <gamegenie code="PEUAUGIA" description="1 round per level" />
  <gamegenie code="LEUAUGIA" description="3 rounds per level" />
  <gamegenie code="SZUAOSOU" description="Each ship can take only one hit" />
  <gamegenie code="SAXAOISP" description="You only have RIM-66 missiles" />
  <gamegenie code="VASEOGSA" description="Start on level XX (1 of 3)" />
  <gamegenie code="VASASGSA" description="Start on level XX (2 of 3)" />
  <gamegenie code="PASAKGAA" description="Start on level 2 (3 of 3)" />
  <gamegenie code="ZASAKGAA" description="Start on level 3 (3 of 3)" />
  <gamegenie code="LASAKGAA" description="Start on level 4 (3 of 3)" />
  <gamegenie code="GASAKGAA" description="Start on level 5 (3 of 3)" />
  <gamegenie code="IASAKGAA" description="Start on level 6 (3 of 3)" />
  <gamegenie code="TASAKGAA" description="Start on level 7 (3 of 3)" />
  <gamegenie code="YASAKGAA" description="Start on level 8 (3 of 3)" />
</game>
<game code="CLV-H-EEOQF" name="Battletoads &amp; Double Dragon: The Ultimate Team" crc="CEB65B06">
  <gamegenie code="IEEOOALA" description="Start with full lives" />
  <gamegenie code="AEEOOALA" description="Start with 1 life" />
  <gamegenie code="GXXLAAVI" description="Infinite lives (except stage 4)" />
  <gamegenie code="GZSOXPVI" description="Infinite lives on stage 4" />
  <gamegenie code="PEVELZZE" description="Start with 10 continues" />
  <gamegenie code="IYKNIKGX" description="Bonus score gives invincibility (instead of invincibility pod)" />
  <gamegenie code="YPSYPGIE" description="Longer invincibility" />
  <gamegenie code="ILSYPGIA" description="Even longer invincibility" />
  <gamegenie code="AOSEVAZA" description="Double Dragon super punch" />
  <gamegenie code="AOUEUAGA" description="Battletoads super punch" />
  <gamegenie code="AXUIPOYA" description="Stronger enemies" />
</game>
<game code="CLV-H-YIWQJ" name="Battletoads" crc="279710DC">
  <gamegenie code="GXXZZLVI" description="Infinite lives" />
  <gamegenie code="OUAILU" description="One hit kills" />
  <gamegenie code="GXEILUSO" description="Enemies easier to kill" />
  <gamegenie code="EYSAUVEI" description="Mega-jumping" />
  <gamegenie code="AEUZITPA" description="Super fast punching" />
  <gamegenie code="YXUKXNAE" description="Maximum health from flies" />
  <gamegenie code="AENTAIPL" description="Force 2-player mode" />
  <gamegenie code="AENVZILA" description="Start with 0 lives" />
  <gamegenie code="PENVZILA" description="Start with 1 life" />
  <gamegenie code="TENVZILA" description="Start with 6 lives" />
  <gamegenie code="PENVZILE" description="Start with 9 lives" />
  <gamegenie code="ZAXAALAA" description="Start on level 2 - Wookie Hole" />
  <gamegenie code="LAXAALAA" description="Start on level 3 - Turbo Tunnel" />
  <gamegenie code="GAXAALAA" description="Start on level 4 - Arctic Cavern" />
  <gamegenie code="IAXAALAA" description="Start on level 5 - Surf City" />
  <gamegenie code="TAXAALAA" description="Start on level 6 - Karnath's Lair" />
  <gamegenie code="YAXAALAA" description="Start on level 7 - Volkmire's Inferno" />
  <gamegenie code="AAXAALAE" description="Start on level 8 - Intruder Excluder" />
  <gamegenie code="PAXAALAE" description="Start on level 9 - Terra Tubes" />
  <gamegenie code="ZAXAALAE" description="Start on level 10 - Rat Race" />
  <gamegenie code="LAXAALAE" description="Start on level 11 - Clinger Winger" />
  <gamegenie code="GAXAALAE" description="Start on level 12 - The Revolution" />
  <gamegenie code="AOUKXNAA" description="Double health from flies" />
</game>
<game code="CLV-H-YVZCV" name="Bee 52" crc="6C93377C">
  <gamegenie code="AIXTPLEI" description="Hit anywhere - sting attack (1 of 2)" />
  <gamegenie code="APXTZULU" description="Hit anywhere - sting attack (2 of 2)" />
  <gamegenie code="EINTILEY" description="Invincibility" />
  <gamegenie code="SXNTLPSA" description="Invincibility (alt)" />
  <gamegenie code="SXSGOSVK" description="Infinite lives" />
  <gamegenie code="SZXNXTAX" description="Keep pick-ups" />
  <gamegenie code="GZSSTTEI" description="Don't get stunned" />
  <gamegenie code="PAXYKGLA" description="Start with 1 life" />
  <gamegenie code="TAXYKGLA" description="Start with 6 lives" />
  <gamegenie code="PAXYKGLE" description="Start with 9 lives" />
  <gamegenie code="GXNKNTAL" description="Fly quicker (1 of 2)" />
  <gamegenie code="GZOKUYAP" description="Fly quicker (2 of 2)" />
</game>
<game code="CLV-H-KEZXY" name="Beetlejuice" crc="EB84C54C">
  <gamegenie code="EIEISGEY" description="Invincibility" />
  <gamegenie code="SZOSYNSE" description="Invincibility (blinking)" />
  <gamegenie code="AAOITYPA" description="Infinite hits" />
  <gamegenie code="SZOIYKVK" description="Infinite lives" />
  <gamegenie code="PEOAAALA" description="Start with 1 life" />
  <gamegenie code="TEOAAALA" description="Start with 6 lives" />
  <gamegenie code="PEOAAALE" description="Start with 9 lives" />
  <gamegenie code="PEOAIAZA" description="Take fewer hits to die (1 of 2)" />
  <gamegenie code="PENSYLZA" description="Take fewer hits to die (2 of 2)" />
</game>
<game code="CLV-H-OHZUO" name="Best of the Best: Championship Karate" crc="A6A725B8">
  <gamegenie code="AANIGYPA" description="Each round is XX (1 of 3)" />
  <gamegenie code="OZVSYYSE" description="Each round is XX (2 of 3)" />
  <gamegenie code="ZANIANTI" description="Each round is 0:20 (3 of 3)" />
  <gamegenie code="LANIANTI" description="Each round is 0:30 (3 of 3)" />
  <gamegenie code="GANIANTI" description="Each round is 0:40 (3 of 3)" />
  <gamegenie code="IANIANTI" description="Each round is 0:50 (3 of 3)" />
  <gamegenie code="ZANIGYPA" description="Each round is 2:00" />
  <gamegenie code="LANIGYPA" description="Each round is 3:00" />
  <gamegenie code="GANIGYPA" description="Each round is 4:00" />
  <gamegenie code="IANIGYPA" description="Each round is 5:00" />
  <gamegenie code="TANIGYPA" description="Each round is 6:00" />
  <gamegenie code="YANIGYPA" description="Each round is 7:00" />
  <gamegenie code="AANIGYPE" description="Each round is 8:00" />
  <gamegenie code="PANIGYPE" description="Each round is 9:00" />
  <gamegenie code="PAOSUZIA" description="Each match is 1 round instead of 5" />
  <gamegenie code="ZAOSUZIA" description="Each match is 2 rounds" />
  <gamegenie code="LAOSUZIA" description="Each match is 3 rounds" />
  <gamegenie code="GAOSUZIA" description="Each match is 4 rounds" />
  <gamegenie code="TAOSUZIA" description="Each match is 6 rounds" />
  <gamegenie code="SXVSAZVG" description="Infinite time (round never ends)" />
  <gamegenie code="ZLEAZETP" description="Start with 50 resistance points" />
  <gamegenie code="ZLEAPEAZ" description="Start with 50 strength points" />
  <gamegenie code="ZLEALAGP" description="Start with 50 reflex points" />
  <gamegenie code="TGEAZETP" description="Start with 70 resistance points" />
  <gamegenie code="TGEAPEAZ" description="Start with 70 strength points" />
  <gamegenie code="TGEALAGP" description="Start with 70 reflex points" />
  <gamegenie code="AEETOPZA" description="Gain more XX in training (1 of 2)" />
  <gamegenie code="AAEVVAGE" description="Gain more strength and reflex points in training (2 of 2)" />
  <gamegenie code="APEVVAGA" description="Gain more resistance points in training (2 of 2)" />
  <gamegenie code="OXNSGIOU" description="All physical types are XX (1 of 2)" />
  <gamegenie code="TONSIIZE" description="All physical types are 30 (may cause graphic errors) (2 of 2)" />
  <gamegenie code="ZUNSIIZA" description="All physical types are 50 (may cause graphic errors) (2 of 2)" />
</game>
<game code="CLV-H-TOPBA" name="Bible Adventures" crc="680DA78D">
  <gamegenie code="SUVIKXSO" description="Infinite health" />
</game>
<game code="CLV-H-KBNMJ" name="Big Nose the Caveman" crc="BD154C3E">
  <gamegenie code="SXNNEISA" description="Invincibility" />
  <gamegenie code="PEUYITLA" description="Start with 1 life" />
  <gamegenie code="TEUAITLA" description="Start with 6 lives" />
  <gamegenie code="PEUYITLE" description="Start with 9 lives" />
  <gamegenie code="SXOTPAVG" description="Infinite lives" />
  <gamegenie code="SUOTPAVK" description="Infinite lives (alt)" />
  <gamegenie code="ANENAKLL" description="Slower timer" />
  <gamegenie code="AXENAKLL" description="Faster timer" />
  <gamegenie code="AEEYYZPA" description="Never lose bones when buying" />
  <gamegenie code="XXXYITSZ" description="Start on XX (1 of 3)" />
  <gamegenie code="VEKYAVSE" description="Start on XX (2 of 3)" />
  <gamegenie code="AOUGTAE" description="Start on Monster Island (3 of 3)" />
  <gamegenie code="ZOUGTAE" description="Start on Terror Island (3 of 3)" />
  <gamegenie code="EIXVIPEY" description="Always enable instant win level" />
</game>
<game code="CLV-H-UGJGS" name="Bigfoot" crc="C42E648A">
  <gamegenie code="SUKXVUVS" description="Infinite nitros" />
  <gamegenie code="NNKXXLGV" description="Longer nitro boost" />
  <gamegenie code="AXKXXLGT" description="Shorter nitro boost" />
  <gamegenie code="GEKAOKAA" description="Engines are half price" />
  <gamegenie code="PEKAOKAE" description="Engines cost more" />
  <gamegenie code="LEKAXGTA" description="Tires are half price" />
  <gamegenie code="PEKAXGTE" description="Tires cost more" />
  <gamegenie code="ZEKAUGGA" description="Transmission work is half price" />
  <gamegenie code="AEKAUGGE" description="Transmission work is double price" />
  <gamegenie code="PEKAKGZA" description="Suspension is half price" />
  <gamegenie code="TEKAKGZA" description="Suspension is triple price" />
  <gamegenie code="VTVUYOVN" description="P1 gets P2's nitros (1 of 2)" />
  <gamegenie code="SZVUAOSE" description="P1 gets P2's nitros (2 of 2)" />
</game>
<game code="CLV-H-KXLTB" name="Bill &amp; Ted's Excellent Video Game Adventure" crc="C4B6ED3C">
  <gamegenie code="SZKUPXVK" description="Infinite skeleton keys" />
  <gamegenie code="SZEKUOSE" description="Infinite coins for locals" />
  <gamegenie code="OUOOUEOO" description="Infinite Good Stuff" />
  <gamegenie code="SXOTTOSE" description="Phone call segments cost only 1 coin" />
  <gamegenie code="OOKKUTIO" description="Ted starts with 99 coins instead of 15" />
  <gamegenie code="OOSVAPIO" description="Bill starts with 99 coins" />
  <gamegenie code="IEKKUTIP" description="Ted starts with 5 coins" />
  <gamegenie code="IESVAPIP" description="Bill starts with 5 coins" />
</game>
<game code="CLV-H-XTZAN" name="Bill Elliott's NASCAR Challenge" crc="847D672D">
  <gamegenie code="EUEKTLEP" description="Accelerate faster" />
  <gamegenie code="SZUETKVK" description="Infinite 'free time' in the pits" />
  <gamegenie code="SXOAZVVK" description="Freeze timer while crew works on car in pits" />
</game>
<game code="CLV-H-YRDCL" name="Bionic Commando" crc="D2574720">
  <gamegenie code="AVSTYNVG" description="Invincibility" />
  <gamegenie code="SZNUIYVG" description="Infinite lives in main game" />
  <gamegenie code="SXUEZPVG" description="Infinite lives in sub-game" />
  <gamegenie code="SXSTYNVK" description="Don't take damage from bullets and collisions" />
  <gamegenie code="VTNZXVVK" description="Don't take damage from spikes" />
  <gamegenie code="SZUOAOVK" description="Don't take damange from bullets and collisions in sub-game" />
  <gamegenie code="ATOVUGAZ" description="Hit anywhere (1 of 5)" />
  <gamegenie code="AVKOPEEP" description="Hit anywhere (2 of 5)" />
  <gamegenie code="AVNVUKAL" description="Hit anywhere (3 of 5)" />
  <gamegenie code="AVXENVSL" description="Hit anywhere (4 of 5)" />
  <gamegenie code="SZKTVUOO" description="Hit anywhere (5 of 5)" />
  <gamegenie code="XYXUUOEN" description="Autofire - main game" />
  <gamegenie code="AAKUOOZA" description="Use with BIO Code 11 for improved autofire with normal gun" />
  <gamegenie code="AAUGSZZA" description="Start with 1 life" />
  <gamegenie code="IAUGSZZA" description="Start with double lives" />
  <gamegenie code="AAUGSZZE" description="Start with triple lives" />
  <gamegenie code="VGKKNXUK" description="Start with 3-way gun" />
  <gamegenie code="LAUKOZAA" description="Start with 3 life energy capsules (1 of 2)" />
  <gamegenie code="XTUKUXVU" description="Start with 3 life energy capsules (2 of 2)" />
</game>
<game code="CLV-H-QPEMJ" name="Blades of Steel" crc="8AB52A24">
  <gamegenie code="AINXIYEI" description="Invincibility in mini-game" />
  <gamegenie code="GEUGTTYA" description="Faster timer" />
  <gamegenie code="GOUGTTYA" description="Slower timer" />
  <gamegenie code="PAXZLGIA" description="Players can take only one punch" />
  <gamegenie code="AAOSSAAZ" description="Player with puck doesn't slow down" />
  <gamegenie code="YASGITLA" description="Start a new game to view the ending" />
</game>
<game code="CLV-H-YZRVU" name="Blaster Master" crc="3F0FD764">
  <gamegenie code="XVLAKO" description="Infinite car health" />
  <gamegenie code="NNKKGZAE" description="Start with all abilities" />
  <gamegenie code="LTEKPLAA" description="Start with 99 of each weapon" />
  <gamegenie code="NYEKPLAE" description="Start with 99 of each weapon and max Hover" />
  <gamegenie code="YAASLY" description="Enemies are killed instantly" />
  <gamegenie code="SZUGYIVG" description="Infinite lives" />
  <gamegenie code="AAEGZLZA" description="Start with 1 life" />
  <gamegenie code="IAEGZLZA" description="Start with 6 lives" />
  <gamegenie code="AAEGZLZE" description="Start with 9 lives" />
  <gamegenie code="SZXOALVG" description="Infinite Hover" />
  <gamegenie code="GZSOEEVK" description="Infinite Homing Missiles" />
  <gamegenie code="GXKPEOVK" description="Infinite Thunderbreaks" />
  <gamegenie code="GXSOVXVK" description="Infinite Multi-Warheads" />
  <gamegenie code="IAEKPLAA" description="Start with 5 of each weapon" />
  <gamegenie code="ZAEKPLAE" description="Start with 10 of each weapon" />
  <gamegenie code="YAEKPLAE" description="Start with 15 of each weapon" />
  <gamegenie code="PENKTXAE" description="Start on world 2" />
  <gamegenie code="ZENKTXAE" description="Start on world 3" />
  <gamegenie code="LENKTXAE" description="Start on world 4" />
  <gamegenie code="GENKTXAE" description="Start on world 5" />
  <gamegenie code="IENKTXAE" description="Start on world 6" />
  <gamegenie code="TENKTXAE" description="Start on world 7" />
  <gamegenie code="YENKTXAE" description="Start on world 8" />
  <gamegenie code="OXNKIXPE" description="Start at the boss of world X (1 of 2)" />
  <gamegenie code="AENKTXAA" description="Start at the boss of world 1 (2 of 2)" />
  <gamegenie code="PENKTXAA" description="Start at the boss of world 2 (2 of 2)" />
  <gamegenie code="ZENKTXAA" description="Start at the boss of world 3 (2 of 2)" />
  <gamegenie code="LENKTXAA" description="Start at the boss of world 4 (2 of 2)" />
  <gamegenie code="GENKTXAA" description="Start at the boss of world 5 (2 of 2)" />
  <gamegenie code="IENKTXAA" description="Start at the boss of world 6 (2 of 2)" />
  <gamegenie code="TENKTXAA" description="Start at the boss of world 7 (2 of 2)" />
  <gamegenie code="YENKTXAA" description="Start at the boss of world 8 (2 of 2)" />
  <gamegenie code="ZGUKZITP" description="Die to see ending" />
</game>
<game code="CLV-H-ZSLTV" name="Blue Marlin, The" crc="F37BEFD5">
  <gamegenie code="GENTUIZA" description="Line is a 1000 yards long" />
  <gamegenie code="AESVOXEG" description="Catch fish right after they bite - most of the time" />
  <gamegenie code="PESVOXEK" description="When fish bite they are close to the boat" />
  <gamegenie code="OOSVOXEK" description="Line is set to 153 feet" />
  <gamegenie code="PESVXIAA" description="Pull fish in quicker" />
  <gamegenie code="OZSVKKPV" description="Vitality always at max (1 of 2)" />
  <gamegenie code="YASVSGPE" description="Vitality always at max (2 of 2)" />
</game>
<game code="CLV-H-KTZRY" name="Blues Brothers, The" crc="9F2EEF20">
  <gamegenie code="SUOVAEVS" description="Infinite health" />
  <gamegenie code="SUUVYEVS" description="Infinite lives" />
  <gamegenie code="EIXTAGEY" description="Invincibility (1 of 2)" />
  <gamegenie code="EIVTVIEY" description="Invincibility (2 of 2)" />
  <gamegenie code="PESYAPAA" description="Multi-jump" />
</game>
<game code="CLV-H-BTEZZ" name="Bo Jackson Baseball" crc="5FD2AAB1">
  <gamegenie code="AEEGYKAP" description="Balls are considered strikes" />
</game>
<game code="CLV-H-ZUDTD" name="Bomberman" crc="DB9DCF89">
  <gamegenie code="OXVGITSX" description="Immune to explosions" />
  <gamegenie code="SZIGAT" description="Infinite time" />
  <gamegenie code="SXPKAG" description="Infinite lives" />
  <gamegenie code="AAOGTYYL" description="Hit anywhere (1 of 2)" />
  <gamegenie code="AAOKIYAL" description="Hit anywhere (2 of 2)" />
  <gamegenie code="AAVKXZZA" description="Remove all breakable blocks" />
  <gamegenie code="AEZKLL" description="Start with 1 life" />
  <gamegenie code="PEZKLU" description="Start with 10 lives" />
  <gamegenie code="VPGKGG" description="Decrease time" />
  <gamegenie code="VYGKGK" description="Increase timer" />
  <gamegenie code="ZELGYU" description="Start on stage 10" />
  <gamegenie code="GOLGYL" description="Start on stage 20" />
  <gamegenie code="TOLGYU" description="Start on stage 30" />
  <gamegenie code="AXLGYU" description="Start on stage 40" />
  <gamegenie code="ZULGYL" description="Start on stage 50" />
  <gamegenie code="AXKKALAP" description="Start with double power Bomb blasts" />
  <gamegenie code="AUKKALAP" description="Start with triple power Bomb blasts" />
  <gamegenie code="EEKKALAP" description="Start with maximum power Bomb blasts" />
  <gamegenie code="NYXKUIEX" description="Increase Bomb detonation time" />
  <gamegenie code="AYXKUIEZ" description="Reduce Bomb detonation time" />
  <gamegenie code="GXEKLGSA" description="Never lose Detonator after pick-up" />
  <gamegenie code="AESKGUIZ" description="Start with Detonator, max Bomb power and use up to 10 Bombs" />
  <gamegenie code="XZEGNIVZ" description="Use up to 10 Bombs (1 of 2)" />
  <gamegenie code="PAEKEIGN" description="Use up to 10 Bombs (2 of 2)" />
  <gamegenie code="OXEKVPSX" description="Start with and keep Detonator (1 of 2)" />
  <gamegenie code="AESKNKTA" description="Start with and keep Detonator (2 of 2)" />
  <gamegenie code="OZNKNNPK" description="Walk through walls (1 of 2)" />
  <gamegenie code="AEEGEYPA" description="Walk through walls (2 of 2)" />
</game>
<game code="CLV-H-UQUEX" name="Bomberman II" crc="1EBB5B42">
  <gamegenie code="GXKGKXVK" description="Infinite lives" />
  <gamegenie code="GXXONEVK" description="Infinite time" />
  <gamegenie code="SZXATLOU" description="Hit anywhere (all enemies killed with one bomb) (3 of 4)" />
  <gamegenie code="LPXAYUYX" description="Hit anywhere (all enemies killed with one bomb) (1 of 4)" />
  <gamegenie code="PTXEAUPZ" description="Hit anywhere (all enemies killed with one bomb) (2 of 4)" />
  <gamegenie code="XTXEPLEE" description="Hit anywhere (all enemies killed with one bomb) (4 of 4)" />
  <gamegenie code="AAKLVPAZ" description="Remove all breakable blocks (1 of 2)" />
  <gamegenie code="SZKUNPAX" description="Remove all breakable blocks (2 of 2)" />
  <gamegenie code="LVXOUELL" description="Slower timer" />
  <gamegenie code="TOXOUELU" description="Faster timer" />
  <gamegenie code="AEKAZYLA" description="Always have Detonator" />
  <gamegenie code="YNEOLXLK" description="Bomb has a longer fuse" />
  <gamegenie code="AXEOLXLG" description="Bomb has a shorter fuse" />
  <gamegenie code="GXOLSXVS" description="Stop Bombs from exploding" />
  <gamegenie code="EASPTANG" description="Dollar sign acts as flame face" />
  <gamegenie code="GYSPTANG" description="Dollar sign acts as Bomb" />
  <gamegenie code="KASPTANK" description="Dollar sign acts as heart with Bomb" />
  <gamegenie code="OPSPTANG" description="Dollar sign acts as skate" />
  <gamegenie code="OZSPTANK" description="Dollar sign acts as vest for a short time" />
  <gamegenie code="GAXKSTAA" description="Super start (1 of 2)" />
  <gamegenie code="GASKKTAA" description="Super start (2 of 2)" />
  <gamegenie code="OXXAPYSX" description="Immune to explosions (1 of 2)" />
  <gamegenie code="PEXAZNVZ" description="Immune to explosions (2 of 2)" />
  <gamegenie code="OXOEGYSX" description="Walk through walls (1 of 2)" />
  <gamegenie code="PEOEINSZ" description="Walk through walls (2 of 2)" />
  <gamegenie code="AEEGEPZA" description="Start with 1 life" />
  <gamegenie code="IEEGEPZA" description="Start with 6 lives" />
  <gamegenie code="AEEGEPZE" description="Start with 9 lives" />
</game>
<game code="CLV-H-GWVHE" name="Bonk's Adventure" crc="4E44FF44">
  <gamegenie code="SZVZINVK" description="Infinite lives" />
  <gamegenie code="AAXXZILA" description="Hit anywhere (1 of 2)" />
  <gamegenie code="LINXTZYZ" description="Hit anywhere (2 of 2)" />
  <gamegenie code="AEKAAAZA" description="Start with 1 life" />
  <gamegenie code="IEKAAAZA" description="Start with 6 lives" />
  <gamegenie code="AEKAAAZE" description="Start with 9 lives" />
  <gamegenie code="GEUAAEGA" description="Start with less initial energy (but more maximum energy)" />
  <gamegenie code="AOUAAEGE" description="Start with more energy" />
  <gamegenie code="GXEEYEGA" description="Super-jump when normal" />
  <gamegenie code="GXVPIKSE" description="Keep speed up after powered down" />
  <gamegenie code="GASZTYAA" description="Gain energy from picking up smiles" />
  <gamegenie code="YEXELAAA" description="Start on stage 2-1" />
  <gamegenie code="IEXELAAE" description="Start on stage 3-1" />
  <gamegenie code="ZOXELAAA" description="Start on stage 4-1" />
  <gamegenie code="YOXELAAA" description="Start on Stage 5-1" />
  <gamegenie code="PXXELAAA" description="Start on stage 6-1" />
</game>
<game code="CLV-H-ISODZ" name="Boulder Dash" crc="A8F4D99E">
  <gamegenie code="AAEGLTPA" description="Invincibility (1 of 3)" />
  <gamegenie code="AVKKPLSZ" description="Invincibility (2 of 3)" />
  <gamegenie code="IKEKYOYX" description="Invincibility (3 of 3)" />
  <gamegenie code="AEUGVGIZ" description="One Diamond needed to open exit" />
  <gamegenie code="SLEZXTVI" description="Infinite lives" />
  <gamegenie code="SXSGSYAX" description="Infinite time" />
  <gamegenie code="PAKIELLA" description="Start with 1 life" />
  <gamegenie code="TAKIELLA" description="Start with 6 lives" />
  <gamegenie code="PAKIELLE" description="Start with 9 lives" />
  <gamegenie code="PEOXEYLA" description="1 life after continue" />
  <gamegenie code="TEOXEYLA" description="6 lives after continue" />
  <gamegenie code="PEOXEYLE" description="9 lives after continue" />
  <gamegenie code="YOSGXNYU" description="Speed up timer" />
  <gamegenie code="NNSGXNYU" description="Slow down timer" />
</game>
<game code="CLV-H-OWTJL" name="Boy and His Blob, A: Trouble on Blobolonia, David Crane's" crc="4D1AC58C">
  <gamegenie code="AAULNGIA" description="1 life only" />
  <gamegenie code="ZAULNGIE" description="Double lives" />
  <gamegenie code="GXXEOPVG" description="Infinite lives" />
  <gamegenie code="AAVKIPPA" description="Infinite Jellybeans" />
  <gamegenie code="SXEEZAAX" description="Fast play" />
  <gamegenie code="AVOGAEOZ" description="Invincibility (restart if you die underwater and get stuck by being unable to call your Blob)" />
  <gamegenie code="AVOPVGEI" description="Never take damage from enemies" />
  <gamegenie code="APEUUIAA" description="Gives 10 Orange Jellybeans" />
  <gamegenie code="AONUSGAA" description="10 Lime Jellybeans" />
  <gamegenie code="OONLOGZN" description="99 Licorice Jellybeans" />
  <gamegenie code="AUNLUGIP" description="Double Strawberry Jellybeans" />
  <gamegenie code="TUNLNKAP" description="Double Cola Jellybeans" />
  <gamegenie code="AKNUOGGX" description="Double Cinnamon Jellybeans" />
  <gamegenie code="GXNUUGZP" description="Double Apple Jellybeans" />
  <gamegenie code="AVNUNGAL" description="Double Vanilla Jellybeans" />
  <gamegenie code="ZPELNITA" description="Double Ketchup Jellybeans" />
  <gamegenie code="AONLSGTE" description="Triple Coconut Jellybeans" />
  <gamegenie code="APELUITE" description="Triple Rootbeer Jellybeans" />
  <gamegenie code="APEUSIAA" description="10 Vitamin A for Vita-Blaster" />
  <gamegenie code="APEUNIAA" description="10 Vitamin B for Vita-Blaster" />
  <gamegenie code="APOLOIAA" description="10 Vitamin C for Vita-Blaster" />
  <gamegenie code="SZXLXKSU" description="Start with 101 of all starting Jellybeans (1 of 2)" />
  <gamegenie code="YYXLUGEY" description="Start with 101 of all starting Jellybeans (2 of 2)" />
</game>
<game code="CLV-H-VFUUQ" name="Bram Stoker's Dracula" crc="DFA111F1">
  <gamegenie code="NUNTZUKU" description="Infinite lives" />
  <gamegenie code="SXNTPUVK" description="Infinite lives (alt)" />
  <gamegenie code="ASVIAPEI" description="Invincibility" />
  <gamegenie code="SZKLVZAX" description="Invincibility after getting hit" />
  <gamegenie code="SUXLISVS" description="Infinite energy (except falling off cliffs)" />
  <gamegenie code="SXXLISVS" description="Infinite health" />
  <gamegenie code="AEVGPPPA" description="Infinite time" />
  <gamegenie code="SXNKGOSE" description="Infinite time (alt) (1 of 2)" />
  <gamegenie code="SXNGYOSE" description="Infinite time (alt) (2 of 2)" />
  <gamegenie code="SZNVVSVK" description="Infinite ammo" />
  <gamegenie code="ZEVGPPPA" description="Faster timer" />
  <gamegenie code="UUETEIZE" description="Infinite weapons (except scene 1 daytime)" />
  <gamegenie code="AANGYZIA" description="Always have 63 ammo" />
  <gamegenie code="NNSNGPZE" description="Disable axe" />
</game>
<game code="CLV-H-WPRRM" name="Break Time: The National Pool Tour" crc="5F0BCE2A">
  <gamegenie code="VAVEILSA" description="Start in XX (1 of 2)" />
  <gamegenie code="PAVEGLAA" description="Start in Milwaukee (2 of 2)" />
  <gamegenie code="ZAVEGLAA" description="Start in Atlanta (2 of 2)" />
  <gamegenie code="LAVEGLAA" description="Start in Los Angeles (2 of 2)" />
  <gamegenie code="GAVEGLAA" description="Start in Las Vegas (2 of 2)" />
</game>
<game code="CLV-H-FQMDC" name="BreakThru" crc="A5E8D2CD">
  <gamegenie code="GZUKYPVG" description="Infinite lives - both players" />
  <gamegenie code="GZKSLZVG" description="Infinite weapon time" />
  <gamegenie code="LTUKTLAA" description="Start each life with 3-way firing and 99 seconds" />
  <gamegenie code="PEUKPZLA" description="Start with 1 life - P1" />
  <gamegenie code="PEKGGZLA" description="Start with 1 life - P2" />
  <gamegenie code="TEUKPZLA" description="Start with 6 lives - P1" />
  <gamegenie code="TEKGGZLA" description="Start with 6 lives - P2" />
  <gamegenie code="PEUKPZLE" description="Start with 9 lives - P1" />
  <gamegenie code="PEKGGZLE" description="Start with 9 lives - P2" />
  <gamegenie code="ZANKLZPA" description="Start on level 2" />
  <gamegenie code="LANKLZPA" description="Start on level 3" />
  <gamegenie code="GANKLZPA" description="Start on level 4" />
  <gamegenie code="IANKLZPA" description="Start on level 5" />
</game>
<game code="CLV-H-PGBNK" name="Bubble Bath Babes" crc="68AFEF5F">
  <gamegenie code="AAKAIAPE" description="View slideshow (1 of 4)" />
  <gamegenie code="VTXEXPSA" description="View slideshow (2 of 4)" />
  <gamegenie code="EAXEUPGV" description="View slideshow (3 of 4)" />
  <gamegenie code="GAUASOLE" description="View slideshow (4 of 4)" />
  <gamegenie code="SZEOLLVG" description="Infinite credits" />
</game>
<game code="CLV-H-OCUZV" name="Bucky O'Hare" crc="E19EE99C">
  <gamegenie code="AEUEOYEL" description="Multi-jump (1 of 2)" />
  <gamegenie code="AEXAUYAP" description="Multi-jump (2 of 2)" />
  <gamegenie code="GXOEZTEL" description="Hit anywhere (1 of 4)" />
  <gamegenie code="GZNEYTEL" description="Hit anywhere (2 of 4)" />
  <gamegenie code="OXEAGVPV" description="Hit anywhere (3 of 4)" />
  <gamegenie code="OXOEYVPV" description="Hit anywhere (4 of 4)" />
  <gamegenie code="SLKSVUSO" description="One hit kills" />
  <gamegenie code="ENKEVGAP" description="All characters always selectable" />
  <gamegenie code="AESGILPE" description="Press Start to complete the level (1 of 4)" />
  <gamegenie code="AESKALPA" description="Press Start to complete the level (2 of 4)" />
  <gamegenie code="GOSGYUPE" description="Press Start to complete the level (3 of 4)" />
  <gamegenie code="OXSGGUPK" description="Press Start to complete the level (4 of 4)" />
  <gamegenie code="PEUKEIZE" description="Start a new game to view ending" />
  <gamegenie code="AAELXYZA" description="Start with 1 life" />
  <gamegenie code="IAELXYZA" description="Start with 6 lives" />
  <gamegenie code="PAELXYZE" description="Start with 10 lives" />
  <gamegenie code="AEXGVYZA" description="1 life after continue" />
  <gamegenie code="IEXGVYZA" description="6 lives after continue" />
  <gamegenie code="PEXGVYZE" description="10 lives after continue" />
  <gamegenie code="SZVKOTVG" description="Infinite lives" />
  <gamegenie code="TAOLKYGP" description="Start with 1/2 health" />
  <gamegenie code="EPELVNKE" description="Double Bucky's special health" />
  <gamegenie code="KZELVNKA" description="Triple Bucky's special health" />
  <gamegenie code="KAEUXNGE" description="All characters start with normal special health" />
  <gamegenie code="EPEUXNGE" description="All characters start with 2x special health" />
  <gamegenie code="KZEUXNGA" description="All characters start with 3x special health" />
</game>
<game code="CLV-H-YDJZI" name="Bugs Bunny Birthday Blowout, The" crc="126EBF66">
  <gamegenie code="ATYZPL" description="Invincibility" />
  <gamegenie code="SXEZGUSE" description="Infinite health" />
  <gamegenie code="SZVIGKVK" description="Infinite lives" />
  <gamegenie code="LAOANZTE" description="Mega-jumping Bugs" />
  <gamegenie code="AEOXPZGE" description="Two hearts of energy gained on pick-up" />
  <gamegenie code="PEOXPZGA" description="Less energy gained on pick-up" />
  <gamegenie code="ATNZALAL" description="Stunned for longer" />
  <gamegenie code="IPNZALAL" description="Stunned for less time" />
  <gamegenie code="AASAKOTL" description="Use hammer when stunned" />
</game>
<game code="CLV-H-ATGJY" name="Bugs Bunny Crazy Castle, The" crc="E50A9130">
  <gamegenie code="SZOKGPVG" description="Start with infinite lives" />
  <gamegenie code="PAUGPAIA" description="Start with 1 life" />
  <gamegenie code="ZAUGPAIE" description="Start with 10 lives" />
  <gamegenie code="GXETZZEI" description="Invincibility" />
  <gamegenie code="GXKGZZEY" description="Baddies go as fast as Bugs Bunny" />
  <gamegenie code="GASGAAPA" description="Make platforms invisible" />
  <gamegenie code="PXXTGGEN" description="Start with super rabbit punches (1 of 2)" />
  <gamegenie code="PXXTAGAO" description="Start with super rabbit punches (2 of 2)" />
  <gamegenie code="SZOKGAAX" description="Start on level XX (1 of 2)" />
  <gamegenie code="PEXYVYAE" description="Start on level 10 (2 of 2)" />
  <gamegenie code="LOXYVYAA" description="Start on level 20 (2 of 2)" />
  <gamegenie code="IOXYVYAE" description="Start on level 30 (2 of 2)" />
  <gamegenie code="YXXYVYAA" description="Start on level 40 (2 of 2)" />
</game>
<game code="CLV-H-GWXDW" name="Bump 'n' Jump" crc="A0A095C4">
  <gamegenie code="AAVPNLGP" description="Jump OK, even with no power" />
  <gamegenie code="ZAUZAIPA" description="Gain double power on every pick-up" />
  <gamegenie code="AGVONLAA" description="Jump OK at any speed" />
  <gamegenie code="PANPNLIE" description="Set jump OK speed to 190" />
  <gamegenie code="LANPNLIA" description="Set jump OK speed to 130" />
  <gamegenie code="GEOAGGAA" description="Start on scene 5" />
  <gamegenie code="PEOAGGAE" description="Start on scene 10" />
  <gamegenie code="TEOAGGAE" description="Start on scene 15" />
</game>
<game code="CLV-H-KHSHW" name="Burai Fighter" crc="CE228874">
  <gamegenie code="PEOLATIE" description="Extra lives for Eagle level" />
  <gamegenie code="AEOLPTGE" description="Extra lives for Albatross level" />
  <gamegenie code="TEOLZTLA" description="Extra lives for Ace level" />
  <gamegenie code="VNOTENVK" description="Infinite lives" />
  <gamegenie code="LAXTTPPA" description="More power for weapons" />
  <gamegenie code="ZAXTTPPE" description="Maximum power for weapons" />
  <gamegenie code="PASVTPZE" description="Increase cobalt power picked up" />
  <gamegenie code="VTVNIPSA" description="Start with laser" />
  <gamegenie code="VTNYPPSA" description="Start with rotating pod" />
  <gamegenie code="OUVNAXOO" description="Never lose weapon power" />
  <gamegenie code="KXNYLZSA" description="Never lose speed up" />
  <gamegenie code="KXVNYZSA" description="Never lose weapons" />
  <gamegenie code="KXNYPZSA" description="Never lose rotating pod" />
  <gamegenie code="AVVNLXOZ" description="Never lose anything" />
</game>
<game code="CLV-H-HFNDT" name="BurgerTime" crc="DAF9D7E3">
  <gamegenie code="SZSTVAVI" description="Start with infinite lives" />
  <gamegenie code="AASGKLGE" description="Start with 8 lives" />
  <gamegenie code="SLKIZYVI" description="Start with infinite peppers" />
  <gamegenie code="APVGSLIA" description="Start with double peppers" />
  <gamegenie code="GZVIAZEI" description="Anti-gravity shoes" />
  <gamegenie code="YPESOUGO" description="Peter Pepper gets super speed" />
  <gamegenie code="SZKNNIAX" description="Fast play for experts" />
  <gamegenie code="SXVSSXSU" description="Monsters always move slowly" />
  <gamegenie code="SXVSSXSU" description="Monsters move at XX speed (1 of 2)" />
  <gamegenie code="GOVSVXAO" description="Monsters move at double speed (2 of 2)" />
  <gamegenie code="YOVSVXAO" description="Monsters move at quadruple speed (2 of 2)" />
</game>
<game code="CLV-H-XXNIX" name="Cabal" crc="BDF046EF">
  <gamegenie code="ENNOLGEI" description="Invincibility" />
  <gamegenie code="GXEOZZVI" description="Infinite lives" />
  <gamegenie code="SSEOZZVI" description="Infinite lives (alt)" />
  <gamegenie code="UNUOTTNN" description="Start with 9 lives - both players" />
  <gamegenie code="UNUOTTNY" description="Start with 1 life - both players" />
  <gamegenie code="KYVEOZUY" description="Start with 20 Grenades" />
  <gamegenie code="NYVEOZUY" description="Start with 50 Grenades" />
  <gamegenie code="AEUXSIPA" description="Infinite Grenades" />
  <gamegenie code="GAVXNGGE" description="12 Grenades on pick-up" />
  <gamegenie code="ZAVXNGGA" description="2 Grenades on pick-up" />
  <gamegenie code="AKOPLZEG" description="Shorter immunity" />
  <gamegenie code="NNOPLLEK" description="Longer immunity" />
</game>
<game code="CLV-H-PNNHQ" name="Captain America and the Avengers" crc="58C7DDAF">
  <gamegenie code="OLNUNEOO" description="Infinite life - Captain America and Hawkeye, 1P mode" />
  <gamegenie code="SZSULYVG" description="Infinite continues" />
  <gamegenie code="GPNXIUZA" description="Large power stones worth 20 points" />
  <gamegenie code="TPNXIUZE" description="Large power stones worth 30 points" />
  <gamegenie code="ZLNXIUZA" description="Large power stones worth 50 points" />
  <gamegenie code="ZAUZILPE" description="Small power stones worth 10 points" />
  <gamegenie code="LSUPUELO" description="Hawkeye shoots arrows faster" />
  <gamegenie code="VYNXTXNN" description="Faster Captain America and Hawkeye - one direction only (1 of 2)" />
  <gamegenie code="ZEEZAZPA" description="Faster Captain America and Hawkeye - one direction only (2 of 2)" />
  <gamegenie code="SYNXTXNN" description="Even faster Captain America and Hawkeye - one direction only (1 of 2)" />
  <gamegenie code="LEEZAZPA" description="Even faster Captain America and Hawkeye - one direction only (2of 2)" />
</game>
<game code="CLV-H-XWYOY" name="Captain Planet and the Planeteers" crc="0B404915">
  <gamegenie code="SZNKNUSE" description="Invincibility" />
  <gamegenie code="SKNLYVVK" description="Infinite lives (alt)" />
  <gamegenie code="SXNLYVVK" description="Infinite lives - outside levels" />
  <gamegenie code="SZSUGVVK" description="Infinite lives - inside levels" />
  <gamegenie code="PAETITGE" description="Start with 10 lives - inside levels" />
  <gamegenie code="PAETITGA" description="Start with 2 lives - inside levels" />
  <gamegenie code="SZNXGXVK" description="Infinite power - outside levels (1 of 2)" />
  <gamegenie code="SZVXPKVK" description="Infinite power - outside levels (2 of 2)" />
  <gamegenie code="SXXXEUVK" description="Infinite power - inside levels (1 of 2)" />
  <gamegenie code="SZEUGKVK" description="Infinite power - inside levels (2 of 2)" />
  <gamegenie code="AANVAEGZ" description="Start inside level 1 instead of outside" />
  <gamegenie code="PENVIGGA" description="Start with 2 lives instead of 5 - outside levels" />
  <gamegenie code="PENVIGGE" description="Start with 10 lives - outside levels" />
</game>
<game code="CLV-H-DBTQP" name="Captain SkyHawk" crc="EFD26E37">
  <gamegenie code="OZKAIGVK" description="Infinite lives" />
  <gamegenie code="SGKAIGVG" description="Infinite lives (alt)" />
  <gamegenie code="PEUITIIA" description="Start with 1 life" />
  <gamegenie code="ZEUITIIE" description="Start with 10 lives" />
  <gamegenie code="OZXPUZVK" description="Infinite Maverick missiles" />
  <gamegenie code="OXKPVGVK" description="Infinite Hawk Bombs" />
  <gamegenie code="LESITITA" description="Start with half Hawk Bombs" />
  <gamegenie code="GOSITITA" description="Start with 20 Hawk Bombs" />
  <gamegenie code="AESSZIZE" description="Start with 8 Phoenix and Maverick missiles" />
  <gamegenie code="GENXKGZA" description="Double cost of Hawk Bombs" />
  <gamegenie code="GAXZKIZA" description="Double cost of Phoenix missiles" />
  <gamegenie code="ZAOZEIIE" description="Double cost of Maverick missiles" />
</game>
<game code="CLV-H-QKSHM" name="Casino Kid" crc="05A688C8">
  <gamegenie code="OXKEPTES" description="Always win hand in Blackjack" />
  <gamegenie code="OXOEIIEO" description="Can always bet all money in Blackjack" />
  <gamegenie code="SZOOUKGK" description="Always win hand in Poker" />
  <gamegenie code="VAVAKXAT" description="Can always bet all money in Poker" />
</game>
<game code="CLV-H-ZCUUW" name="Casino Kid II" crc="7329118D">
  <gamegenie code="AZKKYOTG" description="Start new game with $82 instead of $200" />
  <gamegenie code="EGKKYOTK" description="Start new game with $512" />
  <gamegenie code="AZSGGPAA" description="Start new game with $21,171" />
  <gamegenie code="EGSGGPAE" description="Start new game with $131,272" />
  <gamegenie code="AASKPPAE" description="Start new game with $1,342,377" />
  <gamegenie code="AZSKPPAA" description="Start new game with $5,368,909" />
  <gamegenie code="PAOASGIE" description="Can't double down in blackjack (game will say you do not have enough money)" />
  <gamegenie code="PAKAVIIE" description="Can't split in blackjack (game will say you do not have enough money)" />
</game>
<game code="CLV-H-SHQRS" name="Castelian" crc="0AE6C9E2">
  <gamegenie code="SXKTEISA" description="Invincibility" />
  <gamegenie code="SLOKZLVI" description="Infinite lives" />
  <gamegenie code="SIOKZLVI" description="Infinite lives (alt)" />
  <gamegenie code="PEVGYPLA" description="Start with 1 life" />
  <gamegenie code="TEVGYPLA" description="Start with 6 lives" />
  <gamegenie code="PEVGYPLE" description="Start with 9 lives" />
  <gamegenie code="IAOGTZZA" description="Start with 5 continues" />
  <gamegenie code="AAOGTZZE" description="Start with 8 continues" />
  <gamegenie code="SZNXYAVG" description="Infinite time" />
</game>
<game code="CLV-H-IKMEF" name="Castle of Deceit" crc="345D3A1A">
  <gamegenie code="SXNIOUVK" description="Infinite energy" />
  <gamegenie code="SZOSYSVK" description="Infinite lives" />
</game>
<game code="CLV-H-TTHAA" name="Castle of Dragon" crc="2F2D1FA9">
  <gamegenie code="PEVPULAP" description="Stop Skeletons from fighting" />
  <gamegenie code="GEOGYZPA" description="Faster fighting" />
  <gamegenie code="ZPSLONLP" description="Super strong enemies" />
  <gamegenie code="SZVUSNVK" description="No harm from most enemy attacks" />
  <gamegenie code="YNOLSYAE" description="Infinite health" />
  <gamegenie code="NYXKLAGE" description="Super health" />
  <gamegenie code="ZAXGLAAA" description="Start with Knives" />
  <gamegenie code="LAXGLAAA" description="Start with Knives and Mace" />
  <gamegenie code="EAXGLAAA" description="Start with Armor" />
  <gamegenie code="UAXGLAAA" description="Start with Armor, Knives and Mace" />
</game>
<game code="CLV-H-MXFOL" name="Castlequest" crc="12906664">
  <gamegenie code="SXUEXSSE" description="Invincibility" />
  <gamegenie code="SXKAVIVG" description="Infinite lives" />
  <gamegenie code="ATSXATEY" description="Infinite keys" />
  <gamegenie code="LKUZTZZU" description="75 lives instead of 50" />
  <gamegenie code="POUZTZZU" description="25 lives instead of 50" />
  <gamegenie code="SXKNKLVG" description="Don't lose life from 'reset' or 'back' options" />
  <gamegenie code="SZOEIUVK" description="Use sword (press 'B') as long as you like" />
  <gamegenie code="XXOAZGYA" description="Now you can move while using sword" />
  <gamegenie code="IAEEALYP" description="Must use with the last code for permanent sword-wielding ability" />
  <gamegenie code="GAXEGIZA" description="Supercharged speed-up (1 of 2)" />
  <gamegenie code="GAUEGIZA" description="Supercharged speed-up (2 of 2)" />
  <gamegenie code="AAXEGIZE" description="Turbo fuel-injected 16-valve speed-up (1 of 2)" />
  <gamegenie code="AAUEGIZE" description="Turbo fuel-injected 16-valve speed-up (2 of 2)" />
</game>
<game code="CLV-H-OTBWY" name="Castlevania III: Dracula's Curse" crc="ED2465BE">
  <gamegenie code="EIOAZPEY" description="Invincibility (disable if you cannot enter a door)" />
  <gamegenie code="SZKLPZSA" description="Invincibility (disable if you cannot enter a door) (alt)" />
  <gamegenie code="OXEEZZSE" description="Infinite health" />
  <gamegenie code="OXOAUPSE" description="Infinite lives" />
  <gamegenie code="AEELYXAP" description="Hit anywhere (Whip)" />
  <gamegenie code="AVVAELAP" description="Multi-jump (01 of 15)" />
  <gamegenie code="EISOKAIV" description="Multi-jump (02 of 15)" />
  <gamegenie code="EPSPKAEL" description="Multi-jump (03 of 15)" />
  <gamegenie code="IASONATZ" description="Multi-jump (04 of 15)" />
  <gamegenie code="IASOXEGA" description="Multi-jump (05 of 15)" />
  <gamegenie code="IAVPOEAA" description="Multi-jump (06 of 15)" />
  <gamegenie code="OZSOOAES" description="Multi-jump (07 of 15)" />
  <gamegenie code="PSSPINYG" description="Multi-jump (08 of 15)" />
  <gamegenie code="PSVPYUYG" description="Multi-jump (09 of 15)" />
  <gamegenie code="SASOUESX" description="Multi-jump (10 of 15)" />
  <gamegenie code="SASPVESX" description="Multi-jump (11 of 15)" />
  <gamegenie code="SZSPOAGA" description="Multi-jump (12 of 15)" />
  <gamegenie code="SZUPOASA" description="Multi-jump (13 of 15)" />
  <gamegenie code="TZSPXEOG" description="Multi-jump (14 of 15)" />
  <gamegenie code="ZASPUEAE" description="Multi-jump (15 of 15)" />
  <gamegenie code="ATUEGXSA" description="No knock-back when hurt" />
  <gamegenie code="PALUYL" description="Start with 9500 seconds" />
  <gamegenie code="OOKPPAIE" description="Start each stage with 99 hearts" />
  <gamegenie code="AAUPLLAG" description="Bosses have no health" />
  <gamegenie code="LAUPLVPA" description="High jump" />
  <gamegenie code="ZEVOGTPA" description="Walk twice as fast to the right" />
  <gamegenie code="VYXOANNN" description="Walk twice as fast to the left" />
  <gamegenie code="OPELUZEP" description="Infinite hearts" />
</game>
<game code="CLV-H-YVOEQ" name="Championship Pool" crc="CDC641FC">
  <gamegenie code="PAOUYALA" description="1 foul loses the game (instead of 3) - only in 10-ball in party mode" />
  <gamegenie code="ZAOUYALA" description="2 fouls in a row loses the game - only on 9 and 10-ball in party mode" />
  <gamegenie code="SLNUKXSO" description="Fouls don't count - only on 9 and 10-ball and rotation in party mode" />
  <gamegenie code="SUOLXXSO" description="Number of fouls is not cleared after a good shot (3 fouls don't have to be in a row to lose) - only on 10-ball in party mode" />
  <gamegenie code="OZVETASX" description="Always break in XX (1 of 2)" />
  <gamegenie code="AAVEYEST" description="Always break in 9 or 10-ball (2 of 2) - P1" />
  <gamegenie code="PAVEYEST" description="Always break in 9 or 10-ball (2 of 2) - P2" />
</game>
<game code="CLV-H-IZZIF" name="Cheetah Men II (U) [!p]" crc="9AB274AE">
  <gamegenie code="SXEZGUVK" description="Infinite health - level 4" />
  <gamegenie code="SXUXGUVK" description="Infinite health - level 1 and 2" />
  <gamegenie code="SXSXGUVK" description="Infinite health - level 3" />
  <gamegenie code="SXXUIXVK" description="Infinite lives - level 4" />
  <gamegenie code="SZEUYUVK" description="Infinite lives - level 3" />
  <gamegenie code="SZNUAUVK" description="Infinite lives - level 1 and 2" />
</game>
<game code="CLV-H-YCCUX" name="Chessmaster, The" crc="D7F6320C">
  <gamegenie code="AAVKNLTI" description="Move pieces anywhere (1 of 3)" />
  <gamegenie code="SZNGULSA" description="Move pieces anywhere (3 of 3)" />
  <gamegenie code="SZNKELSA" description="Move pieces anywhere (2 of 3)" />
</game>
<game code="CLV-H-URPXD" name="Chip 'n Dale Rescue Rangers, Disney's" crc="8BF29CB6">
  <gamegenie code="AOEITEEN" description="Infinite health" />
  <gamegenie code="AAKGSGPA" description="Multi-jump (1 of 2)" />
  <gamegenie code="SXXKEOZA" description="Multi-jump (2 of 2)" />
  <gamegenie code="ATUEENSL" description="Freeze mechanical bulldog" />
  <gamegenie code="AVKAVNSL" description="Freeze mechanical mice" />
  <gamegenie code="AVOPTESL" description="Freeze buzzer" />
  <gamegenie code="AVNOLKSL" description="Freeze buzz bomb" />
  <gamegenie code="AVVPZSSL" description="Freeze racket-rod" />
  <gamegenie code="ATSOYKSL" description="Freeze ditz" />
  <gamegenie code="ATSPANSL" description="Freeze hawk bomber" />
  <gamegenie code="AVVOOUSL" description="Freeze bouncing boxes" />
  <gamegenie code="ZEXKNPTE" description="Mega-jump" />
  <gamegenie code="GAEIIEVI" description="Never get stunned" />
  <gamegenie code="IVEKINEO" description="Press Start to finish the level" />
</game>
<game code="CLV-H-NBEFH" name="Chip 'n Dale Rescue Rangers 2, Disney's" crc="FC5783A7">
  <gamegenie code="EIXZEZEY" description="Invincibility (glitchy)" />
  <gamegenie code="SSXLLEVS" description="Infinite health" />
  <gamegenie code="OUXLLEVS" description="Infinite health - both players" />
  <gamegenie code="XVXXXGVS" description="Never get stunned" />
  <gamegenie code="PEUYIILA" description="Start with 1 life - both players" />
  <gamegenie code="ZEUYIILA" description="Start with 2 lives - both players" />
  <gamegenie code="GEUYIILA" description="Start with 4 lives - both players" />
  <gamegenie code="IEUYIILA" description="Start with 5 lives - both players" />
  <gamegenie code="NXKZKTVI" description="Infinite lives - both players" />
  <gamegenie code="GXKZKTVI" description="Almost infinite lives - both players" />
  <gamegenie code="PEOYZILA" description="Start with 1 heart - both players" />
  <gamegenie code="ZEOYZILA" description="Start with 2 hearts - both players" />
  <gamegenie code="GEOYZILA" description="Start with 4 hearts - both players" />
  <gamegenie code="IEOYZILA" description="Start with 5 hearts - both players" />
  <gamegenie code="PANNAILA" description="Start with 1 credit" />
  <gamegenie code="ZANNAILA" description="Start with 2 credits" />
  <gamegenie code="TANNAILA" description="Start with 6 credits" />
  <gamegenie code="PANNAILE" description="Start with 9 credits" />
  <gamegenie code="NYNNAILE" description="Start with 255 credits (ignore the counter)" />
  <gamegenie code="OXUNGIVK" description="Infinite credits" />
</game>
<game code="CLV-H-EKGMO" name="Chubby Cherub" crc="77833016">
  <gamegenie code="SZEAYZVG" description="Infinite lives" />
  <gamegenie code="SZEXIYSA" description="Infinite power" />
  <gamegenie code="AEOAAZZA" description="Start with 1 life" />
  <gamegenie code="IEOAAZZA" description="Start with double lives" />
  <gamegenie code="AEOAAZZE" description="Start with triple lives" />
  <gamegenie code="GEVAKVAA" description="Half regular power gained from food" />
  <gamegenie code="PENXATZA" description="Slow down power loss on the ground" />
  <gamegenie code="LENXTVPA" description="Slow down power loss in the air" />
  <gamegenie code="ZANEVSUT" description="Infinite Gau (shots)" />
  <gamegenie code="AASXOAGE" description="Double Gau (shots) on candy pick-up" />
  <gamegenie code="IEOALZPA" description="Start on Stage 5 (1 of 2)" />
  <gamegenie code="GEOAPZAA" description="Start on Stage 5 (2 of 2)" />
  <gamegenie code="ZEOALZPE" description="Start on Stage 10 (1 of 2)" />
  <gamegenie code="PEOAPZAE" description="Start on Stage 10 (2 of 2)" />
</game>
<game code="CLV-H-MGKBV" name="Circus Caper" crc="D152FB02">
  <gamegenie code="SYNNPGLA" description="Invincibility in normal levels (1 of 3)" />
  <gamegenie code="TANNAGZS" description="Invincibility in normal levels (2 of 3)" />
  <gamegenie code="AZNYYKSZ" description="Invincibility in normal levels (3 of 3)" />
  <gamegenie code="GZEYPSSE" description="Infinite power (health)" />
  <gamegenie code="SZEYPSSE" description="Infinite power (health) (alt)" />
  <gamegenie code="AASVNAZA" description="Full health from food" />
  <gamegenie code="NNOTNLAE" description="Start with lots of weapons" />
  <gamegenie code="ZEVGGAPA" description="Start on stage 2 (starts on stage 1 after continuing)" />
  <gamegenie code="LEVGGAPA" description="Start on stage 3 (starts on stage 1 after continuing)" />
  <gamegenie code="GEVGGAPA" description="Start on stage 4 (starts on stage 1 after continuing)" />
  <gamegenie code="IEVGGAPA" description="Start on stage 5 (starts on stage 1 after continuing)" />
  <gamegenie code="TEVGGAPA" description="Start on stage 6 (starts on stage 1 after continuing)" />
</game>
<game code="CLV-H-KHPUK" name="City Connection" crc="AE8666B4">
  <gamegenie code="SZNSTPVG" description="Infinite lives" />
  <gamegenie code="IEKEYIZA" description="Start with double lives" />
  <gamegenie code="AEKEYIZE" description="Start with triple lives" />
  <gamegenie code="SXKPZGVG" description="Infinite Oil" />
  <gamegenie code="AXSAPIIA" description="Start with extra Oil" />
  <gamegenie code="PEKEIIAA" description="Start on level 1" />
  <gamegenie code="ZEKEIIAA" description="Start on level 2" />
  <gamegenie code="LEKEIIAA" description="Start on level 3" />
  <gamegenie code="GEKEIIAA" description="Start on level 4" />
  <gamegenie code="IEKEIIAA" description="Start on level 5" />
</game>
<game code="CLV-H-KJKNK" name="Clash At Demonhead" crc="82AFA828">
  <gamegenie code="ENOPLZEI" description="Invincibility (1 of 2)" />
  <gamegenie code="ESSPPAEY" description="Invincibility (2 of 2)" />
  <gamegenie code="SZEGZISA" description="Infinite health" />
  <gamegenie code="SXNZKSVK" description="Infinite barrier hits" />
  <gamegenie code="VZSULOVV" description="Don't die when power hits zero" />
  <gamegenie code="VNNGNUSO" description="Start with 1 of each item" />
  <gamegenie code="SXKZGSVS" description="Infinite supply of all items bought" />
  <gamegenie code="AVUGAGST" description="All items in shop are free" />
  <gamegenie code="TAUGKGKY" description="Start with extra cash (1 of 2)" />
  <gamegenie code="UPUGVKXO" description="Start with extra cash (2 of 2)" />
  <gamegenie code="AAEKVGAO" description="Start with 50% power (1 of 3)" />
  <gamegenie code="AEVZNPAO" description="Start with 50% power (2 of 3)" />
  <gamegenie code="ZAOGXGGA" description="Start with 50% power (3 of 3)" />
  <gamegenie code="APEKVGAO" description="Start with 150% power (1 of 3)" />
  <gamegenie code="TAOGXGGA" description="Start with 150% power (2 of 3)" />
  <gamegenie code="AOVZNPAO" description="Start with 150% power (3 of 3)" />
  <gamegenie code="AZEKVGAP" description="Start with 200% power (1 of 3)" />
  <gamegenie code="AAOGXGGE" description="Start with 200% power (2 of 3)" />
  <gamegenie code="AXVZNPAP" description="Start with 200% power (3 of 3)" />
</game>
<game code="CLV-H-MEPFA" name="Cliffhanger" crc="57C2AE4E">
  <gamegenie code="PASGVGLA" description="Start with 2 lives" />
  <gamegenie code="IASGVGLA" description="Start with 6 lives" />
  <gamegenie code="YASGVGLA" description="Start with 8 lives" />
  <gamegenie code="PASGVGLE" description="Start with 10 lives" />
  <gamegenie code="SXEKKSVK" description="Infinite lives" />
  <gamegenie code="SZVPOKVK" description="Protection from most hits" />
  <gamegenie code="PAKGUGLA" description="Start with 1 continue" />
  <gamegenie code="IAKGUGLA" description="Start with 5 continues" />
  <gamegenie code="YAKGUGLA" description="Start with 7 continues" />
  <gamegenie code="PAKGUGLE" description="Start with 9 continues" />
  <gamegenie code="ULOTSYTN" description="Infinite continues" />
  <gamegenie code="SUNPXXSO" description="Don't burn money at campfire" />
  <gamegenie code="AXOKNGAP" description="Start with 2x health (does not show on meter)" />
  <gamegenie code="AEOKNGAO" description="Start with 1/2 health" />
  <gamegenie code="VTVKVKSE" description="Start with $100" />
  <gamegenie code="VTVKUKSE" description="Start with $10,000" />
  <gamegenie code="VGVKUKSE" description="Start with $650,000 (displays $xx0000 until you pick up first money bag)" />
  <gamegenie code="YONKKXAP" description="Some bags contain mega-money, some contain no money" />
</game>
<game code="CLV-H-YEZVX" name="Clu Clu Land" crc="48F68D40">
  <gamegenie code="GXLILL" description="Infinite lives - both players" />
  <gamegenie code="GZPGSL" description="Infinite time" />
  <gamegenie code="PAGKGL" description="Start with 1 life - both players" />
  <gamegenie code="APGKGL" description="Start with 10 lives - both players" />
  <gamegenie code="TEYIGL" description="Increase extra time" />
  <gamegenie code="VTSKPLSA" description="Start with 1 life - P2" />
  <gamegenie code="IEVISZZA" description="Shoot more rays" />
  <gamegenie code="AOVSOZAZ" description="Shoot shorter rays" />
  <gamegenie code="ASVSOZAZ" description="Shoot longer rays" />
  <gamegenie code="AASIAYGA" description="Enemy can go thru gold bars" />
</game>
<game code="CLV-H-DZVFZ" name="Cobra Command" crc="2D75C7A9">
  <gamegenie code="GZSSNGST" description="Immune to weapon damage" />
  <gamegenie code="SXUAAOVK" description="Start with infinite lives" />
  <gamegenie code="AAUVGZGA" description="Start with 1 life" />
  <gamegenie code="AAUVGZGE" description="Start with 9 lives" />
</game>
<game code="CLV-H-YBJUM" name="Cobra Triangle" crc="C8AD4F32">
  <gamegenie code="ATVXKLEI" description="Invincibility" />
  <gamegenie code="SZUXZVVK" description="Infinite continue options" />
  <gamegenie code="SZEVNOVK" description="Don't lose life after dying from damage" />
  <gamegenie code="SZVTSOVK" description="Don't lose life after dying from time running out" />
  <gamegenie code="ENXTPVSA" description="Never lose your power-ups (1 of 2)" />
  <gamegenie code="LEXTZVAX" description="Never lose your power-ups (2 of 2)" />
  <gamegenie code="VVXEAUSE" description="Gain an extra minute (1 of 2)" />
  <gamegenie code="LOXEPLIP" description="Gain an extra minute (2 of 2)" />
  <gamegenie code="EIXLPGEL" description="Hit anywhere (1 of 6)" />
  <gamegenie code="ESKZXGEL" description="Hit anywhere (2 of 6)" />
  <gamegenie code="KPULZGNO" description="Hit anywhere (3 of 6)" />
  <gamegenie code="OLKXOSOO" description="Hit anywhere (4 of 6)" />
  <gamegenie code="TAXLZGZO" description="Hit anywhere (5 of 6)" />
  <gamegenie code="YOKZUKZP" description="Hit anywhere (6 of 6)" />
</game>
<game code="CLV-H-ZOYGF" name="Code Name: Viper" crc="E2313813">
  <gamegenie code="SZSSGIAX" description="Invincibility" />
  <gamegenie code="STVPVOON" description="Infinite health (1 of 2)" />
  <gamegenie code="AASOVZPA" description="Infinite health (2 of 2)" />
  <gamegenie code="SZVOSOSE" description="Infinite health (alt)" />
  <gamegenie code="SZOVKNVK" description="Infinite lives" />
  <gamegenie code="AAOXLZPA" description="Infinite Machine Gun" />
  <gamegenie code="AENXZPPA" description="Infinite Gun" />
  <gamegenie code="GTOVEYZL" description="Double usual bullets on new life" />
  <gamegenie code="PPOVEYZU" description="Half bullets on new life" />
  <gamegenie code="VVNVGKSE" description="Start with Machine Gun and 256 bullets" />
  <gamegenie code="VTOTONSE" description="Machine Gun with 256 bullets on new life" />
  <gamegenie code="SXKEVNOU" description="Upper level jump (1 of 2)" />
  <gamegenie code="ONEOYEXN" description="Upper level jump (2 of 2)" />
  <gamegenie code="GZOTONSE" description="Keep Machine Gun after dying (1 of 2)" />
  <gamegenie code="GZEVVNSE" description="Keep Machine Gun after dying (2 of 2)" />
  <gamegenie code="AASIVEAL" description="Hit anywhere (1 of 4)" />
  <gamegenie code="APOOSGLA" description="Hit anywhere (2 of 4)" />
  <gamegenie code="GLXPEGLP" description="Hit anywhere (3 of 4)" />
  <gamegenie code="SZOOKKSU" description="Hit anywhere (4 of 4)" />
  <gamegenie code="AEESIIGA" description="Have Bomb (can exit level without the Bomb)" />
  <gamegenie code="PENTAGLA" description="Start with 1 life" />
  <gamegenie code="TENTAGLA" description="Start with 6 lives" />
  <gamegenie code="PENTAGLE" description="Start with 9 lives" />
  <gamegenie code="GTETLIZL" description="Start with double usual bullets" />
  <gamegenie code="PPETLIZU" description="Start with half usual bullets" />
</game>
<game code="CLV-H-KBJQL" name="Commando" crc="82BE4724">
  <gamegenie code="ATNITPSA" description="Invincibility" />
  <gamegenie code="EZEGNOVG" description="Infinite lives" />
  <gamegenie code="SZEGNOVK" description="Infinite lives (alt)" />
  <gamegenie code="XVULASXK" description="Infinite Grenades" />
  <gamegenie code="AAEIEYGP" description="Get items from anywhere (1 of 2)" />
  <gamegenie code="AAKIAVKI" description="Get items from anywhere (2 of 2)" />
  <gamegenie code="AENTTLLI" description="Hit anywhere (1 of 2)" />
  <gamegenie code="AAETTGLG" description="Hit anywhere (2 of 2)" />
  <gamegenie code="AEELGNPA" description="Walk through anything (1 of 2)" />
  <gamegenie code="AASLLYTA" description="Walk through anything (2 of 2)" />
  <gamegenie code="AEKKIILA" description="Start with 1 life - both players" />
  <gamegenie code="TEKKIILA" description="Start with 6 lives - both players" />
  <gamegenie code="PEKKIILE" description="Start with 9 lives - both players" />
  <gamegenie code="AOSGIIIA" description="Start with double rations of grenades" />
</game>
<game code="CLV-H-TYMCW" name="Conan" crc="C6000085">
  <gamegenie code="SXUEYYAX" description="Invincibility (1 of 2)" />
  <gamegenie code="SZVAPGAX" description="Invincibility (2 of 2)" />
  <gamegenie code="SXKISTVG" description="Infinite lives (1 of 2)" />
  <gamegenie code="SZVSULVG" description="Infinite lives (2 of 2)" />
  <gamegenie code="SXSTOOSE" description="Infinite health" />
</game>
<game code="CLV-H-RUKWC" name="Conquest of the Crystal Palace" crc="20A5219B">
  <gamegenie code="ESVIYPEY" description="Invincibility (1 of 2)" />
  <gamegenie code="SEVIIPSZ" description="Invincibility (2 of 2)" />
  <gamegenie code="SXOVLIAX" description="Invincibility (alt)" />
  <gamegenie code="GZVTAPAX" description="Infinite lives" />
  <gamegenie code="SZVTLPSA" description="Infinite lives (alt)" />
  <gamegenie code="VVKSZOSU" description="Infinite energy (will display wrong info)" />
  <gamegenie code="SXXTAIAX" description="Infinite energy for Farron" />
  <gamegenie code="SUPILU" description="Infinite fire power" />
  <gamegenie code="GPEYUXTA" description="Maximum energy without Life Crystal" />
  <gamegenie code="GZXVPPAX" description="Don't use up money when buying things (1 of 2)" />
  <gamegenie code="GZUTZPAX" description="Don't use up money when buying things (2 of 2)" />
  <gamegenie code="AAVIGTZA" description="Super-jump without Flight Crystal (1 of 2)" />
  <gamegenie code="PAVITTLA" description="Super-jump without Flight Crystal (2 of 2)" />
  <gamegenie code="IOUSLVTA" description="Increase super-jump to mega-jump" />
  <gamegenie code="IKUSLVTA" description="Increase super-jump to super-mega-jump" />
</game>
<game code="CLV-H-WBAOK" name="Contra" crc="F6035030">
  <gamegenie code="SXKVPZAX" description="Invincibility" />
  <gamegenie code="SLTIYG" description="Invincibility (blinking)" />
  <gamegenie code="AAVITGIA" description="Invincibility (blinking) (alt)" />
  <gamegenie code="SLAIUZ" description="Start with infinite lives" />
  <gamegenie code="GXIIUX" description="Keep weapons after losing life" />
  <gamegenie code="ATKSZSOZ" description="Multi-jump - both players (1 of 7)" />
  <gamegenie code="AZNITGSL" description="Multi-jump - both players (2 of 7)" />
  <gamegenie code="NPNIYGEU" description="Multi-jump - both players (3 of 7)" />
  <gamegenie code="SUEIAGVI" description="Multi-jump - both players (4 of 7)" />
  <gamegenie code="SUVSOPSP" description="Multi-jump - both players (5 of 7)" />
  <gamegenie code="VINSAGEY" description="Multi-jump - both players (6 of 7)" />
  <gamegenie code="XTNSPKAE" description="Multi-jump - both players (7 of 7)" />
  <gamegenie code="UNVSYVKN" description="Jump higher (1 of 2)" />
  <gamegenie code="XNVSPVUN" description="Jump higher (2 of 2)" />
  <gamegenie code="ESEVALEP" description="Hit anywhere (1 of 4)" />
  <gamegenie code="GXXTPLEL" description="Hit anywhere (2 of 4)" />
  <gamegenie code="GZNVYLEL" description="Hit anywhere (3 of 4)" />
  <gamegenie code="SXKTYLAX" description="Hit anywhere (4 of 4)" />
  <gamegenie code="VYVIPNNN" description="Run twice as fast (1 of 2)" />
  <gamegenie code="ZASSIYPA" description="Run twice as fast (2 of 2)" />
  <gamegenie code="LLKSIAIX" description="Press Start to complete the level" />
  <gamegenie code="PEIIXZ" description="Start new life with Machine Gun" />
  <gamegenie code="ZEIIXZ" description="Start new life with Fireball" />
  <gamegenie code="LEIIXZ" description="Start new life with Spread Gun" />
  <gamegenie code="GEIIXZ" description="Start new life with Laser" />
  <gamegenie code="ALNKPKYL" description="Start on level x" />
  <gamegenie code="PANGIGAA" description="Start on level 2" />
  <gamegenie code="ZANGIGAA" description="Start on level 3" />
  <gamegenie code="LANGIGAA" description="Start on level 4" />
  <gamegenie code="GANGIGAA" description="Start on level 5" />
  <gamegenie code="IANGIGAA" description="Start on level 6" />
  <gamegenie code="TANGIGAA" description="Start on level 7" />
  <gamegenie code="YANGIGAA" description="Start on level 8" />
</game>
<game code="CLV-H-YXGJE" name="Contra Force" crc="A94591B0">
  <gamegenie code="SXKXZIAX" description="Invincibility (1 of 2)" />
  <gamegenie code="SXUZPIAX" description="Invincibility (2 of 2)" />
  <gamegenie code="OUOXVKOO" description="Infinite lives (alt)" />
  <gamegenie code="AANVIAPA" description="Infinite lives - all characters" />
  <gamegenie code="PAUYTTLE" description="Start with 9 lives - all characters" />
  <gamegenie code="TAUYTTLA" description="Start with 6 lives - all characters" />
  <gamegenie code="PAUYTTLA" description="Start with 1 life - all characters" />
  <gamegenie code="OUEXNKOO" description="Keep weapons after death" />
</game>
<game code="CLV-H-UKKJL" name="Cool World" crc="D73AA04C">
  <gamegenie code="GXUVTKVK" description="Infinite lives" />
  <gamegenie code="SXSTOTVG" description="Infinite Bombs" />
  <gamegenie code="SXVVKTVG" description="Infinite Erasers" />
  <gamegenie code="AZNZEYAE" description="Lots of Erasers" />
  <gamegenie code="LEVLGZPA" description="Start with 3 Bombs" />
  <gamegenie code="TEVLGZPA" description="Start with 6 Bombs" />
  <gamegenie code="PEVLGZPE" description="Start with 9 Bombs" />
  <gamegenie code="PEKGYAZA" description="Start with 2 lives (1 of 2)" />
  <gamegenie code="PAKZKYZA" description="Start with 2 lives (2 of 2)" />
  <gamegenie code="TEKGYAZA" description="Start with 7 lives (1 of 2)" />
  <gamegenie code="TAKZKYZA" description="Start with 7 lives (2 of 2)" />
  <gamegenie code="PEKGYAZE" description="Start with 10 lives (1 of 2)" />
  <gamegenie code="PAKZKYZE" description="Start with 10 lives (2 of 2)" />
  <gamegenie code="LEKKGAPA" description="Start with 3 Erasers (1 of 2)" />
  <gamegenie code="LAVXXYPA" description="Start with 3 Erasers (2 of 2)" />
  <gamegenie code="TEKKGAPA" description="Start with 6 Erasers (1 of 2)" />
  <gamegenie code="TAVXXYPA" description="Start with 6 Erasers (2 of 2)" />
  <gamegenie code="PEKKGAPE" description="Start with 9 Erasers (1 of 2)" />
  <gamegenie code="PAVXXYPE" description="Start with 9 Erasers (2 of 2)" />
</game>
<game code="CLV-H-FJSQY" name="Cowboy Kid" crc="D18E6BE3">
  <gamegenie code="GNXPAUTS" description="Hit anywhere (1 of 2)" />
  <gamegenie code="OXOOIUOK" description="Hit anywhere (2 of 2)" />
  <gamegenie code="OUNKEUOO" description="Infinite lives" />
</game>
<game code="CLV-H-JSWFX" name="CrackOut" crc="7E9BCA05">
  <gamegenie code="SZNUXAVG" description="Infinite lives" />
</game>
<game code="CLV-H-BSHHB" name="Crash 'n The Boys: Street Challenge" crc="C7F0C457">
  <gamegenie code="ASVUAIIA" description="Start with 50 Gold" />
  <gamegenie code="OOVUAIIE" description="Start with 99 Gold" />
</game>
<game code="CLV-H-VUIHV" name="Crystalis" crc="1335CB05">
  <gamegenie code="AEKOUPTA" description="Walk through walls" />
  <gamegenie code="AAOPETLA" description="Faster sword charge" />
  <gamegenie code="OZNOOKZK" description="Always fire X shot (1 of 2)" />
  <gamegenie code="PANOXKZG" description="Always fire charged shot (2 of 2)" />
  <gamegenie code="LANOXKZG" description="Always fire bracelet charged shot (2 of 2)" />
  <gamegenie code="SZEPEVGK" description="Allow sword charge while moving" />
  <gamegenie code="NYVSPZGV" description="First pupil gives you more gold" />
  <gamegenie code="SXNOVXSE" description="Magic doesn't use up MP" />
  <gamegenie code="AASVVNYA" description="Immune to poison" />
  <gamegenie code="AEKTSNYA" description="Immune to paralysis" />
  <gamegenie code="TEOTVYGA" description="Stronger poison" />
  <gamegenie code="ZEOTVYGA" description="Weaker poison" />
  <gamegenie code="SZUOIVSE" description="Don't get charged for boarding at Inn (1 of 2)" />
  <gamegenie code="SZKPLVSE" description="Don't get charged for boarding at Inn (2 of 2)" />
  <gamegenie code="SXVPUOSE" description="Don't get charged for items in shops (1 of 2)" />
  <gamegenie code="SXVOOOSE" description="Don't get charged for items in shops (2 of 2)" />
  <gamegenie code="VVOGUOSE" description="Start with some gold" />
</game>
<game code="CLV-H-ZSVDV" name="Cyberball" crc="88338ED5">
  <gamegenie code="SXUYAKVK" description="Infinite level time" />
  <gamegenie code="PENOYLLA" description="Start with level time at 1 minute" />
  <gamegenie code="ZENOYLLA" description="Start with level time at 2 minutes" />
  <gamegenie code="IENOYLLA" description="Start with level time at 5 minutes" />
  <gamegenie code="PENOYLLE" description="Start with level time at 9 minutes" />
  <gamegenie code="AAXEZAZA" description="Goals worth 0 points" />
  <gamegenie code="PAXEZAZA" description="Goals worth 1 points" />
  <gamegenie code="IAXEZAZA" description="Goals worth 5 points" />
  <gamegenie code="PAXEZAZE" description="Goals worth 9 points" />
  <gamegenie code="LTXEZAZA" description="Goals worth mega points" />
</game>
<game code="CLV-H-WPNZE" name="Cybernoid: The Fighting Machine" crc="AC8DCDEA">
  <gamegenie code="SZVZGOVK" description="Start with infinite lives" />
  <gamegenie code="NYEATXNY" description="Start with 1 life" />
  <gamegenie code="UYEATXNN" description="Start with 5 lives" />
  <gamegenie code="AAEATXNN" description="Start with 18 lives" />
  <gamegenie code="GOOZZPZA" description="20 Genocides on new life" />
  <gamegenie code="SZNPVOVK" description="Infinite Bombs" />
  <gamegenie code="SXEUSSVK" description="Infinite Genocides" />
  <gamegenie code="SXOPUSVK" description="Infinite Shields" />
  <gamegenie code="SZNOLNVK" description="Infinite Seekers" />
  <gamegenie code="NNOEPPAE" description="Start with Rear Laser" />
  <gamegenie code="GZKZZOSE" description="Keep Rear Laser after death" />
  <gamegenie code="GZKXAOSE" description="Keep Mace after death (1 of 2)" />
  <gamegenie code="GZKZIOSE" description="Keep Mace after death (2 of 2)" />
  <gamegenie code="GPUETZPA" description="Start new life with 20 Shields (1 of 2)" />
  <gamegenie code="GOOZYPPA" description="Start new life with 20 Shields (2 of 2)" />
  <gamegenie code="GPKAZZIA" description="Start with 20 Seekers and Bouncers (1 of 2)" />
  <gamegenie code="GOOXGPIA" description="Start with 20 Seekers and Bouncers (2 of 2)" />
  <gamegenie code="AZUALZGO" description="Start with double Bombs (1 of 2)" />
  <gamegenie code="AXEXIPGO" description="Start with double Bombs (2 of 2)" />
</game>
<game code="CLV-H-HAGMF" name="Indy Heat, Danny Sullivan's" crc="C1B43207">
  <gamegenie code="SZELSOVS" description="Infinite turbos" />
  <gamegenie code="SXVASVSO" description="Infinite fuel" />
  <gamegenie code="NYUOZLGV" description="Start with $255,000" />
  <gamegenie code="SVKLTOSO" description="Everything costs how much you have" />
  <gamegenie code="OUVZAXOO" description="Don't take damage in the front" />
</game>
<game code="CLV-H-KKEFK" name="Darkman" crc="398B8182">
  <gamegenie code="SXKGUSSE" description="Infinite health" />
</game>
<game code="CLV-H-UTVGS" name="Darkwing Duck, Disney's" crc="5DCE2EEA">
  <gamegenie code="EYUEIPEI" description="Invincibility" />
  <gamegenie code="AVVNSOOG" description="Infinite health" />
  <gamegenie code="GZOGSUVK" description="Infinite lives" />
  <gamegenie code="SGOGSUVK" description="Infinite lives (alt)" />
  <gamegenie code="AVUEUOSZ" description="Infinite gas (if you avoid the Go missions)" />
  <gamegenie code="IYEAKPAY" description="More gas on pick-up" />
  <gamegenie code="AUXAYAEY" description="One hit kills" />
  <gamegenie code="SXNYUOSE" description="Start with infinite health" />
  <gamegenie code="PYSKXPLY" description="Start with 2 lives" />
  <gamegenie code="IYSKXPLY" description="Start with 6 lives" />
  <gamegenie code="AYSKXPLN" description="Start with 9 lives" />
</game>
<game code="CLV-H-ULRGS" name="Dash Galaxy in the Alien Asylum" crc="67811DA6">
  <gamegenie code="XVUGLNSX" description="Invincibility" />
  <gamegenie code="SZVPTOVK" description="Can't lose lives in rooms" />
  <gamegenie code="SZUPLOVK" description="Can't lose lives in elevator shaft" />
  <gamegenie code="PENPIALA" description="Start with 1 life" />
  <gamegenie code="TENPIALA" description="Start with 6 lives" />
  <gamegenie code="PENPIALE" description="Start with 9 lives" />
  <gamegenie code="LVNPIALA" description="Start with 99 lives" />
  <gamegenie code="NYSXAOAN" description="Oxygen used up more slowly in shaft" />
  <gamegenie code="AYXXSNNY" description="Oxygen used up more quickly in rooms" />
  <gamegenie code="SZOPISVK" description="Infinite Oxygen" />
  <gamegenie code="AAEPZIPA" description="No damage from shots and collisions" />
  <gamegenie code="VTNSEXSX" description="Infinite Bombs in elevator shaft" />
  <gamegenie code="VVVSXXSX" description="Infinite Bombs in rooms" />
  <gamegenie code="VVOSSXSX" description="Infinite Detonators in shafts" />
  <gamegenie code="VTESNUSX" description="Infinite Detonators in rooms" />
  <gamegenie code="VTEZIKSX" description="Infinite Keys in shafts" />
  <gamegenie code="VVOXTOSX" description="Infinite Keys in rooms" />
  <gamegenie code="OZEPOISE" description="Start on level XX (1 of 2)" />
  <gamegenie code="IAEPXSVI" description="Start on level 5 (2 of 2)" />
  <gamegenie code="ZAEPXSVS" description="Start on level 10 (2 of 2)" />
  <gamegenie code="YAEPXSVS" description="Start on level 15 (2 of 2)" />
  <gamegenie code="GPEPXSVI" description="Start on level 20 (2 of 2)" />
</game>
<game code="CLV-H-LGFDQ" name="Day Dreamin' Davey" crc="E145B441">
  <gamegenie code="SXSPZGSA" description="Infinite health" />
  <gamegenie code="AANLZKZG" description="Hit anywhere" />
</game>
<game code="CLV-H-CFPLJ" name="Days of Thunder" crc="12748678">
  <gamegenie code="NYKNIUNO" description="Start with more fuel" />
  <gamegenie code="YIKNIUNO" description="Start with less fuel" />
  <gamegenie code="SXEYPUSU" description="Faster acceleration" />
  <gamegenie code="AAVOEXNY" description="Tires don't burst" />
  <gamegenie code="SNXOSKEY" description="Better left-hand cornering" />
  <gamegenie code="IEUNLLLA" description="Maximum acceleration (1 of 2)" />
  <gamegenie code="SXEYPUSU" description="Maximum acceleration (2 of 2)" />
</game>
<game code="CLV-H-GHBER" name="Deadly Towers" crc="C2730C30">
  <gamegenie code="OXXOXOPX" description="Invincibility" />
  <gamegenie code="GXSONPST" description="Infinite HP" />
  <gamegenie code="YYXELPZU" description="Start with 127 Ludder" />
  <gamegenie code="LGXELPZU" description="Start with 75 Ludder" />
  <gamegenie code="ZEUPKYPE" description="1 Ludder gives 10 on pick-up" />
  <gamegenie code="GOUPUYIA" description="5 Ludder gives 20 on pick-up" />
  <gamegenie code="GXUGLVON" description="Shopkeeper forgets to charge you" />
</game>
<game code="CLV-H-GUBQC" name="Defender II" crc="A2AF25D0">
  <gamegenie code="SXVIOTSA" description="Invincibility" />
  <gamegenie code="GXTGEY" description="Infinite lives" />
  <gamegenie code="GXYSGI" description="Infinite Smart Bombs" />
  <gamegenie code="PELGNY" description="Start with 1 life" />
  <gamegenie code="TELGNY" description="Start with 6 lives" />
  <gamegenie code="PELGNN" description="Start with 9 lives" />
  <gamegenie code="YETVIL" description="Super speed (1 of 2)" />
  <gamegenie code="YAZVPG" description="Super speed (2 of 2)" />
</game>
<game code="CLV-H-IZCAF" name="Defender of the Crown" crc="28FB71AE">
  <gamegenie code="ZAVVALGO" description="Only 10 soldiers in your Garrison" />
  <gamegenie code="AZVVALGO" description="40 soldiers in your Garrison" />
  <gamegenie code="AAEOUPPA" description="Soldiers for free" />
  <gamegenie code="LAEOUPPA" description="Triple the cost of soldiers" />
  <gamegenie code="GAEOKOAA" description="Halve the cost of knights" />
  <gamegenie code="APEOKOAA" description="Double the cost of knights" />
  <gamegenie code="YAEOSOYA" description="Halve the cost of catapults" />
  <gamegenie code="ZAEOVPGO" description="Halve the cost of castles" />
</game>
<game code="CLV-H-YEIKK" name="Demon Sword" crc="4681691A">
  <gamegenie code="SZUEUZAX" description="Invincibility" />
  <gamegenie code="AESVLTPA" description="Infinite powers and lives" />
  <gamegenie code="SXSIYASA" description="Infinite lives" />
  <gamegenie code="SZKGTTSA" description="Infinite health (life)" />
  <gamegenie code="VTVTAESX" description="Phoenix always rescues you" />
  <gamegenie code="SLNNANSO" description="Infinite Fire, Lightning, Power Beams on pick-up" />
  <gamegenie code="VTNXAOSE" description="Extra dart strength" />
  <gamegenie code="ALXGAYSU" description="Hit anywhere (1 of 3)" />
  <gamegenie code="ATXGPNEP" description="Hit anywhere (2 of 3)" />
  <gamegenie code="SXNKPVGK" description="Hit anywhere (3 of 3)" />
  <gamegenie code="ATNXAOSA" description="Start on level X (1 of 2)" />
  <gamegenie code="PANZLPAA" description="Start on level 2 (2 of 2)" />
  <gamegenie code="ZANZLPAA" description="Start on level 3 (2 of 2)" />
  <gamegenie code="LANZLPAA" description="Start on level 4 (2 of 2)" />
  <gamegenie code="GANZLPAA" description="Start on level 5 (2 of 2)" />
  <gamegenie code="IANZLPAA" description="Start on level 6 (2 of 2)" />
  <gamegenie code="XZNZGPSA" description="Start with 44 X (1 of 2)" />
  <gamegenie code="VEEZYOSE" description="Start with 44 Red Spheres (2 of 2)" />
  <gamegenie code="VEEXZOSE" description="Start with 44 Black Spheres (2 of 2)" />
  <gamegenie code="VANXLOSE" description="Start with 44 Fire Spheres (2 of 2)" />
  <gamegenie code="VANXTOSE" description="Start with 44 Lightning bolts (2 of 2)" />
  <gamegenie code="VEEZPOSE" description="Start with 44 Power beams (2 of 2)" />
  <gamegenie code="AEVSUIZA" description="Start with 1 life" />
  <gamegenie code="IEVSUIZA" description="Start with 6 lives" />
  <gamegenie code="AEVSUIZE" description="Start with 9 lives" />
</game>
<game code="CLV-H-CLSMZ" name="Destination Earthstar" crc="EB9960EE">
  <gamegenie code="SXVSVIVG" description="Infinite lives" />
  <gamegenie code="ISNEUUOP" description="Less energy" />
  <gamegenie code="NNNEUUOO" description="More energy" />
  <gamegenie code="XTNVSNXK" description="Don't lose special weapon in sub-game" />
  <gamegenie code="PAVTXGLA" description="Start with 1 life" />
</game>
<game code="CLV-H-OIKBT" name="Destiny of an Emperor" crc="A558FB52">
  <gamegenie code="OZNNZGSK" description="No random battles (1 of 2)" />
  <gamegenie code="SXSYYKPU" description="No random battles (2 of 2)" />
  <gamegenie code="SZUYTUGK" description="Walk anywhere" />
  <gamegenie code="AEKPZZGT" description="Buy 300 provisions for no money" />
  <gamegenie code="AENLULZL" description="Dagger costs nothing" />
  <gamegenie code="AEVLKGZL" description="Bandana costs nothing" />
  <gamegenie code="AENUKLGT" description="Flail costs nothing" />
  <gamegenie code="AEXLXGGT" description="Robe costs nothing" />
  <gamegenie code="AEUUXLGP" description="Elixir A costs nothing" />
  <gamegenie code="AEXUVLGT" description="Resurrect costs nothing" />
  <gamegenie code="AEXLVUEG" description="Steed costs nothing" />
  <gamegenie code="AEEUKUEG" description="Gullwing costs nothing" />
  <gamegenie code="AEKPIZYZ" description="Buy 30,000 provisions for no money (1 of 2)" />
  <gamegenie code="AEKPTZAP" description="Buy 30,000 provisions for no money (2 of 2)" />
  <gamegenie code="AEXUOKGZ" description="Leather costs nothing (1 of 2)" />
  <gamegenie code="AEXUXGPA" description="Leather costs nothing (2 of 2)" />
</game>
<game code="CLV-H-DSUFL" name="Dick Tracy" crc="D738C059">
  <gamegenie code="GXVOINSV" description="Infinite health" />
  <gamegenie code="AOVOGNAU" description="Take more damage" />
  <gamegenie code="SZXZEOVK" description="Infinite hand gun bullets" />
  <gamegenie code="SXVXZEVK" description="Infinite machine gun bullets" />
  <gamegenie code="GOEPIOZA" description="More super punches on pick-up" />
  <gamegenie code="SZKZIXVK" description="Infinite super punches" />
  <gamegenie code="SZEXIXVK" description="Infinite tear gas" />
  <gamegenie code="KYVZAANY" description="Mega-jump" />
</game>
<game code="CLV-H-TGJTD" name="Die Hard" crc="085DE7C9">
  <gamegenie code="SXEZTYSA" description="Infinite health against Pistol ammo" />
  <gamegenie code="SXOZIYSA" description="Infinite health against Submachine Gun ammo" />
  <gamegenie code="SXXZLYSA" description="Infinite health against punches" />
  <gamegenie code="ATNALXVG" description="Infinite Pistol ammo" />
  <gamegenie code="ATNEIXVG" description="Infinite Submachine Gun ammo" />
  <gamegenie code="ATVEIZSZ" description="Infinite ammo on all guns" />
  <gamegenie code="AVUNGPSZ" description="Infinite time" />
  <gamegenie code="PEOKIPAP" description="Start with 1 life point instead of 16" />
  <gamegenie code="ZEOKIPAP" description="Start with 2 life points" />
  <gamegenie code="GEOKIPAP" description="Start with 4 life points" />
  <gamegenie code="AEOKIPAO" description="Start with 8 life point" />
  <gamegenie code="GEOKIPAO" description="Start with 12 life points" />
  <gamegenie code="GOOKIPAP" description="Start with 20 life points" />
  <gamegenie code="SXOYYUSE" description="Lose foot health very slowly" />
  <gamegenie code="AEXGPOYA" description="Start with no Pistol ammo instead of 15" />
  <gamegenie code="IEXGPOYA" description="Start with 5 Pistol ammo" />
  <gamegenie code="ZEXGPOYE" description="Start with 10 Pistol ammo" />
  <gamegenie code="GOXGPOYA" description="Start with 20 Pistol ammo" />
  <gamegenie code="POXGPOYE" description="Start with 25 Pistol ammo" />
  <gamegenie code="ENUYPOGL" description="Time runs at 1/4 normal speed" />
  <gamegenie code="KUUYPOGL" description="Time runs at 1/3 normal speed" />
  <gamegenie code="ANUYPOGU" description="Time runs at 1/2 normal speed" />
  <gamegenie code="TOUYPOGU" description="Time runs at 2x normal speed" />
  <gamegenie code="GOUYPOGL" description="Time runs at 3x normal speed" />
  <gamegenie code="YEUYPOGU" description="Time runs at 4x normal speed" />
</game>
<game code="CLV-H-JFYEF" name="Dig Dug II: Trouble in Paradise" crc="DBB06A25">
  <gamegenie code="GZETIZEI" description="Instant inflate and explode" />
  <gamegenie code="PEETOPLA" description="Start with 1 life - both players" />
  <gamegenie code="AEETOPLE" description="Start with 8 lives - both players" />
  <gamegenie code="SZXLSVVK" description="Never lose lives from touching water" />
  <gamegenie code="SXVKLVVK" description="Never lose lives from Fygar's flame" />
  <gamegenie code="SXNIPEVK" description="Never lose lives from hitting enemies" />
  <gamegenie code="OZNYPUPX" description="Turbo speed (1 of 2)" />
  <gamegenie code="ZANYZLLA" description="Turbo speed (2 of 2)" />
</game>
<game code="CLV-H-ZRHSU" name="Digger T. Rock: The Legend of the Lost City" crc="1CEE0C21">
  <gamegenie code="SXSYOPVG" description="Infinite health" />
  <gamegenie code="SXVAYTVG" description="Infinite lives" />
  <gamegenie code="PAONOGAE" description="Start with weapons" />
  <gamegenie code="IAUGZUPA" description="Less rocks on pick-up" />
  <gamegenie code="SZEYTVVK" description="Infinite rocks on pick-up" />
  <gamegenie code="SXEUIUVK" description="Infinite rope on pick-up" />
  <gamegenie code="SXEXTEVK" description="Infinite dynamite on pick-up" />
</game>
<game code="CLV-H-DNGWM" name="Dirty Harry" crc="0C2E7863">
  <gamegenie code="GXXGXGST" description="Infinite health" />
  <gamegenie code="AEVLIPZA" description="Maximum health from Chili Dogs" />
  <gamegenie code="SXUKOKVK" description="Infinite lives" />
  <gamegenie code="ZESSTSPO" description="Only 10 Magnum Bullets allowed (1 of 2)" />
  <gamegenie code="ZEVIZSPO" description="Only 10 Magnum Bullets allowed (2 of 2)" />
  <gamegenie code="ZUSSTSPP" description="50 Magnum Bullets allowed (1 of 2)" />
  <gamegenie code="ZUVIZSPP" description="50 Magnum Bullets allowed (2 of 2)" />
  <gamegenie code="PANSGIIA" description="Start with 1 life" />
  <gamegenie code="ZANSGIIE" description="Start with 10 lives" />
</game>
<game code="CLV-H-NANMR" name="Donkey Kong 3" crc="B3D74C0D">
  <gamegenie code="AVVGELEY" description="Invincibility" />
  <gamegenie code="SZNKOPVI" description="Start with infinite lives" />
  <gamegenie code="PEEGITLA" description="Start with 1 life" />
  <gamegenie code="PEEGITLE" description="Start with 9 lives" />
  <gamegenie code="ZEKKGYEE" description="Reduce the time for pros" />
  <gamegenie code="ZAOSZAPA" description="Normal spray more powerful" />
  <gamegenie code="ZLOSLAAA" description="Normal spray longer" />
  <gamegenie code="AASSYPPA" description="Spray cuts through baddies" />
  <gamegenie code="AAKVZALL" description="Normal bees explode" />
  <gamegenie code="TEXKVGLA" description="Speeding Stanley" />
</game>
<game code="CLV-H-JWIVC" name="Donkey Kong Jr. Math" crc="0504B007">
  <gamegenie code="AAKILSZA" description="Always answer correctly (1 of 2)" />
  <gamegenie code="AAUILSZP" description="Always answer correctly (2 of 2)" />
</game>
<game code="CLV-H-ZKJBP" name="Double Dare" crc="2B378D11">
  <gamegenie code="SXXANUVK" description="Infinite time to answer questions" />
</game>
<game code="CLV-H-OOCPH" name="Double Dragon" crc="0F1CC048">
  <gamegenie code="EEUTLZZE" description="Infinite lives" />
  <gamegenie code="AEUTLZZA" description="Start with 1 life" />
  <gamegenie code="IEUTLZZA" description="Start with 6 lives" />
  <gamegenie code="AEUTLZZE" description="Start with 9 lives" />
  <gamegenie code="VKKYXLVT" description="Gain hearts quickly" />
  <gamegenie code="EKINNL" description="Gain a heart every time you hit an enemy" />
  <gamegenie code="XTKNXEZK" description="More health - P2 or computer" />
  <gamegenie code="XTKYOEZK" description="More health - P1" />
  <gamegenie code="IIIOOO" description="No enemies" />
  <gamegenie code="IIIEOO" description="Enemies will not fight back" />
  <gamegenie code="KOTKOK" description="Slow motion" />
  <gamegenie code="AAUNYLPA" description="Infinite time" />
  <gamegenie code="AZUYZLAL" description="Timer will count down faster" />
  <gamegenie code="APUYZLAL" description="Timer will count down super-fast" />
  <gamegenie code="NYZSIU" description="Disable level 4 wall trap" />
</game>
<game code="CLV-H-OKFWV" name="Double Dragon III: The Sacred Stones" crc="50FD0CC6">
  <gamegenie code="SZUUPAAX" description="Infinite health - Bill, Jimmy and Chin" />
  <gamegenie code="NNEPXGGS" description="Start with 255 health - Billy and Jimmy" />
  <gamegenie code="NNEONGGV" description="Start with 255 health - Chin" />
  <gamegenie code="NNEOXKZK" description="Start with 255 health - Ranzou" />
  <gamegenie code="GVEPXGGI" description="More health - Billy and Jimmy" />
  <gamegenie code="GVEOXKZG" description="More health - Ranzou" />
  <gamegenie code="ZXEPXGGS" description="Less health - Billy and Jimmy" />
  <gamegenie code="IXEOXKZG" description="Less health - Ranzou" />
  <gamegenie code="ZUEONGGT" description="Less health - Chin" />
  <gamegenie code="OZVLGASX" description="More powerful punch, weapon and high kick" />
  <gamegenie code="LVOPKGIA" description="Start with 99 weapon use - Billy, Jimmy and Chin" />
  <gamegenie code="AAELIGPA" description="Infinite special weapons - everyone (1 of 2)" />
  <gamegenie code="GZXUPUVS" description="Infinite special weapons - everyone (2 of 2)" />
  <gamegenie code="AEULUKYA" description="Start with Chin enabled" />
  <gamegenie code="AEKLVKAA" description="Start with Ranzou enabled" />
  <gamegenie code="AEKNPPIA" description="Start with Jimmy enabled" />
</game>
<game code="CLV-H-LNPYO" name="Double Dribble" crc="D0E96F6B">
  <gamegenie code="KNEKPKEY" description="CPU scores add to your score" />
  <gamegenie code="KNEKPKEN" description="CPU never scores" />
</game>
<game code="CLV-H-XIAEA" name="Dr. Chaos" crc="73620901">
  <gamegenie code="GXKIKIST" description="Infinite life" />
  <gamegenie code="LTKKVPZL" description="Start with 99 life" />
  <gamegenie code="PPKKVPZU" description="Start with 25 life" />
  <gamegenie code="AEEGUZLE" description="Mega-jump" />
  <gamegenie code="AKSSKIGP" description="More invincibility time" />
  <gamegenie code="GESSKIGP" description="Less invincibility time" />
  <gamegenie code="GZEYEEVK" description="Infinite Gun ammo on pick-up" />
  <gamegenie code="OVKIKISV" description="Take minimal damage (1 of 2)" />
  <gamegenie code="PEKISIGY" description="Take minimal damage (2 of 2)" />
  <gamegenie code="TVOSSITG" description="Take more damage and Shield Suit has no effect (1 of 2)" />
  <gamegenie code="AEOSKIYA" description="Take more damage and Shield Suit has no effect (2 of 2)" />
  <gamegenie code="PASKSPAA" description="Start with Shield Suit (1 of 2)" />
  <gamegenie code="ZISKNPLG" description="Start with Shield Suit (2 of 2)" />
</game>
<game code="CLV-H-GXSFN" name="Dr. Jekyll and Mr. Hyde" crc="4D3FBA78">
  <gamegenie code="GZXVTKVK" description="Infinite life (1 of 2)" />
  <gamegenie code="GZXTTSVK" description="Infinite life (2 of 2)" />
  <gamegenie code="KENLKVSE" description="Start with 16 coins" />
  <gamegenie code="GXNLKVSE" description="Keep coins from previous games" />
  <gamegenie code="NXNSZEOO" description="Instant game restart" />
  <gamegenie code="NKNGVYUK" description="Multi-jump (1 of 6)" />
  <gamegenie code="PXNKENOK" description="Multi-jump (2 of 6)" />
  <gamegenie code="PENKOYGA" description="Multi-jump (3 of 6)" />
  <gamegenie code="ENNKXYEI" description="Multi-jump (4 of 6)" />
  <gamegenie code="PENKSYAA" description="Multi-jump (5 of 6)" />
  <gamegenie code="OUNKNYUK" description="Multi-jump (6 of 6)" />
</game>
<game code="CLV-H-BCRII" name="Dragon Fighter" crc="A166548F">
  <gamegenie code="EYEVAIEI" description="Invincibility" />
  <gamegenie code="AESSILPA" description="Invincible to spikes" />
  <gamegenie code="SZSVGISA" description="Infinite health" />
  <gamegenie code="KAUIEGSZ" description="Max Dragon energy" />
  <gamegenie code="YYXSYZAE" description="Always shoot special" />
</game>
<game code="CLV-H-ZAFSL" name="Dragon Power" crc="811F06D9">
  <gamegenie code="SZVOSZVG" description="Infinite health (POW)" />
  <gamegenie code="EAXAILGT" description="Start with 128 health (POW)" />
  <gamegenie code="KAOETLSA" description="Start with 24 Wind Waves (turtle shells) (hold B then press A)" />
</game>
<game code="CLV-H-ZIXHW" name="Dragon Spirit: The New Legend" crc="D7E29C03">
  <gamegenie code="EXAXEU" description="Invincibility and three heads after one hit (blinking)" />
  <gamegenie code="OZVZOZVG" description="Infinite health" />
  <gamegenie code="OXNLEIES" description="Hit anywhere (1 of 2)" />
  <gamegenie code="OXXLOIES" description="Hit anywhere (2 of 2)" />
  <gamegenie code="VEOIKAKA" description="Always gold dragon mode" />
  <gamegenie code="KXOIKAKA" description="Always blue dragon mode" />
</game>
<game code="CLV-H-GMWYY" name="Dragon Warrior" crc="2545214C">
  <gamegenie code="SXOIVLSA" description="Infinite Magic Power" />
  <gamegenie code="AEVGUIZA" description="Take no damage in swamp" />
  <gamegenie code="VVOYYTSA" description="Start with 256 gold coins" />
  <gamegenie code="VKOIVLSA" description="All spells use only one magic point" />
  <gamegenie code="YAKKEVYA" description="Barriers cause half usual damage" />
</game>
<game code="CLV-H-IMGWJ" name="Dragon Warrior II" crc="8C5A784E">
  <gamegenie code="ASUZYTEP" description="One hit kills" />
  <gamegenie code="ZUKLUSGP" description="Prince of Midenhall - Start with 50 HP" />
  <gamegenie code="LVKLUSGP" description="Prince of Midenhall - Start with 99 HP" />
  <gamegenie code="AXKLOIIE" description="Prince of Midenhall - Start with 40 strength points" />
  <gamegenie code="ASKLOIIA" description="Prince of Midenhall - Start with 80 strength points" />
  <gamegenie code="AXKLXIGE" description="Prince of Midenhall - Start with 40 agility points" />
  <gamegenie code="ASKLXIGA" description="Prince of Midenhall - Start with 80 agility points" />
  <gamegenie code="ZUKLNSYP" description="Prince of Cannock - Start with 50 HP" />
  <gamegenie code="LVKLNSYP" description="Prince of Cannock - Start with 99 HP" />
  <gamegenie code="AXKLSIGE" description="Prince of Cannock - Start with 40 strength points" />
  <gamegenie code="GUKLSIGE" description="Prince of Cannock - Start with 60 strength points" />
  <gamegenie code="TOKLVIGE" description="Prince of Cannock - Start with 30 agility points" />
  <gamegenie code="GUKLVIGE" description="Prince of Cannock - Start with 60 agility points" />
  <gamegenie code="AXKUEITE" description="Prince of Cannock - Start with 40 magic points" />
  <gamegenie code="GUKUEITE" description="Prince of Cannock - Start with 60 magic points" />
  <gamegenie code="ZUKUUIAZ" description="Princess of Moonbrooke - Start with 50 HP" />
  <gamegenie code="LVKUUIAZ" description="Princess of Moonbrooke - Start with 99 HP" />
  <gamegenie code="POKUOIZE" description="Princess of Moonbrooke - Start with 25 strength points" />
  <gamegenie code="ZUKUOIZA" description="Princess of Moonbrooke - Start with 50 strength points" />
  <gamegenie code="AXKUXITO" description="Princess of Moonbrooke - Start with 40 agility points" />
  <gamegenie code="AXKUKSGO" description="Princess of Moonbrooke - Start with 40 magic points" />
</game>
<game code="CLV-H-WEOMQ" name="Dragon Warrior III" crc="A86A5318">
  <gamegenie code="NYUOYPZU" description="King gives 255 gold" />
  <gamegenie code="PASPZPAA" description="King gives mega-gold" />
  <gamegenie code="YTVUGZYE" description="Player starts with increased strength and/or attack power" />
  <gamegenie code="VYVUGZYE" description="Player starts with greatly increased strength and/or attack power" />
  <gamegenie code="LTNLPZIA" description="Player starts with increased agility and/or defense" />
  <gamegenie code="NYNLPZIE" description="Player starts with greatly increased agility and/or defense" />
  <gamegenie code="LTNLTZYA" description="Player starts with increased vitality and/or HP" />
  <gamegenie code="NYNLTZYE" description="Player starts with greatly increased vitality and/or HP" />
  <gamegenie code="LTNULZTA" description="Player starts with increased magic, maximum magic points and/or intelligence" />
  <gamegenie code="NYNULZTE" description="Player starts with greatly increased magic, maximum magic points and/or intelligence" />
  <gamegenie code="ZVELAZGA" description="Player starts with increased luck" />
  <gamegenie code="VNELAZGE" description="Player starts with greatly increased luck" />
  <gamegenie code="LTVUIZPA" description="Wizard starts with increased strength and/or attack power" />
  <gamegenie code="VYVUIZPE" description="Wizard starts with greatly increased strength and/or attack power" />
  <gamegenie code="ZTNLZZGA" description="Wizard starts with increased agility and/or defense" />
  <gamegenie code="NYNLZZGE" description="Wizard starts with greatly increased agility and/or defense" />
  <gamegenie code="ZTNLYZZA" description="Wizard starts with increased vitality and/or maximum HP" />
  <gamegenie code="OPNLYZZE" description="Wizard starts with greatly increased vitality and/or maximum HP" />
  <gamegenie code="LTNUGXPA" description="Wizard starts with increased magic, intelligence and/or maximum magic" />
  <gamegenie code="LVELPZZA" description="Wizard starts with increased luck" />
  <gamegenie code="VNELPZZE" description="Wizard starts with greatly increased luck" />
  <gamegenie code="ZTVUTZLA" description="Pilgrim starts with increased strength and/or attack power" />
  <gamegenie code="VYVUTZLE" description="Pilgrim starts with greatly increased strength and/or attack power" />
  <gamegenie code="ZTNLLZGA" description="Pilgrim starts with increased agility and/or defense" />
  <gamegenie code="LTNUAZLA" description="Pilgrim starts with increased vitality and/or maximum HP" />
  <gamegenie code="VYNUAZLE" description="Pilgrim starts with greatly increased vitality and/or maximum HP" />
  <gamegenie code="LTNUIXAA" description="Pilgrim starts with increased magic and/or intelligence" />
  <gamegenie code="VYNUIXAE" description="Pilgrim starts with greatly increased magic and/or intelligence" />
  <gamegenie code="ZVELZZLA" description="Pilgrim starts with increased luck" />
  <gamegenie code="VNELZZLE" description="Pilgrim starts with greatly increased luck" />
  <gamegenie code="LTNLAXPA" description="Soldier starts with increased strength and/or attack power" />
  <gamegenie code="VYNLAXPE" description="Soldier starts with greatly increased strength and/or attack power" />
  <gamegenie code="ZTNLIZZA" description="Soldier starts with increased agility and/or defense" />
  <gamegenie code="LTNUZZYA" description="Soldier starts with increased vitality and/or maximum HP" />
  <gamegenie code="IAOZENNY" description="Start with 6 battle-axes" />
  <gamegenie code="TAOZENNY" description="Start with 6 broadswords" />
  <gamegenie code="YAOZENNY" description="Start with 6 wizard's wands" />
  <gamegenie code="YAOZENNN" description="Start with 6 demon's axes" />
  <gamegenie code="GPOZENNY" description="Start with 6 multi-edge swords" />
  <gamegenie code="IPOZENNY" description="Start with 6 staffs of force" />
  <gamegenie code="TPOZENNY" description="Start with 6 swords of illusion" />
  <gamegenie code="APOZENNN" description="Start with 6 falcon swords" />
  <gamegenie code="AZOZENNN" description="Start with 6 armor of radiance" />
</game>
<game code="CLV-H-DALWM" name="Dragon Warrior IV" crc="506E259D">
  <gamegenie code="ATVATGSL" description="No damage and lose no MP - all members. Don't combine any of the start with items codes" />
  <gamegenie code="POSOAPZU" description="Chapter 1 - Start with 25 gold" />
  <gamegenie code="GVSOAPZL" description="Chapter 1 - Start with 100 gold" />
  <gamegenie code="NNSOAPZU" description="Chapter 1 - Start with 255 gold" />
  <gamegenie code="AIXOZAYS" description="Chapter 1 - Start with lots 'o gold" />
  <gamegenie code="YEEXYXLO" description="Chapter 1 - Start with 15 HP" />
  <gamegenie code="GVEXYXLP" description="Chapter 1 - Start with 100 HP" />
  <gamegenie code="NNEXYXLO" description="Chapter 1 - Start with 255 HP" />
  <gamegenie code="LNKPLONY" description="Chapter 1 - Start with final key" />
  <gamegenie code="TEKPLONN" description="Chapter 1 - Start with metal babble sword" />
  <gamegenie code="LOKPLONY" description="Chapter 1 - Start with multi-edge sword" />
  <gamegenie code="PEKPLONN" description="Chapter 1 - Start with thorn whip" />
  <gamegenie code="AKKPLONY" description="Chapter 1 - Start with shield of strength" />
  <gamegenie code="LKKPLONY" description="Chapter 1 - Start with dragon shield" />
  <gamegenie code="LNKPLONY" description="Chapter 1 - Start with final key and chain sickle (1 of 2)" />
  <gamegenie code="GEKPGONY" description="Chapter 1 - Start with final key and chain sickle (2 of 2)" />
  <gamegenie code="TEKPLONN" description="Chapter 1 - Start with metal babble sword and boomerang (1 of 2)" />
  <gamegenie code="LEKPGONN" description="Chapter 1 - Start with metal babble sword and boomerang (2 of 2)" />
  <gamegenie code="LOKPLONY" description="Chapter 1 - Start with multi-edge sword and wizard's ring (1 of 2)" />
  <gamegenie code="PSKPGONN" description="Chapter 1 - Start with multi-edge sword and wizard's ring (2 of 2)" />
  <gamegenie code="PEKPLONN" description="Chapter 1 - Start with thorn whip and demon hammer (1 of 2)" />
  <gamegenie code="ZOKPGONY" description="Chapter 1 - Start with thorn whip and demon hammer (2 of 2)" />
  <gamegenie code="AKKPLONY" description="Chapter 1 - Start with shield of strength and meteorite armband (1 of 2)" />
  <gamegenie code="ASKPGONY" description="Chapter 1 - Start with shield of strength and meteorite armband (2 of 2)" />
  <gamegenie code="LKKPLONY" description="Chapter 1 - Start with dragon shield and iron fan (1 of 2)" />
  <gamegenie code="IEKPGONN" description="Chapter 1 - Start with dragon shield and iron fan (2 of 2)" />
  <gamegenie code="ZUSOPPGT" description="Chapter 2 - Start with 50 gold" />
  <gamegenie code="NNSOPPGV" description="Chapter 2 - Start with 255 gold" />
  <gamegenie code="AIXOZAYS" description="Chapter 2 - Start with lots of gold" />
  <gamegenie code="GVOZAZAP" description="Chapter 2, Alena - Start with 100 HP" />
  <gamegenie code="NNOZAZAO" description="Chapter 2, Alena - Start with 255 HP" />
  <gamegenie code="LNKOZONY" description="Chapter 2, Alena - Start with final key" />
  <gamegenie code="ZOKOZONN" description="Chapter 2, Alena - Start with fire claw" />
  <gamegenie code="LOKOZONY" description="Chapter 2, Alena - Start with multi-edge sword" />
  <gamegenie code="PEKOZONN" description="Chapter 2, Alena - Start with thorn whip" />
  <gamegenie code="LEKOLONN" description="Chapter 2, Alena - Start with boomerang" />
  <gamegenie code="LNKOZONY" description="Chapter 2, Alena - Start with final key and fire claw (1 of 2)" />
  <gamegenie code="ZOKOLONN" description="Chapter 2, Alena - Start with final key and fire claw (2 of 2)" />
  <gamegenie code="LOKOZONY" description="Chapter 2, Alena - Start with multi-edge sword and wizard's ring (1 of 2)" />
  <gamegenie code="PSKOLONN" description="Chapter 2, Alena - Start with multi-edge sword and wizard's ring (2 of 2)" />
  <gamegenie code="PEKOZONN" description="Chapter 2, Alena - Start with thorn whip and demon hammer (1 of 2)" />
  <gamegenie code="ZOKOLONY" description="Chapter 2, Alena - Start with thorn whip and demon hammer (2 of 2)" />
  <gamegenie code="AKKOZONY" description="Chapter 2, Alena - Start with shield of strength and meteorite arm band (1 of 2)" />
  <gamegenie code="ASKOLONY" description="Chapter 2, Alena - Start with shield of strength and meteorite arm band (2 of 2)" />
  <gamegenie code="LKKOZONY" description="Chapter 2, Alena - Start with dragon shield and iron fan (1 of 2)" />
  <gamegenie code="IEKOLONN" description="Chapter 2, Alena - Start with dragon shield and iron fan (2 of 2)" />
  <gamegenie code="LNUPLONY" description="Chapter 2, Brey - Start with final key" />
  <gamegenie code="TOUPLONN" description="Chapter 2, Brey - Start with magma staff" />
  <gamegenie code="LOUPLONY" description="Chapter 2, Brey - Start with multi-edge sword" />
  <gamegenie code="PEUPLONN" description="Chapter 2, Brey - Start with thorn whip" />
  <gamegenie code="AKUPLONY" description="Chapter 2, Brey - Start with shield of strength" />
  <gamegenie code="LKUPLONY" description="Chapter 2, Brey - Start with dragon shield" />
  <gamegenie code="LEUPGONN" description="Chapter 2, Brey - Start with boomerang" />
  <gamegenie code="LNUPLONY" description="Chapter 2, Brey - Start with final key and magma staff (1 of 2)" />
  <gamegenie code="TOUPGONN" description="Chapter 2, Brey - Start with final key and magma staff (2 of 2)" />
  <gamegenie code="LOUPLONY" description="Chapter 2, Brey - Start with multi-edge sword and wizard's ring (1 of 2)" />
  <gamegenie code="PSUPGONN" description="Chapter 2, Brey - Start with multi-edge sword and wizard's ring (2 of 2)" />
  <gamegenie code="PEUPLONN" description="Chapter 2, Brey - Start with thorn whip and demon hammer (1 of 2)" />
  <gamegenie code="ZOUPGONY" description="Chapter 2, Brey - Start with thorn whip and demon hammer (2 of 2)" />
  <gamegenie code="AKUPLONY" description="Chapter 2, Brey - Start with shield of strength and meteorite arm band (1 of 2)" />
  <gamegenie code="ASUPGONY" description="Chapter 2, Brey - Start with shield of strength and meteorite arm band (2 of 2)" />
  <gamegenie code="LKUPLONY" description="Chapter 2, Brey - Start with dragon shield and iron fan (1 of 2)" />
  <gamegenie code="IEUPGONN" description="Chapter 2, Brey - Start with dragon shield and iron fan (2 of 2)" />
  <gamegenie code="LNOOLONY" description="Chapter 2, Cristo - Start with final key" />
  <gamegenie code="TEOOLONN" description="Chapter 2, Cristo - Start with metal babble sword" />
  <gamegenie code="LOOOLONY" description="Chapter 2, Cristo - Start with multi-edge sword" />
  <gamegenie code="PEOOLONN" description="Chapter 2, Cristo - Start with thorn whip" />
  <gamegenie code="AKOOLONY" description="Chapter 2, Cristo - Start with shield of strength" />
  <gamegenie code="LKOOLONY" description="Chapter 2, Cristo - Start with dragon shield" />
  <gamegenie code="LNOOLONY" description="Chapter 2, Cristo - Start with final key and chain sickle (1 of 2)" />
  <gamegenie code="GEOOGONY" description="Chapter 2, Cristo - Start with final key and chain sickle (2 of 2)" />
  <gamegenie code="TEOOLONN" description="Chapter 2, Cristo - Start with metal babble sword and boomerang (1 of 2)" />
  <gamegenie code="LEOOGONN" description="Chapter 2, Cristo - Start with metal babble sword and boomerang (2 of 2)" />
  <gamegenie code="LOOOLONY" description="Chapter 2, Cristo - Start with multi-edge sword and wizard's ring (1 of 2)" />
  <gamegenie code="PSOOGONN" description="Chapter 2, Cristo - Start with multi-edge sword and wizard's ring (2 of 2)" />
  <gamegenie code="PEOOLONN" description="Chapter 2, Cristo - Start with thorn whip and demon hammer (1 of 2)" />
  <gamegenie code="ZOOOGONY" description="Chapter 2, Cristo - Start with thorn whip and demon hammer (2 of 2)" />
  <gamegenie code="AKOOLONY" description="Chapter 2, Cristo - Start with shield of strength and meteorite arm band (1 of 2)" />
  <gamegenie code="ASOOGONY" description="Chapter 2, Cristo - Start with shield of strength and meteorite arm band (2 of 2)" />
  <gamegenie code="LKOOLONY" description="Chapter 2, Cristo - Start with dragon shield and iron fan (1 of 2)" />
  <gamegenie code="IEOOGONN" description="Chapter 2, Cristo - Start with dragon shield and iron fan (2 of 2)" />
  <gamegenie code="AOEXTZGP" description="Chapter 3 - Start with 16 HP" />
  <gamegenie code="GVEXTZGP" description="Chapter 3 - Start with 100 HP" />
  <gamegenie code="NNEXTZGO" description="Chapter 3 - Start with 255 HP" />
  <gamegenie code="GVSOZPAA" description="Chapter 3 - Start with 100 gold" />
  <gamegenie code="NNSOZPAE" description="Chapter 3 - Start with 255 gold" />
  <gamegenie code="UNUOLONY" description="Chapter 3 - Start with final key" />
  <gamegenie code="LEUOLONN" description="Chapter 3 - Start with metal babble sword" />
  <gamegenie code="TOUOLONY" description="Chapter 3 - Start with multi-edge sword" />
  <gamegenie code="LEUOLONN" description="Chapter 3 - Start with thorn whip" />
  <gamegenie code="PKUOLONY" description="Chapter 3 - Start with shield of strength" />
  <gamegenie code="AKUOLONY" description="Chapter 3 - Start with dragon shield" />
  <gamegenie code="LNUOLONY" description="Chapter 3 - Start with final key and chain sickle (1 of 2)" />
  <gamegenie code="GEUOGONY" description="Chapter 3 - Start with final key and chain sickle (2 of 2)" />
  <gamegenie code="TEUOLONN" description="Chapter 3 - Start with metal babble sword and boomerang (1 of 2)" />
  <gamegenie code="LEUOGONN" description="Chapter 3 - Start with metal babble sword and boomerang (2 of 2)" />
  <gamegenie code="LOUOLONY" description="Chapter 3 - Start with multi-edge sword and wizard's ring (1 of 2)" />
  <gamegenie code="PSUOGONN" description="Chapter 3 - Start with multi-edge sword and wizard's ring (2 of 2)" />
  <gamegenie code="PEUOLONN" description="Chapter 3 - Start with thorn whip and demon hammer (1 of 2)" />
  <gamegenie code="ZOUOGONY" description="Chapter 3 - Start with thorn whip and demon hammer (2 of 2)" />
  <gamegenie code="AKUOLONY" description="Chapter 3 - Start with shield of strength and meteorite arm band (1 of 2)" />
  <gamegenie code="ASUOGONY" description="Chapter 3 - Start with shield of strength and meteorite arm band (2 of 2)" />
  <gamegenie code="LKUOLONY" description="Chapter 3 - Start with dragon shield and iron fan (1 of 2)" />
  <gamegenie code="IEUOGONN" description="Chapter 3 - Start with dragon shield and iron fan (2 of 2)" />
  <gamegenie code="GVEXLZZP" description="Chapter 4, Nara - Starts with 100 HP" />
  <gamegenie code="NNEXLZZO" description="Chapter 4, Nara - Starts with 255 HP" />
  <gamegenie code="LNXPLONY" description="Chapter 4, Nara - Start with final key" />
  <gamegenie code="TEXPLONN" description="Chapter 4, Nara - Start with metal babble sword" />
  <gamegenie code="LOXPLONY" description="Chapter 4, Nara - Start with multi-edge sword" />
  <gamegenie code="PEXPLONN" description="Chapter 4, Nara - Start with thorn whip" />
  <gamegenie code="AKXPLONY" description="Chapter 4, Nara - Start with shield of strength" />
  <gamegenie code="LKXPLONY" description="Chapter 4, Nara - Start with dragon shield" />
  <gamegenie code="LNXPLONY" description="Chapter 4, Nara - Start with final key and chain sickle (1 of 2)" />
  <gamegenie code="GEXPGONY" description="Chapter 4, Nara - Start with final key and chain sickle (2 of 2)" />
  <gamegenie code="TEXPLONN" description="Chapter 4, Nara - Start with metal babble sword and boomerang (1 of 2)" />
  <gamegenie code="LEXPGONN" description="Chapter 4, Nara - Start with metal babble sword and boomerang (2 of 2)" />
  <gamegenie code="LOXPLONY" description="Chapter 4, Nara - Start with multi-edge sword and wizard's ring (1 of 2)" />
  <gamegenie code="PSXPGONN" description="Chapter 4, Nara - Start with multi-edge sword and wizard's ring (2 of 2)" />
  <gamegenie code="PEXPLONN" description="Chapter 4, Nara - Start with thorn whip and demon hammer (1 of 2)" />
  <gamegenie code="ZOXPGONY" description="Chapter 4, Nara - Start with thorn whip and demon hammer (2 of 2)" />
  <gamegenie code="AKXPLONY" description="Chapter 4, Nara - Start with shield of strength and meteorite arm band (1 of 2)" />
  <gamegenie code="ASXPGONY" description="Chapter 4, Nara - Start with shield of strength and meteorite arm band (2 of 2)" />
  <gamegenie code="LKXPLONY" description="Chapter 4, Nara - Start with dragon shield and iron fan (1 of 2)" />
  <gamegenie code="IEXPGONN" description="Chapter 4, Nara - Start with dragon shield and iron fan (2 of 2)" />
  <gamegenie code="GVEXGZAP" description="Chapter 4, Mara - Starts with 100 HP" />
  <gamegenie code="NNEXGZAO" description="Chapter 4, Mara - Starts with 255 HP" />
  <gamegenie code="LNXOPONY" description="Chapter 4, Mara - Start with final key" />
  <gamegenie code="TOXOPONN" description="Chapter 4, Mara - Start with magma staff" />
  <gamegenie code="LOXOPONY" description="Chapter 4, Mara - Start with multi-edge sword" />
  <gamegenie code="PEXOPONN" description="Chapter 4, Mara - Start with thorn whip" />
  <gamegenie code="AKXOPONY" description="Chapter 4, Mara - Start with shield of strength" />
  <gamegenie code="LKXOPONY" description="Chapter 4, Mara - Start with dragon shield" />
  <gamegenie code="LNXOPONY" description="Chapter 4, Mara - Start with final key and chain sickle (1 of 2)" />
  <gamegenie code="GEXOZONY" description="Chapter 4, Mara - Start with final key and chain sickle (2 of 2)" />
  <gamegenie code="TEXOPONN" description="Chapter 4, Mara - Start with metal babble sword and boomerang (1 of 2)" />
  <gamegenie code="LEXOZONN" description="Chapter 4, Mara - Start with metal babble sword and boomerang (2 of 2)" />
  <gamegenie code="LOXOPONY" description="Chapter 4, Mara - Start with multi-edge sword and wizard's ring (1 of 2)" />
  <gamegenie code="PSXOZONN" description="Chapter 4, Mara - Start with multi-edge sword and wizard's ring (2 of 2)" />
  <gamegenie code="PEXOPONN" description="Chapter 4, Mara - Start with thorn whip and demon hammer (1 of 2)" />
  <gamegenie code="ZOXOZONY" description="Chapter 4, Mara - Start with thorn whip and demon hammer (2 of 2)" />
  <gamegenie code="AKXOPONY" description="Chapter 4, Mara - Start with shield of strength and meteorite arm band (1 of 2)" />
  <gamegenie code="ASXOZONY" description="Chapter 4, Mara - Start with shield of strength and meteorite arm band (2 of 2)" />
  <gamegenie code="LKXOPONY" description="Chapter 4, Mara - Start with dragon shield and iron fan (1 of 2)" />
  <gamegenie code="IEXOZONN" description="Chapter 4, Mara - Start with dragon shield and iron fan (2 of 2)" />
  <gamegenie code="LNOPIONY" description="Chapter 5 - Start with final key" />
  <gamegenie code="PXOPIONY" description="Chapter 5 - Start with zenithian sword" />
  <gamegenie code="GKOPIONY" description="Chapter 5 - Start with zenithian shield" />
  <gamegenie code="YUOPIONY" description="Chapter 5 - Start with zenithian armor" />
  <gamegenie code="LKOPIONN" description="Chapter 5 - Start with zenithian helmet" />
</game>
<game code="CLV-H-UZACI" name="Dragon's Lair" crc="CA033B3A">
  <gamegenie code="AEXSGEKY" description="Infinite E (health)" />
  <gamegenie code="AAXITVNY" description="Infinite lives" />
  <gamegenie code="IAVNPYAP" description="Less energy gained on pick-up" />
  <gamegenie code="YZVNPYAP" description="More energy gained on pick-up" />
  <gamegenie code="SXKYUOVK" description="Infinite Candle energy (1 of 2)" />
  <gamegenie code="SXVYXOVK" description="Infinite Candle energy (2 of 2)" />
  <gamegenie code="NNXSGSUY" description="Start with 1 extra life" />
  <gamegenie code="KNXSGSUN" description="Start with 6 extra lives" />
  <gamegenie code="NNXSGSUN" description="Start with 9 extra lives" />
  <gamegenie code="PEUIGIAA" description="Start with Axe" />
  <gamegenie code="ZEUIGIAA" description="Start with Fireball" />
  <gamegenie code="PANSZIAA" description="Start on level 2" />
  <gamegenie code="ZANSZIAA" description="Start on level 3" />
  <gamegenie code="LANSZIAA" description="Start on level 4" />
</game>
<game code="CLV-H-JLKBN" name="DuckTales, Disney's" crc="EFB09075">
  <gamegenie code="EISVZLEY" description="Invincibility (1 of 2)" />
  <gamegenie code="EIEEGAEY" description="Invincibility (2 of 2)" />
  <gamegenie code="ATVVXLEZ" description="Infinite health" />
  <gamegenie code="AANVSLPA" description="Infinite health (alt)" />
  <gamegenie code="SXUIEKVK" description="Infinite lives" />
  <gamegenie code="AAESULZA" description="Start with 1 life" />
  <gamegenie code="IAESULZA" description="Start with 6 lives" />
  <gamegenie code="AAESULZE" description="Start with 9 lives" />
  <gamegenie code="LAVTNLPA" description="Lose half normal health (in easy game)" />
  <gamegenie code="OVUVAZSV" description="Infinite time" />
  <gamegenie code="ZAXSKLIE" description="Double usual time (1 of 3)" />
  <gamegenie code="SXNIUKOU" description="Double usual time (2 of 3)" />
  <gamegenie code="SZNISESU" description="Double usual time (3 of 3)" />
  <gamegenie code="EUOTYULU" description="Multi-jump (1 of 5)" />
  <gamegenie code="UVXVALVT" description="Multi-jump (2 of 5)" />
  <gamegenie code="AOUVILEY" description="Multi-jump (3 of 5)" />
  <gamegenie code="NAETLKLL" description="Multi-jump (4 of 5)" />
  <gamegenie code="GXOTPTEY" description="Multi-jump (5 of 5)" />
  <gamegenie code="ZEOVYGPA" description="Walk 2x faster" />
  <gamegenie code="GEOVYGPA" description="Walk 4x faster" />
</game>
<game code="CLV-H-ABZZG" name="DuckTales 2, Disney's" crc="73C7FCF4">
  <gamegenie code="ESOTVAEY" description="Invincibility" />
  <gamegenie code="SZONTZSA" description="Infinite health" />
  <gamegenie code="GZXGZGVG" description="Infinite lives" />
  <gamegenie code="SGXGZGVG" description="Infinite lives (alt)" />
  <gamegenie code="ENVVIPNP" description="Multi-jump (1 of 4)" />
  <gamegenie code="PXVVPOVP" description="Multi-jump (2 of 4)" />
  <gamegenie code="XOVVTPXT" description="Multi-jump (3 of 4)" />
  <gamegenie code="ZKVVGOGK" description="Multi-jump (4 of 4)" />
  <gamegenie code="APONPXAA" description="Take more damage" />
  <gamegenie code="GAONPXAA" description="Take less damage" />
  <gamegenie code="ZAONPXAA" description="Take very little damage" />
  <gamegenie code="PAXSPZAA" description="Have lots of money" />
  <gamegenie code="IEKSPLPA" description="$5,000 cash from small diamonds" />
  <gamegenie code="PEKSPLPE" description="$9,000 cash from small diamonds" />
  <gamegenie code="ASNKPAAL" description="Start with full energy" />
  <gamegenie code="AONKPAAL" description="Start with a lot less energy" />
  <gamegenie code="AAEKAPZA" description="Start with 1 life" />
  <gamegenie code="IAEKAPZA" description="Start with 6 lives" />
  <gamegenie code="AAEKAPZE" description="Start with 9 lives" />
</game>
<game code="CLV-H-UGFAK" name="Dudes with Attitude" crc="BD29178A">
  <gamegenie code="SLUSSIVI" description="Infinite energy" />
  <gamegenie code="SZUSIYVG" description="Infinite time" />
</game>
<game code="CLV-H-ZPUHA" name="Dungeon Magic: Sword of the Elements" crc="23C3FB2D">
  <gamegenie code="SXVLTLSA" description="Take no damage except from scorpions" />
  <gamegenie code="GTKIITAA" description="Start with 100 gold pieces" />
  <gamegenie code="OVVLGLSV" description="Take less damage (1 of 2)" />
  <gamegenie code="ZEVLIUYL" description="Take less damage (2 of 2)" />
  <gamegenie code="ZAKIITAA" description="Start with 512 gold pieces (1 of 2)" />
  <gamegenie code="PGKSGTAG" description="Start with 512 gold pieces (2 of 2)" />
  <gamegenie code="PXSTLZPG" description="Stay at the Inn for free (1 of 2)" />
  <gamegenie code="AXSTYZAG" description="Stay at the Inn for free (2 of 2)" />
  <gamegenie code="PXUVXTPG" description="Items at Grocer's shop are free (1 of 2)" />
  <gamegenie code="AXUVVTAG" description="Items at Grocer's shop are free (2 of 2)" />
  <gamegenie code="PXENPLPG" description="Items at Armory are free (1 of 2)" />
  <gamegenie code="AXENILAG" description="Items at Armory are free (2 of 2)" />
</game>
<game code="CLV-H-HKEUW" name="Dynowarz: The Destruction of Spondylus" crc="BDE93999">
  <gamegenie code="ATSIOGSZ" description="No harm from spikes" />
  <gamegenie code="AAVNVPLA" description="No harm from any dinosaur" />
  <gamegenie code="AVNTNKXA" description="Infinite shield" />
  <gamegenie code="TAXGLPPA" description="Start on level 2" />
  <gamegenie code="ZAXGLPPE" description="Start on level 3" />
  <gamegenie code="TAXGLPPE" description="Start on level 4" />
  <gamegenie code="ZPXGLPPA" description="Start on level 5" />
  <gamegenie code="YEXIYLLA" description="Mega-jump power" />
  <gamegenie code="LANSIZPA" description="Speed up left and right" />
  <gamegenie code="PANSAEPX" description="Mostly invincible (1 of 2)" />
  <gamegenie code="GZNITAVG" description="Mostly invincible (2 of 2)" />
</game>
<game code="CLV-H-FWWMI" name="Elevator Action" crc="2AC87283">
  <gamegenie code="GXEUOUVK" description="Infinite lives - P1" />
  <gamegenie code="AAULNLZA" description="Start with 1 life - P1" />
  <gamegenie code="IAULNLZA" description="Start with 6 lives - P1" />
  <gamegenie code="AAULNLZE" description="Start with 9 lives - P1" />
  <gamegenie code="IEVUULZA" description="Start with 6 lives - P2" />
  <gamegenie code="AEVUULZE" description="Starts with 9 lives - P2" />
  <gamegenie code="GASTLPTA" description="Can only shoot one bullet" />
  <gamegenie code="PESIAYLA" description="Slower man (1 of 2)" />
  <gamegenie code="NNUSZNSN" description="Slower man (2 of 2)" />
  <gamegenie code="IESIAYLA" description="Faster man (1 of 2)" />
  <gamegenie code="XNUSZNSN" description="Faster man (2 of 2)" />
  <gamegenie code="ZAVTLOAE" description="Faster bullets (1 of 2)" />
  <gamegenie code="VYVTYOEY" description="Faster bullets (2 of 2)" />
  <gamegenie code="GAVTLOAA" description="Slower bullets (1 of 2)" />
  <gamegenie code="KYVTYOEN" description="Slower bullets (2 of 2)" />
  <gamegenie code="GEONGPZA" description="Faster enemy (1 of 2)" />
  <gamegenie code="XNXNGOVN" description="Faster enemy (2 of 2)" />
  <gamegenie code="PEONGPZA" description="Slower enemy (1 of 2)" />
  <gamegenie code="NNXNGOVN" description="Slower enemy (2 of 2)" />
</game>
<game code="CLV-H-RCVQL" name="Eliminator Boat Duel" crc="059E0CDF">
  <gamegenie code="IZEEZZGA" description="Start with 36 nitros" />
  <gamegenie code="AAEEZZGA" description="Start with 0 nitros" />
  <gamegenie code="SZVSVNVS" description="Almost infinite nitros - no on buoy stage" />
  <gamegenie code="IENEYPPA" description="Boat starts with full turbo, steering, hull, max engine power" />
  <gamegenie code="SXUGOEVS" description="Have full hull strength" />
  <gamegenie code="KAAISZ" description="Computer boat goes crazy" />
</game>
<game code="CLV-H-EXTQP" name="Exodus: Journey to the Promised Land" crc="0AB26DB6">
  <gamegenie code="SZUZKAVI" description="Infinite lives" />
  <gamegenie code="SXNSKIVG" description="Infinite time" />
</game>
<game code="CLV-H-AOQQL" name="F-117a Stealth Fighter" crc="0A7E62D4">
  <gamegenie code="SXXOATSA" description="Invincibility" />
</game>
<game code="CLV-H-QBITH" name="Family Feud, The All New" crc="51BEE3EA">
  <gamegenie code="ZESOGALE" description="10 strikes allowed" />
  <gamegenie code="SXKKESVK" description="Infinite time to answer a question" />
</game>
<game code="CLV-H-JSLDB" name="Fantastic Adventures of Dizzy, The" crc="38FBCC85">
  <gamegenie code="SXVIAAVG" description="Infinite lives" />
  <gamegenie code="PAOAZAZE" description="Start with 10 lives" />
  <gamegenie code="AAVYPXAA" description="Spiders, bats, ants and rats do no damage" />
  <gamegenie code="ZEKYVZGV" description="Start with 10 stars instead of 100" />
  <gamegenie code="YYUZPSTE" description="Play bubble sub-game only" />
  <gamegenie code="TYUZPSTE" description="Play river sub-game only" />
  <gamegenie code="IYUZPSTE" description="Play mine sub-game only" />
  <gamegenie code="ZYUZPSTE" description="Play puzzle sub-game ony" />
</game>
<game code="CLV-H-KCGXV" name="Fantasy Zone" crc="0FFDE258">
  <gamegenie code="OZEVYTVK" description="Infinite lives" />
  <gamegenie code="PAXVOPLA" description="Start with 1 life" />
  <gamegenie code="TAXVOPLA" description="Start with 6 lives" />
  <gamegenie code="PAXVOPLE" description="Start with 9 lives" />
  <gamegenie code="OXETOAVK" description="Keep bought weapon for a life" />
  <gamegenie code="AAOVKTPA" description="Autofire on all weapons" />
  <gamegenie code="PASVYYAA" description="Start on level 2" />
  <gamegenie code="ZASVYYAA" description="Start on level 3" />
  <gamegenie code="LASVYYAA" description="Start on level 4" />
  <gamegenie code="GASVYYAA" description="Start on level 5" />
  <gamegenie code="IASVYYAA" description="Start on level 6" />
  <gamegenie code="TASVYYAA" description="Start on level 7" />
  <gamegenie code="OXETOAVK" description="Keep bought weapon until next shop visit (1 of 2)" />
  <gamegenie code="OGOVATSE" description="Keep bought weapon until next shop visit (2 of 2)" />
</game>
<game code="CLV-H-GDZGB" name="Faria" crc="45F03D2E">
  <gamegenie code="AAVZSPZA" description="Get 250 arrows when buying any amount of arrows" />
  <gamegenie code="SZXGINVK" description="Infinite batteries" />
  <gamegenie code="SXOLYOVK" description="Infinite bombs" />
  <gamegenie code="GXSAASVK" description="Infinite Sede magic" />
  <gamegenie code="GXNEZSVK" description="Infinite Saba magic" />
  <gamegenie code="SAOEGPST" description="Infinite HP (1 of 2)" />
  <gamegenie code="SEUUEAST" description="Infinite HP (2 of 2)" />
  <gamegenie code="GZXXZUSE" description="Don't get charged in shops for items you can afford (1 of 3)" />
  <gamegenie code="GZXXYUSE" description="Don't get charged in shops for items you can afford (2 of 3)" />
  <gamegenie code="GZUZGUSE" description="Don't get charged in shops for items you can afford (3 of 3)" />
</game>
<game code="CLV-H-WLQFF" name="Faxanadu" crc="E71DB268">
  <gamegenie code="GXOGZESV" description="Infinite P (health) (1 of 2)" />
  <gamegenie code="GXOKLESV" description="Infinite P (health) (2 of 2)" />
  <gamegenie code="AEENEZZA" description="Infinite M (magic)" />
  <gamegenie code="SXXNUOSE" description="Infinite Gold (1 of 3)" />
  <gamegenie code="SXUYUOSE" description="Infinite Gold (2 of 3)" />
  <gamegenie code="SXUNUOSE" description="Infinite Gold (3 of 3)" />
  <gamegenie code="AXXSNTAP" description="Start with double P (health)" />
  <gamegenie code="AUXSNTAP" description="Start with triple P (health)" />
  <gamegenie code="IASEPSZA" description="Start with half normal amount of Gold" />
  <gamegenie code="GPSEPSZA" description="Start with double normal amount of Gold" />
  <gamegenie code="AVXVGPSZ" description="Jump in direction you are facing" />
  <gamegenie code="AAUTAEOY" description="Slow mode (1 of 3)" />
  <gamegenie code="AAKTPAKY" description="Slow mode (2 of 3)" />
  <gamegenie code="AAUTZAPA" description="Slow mode (3 of 3)" />
</game>
<game code="CLV-H-YIKPM" name="Felix the Cat" crc="2CAAE01C">
  <gamegenie code="SUNNGNSO" description="Infinite time" />
  <gamegenie code="AEUYKPPA" description="Infinite lives" />
  <gamegenie code="APUGAGZO" description="Start with 9 lives" />
  <gamegenie code="IPUGAGZP" description="Start with 6 lives" />
  <gamegenie code="APUGAGZP" description="Start with 1 life" />
  <gamegenie code="AAEENAZA" description="Hearts can't be replenished from bottles" />
  <gamegenie code="GAEENAZA" description="Bottles replenish more hearts" />
  <gamegenie code="AAEENAZE" description="Bottles replenish even more hearts" />
  <gamegenie code="ZAOSOZPA" description="1 Felix icon gives 2 (1 of 2)" />
  <gamegenie code="APNSOXPO" description="1 Felix icon gives 2 (2 of 2)" />
  <gamegenie code="ELEEATEP" description="No sound effects" />
  <gamegenie code="AONEXTAL" description="Weapon has longer reach" />
  <gamegenie code="AYOIPPEI" description="Walk through walls (1 of 2)" />
  <gamegenie code="AYXSZPEI" description="Walk through walls (2 of 2)" />
</game>
<game code="CLV-H-FXYSL" name="Fester's Quest" crc="B6BF5137">
  <gamegenie code="AYIPOG" description="Invincibility" />
  <gamegenie code="XVEPUKVK" description="Infinite health" />
  <gamegenie code="SZUSYOSE" description="Infinite Money" />
  <gamegenie code="SZNIYOVK" description="Infinite T.N.T on pick-up" />
  <gamegenie code="SXSITEVK" description="Infinite Vice Grips on pick-up" />
  <gamegenie code="SZVVXUVK" description="Infinite Missiles on pick-up" />
  <gamegenie code="SXVSLEVK" description="Infinite Potions on pick-up" />
  <gamegenie code="SZEIYOVK" description="Infinite Invisible Potions on pick-up" />
  <gamegenie code="SXUITEVK" description="Infinite Nooses on pick-up" />
</game>
<game code="CLV-H-GQSNF" name="Fire'n Ice" crc="D534C98E">
  <gamegenie code="AEENYKAA" description="Automatically finish levels" />
</game>
<game code="CLV-H-GRVZC" name="Fire Hawk" crc="1BC686A8">
  <gamegenie code="OZOXOTES" description="Invincibility" />
  <gamegenie code="PAOEPALA" description="Start with 1 life" />
  <gamegenie code="TAOEPALA" description="Start with 6 lives" />
  <gamegenie code="PAOEPALE" description="Start with 9 lives" />
</game>
<game code="CLV-H-VQPSF" name="Fist of the North Star" crc="06D72C83">
  <gamegenie code="SXXGAIAX" description="Invincibility" />
  <gamegenie code="SZSGUGSA" description="Infinite health" />
  <gamegenie code="SXKKYPVG" description="Infinite lives" />
  <gamegenie code="SZSVGTVG" description="Infinite time" />
  <gamegenie code="OTSGOGSV" description="One hit kills you" />
  <gamegenie code="TEELTPPA" description="Sweep kick damages enemies more" />
  <gamegenie code="AEOLGPLE" description="Straight kick damages enemies more" />
  <gamegenie code="AAUKVGGA" description="Can't be knocked back by big thugs" />
  <gamegenie code="EISGUPEY" description="Pogo stick" />
  <gamegenie code="OTSGOGSV" description="Take minimum damage from all enemies (1 of 2)" />
  <gamegenie code="PASGXKOI" description="Take minimum damage from all enemies (2 of 2)" />
  <gamegenie code="OVOUZPSV" description="Any attack mega-damages enemies (1 of 2)" />
  <gamegenie code="ZEOULOOS" description="Any attack mega-damages enemies (2 of 2)" />
  <gamegenie code="PEKKGALA" description="Start with 1 life" />
  <gamegenie code="TEKKGALA" description="Start with 6 lives" />
  <gamegenie code="PEKKGALE" description="Start with 9 lives" />
</game>
<game code="CLV-H-IHJTI" name="Flight of the Intruder" crc="F92BE7F2">
  <gamegenie code="GZUOZYVG" description="Infinite radar-guided missiles - bombing/strafing screen" />
  <gamegenie code="PAOALZTE" description="Start with 9 radar-guided missiles - bombing/strafing screen" />
  <gamegenie code="GZUOLKVK" description="Infinite missiles - cockpit screen" />
  <gamegenie code="GAKGKGAA" description="Start on mission 3" />
  <gamegenie code="ZAKGKGAE" description="Start on mission 6" />
  <gamegenie code="APKGKGAA" description="Start on mission 9" />
  <gamegenie code="TPKGKGAA" description="Start on mission 12" />
  <gamegenie code="OZKZTXOK" description="Start each mission with 6 missiles (1 of 2)" />
  <gamegenie code="AAKXGZPA" description="Start each mission with 6 missiles (2 of 2)" />
</game>
<game code="CLV-H-BJRYM" name="Flintstones, The: The Rescue of Dino &amp; Hoppy" crc="2FE20D79">
  <gamegenie code="AVOPZOVG" description="Invincibility" />
  <gamegenie code="SXOAAEVK" description="Infinite lives" />
  <gamegenie code="SZNTZKVK" description="Infinite energy (hearts) (1 of 2)" />
  <gamegenie code="SXOPZOVK" description="Infinite energy (hearts) (2 of 2)" />
  <gamegenie code="AAVAYPZA" description="Start with 1 life" />
  <gamegenie code="IAVAYPZA" description="Start with 6 lives" />
  <gamegenie code="AAVAYPZE" description="Start with 9 lives" />
  <gamegenie code="LTNELOZA" description="Start with 99 coins" />
  <gamegenie code="PEEAAPAA" description="Start with Slingshot" />
  <gamegenie code="ZEEAAPAA" description="Start with Axe" />
  <gamegenie code="GEEAAPAA" description="Start with Bomb" />
  <gamegenie code="YESTZZIE" description="15 coins on pick-up" />
  <gamegenie code="ZESTZZIA" description="2 coins on pick-up" />
  <gamegenie code="AAUAXTLA" description="Slingshot doesn't use up coins" />
  <gamegenie code="AAUAUTLA" description="Axe doesn't use up coins" />
  <gamegenie code="AAUAKVZA" description="Bomb doesn't use up coins" />
  <gamegenie code="AETEKI" description="Infinite Firepower" />
  <gamegenie code="LOKOEPPA" description="Max power charge (1 of 4)" />
  <gamegenie code="LPEZLPPA" description="Max power charge (2 of 4)" />
  <gamegenie code="LOEPLPPA" description="Max power charge (3 of 4)" />
  <gamegenie code="LPUOLZPA" description="Max power charge (4 of 4)" />
</game>
<game code="CLV-H-PTRLQ" name="Flintstones, The - The Surprise at Dinosaur Peak! (U) [p1][!]" crc="0AC98EA5">
  <gamegenie code="AVEPKOSA" description="Invincibility" />
  <gamegenie code="SXEETEVK" description="Infinite lives" />
  <gamegenie code="AANONPPA" description="Infinite energy" />
  <gamegenie code="SXEPKOSE" description="Infinite energy (alt)" />
  <gamegenie code="AASALPZA" description="Start with 1 life instead of 3" />
  <gamegenie code="GASALPZA" description="Start with 5 lives" />
  <gamegenie code="AASALPZE" description="Start with 9 lives" />
  <gamegenie code="LANONPPA" description="Enemies do more damage (3 hearts)" />
  <gamegenie code="SXXOUVSE" description="Infinite stone hammers once obtained" />
  <gamegenie code="VTNEXOSE" description="Start on level 2" />
  <gamegenie code="PANELPLA" description="Start with 1 heart" />
  <gamegenie code="ZANELPLA" description="Start with 2 hearts" />
  <gamegenie code="TANELPLA" description="Start with 6 hearts" />
  <gamegenie code="PANELPLE" description="Start with 9 hearts" />
  <gamegenie code="GOEATOGA" description="Start with max power" />
  <gamegenie code="ZEEEUYPA" description="Get bowling ball instead of stone hammer" />
  <gamegenie code="LEEEUYPA" description="Get mystery item instead of stone hammer" />
  <gamegenie code="PAKAVPAA" description="Continue on Level 2" />
  <gamegenie code="ZAKAVPAA" description="Continue on Level 3" />
  <gamegenie code="LAKAVPAA" description="Continue on Level 4" />
  <gamegenie code="GAKAVPAA" description="Continue on Level 5" />
  <gamegenie code="IAKAVPAA" description="Continue on Level 6" />
  <gamegenie code="TAKAVPAA" description="Continue on Level 7" />
  <gamegenie code="YAKAVPAA" description="Continue on Level 8" />
  <gamegenie code="AAKAVPAE" description="Continue on Level 9" />
  <gamegenie code="PAKAVPAE" description="Continue on Level 10" />
</game>
<game code="CLV-H-UVKLX" name="Flying Dragon: The Secret Scroll" crc="F1FED9B8">
  <gamegenie code="VEKLTAKZ" description="Start with infinite lives" />
  <gamegenie code="GXEEEPVG" description="Start with infinite time" />
  <gamegenie code="PANATALA" description="Start with 1 life" />
  <gamegenie code="TANATALA" description="Start with 6 lives" />
  <gamegenie code="PANATALE" description="Start with 9 lives" />
  <gamegenie code="TAOXULLA" description="Start with double KO power" />
</game>
<game code="CLV-H-UJOYX" name="Flying Warriors" crc="10180072">
  <gamegenie code="SXNKIKSE" description="Infinite life" />
  <gamegenie code="SZVGKOVK" description="Infinite lives" />
  <gamegenie code="SXOZPKSE" description="Infinite KO's (1 of 2)" />
  <gamegenie code="SZSKLXSE" description="Infinite KO's (2 of 2)" />
  <gamegenie code="SZXEZZVG" description="Infnite Credits" />
</game>
<game code="CLV-H-QXTAS" name="Formula One: Built to Win" crc="5A8B4DA8">
  <gamegenie code="SXUIXEVK" description="Infinite nitro" />
  <gamegenie code="ATKSXAAZ" description="Better nitro" />
  <gamegenie code="AAVSOAZA" description="Psycho speed" />
  <gamegenie code="ATNUVUSZ" description="Items cost nothing" />
  <gamegenie code="ATNUVUSZ" description="Items for free (1 of 2)" />
  <gamegenie code="ATVUKLST" description="Items for free (2 of 2)" />
</game>
<game code="CLV-H-JIBNO" name="Frankenstein: The Monster Returns" crc="E943EC4D">
  <gamegenie code="ZEVKLGAA" description="Invincibility" />
  <gamegenie code="SZKEPASA" description="Invincible after you die once (may get stuck in boss stages) (1 of 2)" />
  <gamegenie code="SZEGPASA" description="Invincible after you die once (may get stuck in boss stages) (2 of 2)" />
  <gamegenie code="SXKELLSA" description="Infinite health (1 of 5)" />
  <gamegenie code="SZNOYASA" description="Infinite health (2 of 5)" />
  <gamegenie code="SXKEOLSA" description="Infinite health (3 of 5)" />
  <gamegenie code="SXUOZASA" description="Infinite health (4 of 5)" />
  <gamegenie code="SXUOGASA" description="Infinite health (5 of 5)" />
  <gamegenie code="PEOGYPLA" description="Start with 0 continue" />
  <gamegenie code="SZEEULSA" description="Can't collect extra energy" />
  <gamegenie code="EEKAYLEL" description="Die after one hit" />
</game>
<game code="CLV-H-OTUTJ" name="Freedom Force" crc="3E58A87E">
  <gamegenie code="ZOOTYTGZ" description="Start with half ammo" />
  <gamegenie code="AEUTLYZZ" description="Infinite ammo" />
  <gamegenie code="LEOVAYTA" description="Fewer errors allowed" />
  <gamegenie code="OXOTYNOK" description="Infinite errors allowed" />
  <gamegenie code="ZAUTLTPA" description="Start at level 2" />
  <gamegenie code="LAUTLTPA" description="Start at level 3" />
  <gamegenie code="GAUTLTPA" description="Start at level 4" />
  <gamegenie code="IAUTLTPA" description="Start at level 5" />
  <gamegenie code="GAKVYVAO" description="Start with half health" />
  <gamegenie code="GZVAYLSA" description="Infinite health" />
</game>
<game code="CLV-H-ZSUEJ" name="Friday the 13th" crc="BEB15855">
  <gamegenie code="SZEXSYAX" description="Invincibility" />
  <gamegenie code="SZESKSSE" description="Infinite health" />
  <gamegenie code="OTEIVISV" description="Infinite health for active counselor" />
  <gamegenie code="ZZOUAGTE" description="Vitamins heal active counselor better" />
  <gamegenie code="AZEVXLGE" description="Vitamins heal others better" />
  <gamegenie code="INNLIZGY" description="Autofire" />
  <gamegenie code="SZNUGYAX" description="Infinite child save time" />
  <gamegenie code="GAEUZIAE" description="Everyone can jump high" />
  <gamegenie code="SZSLUEVK" description="Infinite children (1 of 2)" />
  <gamegenie code="IYKLSEAY" description="Infinite children (2 of 2)" />
  <gamegenie code="AIKIUGEI" description="Hit anywhere" />
  <gamegenie code="AEOSOGZP" description="One hit kills" />
  <gamegenie code="AESGXZZZ" description="Enemies die automatically" />
  <gamegenie code="AEKGKLZA" description="No enemies (1 of 2)" />
  <gamegenie code="SXXISXVN" description="No enemies (2 of 2)" />
  <gamegenie code="SZVLGXOU" description="Turbo running (1 of 2)" />
  <gamegenie code="YPVLIXAV" description="Turbo running (2 of 2)" />
  <gamegenie code="YEEGIZSZ" description="Throw rocks straight" />
  <gamegenie code="IEVANTPA" description="Start with 55 children (1 of 2)" />
  <gamegenie code="YUNESVYA" description="Start with 55 children (2 of 2)" />
</game>
<game code="CLV-H-NXQPY" name="G.I. Joe" crc="1D2D93FF">
  <gamegenie code="ESVOGGEY" description="Invincibility (1 of 2)" />
  <gamegenie code="XVNPAKAU" description="Invincibility (2 of 2)" />
  <gamegenie code="SXVXOVSE" description="Infinite ammo" />
  <gamegenie code="SXNETUSE" description="Infinite time" />
  <gamegenie code="AENATLPA" description="Infinite time (alt)" />
  <gamegenie code="GOUTKSIA" description="More health - Duke" />
  <gamegenie code="GOUTSSGA" description="More health - Blizzard" />
  <gamegenie code="GOUTVSZA" description="More health - Snake Eyes" />
  <gamegenie code="GOUTNSLA" description="More health - Capt. Grid-Iron" />
  <gamegenie code="GOUVESPA" description="More health - Rock and Roll" />
  <gamegenie code="TEUTKSIA" description="Less health - Duke" />
  <gamegenie code="TEUTSSGA" description="Less health - Blizzard" />
  <gamegenie code="IEUTVSZA" description="Less health - Snake Eyes" />
  <gamegenie code="IEUTNSLA" description="Less health - Capt. Grid-Iron" />
  <gamegenie code="GEUVESPA" description="Less health - Rock and Roll" />
  <gamegenie code="ALNVIKAY" description="Shorter immunity" />
  <gamegenie code="NYNVIKAN" description="Longer immunity" />
  <gamegenie code="AAUEPPLA" description="Max health on pick-up" />
  <gamegenie code="OLNTYKOO" description="Infinite health" />
  <gamegenie code="AXNVKIYP" description="Mega-jump - Duke" />
  <gamegenie code="AXNVSIZP" description="Mega-jump - Blizzard" />
  <gamegenie code="AXNVVSGP" description="Mega-jump - Snake Eyes" />
  <gamegenie code="AXNVNIGP" description="Mega-jump - Capt. Grid-Iron" />
  <gamegenie code="AZETETAP" description="Mega-jump - Rock and Roll" />
</game>
<game code="CLV-H-SVXVM" name="G.I. Joe: The Atlantis Factor" crc="8C8DEDB6">
  <gamegenie code="EISPUZEY" description="Invincibility (1 of 2)" />
  <gamegenie code="XTSPNXAU" description="Invincibility (2 of 2)" />
  <gamegenie code="YUKETLPE" description="Start with all characters" />
  <gamegenie code="IAEELGPA" description="Start with 500 bullets" />
  <gamegenie code="PENVSYIA" description="Start with 1 life" />
  <gamegenie code="OUSTLSOO" description="Infinite health" />
  <gamegenie code="AESVPSAY" description="Don't flash after getting hit" />
  <gamegenie code="PUSVPSAN" description="Flash about half as long after getting hit" />
  <gamegenie code="AASEZIPA" description="Infinite time" />
  <gamegenie code="SUOPEUVS" description="Infinite Mines" />
  <gamegenie code="SXSTLSOP" description="Infinite stamina (1 of 2)" />
  <gamegenie code="SUOAISSO" description="Infinite stamina (2 of 2)" />
  <gamegenie code="GAXPPYPA" description="Each Pow worth increases player level by one" />
  <gamegenie code="GXSUZVSE" description="Infinite bullets after obtaining a power up shell (1 of 2)" />
  <gamegenie code="GXVLTVSE" description="Infinite bullets after obtaining a power up shell (2 of 2)" />
  <gamegenie code="SXSUZVSE" description="Infinite ammo (1 of 4)" />
  <gamegenie code="SXVLTVSE" description="Infinite ammo (2 of 4)" />
  <gamegenie code="SXSLIVVK" description="Infinite ammo (3 of 4)" />
  <gamegenie code="SXVUPVSE" description="Infinite ammo (4 of 4)" />
</game>
<game code="CLV-H-OKVPY" name="Galaxy 5000: Racing in the 51st Century" crc="1D20A5C6">
  <gamegenie code="SLKPAEVS" description="Infinite time" />
  <gamegenie code="GXNXSVSN" description="Reduce damage free of charge" />
  <gamegenie code="SXKZEPAX" description="No damage from falling" />
  <gamegenie code="OXNNVPSX" description="Take less damage (1 of 2)" />
  <gamegenie code="PENNNOZP" description="Take less damage (2 of 2)" />
  <gamegenie code="SXUXSOSU" description="More damage from falling (2 of 2)" />
  <gamegenie code="ALVUVYLZ" description="More damage from falling (2 of 2)" />
  <gamegenie code="TEEOZGVV" description="More damage from shots (1 of 2)" />
  <gamegenie code="NUEOLKVN" description="More damage from shots (2 of 2)" />
</game>
<game code="CLV-H-LGXDG" name="Gargoyle's Quest II" crc="F0E9971B">
  <gamegenie code="OXSELPSX" description="Infinite fight" />
  <gamegenie code="OESAKAIE" description="Invincibility (except Doppelganger when it mimics you)" />
  <gamegenie code="KVNVYLIA" description="Invincible against spikes" />
  <gamegenie code="APOEGLEP" description="Walk through walls" />
</game>
<game code="CLV-H-ZKXZP" name="Gauntlet" crc="EC968C51">
  <gamegenie code="SLNAEYSP" description="Infinite health (1 of 2)" />
  <gamegenie code="SLVPOASP" description="Infinite health (2 of 2)" />
  <gamegenie code="PAOXVLAE" description="Infinite Keys (1 of 2)" />
  <gamegenie code="SAXZOLSZ" description="Infinite Keys (2 of 2)" />
  <gamegenie code="XVOONAVK" description="Infinite time in puzzle and treasure rooms" />
</game>
<game code="CLV-H-DWHLX" name="Gauntlet II" crc="1B71CCDB">
  <gamegenie code="PAOVYAAA" description="Infinite Keys (new game) (1 of 2)" />
  <gamegenie code="SZVTEUVS" description="Infinite Keys (new game) (2 of 2)" />
  <gamegenie code="SLXSNNSO" description="Infinite health (1 of 2)" />
  <gamegenie code="SLETYXSO" description="Infinite health (2 of 2)" />
  <gamegenie code="OTXSSYSV" description="Take less damage (1 of 2)" />
  <gamegenie code="ZAXSVYAA" description="Take less damage (2 of 2)" />
  <gamegenie code="XVOTGXSU" description="Infinite time in treasure rooms" />
  <gamegenie code="ZLVVVIGT" description="Weaker poison" />
  <gamegenie code="EGVVVIGV" description="Stronger poison" />
  <gamegenie code="IAUTEUZA" description="5 super shots on pick-up" />
  <gamegenie code="GPUTEUZA" description="20 super shots on pick-up" />
  <gamegenie code="AYETVUGU" description="Invincibility lasts longer" />
  <gamegenie code="LPETVUGU" description="Invincibility doesn't last as long" />
  <gamegenie code="ANNTUXGU" description="Repulsiveness lasts longer" />
  <gamegenie code="LONTUXGU" description="Repulsiveness doesn't last as long" />
  <gamegenie code="AYOTKUGU" description="Invisibility lasts longer" />
  <gamegenie code="LPOTKUGU" description="Invisibility doesn't last as long" />
  <gamegenie code="APUVTIEP" description="Walk through walls (1 of 2)" />
  <gamegenie code="ELSVGIEP" description="Walk through walls (2 of 2)" />
</game>
<game code="CLV-H-UHOPS" name="George Foreman's KO Boxing" crc="AF05F37E">
  <gamegenie code="AOONKZEY" description="Invincibility (1 of 2)" />
  <gamegenie code="OXNYSXPK" description="Invincibility (2 of 2)" />
  <gamegenie code="AAVTTNAA" description="Can always use super punches" />
  <gamegenie code="OXVNSAOU" description="Knock down opponent with 1 super punch (1 of 2)" />
  <gamegenie code="PKVNVEVZ" description="Knock down opponent with 1 super punch (2 of 2)" />
</game>
<game code="CLV-H-MFSAH" name="Ghostbusters" crc="6A154B68">
  <gamegenie code="AVVETNTI" description="Start with $1,000,000" />
  <gamegenie code="SXKZAZVG" description="Infinite fuel" />
  <gamegenie code="OXOXKPVK" description="Immune to ghosts on Zuul stairway" />
  <gamegenie code="PAEEXKPX" description="Permanent ghost alarm" />
  <gamegenie code="PASPLOPX" description="Permanent ghost vacuum" />
  <gamegenie code="OXSESGSX" description="Self-emptying traps" />
  <gamegenie code="AEEZOAPA" description="Super sprinting up Zuul stairway" />
  <gamegenie code="SZXYVOVV" description="Stay Puft does not climb building during Gozer fight" />
  <gamegenie code="SZVYAUSE" description="Infinite energy during Gozer fight" />
  <gamegenie code="EIUYZLEY" description="Gozer dies in one hit" />
  <gamegenie code="AAXXPTYP" description="No walk up Zuul stairway" />
</game>
<game code="CLV-H-OLDAK" name="Ghostbusters II" crc="2AE97660">
  <gamegenie code="EINPOYEY" description="Invincibility (1 of 2)" />
  <gamegenie code="ESVOKIEY" description="Invincibility (2 of 2)" />
  <gamegenie code="SUKYAUVS" description="Infinite lives" />
  <gamegenie code="AAXVGGLA" description="Start with 1 life" />
  <gamegenie code="IAXVGGLA" description="Start with 6 lives" />
  <gamegenie code="AAXVGGLE" description="Start with 9 lives" />
  <gamegenie code="SZXPSXVK" description="Infinite continues" />
  <gamegenie code="TAEGTAZA" description="Triple continues" />
  <gamegenie code="ZEEOOXYO" description="Rapid-firing proton rifle" />
  <gamegenie code="KYSOKXVN" description="All Ghostbusters can mega-jump" />
  <gamegenie code="NNXXAPAS" description="Shield lasts longer - car scenes" />
  <gamegenie code="SZOXLNVK" description="Infinite shield - car scenes" />
</game>
<game code="CLV-H-SQBSY" name="Ghoul School" crc="2BC25D5A">
  <gamegenie code="SZKZOZAX" description="Invincibility" />
  <gamegenie code="SXSXSUSE" description="Infinite health" />
  <gamegenie code="SXEKYVVK" description="Infinite lives" />
</game>
<game code="CLV-H-VJXZH" name="Goal!" crc="84148F73">
  <gamegenie code="OGOKLYEN" description="CPU score adds to your score (1 of 2)" />
  <gamegenie code="OGOKYYEN" description="CPU score adds to your score (2 of 2)" />
</game>
<game code="CLV-H-TQCAC" name="Goal! Two" crc="90C773C1">
  <gamegenie code="AZKIANPA" description="Start with more KP - Italy, P2" />
  <gamegenie code="AIKIANPA" description="Start with a lot of KP - Italy, P2" />
  <gamegenie code="OPKIANPE" description="Start with mega KP - Italy, P2" />
  <gamegenie code="AZKIPYYA" description="Start with more TP - Italy, P2" />
  <gamegenie code="AIKIPYYA" description="Start with a lot of TP - Italy, P2" />
  <gamegenie code="OPKIPYYE" description="Start with mega TP - Italy, P2" />
  <gamegenie code="SZEYAPVG" description="Infinite time - Italy, P2" />
  <gamegenie code="SXNELNSE" description="P2 or computer can't score - Italy, P2" />
</game>
<game code="CLV-H-WYIKA" name="Capcom's Gold Medal Challenge '92" crc="BE250388">
  <gamegenie code="OXSYZVON" description="Massive run power (1 of 3)" />
  <gamegenie code="ASSYLTEY" description="Massive run power (2 of 3)" />
  <gamegenie code="XVSYGTVN" description="Massive run power (3 of 3)" />
</game>
<game code="CLV-H-NGJDR" name="Golf" crc="E7D2C49D">
  <gamegenie code="AAVGIZLA" description="Ball goes in from anywhere (1 of 3)" />
  <gamegenie code="APVIYLEY" description="Ball goes in from anywhere (2 of 3)" />
  <gamegenie code="ILVSALPK" description="Ball goes in from anywhere (3 of 3)" />
</game>
<game code="CLV-H-YXARP" name="Golf Grand Slam" crc="CF5F8AF0">
  <gamegenie code="SXEZGYSA" description="Strokes aren't recorded" />
  <gamegenie code="PEXTETIA" description="Some shots can be done more accurately" />
  <gamegenie code="OZOIPGIX" description="Wind always at 9 (1 of 3)" />
  <gamegenie code="PAOIZKAX" description="Wind always at 9 (2 of 3)" />
  <gamegenie code="SXSZZYSA" description="Wind always at 9 (3 of 3)" />
</game>
<game code="CLV-H-SQCNX" name="Golgo 13: Top Secret Episode" crc="F532F09A">
  <gamegenie code="SZOETGSA" description="Infinite health (1 of 3)" />
  <gamegenie code="OXKVXAVK" description="Infinite health (2 of 3)" />
  <gamegenie code="SXKNNPSA" description="Infinite health (3 of 3)" />
  <gamegenie code="SXKVXAVG" description="Health does not gradually decrease" />
  <gamegenie code="GXUVXTSA" description="Infinite bullets in horizontal mode" />
  <gamegenie code="GXKNNPSA" description="Infinite health in horizontal mode" />
  <gamegenie code="GZOEGGST" description="Infinite health in pan/zoom mode" />
  <gamegenie code="GZKLZGST" description="Infinite health in maze" />
  <gamegenie code="ZAVKIAAA" description="Have a health and bullets boost" />
</game>
<game code="CLV-H-URLKN" name="Goonies II, The" crc="999577B6">
  <gamegenie code="SESEZESX" description="Invincibility" />
  <gamegenie code="SZSUNTSA" description="Infinite health" />
  <gamegenie code="YEUAOPZA" description="Super-jump" />
  <gamegenie code="SSOOUZVI" description="Infinite time" />
  <gamegenie code="SZUGUYVG" description="Infinite lives" />
  <gamegenie code="LEUAOPZA" description="Mega-jump" />
  <gamegenie code="IEUEKPGA" description="Better Jumping Boots on pick-up" />
  <gamegenie code="ZESAPAPA" description="Super-speed" />
  <gamegenie code="SXUASSVK" description="Infinite Bombs on pick-up" />
  <gamegenie code="SZVAESVK" description="Infinite Molotov Bombs on pick-up" />
  <gamegenie code="SZNEEVVK" description="Infinite Sling Shots on pick-up" />
  <gamegenie code="AOSAYVOG" description="Walk through walls (1 of 3)" />
  <gamegenie code="APSAZYEY" description="Walk through walls (2 of 3)" />
  <gamegenie code="SZNAANSE" description="Walk through walls (3 of 3)" />
  <gamegenie code="GAUIZGZA" description="Start with 4 health cells (1 of 2)" />
  <gamegenie code="AGUIYGAZ" description="Start with 4 health cells (2 of 2)" />
  <gamegenie code="AAUIZGZE" description="Start with 8 health cells (1 of 2)" />
  <gamegenie code="EAUIYGAZ" description="Start with 8 health cells (2 of 2)" />
  <gamegenie code="YPVIAGPE" description="Start with all items" />
  <gamegenie code="IAVIAGPA" description="Start with Boomerang" />
  <gamegenie code="PAXSZGLA" description="Start with 1 life" />
  <gamegenie code="TAXSZGLA" description="Start with 6 lives" />
  <gamegenie code="PAXSZGLE" description="Start with 9 lives" />
</game>
<game code="CLV-H-VJENJ" name="Gotcha! The Sport!" crc="4E959173">
  <gamegenie code="AASUTIPA" description="Infinite time" />
  <gamegenie code="ZAEOKAPA" description="Start with double rations of ammo" />
  <gamegenie code="IAEPOAGA" description="Increase timer to 59 seconds (1 of 2)" />
  <gamegenie code="PAEPVAIE" description="Increase timer to 59 seconds (2 of 2)" />
  <gamegenie code="ZAEPOAGA" description="Decrease timer to 25 seconds (1 of 2)" />
  <gamegenie code="IAEPVAIA" description="Decrease timer to 25 seconds (2 of 2)" />
</game>
<game code="CLV-H-CAVUH" name="Great Waldo Search, The" crc="2DFF7FDC">
  <gamegenie code="EKEIXTEA" description="Only need to find Waldo to complete the level" />
  <gamegenie code="EKXSNTAG" description="Only need to find the magic scroll" />
  <gamegenie code="ZEKKOTPA" description="Faster timer" />
  <gamegenie code="GEKKOTPA" description="Much faster timer" />
  <gamegenie code="OZSIEEOV" description="Play the Super Waldo Challenge (1 of 2)" />
  <gamegenie code="GASIOALA" description="Play the Super Waldo Challenge (2 of 2)" />
  <gamegenie code="SXSGKTVG" description="Extra clocks last forever" />
  <gamegenie code="SZXINYVT" description="Extra clocks worth nothing" />
</game>
<game code="CLV-H-OCJKD" name="Gremlins 2: The New Batch" crc="0ED96F42">
  <gamegenie code="EYESUIEI" description="Invincibility" />
  <gamegenie code="SXKEZPVG" description="Infinite health" />
  <gamegenie code="GAEGEAAA" description="Start with 5 lives" />
  <gamegenie code="PAEGEAAE" description="Start with 10 lives" />
  <gamegenie code="LAEGSAPA" description="Start with 3 balloons" />
  <gamegenie code="TAEGSAPA" description="Start with 6 balloons" />
  <gamegenie code="SZNETEVK" description="Infinite lives" />
  <gamegenie code="SZXEUXVK" description="Infinite Balloons" />
  <gamegenie code="ZAEKXATA" description="Start with only 1 heart (1 of 2)" />
  <gamegenie code="ZEEELATA" description="Start with only 1 heart (2 of 2)" />
  <gamegenie code="AAEKXATE" description="Start with 4 hearts (1 of 2)" />
  <gamegenie code="AEEELATE" description="Start with 4 hearts (2 of 2)" />
</game>
<game code="CLV-H-XPPGA" name="Guardian Legend, The" crc="FA43146B">
  <gamegenie code="AVKSLZSZ" description="Invincibility" />
  <gamegenie code="AAXTIUNY" description="Infinite health" />
  <gamegenie code="AASIYUYT" description="Hit anywhere (1 of 4)" />
  <gamegenie code="EGSITLIZ" description="Hit anywhere (2 of 4)" />
  <gamegenie code="EISSALEY" description="Hit anywhere (3 of 4)" />
  <gamegenie code="PASSPLIE" description="Hit anywhere (4 of 4)" />
  <gamegenie code="OVOAKLSV" description="Use up minimum shots (1 of 2)" />
  <gamegenie code="PEOASLAP" description="Use up minimum shots (2 of 2)" />
  <gamegenie code="GXOAKLST" description="Never use up shots (To finish the game, save before opening the entrance to corridor 6. Restart with no codes and enter the entrance. Save again, then restart.)" />
  <gamegenie code="AXVAIAAG" description="Start with less health" />
  <gamegenie code="EEVAIAAG" description="Start with more health" />
  <gamegenie code="PAKVELAA" description="Start on area 01" />
  <gamegenie code="LAKVELAA" description="Start on area 03" />
  <gamegenie code="IAKVELAA" description="Start on area 05" />
  <gamegenie code="YAKVELAA" description="Start on area 07" />
  <gamegenie code="PAKVELAE" description="Start on area 09" />
</game>
<game code="CLV-H-WUURQ" name="Guerrilla War" crc="6DECD886">
  <gamegenie code="EYSTGGEI" description="Invincibility (1 of 2)" />
  <gamegenie code="EIETUGEY" description="Invincibility (2 of 2)" />
  <gamegenie code="SLTKOV" description="Infinite lives - both players" />
  <gamegenie code="SZVKOVVS" description="Infinite lives - both players (alt)" />
  <gamegenie code="SXUTEUSO" description="Keep weapon after death" />
  <gamegenie code="PEXXAEAE" description="Start a new game to view ending" />
  <gamegenie code="LASKYYPO" description="Press Start to complete the level" />
  <gamegenie code="AELGVP" description="Start with 1 life - both players" />
  <gamegenie code="IELGVP" description="Start with 6 lives - both players" />
  <gamegenie code="PELGVO" description="Start with 9 lives - both players" />
</game>
<game code="CLV-H-HOUTJ" name="Gumshoe" crc="BEB8AB01">
  <gamegenie code="PAUENALA" description="Start with 1 life" />
  <gamegenie code="TAUENALA" description="Start with 6 lives" />
  <gamegenie code="PAUENALE" description="Start with 9 lives" />
  <gamegenie code="IZSEEAAI" description="Start with 25 bullets" />
  <gamegenie code="PASEKAAA" description="Start with 150 bullets" />
  <gamegenie code="ZASEKAAA" description="Start with 250 bullets" />
  <gamegenie code="PASAUALA" description="Gain 1 bullet on pick-up" />
  <gamegenie code="TASAUALA" description="Gain 6 bullets on pick-up" />
  <gamegenie code="LAKEGYTA" description="Timer set to 04:00" />
  <gamegenie code="PAKEGYTE" description="Timer set to 10:00" />
  <gamegenie code="SAKAVEKE" description="Different attack waves" />
</game>
<game code="CLV-H-PFOVZ" name="Gun Nac" crc="D19DCB2B">
  <gamegenie code="AGEZPAAI" description="Invincibility (1 of 2)" />
  <gamegenie code="AGUXGPAI" description="Invincibility (2 of 2)" />
  <gamegenie code="SXVZTXSE" description="Infinite special weapons" />
  <gamegenie code="SXOZYUSE" description="Infinite lives" />
  <gamegenie code="EIEIYYEP" description="One hit kills" />
</game>
<game code="CLV-H-AXYOR" name="Gun.Smoke" crc="A8784932">
  <gamegenie code="PAXVTYLE" description="Start with 9 lives" />
  <gamegenie code="PPXVTYLE" description="Start with 25 lives" />
  <gamegenie code="SXUYTLVG" description="Infinite lives" />
  <gamegenie code="PAUTTYAA" description="Start with all weapons and lots of ammo" />
  <gamegenie code="GAUTTYAA" description="Start with all weapons, lots of ammo, all 4 boots and all 4 rifle icons" />
  <gamegenie code="PEXNALAA" description="Keep weapons after death" />
</game>
<game code="CLV-H-WFYWJ" name="Gyro" crc="023A5A32">
  <gamegenie code="SZUZKTAX" description="Invincible against enemies" />
  <gamegenie code="ATOXXOOZ" description="Invincible against upward crushing" />
  <gamegenie code="AESZVZLA" description="Climb up through flooring" />
  <gamegenie code="AEOZEZLA" description="Climb down through flooring" />
  <gamegenie code="SUZAAI" description="Infinite lives" />
  <gamegenie code="ZEAAUS" description="Slow down timer" />
  <gamegenie code="PEUAGLIA" description="Start with 1 life" />
  <gamegenie code="ZEUAGLIE" description="Start with 10 lives" />
  <gamegenie code="GOUAGLIA" description="Start with 20 lives" />
</game>
<game code="CLV-H-QSLDA" name="Gyruss" crc="1D41CC8C">
  <gamegenie code="OXSXTASX" description="Invincibility" />
  <gamegenie code="AEEOIEZA" description="Infinite lives" />
  <gamegenie code="PAXEGLGA" description="Start with 1 ship" />
  <gamegenie code="ZAXEGLGE" description="Start with 10 ships" />
  <gamegenie code="GAKEATPA" description="Start with 4 phasers" />
  <gamegenie code="AAKEATPE" description="Start with 8 phasers" />
  <gamegenie code="ZEEPYAPA" description="Gain 2 phasers when you die with none" />
  <gamegenie code="GEEPYAPA" description="Gain 4 phasers when you die with none" />
  <gamegenie code="OAKEATPA" description="Start with twin shots + 1 phaser" />
  <gamegenie code="KAKEATPA" description="Start with twin shots + 4 phasers" />
  <gamegenie code="EAKEATPE" description="Start with twin shots + 8 phasers" />
  <gamegenie code="GEEPIAZA" description="Never lose twin shots (1 of 2)" />
  <gamegenie code="OEEPYAPA" description="Never lose twin shots (2 of 2)" />
</game>
<game code="CLV-H-BYCJO" name="Harlem Globetrotters" crc="2E6EE98D">
  <gamegenie code="IIUGSOIZ" description="Slower timer" />
  <gamegenie code="GPUGSOIX" description="Faster timer" />
  <gamegenie code="IIVGKOIZ" description="Slower shot clock" />
  <gamegenie code="GPVGKOIX" description="Faster shot clock" />
</game>
<game code="CLV-H-YFSBO" name="Heavy Barrel" crc="34EAB034">
  <gamegenie code="AVVUEUPA" description="Invincibility" />
  <gamegenie code="SZOTXTVG" description="Infinite lives" />
  <gamegenie code="SXVVVLVI" description="Infinite Bombs" />
  <gamegenie code="ENSTPVSN" description="Autofire - P1" />
  <gamegenie code="EYNVINSN" description="Autofire - P2" />
  <gamegenie code="AEKVXLII" description="Hand weapons last 4x longer" />
  <gamegenie code="ZAOVEPAA" description="Only 1 hand weapon" />
  <gamegenie code="ENVVKLEI" description="Infinite hand weapons on pick-up - both players" />
  <gamegenie code="OXVVVLVS" description="Infinite hand weapons and firearms on pick-up - both players" />
  <gamegenie code="XVKZVEXK" description="Enemies don't fire handguns" />
  <gamegenie code="XTOVVEXK" description="Invincibility and invisibility on second life" />
  <gamegenie code="SUKUZISP" description="Infinite Keys" />
  <gamegenie code="OXNUTNPV" description="Infinite Mace" />
</game>
<game code="CLV-H-EABIR" name="Heavy Shreddin'" crc="EB15169E">
  <gamegenie code="AUEXNVAO" description="Slow timer" />
  <gamegenie code="PEKAPLGA" description="1 penalty" />
  <gamegenie code="AEKAPLGE" description="8 penalties" />
  <gamegenie code="AOKAPLGA" description="16 penalties" />
  <gamegenie code="NNUEYLAE" description="Select any level" />
  <gamegenie code="ZESEKLPA" description="Faster left and right movement (1 of 2)" />
  <gamegenie code="ZEVEKLPA" description="Faster left and right movement (2 of 2)" />
  <gamegenie code="SXSOYIVG" description="Infinite penalties (1 of 3)" />
  <gamegenie code="SXOPPLVG" description="Infinite penalties (2 of 3)" />
  <gamegenie code="SXUOZLVG" description="Infinite penalties (3 of 3)" />
</game>
<game code="CLV-H-CKXJA" name="Hogan's Alley" crc="FF24D794">
  <gamegenie code="IAEKOIAP" description="5 misses allowed - Game A" />
  <gamegenie code="AZEKOIAP" description="20 misses allowed - Game A" />
  <gamegenie code="AAOSIASY" description="Hit anywhere - Game B (1 of 2)" />
  <gamegenie code="AAXSPGEA" description="Hit anywhere - Game B (2 of 2)" />
  <gamegenie code="AAOGETPA" description="Infinite misses allowed - all games" />
  <gamegenie code="ZAOGETPA" description="Each miss counts as 2 - all games" />
</game>
<game code="CLV-H-CBYKI" name="Home Alone 2: Lost in New York" crc="2E0741B6">
  <gamegenie code="SZSVLVVK" description="Become almost invincible after losing 1 life point (against most enemies, vacuum cleaner can still kill you)" />
  <gamegenie code="PEEPILLA" description="Start with 1 life instead of 3" />
  <gamegenie code="IEEPILLA" description="Start with 5 lives" />
  <gamegenie code="YEEPILLA" description="Start with 7 lives" />
  <gamegenie code="PEEPILLE" description="Start with 9 lives" />
  <gamegenie code="POEPILLE" description="Start with 25 lives" />
  <gamegenie code="ZUEPILLA" description="Start with 50 lives" />
  <gamegenie code="LKEPILLE" description="Start with 75 lives" />
  <gamegenie code="LVEPILLA" description="Start with 99 lives" />
  <gamegenie code="SZEYKVVK" description="Infinite lives" />
  <gamegenie code="AENYVGGE" description="Every 4 cookies count as 8" />
  <gamegenie code="GENYVGGE" description="Every 4 cookies count as 12" />
  <gamegenie code="AONYVGGA" description="Every 4 cookies count as 16" />
  <gamegenie code="GONYVGGA" description="Every 4 cookies count as 20 (extra life point)" />
  <gamegenie code="IAOVUGTA" description="Extra life with 5 pizza slices instead of 6" />
  <gamegenie code="GAOVUGTA" description="Extra life with 4 pizza slices" />
  <gamegenie code="LAOVUGTA" description="Extra life with 3 pizza slices" />
  <gamegenie code="ZAOVUGTA" description="Extra life with 2 pizza slices" />
  <gamegenie code="PAOVUGTA" description="Extra life with every pizza slice" />
  <gamegenie code="SZNYSSVK" description="Infinite power units/life points" />
  <gamegenie code="SZOELKVK" description="Infinite slides on pick-up" />
  <gamegenie code="SZVETKVK" description="Infinite darts on pick-up" />
  <gamegenie code="SZSAAKVK" description="Infinite flying fists on pick-up" />
</game>
<game code="CLV-H-KINGA" name="Hook" crc="D8230D0E">
  <gamegenie code="AEXVNTZA" description="Start with 1 life" />
  <gamegenie code="IEXVNTZA" description="Start with 6 lives" />
  <gamegenie code="AEXVNTZE" description="Start with 9 lives" />
  <gamegenie code="SZONIEVK" description="Infinite lives - P1" />
  <gamegenie code="GZVIKIST" description="Infinite health - P1" />
  <gamegenie code="GZNSNIST" description="Infinite health - P2" />
  <gamegenie code="AENIOIIA" description="Get max health from food - P1" />
  <gamegenie code="AAEINTIA" description="Get max health from food - P2" />
  <gamegenie code="AVVIXSGZ" description="No health from food" />
</game>
<game code="CLV-H-BLNKO" name="Hudson Hawk" crc="5A4F156D">
  <gamegenie code="PEVGTTIA" description="Start with 1 life" />
  <gamegenie code="LEVGTTIA" description="Start with 3 lives" />
  <gamegenie code="PEVGTTIE" description="Start with 9 lives" />
  <gamegenie code="SXETGYSA" description="Infinite health" />
  <gamegenie code="PEVKZVNY" description="Start with very little health - first life only" />
  <gamegenie code="AKVKZVNY" description="Start with 1/4 health - first life only" />
  <gamegenie code="ANVKZVNY" description="Start with 1/2 health - first life only" />
  <gamegenie code="EUVKZVNY" description="Start with 3/4 health - first life only" />
  <gamegenie code="PESKPTLA" description="Start with 1 continue" />
  <gamegenie code="IESKPTLA" description="Start with 5 continues" />
  <gamegenie code="PESKPTLE" description="Start with 9 continues" />
  <gamegenie code="OZKKEAAU" description="Infinite continues (1 of 2)" />
  <gamegenie code="OZKGVAVK" description="Infinite continues (2 of 2)" />
  <gamegenie code="OZSKYYUK" description="Infinite lives (1 of 2)" />
  <gamegenie code="OZVGZYEN" description="Infinite lives (2 of 2)" />
</game>
<game code="CLV-H-SLKOA" name="Adventure Island" crc="F8A713BE">
  <gamegenie code="ATSKZAKZ" description="Invincibility" />
  <gamegenie code="SXKKIAVG" description="Infinite health" />
  <gamegenie code="GXNGLAKA" description="Immune to rocks" />
  <gamegenie code="GZXEAPSA" description="Keep weapons" />
  <gamegenie code="EIUEOLEL" description="Get fruits from anywhere" />
  <gamegenie code="AAKGTOKI" description="Hit anywhere (1 of 3)" />
  <gamegenie code="AAKKYPYA" description="Hit anywhere (2 of 3)" />
  <gamegenie code="OLSGZOOO" description="Hit anywhere (3 of 3)" />
  <gamegenie code="SPEEIIEG" description="Can mega-jump while at rest" />
  <gamegenie code="SPEETSOZ" description="Can mega-jump while running" />
  <gamegenie code="AAEAYIPA" description="Multi-mega-maxi-moon jumps (1 of 2)" />
  <gamegenie code="AEVEZGPZ" description="Multi-mega-maxi-moon jumps (2 of 2)" />
  <gamegenie code="AEKAPIPA" description="Hudson can moonwalk (1 of 2)" />
  <gamegenie code="PEEEZIAA" description="Hudson can moonwalk (2 of 2)" />
  <gamegenie code="GXVAGGEI" description="Multi-jump (1 of 2)" />
  <gamegenie code="GXVEPGEI" description="Multi-jump (2 of 2)" />
  <gamegenie code="ALSAIIEI" description="Skateboard doesn't automatically move forward" />
  <gamegenie code="ATKAEUVI" description="Collectable items never disappear" />
  <gamegenie code="PEEEPALA" description="Start with 1 life" />
  <gamegenie code="TEEEPALA" description="Start with 6 lives" />
  <gamegenie code="PEEEPALE" description="Start with 9 lives" />
  <gamegenie code="SZOEGPVG" description="Start with infinite lives" />
</game>
<game code="CLV-H-UZAEH" name="Hunt for Red October, The" crc="4E77733A">
  <gamegenie code="SXEZXZVG" description="Infinite lives" />
  <gamegenie code="SXEUPUVK" description="Infinite time" />
  <gamegenie code="SXUXYSVK" description="Infinite horizontal torpedoes" />
  <gamegenie code="SZUZPVVK" description="Infinite vertical torpedoes" />
  <gamegenie code="AAEUVGPA" description="Maximum power horizontal torpedoes on pick-up (1 of 2)" />
  <gamegenie code="OZEUEKOK" description="Maximum power horizontal torpedoes on pick-up (2 of 2)" />
  <gamegenie code="AASUSGPA" description="Maximum power vertical torpedoes on pick-up (1 of 2)" />
  <gamegenie code="OZSLNKOK" description="Maximum power vertical torpedoes on pick-up (2 of 2)" />
  <gamegenie code="ZANLVKPO" description="Start with 10 horizontal torpedoes" />
  <gamegenie code="ZLNLVKPP" description="Start with 50 horizontal torpedoes" />
  <gamegenie code="LTNLVKPP" description="Start with 99 horizontal torpedoes" />
  <gamegenie code="IANUUKYA" description="Start with 5 vertical torpedoes" />
  <gamegenie code="ZLNUUKYA" description="Start with 50 vertical torpedoes" />
  <gamegenie code="LTNUUKYA" description="Start with 99 vertical torpedoes" />
  <gamegenie code="IEELSKZA" description="Start with 5 caterpillars" />
  <gamegenie code="ZUELSKZA" description="Start with 50 caterpillars" />
  <gamegenie code="LVELSKZA" description="Start with 99 caterpillars" />
  <gamegenie code="IEEUXKZA" description="Start with 5 ECM's" />
  <gamegenie code="ZUEUXKZA" description="Start with 50 ECM's" />
  <gamegenie code="LVEUXKZA" description="Start with 99 ECM's" />
  <gamegenie code="PEVLYAIA" description="Start with 1 life" />
  <gamegenie code="ZEVLYAIE" description="Start with 10 lives" />
</game>
<game code="CLV-H-PPUDR" name="Hydlide" crc="77BF8B23">
  <gamegenie code="AZKAAVZE" description="Boost strength, life, magic" />
  <gamegenie code="GTKAAVZA" description="Super boost strength, life, magic" />
  <gamegenie code="SXSGYYSA" description="Don't take damage from most enemies" />
  <gamegenie code="AEUEKVIA" description="Rapid healing" />
  <gamegenie code="AANOVZZA" description="Rapid magic healing" />
</game>
<game code="CLV-H-QPMEU" name="Ikari Warriors" crc="2D273AA4">
  <gamegenie code="SXVYAUGK" description="Invincibility" />
  <gamegenie code="KAXTLAEA" description="Invincibility (blinking)" />
  <gamegenie code="ESVLZYEY" description="Invincibility" />
  <gamegenie code="SXSNZTVI" description="Infinite lives" />
  <gamegenie code="SXXNVUVS" description="Infinite Missiles for Tank" />
  <gamegenie code="SZONZSVS" description="Infinite Bullets" />
  <gamegenie code="SXEYZSVS" description="Infinite Grenades" />
  <gamegenie code="AAKLAYLY" description="Enemies die automatically (1 of 4)" />
  <gamegenie code="AAOPYOGP" description="Enemies die automatically (2 of 4)" />
  <gamegenie code="ASUUSPEL" description="Enemies die automatically (3 of 4)" />
  <gamegenie code="GXOEATEP" description="Enemies die automatically (4 of 4)" />
  <gamegenie code="AEXUOPPA" description="Hit anywhere (except tanks and helicopters) (1 of 3)" />
  <gamegenie code="LUXUUPLO" description="Hit anywhere (except tanks and helicopters) (2 of 3)" />
  <gamegenie code="OKXUEOPX" description="Hit anywhere (except tanks and helicopters) (3 of 3)" />
  <gamegenie code="AAXTELZA" description="Shoot and walk through walls" />
  <gamegenie code="PAUYPTLA" description="Start with 1 life" />
  <gamegenie code="TAUYPTLA" description="Start with 6 lives" />
  <gamegenie code="PAUYPTLE" description="Start with 9 lives" />
  <gamegenie code="ZUNNLZLT" description="Start with 50 Bullets" />
  <gamegenie code="LTEYALZL" description="Start with 99 Grenades" />
  <gamegenie code="PPEYALZU" description="Start with 25 Grenades" />
</game>
<game code="CLV-H-KMPCU" name="Ikari Warriors II: Victory Road" crc="4F467410">
  <gamegenie code="OUOUIUOO" description="Infinite health" />
  <gamegenie code="GXOLYLST" description="Don't take damage from most enemies" />
  <gamegenie code="AUNYIYAT" description="Start with half normal health" />
  <gamegenie code="OZUXVEPV" description="Maximum weapon power on pick-up (1 of 2)" />
  <gamegenie code="GAUXNAPA" description="Maximum weapon power on pick-up (2 of 2)" />
</game>
<game code="CLV-H-SDPGF" name="Ikari Warriors III: The Rescue" crc="567E1620">
  <gamegenie code="SZKLUZAX" description="Invincibility" />
  <gamegenie code="SLSUNESO" description="Infinite energy" />
  <gamegenie code="PEOKUALA" description="Start with 1 life" />
  <gamegenie code="TEOKUALA" description="Start with 6 lives" />
  <gamegenie code="PEOKUALE" description="Start with 9 lives" />
  <gamegenie code="PEXKZLLA" description="1 life after continue" />
  <gamegenie code="TEXKZLLA" description="6 lives after continue" />
  <gamegenie code="PEXKZLLE" description="9 lives after continue" />
  <gamegenie code="AEUGNYPA" description="Infinite lives" />
  <gamegenie code="SUUKKNSO" description="Infinite lives (alt)" />
  <gamegenie code="YESKVGPA" description="3-way firing, instead of punching" />
  <gamegenie code="PESKVGPE" description="Always throw grenades instead of punches" />
  <gamegenie code="GZSUOAST" description="Immune to most kicks and punches" />
</game>
<game code="CLV-H-OPCMK" name="Image Fight" crc="058F23A2">
  <gamegenie code="ENKXYGEI" description="Invincibility (1 of 2)" />
  <gamegenie code="ENOPLPEI" description="Invincibility (2 of 2)" />
  <gamegenie code="SXSZTPVG" description="Infinite lives - both players" />
  <gamegenie code="PAVXLPLA" description="Start with 1 life - both players" />
  <gamegenie code="TAVXLPLA" description="Start with 6 lives - both players" />
  <gamegenie code="PAVXLPLE" description="Start with 9 lives - both players" />
  <gamegenie code="PAVZLPAA" description="Start at Combat Simulation Stage 2" />
  <gamegenie code="ZAVZLPAA" description="Start at Combat Simulation Stage 3" />
  <gamegenie code="LAVZLPAA" description="Start at Combat Simulation Stage 4" />
  <gamegenie code="GAVZLPAA" description="Start at Combat Simulation Stage 5" />
  <gamegenie code="IAVZLPAA" description="Start at Real Combat - 1st Target" />
  <gamegenie code="TAVZLPAA" description="Start at Real Combat - 2nd Target" />
  <gamegenie code="ATSLTKOZ" description="Never lose Pods" />
  <gamegenie code="PAELGGAA" description="Start with V Cannon" />
  <gamegenie code="ZAELGGAA" description="Start with Reflecting Ball" />
  <gamegenie code="LAELGGAA" description="Start with Drilling Laser" />
  <gamegenie code="GAELGGAA" description="Start with Seeking Missile" />
  <gamegenie code="IAELGGAA" description="Start with Seeking Laser" />
</game>
<game code="CLV-H-CRBTA" name="Immortal, Will Harvey Presents The" crc="8889C564">
  <gamegenie code="GZOLIXVK" description="Enemy's fatigue level doesn't go down" />
  <gamegenie code="GZOUIXVK" description="Your fatigue level doesn't go down" />
  <gamegenie code="YLEUIXYN" description="Your fatigue level goes down faster" />
  <gamegenie code="NYEUIXYN" description="Your fatigue level goes down slower" />
  <gamegenie code="SZSLTXVK" description="Don't lose energy from fighting" />
  <gamegenie code="SZNLPXVV" description="Your fatigue level never rises" />
  <gamegenie code="ZAKSIYPA" description="More damage from fireballs" />
</game>
<game code="CLV-H-JKPCK" name="Incredible Crash Dummies, The" crc="A80A0F01">
  <gamegenie code="EIUXYYEY" description="Invincibility" />
  <gamegenie code="KZVGGNKE" description="Infinite health" />
  <gamegenie code="KZNKANKE" description="Infinite lives" />
</game>
<game code="CLV-H-KSKUA" name="Indiana Jones and The Last Crusade" crc="8BCA5146">
  <gamegenie code="SAOOLOIE" description="Infinite health" />
</game>
<game code="CLV-H-NUWUY" name="Indiana Jones and the Temple of Doom" crc="A0C31A57">
  <gamegenie code="SZEXOKVK" description="Infinite lives" />
  <gamegenie code="SZXZAEVK" description="Infinite time" />
  <gamegenie code="AEKLULGA" description="Start with 1 life" />
  <gamegenie code="PEKLULGE" description="Start with 10 lives" />
  <gamegenie code="TEKLULGE" description="Start with 15 lives" />
  <gamegenie code="SZSZGUVK" description="Always keep Sword" />
  <gamegenie code="SZUXZVVK" description="Always keep Gun" />
  <gamegenie code="PPKLEKYA" description="Start on level 2" />
  <gamegenie code="IPKLEKYA" description="Start on level 4" />
  <gamegenie code="PPKLEKYE" description="Start on level 6" />
  <gamegenie code="IPKLEKYE" description="Start on level 8" />
  <gamegenie code="GLKUXGLV" description="Start with less time (1 of 3)" />
  <gamegenie code="LVEXUUGL" description="Start with less time (2 of 3)" />
  <gamegenie code="LTOXVKGL" description="Start with less time (3 of 3)" />
</game>
<game code="CLV-H-VZXDM" name="Infiltrator" crc="DF64963B">
  <gamegenie code="ZPSLPXZA" description="Start with more Grenades" />
  <gamegenie code="IASLPXZA" description="Start with fewer Grenades" />
  <gamegenie code="AASLPXZA" description="Start with no Grenades" />
  <gamegenie code="LPKUIZTZ" description="Start with less Spray" />
  <gamegenie code="AAKUIZTZ" description="Start with no Spray" />
  <gamegenie code="SXKXXIVG" description="Never lose Grenades outside buildings" />
  <gamegenie code="SZVKAIVG" description="Never lose Grenades inside buildings" />
  <gamegenie code="SXUXKIVG" description="Never lose Spray outside buildings" />
  <gamegenie code="SZUKYIVG" description="Never lose Spray inside buildings" />
  <gamegenie code="SZKLIKVK" description="Infinite time" />
  <gamegenie code="ILOULXPL" description="Start with less time" />
</game>
<game code="CLV-H-ECVPC" name="Iron Tank: The Invasion of Normandy" crc="B14EA4D2">
  <gamegenie code="SLUVKESO" description="Infinite energy" />
  <gamegenie code="OIOGIIPA" description="Start with X lives (1 of 2)" />
  <gamegenie code="SXUKTKVK" description="Infinite lives (2 of 2)" />
  <gamegenie code="AAUKGGZA" description="Start with 1 life (2 of 2)" />
  <gamegenie code="IAUKGGZA" description="Start with 6 lives (2 of 2)" />
  <gamegenie code="AAUKGGZE" description="Start with 9 lives (2 of 2)" />
</game>
<game code="CLV-H-UMCZU" name="Isolated Warrior" crc="6944A01A">
  <gamegenie code="OXOPKZAU" description="Invincibility (1 of 3)" />
  <gamegenie code="SEOPVZSZ" description="Invincibility (2 of 3)" />
  <gamegenie code="UVKTAYXZ" description="Invincibility (3 of 3)" />
  <gamegenie code="XTVSGGTX" description="Infinite health" />
  <gamegenie code="PAXTIZLA" description="Start with 1 life" />
  <gamegenie code="TAXTIZLA" description="Start with 6 lives" />
  <gamegenie code="PAXTIZLE" description="Start with 9 lives" />
  <gamegenie code="SZUVPAVG" description="Infinite lives" />
  <gamegenie code="SZXOXSVK" description="Infinite Bombs" />
  <gamegenie code="AASVTXPA" description="Start with maximum health and Bombs" />
  <gamegenie code="TEOAAYZA" description="More health restored on pick-up" />
  <gamegenie code="PEOAAYZA" description="Less health restored on pick-up" />
  <gamegenie code="VANEYESE" description="Start on Scene X (1 of 3)" />
  <gamegenie code="VEEAZESE" description="Start on Scene X (2 of 3)" />
  <gamegenie code="PANEGAAA" description="Start on Scene 2 (3 of 3)" />
  <gamegenie code="ZANEGAAA" description="Start on Scene 3 (3 of 3)" />
  <gamegenie code="LANEGAAA" description="Start on Scene 4 (3 of 3)" />
  <gamegenie code="GANEGAAA" description="Start on Scene 5 (3 of 3)" />
  <gamegenie code="IANEGAAA" description="Start on Scene 6 (3 of 3)" />
</game>
<game code="CLV-H-VTQGE" name="Super Off Road, Ivan &quot;Ironman&quot; Stewart's" crc="4B041B6B">
  <gamegenie code="AEKISPPA" description="Infinite nitro boosts" />
  <gamegenie code="TEKTYGAA" description="Lots of money and full equipment" />
  <gamegenie code="AAUEIEPP" description="Computer starts with no nitro boosts" />
  <gamegenie code="ZLUEIEPP" description="Computer starts with double nitro boosts" />
  <gamegenie code="ZLEVZSPP" description="Start with double nitro boosts" />
  <gamegenie code="EINSUZEP" description="Drive through walls (1 of 3)" />
  <gamegenie code="EIVINGEP" description="Drive through walls (2 of 3)" />
  <gamegenie code="ESSISZEP" description="Drive through walls (3 of 3)" />
  <gamegenie code="PENTYGLA" description="Start with 1 life" />
  <gamegenie code="GGUTGGOU" description="Infinite money (1 of 3)" />
  <gamegenie code="GGUTIGAV" description="Infinite money (2 of 3)" />
  <gamegenie code="KTUTTKAL" description="Infinite money (3 of 3)" />
</game>
<game code="CLV-H-NXMCB" name="Jackal" crc="1D5B03A5">
  <gamegenie code="ASUVZIEI" description="Invincibility - both players" />
  <gamegenie code="SZPTSI" description="Infinite lives - both players" />
  <gamegenie code="PAPKXZ" description="Start with 1 life - both players" />
  <gamegenie code="PAPKXX" description="Start with 9 lives - both players" />
  <gamegenie code="GXZTSG" description="Keep weapons after death" />
  <gamegenie code="LEZTKG" description="Full weapons after death" />
</game>
<game code="CLV-H-QCNKW" name="Jackie Chan's Action Kung Fu" crc="45A41784">
  <gamegenie code="ESSINLEY" description="Invincibility" />
  <gamegenie code="VXEGXXSE" description="Infinite health" />
  <gamegenie code="PTYSEK" description="Take less damage" />
  <gamegenie code="GKKEAZSK" description="Hit anywhere (1 of 3)" />
  <gamegenie code="OVKEPXPA" description="Hit anywhere (2 of 3)" />
  <gamegenie code="XEKEZZEP" description="Hit anywhere (3 of 3)" />
  <gamegenie code="AEOTTIGA" description="Multi-jump" />
  <gamegenie code="PESIKYYE" description="9 Tornado Attacks on pick-up" />
  <gamegenie code="PESIVYYE" description="9 360o Spin Kicks on pick-up" />
  <gamegenie code="PESINYYE" description="9 Sky Attacks on pick-up" />
  <gamegenie code="AESIKYYA" description="0 Tornado Attacks on pick-up" />
  <gamegenie code="AESISNPA" description="0 180o Spin Kicks on pick-up" />
  <gamegenie code="AESIVYYA" description="0 360o Spin Kicks on pick-up" />
  <gamegenie code="AESINYYA" description="0 Sky Attacks on pick-up" />
  <gamegenie code="SXSKEXVK" description="Infinite special attacks" />
  <gamegenie code="TAVGXZZA" description="Max health from Energy Bowl" />
  <gamegenie code="PAVGXZZA" description="Less health from Energy Bowl" />
</game>
<game code="CLV-H-ZAKXS" name="James Bond Jr." crc="F6898A59">
  <gamegenie code="EINLYPEY" description="Invincibility (1 of 2)" />
  <gamegenie code="EYNUYPEI" description="Invincibility (2 of 2)" />
  <gamegenie code="SZNYASSO" description="Infinite health" />
  <gamegenie code="PANTTATA" description="Start with 2 lives" />
  <gamegenie code="TANTTATE" description="Start with 15 lives" />
  <gamegenie code="SXEKSOVK" description="Infinite lives" />
  <gamegenie code="XVOTAEXE" description="Start with some weapons" />
  <gamegenie code="AANNSLPA" description="Infinite weapons (Bombs, Flares, Nukes, Bullets)" />
  <gamegenie code="YUSOENYO" description="Slow down rate of air loss (scuba mode)" />
  <gamegenie code="YESOENYO" description="Speed up rate of air loss" />
  <gamegenie code="GZUYZIST" description="Shield doesn't take damage from bullets" />
  <gamegenie code="GZVYPIST" description="Immune to most damage" />
</game>
<game code="CLV-H-MQECN" name="Jaws" crc="27D14A54">
  <gamegenie code="SZSATSVK" description="Infinite lives" />
  <gamegenie code="SZVEYNSE" description="Infinite shells" />
  <gamegenie code="SZSELSTK" description="Don't lose shells on dying" />
  <gamegenie code="SZSETSVK" description="Don't lose power on dying" />
  <gamegenie code="AEKEPIGP" description="Jaws has no health (1 of 3)" />
  <gamegenie code="AESEGZGP" description="Jaws has no health (2 of 3)" />
  <gamegenie code="SZKEISSE" description="Jaws has no health (3 of 3)" />
  <gamegenie code="AEEZITIA" description="99 Shells on pick-up" />
  <gamegenie code="AAOOEPIP" description="Hit anywhere" />
  <gamegenie code="AANZPTTZ" description="Collect shells from anywhere" />
  <gamegenie code="AEVZTVZZ" description="Collect Stars from anywhere" />
  <gamegenie code="AENXLSTP" description="Collect Crabs from anywhere" />
  <gamegenie code="ASXILLEP" description="Hit anywhere - bonus stages (1 of 3)" />
  <gamegenie code="GXKITLEL" description="Hit anywhere - bonus stages (2 of 3)" />
  <gamegenie code="GXKIZLEI" description="Hit anywhere - bonus stages (3 of 3)" />
  <gamegenie code="PEOAGZLA" description="Start with 1 life" />
  <gamegenie code="TEOAGZLA" description="Start with double lives" />
</game>
<game code="CLV-H-LQLSB" name="Jetsons, The: Cogswell's Caper" crc="2BF61C53">
  <gamegenie code="SZSLXVVK" description="Infinite lives" />
  <gamegenie code="IEEPPILA" description="Better start (more lives and hearts)" />
  <gamegenie code="GXVLEVVK" description="Don't lose extra hearts on dying" />
  <gamegenie code="ZEVEZLPA" description="2 power packs on pick-up" />
  <gamegenie code="IEVEZLPA" description="5 power packs on pick-up" />
  <gamegenie code="AUEOGIAP" description="Start with 30 powerpacks" />
  <gamegenie code="ASEOGIAP" description="Start with 50 powerpacks" />
  <gamegenie code="AAKAIGTA" description="Small hearts gives full health" />
  <gamegenie code="SZEELUVK" description="Infinite hearts" />
  <gamegenie code="GXUENESE" description="Defenses don't use up powerpacks" />
  <gamegenie code="IAUAKAAZ" description="Shield uses fewer powerpacks" />
  <gamegenie code="ZENEIYAP" description="Flashlight uses fewer powerpacks" />
</game>
<game code="CLV-H-GALYO" name="Jimmy Connors Tennis" crc="00E95D86">
  <gamegenie code="AEVTIPLA" description="Only need 15 points to win game" />
  <gamegenie code="PEVTIPLA" description="Only need 30 points to win game" />
  <gamegenie code="ZEVTIPLA" description="Only need 40 points to win game" />
  <gamegenie code="AEEVAZTA" description="Only need 1 game to win set instead of 6" />
  <gamegenie code="PEEVAZTA" description="Only need 2 games to win set" />
  <gamegenie code="ZEEVAZTA" description="Only need 3 games to win set" />
  <gamegenie code="GEEVAZTA" description="Only need 4 games to win set" />
  <gamegenie code="IEEVAZTA" description="Only need 5 games to win set" />
  <gamegenie code="EEVVIPEI" description="Must get 2 points after 40 to win and no deuces (always shows advantage after 40)" />
  <gamegenie code="PEKVGPZA" description="Don't need to win by 2 to win tiebreaker" />
  <gamegenie code="ZEUVIPYA" description="2 points needed to win tiebreaker instead of 7" />
  <gamegenie code="LEUVIPYA" description="3 points needed to win tiebreaker" />
  <gamegenie code="GEUVIPYA" description="4 points needed to win tiebreaker" />
  <gamegenie code="IEUVIPYA" description="5 points needed to win tiebreaker" />
  <gamegenie code="TEUVIPYA" description="6 points needed to win tiebreaker" />
  <gamegenie code="ZEUVIPYE" description="10 points needed to win tiebreaker" />
</game>
<game code="CLV-H-UXIOX" name="Joe &amp; Mac" crc="26D3082C">
  <gamegenie code="ESXIZTEY" description="Invincibility (1 of 2)" />
  <gamegenie code="ENXSGTEI" description="Invincibility (2 of 2)" />
  <gamegenie code="SZKVOKVK" description="Infinite health" />
  <gamegenie code="PEUXYALA" description="Start with 1 life instead of 3 - P1" />
  <gamegenie code="IEUXYALA" description="Start with 5 lives - P1" />
  <gamegenie code="YEUXYALA" description="Start with 7 lives - P1" />
  <gamegenie code="PEUXYALE" description="Start with 9 lives - P1" />
  <gamegenie code="SZNXTEVK" description="Infinite lives - both players" />
  <gamegenie code="SZKVOKVK" description="Protection from most enemy hits" />
  <gamegenie code="SXUVYVVK" description="Protection from water" />
  <gamegenie code="AEXZGLAO" description="Start with 1/2 health (die when bar is 1/2 empty)" />
  <gamegenie code="AAKUEAPE" description="Stone axe and flint do more damage to bosses" />
  <gamegenie code="YAKUEAPE" description="Stone axe and flint do a lot more damage to bosses" />
  <gamegenie code="AASLOAZE" description="Stone wheel and boomerang do more damage to bosses" />
  <gamegenie code="APSLOAZA" description="Stone wheel and boomerang do a lot more damage to bosses" />
  <gamegenie code="APSLVAGA" description="Fire does more damage to bosses" />
  <gamegenie code="AZSLVAGA" description="Fire does a lot more damage to bosses" />
  <gamegenie code="SZVTKUSE" description="Apple and hamburger worth nothing" />
  <gamegenie code="AAVTULAO" description="Apple and hamburger restore health to 1/2" />
  <gamegenie code="OVUXZAET" description="Start with stone wheel instead of stone axe - P1" />
  <gamegenie code="XVUXZAET" description="Start with flint instead of stone axe - P1" />
  <gamegenie code="UVUXZAET" description="Start with fire instead of stone axe - P1" />
  <gamegenie code="KVUXZAET" description="Start with boomerang instead of stone axe - P1" />
  <gamegenie code="ZEKZGAAA" description="Start somewhere in level 2" />
</game>
<game code="CLV-H-UONPO" name="Journey to Silius" crc="E2C4EDCE">
  <gamegenie code="OZSXEIEU" description="Hit anywhere (1 of 4)" />
  <gamegenie code="OZVTPYEU" description="Hit anywhere (2 of 4)" />
  <gamegenie code="SXETZNSO" description="Hit anywhere (3 of 4)" />
  <gamegenie code="SZNZESSO" description="Hit anywhere (4 of 4)" />
  <gamegenie code="AEEEIPGA" description="Multi-jump (1 of 2)" />
  <gamegenie code="KXKEPOKK" description="Multi-jump (1 of 2)" />
  <gamegenie code="SZXTSAAX" description="Invincibility (1 of 2)" />
  <gamegenie code="SXUTKAAX" description="Invincibility (2 of 2)" />
  <gamegenie code="SZOAPAVG" description="Invincibility after first hit (blinking)" />
  <gamegenie code="SZUVUZSA" description="Infinite health" />
  <gamegenie code="SZUAUTSA" description="Infinite weapon power" />
  <gamegenie code="YOKSOGZE" description="Start with all six weapons" />
  <gamegenie code="SXNGYLVG" description="Infinite lives" />
  <gamegenie code="PAOSOTLA" description="Start with 1 life" />
  <gamegenie code="TAOSOTLA" description="Start with 6 lives" />
  <gamegenie code="PAOSOTLE" description="Start with 9 lives" />
  <gamegenie code="PEVIULLA" description="1 life after continue" />
  <gamegenie code="TEVIULLA" description="6 lives after continue" />
  <gamegenie code="PEVIULLE" description="9 lives after continue" />
  <gamegenie code="PEKSOGZA" description="Start with Machine Gun" />
  <gamegenie code="GEKSOGZA" description="Start with Laser Gun" />
  <gamegenie code="AEKSOGZE" description="Start with Homing Missiles" />
  <gamegenie code="AOKSOGZA" description="Start with Grenade Launcher" />
  <gamegenie code="IEKSOGZA" description="Start with Machine Gun and Laser Gun" />
  <gamegenie code="OTUVOZSV" description="Protection against most aliens" />
  <gamegenie code="AAXTKAZE" description="Some aliens are tougher" />
  <gamegenie code="PAXTKAZA" description="Some aliens are weaker" />
  <gamegenie code="TOOETOLA" description="Mega-jump" />
  <gamegenie code="AZVALPPA" description="Speed jump (1 of 2)" />
  <gamegenie code="EVNEYENY" description="Speed jump (2 of 2)" />
  <gamegenie code="KVNELEKN" description="Super speed (1 of 2)" />
  <gamegenie code="LPSEYPGA" description="Super speed (2 of 2)" />
</game>
<game code="CLV-H-GHGWB" name="Joust" crc="BE387AF0">
  <gamegenie code="SXXKKZVI" description="Infinite lives" />
  <gamegenie code="PEOGLAIA" description="Start with 1 life" />
  <gamegenie code="ZEOGLAIE" description="Start with 9 lives" />
  <gamegenie code="PASGKGAA" description="Turbo flying" />
  <gamegenie code="GXVKOZSP" description="Heavens above?" />
  <gamegenie code="GXSKTASA" description="Start on last level reached (1 of 3)" />
  <gamegenie code="GXSKGASA" description="Start on last level reached (2 of 3)" />
  <gamegenie code="GXVGGASA" description="Start on last level reached (3 of 3)" />
</game>
<game code="CLV-H-EFAZT" name="Jungle Book, Disney's The" crc="61179BFA">
  <gamegenie code="GZVEOSSE" description="Infinite lives" />
  <gamegenie code="AAVEEYPA" description="Infinite time" />
  <gamegenie code="PENEEIAA" description="Infinite weapons" />
  <gamegenie code="SXXNLKOU" description="Need XX gems to finish levels 1, 3, 4, 7, 9 (1 of 2)" />
  <gamegenie code="ZEKKULAP" description="Need 2 gems to finish levels 1, 3, 4, 7, 9 (2 of 2)" />
  <gamegenie code="GEKKULAP" description="Need 4 gems to finish levels 1, 3, 4, 7, 9 (2 of 2)" />
  <gamegenie code="AEKKULAO" description="Need 8 gems to finish levels 1, 3, 4, 7, 9 (2 of 2)" />
  <gamegenie code="PAEGVGTA" description="Start practice level with 1 life" />
  <gamegenie code="LAEGVGTA" description="Start practice level with 3 lives" />
  <gamegenie code="PAEGVGTE" description="Start practice level with 9 lives" />
  <gamegenie code="PAEGNGIA" description="Start normal level with 1 life" />
  <gamegenie code="LAEGNGIA" description="Start normal level with 3 lives" />
  <gamegenie code="PAEGNGIE" description="Start normal level with 9 lives" />
  <gamegenie code="IAVYZLAA" description="Start with 5 of each weapon" />
  <gamegenie code="APVYZLAA" description="Start with 10 of each weapon" />
  <gamegenie code="AZVYZLAA" description="Start with 20 of each weapon" />
  <gamegenie code="ALVYZLAA" description="Start with 30 of each weapon" />
  <gamegenie code="EPVYZLAA" description="Start with 90 of each weapon" />
</game>
<game code="CLV-H-FFOQP" name="Jurassic Park" crc="3B7F5B3B">
  <gamegenie code="EIUZUAEY" description="Invincibility" />
  <gamegenie code="SZVGZOSE" description="Infinite health" />
  <gamegenie code="GZUXXKVS" description="Infinite ammo on pick-up" />
  <gamegenie code="PAVPAGZE" description="More bullets picked up from small dinosaurs" />
  <gamegenie code="PAVPAGZA" description="Fewer bullets picked up from small dinosaurs" />
  <gamegenie code="GZEULOVK" description="Infinite lives (first two levels only)" />
  <gamegenie code="ATVGZOSA" description="Immune to most attacks" />
  <gamegenie code="VEXASASA" description="3-ball bolas picked up (from small dinosaurs, instead of normal bullets) (1 of 2)" />
  <gamegenie code="VEUAXASA" description="3-ball bolas picked up (from small dinosaurs, instead of normal bullets) (2 of 2)" />
  <gamegenie code="NEXASASA" description="Explosive multi-shots (from small dinosaurs, instead of normal bullets) (1 of 2)" />
  <gamegenie code="NEUAXASA" description="Explosive multi-shots (from small dinosaurs, instead of normal bullets) (2 of 2)" />
</game>
<game code="CLV-H-AKBHR" name="Kabuki: Quantum Fighter" crc="7474AC92">
  <gamegenie code="AVUUZPSZ" description="Invincibility (1 of 2)" />
  <gamegenie code="ESUZGAEY" description="Invincibility (2 of 2)" />
  <gamegenie code="VZNGNNSE" description="Infinite health" />
  <gamegenie code="AAVGKYPA" description="Don't lose a life from health loss" />
  <gamegenie code="AASSAAPA" description="Don't lose a life from timer" />
  <gamegenie code="AENLSLZA" description="Start with 1 life" />
  <gamegenie code="IENLSLZA" description="Start with 6 lives" />
  <gamegenie code="AENLSLZE" description="Start with 9 lives" />
  <gamegenie code="SZVGSNSE" description="Infinite lives" />
  <gamegenie code="PENUXLZA" description="1 continue" />
  <gamegenie code="IENUXLZA" description="6 continues" />
  <gamegenie code="AENUXLZE" description="9 continues" />
  <gamegenie code="SXEUAESU" description="Infinite chip power" />
  <gamegenie code="NYXIZEYU" description="Slower timer" />
  <gamegenie code="YZXIZEYU" description="Faster timer" />
  <gamegenie code="SXEUAESU" description="Special weapons use minimum chip power (1 of 2)" />
  <gamegenie code="AOEUPEYA" description="Special weapons use minimum chip power (2 of 2)" />
  <gamegenie code="YENUNUZE" description="Start with maximum health (1 of 2)" />
  <gamegenie code="YEXLLUZE" description="Start with maximum health (2 of 2)" />
  <gamegenie code="IENUNUZA" description="Start with less health (1 of 2)" />
  <gamegenie code="IEXLLUZA" description="Start with less health (2 of 2)" />
</game>
<game code="CLV-H-FNKQR" name="Karate Kid, The" crc="983948A5">
  <gamegenie code="SZSUYZSA" description="Infinite health" />
  <gamegenie code="SZOEKAVG" description="Infinite chances (lives)" />
  <gamegenie code="AEOASANI" description="Win tournaments automatically" />
  <gamegenie code="PENEZTLA" description="Start with 1 chance" />
  <gamegenie code="TENEZTLA" description="Start with 6 chances" />
  <gamegenie code="PENEZTLE" description="Start with 9 chances" />
  <gamegenie code="SXEXLYVG" description="Infinite Crane Kicks" />
  <gamegenie code="SZNXAYVG" description="Infinite Drum Punches on pick-up" />
  <gamegenie code="ASVOKAEL" description="Hit anywhere (1 of 2)" />
  <gamegenie code="GXVOSALA" description="Hit anywhere (2 of 2)" />
  <gamegenie code="AAKVUGGE" description="Start with 8 Crane Kicks - 1P game" />
  <gamegenie code="AAKVKGGE" description="Start with 8 Crane Kicks - 2P game" />
  <gamegenie code="IAKVSGAA" description="Start with 5 Crane Kicks - P1, one on one game" />
  <gamegenie code="AAUXOGPA" description="Prevent girl from moving in final stage" />
  <gamegenie code="ZAKVVGPA" description="Start on stage 2 - 1P game" />
  <gamegenie code="ZAKVNGPA" description="Start on stage 2 - 2P game" />
  <gamegenie code="LAKVVGPA" description="Start on stage 3 - 1P game" />
  <gamegenie code="LAKVNGPA" description="Start on stage 3 - 2P game" />
  <gamegenie code="GAKVVGPA" description="Start on stage 4 - 1P game" />
  <gamegenie code="GAKVNGPA" description="Start on stage 4 - 2P game" />
</game>
<game code="CLV-H-SHBUA" name="Karnov" crc="548A2C3C">
  <gamegenie code="AESKUKPA" description="Hit anywhere (1 of 3)" />
  <gamegenie code="OXSGOGEU" description="Hit anywhere (2 of 3)" />
  <gamegenie code="SZKKNISP" description="Hit anywhere (3 of 3)" />
  <gamegenie code="ASENYZEI" description="Invincibility after one hit (blinking)" />
  <gamegenie code="SZVKNLSA" description="Invincibility (1 of 3)" />
  <gamegenie code="SXEGXLSA" description="Invincibility (2 of 3)" />
  <gamegenie code="SZNGULSA" description="Invincibility (3 of 3)" />
  <gamegenie code="SXKISXVK" description="Infinite lives" />
  <gamegenie code="ZXLNTS" description="Jump higher" />
  <gamegenie code="GZVZNIVG" description="Infinite time" />
  <gamegenie code="LEEGOYPA" description="Gain 3 of most items" />
  <gamegenie code="NOEGOYPA" description="Gain 97 of most items" />
  <gamegenie code="AEOKSYPA" description="Never lose most items" />
  <gamegenie code="PAUSAAAA" description="Start on stage 2" />
  <gamegenie code="ZAUSAAAA" description="Start on stage 3" />
  <gamegenie code="LAUSAAAA" description="Start on stage 4" />
  <gamegenie code="GAUSAAAA" description="Start on stage 5" />
  <gamegenie code="IAUSAAAA" description="Start on stage 6" />
  <gamegenie code="TAUSAAAA" description="Start on stage 7" />
  <gamegenie code="YAUSAAAA" description="Start on stage 8" />
  <gamegenie code="AAUSAAAE" description="Start on stage 9" />
  <gamegenie code="AAOSIAZA" description="Start with 1 life (1 of 2)" />
  <gamegenie code="AESIVTZA" description="Start with 1 life (2 of 2)" />
  <gamegenie code="IAOSIAZA" description="Start with 6 lives (1 of 2)" />
  <gamegenie code="IESIVTZA" description="Start with 6 lives (2 of 2)" />
  <gamegenie code="AAOSIAZE" description="Start with 9 lives (1 of 2)" />
  <gamegenie code="AESIVTZE" description="Start with 9 lives (2 of 2)" />
</game>
<game code="CLV-H-IFOLW" name="Kick Master" crc="5104833E">
  <gamegenie code="APOSXTSA" description="Invincibility (1 of 3)" />
  <gamegenie code="SZOIOVSE" description="Invincibility (2 of 3)" />
  <gamegenie code="TAOSUTXI" description="Invincibility (3 of 3)" />
  <gamegenie code="SZOIOVSE" description="Infinite health" />
  <gamegenie code="ESUXYPEP" description="Hit anywhere" />
  <gamegenie code="AEVZYTLA" description="Quick level up" />
  <gamegenie code="ITUSLLAT" description="Start with more EXP and magic points" />
  <gamegenie code="PAXSGLLA" description="Start with 1 life" />
  <gamegenie code="IAXSGLLA" description="Start with 5 lives" />
  <gamegenie code="PAXSGLLE" description="Start with 9 lives" />
  <gamegenie code="AXVYEIAG" description="Start with half health" />
  <gamegenie code="EEVYEIAG" description="Start with twice as much health" />
  <gamegenie code="LEVYEIAG" description="Start with very little health" />
  <gamegenie code="OZVZOLEN" description="Invincibility after one hit" />
  <gamegenie code="AAOSOVGL" description="Don't flash at all after getting hit" />
  <gamegenie code="IAOSOVGL" description="Barely flash at all after getting hit" />
  <gamegenie code="IPOSOVGL" description="Don't flash as long after getting hit" />
  <gamegenie code="SUELOISP" description="Infinite magic points" />
  <gamegenie code="SXULYUVK" description="Infinite lives (1 of 2)" />
  <gamegenie code="OXUSZLEN" description="Infinite lives (2 of 2)" />
</game>
<game code="CLV-H-CNBFF" name="Kickle Cubicle" crc="CD10DCE2">
  <gamegenie code="SEEXPAOL" description="Invincibility (1 of 2)" />
  <gamegenie code="SANXAPOL" description="Invincibility (2 of 2)" />
  <gamegenie code="SXEAATVG" description="Infinite lives" />
  <gamegenie code="SXNGSVVK" description="Infinite time" />
  <gamegenie code="ANTKVT" description="Infinite time (alt)" />
  <gamegenie code="YENKXVZA" description="Faster timer" />
  <gamegenie code="YENKXVZE" description="Slower timer" />
  <gamegenie code="ESSATLEY" description="Win level now" />
  <gamegenie code="GZKATXSE" description="Start on land X (1 of 3)" />
  <gamegenie code="GZUISOSE" description="Start on land X (2 of 3)" />
  <gamegenie code="PAUIOPAA" description="Start on land 2 (3 of 3)" />
  <gamegenie code="ZAUIOPAA" description="Start on land 3 (3 of 3)" />
  <gamegenie code="LAUIOPAA" description="Start on land 4 (3 of 3)" />
</game>
<game code="CLV-H-WDJDY" name="Kid Klown in Night Mayor World" crc="8EE7C43E">
  <gamegenie code="EYNZVYEI" description="Invincibility" />
  <gamegenie code="AANAUAPA" description="Infinite lives" />
  <gamegenie code="SZKEOESE" description="Infinite health" />
  <gamegenie code="AAEAUGLA" description="Full health from hearts" />
  <gamegenie code="ZENANLIA" description="Less health from hearts" />
  <gamegenie code="ZENANLIE" description="More health from hearts" />
  <gamegenie code="GXEZYVVV" description="Mega-jump (don't hold jump down too long or you might get stuck)" />
  <gamegenie code="GZSEIYVG" description="Infinite chances in sub-game (press Start to re-enter the main game)" />
</game>
<game code="CLV-H-BIIZW" name="Kid Kool and the Quest for the Seven Wonder Herbs" crc="AA6BB985">
  <gamegenie code="SEVILPSZ" description="Invincibility" />
  <gamegenie code="SZKKXIVG" description="Infinite lives" />
  <gamegenie code="VZOEOGVT" description="Infinite time" />
  <gamegenie code="ELXKKESZ" description="Hit anywhere - Throwing (1 of 2)" />
  <gamegenie code="TIXKSAYA" description="Hit anywhere - Throwing (2 of 2)" />
  <gamegenie code="ESXPZZEY" description="Multi-jump when falling (1 of 5)" />
  <gamegenie code="KOXPLZKS" description="Multi-jump when falling (2 of 5)" />
  <gamegenie code="OKOOYZOX" description="Multi-jump when falling (3 of 5)" />
  <gamegenie code="PEXPPXSG" description="Multi-jump when falling (4 of 5)" />
  <gamegenie code="PXXPAZES" description="Multi-jump when falling (5 of 5)" />
  <gamegenie code="GEXGUALU" description="Press Start to complete the level (1 of 3)" />
  <gamegenie code="LEXGSALU" description="Press Start to complete the level (2 of 3)" />
  <gamegenie code="OXXGXAIK" description="Press Start to complete the level (3 of 3)" />
  <gamegenie code="PAVGIALA" description="Start with one life" />
  <gamegenie code="TAVGIALA" description="Start with double lives" />
  <gamegenie code="PAVGIALE" description="Start with triple lives" />
  <gamegenie code="PASKOILA" description="One life after continue" />
</game>
<game code="CLV-H-SHVAE" name="Kid Niki: Radical Ninja" crc="A9415562">
  <gamegenie code="SZEESTSA" description="Invincibility (glitchy) (1 of 2)" />
  <gamegenie code="SXVEUISA" description="Invincibility (glitchy) (2 of 2)" />
  <gamegenie code="GXSOKIVG" description="Infinite lives" />
  <gamegenie code="NYUEXOEV" description="Higher jump" />
  <gamegenie code="PAOATZLA" description="Start with 1 life" />
  <gamegenie code="TAOATZLA" description="Start with 6 lives" />
  <gamegenie code="AESUEGPA" description="Infinite time" />
  <gamegenie code="GAUELZTA" description="Less time (1 of 2)" />
  <gamegenie code="GEEPOTTA" description="Less time (2 of 2)" />
  <gamegenie code="AANOVZAP" description="Multi-jump (01 of 16)" />
  <gamegenie code="AEEPKXZA" description="Multi-jump (02 of 16)" />
  <gamegenie code="AEOOUXIZ" description="Multi-jump (03 of 16)" />
  <gamegenie code="APEYXNNY" description="Multi-jump (04 of 16)" />
  <gamegenie code="ATENUNNY" description="Multi-jump (05 of 16)" />
  <gamegenie code="AZENENNY" description="Multi-jump (06 of 16)" />
  <gamegenie code="GAEYUNNY" description="Multi-jump (07 of 16)" />
  <gamegenie code="GZEYENNY" description="Multi-jump (08 of 16)" />
  <gamegenie code="IZENONNN" description="Multi-jump (09 of 16)" />
  <gamegenie code="KTEYSNNN" description="Multi-jump (10 of 16)" />
  <gamegenie code="NNOOKXOE" description="Multi-jump (11 of 16)" />
  <gamegenie code="OAENXNNN" description="Multi-jump (12 of 16)" />
  <gamegenie code="OZEYKNNN" description="Multi-jump (13 of 16)" />
  <gamegenie code="PPEYNNNN" description="Multi-jump (14 of 16)" />
  <gamegenie code="SAEYVNNY" description="Multi-jump (15 of 16)" />
  <gamegenie code="YIEYONNY" description="Multi-jump (16 of 16)" />
  <gamegenie code="AOUAESXE" description="Hit anywhere (1 of 3)" />
  <gamegenie code="AVUAOSAG" description="Hit anywhere (3 of 3)" />
  <gamegenie code="ATOKTXSY" description="Hit anywhere (2 of 3)" />
  <gamegenie code="PEVAYPAA" description="Start on round 2 (1 of 2)" />
  <gamegenie code="PEUETPAA" description="Start on round 2 (2 of 2)" />
  <gamegenie code="ZEVAYPAA" description="Start on round 3 (1 of 2)" />
  <gamegenie code="ZEUETPAA" description="Start on round 3 (2 of 2)" />
  <gamegenie code="LEVAYPAA" description="Start on round 4 (1 of 2)" />
  <gamegenie code="LEUETPAA" description="Start on round 4 (2 of 2)" />
  <gamegenie code="GEVAYPAA" description="Start on round 5 (1 of 2)" />
  <gamegenie code="GEUETPAA" description="Start on round 5 (2 of 2)" />
  <gamegenie code="IEVAYPAA" description="Start on round 6 (1 of 2)" />
  <gamegenie code="IEUETPAA" description="Start on round 6 (2 of 2)" />
</game>
<game code="CLV-H-XDCLF" name="King Neptune's Adventure (Unl) [!p]" crc="6ED3BA25">
  <gamegenie code="AEUGLKEY" description="Start with all treasures (removes all items from level)" />
  <gamegenie code="LVUKGGAA" description="Start with 99 Bubble Bombs and Money" />
  <gamegenie code="LTUKSIAA" description="Start with 99 Seahorses and Keys" />
  <gamegenie code="SZSKVVVK" description="Infinite lives" />
  <gamegenie code="SXUILKVK" description="Infinite health (2 of 3)" />
  <gamegenie code="SZNIIVSE" description="Infinite health (3 of 3)" />
  <gamegenie code="SXXSTVVK" description="Infinite health (1 of 3)" />
  <gamegenie code="SXXYSPVG" description="Infinite Bubble Bombs" />
</game>
<game code="CLV-H-NSEPB" name="King's Knight" crc="01B4CA89">
  <gamegenie code="GZVXTPSA" description="Infinite health" />
  <gamegenie code="AOSUAOGE" description="Start with double usual health" />
  <gamegenie code="TESUAOGA" description="Start with half usual health" />
  <gamegenie code="PESUTPAA" description="Start with a better character" />
  <gamegenie code="ZESUTPAA" description="Start with the best character normally possible" />
  <gamegenie code="IESUTPAA" description="Start with a super character, better than normally Possible" />
  <gamegenie code="OTVXAPSV" description="Only lose 1 HP when hit (1 of 2)" />
  <gamegenie code="PAVXPPAP" description="Only lose 1 HP when hit (2 of 2)" />
</game>
<game code="CLV-H-WIJEB" name="Kiwi Kraze: A Bird-Brained Adventure!" crc="563C2CC0">
  <gamegenie code="EIUKGIEY" description="Invincibility" />
  <gamegenie code="XYKTISKN" description="Super-jump" />
  <gamegenie code="SUSKLYVI" description="Infinite lives" />
  <gamegenie code="SZOZIAVG" description="Infinite time" />
  <gamegenie code="SZKGATVG" description="Infinite time underwater" />
  <gamegenie code="AANGLLZA" description="Start with 1 life (and 1 continue)" />
  <gamegenie code="IANGLLZA" description="Start with 6 lives (and 6 continues)" />
  <gamegenie code="AANGLLZE" description="Start with 9 lives (and 9 continues)" />
  <gamegenie code="AAEGNPZA" description="1 life after continue" />
  <gamegenie code="IAEGNPZA" description="6 lives after continue" />
  <gamegenie code="AAEGNPZE" description="9 lives after continue" />
  <gamegenie code="GZEKXPVS" description="Infinite continues" />
  <gamegenie code="GZVKAUSE" description="Start on level X (1 of 2)" />
  <gamegenie code="GAVGYLAA" description="Start on level 2 (2 of 2)" />
  <gamegenie code="AAVGYLAE" description="Start on level 3 (2 of 2)" />
  <gamegenie code="GAVGYLAE" description="Start on level 4 (2 of 2)" />
  <gamegenie code="PPVGYLAA" description="Start on level 5 (2 of 2)" />
</game>
<game code="CLV-H-SEODR" name="KlashBall" crc="F4DFDB14">
  <gamegenie code="IAUUOOAZ" description="Very little team stamina (select the middle team)" />
  <gamegenie code="AGUUOOAZ" description="More team stamina (select the middle team)" />
  <gamegenie code="OPUUOOAX" description="Mega team stamina (select the middle team)" />
  <gamegenie code="GAUUKPZA" description="Power is doubled for the whole team (select the middle team)" />
  <gamegenie code="TAUUKPZA" description="Power is tripled for the whole team (select the middle team)" />
  <gamegenie code="PAUUKPZE" description="Mega power for the whole team (select the middle team)" />
  <gamegenie code="GXEZAVSO" description="Never lose stamina (select the middle team)" />
  <gamegenie code="SZSEZGVT" description="Computer can't score (select the middle team)" />
  <gamegenie code="GZSXTEAU" description="Everyone including computer has 255 skill (select the middle team) (1 of 2)" />
  <gamegenie code="GZSXTESN" description="Everyone including computer has 255 skill (select the middle team) (2 of 2)" />
</game>
<game code="CLV-H-AGJNB" name="Klax" crc="93F3A490">
  <gamegenie code="PAVESGLA" description="Start with 0 drops allowed" />
  <gamegenie code="IAVESGLA" description="Start with 5 drops allowed" />
  <gamegenie code="PANENGGA" description="When starting on level 6, 0 drops allowed" />
  <gamegenie code="IANENGGA" description="When starting on level 6, 5 drops allowed" />
  <gamegenie code="PEOAXGIA" description="When starting on level 11, 0 drops allowed" />
  <gamegenie code="LEOAXGIA" description="When starting on level 11, 3 drops allowed" />
  <gamegenie code="SXXLUGVT" description="Infinite drops" />
</game>
<game code="CLV-H-ZMXRC" name="Knight Rider" crc="EBCFE7C5">
  <gamegenie code="SZXSYTSA" description="Infinite shield" />
  <gamegenie code="SZEXUNVK" description="Infinite missiles" />
  <gamegenie code="GXXZSVVK" description="Infinite laser" />
  <gamegenie code="AEVALAZA" description="Start with 1 life after continue" />
  <gamegenie code="IEVALAZA" description="Start with 6 lives after continue" />
  <gamegenie code="AEVALAZE" description="Start with 9 lives after continue" />
  <gamegenie code="SXXEGEVK" description="Infinite lives (1 of 2)" />
  <gamegenie code="SXKEIEVK" description="Infinite lives (2 of 2)" />
  <gamegenie code="AANKOAZA" description="Start with 1 life (1 of 2)" />
  <gamegenie code="VTNKSESE" description="Start with 1 life (2 of 2)" />
  <gamegenie code="IANKOAZA" description="Start with 6 lives (1 of 2)" />
  <gamegenie code="VTNKSESE" description="Start with 6 lives (2 of 2)" />
  <gamegenie code="SZKZYOSU" description="Start with 99 missiles (1 of 2)" />
  <gamegenie code="LYKXAOTT" description="Start with 99 missiles (2 of 2)" />
  <gamegenie code="SZSZLOSU" description="Start with 99 lasers (1 of 2)" />
  <gamegenie code="PYSZGPGN" description="Start with 99 lasers (2 of 2)" />
  <gamegenie code="SZUZAOSU" description="Start with full gasoline (1 of 2)" />
  <gamegenie code="ATUZPPTV" description="Start with full gasoline (2 of 2)" />
  <gamegenie code="SZUXGOSU" description="Start with full shield (1 of 2)" />
  <gamegenie code="ITUXIOZV" description="Start with full shield (2 of 2)" />
</game>
<game code="CLV-H-NCXCY" name="Krion Conquest, The" crc="03272E9B">
  <gamegenie code="AAKAAPZA" description="Start with 1 life" />
  <gamegenie code="IAKAAPZA" description="Start with 6 lives" />
  <gamegenie code="AAKAAPZE" description="Start with 9 lives" />
  <gamegenie code="SXVLOIVG" description="Infinite lives" />
  <gamegenie code="AEOKYTTP" description="Float spell" />
  <gamegenie code="SXNIVLSA" description="Infinite health" />
  <gamegenie code="PEVGOIGA" description="Quicker supershot" />
  <gamegenie code="GEXYLEAA" description="Less health used on fire spell (1 of 2)" />
  <gamegenie code="IEOYTEPA" description="Less health used on fire spell (2 of 2)" />
  <gamegenie code="EZXEPOOZ" description="Start on stage X (1 of 3)" />
  <gamegenie code="KAXEIPSA" description="Start on stage X (2 of 3)" />
  <gamegenie code="PAXEZPAA" description="Start on stage 2 (3 of 3)" />
  <gamegenie code="ZAXEZPAA" description="Start on stage 3 (3 of 3)" />
  <gamegenie code="LAXEZPAA" description="Start on stage 4 (3 of 3)" />
</game>
<game code="CLV-H-JMGYZ" name="Krusty's Fun House" crc="A0DF4B8F">
  <gamegenie code="PAKATALA" description="Start with 1 life" />
  <gamegenie code="TAKATALA" description="Start with 6 lives" />
  <gamegenie code="PAKATALE" description="Start with 9 lives" />
  <gamegenie code="AAUXAEZA" description="Infinite health" />
  <gamegenie code="AEOXSLPA" description="Pick-up Super Balls instead of Custard Pies" />
  <gamegenie code="TAKELEPA" description="Start with 6 pies" />
  <gamegenie code="ZPKELEPA" description="Start with 18 pies" />
  <gamegenie code="GXKZPKVK" description="Infinite pies - first life only" />
</game>
<game code="CLV-H-TIUSO" name="Kung Fu" crc="D5C64257">
  <gamegenie code="GXSLVYEI" description="Invincibility against knives" />
  <gamegenie code="AUVZEGTA" description="Infinite health (1 of 2)" />
  <gamegenie code="VEVZOKSX" description="Infinite health (2 of 2)" />
  <gamegenie code="SZUAOAAX" description="Infinite time" />
  <gamegenie code="SUAAXA" description="Infinite lives - both players" />
  <gamegenie code="AASGYXOG" description="Hit anywhere" />
  <gamegenie code="SEZEGG" description="Give P2 an advantage" />
  <gamegenie code="AEVXLSPT" description="Enemies easier to shrug off" />
  <gamegenie code="ZEVXPIGE" description="Enemies harder to shrug off" />
  <gamegenie code="LEEXSYPA" description="Normal enemies do more damage" />
  <gamegenie code="XYUXEUZK" description="Knife thrower harder to beat" />
  <gamegenie code="GZVKIYSA" description="Don't die when time runs out (1 of 2)" />
  <gamegenie code="ATVKYNGG" description="Don't die when time runs out (2 of 2)" />
  <gamegenie code="AVOZLNGG" description="Enemies die when trying to grab you (1 of 4)" />
  <gamegenie code="GXKZTIEI" description="Enemies die when trying to grab you (2 of 4)" />
  <gamegenie code="KVKXPSIK" description="Enemies die when trying to grab you (3 of 4)" />
  <gamegenie code="SXKXZIVZ" description="Enemies die when trying to grab you (4 of 4)" />
  <gamegenie code="PEZELG" description="Start with 1 life - both players" />
  <gamegenie code="PEZELK" description="Start with 9 lives - both players" />
  <gamegenie code="GZLATG" description="Start at last level reached - P1" />
  <gamegenie code="GZLEPG" description="Start at last level reached - P2" />
  <gamegenie code="VYNONUNN" description="Walk 2X faster (1 of 2)" />
  <gamegenie code="ZANOVLPA" description="Walk 2X faster (2 of 2)" />
  <gamegenie code="GANOVLPA" description="Walk 4X faster (2 of 2)" />
  <gamegenie code="KYNONUNN" description="Walk 4X faster (2 of 2)" />
</game>
<game code="CLV-H-AWHRX" name="Kung-Fu Heroes" crc="AA74A4D8">
  <gamegenie code="AESLZLPA" description="Infinite lives" />
  <gamegenie code="AAXGYOZA" description="Invincibility (1 of 2)" />
  <gamegenie code="SXNIALAX" description="Hit anywhere (most enemies)" />
  <gamegenie code="AVUSPVSL" description="Invincibility (2 of 2)" />
  <gamegenie code="PASXSPIA" description="Start with 1 life" />
  <gamegenie code="PASXSPIE" description="Start with 9 lives" />
  <gamegenie code="AEVSPAPA" description="Infinite Miracle Kicks" />
  <gamegenie code="GPVZXPAA" description="Start with 20 Miracle Kicks" />
  <gamegenie code="PASZNPLA" description="Use with warp to start with 1 life" />
  <gamegenie code="TASZNPLA" description="Use with warp to start with 6 lives" />
  <gamegenie code="PASZNPLE" description="Use with warp to start with 9 lives" />
  <gamegenie code="ZAXUEGIA" description="2 E-balls for an extra life" />
  <gamegenie code="GAOKOGPA" description="Mega-jumps left and right (1 of 2)" />
  <gamegenie code="KYXGOKNN" description="Mega-jumps left and right (2 of 2)" />
  <gamegenie code="OZSZXPSX" description="Start on Castle X (1 of 2)" />
  <gamegenie code="GASZUOSG" description="Start on Castle 2 (2 of 2)" />
  <gamegenie code="AASZUOSK" description="Start on Castle 3 (2 of 2)" />
  <gamegenie code="GASZUOSK" description="Start on Castle 4 (2 of 2)" />
  <gamegenie code="APSZUOSG" description="Start on Castle 5 (2 of 2)" />
  <gamegenie code="GPSZUOSG" description="Start on Castle 6 (2 of 2)" />
  <gamegenie code="APSZUOSK" description="Start on Castle 7 (2 of 2)" />
  <gamegenie code="GPSZUOSK" description="Start on Castle 8 (2 of 2)" />
</game>
<game code="CLV-H-MKMTR" name="Last Action Hero" crc="E7DA8A04">
  <gamegenie code="SXOLSGTG" description="Infinite health" />
  <gamegenie code="SXXLOGVG" description="Infinite lives" />
  <gamegenie code="SZEVZIVG" description="Infinite continues" />
  <gamegenie code="ESXZLAEY" description="One hit kills on bosses" />
  <gamegenie code="VZSAEYVT" description="Red hearts worth nothing" />
  <gamegenie code="AAUVSTLA" description="Start with 1 life" />
  <gamegenie code="TAUVSTLA" description="Start with 7 lives" />
  <gamegenie code="PAUVSTLE" description="Start with 10 lives" />
  <gamegenie code="AASTAILA" description="Continue with 1 life" />
  <gamegenie code="PASTAILA" description="Continue with 2 lives" />
  <gamegenie code="ZASTAILA" description="Continue with 3 lives" />
  <gamegenie code="AAKTOTZA" description="Start with 0 continues" />
  <gamegenie code="IAKTOTZA" description="Start with 5 continues" />
  <gamegenie code="PAKTOTZE" description="Start with 9 continues" />
  <gamegenie code="ZENTAAAA" description="Start on stage 2 - Hamlet" />
  <gamegenie code="GENTAAAA" description="Start on stage 3 - The House" />
  <gamegenie code="IENTAAAA" description="Start on stage 4 - The Freeway" />
  <gamegenie code="TENTAAAA" description="Start on stage 5 - The Office block" />
  <gamegenie code="YENTAAAA" description="Start on stage 6 - The Helicopter" />
  <gamegenie code="AENTAAAE" description="Start on stage 7 - The Film Premiere" />
  <gamegenie code="PENTAAAE" description="Start on Stage 8 - The Cinema" />
  <gamegenie code="ZENTAAAE" description="Start on the end-of-level bad guy" />
</game>
<game code="CLV-H-JSRPX" name="Last Ninja, The" crc="E353969F">
  <gamegenie code="SXSEEZSA" description="Infinite health" />
  <gamegenie code="EYETYIEI" description="Press Select on controller 2 to skip to next level, A for next screen, B for previous screen" />
</game>
<game code="CLV-H-LTFJZ" name="Last Starfighter, The" crc="6997F5E1">
  <gamegenie code="SZVPATVG" description="Infinite lives - both players" />
  <gamegenie code="PANENLIA" description="Start with 1 life - both players" />
  <gamegenie code="TANENLIA" description="Start with 6 lives - both players" />
  <gamegenie code="PANENLIE" description="Start with 9 lives - both players" />
  <gamegenie code="KEEAVLSA" description="Start with 1 life - P2" />
  <gamegenie code="GXUPLGSA" description="Stop irritating shake" />
  <gamegenie code="GZVENLSA" description="Start on level X - P1 (1 of 3)" />
  <gamegenie code="GZNAOLSA" description="Start on level X - P1 (2 of 3)" />
  <gamegenie code="GAVEKLAA" description="Start on level 5 - P1 (3 of 3)" />
  <gamegenie code="PAVEKLAE" description="Start on level 10 - P1 (3 of 3)" />
  <gamegenie code="IAVEKLAE" description="Start on level 14 - P1 (3 of 3)" />
</game>
<game code="CLV-H-XVMVQ" name="Legacy of the Wizard" crc="F181C021">
  <gamegenie code="GXSVLGVI" description="Never lose items" />
  <gamegenie code="GXVTZYSA" description="Infinite life" />
  <gamegenie code="GXNTYYVG" description="Infinite magic" />
  <gamegenie code="GZKVUASA" description="Shopkeeper forgets to charge" />
  <gamegenie code="OUOVNPOP" description="No enemies" />
  <gamegenie code="AXXYNYZP" description="Xemn's jumping improved" />
  <gamegenie code="PEXNEYLE" description="Xemn's strength tripled" />
  <gamegenie code="AXXNUYGP" description="Menya's jumping improved" />
  <gamegenie code="TEXNKYZA" description="Menya's strength tripled" />
  <gamegenie code="ZXXNNYGO" description="Roas' jumping improved" />
  <gamegenie code="LEUYEYPA" description="Roas' strength tripled" />
  <gamegenie code="AUUYUNZP" description="Lyll's jumping improved" />
  <gamegenie code="LEUYKYPA" description="Lyll's strength tripled" />
  <gamegenie code="GKPSOS" description="Walk through walls" />
</game>
<game code="CLV-H-WXFSQ" name="Legend of Kage, The" crc="BBED6E6E">
  <gamegenie code="SZNPVLSA" description="Invincibility" />
  <gamegenie code="SXVALZVG" description="Infinite lives - both players" />
  <gamegenie code="KEOATAVA" description="Start with 28 lives - both players" />
  <gamegenie code="GASAOLZA" description="Super-ninja-power running ability" />
  <gamegenie code="YAKXYPGE" description="Super-ninja-power jumping ability (1 of 3)" />
  <gamegenie code="YASZAPGE" description="Super-ninja-power jumping ability (2 of 3)" />
  <gamegenie code="YASZPPGE" description="Super-ninja-power jumping ability (3 of 3)" />
  <gamegenie code="AESXNKZA" description="Hit anywhere with Shurikens (1 of 3)" />
  <gamegenie code="AESZUGTP" description="Hit anywhere with Shurikens (2 of 3)" />
  <gamegenie code="AAEZVIGP" description="Hit anywhere with Sword (1 of 3)" />
  <gamegenie code="AAOZXSAA" description="Hit anywhere with Sword (2 of 3)" />
  <gamegenie code="AEXXNKLT" description="Hit anywhere with x (3 of 3)" />
</game>
<game code="CLV-H-SJAWT" name="Legend of the Ghost Lion" crc="04766130">
  <gamegenie code="SZUPNNSE" description="Infinite Courage points" />
  <gamegenie code="SXSKLKSE" description="Buying items for free in most shops (must have enough rubies to purchase the item)" />
  <gamegenie code="SXXKTSSE" description="Infinite Dream points" />
</game>
<game code="CLV-H-PJFCT" name="Legendary Wings" crc="A2194CAD">
  <gamegenie code="PEEALYLA" description="Start with 1 life - P1" />
  <gamegenie code="TEEALYLA" description="Start with 6 lives - P1" />
  <gamegenie code="PEEALYLE" description="Start with 9 lives - P1" />
  <gamegenie code="PANEAYLA" description="Start with 1 life - both players" />
  <gamegenie code="TANEAYLA" description="Start with 6 lives - both players" />
  <gamegenie code="PANEAYLE" description="Start with 9 lives - both players" />
  <gamegenie code="AAEEGLPA" description="Almost infinite health (1 of 2)" />
  <gamegenie code="AEEATIPA" description="Almost infinite health (2 of 2)" />
  <gamegenie code="ZANAIZPA" description="Gain double powers on pick-up (1 of 2)" />
  <gamegenie code="ZEVAPIPA" description="Gain double powers on pick-up (2 of 2)" />
  <gamegenie code="LANAIZPA" description="Gain triple powers on pick-up (1 of 2)" />
  <gamegenie code="ZEVAPZPA" description="Gain triple powers on pick-up (2 of 2)" />
</game>
<game code="CLV-H-SORIO" name="Legends of the Diamond: The Baseball Championship Game" crc="05CE560C">
  <gamegenie code="OZUUZSPX" description="Balls are considered strikes" />
  <gamegenie code="PEKLAIGA" description="1 ball and you walk" />
  <gamegenie code="ZEKLAIGA" description="2 balls and you walk" />
  <gamegenie code="TEKLAIGA" description="6 balls to walk" />
  <gamegenie code="PASUGILA" description="1 strike and you're out (fouls don't count as strikes)" />
  <gamegenie code="ZASUGILA" description="2 strikes and you're out (fouls don't count as strikes)" />
  <gamegenie code="IASUGILA" description="5 strikes and you're out (fouls don't count as strikes)" />
</game>
<game code="CLV-H-OLIEN" name="Lemmings" crc="A69F29FA">
  <gamegenie code="SXUTLAVG" description="Infinite time" />
  <gamegenie code="SZVVTPVG" description="Infinite climbers" />
  <gamegenie code="SXOVAPVG" description="Infinite floaters" />
  <gamegenie code="SXKTYPVG" description="Infinite bombers" />
  <gamegenie code="SZOTPZVG" description="Infinite blockers" />
  <gamegenie code="SZVTPZVG" description="Infinite builders" />
  <gamegenie code="SXXVLZVG" description="Infinite bashers" />
  <gamegenie code="SZETGLVG" description="Infinite miners" />
  <gamegenie code="SZSTYLVG" description="Infinite diggers" />
</game>
<game code="CLV-H-ZFWTF" name="Lethal Weapon" crc="7077B075">
  <gamegenie code="OLSSGSOO" description="Infinite ammo when shooting on the ground" />
  <gamegenie code="AKVIXAAP" description="E restores health completely" />
  <gamegenie code="AEVIXAAP" description="E worth nothing" />
  <gamegenie code="AKKSEAAP" description="Extra ammo restores ammo completely" />
  <gamegenie code="AEKSEAAP" description="Extra ammo worth nothing (if you run out of ammo you can't use gun till next stage)" />
  <gamegenie code="AEUYXAAZ" description="No health lost when falling off screen" />
  <gamegenie code="AKUYXAAZ" description="Falling off screen is fatal" />
  <gamegenie code="NNNISAAU" description="Bullet proof vest lasts longer" />
  <gamegenie code="XVUKOOXK" description="Bullet proof vest lasts until end of stage, except when you die from punches or falling off screen" />
  <gamegenie code="OUSSISOO" description="Infinite ammo when shooting in the air (1 of 2)" />
  <gamegenie code="OUXIPSOO" description="Infinite ammo when shooting in the air (2 of 2)" />
  <gamegenie code="XTUGTXXK" description="Start on Level 2" />
  <gamegenie code="XZUGLXVL" description="Start on Level 3 (1 of 3)" />
  <gamegenie code="LAUGGZNP" description="Start on Level 3 (2 of 3)" />
  <gamegenie code="XTUGIZEK" description="Start on Level 3 (3 of 3)" />
</game>
<game code="CLV-H-ARFFB" name="Life Force" crc="C4BC85A2">
  <gamegenie code="GZKGILVI" description="Infinite lives" />
  <gamegenie code="OXOSPXOV" description="One hit kills most enemies" />
  <gamegenie code="GZSGLTSP" description="Keep pods after death" />
  <gamegenie code="AAUIPXTP" description="Hit anywhere (1 of 4)" />
  <gamegenie code="AAUSTXIA" description="Hit anywhere (2 of 4)" />
  <gamegenie code="ATNILXOZ" description="Hit anywhere (3 of 4)" />
  <gamegenie code="EIKSZZEP" description="Hit anywhere (4 of 4)" />
  <gamegenie code="TKOYVIGX" description="Press Start to finish the level (1 of 2)" />
  <gamegenie code="ZEOYKIPA" description="Press Start to finish the level (2 of 2)" />
  <gamegenie code="PEKGPTAA" description="Start with Speed" />
  <gamegenie code="ZEKGPTAA" description="Start with Missile" />
  <gamegenie code="LEKGPTAA" description="Start with Ripple" />
  <gamegenie code="GEKGPTAA" description="Start with Laser" />
  <gamegenie code="IEKGPTAA" description="Start with Option" />
  <gamegenie code="TEKGPTAA" description="Start with Force Field" />
  <gamegenie code="PEUTSTAA" description="Start at the volcanic stage" />
  <gamegenie code="ZEUTSTAA" description="Start at the prominence stage" />
  <gamegenie code="LEUTSTAA" description="Start at cell stage 2" />
  <gamegenie code="GEUTSTAA" description="Start at the temple stage" />
  <gamegenie code="IEUTSTAA" description="Start at the mechanical city stage" />
  <gamegenie code="PEKVNTLA" description="Start with 1 life" />
  <gamegenie code="TEKVNTLA" description="Start with 6 lives" />
</game>
<game code="CLV-H-TDLCF" name="Little League Baseball Championship Series" crc="859C65E1">
  <gamegenie code="UPEUYLOG" description="Always hit a homerun (press B while the ball is in play) (2 of 2)" />
  <gamegenie code="AGOLPUNI" description="Always hit a homerun (press B while the ball is in play) (1 of 2)" />
  <gamegenie code="OZUITLEN" description="Balls are considered strikes" />
</game>
<game code="CLV-H-PNBGW" name="Little Mermaid, Disney's The" crc="3BE244EF">
  <gamegenie code="ESSGSPEY" description="Invincibility (1 of 2)" />
  <gamegenie code="ESEELPEY" description="Invincibility (2 of 2)" />
  <gamegenie code="SXSGNPVG" description="Invincibility after one hit" />
  <gamegenie code="AASGATZA" description="Start with 1 life" />
  <gamegenie code="IASGATZA" description="Start with 6 lives" />
  <gamegenie code="AASGATZE" description="Start with 9 lives" />
  <gamegenie code="SZSSPLVG" description="Infinite lives" />
  <gamegenie code="GZSILLSA" description="Keep red pearls after dying" />
  <gamegenie code="GZSIILSA" description="Keep green pearls after dying" />
  <gamegenie code="PAKKGTAA" description="Start on stage 2" />
  <gamegenie code="ZAKKGTAA" description="Start on stage 3" />
  <gamegenie code="LAKKGTAA" description="Start on stage 4" />
  <gamegenie code="GAKKGTAA" description="Start on stage 5" />
  <gamegenie code="IAKKGTAA" description="Start on Ursula stage" />
  <gamegenie code="LASIZLAA" description="Get all pearls after dying" />
  <gamegenie code="LAKKGTAA" description="Start with all red pearls (1 of 2)" />
  <gamegenie code="ILKKTVOV" description="Start with all red pearls (2 of 2)" />
  <gamegenie code="LAKKGTAA" description="Start with all green pearls (1 of 2)" />
  <gamegenie code="TLKKTVOV" description="Start with all green pearls (2 of 2)" />
  <gamegenie code="PASGGTLA" description="Start with 1 heart (1 of 2)" />
  <gamegenie code="PAXGAYLA" description="Start with 1 heart (2 of 2)" />
  <gamegenie code="IASGGTLA" description="Start with 5 hearts (1 of 2)" />
  <gamegenie code="IAXGAYLA" description="Start with 5 hearts (2 of 2)" />
</game>
<game code="CLV-H-SIOUE" name="Little Nemo: The Dream Master" crc="5B4B6056">
  <gamegenie code="SXKTGEVK" description="Infinite life" />
  <gamegenie code="SZOKSLVG" description="Infinite lives" />
  <gamegenie code="PEKKSZLA" description="Start with 1 life" />
  <gamegenie code="TEKKSZLA" description="Start with 6 lives" />
  <gamegenie code="PEKKSZLE" description="Start with 9 lives" />
  <gamegenie code="TOKZKNZA" description="Mega-jump" />
  <gamegenie code="GESLYPPA" description="Speed jumps (1 of 2)" />
  <gamegenie code="UYUUIOVN" description="Speed jumps (2 of 2)" />
  <gamegenie code="ZEXLLPPA" description="Super speed (1 of 2)" />
  <gamegenie code="SYEUPOVN" description="Super speed (2 of 2)" />
  <gamegenie code="PEUKOZAA" description="Start on stage 2" />
  <gamegenie code="ZEUKOZAA" description="Start on stage 3" />
  <gamegenie code="LEUKOZAA" description="Start on stage 4" />
  <gamegenie code="GEUKOZAA" description="Start on stage 5" />
  <gamegenie code="IEUKOZAA" description="Start on stage 6" />
  <gamegenie code="TEUKOZAA" description="Start on stage 7" />
  <gamegenie code="YEUKOZAA" description="Start on stage 8" />
</game>
<game code="CLV-H-BJVZZ" name="Little Ninja Brothers" crc="BC7FEDB9">
  <gamegenie code="SXSZXNTS" description="Invincibility to water" />
  <gamegenie code="AIULZPEI" description="Invincibility" />
  <gamegenie code="OLKUAOOO" description="Infinite Life" />
  <gamegenie code="AEEOKZPA" description="Mighty Ball always available" />
  <gamegenie code="OZXONUPX" description="All T-Stars" />
  <gamegenie code="ATUOSUSZ" description="T-Star always available" />
  <gamegenie code="AEUUYKIA" description="Infinite Dragon Kicks" />
  <gamegenie code="AAXIVOZP" description="Quick level up" />
  <gamegenie code="AEOSKPZA" description="Max money after fights" />
  <gamegenie code="AVSIOOSZ" description="Infinite money" />
  <gamegenie code="NYUSKXZE" description="Start with 255 Life" />
  <gamegenie code="ZLUSSZPA" description="Start with 50 Attack" />
</game>
<game code="CLV-H-KXAVY" name="Little Samson" crc="B5E392E2">
  <gamegenie code="APSELZEI" description="Invincibility against enemies" />
  <gamegenie code="GZVEPXSN" description="Infinite health" />
  <gamegenie code="GXOVAGVG" description="Infinite lives" />
  <gamegenie code="ALUAIGEL" description="Hit anywhere" />
  <gamegenie code="AVKXSXVI" description="Collectable items never disappear" />
  <gamegenie code="AOKTPSAE" description="Increase Samson's health gauge" />
  <gamegenie code="AOKTZSAE" description="Increase Kikira's health gauge" />
  <gamegenie code="AXKTLIAP" description="Increase Gamm's health gauge" />
  <gamegenie code="AOKTGIGA" description="Increase K.O.'s health gauge" />
  <gamegenie code="AOKTISAE" description="Increase Samson's health" />
  <gamegenie code="AOKTTSAE" description="Increase Kikira's health" />
  <gamegenie code="AXKTYIAP" description="Increase Gamm's health" />
  <gamegenie code="AOKVAIGA" description="Increase K.O.'s health" />
  <gamegenie code="AAUZEZGE" description="Crystal ball adds 4 units to health gauge" />
  <gamegenie code="AESXVPZE" description="Small hearts give 4 health units" />
</game>
<game code="CLV-H-OGTUX" name="Lode Runner" crc="AF5676DE">
  <gamegenie code="GXOKIGEY" description="Invincibility (1 of 3)" />
  <gamegenie code="GXOGTGEY" description="Invincibility (2 of 3)" />
  <gamegenie code="GZNGLGEY" description="Invincibility (3 of 3)" />
  <gamegenie code="GZNGYIVG" description="Infinite lives" />
  <gamegenie code="PASKLTIA" description="Start with 1 life" />
  <gamegenie code="ZASKLTIE" description="Start with 10 lives" />
  <gamegenie code="APOIGPAL" description="Moonwalk" />
  <gamegenie code="GAUGVGYA" description="Heavy gravity (1 of 2)" />
  <gamegenie code="AAKGEGGA" description="Heavy gravity (2 of 2)" />
</game>
<game code="CLV-H-OGBIB" name="Lone Ranger, The" crc="23D17F5E">
  <gamegenie code="SXSZKPSA" description="Walk anywhere - Overworld" />
  <gamegenie code="ATEXYIST" description="Items are free" />
  <gamegenie code="NNKNTIGV" description="Start with 255 dollars" />
  <gamegenie code="AASXUAPA" description="Infinite regular and silver bullets" />
  <gamegenie code="IEUZTNZA" description="Cheaper silver bullets" />
  <gamegenie code="ZEUZIYIA" description="Cheaper standard bullets" />
  <gamegenie code="ZESYTIIE" description="Start with 10 silver bullet rounds" />
  <gamegenie code="YESYTIIE" description="Start with 15 silver bullet rounds" />
  <gamegenie code="YESYZSZE" description="Start with 15 standard bullet rounds" />
  <gamegenie code="TOSYZSZE" description="Start with 30 standard bullet rounds" />
  <gamegenie code="GZKKYPSA" description="Infinite energy - side views only" />
  <gamegenie code="GZSZNATG" description="Don't lose money when shooting bystanders (1 of 2)" />
  <gamegenie code="GZSXOATT" description="Don't lose money when shooting bystanders (2 of 2)" />
</game>
<game code="CLV-H-FPLOV" name="Low G Man: The Low Gravity Man" crc="93991433">
  <gamegenie code="SZEENESE" description="Infinite life (blinking)" />
  <gamegenie code="SXUEKUVS" description="Infinite Ammo - Secondary Weapon" />
  <gamegenie code="AEXXZELP" description="Hit anywhere (1 of 2)" />
  <gamegenie code="SXVZLAAX" description="Hit anywhere (2 of 2)" />
  <gamegenie code="ATOXTPEY" description="Invincibility (1 of 2)" />
  <gamegenie code="AEOXLOZA" description="Get items from anywhere" />
  <gamegenie code="YZSXTKZZ" description="Invincibility (2 of 2)" />
  <gamegenie code="PEXIZTLA" description="Start with 1 life" />
  <gamegenie code="TEXIZTLA" description="Start with 6 lives" />
  <gamegenie code="PEXIZTLE" description="Start with 9 lives" />
  <gamegenie code="PEOSKALA" description="1 life after continue" />
  <gamegenie code="TEOSKALA" description="6 lives after continue" />
  <gamegenie code="PEOSKALE" description="9 lives after continue" />
  <gamegenie code="SZNIEEVK" description="Infinite lives" />
  <gamegenie code="GZKINOVK" description="Infinite time" />
  <gamegenie code="SZVSKOVK" description="Infinite vehicle fuel" />
  <gamegenie code="AAEZATZE" description="Full life gained from capsules" />
  <gamegenie code="PAEZATZA" description="Less life gained from capsules" />
  <gamegenie code="LAVSKAPA" description="Full EMDP on a new life" />
  <gamegenie code="ZAVIKAAA" description="Full AGM on a new life" />
  <gamegenie code="ZEOZZTLE" description="10 Boomerangs on pick-up" />
  <gamegenie code="ZAVXGTLE" description="10 Fireballs on pick-up" />
  <gamegenie code="ZEUXATLE" description="10 Bombs on pick-up" />
  <gamegenie code="ZESXTTLE" description="10 Waves on pick-up" />
</game>
<game code="CLV-H-LGWZW" name="M.C. Kids" crc="B0EBF3DB">
  <gamegenie code="GXKSUOSE" description="Infinite lives" />
  <gamegenie code="EGETYTIA" description="Infinite hearts" />
  <gamegenie code="GLXEIPEK" description="Multi-jump (1 of 3)" />
  <gamegenie code="OZXEGOSX" description="Multi-jump (2 of 3)" />
  <gamegenie code="XTXETPGE" description="Multi-jump (3 of 3)" />
  <gamegenie code="EKNVYIIA" description="Don't lose Golden Arches when hit" />
  <gamegenie code="AOVEGTGE" description="Super-jump (1 of 2)" />
  <gamegenie code="AEVEPTLA" description="Super-jump (2 of 2)" />
  <gamegenie code="AAVNIVGA" description="Always find all cards in level (1 of 4)" />
  <gamegenie code="OZVNPVSX" description="Always find all cards in level (2 of 4)" />
  <gamegenie code="PAVNZVPP" description="Always find all cards in level (3 of 4)" />
  <gamegenie code="XTVNLTGE" description="Always find all cards in level (4 of 4)" />
  <gamegenie code="AEXALGPA" description="Access any level on map" />
  <gamegenie code="AAKSAYZA" description="1 heart per life (1 of 2)" />
  <gamegenie code="AEKSNPZA" description="1 heart per life (2 of 2)" />
  <gamegenie code="YAKSAYZA" description="8 hearts per life (1 of 2)" />
  <gamegenie code="YEKSNPZA" description="8 hearts per life (2 of 2)" />
  <gamegenie code="PAKILYLA" description="Start with 2 lives" />
  <gamegenie code="TAKILYLA" description="Start with 7 lives" />
  <gamegenie code="PAKILYLE" description="Start with 10 lives" />
</game>
<game code="CLV-H-HDZRR" name="M.U.L.E." crc="0939852F">
  <gamegenie code="GEKALTTA" description="4 'months' for beginner game" />
  <gamegenie code="PEKALTTE" description="9 'months' for beginner game" />
  <gamegenie code="TEXAIVGA" description="6 'months' for standard game" />
  <gamegenie code="GOXAIVGA" description="20 'months' for standard game" />
  <gamegenie code="EPOEPNAI" description="Humanoids start with $400 (1 of 2)" />
  <gamegenie code="PAOETYZA" description="Humanoids start with $400 (2 of 2)" />
  <gamegenie code="AZOEPNAI" description="Humanoids start with $800 (1 of 2)" />
  <gamegenie code="LAOETYZA" description="Humanoids start with $800 (2 of 2)" />
  <gamegenie code="GPUAAYAG" description="Flappers start with $1300 (1 of 2)" />
  <gamegenie code="IAUAIYTA" description="Flappers start with $1300 (2 of 2)" />
  <gamegenie code="EIUAAYAG" description="Flappers start with $2000 (1 of 2)" />
  <gamegenie code="YAUAIYTA" description="Flappers start with $2000 (2 of 2)" />
</game>
<game code="CLV-H-QMKSP" name="M.U.S.C.L.E.: Tag Team Match" crc="8FF31896">
  <gamegenie code="ZESELPLA" description="Set bout length timer to 20" />
  <gamegenie code="TESELPLA" description="Set bout length timer to 60" />
  <gamegenie code="PESELPLE" description="Set bout length timer to 90" />
  <gamegenie code="ZEUOUPPA" description="Computer controlled players jump faster" />
  <gamegenie code="ZASXAAPA" description="Computer controlled players speed up" />
  <gamegenie code="OZUEPZSX" description="Invincibility - P1 team (1 of 2)" />
  <gamegenie code="LTUEZXYG" description="Invincibility - P1 team (2 of 2)" />
</game>
<game code="CLV-H-UYOGD" name="Mach Rider" crc="59977A46">
  <gamegenie code="IVGUEY" description="Never lose bike abilities (colors)" />
  <gamegenie code="VZISZL" description="Infinite lives" />
  <gamegenie code="KKAZNG" description="Infinite energy (1 of 2)" />
  <gamegenie code="UETUXY" description="Infinite energy (2 of 2)" />
  <gamegenie code="KVGLXY" description="Bike never explodes" />
  <gamegenie code="VLTGKZ" description="Infinite shots" />
  <gamegenie code="SXZEIL" description="Super speed (1 of 2)" />
  <gamegenie code="SXLALL" description="Super speed (2 of 2)" />
  <gamegenie code="SZYGYV" description="No winter" />
  <gamegenie code="SZTZSG" description="Infinite time - solo and endurance courses" />
</game>
<game code="CLV-H-JSSWM" name="Mad Max" crc="026E41C5">
  <gamegenie code="NYEYVYAX" description="Start with full food and water" />
  <gamegenie code="AGOYUYEA" description="Start with less ammo" />
  <gamegenie code="SXVAEVVK" description="Infinite ammo" />
  <gamegenie code="AENEPYAP" description="No damage done to car" />
  <gamegenie code="GENEPYAP" description="Less damage done to car" />
  <gamegenie code="AXNEPYAP" description="More damage done to car" />
  <gamegenie code="AAUAUEAA" description="No damage done to you" />
  <gamegenie code="GAUAUEAA" description="Less damage done to you" />
  <gamegenie code="APUAUEAA" description="More damage done to you" />
  <gamegenie code="AVKVLPAZ" description="A better tune-up" />
  <gamegenie code="AANEPZPA" description="Dynamite is free" />
  <gamegenie code="AAVEGZPA" description="Ammo is free" />
  <gamegenie code="GEEATZYA" description="Cheaper arena pass (1 of 2)" />
  <gamegenie code="GLKELZYL" description="Cheaper arena pass (2 of 2)" />
</game>
<game code="CLV-H-UERWY" name="Golgo 13: The Mafat Conspiracy" crc="8A043CD6">
  <gamegenie code="GXOGZZVG" description="Infinite bullets" />
  <gamegenie code="IASGUSZA" description="Fewer bullets on pick-up" />
  <gamegenie code="GPSGUSZA" description="More bullets on pick-up" />
  <gamegenie code="AZNIEXGL" description="Faster timer" />
  <gamegenie code="GZNGOTOY" description="Immune to physical damage" />
  <gamegenie code="GZOKSSON" description="Immune to weapon damage" />
  <gamegenie code="GXNGPOSN" description="Immune to damage in maze" />
  <gamegenie code="XTNIVXXK" description="Infinite time" />
  <gamegenie code="AYNIEXGL" description="Slower timer (1 of 2)" />
  <gamegenie code="AYVISXGL" description="Slower timer (2 of 2)" />
</game>
<game code="CLV-H-BXCAX" name="Magic of Scheherazade, The" crc="92197173">
  <gamegenie code="OTSXLGSV" description="Infinite HP" />
  <gamegenie code="SXEVPLVG" description="Infinite lives" />
  <gamegenie code="TEXAXLLA" description="Get Coins from anywhere" />
  <gamegenie code="OXUYZKPX" description="Invincibility" />
  <gamegenie code="AEEYYGLA" description="Hit anywhere (1 of 5)" />
  <gamegenie code="ALNNIGEP" description="Hit anywhere (2 of 5)" />
  <gamegenie code="SZNNLGSG" description="Hit anywhere (3 of 5)" />
  <gamegenie code="TZNNTKPA" description="Hit anywhere (4 of 5)" />
  <gamegenie code="UGNNGKPE" description="Hit anywhere (5 of 5)" />
  <gamegenie code="PAKTAZLA" description="Start with 1 life" />
  <gamegenie code="TAKTAZLA" description="Start with 6 lives" />
  <gamegenie code="PAKTAZLE" description="Start with 9 lives" />
  <gamegenie code="ZAUTAZIA" description="Start with only 20 Gold Coins" />
  <gamegenie code="POKAOZZU" description="Less energy gained from Bread" />
  <gamegenie code="ZAEEXGIA" description="Less magic gained from Mashroobs" />
  <gamegenie code="SZEAEKVK" description="Never lose Mashroobs" />
</game>
<game code="CLV-H-DIDRN" name="Magmax" crc="81389607">
  <gamegenie code="SZVVYTVG" description="Infinite lives - 1P game" />
  <gamegenie code="AEEVITPA" description="Infinite lives - 2P game" />
  <gamegenie code="AEKGKLZA" description="Start with 1 life - both players" />
  <gamegenie code="IEKGKLZA" description="Start with 6 lives - both players" />
  <gamegenie code="AEKGKLZE" description="Start with 9 lives - both players" />
</game>
<game code="CLV-H-XOGGJ" name="Maniac Mansion" crc="0D9F5BD1">
  <gamegenie code="SEXGKASZ" description="All codes start out as 0000" />
</game>
<game code="CLV-H-OHACF" name="Mappy-Land" crc="83FC38F8">
  <gamegenie code="SZKXITVG" description="Infinite lives" />
  <gamegenie code="AEXXTAZA" description="Start with 1 life" />
  <gamegenie code="IEXXTAZA" description="Start with 6 lives" />
  <gamegenie code="TESXALLA" description="Start with 6 toys" />
  <gamegenie code="PESXALLA" description="Start with 1 toy" />
  <gamegenie code="LESZALAA" description="Start with coins instead of toys" />
  <gamegenie code="PESZALAA" description="Start with fish instead of toys" />
  <gamegenie code="ZESZALAA" description="Start with pots instead of toys" />
</game>
<game code="CLV-H-PDJQW" name="Marble Madness" crc="09874777">
  <gamegenie code="OXVXLZVS" description="Infinite time" />
  <gamegenie code="GOOZPLAA" description="Extra 20 seconds to complete beginner race" />
  <gamegenie code="AXOZPLAE" description="Extra 40 seconds to complete beginner race" />
  <gamegenie code="GXEXTLEL" description="Bonus time not added" />
  <gamegenie code="EYNGALEI" description="Don't break from falling" />
  <gamegenie code="OZGGYO" description="Cannot fall into bottomless pits (1 of 3)" />
  <gamegenie code="SZAEUA" description="Cannot fall into bottomless pits (2 of 3)" />
  <gamegenie code="SZEGPXOX" description="Cannot fall into bottomless pits (3 of 3)" />
</game>
<game code="CLV-H-UTJSV" name="Mario's Time Machine" crc="55DB7E2A">
  <gamegenie code="ZEUUGYAA" description="Get an item after killing one Koopa" />
</game>
<game code="CLV-H-QWQUK" name="Mechanized Attack" crc="5EE6008E">
  <gamegenie code="SXUNPEVK" description="Infinite lives" />
  <gamegenie code="SZUNTOVK" description="Infinite grenades" />
  <gamegenie code="SZEYIOVK" description="Infinite bullets" />
  <gamegenie code="AEVOAPLA" description="Reduce damage by half" />
  <gamegenie code="GPONAOAZ" description="Magazine holds half normal amount of bullets after first magazine used (1 of 2)" />
  <gamegenie code="GPEYLEAZ" description="Magazine holds half normal amount of bullets after first magazine used (2 of 2)" />
</game>
<game code="CLV-H-EMYTG" name="Mega Man" crc="6EE4BB0A">
  <gamegenie code="AAOULKPZ" description="Have all weapons (1 of 4)" />
  <gamegenie code="AEULTXVT" description="Have all weapons (2 of 4)" />
  <gamegenie code="AEXLPPZI" description="Have all weapons (3 of 4)" />
  <gamegenie code="OXXLPZEN" description="Have all weapons (4 of 4)" />
  <gamegenie code="IESZXESN" description="Infinite weapons on pick-up" />
  <gamegenie code="SUSZSASP" description="Infinite weapons on pick-up (alt)" />
  <gamegenie code="AUZYGL" description="One hit kills on bosses" />
  <gamegenie code="PENOAYAA" description="Climb up ladders faster" />
  <gamegenie code="VYXOXENN" description="Climb down ladders faster" />
  <gamegenie code="OZSKPZVK" description="Infinite lives" />
  <gamegenie code="AAOGSOLA" description="One hit kills (1 of 2)" />
  <gamegenie code="ESSUNTEP" description="One hit kills (2 of 2)" />
  <gamegenie code="SZKZGZSA" description="Infinite health" />
  <gamegenie code="AVVXLPSZ" description="Invincibility (except against bosses)" />
  <gamegenie code="TAOOYTGA" description="Mega-jump" />
  <gamegenie code="OXSLEEPV" description="Maximum points for shooting bosses (1 of 2)" />
  <gamegenie code="AUSLOEAZ" description="Maximum points for shooting bosses (2 of 2)" />
  <gamegenie code="GOUOTSAP" description="Multi-jump (1 of 4)" />
  <gamegenie code="GXKPVGEL" description="Multi-jump (2 of 4)" />
  <gamegenie code="SUEPLSPX" description="Multi-jump (3 of 4)" />
  <gamegenie code="SOEPGIVP" description="Multi-jump (4 of 4)" />
  <gamegenie code="SUULTVVN" description="Collectable items never disappear" />
  <gamegenie code="XTXLONEK" description="Enemies always drop X (1 of 2)" />
  <gamegenie code="PGOUONLL" description="Enemies always drop extra lives (2 of 2)" />
  <gamegenie code="AGOUONLL" description="Enemies always drop large health refill (2 of 2)" />
  <gamegenie code="YLOUONLU" description="Enemies always drop large weapon refill (2 of 2)" />
  <gamegenie code="TAXOIOGO" description="Start with half energy" />
  <gamegenie code="AASPLAZA" description="Start with 1 life" />
  <gamegenie code="IASPLAZA" description="Start with 6 lives" />
  <gamegenie code="AASPLAZE" description="Start with 9 lives" />
</game>
<game code="CLV-H-XGSJS" name="Mega Man 2" crc="0FCFC04D">
  <gamegenie code="EIUGVTEY" description="Invincibility" />
  <gamegenie code="AIUGVTEY" description="Invincibility (alt) (1 of 2)" />
  <gamegenie code="SAUGKTSZ" description="Invincibility (alt) (2 of 2)" />
  <gamegenie code="SXXTPSSE" description="Infinite health" />
  <gamegenie code="SXUGTPVG" description="Infinite lives" />
  <gamegenie code="GXETTTEL" description="One hit kills (1 of 2)" />
  <gamegenie code="GZUZGTEL" description="One hit kills (2 of 2)" />
  <gamegenie code="LZVSSZYZ" description="Burst-fire from normal weapon" />
  <gamegenie code="TANAOZGA" description="Power-jumps" />
  <gamegenie code="AANAOZGE" description="Super power-jumps" />
  <gamegenie code="APNAOZGA" description="Mega power-jumps" />
  <gamegenie code="GZKEYLAL" description="Maximum weapon energy on pick-up" />
  <gamegenie code="PGEAKOPX" description="Moonwalking" />
  <gamegenie code="SXSSOISA" description="Infinite Heat Man" />
  <gamegenie code="SXSSNZSA" description="Infinite Air Man" />
  <gamegenie code="SZVIUYSA" description="Infinite Wood Man" />
  <gamegenie code="SZUIKLVG" description="Infinite Bubble Man" />
  <gamegenie code="SZVSNLVG" description="Infinite Quick Man" />
  <gamegenie code="SXKSOLVG" description="Infinite Metal Man" />
  <gamegenie code="SXESKLVG" description="Infinite Clash Man" />
  <gamegenie code="SZNIVGVG" description="Infinite 1" />
  <gamegenie code="SZXTGZVG" description="Infinite 2" />
  <gamegenie code="SZKTALVG" description="Infinite 3" />
  <gamegenie code="AXEAUUSZ" description="Multi-jump (1 of 4)" />
  <gamegenie code="LXEEYIYZ" description="Multi-jump (2 of 4)" />
  <gamegenie code="SEEASLGA" description="Multi-jump (3 of 4)" />
  <gamegenie code="VEEAKLEX" description="Multi-jump (4 of 4)" />
  <gamegenie code="SSNLNKVS" description="Collectable items never disappear" />
  <gamegenie code="OUVVASOO" description="Special items re-appear after being collected" />
  <gamegenie code="ASUNZZEP" description="Enemies always drop x (1 of 2)" />
  <gamegenie code="SSUNLXKK" description="Enemies always drop extra lives (2 of 2)" />
  <gamegenie code="OSUNLXKK" description="Enemies always drop large health refill (2 of 2)" />
  <gamegenie code="SSUNLXKG" description="Enemies always drop large weapon refill (2 of 2)" />
  <gamegenie code="AEVAZEKI" description="Able to access already defeated boss stages" />
  <gamegenie code="TEKAIEGO" description="Start with half health" />
  <gamegenie code="PANALALA" description="Start with 1 life" />
  <gamegenie code="TANALALA" description="Start with 6 lives" />
  <gamegenie code="PANALALE" description="Start with 9 lives" />
</game>
<game code="CLV-H-PQEZF" name="Mega Man 3" crc="603AAA57">
  <gamegenie code="ENXETAEI" description="Invincibility" />
  <gamegenie code="GXVAAASA" description="Infinite health" />
  <gamegenie code="SXVAAASA" description="Infinite health (alt)" />
  <gamegenie code="AEEGXLPA" description="Infinite lives" />
  <gamegenie code="OUNIVVOO" description="Infinite weapons (except Top Man)" />
  <gamegenie code="SXOAZZSA" description="Infinite Top Man" />
  <gamegenie code="AOSYXUAU" description="Hit anywhere (1 of 2)" />
  <gamegenie code="AVSYUUSL" description="Hit anywhere (2 of 2)" />
  <gamegenie code="AEKEZPZA" description="One hit kills" />
  <gamegenie code="YEUKOTGA" description="Mega-jump" />
  <gamegenie code="ASXSTLGP" description="Longer slides" />
  <gamegenie code="NNKIALEE" description="Faster slides" />
  <gamegenie code="NYKGXSGK" description="Move faster" />
  <gamegenie code="ZAKGNIPA" description="Move mega-fast" />
  <gamegenie code="TUOKUIYA" description="Multi-jump (1 of 3)" />
  <gamegenie code="VKUGOIES" description="Multi-jump (2 of 3)" />
  <gamegenie code="GZUKOTEP" description="Multi-jump (3 of 3)" />
  <gamegenie code="SIUUNVVS" description="Collectable items never disappear" />
  <gamegenie code="AEXOXGKI" description="Special items re-appear after being collected" />
  <gamegenie code="EZNLXYEP" description="Enemies always drop x (1 of 3)" />
  <gamegenie code="TANLVNEY" description="Enemies always drop x (2 of 3)" />
  <gamegenie code="IANLUNPA" description="Enemies always drop extra lives (3 of 3)" />
  <gamegenie code="LANLUNPA" description="Enemies always drop large health refill (3 of 3)" />
  <gamegenie code="PANLUNPA" description="Enemies always drop large weapon refill (3 of 3)" />
  <gamegenie code="AAOOGLSI" description="Able to access already defeated boss stages" />
  <gamegenie code="AENKKAZA" description="Start with 1 life" />
  <gamegenie code="IENKKAZA" description="Start with 6 lives" />
  <gamegenie code="AENKKAZE" description="Start with 9 lives" />
  <gamegenie code="PAOONPZA" description="Start with 1 life after continue" />
  <gamegenie code="IAOONPZA" description="Start with 6 lives after continue" />
  <gamegenie code="AAOONPZE" description="Start with 9 lives after continue" />
</game>
<game code="CLV-H-DYRDE" name="Mega Man 4" crc="18A2E74F">
  <gamegenie code="GXVEIPSA" description="Infinite health" />
  <gamegenie code="SXVEIPSA" description="Infinite health (alt)" />
  <gamegenie code="SZUGUAVG" description="Infinite lives" />
  <gamegenie code="OUENESOO" description="Infinite weapons" />
  <gamegenie code="GXENESOO" description="Infinite weapon power" />
  <gamegenie code="AEOAIEPA" description="Instant full Mega Buster" />
  <gamegenie code="LXKESKAP" description="Instant full Mega Buster (alt)" />
  <gamegenie code="APKYKXOU" description="Hit anywhere (1 of 2)" />
  <gamegenie code="ATKYSXAZ" description="Hit anywhere (2 of 2)" />
  <gamegenie code="VENOEASZ" description="Always have 10 E-Tanks" />
  <gamegenie code="GXNPZTVG" description="Infinite energy pods on pick-up" />
  <gamegenie code="AAKEYPIE" description="Mega-jump" />
  <gamegenie code="ZOEAIOZP" description="Shorter slides" />
  <gamegenie code="YXEAIOZO" description="Longer slides" />
  <gamegenie code="GEOAGPZA" description="Faster slides" />
  <gamegenie code="ZANKPTPA" description="Faster running (1 of 2)" />
  <gamegenie code="ZEVALLPA" description="Faster running (2 of 2)" />
  <gamegenie code="AUNELEEG" description="Multi-jump (1 of 3)" />
  <gamegenie code="OAEEYPXA" description="Multi-jump (2 of 3)" />
  <gamegenie code="GZUALPEP" description="Multi-jump (3 of 3)" />
  <gamegenie code="AVSUEUVI" description="Collectable items never disappear" />
  <gamegenie code="AAEAGOPY" description="Special items re-appear after being collected" />
  <gamegenie code="AEOLNLTA" description="Enemies always drop x (1 of 3)" />
  <gamegenie code="LEOUXUEY" description="Enemies always drop x (2 of 3)" />
  <gamegenie code="IEOLELGA" description="Enemies always drop large weapon refill (3 of 3)" />
  <gamegenie code="ZEOLELGA" description="Enemies always drop large health refill (3 of 3)" />
  <gamegenie code="AAUKZIZA" description="Start with 1 life" />
  <gamegenie code="IAUKZIZA" description="Start with 6 lives" />
  <gamegenie code="AAUKZIZE" description="Start with 79 lives" />
</game>
<game code="CLV-H-STLXR" name="Mega Man 5" crc="3EDCF7E8">
  <gamegenie code="OLKOYSOO" description="Infinite weapons (1 of 3)" />
  <gamegenie code="OUNUZSOO" description="Infinite weapons (2 of 3)" />
  <gamegenie code="SZSAGZSA" description="Infinite weapons (3 of 3)" />
  <gamegenie code="OVNLZISV" description="Infinite energy for most weapons (1 of 2)" />
  <gamegenie code="OTKPYISV" description="Infinite energy for most weapons (2 of 2)" />
  <gamegenie code="GXSEYZSA" description="Infinite health" />
  <gamegenie code="SAKEZAIA" description="Invincible against spikes" />
  <gamegenie code="GXXAAIVG" description="Infinite lives" />
  <gamegenie code="APOYYEOU" description="Hit anywhere (1 of 2)" />
  <gamegenie code="ATONAEAZ" description="Hit anywhere (2 of 2)" />
  <gamegenie code="AEUAZOIZ" description="One hit kills" />
  <gamegenie code="XAKSUTEA" description="Start with at least 2 energy tanks" />
  <gamegenie code="VAKSUTEA" description="Start with at least 6 energy tanks" />
  <gamegenie code="XASIOTEA" description="Start with at least 2 mega-tanks" />
  <gamegenie code="VASIOTEA" description="Start with at least 6 mega-tanks" />
  <gamegenie code="GXSEPZVG" description="Infinite mega-tanks on pick-up" />
  <gamegenie code="GZSATPVG" description="Infinite energy tanks on pick-up" />
  <gamegenie code="PEVLLPGA" description="Starting weapons use less energy" />
  <gamegenie code="YEXETAIA" description="Super-jump (1 of 2)" />
  <gamegenie code="ONUELEUN" description="Super-jump (2 of 2)" />
  <gamegenie code="PEXETAIA" description="Mega-jump (1 of 2)" />
  <gamegenie code="NNUELEUY" description="Mega-jump (2 of 2)" />
  <gamegenie code="SAKATAIO" description="Multi-jump (1 of 3)" />
  <gamegenie code="EAVEZAXA" description="Multi-jump (2 of 3)" />
  <gamegenie code="GXOAAAEP" description="Multi-jump (3 of 3)" />
  <gamegenie code="ATKXOVVI" description="Collectable items never disappear" />
  <gamegenie code="AEUOVPSI" description="Special items re-appear after being collected" />
  <gamegenie code="ASEZVTEP" description="Enemies always drop large health refill (1 of 2)" />
  <gamegenie code="PEEZETGA" description="Enemies always drop large health refill (2 of 2)" />
</game>
<game code="CLV-H-ADERW" name="Mega Man 6" crc="988798A8">
  <gamegenie code="ESXAKTEY" description="Invincibility" />
  <gamegenie code="SXEAVNSE" description="Infinite health" />
  <gamegenie code="OUXPXVOO" description="Infinite weapons" />
  <gamegenie code="SZVAIZVG" description="Infinite Rush Jet" />
  <gamegenie code="AENAIOPP" description="Enemies always drop items" />
  <gamegenie code="LEVVNGIA" description="Hit anywhere and shoot to pick-up items" />
  <gamegenie code="AEVVUUZA" description="One hit kills (1 of 2)" />
  <gamegenie code="OXVVXLOU" description="One hit kills (2 of 2)" />
  <gamegenie code="SXEEXTVG" description="Infinite lives (can sometimes die and go to another part of the game)" />
  <gamegenie code="GXEAKYST" description="Infinite health (except fires, falling into pits and spikes)" />
  <gamegenie code="LOOEKGPP" description="Normal shots do more damage" />
  <gamegenie code="TOKENGLP" description="Mega shots do more damage" />
  <gamegenie code="AGEEYOYA" description="Multi-jump (1 of 7)" />
  <gamegenie code="EAOAPOEG" description="Multi-jump (2 of 7)" />
  <gamegenie code="EIOAZPIA" description="Multi-jump (3 of 7)" />
  <gamegenie code="PZOAAOSX" description="Multi-jump (4 of 7)" />
  <gamegenie code="SZEETPEI" description="Multi-jump (5 of 7)" />
  <gamegenie code="XGOALPAU" description="Multi-jump (6 of 7)" />
  <gamegenie code="XTOAGOZE" description="Multi-jump (7 of 7)" />
  <gamegenie code="UKXOTXVI" description="Collectable items never disappear" />
  <gamegenie code="AAUKVIZE" description="Start with 9 lives" />
  <gamegenie code="IAUKVIZA" description="Start with 6 lives" />
  <gamegenie code="AAUKVIZA" description="Start with 1 life" />
</game>
<game code="CLV-H-RUEYO" name="Menace Beach (Unl) [!]" crc="194942DB">
  <gamegenie code="ETVVPOAL" description="Infinite health and one hit kills (1 of 5)" />
  <gamegenie code="EYVVLPPP" description="Infinite health and one hit kills (2 of 5)" />
  <gamegenie code="TAVVGPEL" description="Infinite health and one hit kills (3 of 5)" />
  <gamegenie code="XTVVIPZE" description="Infinite health and one hit kills (4 of 5)" />
  <gamegenie code="AAVVZPST" description="Infinite health and one hit kills (levels 1-9, 11, 12 only) (5 of 5)" />
  <gamegenie code="PAVVZPST" description="Infinite health and one hit kills (level 10 only) (5 of 5)" />
  <gamegenie code="OZKYPGSX" description="Multi-jump (1 of 2)" />
  <gamegenie code="XAKYZGZT" description="Multi-jump (2 of 2)" />
</game>
<game code="CLV-H-NTIBC" name="Mendel Palace" crc="12078AFD">
  <gamegenie code="SLSIXXVS" description="Infinite lives" />
  <gamegenie code="AAVZLPZA" description="Start with - 1 life" />
  <gamegenie code="IAVZLPZA" description="Start with - 5 lives" />
  <gamegenie code="AAVZLPZE" description="Start with - 9 lives" />
  <gamegenie code="KEXLXKSE" description="P1 has more lives" />
  <gamegenie code="KEXLSKSE" description="P2 has more lives" />
  <gamegenie code="IEXIAIPA" description="More stars on pick-up" />
  <gamegenie code="SZUIOOSU" description="P1 gains P2's speed-ups (1 of 2)" />
  <gamegenie code="VTUSEOVN" description="P1 gains P2's speed-ups (2 of 2)" />
</game>
<game code="CLV-H-KRWGR" name="Metal Gear" crc="817431EC">
  <gamegenie code="SXVTXZVG" description="Infinite life (1 of 2)" />
  <gamegenie code="SZUYPZVG" description="Infinite life (2 of 2)" />
  <gamegenie code="SXELYGVG" description="Invincible against Gas" />
  <gamegenie code="SZSUVZVG" description="Invincible against Electric Floors" />
  <gamegenie code="SXXXETVG" description="Infinite Rations" />
  <gamegenie code="SZSVVYVG" description="Infinite Handgun ammo" />
  <gamegenie code="KXEVUTKA" description="Infinite Mines" />
  <gamegenie code="VXXVETVA" description="Infinite Explosives" />
  <gamegenie code="VXVVKTVA" description="Infinite Missiles" />
  <gamegenie code="SZKVXYVG" description="Infinite Machine Gun ammo" />
  <gamegenie code="KZEVXYKA" description="Infinite Grenades" />
  <gamegenie code="VXKVNTVA" description="Infinite Rockets" />
  <gamegenie code="AAETIUUT" description="Hit anywhere - Punch (1 of 4)" />
  <gamegenie code="AAOTPUNI" description="Hit anywhere - Punch (2 of 4)" />
  <gamegenie code="AAOVPLNI" description="Hit anywhere - Punch (3 of 4)" />
  <gamegenie code="ASVVYZEP" description="Hit anywhere - Punch (4 of 4)" />
  <gamegenie code="AISNYZEY" description="Hit anywhere - Weapons except Grenade Launcher" />
  <gamegenie code="OZSXKGXX" description="Have all weapons (1 of 3)" />
  <gamegenie code="NYSXSGAE" description="Have all weapons (2 of 3)" />
  <gamegenie code="SASXVGSZ" description="Have all weapons (3 of 3)" />
  <gamegenie code="ZASILYPA" description="Start at mystery location 1" />
  <gamegenie code="GASILYPA" description="Start at mystery location 2" />
  <gamegenie code="SLNIUGSP" description="Enemies never attack or chase you" />
  <gamegenie code="XZVSAYVZ" description="Start with a X boost (1 of 3)" />
  <gamegenie code="PAVSPNTT" description="Start with a X boost (2 of 3)" />
  <gamegenie code="AEKSZYIE" description="Start with a life boost (3 of 3)" />
  <gamegenie code="GEKSZYIE" description="Start with a super life boost (3 of 3)" />
</game>
<game code="CLV-H-FELTF" name="Metal Mech: Man &amp; Machine" crc="05378607">
  <gamegenie code="SZUAXYAX" description="Invincibility" />
  <gamegenie code="SXNPYNSE" description="Infinite health (1 of 2)" />
  <gamegenie code="SZVOEESE" description="Infinite health (2 of 2)" />
  <gamegenie code="SZEYAVVK" description="Infinite lives for Tony" />
  <gamegenie code="PEKSILLA" description="1 life and 1 Smart Bomb" />
  <gamegenie code="TEKSILLA" description="6 lives and 6 Smart Bombs" />
  <gamegenie code="PEKSILLE" description="9 lives and 9 Smart Bombs" />
  <gamegenie code="SZVYISVK" description="Infinite Smart Bombs" />
  <gamegenie code="VNNXTENN" description="Super-jumping Tony" />
  <gamegenie code="ZEEXGAIA" description="Super-speeding Tony" />
  <gamegenie code="PEEXGAIA" description="Mega-speeding Tony" />
  <gamegenie code="AESSAUNY" description="Start on level 2" />
  <gamegenie code="PESSAUNY" description="Start on level 3" />
  <gamegenie code="ZESSAUNY" description="Start on level 4" />
  <gamegenie code="LESSAUNY" description="Start on level 5" />
  <gamegenie code="GESSAUNY" description="Start on level 6" />
</game>
<game code="CLV-H-SRCLC" name="Metal Storm" crc="BCACBBF4">
  <gamegenie code="SXKNAIVG" description="Infinite time" />
  <gamegenie code="SZNTGTSA" description="Invincibility (1 of 2)" />
  <gamegenie code="SZOUIYSA" description="Invincibility (2 of 2)" />
  <gamegenie code="TEXUNLZA" description="Start with 6 lives" />
  <gamegenie code="PEXUNLZE" description="Start with 9 lives" />
  <gamegenie code="AASOYYPA" description="Infinite lives" />
  <gamegenie code="NNNLOLAE" description="Start with extra weapons" />
  <gamegenie code="AVKYPSGL" description="Slower timer" />
  <gamegenie code="AXKYPSGL" description="Faster timer" />
  <gamegenie code="AESTKXGA" description="Permanent Fireball" />
  <gamegenie code="AESXXNGY" description="Permanent Shield" />
</game>
<game code="CLV-H-TWPAO" name="Mickey Mousecapade" crc="7C6A3D51">
  <gamegenie code="ESEPKZEY" description="Invincibility (1 of 2)" />
  <gamegenie code="ESVPNZEY" description="Invincibility (2 of 2)" />
  <gamegenie code="OVOPPTSV" description="Infinite health" />
  <gamegenie code="SZSOPZVG" description="Infinite lives" />
  <gamegenie code="PESOIPGA" description="Start with 2 lives" />
  <gamegenie code="IESOIPGA" description="Start with 6 lives" />
  <gamegenie code="AESOIPGE" description="Start with 9 lives" />
  <gamegenie code="GPSIEVGE" description="Mickey and Minnie can shoot on any level (1 of 2)" />
  <gamegenie code="LAVSVTZA" description="Mickey and Minnie can shoot on any level (2 of 2)" />
</game>
<game code="CLV-H-DJRFZ" name="Micro Machines" crc="9235B57B">
  <gamegenie code="PEKNAYLE" description="Play with 9 lives" />
  <gamegenie code="GXSZZVVK" description="Infinite lives" />
  <gamegenie code="GEKYSZZA" description="Qualify every race" />
  <gamegenie code="PEUYXZLA" description="Ruff Trux after every race" />
  <gamegenie code="PASYNALA" description="Kid out of game after every race" />
  <gamegenie code="GEKNIYAA" description="Start on race 5" />
  <gamegenie code="PEKNIYAE" description="Start on race 10" />
  <gamegenie code="TEKNIYAE" description="Start on race 15" />
  <gamegenie code="LOKNIYAA" description="Start on race 20" />
  <gamegenie code="AOKNIYAE" description="Start on race 25 (Final Race)" />
  <gamegenie code="GESYOZPA" description="Win Championship race" />
  <gamegenie code="AAOEIAIA" description="Faster Boat acceleration" />
  <gamegenie code="AAOEGAIA" description="Faster Sports Car acceleration" />
  <gamegenie code="AAOETAIA" description="Faster Formula 1 acceleration" />
  <gamegenie code="AAOEYAIA" description="Faster Turbo Wheels(tm) acceleration" />
  <gamegenie code="AAXAAAIA" description="Faster 4x4 acceleration" />
  <gamegenie code="AAXAZAZA" description="Faster Tank acceleration" />
  <gamegenie code="AAXALAIA" description="Faster Chopper acceleration" />
  <gamegenie code="AAXATEPA" description="Quicker Boat deceleration" />
  <gamegenie code="AAXAIEPA" description="Quicker Sports Car deceleration" />
  <gamegenie code="AAXAYEPA" description="Quicker Formula 1 deceleration" />
  <gamegenie code="AAXEAEPA" description="Quicker Turbo Wheels deceleration" />
  <gamegenie code="AAXEPEPA" description="Quicker 4x4 deceleration" />
  <gamegenie code="AAXELAZA" description="Quicker Tank deceleration" />
  <gamegenie code="AAXEGEYA" description="Quicker Chopper deceleration" />
  <gamegenie code="YAEAZAPA" description="Higher bounce for Boats" />
  <gamegenie code="IAEAPAPA" description="Higher bounce for Sports cars" />
  <gamegenie code="YAEALAPA" description="Higher bounce for Formula 1's" />
  <gamegenie code="YAEAGAPA" description="Higher bounce for Turbo Wheels" />
  <gamegenie code="YAEAIAPA" description="Higher bounce for 4x4's" />
  <gamegenie code="YAEAYAPA" description="Higher bounce for Tanks" />
  <gamegenie code="POLESS" description="Drive through vehicles" />
</game>
<game code="CLV-H-IOCUQ" name="MIG-29 Soviet Fighter" crc="E62E3382">
  <gamegenie code="AANGGPLA" description="Start with 1 life" />
  <gamegenie code="IANGGPLA" description="Start with 6 lives" />
  <gamegenie code="AANGGPLE" description="Start with 9 lives" />
  <gamegenie code="VYNGGPLE" description="Start with 255 lives" />
  <gamegenie code="SZSSOLVG" description="Keep weapon after death" />
  <gamegenie code="LANKPPAA" description="Start with best weapon" />
  <gamegenie code="NNEOZAAE" description="More time to refuel" />
  <gamegenie code="LEEOZAAA" description="Less time to refuel" />
  <gamegenie code="OZOOYPSX" description="Start on mission X (1 of 3)" />
  <gamegenie code="XIXPZPPS" description="Start on mission X (2 of 3)" />
  <gamegenie code="PAXPAPIP" description="Start on mission 2 (3 of 3)" />
  <gamegenie code="ZAXPAPIP" description="Start on mission 3 (3 of 3)" />
  <gamegenie code="LAXPAPIP" description="Start on mission 4 (3 of 3)" />
  <gamegenie code="GAXPAPIP" description="Start on mission 5 (3 of 3)" />
  <gamegenie code="IAXPAPIP" description="Start on mission 6 (3 of 3)" />
</game>
<game code="CLV-H-ZIOCY" name="Mighty Bomb Jack (U) [!]" crc="08077383">
  <gamegenie code="OXOOYNPX" description="Invincibility" />
  <gamegenie code="SXUPPNSE" description="Invincibility (alt) (1 of 2)" />
  <gamegenie code="SZEOXUSE" description="Invincibility (alt) (2 of 2)" />
  <gamegenie code="SXXALNVK" description="Infinite time" />
  <gamegenie code="PAOEZZLA" description="Start with 1 life" />
  <gamegenie code="TAOEZZLA" description="Start with 6 lives" />
  <gamegenie code="PAOEZZLE" description="Start with 9 lives" />
  <gamegenie code="VZUEZNVK" description="Infinite lives" />
  <gamegenie code="AKOEGYAT" description="Less time in game" />
  <gamegenie code="EEOEGYAT" description="More time in game" />
  <gamegenie code="SXOESEVK" description="Enemies don't return from coin transformation" />
  <gamegenie code="SZEEXUVK" description="Power coins are not used up" />
  <gamegenie code="OESPNTLA" description="Disable torture room" />
  <gamegenie code="ZEUOUAPA" description="Jump through walls" />
</game>
<game code="CLV-H-CNCWB" name="Mighty Final Fight" crc="3F78037C">
  <gamegenie code="EAXKNYAA" description="Invincibility" />
  <gamegenie code="PEVKTYIA" description="Start with 2 lives (doesn't work on continues)" />
  <gamegenie code="LEVKTYIA" description="Start with 4 lives (doesn't work on continues)" />
  <gamegenie code="YEVKTYIA" description="Start with 8 lives (doesn't work on continues)" />
  <gamegenie code="PEVKTYIE" description="Start with 10 lives (doesn't work on continues)" />
  <gamegenie code="SZKSNIVG" description="Infinite lives" />
  <gamegenie code="PENGZYLA" description="Start with 1 credit" />
  <gamegenie code="IENGZYLA" description="Start with 5 credits" />
  <gamegenie code="YENGZYLA" description="Start with 7 credits" />
  <gamegenie code="PENGZYLE" description="Start with 9 credits" />
  <gamegenie code="SZOOLGVG" description="Infinite credits" />
  <gamegenie code="SZXNUPSA" description="Protection from most hazards" />
  <gamegenie code="SZUEAVOU" description="Cody is weaker" />
  <gamegenie code="SZSATVOU" description="Guy is weaker" />
  <gamegenie code="SZNAGVOU" description="Haggar is weaker" />
  <gamegenie code="OXKAXZSX" description="Gain EXP faster (10 pts at a time) (may be displayed incorrectly) (1 of 2)" />
  <gamegenie code="AOKAUZIA" description="Gain EXP faster (10 pts at a time) (may be displayed incorrectly) (2 of 2)" />
  <gamegenie code="OXKAXZSX" description="Gain EXP much faster (20 pts at a time) (may be displayed incorrectly) (1 of 2)" />
  <gamegenie code="AXKAUZIA" description="Gain EXP much faster (20 pts at a time) (may be displayed incorrectly) (2 of 2)" />
  <gamegenie code="ALKGOAAG" description="Cody starts with 3/4 health (1st life only)" />
  <gamegenie code="AZKGOAAG" description="Cody starts with 1/2 health (1st life only)" />
  <gamegenie code="APKGOAAG" description="Cody starts with 1/4 health (1st life only)" />
  <gamegenie code="ALKSKTAG" description="Cody starts with 3/4 health (after 1st life)" />
  <gamegenie code="AZKSKTAG" description="Cody starts with 1/2 health (after 1st life)" />
  <gamegenie code="APKSKTAG" description="Cody starts with 1/4 health (after 1st life)" />
  <gamegenie code="GZKGXAAL" description="Guy starts with 3/4 health (1st life only)" />
  <gamegenie code="APKGXAAU" description="Guy starts with 1/2 health (1st life only)" />
  <gamegenie code="GAKGXAAU" description="Guy starts with 1/4 health (1st life only)" />
  <gamegenie code="GZSIXTAL" description="Guy starts with 3/4 health (after 1st life)" />
  <gamegenie code="APSIXTAU" description="Guy starts with 1/2 health (after 1st life)" />
  <gamegenie code="GASIXTAU" description="Guy starts with 1/4 health (after 1st life)" />
  <gamegenie code="GLKGUAAS" description="Haggar starts with 3/4 health (1st life only)" />
  <gamegenie code="AZKGUAAS" description="Haggar starts with 1/2 health (1st life only)" />
  <gamegenie code="GPKGUAAI" description="Haggar starts with 1/4 health (1st life only)" />
  <gamegenie code="GLSSETAS" description="Haggar starts with 3/4 health (after 1st life)" />
  <gamegenie code="AZSSETAS" description="Haggar starts with 1/2 health (after 1st life)" />
  <gamegenie code="GPSSETAI" description="Haggar starts with 1/4 health (after 1st life)" />
  <gamegenie code="EXSEYIKZ" description="Cody is stronger and has a super-powerful normal punch (1 of 3)" />
  <gamegenie code="IEVAASLT" description="Cody is stronger and has a super-powerful normal punch (2 of 3)" />
  <gamegenie code="AKEASELA" description="Cody is stronger and has a super-powerful normal punch (3 of 3)" />
  <gamegenie code="AGUAKPZA" description="Guy is stronger and has a super-powerful normal punch (1 of 3)" />
  <gamegenie code="EZEAYTKZ" description="Guy is stronger and has a super-powerful normal punch (2 of 3)" />
  <gamegenie code="IAEEAVLT" description="Guy is stronger and has a super-powerful normal punch (3 of 3)" />
  <gamegenie code="EZXAYTKZ" description="Haggar is stronger and has a super-powerful normal punch (1 of 3)" />
  <gamegenie code="LAXEAVLT" description="Haggar is stronger and has a super-powerful normal punch (2 of 3)" />
  <gamegenie code="AKKEUOIA" description="Haggar is stronger and has a super-powerful normal punch (3 of 3)" />
</game>
<game code="CLV-H-EGOLK" name="Mike Tyson's Punch-Out!!" crc="2C818014">
  <gamegenie code="AEEAAAST" description="Invincibility (1 of 2)" />
  <gamegenie code="INUAIZSY" description="Invincibility (2 of 2)" />
  <gamegenie code="ATEALIXZ" description="Infinite health" />
  <gamegenie code="PAXEUPAE" description="Infinite hearts" />
  <gamegenie code="GZKETGST" description="Infinite hearts (alt)" />
  <gamegenie code="ALVAYPEY" description="Start with and have infinite stars" />
  <gamegenie code="AAVEAOTP" description="Infinite stars" />
  <gamegenie code="ALNEVPEY" description="Infinite stars once obtained" />
  <gamegenie code="LASAEPAA" description="Start each round with 3 stars" />
  <gamegenie code="XXXELNVA" description="Infinite time (1 of 2)" />
  <gamegenie code="SUSETNSO" description="Infinite time (2 of 2)" />
  <gamegenie code="SXOEYNVV" description="Infinite time (alt)" />
  <gamegenie code="ATOEXESA" description="No health for opponent (1 of 2)" />
  <gamegenie code="SXKAYKSE" description="No health for opponent (2 of 2)" />
  <gamegenie code="SZSELPAX" description="No health replenishment for opponent" />
  <gamegenie code="SZVAAOIV" description="Take less damage" />
  <gamegenie code="SZVALPAX" description="Take even less damage" />
  <gamegenie code="AAVETLGA" description="Normal punches do more damage" />
  <gamegenie code="YZLOSS" description="Instant win" />
  <gamegenie code="UZLOSS" description="Instant loss" />
  <gamegenie code="AXIONS" description="First knockdown will be a TKO" />
  <gamegenie code="INUAIZSY" description="Opponent cannot block punches" />
  <gamegenie code="ENOZAZPE" description="Skip intro" />
</game>
<game code="CLV-H-YGTVH" name="Millipede" crc="AE52DECE">
  <gamegenie code="SUKGETVI" description="Infinite lives - both players" />
  <gamegenie code="PAVKSPGA" description="Start with 1 life - P1" />
  <gamegenie code="ZAVKSPGE" description="Start with 10 lives - P1" />
  <gamegenie code="ASESIIEZ" description="Increase territory to half screen" />
  <gamegenie code="AXESIIEZ" description="Increase territory to full screen" />
  <gamegenie code="NKESIIEZ" description="Shrink territory" />
  <gamegenie code="ZEUSXYTE" description="Player's bullets move faster" />
  <gamegenie code="LEUSXYTA" description="Player's bullets move slower" />
</game>
<game code="CLV-H-NHYCK" name="Milon's Secret Castle" crc="586A3277">
  <gamegenie code="SZNSLZSA" description="Infinite health" />
  <gamegenie code="AEKGNXAA" description="No health on pick-up" />
  <gamegenie code="AOKGNXAE" description="More health on pick-up" />
  <gamegenie code="ASNPVZLA" description="Floating Milon" />
  <gamegenie code="ASEZZYEI" description="Max power bubbles" />
  <gamegenie code="ESUIGOOG" description="Hit anywhere (1 of 2)" />
  <gamegenie code="GXUIIOAA" description="Hit anywhere (2 of 2)" />
  <gamegenie code="AGSEEZAZ" description="Start with more health" />
  <gamegenie code="AISAOXAL" description="Start with a bigger health bar" />
</game>
<game code="CLV-H-CMHLQ" name="Mission Cobra" crc="5DA9CEC8">
  <gamegenie code="AAESVIGT" description="Infinite health (1 of 3)" />
  <gamegenie code="AANNZPGT" description="Infinite health (2 of 3)" />
  <gamegenie code="AAXIOLGT" description="Infinite health (3 of 3)" />
</game>
<game code="CLV-H-BRQJE" name="Mission: Impossible" crc="E3C5BB3D">
  <gamegenie code="TEOUNKGA" description="Start with less health" />
  <gamegenie code="AOOUNKGA" description="Start with more health" />
  <gamegenie code="SXUETVOU" description="Take less damage" />
  <gamegenie code="ZENETTPA" description="Take more damage" />
  <gamegenie code="ZEULXGIA" description="2 Type B weapons for Nicholas" />
  <gamegenie code="PEULXGIE" description="9 Type B weapons for Nicholas" />
  <gamegenie code="IEXUXKZA" description="5 Type B weapons for Max and Grant" />
  <gamegenie code="YEXUXKZE" description="15 Type B weapons for Max and Grant" />
  <gamegenie code="AAUPIZPA" description="Infinite Type B weapons for all" />
  <gamegenie code="VKOAVOSX" description="Longer disguise time (1 of 2)" />
  <gamegenie code="GAEOPLPA" description="Longer disguise time (2 of 2)" />
</game>
<game code="CLV-H-XYRBC" name="Monopoly" crc="9747AC09">
  <gamegenie code="YLSSOLPU" description="Collect $300 as you pass Go" />
  <gamegenie code="IPSSOLPU" description="Collect $100 as you pass Go" />
  <gamegenie code="AAVZKAYP" description="Pay $0 to get out of jail" />
  <gamegenie code="IPVZKAYO" description="Pay $100 to get out of jail" />
  <gamegenie code="LOOAVKZP" description="Pay $30 for luxury tax" />
  <gamegenie code="IOOAVKZO" description="Pay $100 for luxury tax" />
  <gamegenie code="PUOAVKZP" description="Pay $200 for luxury tax" />
  <gamegenie code="AESAVGPL" description="Pay $0 for income tax" />
  <gamegenie code="LOSAVGPL" description="Pay $30 for income tax" />
  <gamegenie code="IOSAVGPU" description="Pay $100 for income tax" />
  <gamegenie code="YUSAVGPU" description="Pay $300 for income tax" />
  <gamegenie code="YLOSLKLK" description="$300 to buy Boardwalk" />
  <gamegenie code="LIOSLKLG" description="$600 to buy Boardwalk" />
  <gamegenie code="PLOIZGIG" description="$200 to buy Park Place" />
  <gamegenie code="LGOIZGIK" description="$400 to buy Park Place" />
  <gamegenie code="LIOIZGIG" description="$600 to buy Park Place" />
  <gamegenie code="IPOSZGPU" description="Houses on Park Place cost $100" />
  <gamegenie code="YLOSZGPU" description="Houses on Park Place cost $300" />
  <gamegenie code="IPXILGPU" description="Houses on Boardwalk cost $100" />
  <gamegenie code="YLXILGPU" description="Houses on Boardwalk cost $300" />
  <gamegenie code="YAOAILLA" description="Go Back 7 spaces instead of 3 on Chance" />
</game>
<game code="CLV-H-ZGWRC" name="Monster In My Pocket" crc="E542E3CF">
  <gamegenie code="SUKEPSVS" description="Invincibility after first hit (1 of 2)" />
  <gamegenie code="OOVAPTEP" description="Invincibility after first hit (2 of 2)" />
  <gamegenie code="SUSEIVVS" description="Infinite energy" />
  <gamegenie code="SLSAASVS" description="Infinite lives" />
</game>
<game code="CLV-H-WMXRR" name="Monster Party" crc="02B9E7C2">
  <gamegenie code="AVOEZYSZ" description="Invincibility" />
  <gamegenie code="SXXAYYVG" description="Infinite life against normal enemies" />
  <gamegenie code="VVXAIYVG" description="Infinite life against Guardians" />
  <gamegenie code="APUPZSGE" description="Start with double life (1 of 2)" />
  <gamegenie code="AOKPTKGE" description="Start with double life (2 of 2)" />
  <gamegenie code="GZUPZSGE" description="Start with full life (1 of 2)" />
  <gamegenie code="GXKPTKGE" description="Start with full life (2 of 2)" />
  <gamegenie code="EYEEIIEL" description="One hit kills normal enemies" />
  <gamegenie code="AAUEUIZA" description="One hit kills Guardians" />
  <gamegenie code="VNKETXNN" description="Walk twice as fast (1 of 2)" />
  <gamegenie code="ZEUEAZPA" description="Walk twice as fast (2 of 2)" />
  <gamegenie code="VNNAZKNN" description="Jump twice as far (1 of 2)" />
  <gamegenie code="ZESEYGPA" description="Jump twice as far (2 of 2)" />
  <gamegenie code="PAKOZIAA" description="Start on level 2" />
  <gamegenie code="ZAKOZIAA" description="Start on level 3" />
  <gamegenie code="LAKOZIAA" description="Start on level 4" />
  <gamegenie code="GAKOZIAA" description="Start on level 5" />
  <gamegenie code="IAKOZIAA" description="Start on level 6" />
  <gamegenie code="TAKOZIAA" description="Start on level 7" />
  <gamegenie code="YAKOZIAA" description="Start on level 8" />
</game>
<game code="CLV-H-VNVUS" name="Moon Ranger" crc="14A81635">
  <gamegenie code="SXUSGVVK" description="Infinite lives" />
</game>
<game code="CLV-H-JBBQE" name="Motor City Patrol" crc="0A0926BD">
  <gamegenie code="ANOEIOGL" description="Slow down timer" />
  <gamegenie code="YOOEIOGU" description="Speed up timer" />
  <gamegenie code="IAOXILAA" description="Start with 5 merits" />
  <gamegenie code="AEEXGTPA" description="Don't take damage" />
  <gamegenie code="GXUESKVK" description="Free equipment (1 of 2)" />
  <gamegenie code="APUAUGEI" description="Free equipment (2 of 2)" />
</game>
<game code="CLV-H-NAAXT" name="Muppet Adventure: Chaos at the Carnival" crc="7156CB4D">
  <gamegenie code="SZKANZVG" description="Infinite power" />
</game>
<game code="CLV-H-MYREK" name="Mutant Virus, The: Crisis in a Computer World" crc="7DCB4C18">
  <gamegenie code="AEOGTAIA" description="Start with 1 life" />
  <gamegenie code="ZEOGTAIA" description="Start with 3 lives" />
  <gamegenie code="SEOGTAIA" description="Start with 7 lives" />
  <gamegenie code="PEOGTAIE" description="Start with 10 lives" />
  <gamegenie code="AEESZKNY" description="Don't flash after getting hit" />
  <gamegenie code="LVESZKNY" description="Flash 1/2 as long after getting hit" />
  <gamegenie code="SXEKXGVG" description="Invincibility" />
  <gamegenie code="SZKGNUSE" description="Infinite health" />
  <gamegenie code="XVEITKVE" description="Infinite lives" />
  <gamegenie code="VXEITKVE" description="Infinite time" />
</game>
<game code="CLV-H-CNDNX" name="Mystery Quest" crc="B5D28EA2">
  <gamegenie code="GXNPYAVG" description="Invincibility" />
  <gamegenie code="SXNPYAVG" description="Infinite vitality" />
  <gamegenie code="AEXOGEEY" description="Immune to monster attacks" />
  <gamegenie code="AEUOAENY" description="Immune to shallow water" />
  <gamegenie code="ATSEUYAG" description="Start with more vitality" />
  <gamegenie code="AZSEUYAG" description="Start with less vitality" />
  <gamegenie code="PEUOKPAA" description="Start with Raft and Key" />
  <gamegenie code="GXVOOYSA" description="Never lose Key" />
  <gamegenie code="PENOPTAA" description="Never lose Raft" />
</game>
<game code="CLV-H-MJQSF" name="NARC" crc="0537322A">
  <gamegenie code="AENXPOTA" description="Invincibility (blinking) - both players" />
  <gamegenie code="XVXVGLVN" description="Infinite health - both players" />
  <gamegenie code="AAOSUPPA" description="Infinite Bullets" />
  <gamegenie code="AEEILGPA" description="Infinite Missiles" />
  <gamegenie code="SUKVTLVI" description="Infinite lives" />
  <gamegenie code="ASUSNYEY" description="Enemies die automatically (1 of 2)" />
  <gamegenie code="PSKIEYUY" description="Enemies die automatically (2 of 2)" />
  <gamegenie code="AASTAPLA" description="Hit anywhere - P1 (1 of 3)" />
  <gamegenie code="ASKIOYKZ" description="Hit anywhere - P1 (2 of 3)" />
  <gamegenie code="YKKIXYTS" description="Hit anywhere - P1 (3 of 3)" />
  <gamegenie code="AAUAZPZA" description="Start with - 1 life" />
  <gamegenie code="IAUAZPZA" description="Start with - 6 lives" />
  <gamegenie code="AAUAZPZE" description="Start with - 9 lives" />
  <gamegenie code="PUVAGAIU" description="More Missiles" />
  <gamegenie code="PEUZPZIA" description="1 Missile on pick-up" />
  <gamegenie code="PEUZPZIE" description="9 Missiles on pick-up" />
  <gamegenie code="GASPTLZA" description="45 Bullets on pick-up" />
</game>
<game code="CLV-H-SUKOV" name="NES Open Tournament Golf" crc="F6B9799C">
  <gamegenie code="PEUAGVSP" description="Always on first shot" />
  <gamegenie code="SZKINZSA" description="No wind" />
</game>
<game code="CLV-H-QHQZH" name="NES Play Action Football" crc="B9B4D9E0">
  <gamegenie code="TOKYLKYE" description="30-minute quarters" />
  <gamegenie code="ZEKYLKYE" description="10-minute quarters" />
  <gamegenie code="KEKLUNSE" description="No timeouts - P2" />
  <gamegenie code="TEUUNYLA" description="6 timeouts per half (ignore display)" />
  <gamegenie code="PEUUNYLA" description="1 timeout per half" />
</game>
<game code="CLV-H-NIXLX" name="Nigel Mansell's World Championship Racing" crc="4751A751">
  <gamegenie code="GZSULOVV" description="No extra time in the pits" />
  <gamegenie code="GANKXZYA" description="Only need 3 laps in South Africa instead of 6" />
  <gamegenie code="GANKUZYA" description="Only need 3 laps in Mexico instead of 6" />
  <gamegenie code="GANKKZTA" description="Only need 3 laps in Brazil instead of 5" />
  <gamegenie code="GANKSZIA" description="Only need 3 laps in Spain instead of 4" />
  <gamegenie code="GANKVZYA" description="Only need 3 laps in San Marino instead of 6" />
  <gamegenie code="GANKNZTA" description="Only need 3 laps in Monaco instead of 5" />
  <gamegenie code="GEEGEZYA" description="Only need 3 laps in Canada instead of 6" />
  <gamegenie code="GEEGOZIA" description="Only need 3 laps in France instead of 4" />
  <gamegenie code="GEEGXZTA" description="Only need 3 laps in Great Britian instead of 5" />
  <gamegenie code="GEEGUZTA" description="Only need 3 laps in Germany instead of 5" />
  <gamegenie code="GEEGKZTA" description="Only need 3 laps in Hungary instead of 5" />
  <gamegenie code="GEEGSZTA" description="Only need 3 laps in Belgium instead of 5" />
  <gamegenie code="GEEGVZYA" description="Only need 3 laps in Italy instead of 6" />
  <gamegenie code="GEEGNZIA" description="Only need 3 laps in Portugal instead of 4" />
  <gamegenie code="GEEKEZTA" description="Only need 3 laps in Japan instead of 5" />
  <gamegenie code="GEEKOZTA" description="Only need 3 laps in Australia instead of 5" />
  <gamegenie code="AEEKXAAO" description="Start with 1/2 normal tire tread" />
  <gamegenie code="SZSTLEVK" description="Less tire wear" />
  <gamegenie code="PEOXOZAP" description="Full season ends after South Africa" />
  <gamegenie code="ZEOXOZAP" description="Full season ends after Mexico" />
  <gamegenie code="LEOXOZAP" description="Full season ends after Brazil" />
  <gamegenie code="GEOXOZAP" description="Full season ends after Spain" />
  <gamegenie code="IEOXOZAP" description="Full season ends after San Marino" />
  <gamegenie code="TEOXOZAP" description="Full season ends after Monaco" />
  <gamegenie code="YEOXOZAP" description="Full season ends after Canada" />
  <gamegenie code="AEOXOZAO" description="Full season ends after France" />
  <gamegenie code="PEOXOZAO" description="Full season ends after Great Britian" />
  <gamegenie code="ZEOXOZAO" description="Full season ends after Germany" />
  <gamegenie code="LEOXOZAO" description="Full season ends after Hungary" />
  <gamegenie code="GEOXOZAO" description="Full season ends after Belgium" />
  <gamegenie code="IEOXOZAO" description="Full season ends after Italy" />
  <gamegenie code="TEOXOZAO" description="Full season ends after Portugal" />
  <gamegenie code="YEOXOZAO" description="Full season ends after Japan" />
  <gamegenie code="IVSNIOIN" description="Accelerate faster" />
  <gamegenie code="IVSNIOIN" description="Accelerate a lot faster (1 of 2)" />
  <gamegenie code="AAKNALGE" description="Accelerate a lot faster (2 of 2)" />
  <gamegenie code="ZANKXZYA" description="Only need 1 lap on all tracks (1 of 2)" />
  <gamegenie code="SXNKSESU" description="Only need 1 lap on all tracks (2 of 2)" />
  <gamegenie code="SZSTLEVK" description="Almost no tire wear (1 of 2)" />
  <gamegenie code="SZNNXEVK" description="Almost no tire wear (2 of 2)" />
</game>
<game code="CLV-H-OYPJG" name="Nightmare on Elm Street, A" crc="DA2CB59A">
  <gamegenie code="EIOLILEY" description="Invincibility" />
  <gamegenie code="SUUUKNVN" description="Infinite health" />
  <gamegenie code="SUELSUVS" description="Infinite lives" />
  <gamegenie code="SZUPPEVS" description="Infinite 'zzz'" />
  <gamegenie code="EIVKKYEY" description="One hit kills" />
  <gamegenie code="AAOKENIA" description="Hit anywhere (1 of 3)" />
  <gamegenie code="APXGEYEY" description="Hit anywhere (2 of 3)" />
  <gamegenie code="ASNKKTEY" description="Hit anywhere (3 of 3)" />
  <gamegenie code="AEOXAPIA" description="No enemies (1 of 3)" />
  <gamegenie code="OXOZYOSX" description="No enemies (2 of 3)" />
  <gamegenie code="XVOXPPPE" description="No enemies (3 of 3)" />
  <gamegenie code="AESSLAEA" description="Don't lose 'zzz' when hit" />
  <gamegenie code="AAXOLAPA" description="Don't lose 'zzz' when standing still" />
  <gamegenie code="ZAXOLAPA" description="Lose 'zzz' quicker" />
  <gamegenie code="IEULIGLA" description="Mega-jumping teenagers" />
  <gamegenie code="AUKUVPEY" description="Always able to switch characters" />
  <gamegenie code="ESVLNPEY" description="Have all characters (1 of 2)" />
  <gamegenie code="ENSUOPEI" description="Have all characters (2 of 2)" />
  <gamegenie code="SXNTPEVK" description="Freddy will not show up in Nightmare World" />
  <gamegenie code="PAUVEZLA" description="Start with - 1 continue" />
  <gamegenie code="TAUVEZLA" description="Start with - 6 continues" />
  <gamegenie code="PAUVEZLE" description="Start with - 9 continues" />
</game>
<game code="CLV-H-YWQXE" name="Nightshade" crc="A60CA3D6">
  <gamegenie code="TKISGT" description="Invincible in fights" />
  <gamegenie code="TKISAI" description="Invincible out of fights" />
</game>
<game code="CLV-H-SEAKP" name="Ninja Crusaders" crc="3D1C4894">
  <gamegenie code="EYSKYAEI" description="Invincibility" />
  <gamegenie code="GGNKNTEN" description="Hit anywhere (1 of 3)" />
  <gamegenie code="OSEGEVLP" description="Hit anywhere (2 of 3)" />
  <gamegenie code="VKEGOVOU" description="Hit anywhere (3 of 3)" />
  <gamegenie code="GZSXETEY" description="Multi-jump" />
  <gamegenie code="GZOXLTEL" description="Collect items from anywhere (1 of 2)" />
  <gamegenie code="GZXXTTEL" description="Collect items from anywhere (2 of 2)" />
  <gamegenie code="PEOZEALA" description="Start with - 1 life" />
  <gamegenie code="TEOZEALA" description="Start with - 6 lives" />
  <gamegenie code="PEOZEALE" description="Start with - 9 lives" />
  <gamegenie code="SLKKAOVS" description="Infinite lives" />
  <gamegenie code="IZNXNTZP" description="Mega-jump" />
  <gamegenie code="SYXESUVN" description="Super speed (1 of 2)" />
  <gamegenie code="ZAXEULPA" description="Super speed (2 of 2)" />
  <gamegenie code="PAEPTGAA" description="Start on stage 1-2" />
  <gamegenie code="ZAEPTGAA" description="Start on stage 2-1" />
  <gamegenie code="LAEPTGAA" description="Start on stage 2-2" />
  <gamegenie code="GAEPTGAA" description="Start on stage 3-1" />
  <gamegenie code="IAEPTGAA" description="Start on stage 3-2" />
  <gamegenie code="TAEPTGAA" description="Start on stage 4-1" />
  <gamegenie code="YAEPTGAA" description="Start on stage 4-2" />
  <gamegenie code="AAEPTGAE" description="Start on stage 5-1" />
</game>
<game code="CLV-H-UQAOY" name="Ninja Gaiden II: The Dark Sword of Chaos" crc="B780521C">
  <gamegenie code="SZUGKGAI" description="Invincibility" />
  <gamegenie code="OPOKUXUG" description="Invincibility (alt)" />
  <gamegenie code="EANGKGSA" description="Infinite health" />
  <gamegenie code="SZNGKGSA" description="Infinite health (alt)" />
  <gamegenie code="SXVKLTVG" description="Infinite time" />
  <gamegenie code="SXXGXAVG" description="Infinite lives" />
  <gamegenie code="AEKGVTZA" description="Start with 1 life" />
  <gamegenie code="IEKGVTZA" description="Start with 6 lives (1 of 2)" />
  <gamegenie code="SEKKKTSP" description="Start with 6 lives (2 of 2)" />
  <gamegenie code="AEKGVTZE" description="Start with 9 lives (1 of 2)" />
  <gamegenie code="SEKKKTSP" description="Start with 9 lives (2 of 2)" />
  <gamegenie code="YAOIYOPE" description="Start every life with two shadow ninjas" />
  <gamegenie code="LEUOSATA" description="Half-energy from medicine" />
  <gamegenie code="GEUOSATE" description="Double energy from medicine" />
  <gamegenie code="GXKKUIVA" description="Never lose Ninja power item" />
  <gamegenie code="ZEXGYAPA" description="Fast running Ryu (1 of 2)" />
  <gamegenie code="SNEKYEVN" description="Fast running Ryu (2 of 2)" />
  <gamegenie code="LEXGYAPA" description="Mega-fast running Ryu (1 of 2)" />
  <gamegenie code="KNEKYEVN" description="Mega-fast running Ryu (2 of 2)" />
  <gamegenie code="IAUONEZA" description="Half-energy from Blue Ninja power (1 of 2)" />
  <gamegenie code="IAKOOEZA" description="Half-energy from Blue Ninja power (2 of 2)" />
  <gamegenie code="GPUONEZA" description="Double energy from Blue Ninja power (1 of 2)" />
  <gamegenie code="GPKOOEZA" description="Double energy from Blue Ninja power (2 of 2)" />
  <gamegenie code="GOEPOEZA" description="Double maximum Ninja power from scroll (1 of 2)" />
  <gamegenie code="ZEOOEAPA" description="Double maximum Ninja power from scroll (2 of 2)" />
  <gamegenie code="SVOPXXSN" description="All powers use up only 5 points (1 of 3)" />
  <gamegenie code="SVOOKXSN" description="All powers use up only 5 points (2 of 3)" />
  <gamegenie code="SVXOXXSN" description="All powers use up only 5 points (3 of 3)" />
  <gamegenie code="XXEOSZVZ" description="Infinite Ninja power (1 of 3)" />
  <gamegenie code="LOEOVXIY" description="Infinite Ninja power (2 of 3)" />
  <gamegenie code="PUOOSXLK" description="Infinite Ninja power (3 of 3)" />
  <gamegenie code="AAZVYL" description="Less enemies" />
  <gamegenie code="EASGAPAP" description="Multi-jump (1 of 8)" />
  <gamegenie code="GZSGYPEI" description="Multi-jump (2 of 8)" />
  <gamegenie code="LPKKTOYP" description="Multi-jump (3 of 8)" />
  <gamegenie code="LPSGZPTE" description="Multi-jump (4 of 8)" />
  <gamegenie code="SZESEOSE" description="Multi-jump (5 of 8)" />
  <gamegenie code="SZKKIPEY" description="Multi-jump (6 of 8)" />
  <gamegenie code="SZNSXOSE" description="Multi-jump (7 of 8)" />
  <gamegenie code="VXSSIYVA" description="Multi-jump (8 of 8)" />
  <gamegenie code="AAVKXZUI" description="Hit anywhere (1 of 4)" />
  <gamegenie code="AEEGOXKL" description="Hit anywhere (2 of 4)" />
  <gamegenie code="AEOGXXIA" description="Hit anywhere (3 of 4)" />
  <gamegenie code="ENOKKZEL" description="Hit anywhere (4 of 4)" />
</game>
<game code="CLV-H-INWGS" name="Ninja Gaiden III: The Ancient Ship of Doom" crc="902E3168">
  <gamegenie code="AEVPNYLA" description="Invincibility" />
  <gamegenie code="SXEKVLVG" description="Infinite lives" />
  <gamegenie code="SZEXILSA" description="Infinite health" />
  <gamegenie code="SZVZIIVG" description="Infinite time (timer will still countdown)" />
  <gamegenie code="SXXGNLVG" description="Infinite continues" />
  <gamegenie code="VPKGXKXY" description="Less time" />
  <gamegenie code="AEKXTEYA" description="One hit kills" />
  <gamegenie code="PAXGKGAA" description="Start with upgraded sword (1 of 3)" />
  <gamegenie code="APXKEGAO" description="Start with upgraded sword (2 of 3)" />
  <gamegenie code="APXKKGYA" description="Start with upgraded sword (3 of 3)" />
  <gamegenie code="YYXKEGAO" description="Sword hits several areas of the screen at once (sword upgrade negates the effect) (1 of 2)" />
  <gamegenie code="YYXKKGYE" description="Sword hits several areas of the screen at once (sword upgrade negates the effect) (2 of 2)" />
  <gamegenie code="AESPKYPA" description="No power required for Windmill Throwing Star (1 of 2)" />
  <gamegenie code="AEKOXNZA" description="No power required for Windmill Throwing Star (2 of 2)" />
  <gamegenie code="AEKOUNAA" description="No power required for Fire Wheel Art (1 of 2)" />
  <gamegenie code="AESPENAA" description="No power required for Fire Wheel Art (2 of 2)" />
  <gamegenie code="AEKOVYGP" description="No power required for Invincible Fire Wheel (1 of 2)" />
  <gamegenie code="AESOEYZA" description="No power required for Invincible Fire Wheel (2 of 2)" />
  <gamegenie code="AEKOKNAA" description="No power required for Fire Dragon Balls (1 of 2)" />
  <gamegenie code="AESPONAA" description="No power required for Fire Dragon Balls (2 of 2)" />
  <gamegenie code="AEKOSNZA" description="No power required for Vacuum Wave Art (1 of 2)" />
  <gamegenie code="AESPNYPA" description="No power required for Vacuum Wave Art (2 of 2)" />
  <gamegenie code="AENXOAGP" description="Multi-jump and infinite time (01 of 10)" />
  <gamegenie code="AZSXGIZL" description="Multi-jump and infinite time (02 of 10)" />
  <gamegenie code="EPSXZSUA" description="Multi-jump and infinite time (03 of 10)" />
  <gamegenie code="GXUPZLEL" description="Multi-jump and infinite time (04 of 10)" />
  <gamegenie code="LASXLIEI" description="Multi-jump and infinite time (05 of 10)" />
  <gamegenie code="LPSXASNL" description="Multi-jump and infinite time (06 of 10)" />
  <gamegenie code="OZSXTSNK" description="Multi-jump and infinite time (07 of 10)" />
  <gamegenie code="SZNXIIVG" description="Multi-jump and infinite time (08 of 10)" />
  <gamegenie code="XISXIIVK" description="Multi-jump and infinite time (09 of 10)" />
  <gamegenie code="ZASXPIIE" description="Multi-jump and infinite time (10 of 10)" />
  <gamegenie code="GAEGVGZA" description="Start with 5 lives" />
</game>
<game code="CLV-H-HLACS" name="Ninja Kid" crc="02CC3973">
  <gamegenie code="AAVEZAZA" description="Start with 1 life" />
  <gamegenie code="IAVEZAZA" description="Start with 6 lives" />
  <gamegenie code="AAVEZAZE" description="Start with 9 lives" />
  <gamegenie code="SZOZUPVG" description="Infinite Feathers" />
  <gamegenie code="SZXXITVG" description="Infinite Stars" />
  <gamegenie code="SXNOGGVG" description="Infinite Boomerangs" />
  <gamegenie code="SXUZZYVG" description="Infinite Fireflames" />
  <gamegenie code="PAXSXALA" description="1 Feather on pick-up" />
  <gamegenie code="TAXSXALA" description="6 Feathers on pick-up" />
  <gamegenie code="ZAXSUAGO" description="10 Stars on pick-up" />
  <gamegenie code="AZXSUAGO" description="40 Stars on pick-up" />
  <gamegenie code="ZAXSKAGA" description="1 Boomerang on pick-up" />
  <gamegenie code="ZAXSSAGO" description="10 Fireflames on pick-up" />
  <gamegenie code="AZXSSAGO" description="40 Fireflames on pick-up" />
  <gamegenie code="YAEILNYA" description="Less Invincibility time" />
  <gamegenie code="AZEILNYE" description="More Invincibility time" />
</game>
<game code="CLV-H-WVHCU" name="Nintendo World Cup" crc="A22657FA">
  <gamegenie code="AYXXNXAL" description="More powerful 'normal' shots" />
  <gamegenie code="PEXLUIAA" description="Faster players" />
  <gamegenie code="AAUVKZLA" description="1 minute in tournament mode" />
  <gamegenie code="IAUVKZLA" description="6 minutes in tournament mode" />
  <gamegenie code="AAUVKZLE" description="9 minutes in tournament mode" />
  <gamegenie code="AAKTXXPA" description="1 minutes in match mode" />
  <gamegenie code="ZAKTXXPA" description="3 minutes in match mode" />
  <gamegenie code="IAKTXXPA" description="6 minutes in match mode" />
</game>
<game code="CLV-H-SWQSL" name="North &amp; South" crc="AE9F33D0">
  <gamegenie code="IEUATOPA" description="Cannon has 5 shots" />
  <gamegenie code="YEUATOPE" description="Cannon has 15 shots" />
  <gamegenie code="SZXPYUVS" description="Cannon has infinite shots" />
  <gamegenie code="GXXATOSO" description="No cannons allowed" />
  <gamegenie code="ZAUAGPGA" description="Only 2 daggers in the fortress" />
  <gamegenie code="GXXPLKVS" description="Infinite daggers in the fortress" />
  <gamegenie code="ZAUETOZA" description="2 men in the fortress" />
  <gamegenie code="IAUETOZA" description="5 men in the fortress" />
  <gamegenie code="ZASAGOZA" description="2 men on the train" />
  <gamegenie code="IASAGOZA" description="5 men on the train" />
</game>
<game code="CLV-H-MFIIB" name="Operation Secret Storm" crc="EA113128">
  <gamegenie code="OLUVZUOO" description="Infinite lives" />
  <gamegenie code="SLKVYSOO" description="Infinite Gun ammo" />
</game>
<game code="CLV-H-PFLCI" name="Operation Wolf: Take no Prisoners" crc="EDC3662B">
  <gamegenie code="IEVUNSPA" description="Infinite continues" />
  <gamegenie code="AESSLZTL" description="Never die" />
  <gamegenie code="PESZIGAA" description="Start on mission 2" />
  <gamegenie code="ZESZIGAA" description="Start on mission 3" />
  <gamegenie code="LESZIGAA" description="Start on mission 4" />
  <gamegenie code="GESZIGAA" description="Start on mission 5" />
  <gamegenie code="IESZIGAA" description="Start on mission 6" />
  <gamegenie code="AAVSIIPA" description="Infinite magazines" />
  <gamegenie code="AAEIATPA" description="Infinite grenades" />
  <gamegenie code="GANIYIZA" description="Double bullets in each magazine" />
  <gamegenie code="NNESZALE" description="Heal completely between levels" />
  <gamegenie code="GANULZZA" description="Grenades inflict double damage" />
  <gamegenie code="ZAELGPIE" description="Super power drinks" />
  <gamegenie code="PEVKVYYE" description="Increase magazines (1 of 2)" />
  <gamegenie code="PAVSIIIE" description="Increase magazines (2 of 2)" />
  <gamegenie code="PENGXYIE" description="Increase grenades (1 of 2)" />
  <gamegenie code="PAVSIILE" description="Increase grenades (2 of 2)" />
</game>
<game code="CLV-H-BIAIV" name="Overlord" crc="2856111F">
  <gamegenie code="GPEAPOIE" description="Food not decreased" />
  <gamegenie code="SXXUKVVK" description="Hover tanks never decrease in battle" />
  <gamegenie code="SZKOPOVK" description="Ballistic Missiles never decrease in battle" />
  <gamegenie code="SZSPGOVK" description="Homing Missiles never decrease in battle" />
  <gamegenie code="NZVUKNNP" description="Enemy starts with 0 Missiles" />
  <gamegenie code="ESKALPEL" description="Constantly get 9999999 cash on all planets with 1% or higher tax" />
  <gamegenie code="YYXLIYAE" description="View a planet's stats for high food (1 of 2)" />
  <gamegenie code="OPXUPNOU" description="View a planet's stats for high food (2 of 2)" />
  <gamegenie code="YYOLEAAE" description="View a planet's stats for high people (1 of 2)" />
  <gamegenie code="OPOLKEOU" description="View a planet's stats for high people (2 of 2)" />
  <gamegenie code="YNKUYYAE" description="View a planet's stats for high energy (1 of 2)" />
  <gamegenie code="OOSLLNOU" description="View a planet's stats for high energy (2 of 2)" />
  <gamegenie code="YNEUTYAE" description="View a planet's stats for high fuel (1 of 2)" />
  <gamegenie code="OOOLZNOU" description="View a planet's stats for high fuel (2 of 2)" />
</game>
<game code="CLV-H-KWZWC" name="P.O.W.: Prisoners of War" crc="75255F88">
  <gamegenie code="ATVUUZSA" description="Invincibility" />
  <gamegenie code="OLEUSOSU" description="One hit kills" />
  <gamegenie code="AENSLPPA" description="Infinite lives" />
  <gamegenie code="STOLOUON" description="Take less damage when hit from behind" />
  <gamegenie code="AAVGOTPA" description="Infinite bullets" />
  <gamegenie code="AESUNALZ" description="Hit anywhere (1 of 3)" />
  <gamegenie code="GKSUVAEU" description="Hit anywhere (2 of 3)" />
  <gamegenie code="OUVLEEEK" description="Hit anywhere (3 of 3)" />
  <gamegenie code="APKGPLAZ" description="Start with half health (1 of 2)" />
  <gamegenie code="APESYZAZ" description="Start with half health (2 of 2)" />
  <gamegenie code="GZUUNUSE" description="Keep weapons after dying (1 of 2)" />
  <gamegenie code="GZSLOSSE" description="Keep weapons after dying (2 of 2)" />
  <gamegenie code="AEUEIZZA" description="Start with 1 life" />
  <gamegenie code="IEUEIZZA" description="Start with 6 lives" />
  <gamegenie code="AEUEIZZE" description="Start with 9 lives" />
  <gamegenie code="LVUEIZZA" description="Start with 99 lives" />
</game>
<game code="CLV-H-SDGSH" name="Pac-Mania" crc="E73E7260">
  <gamegenie code="SZKIOPVG" description="Infinite lives" />
  <gamegenie code="ANTGUN" description="Trapped ghosts" />
  <gamegenie code="SOLIVA" description="Go through ghosts" />
  <gamegenie code="PEASNA" description="Ghosts worth 3200 points" />
</game>
<game code="CLV-H-MODJL" name="Panic Restaurant" crc="435AEEC6">
  <gamegenie code="ENUPPAEI" description="Invincibility" />
  <gamegenie code="OZVKGZVK" description="Infinite time" />
  <gamegenie code="SGVKGZVG" description="Infinite time (alt)" />
  <gamegenie code="OXVPPAVK" description="Infinite health - except when you fall on spikes" />
  <gamegenie code="SXVPPAVG" description="Infinite health (alt)" />
  <gamegenie code="AEKPYXVL" description="Hit anywhere (1 of 2)" />
  <gamegenie code="AEVPGZOZ" description="Hit anywhere (2 of 2)" />
  <gamegenie code="AAEGLUPZ" description="Moon-jump" />
  <gamegenie code="GASYZGZA" description="Start with 4 hearts" />
  <gamegenie code="PAOZNIZA" description="Start with 2 lives" />
  <gamegenie code="IAOZNIZA" description="Start with 5 lives" />
  <gamegenie code="SAOSAGVG" description="Infinite lives" />
  <gamegenie code="SZOSAGVG" description="Infinite lives (alt)" />
  <gamegenie code="TASYZGZA" description="Start with 6 hearts (heart meter will be distorted)" />
  <gamegenie code="ZASYZGZE" description="Start with 10 hearts (heart meter will be distorted)" />
  <gamegenie code="ZAOZNIZE" description="Start with 10 lives" />
  <gamegenie code="YAOZNIZE" description="Start with 15 lives" />
  <gamegenie code="AIVYGGLT" description="Start with 80 on timer - 1st level only (1 of 2)" />
  <gamegenie code="AIVKXYLT" description="Start with 80 on timer - 1st level only (2 of 2)" />
  <gamegenie code="TGVYGGLT" description="Start with 70 on timer - 1st level only (1 of 2)" />
  <gamegenie code="TGVKXYLT" description="Start with 70 on timer - 1st level only (2 of 2)" />
  <gamegenie code="GLVYGGLV" description="Start with 60 on timer - 1st level only (1 of 2)" />
  <gamegenie code="GLVKXYLV" description="Start with 60 on timer - 1st level only (2 of 2)" />
</game>
<game code="CLV-H-IJKGU" name="Paperboy" crc="32086826">
  <gamegenie code="SXSEVZVG" description="Infinite lives" />
  <gamegenie code="PAUOEIGA" description="Start with 1 life" />
  <gamegenie code="TAUOEIGA" description="Start with 6 lives" />
  <gamegenie code="OZNOKAVK" description="Infinite papers" />
  <gamegenie code="GOXAUOZA" description="Start with 20 papers" />
  <gamegenie code="GPUONUZA" description="Gain 20 papers on pick-up" />
  <gamegenie code="APNEOZEO" description="Invincibility against moving objects (1 of 2)" />
  <gamegenie code="ATNEXZGA" description="Invincibility against moving objects (2 of 2)" />
  <gamegenie code="SZXOUESE" description="Infinite time in training course" />
  <gamegenie code="AAKPSGTA" description="Invincibility against non-moving objects" />
  <gamegenie code="PAKPUPZA" description="Broken windows count as deliveries" />
  <gamegenie code="ASSOOAEY" description="Deliver from anywhere (must be within range of house) (1 of 2)" />
  <gamegenie code="YNSOXAAI" description="Deliver from anywhere (must be within range of house) (1 of 2)" />
</game>
<game code="CLV-H-BTBWS" name="Paperboy 2" crc="3A0965B1">
  <gamegenie code="PEOUYGIA" description="Start with 1 life - Paperboy only" />
  <gamegenie code="LEOUYGIA" description="Start with 3 lives - Paperboy only" />
  <gamegenie code="ZEOUYGIE" description="Start with 10 lives - Paperboy only" />
  <gamegenie code="AAKEZLPA" description="Infinite lives" />
  <gamegenie code="YAELGVZE" description="Start with 15 papers" />
  <gamegenie code="GPELGVZA" description="Start with 20 papers" />
  <gamegenie code="AEVPNLPA" description="Infinite papers" />
  <gamegenie code="IEOAEOZA" description="5 papers on pick-up" />
  <gamegenie code="YEOAEOZE" description="15 papers on pick-up" />
  <gamegenie code="GOOAEOZA" description="20 papers on pick-up" />
</game>
<game code="CLV-H-LDAYK" name="Pesterminator" crc="6A483073">
  <gamegenie code="VXNIIEVK" description="Infinite lives" />
  <gamegenie code="VVOSPNVG" description="Infinite health" />
</game>
<game code="CLV-H-DNZGV" name="Fox's Peter Pan &amp; The Pirates: The Revenge of Captain Hook" crc="20353E63">
  <gamegenie code="SZOKYLVG" description="Infinite lives" />
  <gamegenie code="PENKLGLA" description="Start with 1 life" />
  <gamegenie code="TENKLGLA" description="Start with 6 lives" />
  <gamegenie code="PENKLGLE" description="Start with 9 lives" />
  <gamegenie code="GASSNZGE" description="Slower flight meter" />
  <gamegenie code="ZASSNZGA" description="Faster flight meter" />
  <gamegenie code="SZVSXXVK" description="Infinite flight power" />
  <gamegenie code="TONGZKZE" description="Start with 30 units of health (1 of 2)" />
  <gamegenie code="TPXKYUZE" description="Start with 30 units of health (2 of 2)" />
  <gamegenie code="IENGZKZA" description="Start with 5 units of health (1 of 2)" />
  <gamegenie code="IAXKYUZA" description="Start with 5 units of health (2 of 2)" />
  <gamegenie code="ZAOIVAPA" description="Faster flying left and right (1 of 2)" />
  <gamegenie code="ZAUIUZPA" description="Faster flying left and right (2 of 2)" />
</game>
<game code="CLV-H-GMWMR" name="Phantom Fighter" crc="CC37094C">
  <gamegenie code="SXSZLUSE" description="Infinite health" />
  <gamegenie code="VTVKEGSA" description="Start with Sacred Sword/Bell/Tonten/Talisman (1 of 2)" />
  <gamegenie code="KAVKOGNA" description="Start with Sacred Sword (2 of 2)" />
  <gamegenie code="SAVKOGNA" description="Start with Bell (2 of 2)" />
  <gamegenie code="UAVKOGNA" description="Start with Tonten (2 of 2)" />
  <gamegenie code="XAVKOGNA" description="Start with Talisman (2 of 2)" />
  <gamegenie code="VAVKOGNA" description="Start with X Scrolls (1 of 2)" />
  <gamegenie code="LASKNGAA" description="Start with 3 Scrolls (2 of 2)" />
  <gamegenie code="TASKNGAA" description="Start with 6 Scrolls (2 of 2)" />
  <gamegenie code="OVSZPLSV" description="Take less damage when attacked (1 of 2)" />
  <gamegenie code="PESZZLAA" description="Take less damage when attacked (2 of 2)" />
</game>
<game code="CLV-H-JRJPZ" name="Pin-Bot" crc="D19ADDEB">
  <gamegenie code="PANTGZLA" description="Start with only 1 ball" />
  <gamegenie code="TANTGZLA" description="Start with 6 balls" />
  <gamegenie code="PANTGZLE" description="Start with 9 balls" />
  <gamegenie code="OZVVYZVV" description="Infinite balls" />
</game>
<game code="CLV-H-ZHGHB" name="Pinball" crc="035DC2E9">
  <gamegenie code="PASGPALA" description="Start with 1 ball" />
  <gamegenie code="TASGPALA" description="Start with 6 balls" />
  <gamegenie code="PASGPALE" description="Start with 9 balls" />
  <gamegenie code="YZSGPALE" description="Start with lots of balls" />
  <gamegenie code="SUXKLEVS" description="Infinite balls" />
</game>
<game code="CLV-H-HHSYG" name="Pipe Dream" crc="BCE77871">
  <gamegenie code="PAOALPLA" description="Start with 1 wrench" />
  <gamegenie code="TAOALPLA" description="Start with 6 wrenches" />
  <gamegenie code="PAOALPLE" description="Start with 9 wrenches" />
  <gamegenie code="SZKTPUVK" description="Infinite wrenches" />
  <gamegenie code="AAOGZZIA" description="One-way pipes from level 1" />
  <gamegenie code="IAOGAZLA" description="One-way pipes from level 5" />
  <gamegenie code="ZAOKPZLE" description="One-way pipes from level 10" />
  <gamegenie code="KEUAUVSE" description="Tunnels galore" />
  <gamegenie code="GPKIEGZP" description="Pumps instead of reservoirs" />
  <gamegenie code="GPKIEGZP" description="Pumps before reservoirs (1 of 2)" />
  <gamegenie code="ZPKINGGP" description="Pumps before reservoirs (2 of 2)" />
</game>
<game code="CLV-H-WZPGV" name="Platoon" crc="695515A2">
  <gamegenie code="SXKOZPVG" description="Stage 1 - Infinite grenades" />
  <gamegenie code="SZSPYAVG" description="Stage 1 - Start with double capacity magazine" />
  <gamegenie code="AEKESYGE" description="Stage 1 - Double hits" />
  <gamegenie code="SXKAUYVT" description="Stage 1 - Don't take damage" />
  <gamegenie code="GAKEAPIA" description="Start on stage 2" />
  <gamegenie code="SZVAXTVT" description="Stage 2 - Don't take damage" />
  <gamegenie code="LAEGGATA" description="Start on stage 3" />
  <gamegenie code="SXKEUZVG" description="Stage 4 - Infinite time" />
  <gamegenie code="IEVEOPLA" description="Stage 4 - Play with more time" />
  <gamegenie code="PAKOIPIE" description="Stage 4 - Double hits" />
  <gamegenie code="ZAKOIPIA" description="Stage 4 - Halve hits" />
  <gamegenie code="GEXEUPTE" description="Stage 4 - Start with double ammo" />
</game>
<game code="CLV-H-GIFWG" name="Popeye" crc="70860FCA">
  <gamegenie code="ATGIYP" description="Invincibility against enemy" />
  <gamegenie code="ATISTL" description="Invincibility against shots" />
  <gamegenie code="PAPKNA" description="Start with 1 life" />
  <gamegenie code="TAPKNA" description="Start with 6 lives" />
  <gamegenie code="PAPKNE" description="Start with 9 lives" />
</game>
<game code="CLV-H-KHTOF" name="Power Blade" crc="5CF536F4">
  <gamegenie code="OTKESZSV" description="Infinite health" />
  <gamegenie code="SZSIAAVG" description="Infinite lives" />
  <gamegenie code="SZKAKXOU" description="Take minimum damage" />
  <gamegenie code="AZXSAVAU" description="Mega-jump" />
  <gamegenie code="GZUITAVG" description="Don't lose boomerang strength when you die (1 of 2)" />
  <gamegenie code="GZVITASA" description="Don't lose boomerang strength when you die (2 of 2)" />
  <gamegenie code="GZUSGAVG" description="Don't lose multi-boomerangs when you die (1 of 2)" />
  <gamegenie code="GZVSZASA" description="Don't lose multi-boomerangs when you die (2 of 2)" />
  <gamegenie code="AEOANGZZ" description="Hit anywhere (1 of 2)" />
  <gamegenie code="ENEEUGEP" description="Hit anywhere (2 of 2)" />
  <gamegenie code="AEEIPPPE" description="Press Start to finish the level (don't use on Protect level) (1 of 3)" />
  <gamegenie code="AOEILOIK" description="Press Start to finish the level (don't use on Protect level) (2 of 3)" />
  <gamegenie code="AVEIGOOZ" description="Press Start to finish the level (don't use on Protect level) (3 of 3)" />
  <gamegenie code="YANNLTZA" description="Start a new game to view ending" />
  <gamegenie code="AAXYZYZA" description="Start with 1 life" />
  <gamegenie code="IAXYZYZA" description="Start with 6 lives" />
  <gamegenie code="AAXYZYZE" description="Start with 9 lives" />
</game>
<game code="CLV-H-NSDHN" name="Power Blade 2" crc="D273B409">
  <gamegenie code="GZSILAVG" description="Infinite lives" />
  <gamegenie code="OVSLZLSV" description="Infinite health - except for spikes" />
  <gamegenie code="ATKKXZSZ" description="Infinite time" />
  <gamegenie code="YPKGNXYU" description="Speed up timer" />
  <gamegenie code="YYKGNXYU" description="Slow down timer" />
  <gamegenie code="GXEVXTVG" description="Infinite life tanks" />
  <gamegenie code="GZEIPLVG" description="Infinite energy tanks" />
  <gamegenie code="SAKSZZSZ" description="Throw meter doesn't decrease when boomerang is thrown" />
  <gamegenie code="OVSLZLSV" description="Take minimal damage (1 of 2)" />
  <gamegenie code="PESLLLAA" description="Take minimal damage (2 of 2)" />
  <gamegenie code="OZVULSOK" description="Maximum throwing ability on pick-up (1 of 2)" />
  <gamegenie code="SANLZIVT" description="Maximum throwing ability on pick-up (2 of 2)" />
  <gamegenie code="YAXTNTLA" description="Start a new game to view ending" />
  <gamegenie code="AEKEPTZA" description="Start with 1 life" />
  <gamegenie code="IEKEPTZA" description="Start with 6 lives" />
  <gamegenie code="AEKEPTZE" description="Start with 9 lives" />
</game>
<game code="CLV-H-AAXIS" name="Power Punch II" crc="90226E40">
  <gamegenie code="SZEYXGSA" description="Infinite health" />
</game>
<game code="CLV-H-UHDSH" name="Predator" crc="A7DE65E4">
  <gamegenie code="VASAOASA" description="Invincibility (normal mode) (1 of 2)" />
  <gamegenie code="OGKKNGVK" description="Invincibility (normal mode) (2 of 2)" />
  <gamegenie code="VVVAXUVK" description="Infinite health (big mode)" />
  <gamegenie code="SZNGGXVK" description="Infinite lives in jungle mode" />
  <gamegenie code="SXXGZOVK" description="Infinite lives in big mode" />
  <gamegenie code="AAVKGPGE" description="Start with double lives" />
  <gamegenie code="AVUGVGSA" description="Infinite health in jungle mode" />
  <gamegenie code="ATEVEISZ" description="Hit anywhere (1 of 5)" />
  <gamegenie code="ATVTEISZ" description="Hit anywhere (2 of 5)" />
  <gamegenie code="ATXTOISZ" description="Hit anywhere (3 of 5)" />
  <gamegenie code="AVNTKGSZ" description="Hit anywhere (4 of 5)" />
  <gamegenie code="AVOVSISZ" description="Hit anywhere (5 of 5)" />
  <gamegenie code="AEOETOPE" description="Mega-jumps in jungle mode" />
  <gamegenie code="NTEENEGE" description="Don't die if you fall down holes (1 of 2)" />
  <gamegenie code="ATOAEEOZ" description="Don't die if you fall down holes (2 of 2)" />
  <gamegenie code="LASEOELA" description="Start each life with Laser Rifle (1 of 2)" />
  <gamegenie code="XLSEUEVX" description="Start each life with Laser Rifle (2 of 2)" />
</game>
<game code="CLV-H-ZXVKK" name="Prince of Persia" crc="70CE3771">
  <gamegenie code="SLXAINSO" description="Infinite health (except for deep sword hit or a long fall)" />
  <gamegenie code="SZKLIXSE" description="Infinite time" />
</game>
<game code="CLV-H-IRCFP" name="Pro Sport Hockey" crc="41F9E0AA">
  <gamegenie code="ZESUZYPA" description="P1 goals worth 2" />
  <gamegenie code="LESUZYPA" description="P1 goals worth 3" />
  <gamegenie code="GESUZYPA" description="P1 goals worth 4" />
  <gamegenie code="IESUZYPA" description="P1 goals worth 5" />
  <gamegenie code="TESUZYPA" description="P1 goals worth 6" />
  <gamegenie code="YESUZYPA" description="P1 goals worth 7" />
  <gamegenie code="AESUZYPE" description="P1 goals worth 8" />
  <gamegenie code="ZENLZYPA" description="P2 goals worth 2" />
  <gamegenie code="LENLZYPA" description="P2 goals worth 3" />
  <gamegenie code="GENLZYPA" description="P2 goals worth 4" />
  <gamegenie code="IENLZYPA" description="P2 goals worth 5" />
  <gamegenie code="TENLZYPA" description="P2 goals worth 6" />
  <gamegenie code="YENLZYPA" description="P2 goals worth 7" />
  <gamegenie code="AENLZYPE" description="P2 goals worth 8" />
  <gamegenie code="VVNPTOSE" description="P1 starts with 1 point" />
  <gamegenie code="VVNOPOSE" description="P2 starts with 1 point" />
  <gamegenie code="VVNOZPNT" description="P1 starts with X points (1 of 2)" />
  <gamegenie code="ZENPIPAA" description="P1 starts with 2 points (2 of 2)" />
  <gamegenie code="GENPIPAA" description="P1 starts with 4 points (2 of 2)" />
  <gamegenie code="TENPIPAA" description="P1 starts with 6 points (2 of 2)" />
  <gamegenie code="AENPIPAE" description="P1 starts with 8 points (2 of 2)" />
  <gamegenie code="ZENPIPAE" description="P1 starts with 10 points (2 of 2)" />
  <gamegenie code="NVNPYPVT" description="P2 starts with X points (1 of 2)" />
  <gamegenie code="ZENPIPAA" description="P2 starts with 2 points (2 of 2)" />
  <gamegenie code="GENPIPAA" description="P2 starts with 4 points (2 of 2)" />
  <gamegenie code="TENPIPAA" description="P2 starts with 6 points (2 of 2)" />
  <gamegenie code="AENPIPAE" description="P2 starts with 8 points (2 of 2)" />
  <gamegenie code="ZENPIPAE" description="P2 starts with 10 points (2 of 2)" />
</game>
<game code="CLV-H-CGAIZ" name="Pro Wrestling" crc="64B710D2">
  <gamegenie code="NTSTIVLE" description="Infinite health and time (1 of 4)" />
  <gamegenie code="OZSTGTVS" description="Infinite health and time (2 of 4)" />
  <gamegenie code="SASTTTEY" description="Infinite health and time (3 of 4)" />
  <gamegenie code="YTSTYVZA" description="Infinite health and time (4 of 4)" />
  <gamegenie code="IEETTZGP" description="Only have 5 seconds to get back into ring" />
  <gamegenie code="ZEETTZGO" description="Only have 10 seconds to get back into ring" />
  <gamegenie code="TOETTZGO" description="Have 30 seconds to get back into ring" />
  <gamegenie code="PEXIKYIA" description="Rounds are only 1 minute" />
  <gamegenie code="LEXIKYIA" description="Rounds are only 3 minutes" />
  <gamegenie code="AEXIKYIE" description="Rounds are 8 minutes" />
  <gamegenie code="ZEXIKYIE" description="Rounds are 10 minutes" />
  <gamegenie code="ZAVVTGLA" description="2-second pin count" />
  <gamegenie code="IAVVTGLA" description="5-second pin count" />
  <gamegenie code="YAVVTGLA" description="7-second pin count" />
</game>
<game code="CLV-H-SAMDP" name="Punisher, The" crc="27F8D0D2">
  <gamegenie code="ESKTGGEY" description="Invincibility (1 of 2)" />
  <gamegenie code="EVKTTKXK" description="Invincibility (2 of 2)" />
  <gamegenie code="SZNZKOSE" description="Infinite health (1 of 3)" />
  <gamegenie code="SZUZPVSE" description="Infinite health (2 of 3)" />
  <gamegenie code="VZKZNOVE" description="Infinite health (3 of 3)" />
  <gamegenie code="XTSVSNXK" description="Infinite Grenades" />
  <gamegenie code="AESYAPPA" description="Infinite bullets and Rockets" />
  <gamegenie code="AANZGXAZ" description="Hit anywhere (1 of 4)" />
  <gamegenie code="AAOXYXIA" description="Hit anywhere (2 of 4)" />
  <gamegenie code="AAXXAKPA" description="Hit anywhere (3 of 4)" />
  <gamegenie code="AAXXZPZL" description="Hit anywhere (4 of 4)" />
  <gamegenie code="XVOVGXXK" description="Never lose a life against normal enemy" />
  <gamegenie code="XVOEXOXK" description="Never lose a life against end of level enemy" />
  <gamegenie code="GEUUYIZA" description="Faster Punisher" />
  <gamegenie code="PEUYNLAA" description="150 Machine Gun bullets" />
  <gamegenie code="PEUNXLAA" description="150 Assault Rifle bullets on pick-up" />
  <gamegenie code="AAEUUPAO" description="Less health on pick-up" />
  <gamegenie code="APEUUPAO" description="More health on pick-up" />
  <gamegenie code="PANVGGAA" description="Stage scrolls 2x as fast" />
  <gamegenie code="ZANVGGAA" description="Stage scrolls 3x as fast" />
  <gamegenie code="LANVGGAA" description="Stage scrolls 4x as fast" />
  <gamegenie code="PEOTYTIA" description="Start with 1 life" />
  <gamegenie code="ZEOTYTIE" description="Start with 10 lives" />
</game>
<game code="CLV-H-OTDHS" name="Puss 'n Boots: Pero's Great Adventure" crc="6E0EB43E">
  <gamegenie code="SZNGOISA" description="Infinite health" />
  <gamegenie code="PEOGZALA" description="Start with 1 life" />
  <gamegenie code="TEOGZALA" description="Start with 6 lives" />
  <gamegenie code="PEOGZALE" description="Start with 9 lives" />
  <gamegenie code="SZOKZZVG" description="Infinite lives" />
  <gamegenie code="GOSTNUAU" description="Start with less health" />
  <gamegenie code="GAEGAIAA" description="Start on stage 1" />
  <gamegenie code="PAEGAIAE" description="Start on stage 2" />
  <gamegenie code="TAEGAIAE" description="Start on stage 3" />
  <gamegenie code="AAXGNUPA" description="Mega-jump" />
  <gamegenie code="AAOVNENY" description="Auto-fire and auto-jump" />
</game>
<game code="CLV-H-PLCEW" name="Puzznic" crc="EB61133B">
  <gamegenie code="AAUXITIA" description="Press A to destroy blocks (1 of 2)" />
  <gamegenie code="AAUXPTKP" description="Press A to destroy blocks (2 of 2)" />
  <gamegenie code="ITKIPXGL" description="Slower timer" />
  <gamegenie code="TPKIPXGU" description="Faster timer" />
  <gamegenie code="ZEUAIPAE" description="Start on level 2-1" />
  <gamegenie code="GOUAIPAA" description="Start on level 3-1" />
  <gamegenie code="TOUAIPAE" description="Start on level 4-1" />
  <gamegenie code="AXUAIPAE" description="Start on level 5-1" />
  <gamegenie code="ZUUAIPAA" description="Start on level 6-1" />
  <gamegenie code="GUUAIPAE" description="Start on level 7-1" />
  <gamegenie code="TKUAIPAA" description="Start on level 8-1" />
  <gamegenie code="ASUAIPAA" description="Start on level 9-1" />
</game>
<game code="CLV-H-ANFQP" name="Q*bert" crc="C0B23520">
  <gamegenie code="OZKGZPSX" description="Clear level automatically" />
  <gamegenie code="SXSZGPVG" description="Infinite lives" />
  <gamegenie code="AESPVGAE" description="Start on level 3" />
  <gamegenie code="GOSPVGAA" description="Start on level 6" />
  <gamegenie code="AXSPVGAA" description="Start on level 9" />
  <gamegenie code="PEUOOGIA" description="Start with 1 life (1 of 2)" />
  <gamegenie code="PAXZLLIA" description="Start with 1 life (2 of 2)" />
  <gamegenie code="ZAXZLLIE" description="Start with 10 lives (1 of 2)" />
  <gamegenie code="ZEUOOGIE" description="Start with 10 lives (2 of 2)" />
</game>
<game code="CLV-H-AOJTG" name="Qix" crc="95E4E594">
  <gamegenie code="PEEAPZGA" description="1 life - 1P" />
  <gamegenie code="PEEEAZGA" description="1 life - 2P" />
  <gamegenie code="IANAZZPA" description="Start on Level 5 - 1P game" />
  <gamegenie code="ZANAZZPE" description="Start on Level 10 - 1P game" />
  <gamegenie code="GPNAZZPA" description="Start on Level 20 - 1P game" />
  <gamegenie code="IEEEGZPA" description="Start on Level 5 - 2P game" />
  <gamegenie code="ZEEEGZPE" description="Start on Level 10 - 2P game" />
  <gamegenie code="GOEEGZPA" description="Start on Level 20 - 2P game" />
</game>
<game code="CLV-H-WUNCM" name="Quattro Adventure (Unl) [!p]" crc="6C040686">
  <gamegenie code="TAOGPTLA" description="Boomerang Kid - Start with 6 lives" />
  <gamegenie code="SZOGXVVK" description="Boomerang Kid - Infinite lives" />
  <gamegenie code="PEKGGLLE" description="Linus Spacehead - Start with 9 lives" />
  <gamegenie code="AZKKPNAP" description="Linus Spacehead - Increase oxygen" />
  <gamegenie code="AEULZIPA" description="Linus Spacehead - Never lose oxygen" />
  <gamegenie code="SXEGLYVG" description="Linus Spacehead - Never lose life in the water" />
  <gamegenie code="SZXIILVG" description="Linus Spacehead - Never lose life in the land" />
  <gamegenie code="PAVGILLA" description="Super Robin Hood - Start with 1 life" />
  <gamegenie code="TAVGILLA" description="Super Robin Hood - Start with 6 lives" />
  <gamegenie code="PAVGILLE" description="Super Robin Hood - Start with 9 lives" />
  <gamegenie code="SXNKZIVG" description="Super Robin Hood - Infinite lives" />
  <gamegenie code="AVONISPG" description="Super Robin Hood - Become invincible" />
  <gamegenie code="PAEGLTLE" description="Super Robin Hood - 9 energy hearts, you may lose some hearts when you pick up new ones" />
  <gamegenie code="PEXSZYAA" description="Treasure Island Dizzy - Invincible Dizzy (walk left to arrive at the original starting point)" />
  <gamegenie code="OZNTKASX" description="Treasure Island Dizzy - Walk backwards" />
  <gamegenie code="PEUSYYAA" description="Treasure Island Dizzy - Start with snorkel" />
  <gamegenie code="PEUSYYAA" description="Treasure Island Dizzy - Start with axe (1 of 2)" />
  <gamegenie code="PEKNIZZP" description="Treasure Island Dizzy - Start with axe (2 of 2)" />
  <gamegenie code="PEUSYYAA" description="Treasure Island Dizzy - Start with dynamite (1 of 2)" />
  <gamegenie code="ZEKNIZZP" description="Treasure Island Dizzy - Start with dynamite (2 of 2)" />
  <gamegenie code="PEUSYYAA" description="Treasure Island Dizzy - Start with heavy weight (1 of 2)" />
  <gamegenie code="IEKNIZZP" description="Treasure Island Dizzy - Start with heavy weight (2 of 2)" />
</game>
<game code="CLV-H-DZMGO" name="Quattro Arcade" crc="792070A9">
  <gamegenie code="PAVGZILA" description="Go! Dizzy Go! - Start with 1 life" />
  <gamegenie code="TAVGZILA" description="Go! Dizzy Go! - Start with 6 lives" />
  <gamegenie code="PAVGZILE" description="Go! Dizzy Go! - Start with 9 lives" />
  <gamegenie code="ZEEKGIPA" description="Go! Dizzy Go! - Start on world 1, stage 3" />
  <gamegenie code="GEEKGIPA" description="Go! Dizzy Go! - Start on world 1, stage 5" />
  <gamegenie code="TEEKGIPA" description="Go! Dizzy Go! - Start on world 2, stage 2" />
  <gamegenie code="AEEKGIPE" description="Go! Dizzy Go! - Start on world 2, stage 4" />
  <gamegenie code="AOEKGIPA" description="Go! Dizzy Go! - Start on world 4, stage 2" />
  <gamegenie code="ZOEKGIPA" description="Go! Dizzy Go! - Start on world 4, stage 4" />
  <gamegenie code="GOEKGIPA" description="Go! Dizzy Go! - Start on world 5, stage 1" />
  <gamegenie code="TOEKGIPA" description="Go! Dizzy Go! - Start on world 5, stage 3" />
  <gamegenie code="AOEKGIPE" description="Go! Dizzy Go! - Start on world 5, stage 5" />
  <gamegenie code="XVTISU" description="Go! Dizzy Go! - Always kill monsters (1 of 2)" />
  <gamegenie code="XVTIVU" description="Go! Dizzy Go! - Always kill monsters (2 of 2)" />
  <gamegenie code="XVTILU" description="Go! Dizzy Go! - Walk through walls" />
  <gamegenie code="PAKVXGLA" description="Stunt Buggies - Start with 1 life" />
  <gamegenie code="TAKVXGLA" description="Stunt Buggies - Start with 6 lives" />
  <gamegenie code="PAKVXGLE" description="Stunt Buggies - Start with 9 lives" />
  <gamegenie code="SXOXZEVK" description="Stunt Buggies - Infinite lives" />
  <gamegenie code="PEUGEALA" description="F-16 Renegade - Start with 2 lives - 1P game" />
  <gamegenie code="TEUGEALA" description="F-16 Renegade - Start with 7 lives - 1P game" />
  <gamegenie code="PEUGEALE" description="F-16 Renegade - Start with 10 lives - 1P game" />
  <gamegenie code="LEUGSAPA" description="F-16 Renegade - Start on level 3 (1 of 2)" />
  <gamegenie code="PEKGXAAA" description="F-16 Renegade - Start on level 3 (2 of 2)" />
  <gamegenie code="IEUGSAPA" description="F-16 Renegade - Start on level 5 (1 of 2)" />
  <gamegenie code="ZEKGXAAA" description="F-16 Renegade - Start on level 5 (2 of 2)" />
  <gamegenie code="YEUGSAPA" description="F-16 Renegade - Start on level 7 (1 of 2)" />
  <gamegenie code="LEKGXAAA" description="F-16 Renegade - Start on level 7 (2 of 2)" />
  <gamegenie code="PEUGSAPE" description="F-16 Renegade - Start on level 9 (1 of 2)" />
  <gamegenie code="GEKGXAAA" description="F-16 Renegade - Start on level 9 (2 of 2)" />
  <gamegenie code="PASTSVPA" description="C.J.'s Elephant Antics - Start with 1 life" />
  <gamegenie code="IASTSVPA" description="C.J.'s Elephant Antics - Start with 5 lives" />
  <gamegenie code="YASTSVPE" description="C.J.'s Elephant Antics - Start with 15 lives" />
  <gamegenie code="GPSTSVPA" description="C.J.'s Elephant Antics - Start with 20 lives" />
  <gamegenie code="SUKTZUVS" description="C.J.'s Elephant Antics - Infinite lives" />
  <gamegenie code="PAEYOAAA" description="C.J.'s Elephant Antics - Start in Switzerland" />
  <gamegenie code="ZAEYOAAA" description="C.J.'s Elephant Antics - Start in Egypt" />
  <gamegenie code="LAEYOAAA" description="C.J.'s Elephant Antics - Start in Africa" />
  <gamegenie code="PAONILAA" description="C.J.'s Elephant Antics - Always run fast after losing all lives" />
  <gamegenie code="YAONILAE" description="C.J.'s Elephant Antics - Super C.J. after losing all lives" />
</game>
<game code="CLV-H-GCYRD" name="R.B.I. Baseball" crc="3C5C81D4">
  <gamegenie code="AOVLSLEI" description="All missed pitches are strikes - both players" />
  <gamegenie code="EYONXZAL" description="Auto fielding (2 of 3)" />
  <gamegenie code="YAONUZLO" description="Auto fielding (3 of 3)" />
  <gamegenie code="AESNXXPA" description="Auto fielding (1 of 3)" />
</game>
<game code="CLV-H-QYYYE" name="R.C. Pro-Am" crc="AAED295C">
  <gamegenie code="GEUGAPPA" description="Max turbo on first pick-up" />
  <gamegenie code="GEKKGPPA" description="Max tires on first pick-up" />
  <gamegenie code="GAVGIPPA" description="Max speed on first pick-up" />
  <gamegenie code="ZEUGAPPA" description="Double turbo on first pick-up" />
  <gamegenie code="ZEKKGPPA" description="Double tires on first pick-up" />
  <gamegenie code="ZAVGIPPA" description="Double speed on first pick-up" />
  <gamegenie code="SXVLGZAK" description="Computer cars go crazy" />
  <gamegenie code="AAEIPPPA" description="Infinite continues" />
</game>
<game code="CLV-H-LCQKT" name="R.C. Pro-Am II" crc="9EDD2159">
  <gamegenie code="AESOLAZA" description="Start with 1 credit instead of 3" />
  <gamegenie code="GESOLAZA" description="Start with 5 credits" />
  <gamegenie code="TESOLAZA" description="Start with 7 credits" />
  <gamegenie code="AESOLAZE" description="Start with 9 credits" />
  <gamegenie code="SUEEGXVS" description="Infinite credits" />
  <gamegenie code="ATUXYGSZ" description="Items in the Model Shop are free if you have enough money" />
  <gamegenie code="PEETEOEG" description="Buckshot costs 10 instead of 2,000" />
  <gamegenie code="AEEVUPYA" description="Mega Pulse costs 2,080 instead of 20,000" />
  <gamegenie code="AANTSPIA" description="Scoopers costs 2,200 instead of 15,000" />
  <gamegenie code="AANTUPLA" description="Dynafit tires costs 2,320 instead of 10,000" />
  <gamegenie code="AAVVUPLP" description="Mega Motor costs 1,360 instead of 50,000" />
  <gamegenie code="AAVVOOLA" description="Hyper Motor costs 1,840 instead of 30,000" />
  <gamegenie code="AEEVOPIA" description="Freeze costs 2,200 instead of 15,000" />
  <gamegenie code="AEETNPIA" description="Lazer costs 1,200 instead of 14,000" />
  <gamegenie code="AEETSPGA" description="Bombs costs 1,760 instead of 12,000" />
  <gamegenie code="AANTOPZA" description="Nobbies costs 1,880 instead of 7,000" />
  <gamegenie code="AEETUPLA" description="Missile costs 2,320 instead of 10,000" />
  <gamegenie code="PANVKPGT" description="Nitro costs 10 instead of 1000" />
  <gamegenie code="PANVXPZL" description="Oil slicks costs 10 instead of 500" />
  <gamegenie code="PAVVVOEG" description="Skinny tires costs 10 instead of 2,000" />
  <gamegenie code="AAVTNPTA" description="Gold Motor costs 10 instead of 16,000 (1 of 2)" />
  <gamegenie code="PAVTVPAG" description="Gold Motor costs 10 instead of 16,000 (2 of 2)" />
  <gamegenie code="PEOGNTAA" description="Start on Track 02" />
  <gamegenie code="ZEOGNTAA" description="Start on Track 03" />
  <gamegenie code="LEOGNTAA" description="Start on Track 04" />
  <gamegenie code="GEOGNTAA" description="Start on Track 05" />
  <gamegenie code="IEOGNTAA" description="Start on Track 06" />
  <gamegenie code="TEOGNTAA" description="Start on Track 07" />
  <gamegenie code="YEOGNTAA" description="Start on Track 08" />
  <gamegenie code="PEOGNTAE" description="Start on Track 09" />
  <gamegenie code="ZEOGNTAE" description="Start on Track 10" />
  <gamegenie code="LEOGNTAE" description="Start on Track 11" />
  <gamegenie code="GEOGNTAE" description="Start on Track 12" />
  <gamegenie code="IEOGNTAE" description="Start on Track 13" />
  <gamegenie code="TEOGNTAE" description="Start on Track 14" />
  <gamegenie code="YEOGNTAE" description="Start on Track 15" />
  <gamegenie code="AOOGNTAA" description="Start on Track 16" />
  <gamegenie code="ZOOGNTAA" description="Start on Track 17" />
  <gamegenie code="LOOGNTAA" description="Start on Track 18" />
  <gamegenie code="GOOGNTAA" description="Start on Track 19" />
  <gamegenie code="IOOGNTAA" description="Start on Track 20" />
  <gamegenie code="TOOGNTAA" description="Start on Track 21" />
  <gamegenie code="YOOGNTAA" description="Start on Track 22" />
  <gamegenie code="AOOGNTAE" description="Start on Track 23" />
  <gamegenie code="POOGNTAE" description="Start on Track 24" />
  <gamegenie code="LOOGNTAE" description="Start on Track 25" />
  <gamegenie code="GOOGNTAE" description="Start on Track 26" />
  <gamegenie code="IOOGNTAE" description="Start on Track 27" />
  <gamegenie code="TOOGNTAE" description="Start on Track 28" />
  <gamegenie code="YOOGNTAE" description="Start on Track 29" />
  <gamegenie code="AEOGNTAE" description="Start on first Tug-O-Truck Challenge" />
  <gamegenie code="POOGNTAA" description="Start on Drag Race" />
  <gamegenie code="ZOOGNTAE" description="Start on second Tug-O-Truck Challenge" />
  <gamegenie code="SXKVLVVS" description="Infinite Lazers on purchase" />
  <gamegenie code="SXSTZKVS" description="Infinite Bombs on purchase" />
  <gamegenie code="SXOVGVVS" description="Infinite Freezes on purchase" />
  <gamegenie code="SZXVGSVS" description="Infinite Buckshot on purchase" />
  <gamegenie code="SZSTTSVS" description="Infinite Missiles on purchase" />
</game>
<game code="CLV-H-OQEXV" name="Race America, Alex DeMeo's" crc="A8B0DA56">
  <gamegenie code="SGSUGLVI" description="Can't down shift" />
  <gamegenie code="IAVUILYA" description="Cars only have 4 gears (1 of 2)" />
  <gamegenie code="IAKXAIYA" description="Cars only have 4 gears (2 of 2)" />
  <gamegenie code="OZNOAAEN" description="Go super fast in 6th gear (1 of 3)" />
  <gamegenie code="NYNOPAIE" description="Go super fast in 6th gear (2 of 3)" />
  <gamegenie code="SAXPGZVT" description="Go super fast in 6th gear (3 of 3)" />
</game>
<game code="CLV-H-YILIX" name="Rad Racer" crc="8B9D3E9C">
  <gamegenie code="AAKSYIPA" description="Never crash from things outside of the road" />
  <gamegenie code="NYZINV" description="Infinite time" />
  <gamegenie code="GZXIUVIZ" description="Less time to finish each stage" />
  <gamegenie code="GLXIUVIX" description="More time to finish each stage" />
  <gamegenie code="ALXGAIAA" description="Turbo acceleration" />
  <gamegenie code="YYUKGIAU" description="Super Turbo acceleration" />
  <gamegenie code="PEEGPIAA" description="Ultra Turbo acceleration" />
  <gamegenie code="GXKGKTSA" description="Start on stage XX (disable after loading stage) (1 of 2)" />
  <gamegenie code="PAXKPAAA" description="Start on stage 2 (disable after loading stage) (2 of 2)" />
  <gamegenie code="ZAXKPAAA" description="Start on stage 3 (disable after loading stage) (2 of 2)" />
  <gamegenie code="LAXKPAAA" description="Start on stage 4 (disable after loading stage) (2 of 2)" />
  <gamegenie code="GAXKPAAA" description="Start on stage 5 (disable after loading stage) (2 of 2)" />
  <gamegenie code="IAXKPAAA" description="Start on stage 6 (disable after loading stage) (2 of 2)" />
  <gamegenie code="TAXKPAAA" description="Start on stage 7 (disable after loading stage) (2 of 2)" />
  <gamegenie code="YAXKPAAA" description="Start on stage 8 (disable after loading stage) (2 of 2)" />
</game>
<game code="CLV-H-SUPAU" name="Raid 2020" crc="61253D1C">
  <gamegenie code="SXSSESVK" description="Infinite health (1 of 2)" />
  <gamegenie code="SZKSVSVK" description="Infinite health (2 of 2)" />
  <gamegenie code="SXVSIVVK" description="Infinite lives" />
</game>
<game code="CLV-H-MNFTW" name="Raid on Bungeling Bay" crc="D308D52C">
  <gamegenie code="PENGZYIE" description="Start with 9 lives" />
  <gamegenie code="PENGZYIA" description="Start with 1 life" />
  <gamegenie code="SXSIASVK" description="Infinite Bombs" />
  <gamegenie code="SXVVPIAX" description="Infinite Damage" />
  <gamegenie code="LEVKTYPA" description="Start on round 3" />
  <gamegenie code="TEVKTYPA" description="Start on round 6" />
  <gamegenie code="PEVKTYPE" description="Start on round 9" />
  <gamegenie code="AZOIIEGX" description="Can only carry 5 bombs" />
</game>
<game code="CLV-H-CNJWY" name="Rally Bike" crc="E1C41D7C">
  <gamegenie code="SIUKLUVV" description="Infinite gas" />
  <gamegenie code="PAUIKTIA" description="Start with 1 life - 1P game" />
  <gamegenie code="ZAUIKTIE" description="Start with 10 lives - 1P game" />
  <gamegenie code="SZEITKVV" description="Infinite lives - 1P game" />
  <gamegenie code="SZOSIKVN" description="Infinite lives - 2P game, both players" />
  <gamegenie code="PAUIKITA" description="Start with 1 life - 2P game, both players (1 of 2)" />
  <gamegenie code="ZAXSTGTA" description="Start with 1 life - 2P game, both players (2 of 2)" />
  <gamegenie code="ZAUIKTIE" description="Start with 10 lives - 2P game, both players (1 of 2)" />
  <gamegenie code="LAXSTGIE" description="Start with 10 lives - 2P game, both players (2 of 2)" />
</game>
<game code="CLV-H-FNKVZ" name="Rambo" crc="4F9DBBE5">
  <gamegenie code="ATOSXISL" description="Invincibility" />
  <gamegenie code="GOXTZXZA" description="Gain double amount on pick-up" />
  <gamegenie code="GNXTZXZA" description="Gain maximum amount on pick-up" />
  <gamegenie code="SXOVXKVS" description="Infinite weapons" />
  <gamegenie code="AEVSNOZL" description="Hit anywhere" />
  <gamegenie code="IPNEITPP" description="Start with Hand Grenades (1 of 2)" />
  <gamegenie code="IOEALTPP" description="Start with Hand Grenades (2 of 2)" />
  <gamegenie code="ZEEEITIA" description="Start with 2 Medicine Bottles" />
  <gamegenie code="ZVEEITIA" description="Start with 9 Medicine Bottles" />
</game>
<game code="CLV-H-OLOVN" name="Rampage" crc="263AC8A0">
  <gamegenie code="NYSGLUYN" description="More health - P1" />
  <gamegenie code="NYVKTUYN" description="More health - P2" />
  <gamegenie code="YLSGLUYN" description="Less health - P1" />
  <gamegenie code="YLVKTUYN" description="Less health - P2" />
  <gamegenie code="NNNGKNYN" description="More health after continue - both players" />
  <gamegenie code="YUNGKNYN" description="Less health after continue - both players" />
  <gamegenie code="AEXLPGAP" description="No harm from falling" />
  <gamegenie code="GXXLALOP" description="No harm from attacks or bad food" />
  <gamegenie code="AXXLPGAP" description="More damage done from falling" />
  <gamegenie code="GEULLLIA" description="Double health from food" />
  <gamegenie code="AEULLLIA" description="Half health from food (1 of 2)" />
  <gamegenie code="ZKULTUZE" description="Half health from food (2 of 2)" />
  <gamegenie code="AAOUOPPA" description="No harm from water (1 of 2)" />
  <gamegenie code="AASLSPPA" description="No harm from water (2 of 2)" />
  <gamegenie code="EEKXYPIA" description="One hit to destroy buildings" />
  <gamegenie code="ASSZGTEY" description="Buildings collapse faster (1 of 2)" />
  <gamegenie code="IOOZUXIA" description="Buildings collapse faster (2 of 2)" />
  <gamegenie code="ASUTPIEL" description="Buildings collapse automatically" />
</game>
<game code="CLV-H-NGIZS" name="Ren &amp; Stimpy Show, The: Buckeroo$!" crc="E98AB943">
  <gamegenie code="NYOYXLYE" description="Infinite health" />
  <gamegenie code="NYUVOZTE" description="Infinite lives" />
  <gamegenie code="PEUAPZLA" description="Start with 2 lives" />
  <gamegenie code="IEUAPZLA" description="Start with 6 lives" />
  <gamegenie code="YEUAPZLA" description="Start with 8 lives" />
  <gamegenie code="PEUAPZLE" description="Start with 10 lives" />
  <gamegenie code="VNXELSSO" description="Start with $11 instead of 0" />
  <gamegenie code="OUEAXXOO" description="Infinite collectibles" />
  <gamegenie code="YPEYOUGU" description="Shorter invincibility after getting hit" />
  <gamegenie code="ITEYOUGL" description="Longer invincibility after getting hit" />
  <gamegenie code="ZAXNPZIA" description="2 custard pies on pick-up" />
  <gamegenie code="PAXNPZIE" description="9 custard pies on pick-up" />
  <gamegenie code="OZEEPYES" description="Start on XX level (1 of 2)" />
  <gamegenie code="PAEEZYZZ" description="Start on Rescue the Maiden/Out West levels (2 of 3)" />
  <gamegenie code="SAEELNVV" description="Start on Out West/Robin Hoek levels (3 of 3)" />
  <gamegenie code="ZAEEZYZZ" description="Start on Robin Hoek level (3 of 3)" />
</game>
<game code="CLV-H-JORLR" name="Renegade" crc="A0568E1D">
  <gamegenie code="AVSTEXPT" description="Infinite health (1 of 5)" />
  <gamegenie code="INKVNXAO" description="Infinite health (2 of 5)" />
  <gamegenie code="LUKVSZPY" description="Infinite health (3 of 5)" />
  <gamegenie code="OXKVKXSX" description="Infinite health (4 of 5)" />
  <gamegenie code="SEKVVZGA" description="Infinite health (5 of 5)" />
  <gamegenie code="SXUIOTVG" description="Infinite lives" />
  <gamegenie code="AEOSLYZA" description="Start with 1 life - both players" />
  <gamegenie code="IEOSLYZA" description="Start with 6 lives - both players" />
  <gamegenie code="AEOSLYZE" description="Start with 9 lives - both players" />
  <gamegenie code="AIUOZUAZ" description="Start with a super energy boost" />
  <gamegenie code="PEXSYYAA" description="Start on mission 2" />
  <gamegenie code="ZEXSYYAA" description="Start on mission 3" />
  <gamegenie code="LEXSYYAA" description="Start on mission 4" />
  <gamegenie code="TOSVOXTU" description="Timer runs faster" />
  <gamegenie code="EXSVOXTL" description="Timer runs slower" />
</game>
<game code="CLV-H-KWJAL" name="Ring King" crc="5BB62688">
  <gamegenie code="GZEIPVVK" description="Unlimited power points - 1P game" />
  <gamegenie code="GXKZXYOP" description="Don't lose stamina from fighting" />
  <gamegenie code="LEOSLYTA" description="Rounds are 30 seconds" />
  <gamegenie code="PEOSLYTE" description="Rounds are 90 seconds" />
  <gamegenie code="GXOZOIOP" description="Players can't hurt each other" />
</game>
<game code="CLV-H-UXDJW" name="River City Ransom" crc="E9C387EC">
  <gamegenie code="SUNEUKSO" description="Infinite lives" />
  <gamegenie code="LVSNAVYA" description="Start with max stats" />
  <gamegenie code="SUKOOXSO" description="Infinite money (1 of 3)" />
  <gamegenie code="SUSPEXSO" description="Infinite money (2 of 3)" />
  <gamegenie code="SUSPNXSO" description="Infinite money (3 of 3)" />
  <gamegenie code="LZXTXGLP" description="Coins worth max amount of money" />
  <gamegenie code="TOSNAVYE" description="Start with double every attribute" />
  <gamegenie code="YNSNAVYE" description="127 of all stats" />
  <gamegenie code="LVNYIVYL" description="99 Stamina" />
  <gamegenie code="YYVOIUYU" description="Max Punch" />
  <gamegenie code="YYVOTUYU" description="Max Kick" />
  <gamegenie code="YYVOYUYU" description="Max Weapon" />
  <gamegenie code="YYNPAUYU" description="Max Throw" />
  <gamegenie code="YYNPPUYU" description="Max Agility" />
  <gamegenie code="YYNPZUYU" description="Max Defense" />
  <gamegenie code="YYNPLUYU" description="Max Strength" />
  <gamegenie code="YYNPGUYU" description="Max Will Power" />
  <gamegenie code="NYNPTUYN" description="Max Stamina" />
  <gamegenie code="OOELVUOU" description="Infinite Stamina (1 of 2)" />
  <gamegenie code="OXVUVUOV" description="Infinite Stamina (2 of 2)" />
  <gamegenie code="SLOXNNSO" description="Infinite Will Power" />
  <gamegenie code="AGENAYAZ" description="Start with double money - P1" />
  <gamegenie code="AGOYYYAZ" description="Start with double money - P2" />
  <gamegenie code="PAENIYAA" description="Start with $100 extra - P1" />
  <gamegenie code="PAONGYAA" description="Start with $100 extra - P2" />
  <gamegenie code="ENVYZZEI" description="View the credits" />
</game>
<game code="CLV-H-NGDKH" name="Road Runner" crc="B19A55DD">
  <gamegenie code="SZOVUUVK" description="Infinite lives" />
  <gamegenie code="AAEVTGIA" description="Start with 1 life" />
  <gamegenie code="LAEVTGIE" description="Start with 12 lives" />
  <gamegenie code="PPEVTGIA" description="Start with 18 lives" />
  <gamegenie code="IAOTLGPA" description="Start on level 5" />
  <gamegenie code="ZAOTLGPE" description="Start on level 10" />
  <gamegenie code="YAOTLGPE" description="Start on level 15" />
  <gamegenie code="GPOTLGPA" description="Start on level 20" />
  <gamegenie code="PPOTLGPE" description="Start on level 25" />
  <gamegenie code="TPOTLGPE" description="Start on level 30" />
  <gamegenie code="XVUGAOEK" description="Never lose seed (1 of 2)" />
  <gamegenie code="XVXTSUEK" description="Never lose seed (2 of 2)" />
</game>
<game code="CLV-H-HGJIL" name="RoadBlasters" crc="8ADA3497">
  <gamegenie code="SZEIGEVK" description="Infinite credits" />
  <gamegenie code="GAVLUTZA" description="Double credits" />
  <gamegenie code="PEEAEIIE" description="Extend lifetime of UZ Cannon" />
  <gamegenie code="NNSEOIEE" description="Extend lifetime of Nitro Injector" />
  <gamegenie code="AKSEOIEA" description="Reduce lifetime of Nitro Injector" />
  <gamegenie code="SXVEKSVK" description="Infinite Cruise missiles (1 of 2)" />
  <gamegenie code="ETOENSTP" description="Infinite Cruise missiles (2 of 2)" />
  <gamegenie code="ATNEEISZ" description="Infinite UZ Cannon (1 of 2)" />
  <gamegenie code="LZOENSTO" description="Infinite UZ Cannon (2 of 2)" />
  <gamegenie code="AVSEKSVG" description="Infinite Nitro Injectors (1 of 3)" />
  <gamegenie code="SAOENSTO" description="Infinite Nitro Injectors (2 of 3)" />
  <gamegenie code="GXKEOIEY" description="Infinite Nitro Injectors (3 of 3)" />
  <gamegenie code="SZSEKVVK" description="Infinite Electro Shield (1 of 3)" />
  <gamegenie code="PIOENSTP" description="Infinite Electro Shield (2 of 3)" />
  <gamegenie code="VAXAESSE" description="Infinite Electro Shield (3 of 3)" />
</game>
<game code="CLV-H-HQWJX" name="Robin Hood: Prince of Thieves" crc="86B0D1CF">
  <gamegenie code="VAXEOLSA" description="Infinite HP for Robin in main combat" />
  <gamegenie code="EYXAOPAL" description="Infinite HP for Robin in dueling combat" />
  <gamegenie code="GOXLLNAA" description="Bandages give more HP back" />
  <gamegenie code="AOULIUAE" description="Food gives more HP back - Except the Leg of meat" />
  <gamegenie code="AASPIZPA" description="Infinite Arrows" />
</game>
<game code="CLV-H-PHCEK" name="Robo Warrior" crc="810B7AB9">
  <gamegenie code="GZUNYXTK" description="No damage from bomb blast" />
  <gamegenie code="GZNNIXTK" description="No damage from monsters and no power drain" />
  <gamegenie code="SUXSNIVI" description="Infinite Mega Bomb after after pick-up" />
  <gamegenie code="XTXGKPVV" description="Infinite Barrier after pick-up" />
  <gamegenie code="IAVTPSZA" description="5 Super Bombs on pick-up" />
  <gamegenie code="GPVTPSZA" description="20 Super Bombs on pick-up" />
  <gamegenie code="SZKTYPVG" description="Infinite Super Bombs" />
  <gamegenie code="IEVKLPAA" description="Start with 5 of everything" />
  <gamegenie code="ZEVKLPAE" description="Start with 10 of everything" />
  <gamegenie code="IANGAPPA" description="Set firing range to 5" />
  <gamegenie code="ZANGAPPE" description="Set firing range to 10" />
  <gamegenie code="IEVGIPPA" description="Start with defense level at 5" />
  <gamegenie code="AEVGIPPE" description="Start with defense level at 8" />
  <gamegenie code="EONGELAP" description="Walk through walls" />
</game>
<game code="CLV-H-NRLUM" name="RoboCop" crc="192D546F">
  <gamegenie code="LLNTTZIU" description="Invincibility (1 of 2)" />
  <gamegenie code="SLXUYTAX" description="Invincibility (2 of 2)" />
  <gamegenie code="SXKXYIVT" description="Infinite time" />
  <gamegenie code="SGOTKLIA" description="Infinite ammunition" />
  <gamegenie code="SZKVOTSA" description="No damage from touching enemies" />
  <gamegenie code="SZVVVYSA" description="No damage from enemy bullets" />
  <gamegenie code="AEOXIXLL" description="Bosses die automatically" />
  <gamegenie code="SOKZLNSU" description="Can't harm civilian at the end of level 1" />
  <gamegenie code="PAOYNILE" description="Triple normal power on power food pick-up" />
  <gamegenie code="PAXNEILE" description="Triple normal time on battery pick-up" />
  <gamegenie code="TPXNEILA" description="Max time on battery pick-up" />
  <gamegenie code="TPOYNILA" description="Full power on power food pick-up" />
  <gamegenie code="YAXSAPPE" description="Use with COP Code 2 to start with machine gun and Cobra gun" />
  <gamegenie code="YAXIGXTE" description="Press Start to finish the level" />
  <gamegenie code="SAESLPSP" description="Start on level X (1 of 3)" />
  <gamegenie code="TTESGPSA" description="Start on level X (2 of 3)" />
  <gamegenie code="PAESZPAA" description="Start on level 2 (3 of 3)" />
  <gamegenie code="ZAESZPAA" description="Start on level 3 (3 of 3)" />
  <gamegenie code="LAESZPAA" description="Start on level 4 (3 of 3)" />
  <gamegenie code="GAESZPAA" description="Start on level 5 (3 of 3)" />
  <gamegenie code="IAESZPAA" description="Start on level 6 (3 of 3)" />
</game>
<game code="CLV-H-WIZRE" name="RoboCop 2" crc="990985C0">
  <gamegenie code="ENVEUYEI" description="Invincibility" />
  <gamegenie code="AVKTPNOP" description="Infinite health" />
  <gamegenie code="SINKIPVI" description="Infinite lives" />
  <gamegenie code="SGETGYVG" description="Infinite time (1 of 2)" />
  <gamegenie code="SKNVGTVG" description="Infinite time (2 of 2)" />
  <gamegenie code="EINAXLEY" description="No enemies" />
  <gamegenie code="AAEVKALA" description="Each N (Nuke) is worth 10" />
</game>
<game code="CLV-H-IAYMI" name="RoboCop 3" crc="96087988">
  <gamegenie code="OXONLPSV" description="Infinite efficiency (1 of 2)" />
  <gamegenie code="POONGPXV" description="Infinite efficiency (2 of 2)" />
  <gamegenie code="OUXYPOSO" description="Infinite efficiency (alt)" />
  <gamegenie code="AEENAEUT" description="Hit anywhere" />
  <gamegenie code="GNUNAEKN" description="One hit kills" />
  <gamegenie code="VVKGLATE" description="Lots of repair icons" />
  <gamegenie code="ZLVGIXPP" description="Start with 2x health" />
  <gamegenie code="GAVGIXPO" description="Start with 1/2 health" />
</game>
<game code="CLV-H-HVSQY" name="Rock'n' Ball" crc="476E022B">
  <gamegenie code="SLNXYEVS" description="Infinite balls" />
</game>
<game code="CLV-H-AWYIZ" name="Rocket Ranger" crc="67F77118">
  <gamegenie code="ZEOGSYPA" description="Double amount of Lunarium in storage" />
  <gamegenie code="LEOGSYPA" description="Triple amount of Lunarium in storage" />
  <gamegenie code="LVOKXNGL" description="Lunarium level in backpack at 99" />
  <gamegenie code="SZSGPUSE" description="Never lose Lunarium in backpack" />
  <gamegenie code="AEOGSYPA" description="Half amount of Lunarium in storage (1 of 2)" />
  <gamegenie code="ZUOKNYAA" description="Half amount of Lunarium in storage (2 of 2)" />
</game>
<game code="CLV-H-GMBNC" name="Rocketeer, The" crc="1D6DECCC">
  <gamegenie code="GESLNKAA" description="Start with 1/2 health" />
  <gamegenie code="AOSLNKAA" description="Start with 2x health" />
  <gamegenie code="AOSLNKAE" description="Start with 3x health" />
  <gamegenie code="GZSSINSV" description="Infinite health" />
  <gamegenie code="IAOZZXZA" description="1/2 normal bullets on pick-up" />
  <gamegenie code="GPOZZXZA" description="2x normal bullets on pick-up" />
  <gamegenie code="TPOZZXZE" description="3x normal bullets on pick-up" />
  <gamegenie code="ZAEZGZGO" description="1/2 silver bullets on pick-up" />
  <gamegenie code="AZEZGZGO" description="2x silver bullets on pick-up" />
  <gamegenie code="GLEZGZGO" description="3x silver bullets on pick-up" />
  <gamegenie code="AAVLKIIA" description="Have all weapons with infinite ammo" />
</game>
<game code="CLV-H-UKNXK" name="Rockin' Kats" crc="8927FD4C">
  <gamegenie code="SXKVZVSE" description="Infinite health" />
  <gamegenie code="AENTTTTP" description="Hit anywhere" />
  <gamegenie code="AEOEYZOI" description="Can select any item (you will not be able to see it)" />
  <gamegenie code="AEXEELAP" description="Can always select channel 5" />
  <gamegenie code="OXEEOYSX" description="Can always buy items" />
  <gamegenie code="SKOKOSVK" description="Infinite lives" />
  <gamegenie code="EIXVATEY" description="Invincibility" />
</game>
<game code="CLV-H-TMDJY" name="Roger Clemens' MVP Baseball" crc="018A8699">
  <gamegenie code="ZANEAPLA" description="2 strikes and you're out (1 of 3)" />
  <gamegenie code="ZEOUYPLA" description="2 strikes and you're out (2 of 3)" />
  <gamegenie code="ZEVKGPLA" description="2 strikes and you're out (3 of 3)" />
  <gamegenie code="PANEAPLA" description="1 strike and you're out (1 of 3)" />
  <gamegenie code="PEOUYPLA" description="1 strike and you're out (2 of 3)" />
  <gamegenie code="PEVKGPLA" description="1 strike and you're out (3 of 3)" />
  <gamegenie code="OOVSLLPA" description="Strikes are not called when batter doesn't swing" />
  <gamegenie code="GANAAPZA" description="Strikes are not called when batter swings" />
  <gamegenie code="PENKLPGA" description="1 ball for a walk" />
  <gamegenie code="ZENKLPGA" description="2 balls for a walk" />
  <gamegenie code="LENKLPGA" description="3 balls for walk" />
  <gamegenie code="OONIALAA" description="Infinite balls (balls are not called)" />
  <gamegenie code="SLNALPVY" description="Infinite balls and strikes" />
</game>
<game code="CLV-H-WXSIW" name="Rollerball" crc="69635A6E">
  <gamegenie code="PANGIPLA" description="Start with only 1 ball - all players" />
  <gamegenie code="SZKGPXVS" description="Infinite balls - all players" />
</game>
<game code="CLV-H-TTYXV" name="Rollerblade Racer" crc="2370C0A9">
  <gamegenie code="PAUKUZLA" description="Start with 1 life" />
  <gamegenie code="TAUKUZLA" description="Start with 6 lives" />
  <gamegenie code="PAUKUZLE" description="Start with 9 lives" />
  <gamegenie code="OXVSAYVK" description="Infinite lives" />
  <gamegenie code="PEVIPYGA" description="1 fall and you're dead" />
  <gamegenie code="TEVIPYGA" description="6 falls and you're dead" />
  <gamegenie code="AEVIPYGE" description="8 falls and you're dead" />
  <gamegenie code="ZAUKNZAA" description="Start on the City Street" />
  <gamegenie code="GAUKNZAA" description="Start on Hit the Beach" />
  <gamegenie code="TAUKNZAA" description="Start on Panic Park" />
</game>
<game code="CLV-H-RUHJU" name="Rollergames" crc="AA4997C1">
  <gamegenie code="SXENAYVG" description="Infinite lives" />
  <gamegenie code="PASAZALE" description="9 special moves" />
  <gamegenie code="TASAZALA" description="6 special moves" />
  <gamegenie code="GXVPAZVG" description="Infinite special moves" />
  <gamegenie code="TASATEGA" description="Start with less energy" />
  <gamegenie code="APSATEGE" description="Start with more energy" />
  <gamegenie code="PAKAAGAE" description="Mega-jump" />
  <gamegenie code="GZOENISA" description="Infinite time" />
  <gamegenie code="YPOAUSYU" description="Faster timer" />
  <gamegenie code="YYOAUSYU" description="Slower timer" />
</game>
<game code="CLV-H-SBITI" name="Rolling Thunder" crc="F92BE3EC">
  <gamegenie code="SZSZGVSE" description="Infinite health" />
  <gamegenie code="SZNTULVG" description="Infinite lives (1 of 2)" />
  <gamegenie code="SZSTULVG" description="Infinite lives (2 of 2)" />
  <gamegenie code="SZEVYZVG" description="Infinite time" />
  <gamegenie code="AKSZANEL" description="Hit anywhere (1 of 3)" />
  <gamegenie code="ATUILYEI" description="Hit anywhere (2 of 3)" />
  <gamegenie code="OXSZPNEX" description="Hit anywhere (3 of 3)" />
  <gamegenie code="EKSTEAGV" description="200 Machine Gun bullets on pick-up" />
  <gamegenie code="SUOZPXVS" description="300 Machine Gun bullets and 300 bullets on pick-up" />
  <gamegenie code="GOKVNAZL" description="Gain fewer bullets on pick-up" />
  <gamegenie code="ZLVITYPA" description="Self-replenishing bullets" />
  <gamegenie code="EKXVZAZU" description="Start with 200 bullets" />
  <gamegenie code="EGKVKLZU" description="Start with 200 bullets on each new life" />
  <gamegenie code="LEXTZAAA" description="Start with loads of ammunition (1 of 2)" />
  <gamegenie code="LAKTKLAA" description="Start with loads of ammunition (2 of 2)" />
  <gamegenie code="PEOVLALA" description="Start with 1 life" />
  <gamegenie code="TEOVLALA" description="Start with 6 lives" />
  <gamegenie code="PEOVLALE" description="Start with 9 lives" />
  <gamegenie code="PASPYZLA" description="Start with 1 life after continue" />
  <gamegenie code="TASPYZLA" description="Start with 6 lives after continue" />
  <gamegenie code="PASPYZLE" description="Start with 9 lives after continue" />
  <gamegenie code="AEEVSAZE" description="Start with increased life meter" />
  <gamegenie code="ALVESYOL" description="Start on story X area X (1 of 2)" />
  <gamegenie code="PAVEUYAA" description="Start on story 1 area 02 (2 of 2)" />
  <gamegenie code="ZAVEUYAA" description="Start on story 1 area 03 (2 of 2)" />
  <gamegenie code="LAVEUYAA" description="Start on story 1 area 04 (2 of 2)" />
  <gamegenie code="GAVEUYAA" description="Start on story 1 area 05 (2 of 2)" />
  <gamegenie code="IAVEUYAA" description="Start on story 2 area 06 (2 of 2)" />
  <gamegenie code="TAVEUYAA" description="Start on story 2 area 07 (2 of 2)" />
  <gamegenie code="YAVEUYAA" description="Start on story 2 area 08 (2 of 2)" />
  <gamegenie code="AAVEUYAE" description="Start on story 2 area 09 (2 of 2)" />
  <gamegenie code="PAVEUYAE" description="Start on story 2 area 10 (2 of 2)" />
  <gamegenie code="PEKEXIAA" description="Start on story 3 area 01" />
</game>
<game code="CLV-H-LIAPS" name="Rush'n Attack" crc="DE25B90F">
  <gamegenie code="KAXAGYIA" description="Invincibility (star effect) (1 of 2)" />
  <gamegenie code="KAXEYYIA" description="Invincibility (star effect) (2 of 2)" />
  <gamegenie code="AIUAPPEI" description="Invincibility (except vs bullets)" />
  <gamegenie code="AENASIPA" description="Infinite POW" />
  <gamegenie code="ASKELZEL" description="Hit anywhere (1 of 5)" />
  <gamegenie code="LUKEGXLV" description="Hit anywhere (3 of 5)" />
  <gamegenie code="GGXAAIEU" description="Hit anywhere (2 of 5)" />
  <gamegenie code="YLXAPSGI" description="Hit anywhere (5 of 5)" />
  <gamegenie code="SAXAZSOL" description="Hit anywhere (4 of 5)" />
  <gamegenie code="SAVSNNSX" description="Always have 255 POW" />
  <gamegenie code="GZOEAYVG" description="Infinite lives - P1" />
  <gamegenie code="GZOEIYVG" description="Infinite lives - P2" />
  <gamegenie code="PAVSTPIA" description="Start with 1 life - P1" />
  <gamegenie code="PANITPIA" description="Start with 1 life - P2" />
  <gamegenie code="ZAVSTPIE" description="Start with 10 lives - P1" />
  <gamegenie code="ZANITPIE" description="Start with 10 lives - P2" />
  <gamegenie code="AAUZUNNN" description="Multi-jump (01 of 15)" />
  <gamegenie code="ATUXKNNY" description="Multi-jump (02 of 15)" />
  <gamegenie code="AUSALYOY" description="Multi-jump (03 of 15)" />
  <gamegenie code="AZUXONNY" description="Multi-jump (04 of 15)" />
  <gamegenie code="AZUZVNNY" description="Multi-jump (05 of 15)" />
  <gamegenie code="EYUZKNNY" description="Multi-jump (06 of 15)" />
  <gamegenie code="EYUZNNNN" description="Multi-jump (07 of 15)" />
  <gamegenie code="GAUZONNY" description="Multi-jump (08 of 15)" />
  <gamegenie code="LAUZSNNY" description="Multi-jump (09 of 15)" />
  <gamegenie code="NXSAGNUE" description="Multi-jump (10 of 15)" />
  <gamegenie code="OAUXENNN" description="Multi-jump (11 of 15)" />
  <gamegenie code="OYUXXNNY" description="Multi-jump (12 of 15)" />
  <gamegenie code="PZUZXNNN" description="Multi-jump (13 of 15)" />
  <gamegenie code="SZUZENNY" description="Multi-jump (14 of 15)" />
  <gamegenie code="UAUXUNNN" description="Multi-jump (15 of 15)" />
</game>
<game code="CLV-H-PMBEI" name="Rygar" crc="37C474D5">
  <gamegenie code="ATEZOTKA" description="Invincibility" />
  <gamegenie code="APKXSIEY" description="Multi-jump (01 of 10)" />
  <gamegenie code="ATOZTEOZ" description="Multi-jump (02 of 10)" />
  <gamegenie code="AZKXXIGE" description="Multi-jump (03 of 10)" />
  <gamegenie code="GASZOIIA" description="Multi-jump (04 of 10)" />
  <gamegenie code="IZKXUSPZ" description="Multi-jump (05 of 10)" />
  <gamegenie code="SAKXNSSX" description="Multi-jump (06 of 10)" />
  <gamegenie code="SZKXOIXP" description="Multi-jump (07 of 10)" />
  <gamegenie code="XGSZEIZL" description="Multi-jump (08 of 10)" />
  <gamegenie code="XTKXESSX" description="Multi-jump (09 of 10)" />
  <gamegenie code="ZZKXKIAX" description="Multi-jump (10 of 10)" />
  <gamegenie code="SXUZXTSA" description="Infinite health" />
  <gamegenie code="POXXVYSA" description="One hit kills" />
  <gamegenie code="AVOXVTIA" description="Don't be pushed after being hit" />
  <gamegenie code="AAZEZZ" description="Infinite Mind points" />
  <gamegenie code="IEKZPLIZ" description="Have first three items after pressing B once" />
  <gamegenie code="LAVOLTGA" description="Jump higher" />
  <gamegenie code="ALOXKIEL" description="Hit anywhere (1 of 4)" />
  <gamegenie code="ALUZUIEL" description="Hit anywhere (2 of 4)" />
  <gamegenie code="ALXZXIEL" description="Hit anywhere (3 of 4)" />
  <gamegenie code="EYUXOIEL" description="Hit anywhere (4 of 4)" />
  <gamegenie code="AAOZLEAA" description="Pits aren't fatal (side view)" />
  <gamegenie code="ASSOSGEI" description="Walk on water (overhead view)" />
  <gamegenie code="SZUPOOVK" description="Grappling Hook continues to search for land (1 of 2)" />
  <gamegenie code="SZXXGZSA" description="Grappling Hook continues to search for land (2 of 2)" />
  <gamegenie code="AOUGPATE" description="Start with 12 units of health (1 of 2)" />
  <gamegenie code="AOUGZATE" description="Start with 12 units of health (2 of 2)" />
  <gamegenie code="EPSLYIEL" description="Enemies always drop X (1 of 3)" />
  <gamegenie code="OZNUTSPX" description="Enemies always drop X (2 of 3)" />
  <gamegenie code="LANUYIYA" description="Enemies always drop a health potion (3 of 3)" />
  <gamegenie code="GANUYIYA" description="Enemies always drop a Mind unit (3 of 3)" />
</game>
<game code="CLV-H-QELFL" name="S.C.A.T.: Special Cybernetic Attack Team" crc="74189E12">
  <gamegenie code="AANSUGPA" description="Infinite health" />
  <gamegenie code="ZUXGKTTA" description="Start with more health" />
  <gamegenie code="ZANVNGLE" description="More health on pick-up" />
  <gamegenie code="AEESVKAA" description="Don't lose speed-ups when hit" />
  <gamegenie code="NNEIKGAK" description="Longer immunity" />
  <gamegenie code="APKSEGAG" description="Shorter immunity" />
  <gamegenie code="PAEIKTTE" description="Faster maximum speed-up (1 of 2)" />
  <gamegenie code="NYEISVXY" description="Faster maximum speed-up (2 of 2)" />
  <gamegenie code="TENIKIGA" description="Faster normal speed-up (1 of 2)" />
  <gamegenie code="XNNISSKN" description="Faster normal speed-up (2 of 2)" />
</game>
<game code="CLV-H-THFRB" name="Secret Scout in the Temple of Demise (Unl) [!p]" crc="AC559FBD">
  <gamegenie code="OUXTYKOO" description="Infinite lives" />
  <gamegenie code="ASVIYIAE" description="View the ending" />
</game>
<game code="CLV-H-GYQPU" name="Section Z" crc="0FEC90D2">
  <gamegenie code="SXOPUIVG" description="Infinite lives" />
  <gamegenie code="ZAUNUZAE" description="Energy tube gives full energy boost" />
  <gamegenie code="NNNOUTSY" description="Autofiring capability" />
  <gamegenie code="NNNOUTSN" description="Autofire without having to hold the button down" />
  <gamegenie code="LAEAZYPA" description="Start a new game to view ending" />
  <gamegenie code="PEXSIZLA" description="Start with 1 life" />
  <gamegenie code="TEXSIZLA" description="Start with 6 lives" />
  <gamegenie code="PEXSIZLE" description="Start with 9 lives" />
</game>
<game code="CLV-H-VJACK" name="Seicross" crc="27AA3933">
  <gamegenie code="SUTEEX" description="Infinite lives" />
  <gamegenie code="PELAGA" description="Start with 1 life" />
  <gamegenie code="TELAGA" description="Start with 6 lives" />
  <gamegenie code="PELAGE" description="Start with 9 lives" />
  <gamegenie code="PEGEUG" description="Slow motion" />
</game>
<game code="CLV-H-XRHSN" name="Shadow of the Ninja" crc="DDD90C39">
  <gamegenie code="SZSNIIVG" description="Infinite continues" />
  <gamegenie code="PEEVZAIE" description="9 continues" />
  <gamegenie code="PEEVZAIA" description="1 continue" />
  <gamegenie code="GZVXSKSO" description="Don't lose energy from enemy attacks" />
  <gamegenie code="AAVPGIGA" description="Don't lose energy from falling" />
  <gamegenie code="APOEOGGA" description="Maximum energy gained from potion" />
  <gamegenie code="PAOEOGGA" description="Less energy gained from potion" />
  <gamegenie code="AZUAOGGO" description="40 Throwing Stars on pick-up" />
  <gamegenie code="GPKAVGIA" description="20 Bombs on pick-up" />
  <gamegenie code="XVKPAVVN" description="Mega-jump" />
  <gamegenie code="XTXXLOSO" description="Some enemies can't move left or right" />
</game>
<game code="CLV-H-KAOUH" name="Shadowgate" crc="6A1F628A">
  <gamegenie code="XVESZNVK" description="Infinite torches" />
</game>
<game code="CLV-H-PPHFS" name="Shatterhand" crc="AA20F73D">
  <gamegenie code="AIOEPIEL" description="Hit anywhere (1 of 4)" />
  <gamegenie code="GXNALGEL" description="Hit anywhere (2 of 4)" />
  <gamegenie code="GXNEYGEP" description="Hit anywhere (3 of 4)" />
  <gamegenie code="GXSELGEP" description="Hit anywhere (4 of 4)" />
  <gamegenie code="AAKKSPPA" description="Power-ups don't use up gold" />
  <gamegenie code="AXXAZZGO" description="Big coins worth double" />
  <gamegenie code="ZEXAZZGO" description="Big coins worth half" />
  <gamegenie code="YEEAYZIE" description="Small coins worth triple" />
  <gamegenie code="AEVNAIZA" description="Start with 1 life" />
  <gamegenie code="IEVNAIZA" description="Start with 6 lives" />
  <gamegenie code="AEVNAIZE" description="Start with 9 lives" />
  <gamegenie code="GENNZSAA" description="Start with less health" />
</game>
<game code="CLV-H-QPIPQ" name="Shinobi" crc="EB0BDA7E">
  <gamegenie code="SZEOLXVK" description="Infinite lives" />
  <gamegenie code="AANOLAZA" description="Start with 1 life" />
  <gamegenie code="IANOLAZA" description="Start with 6 lives" />
  <gamegenie code="AANOLAZE" description="Start with 9 lives" />
  <gamegenie code="SZNIPNVK" description="Infinite life" />
  <gamegenie code="IEKONILA" description="Turbo running" />
  <gamegenie code="GAXOTATE" description="Start with double life (1 of 2)" />
  <gamegenie code="GENPGPTE" description="Start with double life (2 of 2)" />
</game>
<game code="CLV-H-YZCLX" name="Shooting Range" crc="851EB9BE">
  <gamegenie code="GTEPOAZL" description="Double bonus time for hourglasses" />
  <gamegenie code="PPEPOAZU" description="Half bonus time for hourglasses" />
  <gamegenie code="GEKAILLA" description="More time for level 1 (1 of 2)" />
  <gamegenie code="GAEETTLA" description="More time for level 1 (2 of 2)" />
  <gamegenie code="ZEKAILLA" description="Less time for level 1 (1 of 2)" />
  <gamegenie code="ZAEETTLA" description="Less time for level 1 (2 of 2)" />
  <gamegenie code="GAOAATZA" description="More time for level 2 (1 of 2)" />
  <gamegenie code="AAOAPTZL" description="More time for level 2 (2 of 2)" />
  <gamegenie code="PAOAATZA" description="Less time for level 2 (1 of 2)" />
  <gamegenie code="ZLOAPTZL" description="Less time for level 2 (2 of 2)" />
  <gamegenie code="GAOAZTZA" description="More time for level 3 (1 of 2)" />
  <gamegenie code="ZLOALTAA" description="More time for level 3 (2 of 2)" />
  <gamegenie code="PAOAZTZA" description="Less time for level 3 (1 of 2)" />
  <gamegenie code="AAOALTAA" description="Less time for level 3 (2 of 2)" />
  <gamegenie code="ASUAIVAZ" description="XX usual shots per round (1 of 3)" />
  <gamegenie code="SXVONOOU" description="Double usual shots per round (2 of 3)" />
  <gamegenie code="ASXOVXAZ" description="Double usual shots per round (3 of 3)" />
  <gamegenie code="ANXOVXAX" description="Triple usual shots per round (3 of 3)" />
  <gamegenie code="EXXOVXAZ" description="Quadruple usual shots per round (3 of 3)" />
</game>
<game code="CLV-H-QIZHO" name="Side Pocket" crc="DC4DA5D4">
  <gamegenie code="SXKXNLSA" description="Infinite turns - P1" />
</game>
<game code="CLV-H-GWMPK" name="Silent Service" crc="B843EB84">
  <gamegenie code="ZLEPOIAI" description="Start with 50 deck gun shells" />
  <gamegenie code="LTEPOIAI" description="Start with 99 deck gun shells" />
  <gamegenie code="SZXVOPVG" description="Infinite deck gun shells" />
  <gamegenie code="SZSVUPVG" description="Infinite bow torpedoes" />
  <gamegenie code="SXETUPVG" description="Infinite aft torpedoes" />
</game>
<game code="CLV-H-VZCRI" name="Silkworm" crc="E74A91BB">
  <gamegenie code="PAXGXALA" description="Start with 1 life" />
  <gamegenie code="TAXGXALA" description="Start with 6 lives" />
  <gamegenie code="PAXGXALE" description="Start with 9 lives" />
  <gamegenie code="SXSVIZVG" description="Infinite lives using helicopter" />
  <gamegenie code="SZVVGTVG" description="Infinite lives using jeep" />
  <gamegenie code="PEEGSPLA" description="1 life using helicopter after continue" />
  <gamegenie code="TEEGSPLA" description="6 lives using helicopter after continue" />
  <gamegenie code="PEEGSPLE" description="9 lives using helicopter after continue" />
  <gamegenie code="PEOKNPLA" description="1 life using jeep after continue" />
  <gamegenie code="TEOKNPLA" description="6 lives using jeep after continue" />
  <gamegenie code="PEOKNPLE" description="9 lives using jeep after continue" />
  <gamegenie code="PAXKEAAA" description="Start at stage 2" />
  <gamegenie code="ZAXKEAAA" description="Start at stage 3" />
  <gamegenie code="LAXKEAAA" description="Start at stage 4" />
  <gamegenie code="GAXKEAAA" description="Start at stage 5" />
  <gamegenie code="IAXKEAAA" description="Start at stage 6" />
  <gamegenie code="TAXKEAAA" description="Start at stage 7" />
  <gamegenie code="SZETZLSA" description="Keep firepower and speed-ups for helicopter" />
  <gamegenie code="SXOTPTSA" description="Keep firepower and speed-ups for jeep" />
  <gamegenie code="EEOVYUEI" description="Restrict movement area for helicopter" />
  <gamegenie code="EEOVGYEV" description="Restrict movement area for jeep" />
</game>
<game code="CLV-H-PUYXM" name="Silver Surfer" crc="BEE1C0D9">
  <gamegenie code="PAOILIIA" description="Start with 1 life - P1" />
  <gamegenie code="PAKSGIIA" description="Start with 1 life - P2" />
  <gamegenie code="IAXSGIPA" description="Start with 5 Smart Bombs - P1" />
  <gamegenie code="IAVIIIPA" description="Start with 5 Smart Bombs - P2" />
  <gamegenie code="SXEKSNVK" description="Infinite lives - both players" />
  <gamegenie code="NYVTLVGO" description="Infinite Smart Bombs - both players" />
  <gamegenie code="GXEITSSE" description="Keep cosmic weapons after losing a life" />
  <gamegenie code="IEESIIPA" description="Have 5 Smart Bombs on a new life" />
  <gamegenie code="GXEILSSE" description="Keep Orbs after losing a life (1 of 2)" />
  <gamegenie code="GXKIOUSE" description="Keep Orbs after losing a life (2 of 2)" />
</game>
<game code="CLV-H-BROCJ" name="Simpsons, The: Bart vs. The Space Mutants" crc="6F10097D">
  <gamegenie code="ESOINPEY" description="Invincibility" />
  <gamegenie code="SZOTESVK" description="Infinite health" />
  <gamegenie code="XVONYXXK" description="Infinite time" />
  <gamegenie code="ANENPXGU" description="Slow down time" />
  <gamegenie code="AXENPXGL" description="Speed up time" />
  <gamegenie code="PAONAYAA" description="Gain 2 coins for every 1 collected" />
  <gamegenie code="PAONTNTE" description="Only 10 coins needed to get an extra life" />
  <gamegenie code="GXXZZOVK" description="Buy items for free (1 of 2)" />
  <gamegenie code="GXXULEVK" description="Buy items for free (2 of 2)" />
  <gamegenie code="SPKTLESU" description="Get all items by selecting them (be sure to get the Paint Can in level 1 and Gun in the Museum)" />
  <gamegenie code="IPKYXUGA" description="Super-jump" />
</game>
<game code="CLV-H-HJKBL" name="Simpsons, The: Bart vs. The World" crc="7416903F">
  <gamegenie code="ZOXVGLIE" description="Invincibility" />
  <gamegenie code="SZONIPST" description="Infinite lives" />
  <gamegenie code="SZVVEKVK" description="Infinite health" />
  <gamegenie code="EISVNGEY" description="Lose lives more easily" />
  <gamegenie code="OLUNPPOP" description="Infinite Firecracker Balls" />
  <gamegenie code="PAEZPAAE" description="Start with 99 Firecracker Balls" />
  <gamegenie code="PAXXVGLE" description="Start with 9 lives" />
  <gamegenie code="SZNZPEVK" description="Infinite tries for the card match game" />
  <gamegenie code="KLYUKA" description="Bart flies" />
</game>
<game code="CLV-H-SWKVD" name="Simpsons, The: Bartman Meets Radioactive Man" crc="5991B9D0">
  <gamegenie code="SXXNPLAX" description="Invincibility" />
  <gamegenie code="AAUYPYGA" description="Infinite health" />
  <gamegenie code="SZUYZNSE" description="Infinite health (alt)" />
  <gamegenie code="SKNNVEVK" description="Infinite Eyes on pick-up" />
  <gamegenie code="SXNNVEVK" description="Infinite Eyes on pick-up (alt)" />
  <gamegenie code="AAKYKPPA" description="Infinite Cold on pick-up" />
  <gamegenie code="PAVAYYLA" description="Start with 2 lives and 2 credits" />
  <gamegenie code="IAVAYYLA" description="Start with 6 lives and 6 credits" />
  <gamegenie code="YAVAYYLA" description="Start with 8 lives and 8 credits" />
  <gamegenie code="PAVAYYLE" description="Start with 10 lives and 10 credits" />
  <gamegenie code="OLVYAZOP" description="Infinite lives" />
  <gamegenie code="SZENNEVK" description="Infinite credits" />
  <gamegenie code="ASVTOZAZ" description="Eyes worth more on pick-up" />
  <gamegenie code="AXUVSZIA" description="Cold worth more on pick-up" />
  <gamegenie code="ZAUZAYAA" description="Start in chapter 1 level 2" />
  <gamegenie code="IAUZAYAA" description="Start in chapter 1 level 3" />
</game>
<game code="CLV-H-ENKSB" name="Skate or Die 2: The Search for Double Trouble" crc="06961BE4">
  <gamegenie code="SXUXZPVG" description="Adventure game - Infinite health" />
  <gamegenie code="SXVPTVVK" description="Adventure game - Infinite Paint Clips" />
  <gamegenie code="AANPZPPA" description="Adventure game - Infinite Eggs (1 of 2)" />
  <gamegenie code="AAXOZLPA" description="Adventure game - Infinite Eggs (2 of 2)" />
  <gamegenie code="AAVPTLPA" description="Adventure game - Infinite M-80's (1 of 2)" />
  <gamegenie code="AEEOAPPA" description="Adventure game - Infinite M-80's (2 of 2)" />
  <gamegenie code="AEESAAPG" description="Adventure game - Skate at any speed (1 of 2)" />
  <gamegenie code="AAKATAPG" description="Adventure game - Skate at any speed (2 of 2)" />
  <gamegenie code="PAUYLLLA" description="Stunt Ramp - Only 1 skateboard" />
  <gamegenie code="TAUYLLLA" description="Stunt Ramp - 6 skateboards" />
  <gamegenie code="PAUYLLLE" description="Stunt Ramp - 9 skateboards" />
  <gamegenie code="TAONILLA" description="Stunt Ramp - More time" />
  <gamegenie code="ZAONILLA" description="Stunt Ramp - Less time" />
  <gamegenie code="SZUAKZVG" description="Stunt Ramp - Infinite time" />
  <gamegenie code="TEKOKZIA" description="Stunt Ramp - Super speed" />
  <gamegenie code="SXKPVYVG" description="Stunt Ramp - Infinite skateboards (1 of 2)" />
  <gamegenie code="SXUZGAVG" description="Stunt Ramp - Infinite skateboards (2 of 2)" />
</game>
<game code="CLV-H-EUAFT" name="Skate or Die!" crc="423ADA8E">
  <gamegenie code="ZENXTTPA" description="Snowball Blast - More snowballs picked up" />
  <gamegenie code="OOEPVAAV" description="Snowball Blast - Start with more time" />
  <gamegenie code="AKEPVAAT" description="Snowball Blast - Start with less time" />
  <gamegenie code="IOKXITAP" description="Snowball Blast - More time gained" />
  <gamegenie code="IEKXITAP" description="Snowball Blast - Less time gained" />
  <gamegenie code="GAUPVAZA" description="Snowball Blast - Start with more ammo" />
  <gamegenie code="PAUPVAZA" description="Snowball Blast - Start with less ammo" />
  <gamegenie code="IESTEYLA" description="Acro Aerials - More jumps allowed (1 of 2)" />
  <gamegenie code="IAVVNILA" description="Acro Aerials - More jumps allowed (2 of 2)" />
</game>
<game code="CLV-H-LMIDU" name="Ski or Die" crc="E9A6C211">
  <gamegenie code="PAUPVAZA" description="Snowball Blast - Start with less ammo" />
  <gamegenie code="GAUPVAZA" description="Snowball Blast - Start with more ammo" />
  <gamegenie code="AKEPVAAT" description="Snowball Blast - Start with less time" />
  <gamegenie code="OOEPVAAV" description="Snowball Blast - Start with more time" />
  <gamegenie code="IEKXITAP" description="Snowball Blast - Less time gained" />
  <gamegenie code="IOKXITAP" description="Snowball Blast - More time gained" />
  <gamegenie code="ZENXTTPA" description="Snowball Blast - More snowballs picked up" />
  <gamegenie code="IAVVNILA" description="Acro Aerials - More jumps allowed (1 of 2)" />
  <gamegenie code="IESTEYLA" description="Acro Aerials - More jumps allowed (2 of 2)" />
</game>
<game code="CLV-H-ANZHW" name="Skull &amp; Crossbones" crc="B422A67A">
  <gamegenie code="SZNOTNVK" description="Infinite continues" />
  <gamegenie code="PEXPTYIA" description="1 continue" />
  <gamegenie code="PEXPTYIE" description="9 continues" />
  <gamegenie code="SUOEIVVS" description="Infinite weapons" />
  <gamegenie code="SZONGXVK" description="Infinite time" />
  <gamegenie code="AZONAXGL" description="Faster timer" />
  <gamegenie code="AYONAXGL" description="Slower timer" />
  <gamegenie code="POVPLYZU" description="Half energy for Red Dog and One Eye (1 of 2)" />
  <gamegenie code="POEPZYZU" description="Half energy for Red Dog and One Eye (2 of 2)" />
  <gamegenie code="LVVPLYZL" description="Double energy for Red Dog and One Eye (1 of 2)" />
  <gamegenie code="POEPZYZU" description="Double energy for Red Dog and One Eye (2 of 2)" />
  <gamegenie code="EUVEYNEK" description="Better super-jump (1 of 2)" />
  <gamegenie code="EUVAGNEK" description="Better super-jump (2 of 2)" />
</game>
<game code="CLV-H-MNWPA" name="Sky Kid (U) [!p]" crc="8207A96C">
  <gamegenie code="SXEKGZVI" description="Infinite lives" />
  <gamegenie code="VANNVZSA" description="P1 has more lives than P2" />
  <gamegenie code="AAOKIZPA" description="Shoot more bullets" />
  <gamegenie code="PANYNZLA" description="Start with 1 life - both players" />
  <gamegenie code="TANYNZLA" description="Start with 6 lives - both players" />
  <gamegenie code="PANYNZLE" description="Start with 9 lives - both players" />
  <gamegenie code="IAVNNZPA" description="Start on level 5 (1 of 2)" />
  <gamegenie code="GAVNUZAA" description="Start on level 5 (2 of 2)" />
  <gamegenie code="ZAVNNZPE" description="Start on level 10 (1 of 2)" />
  <gamegenie code="PAVNUZAE" description="Start on level 10 (2 of 2)" />
  <gamegenie code="APVNNZPA" description="Start on level 15 (1 of 2)" />
  <gamegenie code="YAVNUZAE" description="Start on level 15 (2 of 2)" />
  <gamegenie code="GPVNNZPA" description="Start on level 20 (1 of 2)" />
  <gamegenie code="LPVNUZAA" description="Start on level 20 (2 of 2)" />
</game>
<game code="CLV-H-ZSDQL" name="Sky Shark" crc="9FFE2F55">
  <gamegenie code="OZNEAAVS" description="Infinite lives" />
  <gamegenie code="GXUEALVI" description="Infinite Bombs" />
  <gamegenie code="GZNEIOVS" description="Infinite credits" />
  <gamegenie code="GZXATEOZ" description="Start with 1 life - P1" />
  <gamegenie code="AAUALAGA" description="Start with 1 life - P2" />
  <gamegenie code="AAUALAGE" description="Start with 9 lives - P2" />
  <gamegenie code="AAEELOGI" description="Autofire" />
  <gamegenie code="TAVPSTLA" description="Double Bombs" />
  <gamegenie code="TAUAYALA" description="Double credits" />
  <gamegenie code="AANEZPGA" description="1 life after continue - both players" />
  <gamegenie code="AANEZPGE" description="9 lives after continue - both players" />
  <gamegenie code="TAXEZAXZ" description="Start with 9 lives - P1 (1 of 2)" />
  <gamegenie code="PZXELENY" description="Start with 9 lives - P1 (2 of 2)" />
  <gamegenie code="EZXAPPKZ" description="Start with maximum firepower (1 of 2)" />
  <gamegenie code="TAXAZOIL" description="Start with maximum firepower (2 of 2)" />
</game>
<game code="CLV-H-JUHSS" name="Slalom" crc="86670C93">
  <gamegenie code="PAOULZAA" description="Ski super fast" />
  <gamegenie code="AAEPLIPA" description="No track obstacles" />
  <gamegenie code="XZXPATVZ" description="Timer at 5 minutes for all tracks (1 of 2)" />
  <gamegenie code="PAXPPVPN" description="Timer at 5 minutes for all tracks (2 of 2)" />
</game>
<game code="CLV-H-SNFCG" name="Smash T.V." crc="6EE94D32">
  <gamegenie code="UIVYGXVS" description="Infinite lives" />
  <gamegenie code="OPNXVTTE" description="Get a lot more Grenades" />
  <gamegenie code="OXXUUYVS" description="Infinite Grenades" />
  <gamegenie code="EAOZPZEY" description="Touch and kill most enemies" />
</game>
<game code="CLV-H-DWJYH" name="Snake Rattle 'n Roll" crc="FDF4569B">
  <gamegenie code="SXEYOZVG" description="Infinite time" />
  <gamegenie code="AGNNVXTT" description="Faster timer" />
  <gamegenie code="EPNNVXTT" description="Slower timer" />
  <gamegenie code="AEXAYZZA" description="1 life - both players" />
  <gamegenie code="IEXAYZZA" description="6 lives - both players" />
  <gamegenie code="AEXAYZZE" description="9 lives - both players" />
  <gamegenie code="AEUAETZA" description="1 life - both players, after continue" />
  <gamegenie code="IEUAETZA" description="6 lives - both players, after continue" />
  <gamegenie code="AEUAETZE" description="9 lives - both players, after continue" />
  <gamegenie code="PEUEGXNY" description="Start on level 2" />
  <gamegenie code="ZEUEGXNY" description="Start on level 3" />
  <gamegenie code="LEUEGXNY" description="Start on level 4" />
  <gamegenie code="GEUEGXNY" description="Start on level 5" />
  <gamegenie code="IEUEGXNY" description="Start on level 6" />
  <gamegenie code="TEUEGXNY" description="Start on level 7" />
  <gamegenie code="SLOUSVVS" description="Infinite lives - both players" />
  <gamegenie code="ZAXOSGPA" description="Super-jump" />
  <gamegenie code="LAXOSGPA" description="Mega-jump" />
</game>
<game code="CLV-H-OERUW" name="Snake's Revenge" crc="48E904D0">
  <gamegenie code="SZEVEPSA" description="Invincibility" />
  <gamegenie code="AXXVGYAG" description="Start with half bullets for Beretta M92" />
  <gamegenie code="EEXVGYAG" description="Start with double bullets for Beretta M92" />
  <gamegenie code="SZEEOUSE" description="Infinite Beretta ammo" />
  <gamegenie code="SXOASKSE" description="Infinite Shotgun ammo" />
  <gamegenie code="SZKAKKSE" description="Infinite Grenades" />
  <gamegenie code="SXVEOKSE" description="Infinite Missiles" />
  <gamegenie code="XTNTZVEE" description="Infinite ammo for all weapons" />
  <gamegenie code="SXKVKASA" description="Infinite health" />
  <gamegenie code="AEUVOAYA" description="Reduce your injuries by up to 50%" />
  <gamegenie code="XVUYTUZE" description="Play with less health (1 of 2)" />
  <gamegenie code="XTKZXKZE" description="Play with less health (2 of 2)" />
  <gamegenie code="PPUGASTA" description="Start a new game to view ending" />
  <gamegenie code="ZEOVAYPA" description="Start with Machine Gun instead of Beretta (1 of 2)" />
  <gamegenie code="XKXVTYEG" description="Start with Machine Gun instead of Beretta (2 of 2)" />
  <gamegenie code="GEOVAYPA" description="Start with Shotgun instead of Beretta (1 of 2)" />
  <gamegenie code="KKXVTYEG" description="Start with Shotgun instead of Beretta (2 of 2)" />
  <gamegenie code="AXOVAYPA" description="Start with Grenades instead of Beretta (1 of 2)" />
  <gamegenie code="VKXVTYEG" description="Start with Grenades instead of Beretta (2 of 2)" />
  <gamegenie code="EEOVAYPA" description="Start with Missiles instead of Beretta (1 of 2)" />
  <gamegenie code="EKXVTYEK" description="Start with Missiles instead of Beretta (2 of 2)" />
  <gamegenie code="SXSZTEVK" description="Infinite time for Metal Gear battle" />
  <gamegenie code="ESXALLEY" description="One hit defeats Metal Gear" />
</game>
<game code="CLV-H-EYPRO" name="Snow Bros. (U) [!p]" crc="8965C590">
  <gamegenie code="SUUAVVVS" description="Invincibility" />
  <gamegenie code="SXNEUYVI" description="Infinite number of chances" />
  <gamegenie code="PAXXPLZE" description="Start with 10 chances instead of 3 (count starts at 9 instead of 2)" />
  <gamegenie code="AAXXPLZA" description="Start with 1 chance (count starts at 0)" />
  <gamegenie code="PAOAYLZE" description="Always get 10 chances after a continue (count restarts at 9)" />
  <gamegenie code="AAOAYLZA" description="Always get 1 chance after a continue (count restarts at 0)" />
  <gamegenie code="OUOOGEOO" description="Don't lose super ability after you lose a chance" />
  <gamegenie code="YAEEYAAE" description="Start with Speed Skates, Power Shots and super snow-throwing" />
  <gamegenie code="PAEEYAAA" description="Start with Speed Skates (don't use with other &quot;start with&quot; codes)" />
  <gamegenie code="ZAEEYAAA" description="Start with Power Shots (don't use with other &quot;start with&quot; codes)" />
  <gamegenie code="GAEEYAAA" description="Start with super snow-throwing ability (don't use with other &quot;start with&quot; codes)" />
  <gamegenie code="GEVZTZAA" description="Start on 5th floor" />
  <gamegenie code="PEVZTZAE" description="Start on 10th floor" />
  <gamegenie code="LOVZTZAA" description="Start on 20th floor" />
  <gamegenie code="IOVZTZAE" description="Start on 30th floor" />
  <gamegenie code="YXVZTZAA" description="Start on 40th floor" />
  <gamegenie code="PUVZTZAA" description="Start on 50th floor" />
</game>
<game code="CLV-H-PZISL" name="Soccer" crc="657F7875">
  <gamegenie code="APOOKZIP" description="Each half lasts only 10 minutes" />
  <gamegenie code="AIOOKZIP" description="Each half lasts for 50 minutes" />
  <gamegenie code="KASUOTSA" description="Start X goal up (1 of 3)" />
  <gamegenie code="KASUUVSE" description="Start X goal up (2 of 3)" />
  <gamegenie code="PASLVTAA" description="Start 1 goal up (3 of 3)" />
  <gamegenie code="LASLVTAA (3 of 3)" description="Start 3 goals up" />
</game>
<game code="CLV-H-QKMRL" name="Solar Jetman: Hunt for the Golden Warpship" crc="8111BA08">
  <gamegenie code="PAKSZLGA" description="Start with 1 ship and 1 life" />
  <gamegenie code="AAKSZLGE" description="Start with 8 ships and 8 lives" />
  <gamegenie code="SZXONIVG" description="Infinite lives" />
  <gamegenie code="AEXXAVNY" description="Minimum damage taken from walls" />
  <gamegenie code="ZASSTLAA" description="Start on level 3" />
  <gamegenie code="IASSTLAA" description="Start on level 6" />
  <gamegenie code="AASSTLAE" description="Start on level 9" />
  <gamegenie code="ZASSTLAE" description="Start on level 11" />
  <gamegenie code="AASSZLPE" description="Start with more money" />
  <gamegenie code="SVEKOVON" description="Weapons use up no energy" />
  <gamegenie code="UNSPLSLE" description="Reversed gravity for planet 1" />
  <gamegenie code="VTSOZVTO" description="Reversed gravity for planet 2" />
  <gamegenie code="KVOPATGP" description="Reversed gravity for planet 3" />
  <gamegenie code="XNVOTSZE" description="Reversed gravity for planet 4" />
  <gamegenie code="ETXPGTAZ" description="Reversed gravity for planet 5" />
  <gamegenie code="OTUOYVPX" description="Reversed gravity for planet 6" />
  <gamegenie code="UTEOPTLZ" description="Reversed gravity for planet 7" />
  <gamegenie code="AOXOLVEV" description="Normal gravity for planet 8" />
  <gamegenie code="AEXZGVSY" description="No damage taken from walls (1 of 2)" />
  <gamegenie code="AEXXAVNY" description="No damage taken from walls (2 of 2)" />
  <gamegenie code="AEUIOXYA" description="Items for free (1 of 2)" />
  <gamegenie code="GXKSOZSA" description="Items for free (2 of 2)" />
</game>
<game code="CLV-H-FGPIQ" name="Solomon's Key" crc="40684E95">
  <gamegenie code="SZVAIAAX" description="Invincibility" />
  <gamegenie code="OUXZYPOP" description="Infinite life" />
  <gamegenie code="XTKKKEXK" description="Infinite lives" />
  <gamegenie code="GZOXLAAX" description="Indestructible fireball" />
  <gamegenie code="AAXZIALZ" description="Continuous fairies" />
  <gamegenie code="KAXOOEVE" description="Start with 40,000 life points" />
  <gamegenie code="GZUPTOSE" description="Start on last level reached" />
  <gamegenie code="VTUPTOSE" description="Start on next level" />
  <gamegenie code="SZUOPOSE" description="Start on level XX (1 of 3)" />
  <gamegenie code="UPUOLPGA" description="Start on level XX (2 of 3)" />
  <gamegenie code="PAUPIPAE" description="Start on level 10 (1 of 3)" />
  <gamegenie code="LPUPIPAA" description="Start on level 20 (3 of 3)" />
  <gamegenie code="IPUPIPAE" description="Start on level 30 (3 of 3)" />
  <gamegenie code="YZUPIPAA" description="Start on level 40 (3 of 3)" />
</game>
<game code="CLV-H-FLGAI" name="Solstice: The Quest for the Staff of Demnos" crc="EDCF1B71">
  <gamegenie code="SZSESXVK" description="Infinite lives" />
  <gamegenie code="SUSPIXVS" description="Infinite Potions" />
  <gamegenie code="PAKAVIGA" description="Start with 1 life" />
  <gamegenie code="AAKAVIGE" description="Start with 8 lives" />
  <gamegenie code="PAXELPLA" description="1 life after continue" />
  <gamegenie code="AAXELPLE" description="8 lives after continue" />
  <gamegenie code="GAOEUIZA" description="Start with full flasks of Potions" />
  <gamegenie code="AAOEUIZA" description="Start with no Potions" />
  <gamegenie code="SXUXYGAX" description="Multi-jump" />
</game>
<game code="CLV-H-TWWAR" name="Spelunker" crc="99D15A91">
  <gamegenie code="ATKPAIAZ" description="Invincibility (1 of 3)" />
  <gamegenie code="TUEEYKNN" description="Invincibility (2 of 3)" />
  <gamegenie code="GXOAPKIX" description="Invincibility (3 of 3)" />
  <gamegenie code="AEXAYTAP" description="Invisibility" />
  <gamegenie code="SNEAKEVN" description="Jump higher (1 of 2)" />
  <gamegenie code="EANEEAAA" description="Jump higher (2 of 2)" />
  <gamegenie code="IXOOPSVK" description="Infinite lives" />
  <gamegenie code="AANATPZA" description="Start with 1 life" />
  <gamegenie code="IANATPZA" description="Start with 6 lives" />
  <gamegenie code="AANATPZE" description="Start with 9 lives" />
</game>
<game code="CLV-H-IXSMZ" name="Spider-Man: Return of the Sinister Six" crc="D679627A">
  <gamegenie code="SXNUIZAX" description="Invincibility" />
  <gamegenie code="SXOKVVSE" description="Infinite health" />
</game>
<game code="CLV-H-FCJCJ" name="Spiritual Warfare" crc="14105C13">
  <gamegenie code="NYEUYIAE" description="Start with all armors, 7 of each fruit, all items, 99 Keys, 255 God's Wrath, 99 Birds" />
  <gamegenie code="APKLZITE" description="Start with max energy" />
  <gamegenie code="SXVGLGSA" description="Infinite energy" />
  <gamegenie code="SXKGXIVG" description="Infinite Vial Of God's Wrath" />
</game>
<game code="CLV-H-VFJSN" name="Spy Hunter" crc="C7197FB1">
  <gamegenie code="SXVPEZSA" description="Infinite health" />
  <gamegenie code="SXKAYOVK" description="Infinite lives" />
  <gamegenie code="SZEUSGVG" description="Infinite lives (alt)" />
  <gamegenie code="SZKUANVK" description="Infinite missiles" />
  <gamegenie code="VXELTVSE" description="Infinite smoke" />
  <gamegenie code="SXSOOZSA" description="No enemies (1 of 2)" />
  <gamegenie code="SZUOVLSA" description="No enemies (2 of 2)" />
  <gamegenie code="AAUEASTA" description="Enemies die automatically (1 of 3)" />
  <gamegenie code="AESXEUYA" description="Enemies die automatically (2 of 3)" />
  <gamegenie code="XVSZXLAV" description="Enemies die automatically (3 of 3)" />
  <gamegenie code="AENOESTA" description="Hit anywhere (1 of 5)" />
  <gamegenie code="AENOKIIP" description="Hit anywhere (2 of 5)" />
  <gamegenie code="AESXEUYA" description="Hit anywhere (3 of 5)" />
  <gamegenie code="AEVOSIGZ" description="Hit anywhere (4 of 5)" />
  <gamegenie code="SXNONISA" description="Hit anywhere (5 of 5)" />
  <gamegenie code="TEEXLILA" description="Double missiles on pick-up" />
  <gamegenie code="YAEZNIYE" description="Slow down timer" />
  <gamegenie code="GXSAKUSE" description="Keep special weapons (1 of 2)" />
  <gamegenie code="GXSANUSE" description="Keep special weapons (2 of 2)" />
  <gamegenie code="ZEEXKIAA" description="Start with 2 extra lives" />
  <gamegenie code="TEEXKIAA" description="Start with 6 extra lives" />
</game>
<game code="CLV-H-SAJAA" name="Spy vs. Spy" crc="C4A02712">
  <gamegenie code="SZVAYUVK" description="Stop black spy's clock" />
  <gamegenie code="SXUELUVK" description="Stop white spy's clock" />
  <gamegenie code="PUEAPLIU" description="Black spy has 100 seconds in a minute" />
  <gamegenie code="PUSAILIU" description="White spy has 100 seconds in a minute" />
  <gamegenie code="ONVZYNUT" description="Black spy has deadly punches" />
  <gamegenie code="IEVZLYIE" description="White spy has deadly punches" />
</game>
<game code="CLV-H-OVGUL" name="Sqoon" crc="44F34172">
  <gamegenie code="AEEAAIPA" description="Infinite lives" />
  <gamegenie code="AEUESLZA" description="Start with 1 life" />
  <gamegenie code="IEUESLZA" description="Start with 6 lives" />
  <gamegenie code="AEUESLZE" description="Start with 9 lives" />
  <gamegenie code="LASEXLPA" description="Start at phase 3" />
  <gamegenie code="IASEXLPA" description="Start at phase 5" />
  <gamegenie code="AASEXLPE" description="Start at phase 8" />
  <gamegenie code="SZEEOSVK" description="Never lose your special weapon" />
  <gamegenie code="ZEOOEYPA" description="Gain main weapon on rescuing 9 humans" />
  <gamegenie code="GXEAKKSE" description="Never lose humans on dying (1 of 2)" />
  <gamegenie code="GXSUZXSE" description="Never lose humans on dying (2 of 2)" />
</game>
<game code="CLV-H-ARPHW" name="Stanley: The Search for Dr. Livingston" crc="62E2E7FC">
  <gamegenie code="XTSXXYVK" description="Infinite time on continue screen" />
  <gamegenie code="SZEGYUSE" description="Infinite health" />
  <gamegenie code="NNXGVZAE" description="Start a new game with complete map" />
</game>
<game code="CLV-H-CRCAQ" name="Star Force" crc="FCE408A4">
  <gamegenie code="SZKEVTVG" description="Infinite lives" />
  <gamegenie code="AEUAUIZA" description="Start with 1 life" />
  <gamegenie code="IEUAUIZA" description="Start with 6 lives" />
  <gamegenie code="AEUAUIZE" description="Start with 9 lives" />
  <gamegenie code="VYVEGONN" description="Turbo speed" />
</game>
<game code="CLV-H-FWOQM" name="Star Soldier" crc="262B5A1D">
  <gamegenie code="SZOEAPVG" description="Infinite lives" />
  <gamegenie code="PEOAPPAA" description="Start with laser" />
  <gamegenie code="GXVPXTVG" description="Infinite shield power" />
  <gamegenie code="ZAOOOYIE" description="Double shield power (1 of 2)" />
  <gamegenie code="ZENOGLIE" description="Double shield power (2 of 2)" />
</game>
<game code="CLV-H-MWLJC" name="Star Trek: 25th Anniversary" crc="16EBA50A">
  <gamegenie code="LEOOVGYE" description="Kirk has more energy" />
  <gamegenie code="GEOOVGYA" description="Kirk has less energy" />
  <gamegenie code="LAUXYAYE" description="McCoy has more energy" />
  <gamegenie code="GAUXYAYA" description="McCoy has less energy" />
  <gamegenie code="LAUZTAYE" description="Spock has more energy" />
  <gamegenie code="GAUZTAYA" description="Spock has less energy" />
  <gamegenie code="LAVZLAYE" description="Security has more energy" />
  <gamegenie code="LAKXAAYE" description="Geologist has more energy" />
  <gamegenie code="GAKXAAYA" description="Geologist has less energy" />
  <gamegenie code="LASXZAYE" description="Biologist has more energy" />
  <gamegenie code="GASXZAYA" description="Biologist has less energy" />
  <gamegenie code="LASZPAYE" description="Historian has more energy" />
  <gamegenie code="GASZPAYA" description="Historian has less energy" />
  <gamegenie code="YEKUYPGA" description="McCoy gives full energy to injured party" />
</game>
<game code="CLV-H-CNGOF" name="Star Trek: The Next Generation" crc="E575687C">
  <gamegenie code="OUXTPYOP" description="All systems are immune to damage - shields down" />
  <gamegenie code="SXUVTNSE" description="Shields are immune to damage - shields up" />
  <gamegenie code="AGKVTTEP" description="Quicker damage repair" />
  <gamegenie code="APKVTTEP" description="Very quick damage repair" />
  <gamegenie code="EGKVTTEP" description="Slower damage repair" />
  <gamegenie code="ZKNVLEZE" description="Enemy does less damage" />
  <gamegenie code="ATETISVT" description="Stop game time ticking over" />
  <gamegenie code="AAUZPAGY" description="Photon Torpedoes always work" />
  <gamegenie code="AAEXTPNY" description="Phasers always work" />
  <gamegenie code="AAOXPOKT" description="Phasers fire for longer" />
  <gamegenie code="AAVTZVIL" description="Damage is repaired immediately" />
  <gamegenie code="SXVUSTVG" description="Transporter power does not decrease most of the time" />
  <gamegenie code="IANUXTAZ" description="Less transporter power required most of the time" />
  <gamegenie code="GVNZOZIT" description="Stardate does not advance" />
</game>
<game code="CLV-H-UVIIF" name="Star Voyager" crc="B1723338">
  <gamegenie code="GZSZSTVG" description="Infinite life support pods" />
  <gamegenie code="GPKIASZA" description="Start with double life support pods" />
  <gamegenie code="TPKIASZE" description="Start with triple life support pods" />
  <gamegenie code="AASLSLLA" description="Barrier won't take damage" />
  <gamegenie code="AOKLVLEI" description="Radar won't take damage" />
  <gamegenie code="ENXLXLEI" description="Cannon won't take damage" />
  <gamegenie code="AAXUXLLA" description="Engine won't take damage" />
</game>
<game code="CLV-H-VTQQG" name="Star Wars" crc="C1C3636B">
  <gamegenie code="AAXAGAZA" description="Start with 1 life" />
  <gamegenie code="IAXAGAZA" description="Start with 6 lives" />
  <gamegenie code="AAXAGAZE" description="Start with 9 lives" />
  <gamegenie code="SZEAYXVK" description="Infinite lives" />
  <gamegenie code="GZSYLSSO" description="Immune to spikes, you can get stuck on them" />
  <gamegenie code="SLVUYNSO" description="Immune to most bullets" />
  <gamegenie code="AAKLNGZA" description="Full energy on big energy pick-ups" />
  <gamegenie code="AAKLUGAX" description="Less energy on big energy pick-ups" />
  <gamegenie code="AGKLUGAZ" description="More energy on big energy pick-ups" />
  <gamegenie code="ZEOKOIPA" description="Always running (1 of 2)" />
  <gamegenie code="ZEKKXIPA" description="Always running (2 of 2)" />
  <gamegenie code="GXNUZIST" description="Immune to most collisions (1 of 2)" />
  <gamegenie code="SLKLYVSO" description="Immune to most collisions (2 of 2)" />
</game>
<game code="CLV-H-YJTZE" name="Star Wars: The Empire Strikes Back" crc="240DE736">
  <gamegenie code="TENLGIYE" description="Start with 14 continues" />
  <gamegenie code="GZVZTNOO" description="Don't take damage from most enemies" />
  <gamegenie code="PESZYPIE" description="9 harpoons - scene 2" />
  <gamegenie code="PESZYPIA" description="1 harpoons - scene 2" />
  <gamegenie code="GZVZVKVK" description="Infinite harpoons - scene 2" />
  <gamegenie code="GXSLIISA" description="Infinite energy for ship - scene 2" />
  <gamegenie code="AEXOETYL" description="Always have Lightsaber" />
  <gamegenie code="PAEGXLAA" description="Start on scene 2" />
  <gamegenie code="ZAEGXLAA" description="Start on scene 3" />
  <gamegenie code="LAEGXLAA" description="Start on scene 4" />
  <gamegenie code="GAEGXLAA" description="Start on scene 5" />
  <gamegenie code="IAEGXLAA" description="Start on scene 6" />
  <gamegenie code="TAEGXLAA" description="Start on scene 7" />
</game>
<game code="CLV-H-WWTGA" name="Starship Hector" crc="9F432594">
  <gamegenie code="SZKIOGVG" description="Infinite lives" />
  <gamegenie code="AANSOGZA" description="Start with 1 life" />
  <gamegenie code="IANSOGZA" description="Start with 6 lives" />
  <gamegenie code="AANSOGZE" description="Start with 9 lives" />
  <gamegenie code="GEVVGIPA" description="Extra health from capsules" />
  <gamegenie code="PENYGIAA" description="Start at stage 2" />
  <gamegenie code="ZENYGIAA" description="Start at stage 3" />
  <gamegenie code="LENYGIAA" description="Start at stage 4" />
  <gamegenie code="GENYGIAA" description="Start at stage 5" />
  <gamegenie code="OVUYEGSV" description="Take minimum damage (1 of 2)" />
  <gamegenie code="PEUYOGTA" description="Take minimum damage (2 of 2)" />
</game>
<game code="CLV-H-GHFNF" name="Zoda's Revenge: StarTropics II" crc="D054FFB0">
  <gamegenie code="PAVTTZLA" description="Start with 1 life (Only effective in battle mode on first life)" />
  <gamegenie code="TAVTTZLA" description="Start with 6 lives (Only effective in battle mode on first life)" />
  <gamegenie code="PAVTTZLE" description="Start with 9 lives (Only effective in battle mode on first life)" />
  <gamegenie code="VZKZAOSV" description="Invincibility" />
  <gamegenie code="SXKVPKVK" description="Infinite lives" />
  <gamegenie code="SLUZTSVS" description="Infinite weapons" />
  <gamegenie code="GGEUIKOU" description="Hit anywhere (1 of 3)" />
  <gamegenie code="KLEUYGAY" description="Hit anywhere (2 of 3)" />
  <gamegenie code="UAEUTGKU" description="Hit anywhere (3 of 3)" />
  <gamegenie code="ZAUXKAPA" description="Walk faster - battle mode" />
  <gamegenie code="PAUXKAAA" description="Jump faster and further - battle mode" />
  <gamegenie code="AVKULAAG" description="Throw Tink's axe further" />
  <gamegenie code="PASZPTIA" description="1 star gives energy (1 of 2)" />
  <gamegenie code="PASZITIA" description="1 star gives energy (2 of 2)" />
  <gamegenie code="OYUUAAPG" description="Throw Tink's Axe faster (can't be combined with other Axe code)" />
  <gamegenie code="LGUUAAPG" description="Tink's Axe splits into 3 little ones when thrown (can't be combined with other Axe code)" />
  <gamegenie code="UYUUAAOY" description="Throw Tink's splitting-Axe faster (can't be combined with other Axe code)" />
</game>
<game code="CLV-H-TXGZR" name="Stinger" crc="C5B0B1AB">
  <gamegenie code="GZNGNLSP" description="Keep weapons after death" />
  <gamegenie code="PAXKPGLA" description="Start with 1 life" />
  <gamegenie code="TAXKPGLA" description="Start with 6 lives" />
  <gamegenie code="PAXKPGLE" description="Start with 9 lives" />
  <gamegenie code="OZVKKLVS" description="Infinite lives" />
  <gamegenie code="YGNGAKTL" description="Start with XX (1 of 2)" />
  <gamegenie code="PAVKTGAP" description="Start with Dual Cannons (2 of 2)" />
  <gamegenie code="ZAVKTGAP" description="Start with Laser (2 of 2)" />
  <gamegenie code="GAVKTGAP" description="Start with Shoot Right (2 of 2)" />
  <gamegenie code="AAVKTGAO" description="Start with Shoot Left (2 of 2)" />
  <gamegenie code="APVKTGAP" description="Start with Five Direction Firing (2 of 2)" />
  <gamegenie code="AZVKTGAP" description="Start with Three Direction Firing (2 of 2)" />
  <gamegenie code="AGVKTGAP" description="Start with Force field (2 of 2)" />
  <gamegenie code="GZOGIGSA" description="Start at stage X (wait for demo game then press start) (1 of 2)" />
  <gamegenie code="PAEGPLPA" description="Start at stage 2 (wait for demo game then press start) (2 of 2)" />
  <gamegenie code="ZAEGPLPA" description="Start at stage 3 (wait for demo game then press start) (2 of 2)" />
  <gamegenie code="LAEGPLPA" description="Start at stage 4 (wait for demo game then press start) (2 of 2)" />
  <gamegenie code="GAEGPLPA" description="Start at stage 5 (wait for demo game then press start) (2 of 2)" />
  <gamegenie code="IAEGPLPA" description="Start at stage 6 (wait for demo game then press start) (2 of 2)" />
  <gamegenie code="IESKLLAA" description="Skip intro" />
</game>
<game code="CLV-H-FROUF" name="Street Cop" crc="61D86167">
  <gamegenie code="TAOVTXPA" description="Have less time" />
  <gamegenie code="ZPOVTXPA" description="Have more time" />
  <gamegenie code="SZSNTAVG" description="Infinite time" />
  <gamegenie code="GXESTZST" description="Infinite health" />
  <gamegenie code="AONGNAAU" description="Start with less health" />
  <gamegenie code="AVNGNAAL" description="Start with more health" />
  <gamegenie code="PAXTPPAA" description="Start at level 2" />
  <gamegenie code="ZAXTPPAA" description="Start at level 3" />
  <gamegenie code="LAXTPPAA" description="Start at level 4" />
  <gamegenie code="OVESTZSV" description="Take minimum damage (1 of 2)" />
  <gamegenie code="PEESYZAP" description="Take minimum damage (2 of 2)" />
</game>
<game code="CLV-H-UACKE" name="Street Fighter 2010: The Final Fight" crc="8DA651D4">
  <gamegenie code="AZNSYIPP" description="Hit anywhere (1 of 3)" />
  <gamegenie code="EINSTIEL" description="Hit anywhere (2 of 3)" />
  <gamegenie code="SZNSLSOS" description="Hit anywhere (3 of 3)" />
  <gamegenie code="AAEETAGA" description="Start with 1 life" />
  <gamegenie code="PAEETAGE" description="Start with 9 lives" />
  <gamegenie code="SZUATPVG" description="Infinite lives" />
  <gamegenie code="AEUIPGZA" description="Infinite health" />
  <gamegenie code="EYSSLGEI" description="Invincibility" />
  <gamegenie code="PEUIPGZA" description="Take less damage" />
  <gamegenie code="LEUIPGZA" description="Take more damage" />
  <gamegenie code="GZOAZPSA" description="Keep power-ups after losing a life" />
  <gamegenie code="AEKIYGZA" description="Keep power-ups when hit" />
  <gamegenie code="ZESESPPA" description="Faster Ken" />
  <gamegenie code="SLUKAZSP" description="Infinite time" />
  <gamegenie code="SXVTVUVK" description="Portal always stays open" />
</game>
<game code="CLV-H-IWRSU" name="Strider" crc="02EE3706">
  <gamegenie code="OXNAUKPX" description="Infinite health (1 of 2)" />
  <gamegenie code="PVNAVGIU" description="Infinite health (2 of 2)" />
  <gamegenie code="AANVSZTZ" description="Hit anywhere (1 of 2)" />
  <gamegenie code="AEEVXXPP" description="Hit anywhere (2 of 2)" />
  <gamegenie code="ZAUXEYPE" description="More energy from small capsules (10)" />
  <gamegenie code="GPUXXNZA" description="More energy from big capsules (20)" />
  <gamegenie code="ZAUXKYPE" description="Health from small capsules (10)" />
  <gamegenie code="GPUXVNZA" description="Health from big capsules (20)" />
  <gamegenie code="ZAEXVNAO" description="Double health and energy from all capsules" />
</game>
<game code="CLV-H-WVRYB" name="Stunt Kids" crc="3A990EE0">
  <gamegenie code="AESGNZZA" description="Start with 1 life instead of 3" />
  <gamegenie code="IESGNZZA" description="Start with 6 lives" />
  <gamegenie code="PESGNZZE" description="Start with 9 lives" />
  <gamegenie code="SZSZSKVK" description="Infinite lives" />
  <gamegenie code="AEESPALA" description="Start with 0 turbos instead of 3" />
  <gamegenie code="TEESPALA" description="Start with 6 turbos" />
  <gamegenie code="PEESPALE" description="Start with 9 turbos" />
  <gamegenie code="VANILVKE" description="Always have 9 coins after a race" />
  <gamegenie code="SZKOEOVV" description="Coins worth nothing on pick-up" />
  <gamegenie code="SLNOYXVS" description="Infinite time - P1" />
  <gamegenie code="SLXOYUVS" description="Infinite time - P2" />
</game>
<game code="CLV-H-EISTB" name="Sunday Funday: The Ride" crc="5B16A3C8">
  <gamegenie code="ESNNUZEY" description="Enable level skip (Press B then Select)" />
</game>
<game code="CLV-H-WMPJX" name="Super Mario Bros. 3" crc="A0B0B742">
  <gamegenie code="KKKZSPIU" description="Enable Debug Mode" />
  <gamegenie code="SLXPLOVS" description="Infinite lives for Mario and Luigi" />
  <gamegenie code="YPXXLVGE" description="Mario (not Luigi) can re-use items again and again" />
</game>  
<game code="CLV-H-IYAOH" name="Super Pitfall" crc="979C5314">
  <gamegenie code="SZKSASVK" description="Infinite lives - 1P game" />
  <gamegenie code="SXESTSVK" description="Infinite lives - P1" />
  <gamegenie code="SXXSZSVK" description="Infinite lives - P2" />
  <gamegenie code="PAVIPALA" description="Start with 1 life - both players" />
  <gamegenie code="TAVIPALA" description="Start with 6 lives - both players" />
  <gamegenie code="PAVIPALE" description="Start with 9 lives - both players" />
  <gamegenie code="LEXKNYZA" description="Start with 30 bullets" />
  <gamegenie code="PEXKNYZA" description="Start with 10 bullets" />
  <gamegenie code="AEOYILPA" description="Infinite bullets" />
  <gamegenie code="LENLELZA" description="30 bullets gained on pick-up" />
  <gamegenie code="PENLELZA" description="10 bullets gained on pick-up" />
</game>
<game code="CLV-H-LUKEO" name="Super Sprint" crc="5F2C3195">
  <gamegenie code="SZETVUVK" description="Infinite continues" />
  <gamegenie code="YASSPALA" description="6 continues" />
  <gamegenie code="PASSPALA" description="No continues" />
  <gamegenie code="GXSGUVSE" description="XX obstacles on tracks (1 of 2)" />
  <gamegenie code="IEKKNTAA" description="More obstacles on tracks (2 of 2)" />
  <gamegenie code="ZEKKNTAE" description="Even more obstacles on tracks (2 of 2)" />
  <gamegenie code="YEKKNTAE" description="Lots and lots of obstacles on tracks (2 of 2)" />
</game>
<game code="CLV-H-GWZKK" name="Super Spy Hunter" crc="AB41445E">
  <gamegenie code="SXVPEZSA" description="Infinite health" />
  <gamegenie code="GEXUOIGE" description="Start with max health gauge" />
</game>
<game code="CLV-H-GJFLM" name="Superman" crc="1FA8C4A4">
  <gamegenie code="AAXSEIEA" description="Never die when out of super power" />
  <gamegenie code="SXNSSKSE" description="Never lose super power" />
  <gamegenie code="XVUVYZIA" description="Start with lots of super power" />
  <gamegenie code="AVEOUIAL" description="Double max power of all items at start" />
  <gamegenie code="AXUPYLAP" description="Double usual item power on item power crystal pick-up" />
  <gamegenie code="EXUPYLAP" description="Full item power on item power crystal pick-up" />
  <gamegenie code="EZVPKSOZ" description="Start at mission X (1 of 3)" />
  <gamegenie code="KANPXSSE" description="Start at mission X (2 of 3)" />
  <gamegenie code="PAVPSIAA" description="Start at mission 2 (3 of 3)" />
  <gamegenie code="ZAVPSIAA" description="Start at mission 3 (3 of 3)" />
  <gamegenie code="LAVPSIAA" description="Start at mission 4 (3 of 3)" />
  <gamegenie code="GAVPSIAA" description="Start at mission 5 (3 of 3)" />
</game>
<game code="CLV-H-TUFCR" name="Swamp Thing" crc="A1FF4E1D">
  <gamegenie code="PEVOTKPX" description="Invincibility (1 of 2)" />
  <gamegenie code="ESVOZGEY" description="Invincibility (2 of 2)" />
  <gamegenie code="SZNVZVVK" description="Infinite health" />
  <gamegenie code="SZNTIKVK" description="Infinite lives" />
</game>
<game code="CLV-H-RYZSH" name="Sword Master" crc="465E5483">
  <gamegenie code="ALKZVZAP" description="Invincibility" />
  <gamegenie code="SXSKNXSE" description="Infinite health (1 of 2)" />
  <gamegenie code="SZSGNXSE" description="Infinite health (2 of 2)" />
  <gamegenie code="SZNTVUSE" description="Infinite continues" />
  <gamegenie code="AAEGKGPZ" description="Gain a level for every EXP point gained" />
</game>
<game code="CLV-H-OKXVB" name="Swords and Serpents" crc="3417EC46">
  <gamegenie code="VANGKTVE" description="All characters have Scale Armor" />
  <gamegenie code="UEEKSTOE" description="Warriors start with a Great Sword" />
  <gamegenie code="KEEKSTOE" description="Warriors start with a Great Axe" />
  <gamegenie code="SEEGETSE" description="Magicians start with a Wizard's Wand" />
  <gamegenie code="YPKGSTLE" description="Magicians start with more spells" />
  <gamegenie code="LAKKXTAA" description="Magicians have greater spells" />
  <gamegenie code="GZKYLGOY" description="Spells use up no magic points" />
  <gamegenie code="XEOGVTXE" description="Thieves start with a Long Sword" />
  <gamegenie code="KEOGVTXA" description="Thieves start with an Axe" />
  <gamegenie code="TPXGNVZE" description="Start with 30 health points each (1 of 2)" />
  <gamegenie code="TPXKSVZE" description="Start with 30 health points each (2 of 2)" />
  <gamegenie code="ZLXGNVZA" description="Start with 50 health points each (1 of 2)" />
  <gamegenie code="ZLXKSVZA" description="Start with 50 health points each (2 of 2)" />
</game>
<game code="CLV-H-KDOCQ" name="Tag Team Wrestling" crc="BF250AF2">
  <gamegenie code="OOUSLZSO" description="Infinite health (glitchy)" />
  <gamegenie code="SUNKXTVI" description="Never give up" />
</game>
<game code="CLV-H-GKKTU" name="TaleSpin, Disney's" crc="798EEB98">
  <gamegenie code="AYVKZYLY" description="Start with 1 life" />
  <gamegenie code="TYVKZYLY" description="Start with 7 lives" />
  <gamegenie code="PYVKZYLN" description="Start with 10 lives" />
  <gamegenie code="ANNGVLLY" description="1 life after continue" />
  <gamegenie code="TNNGVLLY" description="7 lives after continue" />
  <gamegenie code="PNNGVLLN" description="10 lives after continue" />
  <gamegenie code="GZKGNKVK" description="Infinite lives from getting trapped by obstacles" />
  <gamegenie code="AAXEGPTA" description="Infinite health" />
  <gamegenie code="PYEGITLY" description="1 continue" />
  <gamegenie code="TYEGITLY" description="6 continues" />
  <gamegenie code="PYEGITLN" description="9 continues" />
  <gamegenie code="SXNKXLVG" description="Infinite continues" />
  <gamegenie code="PYVGUAAY" description="Add $1,000,000 to end-of-level bonus" />
</game>
<game code="CLV-H-AEDRX" name="Target: Renegade" crc="93B49582">
  <gamegenie code="SZEAOZVG" description="Infinite time" />
  <gamegenie code="SXEATXSU" description="Set timer to 5:00 for all levels" />
  <gamegenie code="AEKESZZA" description="Hearts replenish health to maximum" />
  <gamegenie code="SXVZVTSA" description="Don't take most damage" />
  <gamegenie code="TASPSPGP" description="Take half damage from bosses" />
  <gamegenie code="PAOOYZAA" description="Start on level 2" />
  <gamegenie code="ZAOOYZAA" description="Start on level 3" />
  <gamegenie code="LAOOYZAA" description="Start on level 4" />
  <gamegenie code="GAOOYZAA" description="Start on level 5" />
  <gamegenie code="IAOOYZAA" description="Start on level 6" />
  <gamegenie code="TAOOYZAA" description="Start on level 7" />
  <gamegenie code="SXEATXSU" description="Set timer to 3:00 for all levels (1 of 2)" />
  <gamegenie code="NKEEAZEE" description="Set timer to 3:00 for all levels (1 of 2)" />
</game>
<game code="CLV-H-PXOPP" name="Tecmo NBA Basketball" crc="2651F227">
  <gamegenie code="SLVUPUVS" description="Infinite timeouts" />
  <gamegenie code="AEOLVPPA" description="2-pt. shots worth 1, 3-pt. shots worth 2" />
  <gamegenie code="ZEOLVPPA" description="2-pt. shots worth 3, 3-pt. shots worth 4" />
  <gamegenie code="LEOLVPPA" description="2-pt. shots worth 4, 3-pt. shots worth 5" />
  <gamegenie code="GEOLVPPA" description="2-pt. shots worth 5, 3-pt. shots worth 6" />
  <gamegenie code="IEOLVPPA" description="2-pt. shots worth 6, 3-pt. shots worth 7" />
  <gamegenie code="AVNUVOVT" description="3-pt. shots worth 2 pts." />
  <gamegenie code="NYSENZYE" description="5-second violations become 10-second violations" />
  <gamegenie code="NYOPTNZE" description="No 10-second violations" />
  <gamegenie code="ASOLSEAO" description="Longer shot clock after getting ball on rebound" />
  <gamegenie code="AEOLSEAO" description="Shorter shot clock after getting ball on rebound" />
</game>
<game code="CLV-H-NUTUN" name="Tecmo Super Bowl" crc="179A0D57">
  <gamegenie code="ZXTISS" description="Almost every player has their skill level at 100" />
  <gamegenie code="APUXLZIA" description="10 minutes per quarter instead of 5" />
  <gamegenie code="AZUXLZIA" description="20 minutes per quarter" />
  <gamegenie code="ZAUXLZIA" description="2 minutes per quarter" />
  <gamegenie code="SXNXPZVG" description="Infinite time (continuous play)" />
  <gamegenie code="AAOATTTA" description="Touchdown scores 0 instead of 6 - P1" />
  <gamegenie code="AEOEVITA" description="Touchdown scores 0 - P2 or computer" />
  <gamegenie code="LAOATTTA" description="Touchdown scores 3 - P1" />
  <gamegenie code="LEOEVITA" description="Touchdown scores 3 - P2 or computer" />
  <gamegenie code="PAOATTTE" description="Touchdown scores 9 - P1" />
  <gamegenie code="PEOEVITE" description="Touchdown scores 9 - P2 or computer" />
  <gamegenie code="GAOATTTE" description="Touchdown scores 12 - P1" />
  <gamegenie code="GEOEVITE" description="Touchdown scores 12 - P2 or computer" />
  <gamegenie code="AAEALYPA" description="Extra-point kick scores 0 instead of 1 - P1" />
  <gamegenie code="AEEEUTPA" description="Extra-point kick scores 0 - P2 or computer" />
  <gamegenie code="ZAEALYPA" description="Extra-point kick scores 2 - P1" />
  <gamegenie code="ZEEEUTPA" description="Extra-point kick scores 2 - P2 or computer" />
  <gamegenie code="LAEALYPA" description="Extra-point kick scores 3 - P1" />
  <gamegenie code="LEEEUTPA" description="Extra-point kick scores 3 - P2 or computer" />
  <gamegenie code="TAEALYPA" description="Extra-point kick scores 6 - P1" />
  <gamegenie code="TEEEUTPA" description="Extra-point kick scores 6 - P2 or computer" />
  <gamegenie code="AEKAGGLA" description="Field goal scores 0 instead of 3 - P1" />
  <gamegenie code="AAKEKGLA" description="Field goal scores 0 - P2 or computer" />
  <gamegenie code="PEKAGGLA" description="Field goal scores 1 - P1" />
  <gamegenie code="PAKEKGLA" description="Field goal scores 1 - P2 or computer" />
  <gamegenie code="TEKAGGLA" description="Field goal scores 6 - P1" />
  <gamegenie code="TAKEKGLA" description="Field goal scores 6 - P2 or computer" />
  <gamegenie code="PEKAGGLE" description="Field goal scores 9 - P1" />
  <gamegenie code="PAKEKGLE" description="Field goal scores 9 - P2 or computer" />
  <gamegenie code="AASASIZA" description="Safety scores 0 instead of 2 - P1" />
  <gamegenie code="AEKEIIZA" description="Safety scores 0 - P2 or computer" />
  <gamegenie code="PASASIZA" description="Safety scores 1 - P1" />
  <gamegenie code="PEKEIIZA" description="Safety scores 1 - P2 or computer" />
  <gamegenie code="GASASIZA" description="Safety scores 4 - P1" />
  <gamegenie code="GEKEIIZA" description="Safety scores 4 - P2 or computer" />
  <gamegenie code="TASASIZA" description="Safety scores 6 - P1" />
  <gamegenie code="TEKEIIZA" description="Safety scores 6 - P2 or computer" />
</game>
<game code="CLV-H-HKMYT" name="Tecmo World Wrestling" crc="7FF76219">
  <gamegenie code="SXKIIYSA" description="Infinite health - P1" />
  <gamegenie code="IEUSTOZA" description="Half training time allowed" />
  <gamegenie code="GOUSTOZA" description="Double training time allowed" />
  <gamegenie code="OOPSYY" description="Lose all energy after being on the receiving end of a move" />
</game>
<game code="CLV-H-ACHAV" name="Teenage Mutant Ninja Turtles" crc="EE921D8E">
  <gamegenie code="SXOPPIAX" description="Invincibility" />
  <gamegenie code="AOSOUAST" description="Infinite health" />
  <gamegenie code="OUVPUEOO" description="Infinite health (alt)" />
  <gamegenie code="GXSOUAST" description="Infinite health (alt 2)" />
  <gamegenie code="SXVZGSOO" description="Don't take damage from non-killing seaweed" />
  <gamegenie code="AEOOGTZA" description="Full health boost from pizza slices" />
  <gamegenie code="ZENOATGO" description="10 weapons on pick-up" />
  <gamegenie code="ZUNOATGP" description="50 weapons on pick-up" />
  <gamegenie code="LVNOATGP" description="99 weapons on pick-up" />
  <gamegenie code="GPUOLNZA" description="20 missiles on pick-up" />
  <gamegenie code="YTUOLNZA" description="99 missiles on pick-up" />
  <gamegenie code="TAKOPYLA" description="Double rope on pick-up" />
  <gamegenie code="SXVXTLVG" description="Never lose rope" />
  <gamegenie code="SXOZTVSE" description="Reduce recovery time" />
  <gamegenie code="IIIPAP" description="No sound" />
  <gamegenie code="IAXGPTZA" description="Start a new game to view ending" />
</game>
<game code="CLV-H-ZIPIV" name="Teenage Mutant Ninja Turtles: Tournament Fighters" crc="86964EDD">
  <gamegenie code="OZVVVTEO" description="Infinite health (1 of 3)" />
  <gamegenie code="ELVVNVLP" description="Infinite health (2 of 3)" />
  <gamegenie code="SANTOVSU" description="Infinite health (3 of 3)" />
  <gamegenie code="GXKVKXVK" description="Infinite time" />
  <gamegenie code="AUXAGAEL" description="Start with 1/3 health - both players" />
  <gamegenie code="NYUEESPYE" description="Select ultra strength (ignore strength meter and keep pushing to the right) - both players" />
  <gamegenie code="YAVAZLGA" description="Select any character in story mode" />
  <gamegenie code="OKKEZTVG" description="Infinite continues" />
  <gamegenie code="PEXAGAEL" description="First hit wins round" />
  <gamegenie code="OZNEOXPV" description="One round wins match (1 of 2)" />
  <gamegenie code="ZANEXZPA" description="One round wins match (2 of 2)" />
  <gamegenie code="LEXYLGZE" description="Start a new game to view ending" />
</game>
<game code="CLV-H-EJLOC" name="Teenage Mutant Ninja Turtles II: The Arcade Game" crc="A9217EA2">
  <gamegenie code="ESUEPZEY" description="Invincibility (except grabs from behind) - both players" />
  <gamegenie code="SUVASVSO" description="Infinite health - both players (1 of 2)" />
  <gamegenie code="SLETOKSO" description="Infinite health - both players (2 of 2)" />
  <gamegenie code="AAEAULPA" description="Infinite lives - both players" />
  <gamegenie code="AOXVXZEI" description="One hit kills - both players" />
  <gamegenie code="PEXTKZZE" description="Stronger turtle weapon" />
  <gamegenie code="PEOVKZGE" description="Stronger jump + attack" />
  <gamegenie code="ZEOVKZGA" description="Stronger jump + attack" />
  <gamegenie code="PEXTEZLE" description="Stronger kick" />
  <gamegenie code="PEXTEZLA" description="Weaker kick" />
  <gamegenie code="OEVKNZAA" description="Enable stage select and 10 lives code" />
  <gamegenie code="GESSGLPA" description="Press Start to finish the level (1 of 2)" />
  <gamegenie code="GUSSTUIU" description="Press Start to finish the level (2 of 2)" />
  <gamegenie code="PEOIAPZA" description="Start with 1 life" />
  <gamegenie code="TEOIAPZA" description="Start with 6 lives" />
  <gamegenie code="PEOIAPZE" description="Start with 9 lives" />
</game>
<game code="CLV-H-ZUGWI" name="Teenage Mutant Ninja Turtles III: The Manhattan Project" crc="BB6D7949">
  <gamegenie code="ENSKKIEI" description="Invincibility (except grabs from behind)" />
  <gamegenie code="SLXUTXVS" description="Infinite health (1 of 2)" />
  <gamegenie code="SLKXPKSO" description="Infinite health (2 of 2)" />
  <gamegenie code="AENKLZPA" description="Infinite lives" />
  <gamegenie code="SXNSKKVK" description="Infinite continues" />
  <gamegenie code="AAESYXAA" description="No health loss from using turbo attack" />
  <gamegenie code="ALUGVYAG" description="High-jump" />
  <gamegenie code="AZUGVYAK" description="Super-jump" />
  <gamegenie code="AZUGVYAG" description="Mega-jump" />
  <gamegenie code="AAEZVETP" description="Hit anywhere - both players (1 of 6)" />
  <gamegenie code="AANXNZNI" description="Hit anywhere - both players (2 of 6)" />
  <gamegenie code="AAOZEAGP" description="Hit anywhere - both players (3 of 6)" />
  <gamegenie code="APXZXEUX" description="Hit anywhere - both players (4 of 6)" />
  <gamegenie code="XTXZEEOS" description="Hit anywhere - both players (5 of 6)" />
  <gamegenie code="XTXZOEAN" description="Hit anywhere - both players (6 of 6)" />
  <gamegenie code="PAUZOGLA" description="1 continue" />
  <gamegenie code="PAUZOGLE" description="9 continues" />
  <gamegenie code="AEOAALLA" description="Start with 1 life instead of 4" />
  <gamegenie code="IEOAALLA" description="Start with 6 lives" />
  <gamegenie code="AEOAALLE" description="Start with 9 lives" />
</game>
<game code="CLV-H-XNTBC" name="T2: Terminator 2: Judgment Day" crc="EA27B477">
  <gamegenie code="SXOATOVK" description="Infinite lives" />
  <gamegenie code="PANXPLGA" description="Start with 1 life" />
  <gamegenie code="PANXPLGE" description="Start with 9 lives" />
  <gamegenie code="GXVTXZAX" description="Infinite health" />
  <gamegenie code="XNVOSOKN" description="Super-jump" />
  <gamegenie code="OXNVKXPK" description="Take minimal damage (1 of 2)" />
  <gamegenie code="VNNVSXNN" description="Take minimal damage (2 of 2)" />
  <gamegenie code="PAOOVZZA" description="Slower running (1 of 2)" />
  <gamegenie code="PAUOXZZA" description="Slower running (2 of 2)" />
  <gamegenie code="LAOOVZZA" description="Faster running (1 of 2)" />
  <gamegenie code="LAUOXZZA" description="Faster running (2 of 2)" />
  <gamegenie code="LESPKGZA" description="Faster and longer jumping (1 of 2)" />
  <gamegenie code="LEVPEGZA" description="Faster and longer jumping (2 of 2)" />
</game>
<game code="CLV-H-LWPRP" name="Terminator, The" crc="6272C549">
  <gamegenie code="SXNLNESE" description="Infinite health" />
  <gamegenie code="SXVYIEVK" description="Infinite Grenades" />
</game>
<game code="CLV-H-TLNNA" name="Terra Cresta" crc="2A46B57F">
  <gamegenie code="KTKSLGAZ" description="Invincibility" />
  <gamegenie code="SZKVPTVG" description="Infinite lives" />
  <gamegenie code="AAKSPGZA" description="Start with 1 life" />
  <gamegenie code="IAKSPGZA" description="Start with 6 lives" />
  <gamegenie code="AAKSPGZE" description="Start with 9 lives" />
  <gamegenie code="SXSTULVG" description="Infinite ship formation splits" />
  <gamegenie code="PEOTEALE" description="9 ship formation splits (1 of 2)" />
  <gamegenie code="PEKGETLE" description="9 ship formation splits (2 of 2)" />
  <gamegenie code="AEVKNYLA" description="A secret mega-weapon" />
</game>
<game code="CLV-H-MXPPB" name="Tetris" crc="1394F57E">
  <gamegenie code="AEOPKZYL" description="Lines are cleared when a piece is dropped" />
  <gamegenie code="GAOPEILA" description="Disable Game Over (press start) (1 of 4)" />
  <gamegenie code="GGOPSZEN" description="Disable Game Over (press start) (2 of 4)" />
  <gamegenie code="XPOPNZSX" description="Disable Game Over (press start) (3 of 4)" />
  <gamegenie code="YGOPVZAL" description="Disable Game Over (press start) (4 of 4)" />
  <gamegenie code="AEEOUKAA" description="999999 score with one piece dropped" />
  <gamegenie code="TOUZYLTO" description="Puzzle area doesn't disappear on pause" />
  <gamegenie code="ENEALYNN" description="2P interactive game" />
  <gamegenie code="APSEGYIZ" description="Need only complete 10 lines in game B" />
  <gamegenie code="AISEGYIZ" description="Must complete 50 lines in game B" />
  <gamegenie code="EASEGYIZ" description="Must complete 80 lines in game B" />
  <gamegenie code="PASAUPPE" description="Faster forced fall rate" />
</game>
<game code="CLV-H-LCMKF" name="Tetris 2" crc="9C537919">
  <gamegenie code="AAUEUSSO" description="(1P game) Speed doesn't increase" />
  <gamegenie code="VNUEUSSO" description="(1P game) Speed increases much faster" />
  <gamegenie code="TEXAKYPA" description="(1P game) Start and stay at speed of 25" />
  <gamegenie code="ZEKESSPP" description="(1P game) Max speed is 2 (1 of 2)" />
  <gamegenie code="PESAOSAP" description="(1P game) Max speed is 2 (2 of 2)" />
  <gamegenie code="ZEKESSPO" description="(1P game) Max speed is 10 (1 of 2)" />
  <gamegenie code="PESAOSAO" description="(1P game) Max speed is 10 (2 of 2)" />
  <gamegenie code="YEKESSPO" description="(1P game) Max speed is 15 (1 of 2)" />
  <gamegenie code="TESAOSAO" description="(1P game) Max speed is 15 (2 of 2)" />
  <gamegenie code="GOKESSPP" description="(1P game) Max speed is 20 (1 of 2)" />
  <gamegenie code="LOSAOSAP" description="(1P game) Max speed is 20 (2 of 2)" />
  <gamegenie code="OZNETPOU" description="(1P vs 2P or 1P vs Com) Every round starts with 4 fixed blocks (1 of 2)" />
  <gamegenie code="PANEYPAA" description="(1P vs 2P or 1P vs Com) Every round starts with 4 fixed blocks (2 of 2)" />
  <gamegenie code="OZNETPOU" description="(1P vs 2P or 1P vs Com) Every round starts with 10 fixed blocks (1 of 2)" />
  <gamegenie code="YANEYPAA" description="(1P vs 2P or 1P vs Com) Every round starts with 10 fixed blocks (2 of 2)" />
  <gamegenie code="OZNETPOU" description="(1P vs 2P or 1P vs Com) Every round starts with 15 fixed blocks (1 of 2)" />
  <gamegenie code="GANEYPAE" description="(1P vs 2P or 1P vs Com) Every round starts with 15 fixed blocks (2 of 2)" />
  <gamegenie code="OZNETPOU" description="(1P vs 2P or 1P vs Com) Every round starts with 20 fixed blocks (1 of 2)" />
  <gamegenie code="PPNEYPAA" description="(1P vs 2P or 1P vs Com) Every round starts with 20 fixed blocks (2 of 2)" />
  <gamegenie code="AAVZVYEA" description="(All game types) Cannot pause game" />
  <gamegenie code="AVEXOYXZ" description="(All game types) Don't hide remaining pieces during pause" />
</game>
<game code="CLV-H-WZZKY" name="Thunder &amp; Lightning" crc="D80B44BC">
  <gamegenie code="SINPPLVI" description="Infinite lives - P1" />
</game>
<game code="CLV-H-FWXCF" name="Thunderbirds" crc="2DDC2DC3">
  <gamegenie code="SXNTOVVK" description="Don't lose life points when colliding with enemy" />
  <gamegenie code="SZUVUNVK" description="Don't lose life points when hit" />
  <gamegenie code="SXNVVVVK" description="Don't lose energy points when colliding with enemy" />
  <gamegenie code="SZKVENVK" description="Don't lose energy points when hit" />
  <gamegenie code="PSEKIVGL" description="81 Days to defeat Hood" />
  <gamegenie code="TOEKIVGU" description="30 Days to defeat Hood" />
  <gamegenie code="ATXEANAA" description="Limited forward movement (1 of 2)" />
  <gamegenie code="ATXEGNAA" description="Limited forward movement (2 of 2)" />
  <gamegenie code="GEXETTZA" description="Faster craft (1 of 2)" />
  <gamegenie code="GEXEZTZA" description="Faster craft (2 of 2)" />
  <gamegenie code="EZUAETEG" description="Full firepower on first pick-up (1 of 2)" />
  <gamegenie code="XTUAKVEK" description="Full firepower on first pick-up (2 of 2)" />
</game>
<game code="CLV-H-MUBAD" name="Thundercade" crc="AFB46DD6">
  <gamegenie code="GXVYPZVI" description="Infinite lives" />
  <gamegenie code="PAOYIILA" description="Start with 1 life" />
  <gamegenie code="TAOYIILA" description="Start with 6 lives" />
  <gamegenie code="PAOYIILE" description="Start with 9 lives" />
  <gamegenie code="AAUNLIPP" description="Infinite Missiles" />
  <gamegenie code="GZXYZTVI" description="Infinite Bombs" />
  <gamegenie code="TENNPZLA" description="Start with double Bombs" />
  <gamegenie code="PENNPZLE" description="Start with triple Bombs" />
  <gamegenie code="ZANYGSZA" description="Autofire" />
</game>
<game code="CLV-H-CZLJM" name="Tiger-Heli" crc="C3C7A568">
  <gamegenie code="SZSYAEGK" description="Don't take damage" />
  <gamegenie code="SLXLGNVS" description="Infinite lives - 1P game" />
  <gamegenie code="AEUUYTZA" description="Start with 2 lives - 1P game" />
  <gamegenie code="AEUUYTZE" description="Start with 9 lives - 1P game" />
  <gamegenie code="IASUYYZA" description="Start with 6 lives - P1 in a 2P game" />
  <gamegenie code="AASUYYZE" description="Start with 9 lives - P1 in a 2P game" />
  <gamegenie code="IANLZYZA" description="Start with 6 lives - P2" />
  <gamegenie code="AANLZYZE" description="Start with 9 lives - P2" />
  <gamegenie code="LASNVVZA" description="Extra life every 5 bonus blocks" />
  <gamegenie code="XTVLUEZK" description="Start with 2 little-helis after dying" />
  <gamegenie code="TEKNAXIA" description="Autofire capability" />
  <gamegenie code="ZEKNAXIA" description="Burstfire capability" />
  <gamegenie code="GXVNZLZP" description="Turbo boost" />
  <gamegenie code="SUKLINVS" description="Infinite lives - both players (1 of 2)" />
  <gamegenie code="SUVULNVS" description="Infinite lives - both players (2 of 2)" />
</game>
<game code="CLV-H-KBYPF" name="Time Lord" crc="13D5B1A4">
  <gamegenie code="SZVSLOSE" description="Infinite health" />
  <gamegenie code="SZUKSKVK" description="Infinite lives" />
  <gamegenie code="AEESPNAP" description="Hit anywhere (1 of 2)" />
  <gamegenie code="EPEYSLEL" description="Hit anywhere (2 of 2)" />
  <gamegenie code="PEEKYPLA" description="Start with 1 life" />
  <gamegenie code="TEEKYPLA" description="Start with 6 lives" />
  <gamegenie code="PEEKYPLE" description="Start with 9 lives" />
  <gamegenie code="AAXKXTPA" description="Moonwalking (don't combine with super speed) (1 of 2)" />
  <gamegenie code="PAUGVTAA" description="Moonwalking (don't combine with super speed) (2 of 2)" />
  <gamegenie code="PESKOTAA" description="Super speed (don't combine with moonwalking) (1 of 2)" />
  <gamegenie code="PEOGSTAA" description="Super speed (don't combine with moonwalking) (2 of 2)" />
</game>
<game code="CLV-H-WQQZR" name="Tiny Toon Adventures" crc="99DDDB04">
  <gamegenie code="EYKEGPEI" description="Invincibility" />
  <gamegenie code="SIKINXVS" description="Infinite time" />
  <gamegenie code="SZOOSVVK" description="Infinite health after collecting one heart" />
  <gamegenie code="SEOEYXKX" description="Infinite health and one Carrot" />
  <gamegenie code="SZNOUNVK" description="Infinite lives" />
  <gamegenie code="AASPPVPZ" description="Multi-jump" />
  <gamegenie code="AEEPPYPA" description="Pick-up more hearts" />
  <gamegenie code="PEVOIPZA" description="Power decreases slower when using Dizzy Devil's spin attack" />
  <gamegenie code="YYXIXXLU" description="Slow down timer" />
  <gamegenie code="YPXIXXLU" description="Speed up timer" />
  <gamegenie code="AEXZNZZA" description="1 life after continue" />
  <gamegenie code="IEXZNZZA" description="6 lives after continue" />
  <gamegenie code="AEXZNZZE" description="9 lives after continue" />
  <gamegenie code="AAXKUYZA" description="Start with 1 life" />
  <gamegenie code="IAXKUYZA" description="Start with 6 lives" />
  <gamegenie code="AAXKUYZE" description="Start with 9 lives" />
  <gamegenie code="GENIVPPE" description="Press start to finish the level (don't use on 6-3) (1 of 2)" />
  <gamegenie code="GKNSEOIK" description="Press start to finish the level (don't use on 6-3) (1 of 2)" />
  <gamegenie code="AOOKSYAA" description="Start a new game to view ending" />
  <gamegenie code="VASGOYSA" description="Start on level X (1 of 3)" />
  <gamegenie code="XZXKNNOZ" description="Start on level X (2 of 3)" />
  <gamegenie code="IAUGEYPA" description="Start on level 2 (3 of 3)" />
  <gamegenie code="ZAUGEYPE" description="Start on level 3 (3 of 3)" />
  <gamegenie code="YAUGEYPE" description="Start on level 4 (3 of 3)" />
  <gamegenie code="GPUGEYPA" description="Start on level 5 (3 of 3)" />
</game>
<game code="CLV-H-TLGBU" name="Tiny Toon Adventures 2: Trouble in Wackyland" crc="81A5EB65">
  <gamegenie code="SAOAZASZ" description="Invincibility (1 of 2)" />
  <gamegenie code="EIOAGAEY" description="Invincibility (2 of 2)" />
  <gamegenie code="SZUYAZAX" description="Infinite time" />
  <gamegenie code="SXUXVXVK" description="Protection against hits on log ride" />
  <gamegenie code="SZSEASVK" description="Protection against hits on train" />
  <gamegenie code="SZOOUXVK" description="Protection against hits on bumper cars" />
  <gamegenie code="SXKAYUVK" description="Protection against hits on roller coaster" />
  <gamegenie code="SZSALOVK" description="Protection against hits in fun house" />
  <gamegenie code="AANPYPLA" description="Log ride costs nothing instead of 3 tickets" />
  <gamegenie code="IANPYPLA" description="Log ride costs 5 tickets" />
  <gamegenie code="AANPIPZA" description="Train costs nothing instead of 2 tickets" />
  <gamegenie code="IANPIPZA" description="Train costs 5 tickets" />
  <gamegenie code="AANPPPGA" description="Roller coaster costs nothing instead of 4 tickets" />
  <gamegenie code="TANPPPGA" description="Roller coaster costs 6 tickets" />
  <gamegenie code="AANPLPPA" description="Bumper cars cost nothing instead of 1 ticket" />
  <gamegenie code="GANPLPPA" description="Bumper cars cost 4 tickets" />
  <gamegenie code="AANOZPIA" description="Fun house costs nothing instead of 50 normal tickets" />
  <gamegenie code="PANOZPIA" description="Fun house costs 10 normal tickets" />
  <gamegenie code="PANOZPIE" description="Fun house costs 90 normal tickets" />
  <gamegenie code="PAKYINAE" description="Start a new game to view ending" />
  <gamegenie code="ZAEYPYPA" description="Start with 20 tickets instead of 10" />
  <gamegenie code="IAEYPYPA" description="Start with 50 tickets instead of 10" />
  <gamegenie code="PAEYPYPE" description="Start with 90 tickets instead of 10" />
  <gamegenie code="VVVNAVSE" description="Start with 110 tickets instead of 10" />
</game>
<game code="CLV-H-FTGTY" name="To The Earth" crc="DE8FD935">
  <gamegenie code="AAEUXTGA" description="Shots use up no energy" />
  <gamegenie code="ZAEUXTGA" description="Shots use up less energy" />
  <gamegenie code="AAEUXTGE" description="Shots use up more energy" />
  <gamegenie code="AEUVEYGP" description="Enemy bombs do no damage" />
  <gamegenie code="AEUVEYGO" description="Enemy bombs do half damage" />
  <gamegenie code="AXUVEYGO" description="Enemy bombs do more damage" />
  <gamegenie code="GOEUEVZA" description="Bonus energy for shooting enemy" />
  <gamegenie code="GEEUEVZA" description="Less energy for shooting enemy" />
  <gamegenie code="AEEUEVZA" description="No energy for shooting enemy" />
</game>
<game code="CLV-H-FWSAP" name="Toki" crc="7FB74A43">
  <gamegenie code="EESEYEVG" description="Infinite health" />
  <gamegenie code="SZNOGUVV" description="Infinite weapons (1 of 3)" />
  <gamegenie code="SXEOLUVV" description="Infinite weapons (2 of 3)" />
  <gamegenie code="SXOOZUSE" description="Infinite weapons (3 of 3)" />
  <gamegenie code="AAKEVYPA" description="Infinite time" />
  <gamegenie code="SXNYZSVK" description="Infinite lives" />
  <gamegenie code="XVEAPTAV" description="Hit anywhere - normal enemies (1 of 2)" />
  <gamegenie code="SXSETVSO" description="Hit anywhere - normal enemies (2 of 2)" />
  <gamegenie code="AEKYXYZA" description="Start with 1 life" />
  <gamegenie code="PEKYXYZA" description="Start with 2 lives" />
  <gamegenie code="GEKYXYZA" description="Start with 5 lives" />
  <gamegenie code="AEKYXYZE" description="Start with 9 lives" />
  <gamegenie code="PAENPIZA" description="Start with one heart - first life only" />
  <gamegenie code="AENYTIZA" description="Start with one heart - after first life" />
  <gamegenie code="PEOPTLAA" description="When weapon runs out of ammo it's replaced with the double weapon" />
  <gamegenie code="ZEOPTLAA" description="When weapon runs out of ammo it's replaced with the wave weapon" />
  <gamegenie code="LEOPTLAA" description="When weapon runs out of ammo it's replaced with the 3-way weapon" />
  <gamegenie code="GEOPTLAA" description="When weapon runs out of ammo it's replaced with the flame weapon" />
  <gamegenie code="IEOPTLAA" description="When weapon runs out of ammo it's replaced with the fireball weapon" />
  <gamegenie code="PAEIKALA" description="Start with less time (1 of 2)" />
  <gamegenie code="PAKAGALA" description="Start with less time (2 of 2)" />
  <gamegenie code="IAEIKALA" description="Start with more time (1 of 2)" />
  <gamegenie code="IAKAGALA" description="Start with more time (2 of 2)" />
  <gamegenie code="PAEIKALE" description="Start with even more time (1 of 2)" />
  <gamegenie code="PAKAGALE" description="Start with even more time (2 of 2)" />
</game>
<game code="CLV-H-PZQSV" name="Tom &amp; Jerry" crc="D63B30F5">
  <gamegenie code="PASNVZLA" description="Start with 1 life" />
  <gamegenie code="TASNVZLA" description="Start with 6 lives" />
  <gamegenie code="PASNVZLE" description="Start with 9 lives" />
  <gamegenie code="SXSNYEVK" description="Infinite lives" />
  <gamegenie code="AEXYPAPA" description="Infinite health" />
  <gamegenie code="LEXYPAPA" description="Minimum health (one touch kills)" />
  <gamegenie code="AEVYKPAE" description="Start on world 2" />
  <gamegenie code="AOVYKPAA" description="Start on world 3" />
  <gamegenie code="AOVYKPAE" description="Start on world 4" />
  <gamegenie code="AXVYKPAA" description="Start on world 5" />
</game>
<game code="CLV-H-XTJZE" name="Toobin'" crc="5800BE2D">
  <gamegenie code="SXUTGIVG" description="Infinite lives" />
  <gamegenie code="PAOTZTLA" description="Start with 2 lives" />
  <gamegenie code="TAOTZTLA" description="Start with 6 lives" />
  <gamegenie code="PAOTZTLE" description="Start with 9 lives" />
  <gamegenie code="SZEZZIVG" description="Infinite cans" />
  <gamegenie code="ZPOTTTTA" description="Start with 18 cans" />
  <gamegenie code="GAOTTTTE" description="Start with 12 cans" />
  <gamegenie code="PAOTTTTA" description="Start with 1 can" />
  <gamegenie code="PAOZEAAA" description="Start on level 2" />
  <gamegenie code="LAOZEAAA" description="Start on level 4" />
  <gamegenie code="IAOZEAAA" description="Start on level 6" />
  <gamegenie code="YAOZEAAA" description="Start on level 8" />
  <gamegenie code="ALKXTAAZ" description="Turbo left and right movement (1 of 2)" />
  <gamegenie code="ALVXLAAZ" description="Turbo left and right movement (2 of 2)" />
</game>
<game code="CLV-H-GBHSQ" name="Top Gun" crc="CF6D0D7A">
  <gamegenie code="AEKSNLLA" description="Immune to Bullets (not Missiles)" />
  <gamegenie code="GXKIKIVG" description="Infinite Missiles" />
  <gamegenie code="ASEKTOAZ" description="Take off with double Hound Missiles" />
  <gamegenie code="AXEKYPGO" description="Take off with double Wolf Missiles" />
  <gamegenie code="GOOGAOZA" description="Take off with double Tiger Missiles" />
  <gamegenie code="GXUSNGVG" description="Infinite fuel" />
  <gamegenie code="IANKLOZA" description="Start with half fuel" />
  <gamegenie code="ZAEGLPPA" description="Start on Mission 2" />
  <gamegenie code="LAEGLPPA" description="Start on Mission 3" />
  <gamegenie code="GAEGLPPA" description="Start on Mission 4" />
</game>
<game code="CLV-H-GRCNQ" name="Top Gun: The Second Mission" crc="6F8AF3E8">
  <gamegenie code="ASEAVLEY" description="Invincibility" />
  <gamegenie code="SZVYLIVG" description="Infinite lives" />
  <gamegenie code="AAKEUYPA" description="Infinite missiles - 1P game" />
  <gamegenie code="AENAZIPA" description="Infinite missiles - 2P game" />
  <gamegenie code="KUVZTIKO" description="60 Phoenix missiles - 1P game" />
  <gamegenie code="KOVXTISA" description="20 Phoenix missiles - 2P game" />
  <gamegenie code="PASYALLA" description="Start with 1 life" />
  <gamegenie code="TASYALLA" description="Start with 6 lives" />
  <gamegenie code="PASYALLE" description="Start with 9 lives" />
</game>
<game code="CLV-H-ZDXEM" name="Total Recall" crc="248566A7">
  <gamegenie code="AVNVOAKZ" description="Infinite health" />
  <gamegenie code="GXUIIXSO" description="Most enemies easier to kill" />
  <gamegenie code="PENVKEGE" description="Take less damage" />
  <gamegenie code="XYUVNUXT" description="Gain maximum health from canisters" />
  <gamegenie code="OZNKEPSX" description="Start with X health (1 of 2)" />
  <gamegenie code="ALNKOOLZ" description="Start with less health (2 of 2)" />
  <gamegenie code="NYNKOOLX" description="Start with more health (2 of 2)" />
</game>
<game code="CLV-H-TEZFC" name="Totally Rad" crc="B629D555">
  <gamegenie code="SVVNTKON" description="Infinite health" />
  <gamegenie code="GXXAPKSN" description="Infinite magic" />
  <gamegenie code="SZVAYIVG" description="Immune to fire and water" />
  <gamegenie code="SZSEYXVK" description="Infinite lives" />
  <gamegenie code="AEUXSTZA" description="Start with 1 life" />
  <gamegenie code="IEUXSTZA" description="Start with 6 lives" />
  <gamegenie code="AEUXSTZE" description="Start with 9 lives" />
  <gamegenie code="AOOAYGAO" description="Super-jump" />
  <gamegenie code="YOOAYGAO" description="Mega-jump" />
  <gamegenie code="TEEONALA" description="Half a life or half magic give full health or magic" />
</game>
<game code="CLV-H-BTXGJ" name="Track &amp; Field" crc="9C9F3571">
  <gamegenie code="NTXKTNKT" description="Almost always qualify in Skeet Shooting and Archery" />
  <gamegenie code="UKUKIGKG" description="You don't have to score any points to qualify for Skeet Shooting, Triple Jump and Archery" />
</game>
<game code="CLV-H-IIKYX" name="Treasure Master" crc="B918580C">
  <gamegenie code="KVNPUXEL" description="Invincibility (1 of 2)" />
  <gamegenie code="LENPKZIA" description="Invincibility (2 of 2)" />
  <gamegenie code="SXEETAVG" description="Infinite lives" />
  <gamegenie code="SGKTSGVG" description="Infinite health" />
  <gamegenie code="SKVXYOVK" description="Infinite oxygen" />
</game>
<game code="CLV-H-TXAVS" name="Trog!" crc="EE6892EB">
  <gamegenie code="XTXATOVS" description="Infinite lives" />
</game>
<game code="CLV-H-WUHGF" name="Trojan" crc="FC3E5C86">
  <gamegenie code="NNUZGKYU" description="Infinite health - both players (alt) (1 of 2)" />
  <gamegenie code="NYVNEKYU" description="Infinite health - both players (alt) (2 of 2)" />
  <gamegenie code="SZVSZXVK" description="Infinite health - both players" />
  <gamegenie code="GXEPGKVS" description="Infinite time" />
  <gamegenie code="VTESLOSX" description="One hit kills" />
  <gamegenie code="AAKENATI" description="Hit anywhere (01 of 10)" />
  <gamegenie code="AANNIKLP" description="Hit anywhere (02 of 10)" />
  <gamegenie code="AAOZLYIZ" description="Hit anywhere (03 of 10)" />
  <gamegenie code="AAVAXALG" description="Hit anywhere (04 of 10)" />
  <gamegenie code="AEENPKYA" description="Hit anywhere (05 of 10)" />
  <gamegenie code="AENIEUAP" description="Hit anywhere (06 of 10)" />
  <gamegenie code="AEUNIUUI" description="Hit anywhere (07 of 10)" />
  <gamegenie code="AEUYPLNT" description="Hit anywhere (08 of 10)" />
  <gamegenie code="AEVIULIZ" description="Hit anywhere (09 of 10)" />
  <gamegenie code="GZOXYYEL" description="Hit anywhere (10 of 10)" />
  <gamegenie code="AENIAUYP" description="Always have High-jump Boots" />
  <gamegenie code="SXKVKXVK" description="Keep High-jump Boots on pick-up" />
  <gamegenie code="AAUSAUGP" description="Multi-jump - both players (1 of 3)" />
  <gamegenie code="AESIZUEI" description="Multi-jump - both players (2 of 3)" />
  <gamegenie code="GXKIILEY" description="Multi-jump - both players (3 of 3)" />
  <gamegenie code="YASGUUAE" description="Start with a health boost" />
  <gamegenie code="TPSGUUAE" description="Start with a super health boost" />
  <gamegenie code="GASGUUAA" description="Start with half usual health" />
  <gamegenie code="PENKXPLA" description="Start with 1 life - P1" />
  <gamegenie code="PAOKNZLA" description="Start with 1 life - P2" />
  <gamegenie code="TENKXPLA" description="Start with 6 lives - P1" />
  <gamegenie code="TAOKNZLA" description="Start with 6 lives - P2" />
  <gamegenie code="PENKXPLE" description="Start with 9 lives - P1" />
  <gamegenie code="PAOKNZLE" description="Start with 9 lives - P2" />
  <gamegenie code="ENNKXPLA" description="Start with 187 lives - P1" />
  <gamegenie code="EYOKNZLA" description="Start with 196 lives - P2" />
  <gamegenie code="PASKELZA" description="Start with 100 seconds" />
  <gamegenie code="PASKELZE" description="Start with 900 seconds" />
</game>
<game code="CLV-H-WKTLX" name="Trolls on Treasure Island" crc="C47EFC0E">
  <gamegenie code="SIOGUTVE" description="Infinite time" />
  <gamegenie code="EYNINYEI" description="Only one jewel needed to clear stage" />
</game>
<game code="CLV-H-BZQSF" name="Twin Cobra" crc="0EF730E7">
  <gamegenie code="SZVSGXVK" description="Infinite lives" />
  <gamegenie code="SZNYXOVK" description="Infinite Bombs" />
  <gamegenie code="AEUGZIZA" description="Start with 1 life" />
  <gamegenie code="IEUGZIZA" description="Start with 6 lives" />
  <gamegenie code="AEUGZIZE" description="Start with 9 lives" />
  <gamegenie code="AANKLTZA" description="Start with 1 life after a continue" />
  <gamegenie code="IANKLTZA" description="Start with 6 lives after a continue" />
  <gamegenie code="AANKLTZE" description="Start with 9 lives after a continue" />
  <gamegenie code="AAKKYTPA" description="Infinite continues" />
  <gamegenie code="PEOKIIIE" description="Start with 9 continues" />
  <gamegenie code="ZAEGKILE" description="Start with 9 Bombs" />
  <gamegenie code="GPEGKILA" description="Start with 20 Bombs" />
  <gamegenie code="ZANIAZLE" description="9 Bombs after dying" />
  <gamegenie code="GPNIAZLA" description="20 Bombs after dying" />
  <gamegenie code="AAOYVOLP" description="Autofire" />
  <gamegenie code="GZNITZSA" description="Keep weapon type after death" />
  <gamegenie code="GZNSAZSA" description="Keep super chargers after death" />
</game>
<game code="CLV-H-ZWIAY" name="Ultima: Exodus" crc="A4062017">
  <gamegenie code="GZUKOGST" description="Take no damage from most monsters" />
  <gamegenie code="EIXUUPEP" description="One hit kills" />
  <gamegenie code="AKNSPAEE" description="Never miss with the Fight command" />
  <gamegenie code="AESSGETP" description="Can always attack with the Fight command" />
  <gamegenie code="AEOAKVAA" description="No limit on stat points" />
  <gamegenie code="IEOPTPPA" description="Start with 5 of each item" />
  <gamegenie code="ZEOPTPPE" description="Start with 10 of each item" />
  <gamegenie code="ENOPTPPA" description="Start with 40 of each item" />
  <gamegenie code="PUEPTPAL" description="Start with X gold (1 of 2)" />
  <gamegenie code="XEEOAPGV" description="Start with 35,328 gold (2 of 2)" />
  <gamegenie code="ZEEOAPGT" description="Start with 512 gold (2 of 2)" />
  <gamegenie code="EKEOAPGV" description="Start with 200 gold" />
  <gamegenie code="AAXIAPPA" description="Never lose tools" />
  <gamegenie code="KPVSUZOP" description="Never lose magic" />
  <gamegenie code="AAUEPYPA" description="Rapid magic recovery (1 of 2)" />
  <gamegenie code="OLUAGYOI" description="Rapid magic recovery (2 of 2)" />
  <gamegenie code="YKEAUVTZ" description="Start with 75 stat points (1 of 3)" />
  <gamegenie code="LKUAVYZU" description="Start with 75 stat points (2 of 3)" />
  <gamegenie code="LGSOPAZU" description="Start with 75 stat points (3 of 3)" />
  <gamegenie code="LSEAUVTX" description="Start with 95 stat points (1 of 3)" />
  <gamegenie code="YSUAVYZU" description="Start with 95 stat points (2 of 3)" />
  <gamegenie code="YISOPAZU" description="Start with 95 stat points (3 of 3)" />
</game>
<game code="CLV-H-FUPCX" name="Ultima: Quest of the Avatar" crc="A25A750F">
  <gamegenie code="SZSTXPSA" description="No random battles" />
  <gamegenie code="LTVPZIZL" description="Start with perfect virtues (worthy of Avatarhood)" />
  <gamegenie code="SUOVNKVS" description="Infinite Herbs" />
  <gamegenie code="SZNLKKVK" description="Infinite Oil" />
  <gamegenie code="SUEUIXVS" description="Infinite Torches" />
  <gamegenie code="SXVUGSVK" description="Infinite Gems" />
  <gamegenie code="AZKPTIPA" description="Start with 8336 Gold Pieces" />
  <gamegenie code="APKPTIPA" description="Start with 4240 Gold Pieces" />
  <gamegenie code="AAKPTIPA" description="Start with 144 Gold Pieces (for experts)" />
  <gamegenie code="OLUZZEOO" description="Infinite MP" />
  <gamegenie code="ZEVPTIAA" description="Mage starts with 712 HP" />
  <gamegenie code="PAOPTTAA" description="Mage starts with 381 EXP" />
  <gamegenie code="AXNOIIAP" description="Mage starts with Strength of 32" />
  <gamegenie code="GTXPIVAA" description="Start with 100 Ash instead of 8" />
  <gamegenie code="GTXPTVAA" description="Start with 100 Ginseng instead of 8" />
  <gamegenie code="GTXPYVPA" description="Start with 100 Garlic instead of 9" />
  <gamegenie code="GTXOATYA" description="Start with 100 Silkweb instead of 7" />
  <gamegenie code="GTXOPVAA" description="Start with 100 Moss instead of 8" />
  <gamegenie code="GTXOZTGA" description="Start with 100 Pearl instead of 4" />
  <gamegenie code="GTXOLTAA" description="Start with 100 Fungus instead of none" />
  <gamegenie code="GTXOGTAA" description="Start with 100 Manroot instead of none" />
  <gamegenie code="AEKITITG" description="Heal costs nothing instead of 70" />
  <gamegenie code="AAVILSZA" description="Cure poison costs nothing" />
  <gamegenie code="PAEENYOT" description="Axe costs 1 instead of 225" />
  <gamegenie code="PAEEUYGP" description="Staff costs 1 instead of 20" />
  <gamegenie code="AAOAXYPA" description="Sword costs 144 instead of 400" />
  <gamegenie code="AAEAKYZA" description="Bow costs 168 instead of 680" />
  <gamegenie code="PAXAONEG" description="Leather costs 1 instead of 200" />
  <gamegenie code="AAXAKYZA" description="Chain costs 88 instead of 600" />
  <gamegenie code="AAXEXNPA" description="Plate costs 196 instead of 2500" />
  <gamegenie code="AUNOYSLP" description="Fighter starts with Strength of 48" />
  <gamegenie code="NYOOPVSK" description="Fighter starts with 255 EXP" />
  <gamegenie code="LEVOZIPA" description="Fighter starts with 812 HP" />
  <gamegenie code="LKNPYIAE" description="Fighter starts with 75 MP" />
</game>
<game code="CLV-H-MXNPK" name="Ultima: Warriors of Destiny" crc="4823EEFE">
  <gamegenie code="SUSTXSVS" description="Infinite consumable items such as food and torches - May not be able to discard some items" />
  <gamegenie code="AAEZIPZL" description="A night at the Wayfarer Inn is free" />
  <gamegenie code="AEUZPAPA" description="At Healer's Herbs - Sulfurous ash is free instead of 1 GP" />
  <gamegenie code="AEUZGAZA" description="At Healer's Herbs - Ginseng is free instead of 2 GP" />
  <gamegenie code="AEUZYAZA" description="At Healer's Herbs - Garlic is free instead of 2 GP" />
  <gamegenie code="AEUXIAGT" description="At Healer's Herbs - An Tym Scroll is free instead of 100 GP" />
  <gamegenie code="AEKZAAVP" description="At Healer's Herbs - Spellbook is free instead of 150 GP" />
  <gamegenie code="AEUXZAGA" description="At Healer's Herbs - Spidersilk is free instead of 4 GP" />
  <gamegenie code="AEEXZAGA" description="From Pendra - Spidersilk is free instead of 4 GP" />
  <gamegenie code="AEEZYALA" description="From Pendra - Black Pearl is free instead of 3 GP" />
  <gamegenie code="AEEZGAZA" description="From Pendra - Garlic is free instead of 2 GP" />
  <gamegenie code="AEEZPAZA" description="From Pendra - Ginseng is free instead of 2 GP" />
  <gamegenie code="AEEXIELG" description="From Pendra - Sant Talisman is free instead of 75 GP" />
  <gamegenie code="AAEXIELG" description="At Iolo's Bows - Bow is free instead of 75 GP" />
  <gamegenie code="AAEXZEPP" description="At Iolo's Bows - Wooden shield is free instead of 25 GP" />
  <gamegenie code="AAEZGALA" description="At Iolo's Bows - Dagger is free instead of 3 GP" />
  <gamegenie code="AAEZYEAZ" description="At Iolo's Bows - Short sword is free instead of 40 GP" />
  <gamegenie code="AAOZAAVP" description="At Iolo's Bows - Crossbow is free instead of 150 GP" />
  <gamegenie code="AAOZTAPA" description="At Iolo's Bows - Arrow is free instead of 1 GP" />
  <gamegenie code="AAOXPAZA" description="At Iolo's Bows - Bolt is free instead of 2 GP" />
  <gamegenie code="PAOZAPAE" description="At Iolo's Bows - Sell Dagger for 2,305 instead of 1 GP" />
  <gamegenie code="LAOZLPAG" description="At Iolo's Bows - Sell Short sword for 2,848 instead of 20 GP" />
  <gamegenie code="YAOZTPAE" description="At Iolo's Bows - Sell Wooden shield for 3,850 instead of 10 GP" />
  <gamegenie code="AAOZLAAZ" description="At Iolo's Bows - Magic bow is free instead of 800 GP (1 of 2)" />
  <gamegenie code="AAOZGALA" description="At Iolo's Bows - Magic bow is free instead of 800 GP (2 of 2)" />
  <gamegenie code="AESXEZGA" description="Start new game with 201 instead of 1,225 GP" />
  <gamegenie code="AOSXEZGA" description="Start new game with 4,297 instead of 1,225 GP" />
  <gamegenie code="YNSXEZGE" description="Start new game with 32,713 instead of 1,225 GP" />
</game>
<game code="CLV-H-PTDPA" name="Ultimate Air Combat" crc="E387C77F">
  <gamegenie code="SZOXIEVK" description="Infinite Chaff" />
  <gamegenie code="SXVZZSVK" description="Infinite Missiles (1 of 2)" />
  <gamegenie code="SZEXGVVK" description="Infinite Missiles (2 of 2)" />
</game>
<game code="CLV-H-LKFQK" name="Ultimate Stuntman, The" crc="892434DD">
  <gamegenie code="GXUAOKVK" description="Don't lose a life on Ground Pursuit, Boat and Hang Glider stages" />
  <gamegenie code="AENVNGZA" description="Start with 1 life (first credit only)" />
  <gamegenie code="IENVNGZA" description="Start with 6 lives (first credit only)" />
  <gamegenie code="AENVNGZE" description="Start with 9 lives (first credit only)" />
  <gamegenie code="SXNSYXVK" description="Infinite time" />
  <gamegenie code="SXXSNUVK" description="Infinite 'Crez' weapon until end of stage" />
  <gamegenie code="PEXXSATE" description="9 seconds on clock pick-up" />
  <gamegenie code="AEOZXPZA" description="Full energy on pick-up" />
  <gamegenie code="NYXXVVAN" description="Shield lasts longer on Human Fly stages" />
  <gamegenie code="AGXXVVAY" description="Shield lasts a shorter time on Human Fly stages" />
  <gamegenie code="SXNXKNVK" description="Don't lose a life against end-of-stage bosses and on street combat stages" />
  <gamegenie code="SXXUXSVK" description="Don't lose a life on Human Fly stages" />
  <gamegenie code="OVUZKPSV" description="Minimum damage taken (1 of 2)" />
  <gamegenie code="PEUZSONY" description="Minimum damage taken (2 of 2)" />
</game>
<game code="CLV-H-CGFFW" name="Uncanny X-Men, The" crc="2D41EF92">
  <gamegenie code="SXEEXIST" description="Infinite life" />
  <gamegenie code="GVUZPOEG" description="Half life - Wolverine" />
  <gamegenie code="GVUZYOEG" description="Half life - Cyclops" />
  <gamegenie code="PKUXIPXA" description="Half life - Nightcrawler" />
  <gamegenie code="YSKZLOVU" description="Half life - Iceman" />
  <gamegenie code="YNKXPONN" description="Half life - Colossus" />
  <gamegenie code="ASKXYPEZ" description="Half life - Storm" />
</game>
<game code="CLV-H-OTSOM" name="Untouchables, The" crc="588A31FE">
  <gamegenie code="SLOEAGVI" description="Infinite energy on scenes 1 and 4" />
  <gamegenie code="SXKAATVG" description="Infinite energy on scene 2" />
  <gamegenie code="SXUAZGVG" description="Infinite time on scenes 1 and 4" />
  <gamegenie code="GEXELPZA" description="More time on scene 1" />
  <gamegenie code="PEXELPZA" description="Less time on scene 1" />
  <gamegenie code="TAXELAGA" description="More time on scene 2" />
  <gamegenie code="ZAXELAGA" description="Less time on scene 2" />
  <gamegenie code="TAXEYAGA" description="More time on scene 3" />
  <gamegenie code="ZAXEYAGA" description="Less time on scene 3" />
  <gamegenie code="TAXAPAIA" description="More time on scene 5" />
  <gamegenie code="LAXAPAIA" description="Less time on scene 5" />
  <gamegenie code="ZAOEAAPA" description="More time on scene 7" />
  <gamegenie code="AZNETGAP" description="More ammo picked up on scene 2" />
  <gamegenie code="IANETGAP" description="Less ammo picked up on scene 2" />
  <gamegenie code="PAOEGATE" description="More ammo picked up on scene 7" />
  <gamegenie code="AAXKTEGA" description="Start on scene 2" />
  <gamegenie code="ZAXKTEGA" description="Start on scene 3" />
  <gamegenie code="GAXKTEGA" description="Start on scene 4" />
  <gamegenie code="TAXKTEGA" description="Start on scene 5" />
  <gamegenie code="ZAXKTEGE" description="Start on scene 7" />
</game>
<game code="CLV-H-FNMIK" name="Urban Champion" crc="656D4265">
  <gamegenie code="AEEIZGGE" description="Powerful quick punches" />
  <gamegenie code="TOEIZGGA" description="Super powerful quick punch" />
  <gamegenie code="GZOTZLVG" description="Infinite time" />
  <gamegenie code="LENVTZTA" description="Speed up the timer" />
  <gamegenie code="AAXSLLPA" description="Become a stronger fighter" />
  <gamegenie code="LAXSLLPA" description="Become a weaker fighter" />
</game>
<game code="CLV-H-GNKGD" name="Vice: Project Doom" crc="753768A6">
  <gamegenie code="XVVKISZK" description="Multi-jump" />
  <gamegenie code="AANSEIYP" description="Invincibility" />
  <gamegenie code="AEEYXEET" description="Hit anywhere" />
  <gamegenie code="SZSKIOVK" description="Infinite lives" />
  <gamegenie code="SZNNNSVK" description="Infinite time" />
  <gamegenie code="SZVYXKVK" description="Infinite grenades" />
  <gamegenie code="SZKNXKVK" description="Infinite bullets" />
  <gamegenie code="SXVYVKSE" description="Infinite power" />
  <gamegenie code="ZEOYNGGV" description="10 coins for an extra life" />
  <gamegenie code="POOYNGGV" description="25 coins for an extra life" />
  <gamegenie code="GOENELIA" description="20 extra Grenades on pick-up" />
  <gamegenie code="POXYXUZE" description="25 extra Bullets on pick-up" />
  <gamegenie code="LTNNXLIA" description="Start with 99 grenades" />
  <gamegenie code="VPOEPKXY" description="Start timer for round 1 at 150" />
  <gamegenie code="VPUAZKXY" description="Start timer for round 2 at 150" />
</game>
<game code="CLV-H-ZLUFZ" name="Vindicators" crc="A8F5C2AB">
  <gamegenie code="KLUAGTVI" description="Infinite lives" />
  <gamegenie code="AAKKYTZA" description="Start with 1 life" />
  <gamegenie code="IAKKYTZA" description="Start with 6 lives" />
  <gamegenie code="AAKKYTZE" description="Start with 9 lives" />
  <gamegenie code="VYUKEIVI" description="Automatic fuel replenishment" />
  <gamegenie code="GZOEVXON" description="Never lose Stars" />
  <gamegenie code="VVVAAPSA" description="Start with 10 Stars" />
  <gamegenie code="ZAUKYTZP" description="Quicker shot re-load" />
  <gamegenie code="AZKGYVAA" description="Start with increased shot range" />
  <gamegenie code="LPKKLVGE" description="Turbo speed" />
  <gamegenie code="AAUKYTZO" description="Start with XX shots (1 of 2)" />
  <gamegenie code="VIKGPTEI" description="Start with 80 Shots (2 of 2)" />
  <gamegenie code="KIKGPTEI" description="Start with 80 Bombs (2 of 2)" />
</game>
<game code="CLV-H-DXBEH" name="Volleyball" crc="27777635">
  <gamegenie code="YEYIAV" description="Computer doesn't get points for scoring" />
</game>
<game code="CLV-H-VRWYL" name="Wacky Races" crc="401521F7">
  <gamegenie code="EINSUPEY" description="Invincibility (1 of 3)" />
  <gamegenie code="ESUISPEY" description="Invincibility (2 of 3)" />
  <gamegenie code="ESEKSIEY" description="Invincibility (3 of 3)" />
  <gamegenie code="SKSGSVVK" description="Infinite health (1 of 2)" />
  <gamegenie code="SKUKUSVK" description="Infinite health (2 of 2)" />
  <gamegenie code="GXSGSVVK" description="Infinite health (alt) (1 of 3)" />
  <gamegenie code="GZNKVVVK" description="Infinite health (alt) (2 of 3)" />
  <gamegenie code="GXUKUSVK" description="Infinite health (alt) (3 of 3)" />
  <gamegenie code="SASSZEVK" description="Infinite lives (1 of 2)" />
  <gamegenie code="SEKIYEVK" description="Infinite lives (2 of 2)" />
  <gamegenie code="APSIGESZ" description="Infinite lives (alt) (1 of 2)" />
  <gamegenie code="AASIIEIS" description="Infinite lives (alt) (2 of 2)" />
  <gamegenie code="SXOILNSE" description="Infinite Bones after obtaining one" />
  <gamegenie code="AAKVEIZA" description="Start with 1 life" />
  <gamegenie code="GAKVEIZA" description="Start with 5 lives" />
  <gamegenie code="TAKVEIZA" description="Start with 7 lives" />
  <gamegenie code="AAKVEIZE" description="Start with 9 lives" />
  <gamegenie code="TASTOILA" description="Start with 6 hearts" />
  <gamegenie code="AASTOILE" description="Start with 8 hearts" />
  <gamegenie code="GXSGSVVK" description="Don't take most damage" />
  <gamegenie code="EKUVKIKK" description="Start at race 1, end of stage 1" />
  <gamegenie code="NKUVKIKK" description="Start at race 1, end of stage 2" />
  <gamegenie code="KSUVKIKG" description="Start at race 1, end of stage 3" />
  <gamegenie code="ESUVVIVS" description="Start at race 2, end of stage 1" />
  <gamegenie code="KSUVVIVS" description="Start at race 2, end of stage 2" />
  <gamegenie code="EVUVVIVI" description="Start at race 2, end of stage 3" />
  <gamegenie code="KVKTEIXT" description="Start at race 3, end of stage 1" />
  <gamegenie code="EVKTEIXV" description="Start at race 3, end of stage 2" />
  <gamegenie code="KVKTEIXV" description="Start at race 3, end of stage 3" />
  <gamegenie code="ENKTEIXT" description="Start at race 3, end of stage 4" />
  <gamegenie code="XNUVKIKG" description="Go straight to level boss" />
</game>
<game code="CLV-H-AAIWG" name="Wall Street Kid" crc="B6661BDA">
  <gamegenie code="OUSNVLOP" description="Infinite money" />
  <gamegenie code="NYEEPPAX" description="Sart a new game with $16,777,215 (1 of 3)" />
  <gamegenie code="NYEEZPOX" description="Sart a new game with $16,777,215 (2 of 3)" />
  <gamegenie code="NYEELPYE" description="Sart a new game with $16,777,215 (3 of 3)" />
</game>
<game code="CLV-H-RSWNY" name="Wally Bear and the No! Gang" crc="81ECDA0D">
  <gamegenie code="AOUXYYEI" description="Invincibility" />
  <gamegenie code="GZNXZISA" description="Multi-jump" />
  <gamegenie code="AANLINGI" description="Collect items from anywhere (1 of 2)" />
  <gamegenie code="AANULYTI" description="Collect items from anywhere (2 of 2)" />
</game>
<game code="CLV-H-BSFWJ" name="Wario's Woods" crc="F79A75D7">
  <gamegenie code="LTKPOLAA" description="Clear round A data to complete round A and B (1 of 2)" />
  <gamegenie code="PGKPVLZG" description="Clear round A data to complete round A and B (2 of 2)" />
  <gamegenie code="PAVOEXTP" description="Each coin gives you a credit" />
  <gamegenie code="OZSUNAOU" description="Always get blue monsters (1 of 2)" />
  <gamegenie code="EYVLEAUL" description="Always get blue monsters (2 of 2)" />
  <gamegenie code="VTSLEESE" description="Always get 1 line of monsters" />
  <gamegenie code="OXNATNSE" description="Wario doesn't cause ceiling to fall, no enemies fall" />
  <gamegenie code="XTKXGXVK" description="One bomb in Birdo time only" />
  <gamegenie code="XTNXLOVK" description="Infinite time" />
  <gamegenie code="SXOIOASA" description="Invisible Toad" />
  <gamegenie code="ENXPSPEI" description="Invisible coins" />
  <gamegenie code="XVXPSESE" description="Coins worth 5" />
  <gamegenie code="XVXOEEVK" description="Infinite coins fall" />
  <gamegenie code="VXSOTNVK" description="Only 1 coin falls" />
  <gamegenie code="EESOTNVG" description="No Coins fall" />
  <gamegenie code="NYSZUSOO" description="Diamonds don't form in lesson mode" />
</game>
<game code="CLV-H-NESQU" name="Wayne's World" crc="B0CD000F">
  <gamegenie code="PANEYAGA" description="Start with 2 lives" />
  <gamegenie code="YANEYAGA" description="Start with 8 lives" />
  <gamegenie code="PANEYAGE" description="Start with 10 lives" />
  <gamegenie code="VXKESXVK" description="Infinite lives" />
  <gamegenie code="EANEZAEL" description="Start with less Worthiness" />
  <gamegenie code="AGNEZAEL" description="Start with much less Worthiness" />
  <gamegenie code="SZSEXUSE" description="Infinite Worthiness" />
  <gamegenie code="NNSLYYKU" description="More time in level 1" />
  <gamegenie code="NNNLIYZU" description="More time in Donut shop in level 1" />
  <gamegenie code="SXSALOVK" description="Infinite time" />
  <gamegenie code="AANAKLZA" description="Power-up restores all Worthiness" />
  <gamegenie code="SZNANUSE" description="Power-up worth nothing" />
  <gamegenie code="SZOOSUVV" description="Getting all donuts is worth no extra lives" />
  <gamegenie code="YOKEZOLU" description="Faster timer" />
  <gamegenie code="AVKEZOLL" description="Slower timer" />
  <gamegenie code="IAEZXAGP" description="5 special moves on pick-up" />
  <gamegenie code="AZEZXAGO" description="40 special moves on pick-up" />
</game>
<game code="CLV-H-KMPZG" name="WCW World Championship Wrestling" crc="5EA7D410">
  <gamegenie code="EGOZINIP" description="Always win - P1 (1 of 3)" />
  <gamegenie code="PAOZTNPA" description="Always win - P1 (2 of 3)" />
  <gamegenie code="XTOZYYIE" description="Always win - P1 (3 of 3)" />
</game>
<game code="CLV-H-MPGYN" name="Werewolf: The Last Warrior" crc="333C48A0">
  <gamegenie code="SZXTTLVG" description="Infinite time" />
  <gamegenie code="PAENGTIA" description="Only 1 anger point needed to become Super-Werewolf" />
  <gamegenie code="SZXNPVVK" description="Blue W won't change you back to a man" />
  <gamegenie code="ESKNTIKI" description="Gain maximum health from small hearts" />
  <gamegenie code="AAUNGVZA" description="Don't lose health from blue W (1 of 2)" />
  <gamegenie code="AAUNPVAA" description="Don't lose health from blue W (2 of 2)" />
  <gamegenie code="AAVGVYGT" description="Hit anywhere (1 of 4)" />
  <gamegenie code="AAVKKNTI" description="Hit anywhere (2 of 4)" />
  <gamegenie code="AEXGXNAZ" description="Hit anywhere (3 of 4)" />
  <gamegenie code="AEXKEYZZ" description="Hit anywhere (4 of 4)" />
</game>
<game code="CLV-H-NTWKE" name="Where's Waldo?" crc="C3463A3D">
  <gamegenie code="AEETLZPA" description="Infinite time" />
  <gamegenie code="VTSVYYTE" description="Guesses cost nothing" />
</game>
<game code="CLV-H-ZRUFN" name="Who Framed Roger Rabbit" crc="12B2C361">
  <gamegenie code="ATKTIPEI" description="Invincibility (1 of 4)" />
  <gamegenie code="ATVIKLEI" description="Invincibility (2 of 4)" />
  <gamegenie code="ATXGOPEI" description="Invincibility (3 of 4)" />
  <gamegenie code="AVOVAIEI" description="Invincibility (4 of 4)" />
  <gamegenie code="SXVOYIVG" description="Never lose a life except in Punch lines" />
  <gamegenie code="SZSZXYVG" description="Never lose a life in Punch lines" />
  <gamegenie code="SXKELNVK" description="Infinite continues" />
  <gamegenie code="PAUKXTGA" description="Harder to build strength" />
  <gamegenie code="EPUKXTGA" description="Strength to full instantly" />
  <gamegenie code="PESSSYLA" description="Start with 1 life" />
  <gamegenie code="TESSSYLA" description="Start with 6 lives" />
  <gamegenie code="PESSSYLE" description="Start with 9 lives" />
</game>
<game code="CLV-H-HHYHV" name="Whomp 'Em" crc="6FD5A271">
  <gamegenie code="ATSELPEY" description="Invincibility" />
  <gamegenie code="SXEEZPVG" description="Don't lose a life from health loss" />
  <gamegenie code="SXXOUPVG" description="Creatures can't steal extra lives" />
  <gamegenie code="SZNATPSA" description="Infinite health" />
  <gamegenie code="SZKEGPVG" description="Keep Buffalo Headdress for present level" />
  <gamegenie code="ZAKELOAA" description="Always have Buffalo Headdress" />
  <gamegenie code="AEKKGALA" description="Start with 1 life" />
  <gamegenie code="LAVKYAAA" description="Start with 5 lives" />
  <gamegenie code="AAVKYAAE" description="Start with 10 lives" />
</game>
<game code="CLV-H-MTOLQ" name="Widget" crc="E7C981A2">
  <gamegenie code="ENNVEZEI" description="Invincibility" />
  <gamegenie code="SXSLEKSE" description="Infinite health (except against spikes)" />
  <gamegenie code="SXUVOEVK" description="Infinite health (only against spikes)" />
  <gamegenie code="SXUAVXVK" description="Infinite time (1 of 2)" />
  <gamegenie code="SXXANXVK" description="Infinite time (2 of 2)" />
  <gamegenie code="SXXPPVSE" description="Infinite MP" />
  <gamegenie code="SZUGSXVK" description="Infinite lives" />
</game>
<game code="CLV-H-DJXNX" name="Wild Gunman" crc="5112DC21">
  <gamegenie code="GZOGVYVG" description="Infinite lives in Gang Mode" />
  <gamegenie code="GZNIPAVG" description="Infinite ammo in Gang Mode" />
  <gamegenie code="AXVIEOYA" description="Start with double normal ammo" />
  <gamegenie code="AUVIEOYA" description="Start with triple normal ammo" />
  <gamegenie code="AEVIEOYE" description="Start with half normal ammo" />
  <gamegenie code="YEUISPLE" description="Start with 1 life (1 of 2)" />
  <gamegenie code="PENGVALA" description="Start with 1 life (2 of 2)" />
  <gamegenie code="ZEUISPLE" description="Start with 10 lives (1 of 2)" />
  <gamegenie code="ZENGVALE" description="Start with 10 lives (2 of 2)" />
  <gamegenie code="YEUISPLE" description="Start with 15 lives (1 of 2)" />
  <gamegenie code="YENGVALE" description="Start with 15 lives (2 of 2)" />
  <gamegenie code="IENSUOZA" description="Shoot 5 enemies to finish level (1 of 2)" />
  <gamegenie code="IEUSSUZA" description="Shoot 5 enemies to finish level (2 of 2)" />
</game>
<game code="CLV-H-HJHWZ" name="Willow" crc="103E7E7F">
  <gamegenie code="ZASEGOUI" description="Infinite magic" />
  <gamegenie code="TGNILGSA" description="Don't take any hits" />
  <gamegenie code="XZKYILKP" description="Start with all items (1 of 2)" />
  <gamegenie code="AVUOXSOZ" description="Start with all items (2 of 2)" />
  <gamegenie code="PNKINTSL" description="Start at EXP Level X (1 of 2)" />
  <gamegenie code="GEKISVZA" description="Start at EXP Level 5 (2 of 2)" />
  <gamegenie code="PEKISVZE" description="Start at EXP Level 10 (2 of 2)" />
  <gamegenie code="TEKISVZE" description="Start at EXP Level 15 (2 of 2)" />
</game>
<game code="CLV-H-GZNQZ" name="Wizardry: Proving Grounds of the Mad Overlord" crc="D9BB572C">
  <gamegenie code="AEVEIPAL" description="Annointed Mace costs nothing instead of 30" />
  <gamegenie code="AAVEIPIZ" description="Long Sword costs nothing instead of 25" />
  <gamegenie code="AEXEIPIP" description="Short Sword costs nothing instead of 15" />
  <gamegenie code="AEVEIZAZ" description="Small Shield costs nothing instead of 20" />
  <gamegenie code="AAVEIZAP" description="Staff costs nothing instead of 10" />
  <gamegenie code="AEXEIZIA" description="Dagger costs nothing instead of 15" />
  <gamegenie code="AAVEILIP" description="Robes costs nothing instead of 15" />
  <gamegenie code="AEVEGYIA" description="S of Pain costs nothing instead of 500" />
  <gamegenie code="AAXEKAIA" description="S of Fire costs nothing instead of 500" />
  <gamegenie code="AEXEGYIP" description="Body Armor costs nothing instead of 1500" />
  <gamegenie code="AAXEILAG" description="Large Shield costs nothing instead of 40" />
  <gamegenie code="AEXEILAI" description="Leather Armor costs nothing instead of 50" />
  <gamegenie code="AEVEILEP" description="Chain Mail costs nothing instead of 90" />
  <gamegenie code="AAXEGGZA" description="Breast Plate costs nothing instead of 200" />
  <gamegenie code="AEXEGGPA" description="Helm costs nothing instead of 100" />
  <gamegenie code="AEVEGGIA" description="S of Curing costs nothing instead of 500" />
  <gamegenie code="AAXEGTAL" description="Rod of Iron costs nothing instead of 3000" />
  <gamegenie code="AEXEGTIP" description="Padded Leather costs nothing instead of 1500" />
  <gamegenie code="AEVEGTIP" description="Shiny Chain costs nothing instead of 1500" />
  <gamegenie code="AAXEGYIP" description="Sturdy Plate costs nothing instead of 1500" />
  <gamegenie code="AAVEGYIP" description="Iron Shield costs nothing instead of 1500" />
  <gamegenie code="AEVEKGAT" description="Gloves of Copper costs nothing instead of 6000" />
  <gamegenie code="AAVEKLIP" description="S of Glass costs nothing instead of 1500" />
  <gamegenie code="AAXEKPIZ" description="Studly Staff costs nothing instead of 2500" />
  <gamegenie code="AAXEGILA" description="S of Neutralizing costs nothing instead of 300" />
  <gamegenie code="AAVEGGYA" description="Plate Mail costs nothing instead of 750 (1 of 2)" />
  <gamegenie code="AAVEIGAI" description="Plate Mail costs nothing instead of 750 (2 of 2)" />
  <gamegenie code="AEXEGIAI" description="Blade of Biting costs nothing instead of 15000 (1 of 2)" />
  <gamegenie code="AEXELIPA" description="Blade of Biting costs nothing instead of 15000 (2 of 2)" />
</game>
<game code="CLV-H-NDBSP" name="Wizards &amp; Warriors" crc="26535EF5">
  <gamegenie code="EINVTIEY" description="Invincibility" />
  <gamegenie code="AUATPI" description="Invincibility (flashes)" />
  <gamegenie code="GXVUZGVG" description="Infinite lives" />
  <gamegenie code="SXVUZGVG" description="Infinite lives (alt)" />
  <gamegenie code="GZNVILST" description="Infinite health" />
  <gamegenie code="OXOVATES" description="Infinite health (alt) (1 of 3)" />
  <gamegenie code="GEOVPVGU" description="Infinite health (alt) (2 of 3)" />
  <gamegenie code="SEOVZTSZ" description="Infinite health (alt) (3 of 3)" />
  <gamegenie code="NTEINNYK" description="Potions last longer" />
  <gamegenie code="PEEVAGZA" description="Meat gives half health" />
  <gamegenie code="GEEVAGZA" description="Meat gives double health" />
  <gamegenie code="ALGYPL" description="Enter doors without needing a key" />
  <gamegenie code="KYISTO" description="Jump higher" />
  <gamegenie code="KGTITO" description="Jump to the top of the scren" />
  <gamegenie code="IAUUKAZA" description="Start with 6 lives (1 of 2)" />
  <gamegenie code="IAXGGAZA" description="Start with 6 lives (2 of 2)" />
  <gamegenie code="AAUUKAZE" description="Start with 9 lives (1 of 2)" />
  <gamegenie code="AAXGGAZE" description="Start with 9 lives (2 of 2)" />
</game>
<game code="CLV-H-CLXIQ" name="IronSword: Wizards &amp; Warriors II" crc="2328046E">
  <gamegenie code="OXXANAVK" description="Infinite lives" />
  <gamegenie code="OZUAXPVK" description="Infinite continues" />
  <gamegenie code="GXXSNKVS" description="Infinite magic" />
  <gamegenie code="ZEOSEGAA" description="Infinite money" />
  <gamegenie code="SEOOTISZ" description="Infinite keys once one is obtained" />
  <gamegenie code="AEEOEAZA" description="Food gives full health" />
  <gamegenie code="AAOPNPZA" description="Drink gives full health" />
  <gamegenie code="OTUIGLSV" description="Super-jump (1 of 2)" />
  <gamegenie code="PAUIILVE" description="Super-jump (2 of 2)" />
  <gamegenie code="LEVEXZAA" description="Start with Axe and Helmet" />
  <gamegenie code="ZEVAVXNY" description="Start with Shield" />
  <gamegenie code="AAOAGUGA" description="Start with Ironsword" />
  <gamegenie code="AASIYPLA" description="Fleet foot jumping" />
  <gamegenie code="OXKSYUPX" description="Fleet foot running" />
  <gamegenie code="LEEEPZAE" description="Start on wind level" />
  <gamegenie code="GOEEPZAA" description="Start on tree level" />
  <gamegenie code="TOEEPZAA" description="Start on water level" />
  <gamegenie code="IOEEPZAA" description="Start on outer fire level" />
  <gamegenie code="LUEEPZAA" description="Start on lower earth level" />
  <gamegenie code="PUEEPZAA" description="Start on lower icefire mountain" />
  <gamegenie code="NYEAVLAE" description="Start a new game with full magic" />
  <gamegenie code="PENAEZLA" description="Start with 1 life (1 of 2)" />
  <gamegenie code="PESEXPLA" description="Start with 1 life (2 of 2)" />
  <gamegenie code="TENAEZLA" description="Start with 6 lives (1 of 2)" />
  <gamegenie code="TESEXPLA" description="Start with 6 lives (2 of 2)" />
</game>
<game code="CLV-H-MZIAL" name="Wizards &amp; Warriors III" crc="D2562072">
  <gamegenie code="PAXXPYLA" description="Start with 2 lives" />
  <gamegenie code="TAXXPYLA" description="Start with 7 lives" />
  <gamegenie code="PAXXPYLE" description="Start with 10 lives" />
  <gamegenie code="SXNTPLVG" description="Infinite lives (except boss stages)" />
  <gamegenie code="POSAGGZU" description="Coins worth 25" />
  <gamegenie code="GVSAGGZL" description="Coins worth 100" />
  <gamegenie code="NNSAGGZU" description="Coins worth 255" />
  <gamegenie code="IESAZKZA" description="Bags worth 5" />
  <gamegenie code="ZUSAZKZA" description="Bags worth 50" />
  <gamegenie code="NNSAZKZE" description="Bags worth 255" />
  <gamegenie code="AGKZGYEA" description="Start with Less health" />
  <gamegenie code="ELKZGYEA" description="Start with More health" />
  <gamegenie code="AGELLZEA" description="Less health after death (except boss stages)" />
  <gamegenie code="ELELLZEA" description="More health after death (except boss stages)" />
  <gamegenie code="PAKZGYEA" description="Start with very little life force" />
  <gamegenie code="AGKZGYEA" description="Start with about half life force" />
  <gamegenie code="SXVTGLVG" description="Infinite lives" />
  <gamegenie code="SZNYZNSE" description="Shopkeeper sometimes forgets to charge" />
  <gamegenie code="SXXNITVG" description="Infinite keys" />
  <gamegenie code="EYYYYY" description="Infinite gold" />
</game>
<game code="CLV-H-NOZEU" name="Wolverine" crc="35476E87">
  <gamegenie code="ISISYU" description="No enemies" />
  <gamegenie code="PEUSZALA" description="Start with 1 life - P1" />
  <gamegenie code="TEUSZALA" description="Start with 6 lives - P1" />
  <gamegenie code="PEUSZALE" description="Start with 9 lives - P1" />
  <gamegenie code="PEVIYALA" description="Start with 1 life - P2" />
  <gamegenie code="TEVIYALA" description="Start with 6 lives - P2" />
  <gamegenie code="PEVIYALE" description="Start with 9 lives - P2" />
  <gamegenie code="GZEXAOVK" description="Infinite lives - both players" />
  <gamegenie code="PEXIZAAA" description="Start on stage 2 - P1" />
  <gamegenie code="LEXIZAAA" description="Start on stage 4 - P1" />
  <gamegenie code="IEXIZAAA" description="Start on stage 6 - P1" />
  <gamegenie code="YEXIZAAA" description="Start on stage 8 - P1" />
  <gamegenie code="PEKSYAAA" description="Start on stage 2 - P2" />
  <gamegenie code="LEKSYAAA" description="Start on stage 4 - P2" />
  <gamegenie code="IEKSYAAA" description="Start on stage 6 - P2" />
  <gamegenie code="YEKSYAAA" description="Start on stage 8 - P2" />
  <gamegenie code="AXXLNUIE" description="Mega-jump" />
  <gamegenie code="AAXGYLPA" description="Claws use up no health" />
  <gamegenie code="AGNIZAAA" description="Start each new life as a berserker" />
  <gamegenie code="KYXUVUVN" description="Super speed (1 of 2)" />
  <gamegenie code="GAUUELZA" description="Super speed (2 of 2)" />
  <gamegenie code="ZAXLISAA" description="Take less damage from bullets (1 of 2)" />
  <gamegenie code="ZAEKAKAA" description="Take less damage from bullets (2 of 2)" />
</game>
<game code="CLV-H-EIUMP" name="Wrecking Crew" crc="9B506A48">
  <gamegenie code="ATNKYZAZ" description="Invincibility" />
  <gamegenie code="VVUXGPSA" description="Start with Golden Hammer" />
  <gamegenie code="SZXILXSO" description="Annoying guy doesn't bother you (1 of 2)" />
  <gamegenie code="SXKILOSO" description="Annoying guy doesn't bother you (2 of 2)" />
  <gamegenie code="SXGXGL" description="Infinite lives - P1" />
  <gamegenie code="SXIXZL" description="Infinite lives - P2" />
  <gamegenie code="PELXYP" description="Start with 1 life - both players" />
  <gamegenie code="PELXYO" description="Start with 10 lives - both players" />
  <gamegenie code="YELXYO" description="Start with 15 lives - both players" />
  <gamegenie code="ENLXYO" description="Start with 250 lives" />
</game>
<game code="CLV-H-QATOY" name="WURM: Journey to the Center of the Earth" crc="EB803610">
  <gamegenie code="SZSGYNSE" description="Infinite fuel" />
  <gamegenie code="SXNGZTSA" description="Infinite shields and life" />
  <gamegenie code="ZEXITGPA" description="Start on Act 2 - Dyna Crystal" />
  <gamegenie code="LEXITGPA" description="Start on Act 3 - Magma Falls" />
  <gamegenie code="GEXITGPA" description="Start on Act 4 - Ziggy" />
  <gamegenie code="IEXITGPA" description="Start on Act 5 - Dual Duel" />
</game>
<game code="CLV-H-LTYFW" name="WWF King of the Ring" crc="7B4ED0BB">
  <gamegenie code="VZUUIVOO" description="Infinite health - both players" />
</game>
<game code="CLV-H-VVMPX" name="WWF WrestleMania" crc="37138039">
  <gamegenie code="ENOGVIEP" description="One hit drains all health" />
  <gamegenie code="SXZTSO" description="Opponent is idle after a body slam" />
  <gamegenie code="LAKTLLPA" description="Countdown starts on 3" />
  <gamegenie code="PAXGXPLA" description="1 minute tournament rounds" />
  <gamegenie code="TAXGXPLA" description="6 minute tournament rounds" />
  <gamegenie code="PAXGXPLE" description="9 minute tournament rounds" />
  <gamegenie code="OZXGNYEU" description="Infinite health - P1 (1 of 3)" />
  <gamegenie code="XGXKEYZE" description="Infinite health - P1 (2 of 3)" />
  <gamegenie code="SAXKOYVT" description="Infinite health - P1 (3 of 3)" />
</game>
<game code="CLV-H-JTQGS" name="WWF WrestleMania: Steel Cage Challenge" crc="D4611B79">
  <gamegenie code="VXSASUVK" description="P1 cannot lose (constant 1 count)" />
  <gamegenie code="PAXGXPLA" description="1 minute tournament rounds" />
  <gamegenie code="TAXGXPLA" description="6 minute tournament rounds" />
  <gamegenie code="PAXGXPLE" description="9 minute tournament rounds" />
  <gamegenie code="SUXIXNSO" description="Infinite energy refills (press select when energy is low)" />
</game>
<game code="CLV-H-FTXMO" name="WWF WrestleMania Challenge" crc="A0230D75">
  <gamegenie code="ZEELLGGE" description="Pin count extended to 9 seconds" />
  <gamegenie code="TESGYOLA" description="10-count reduced to 5 seconds" />
  <gamegenie code="IVNKGOGL" description="All counts slower" />
  <gamegenie code="YONKGOGU" description="All counts faster" />
</game>
<game code="CLV-H-QDXDP" name="Xenophobe" crc="711896B8">
  <gamegenie code="AAKIYNUT" description="Infinite health - both players" />
  <gamegenie code="LASIZOPA" description="Increase starting health - both players" />
  <gamegenie code="AIVIIOGI" description="More health - P1 (1 of 2)" />
  <gamegenie code="LAVILONY" description="More health - P1 (2 of 2)" />
  <gamegenie code="SXNITVOO" description="No health pick-ups allowed" />
  <gamegenie code="TAKSAPYA" description="Start on level 2" />
  <gamegenie code="IAKSAPYA" description="Start on level 3" />
  <gamegenie code="GAKSAPYA" description="Start on level 4" />
  <gamegenie code="LAKSAPYA" description="Start on level 5" />
</game>
<game code="CLV-H-TPRYT" name="Xevious: The Avenger" crc="DFD70E27">
  <gamegenie code="SEKYKISZ" description="Invincibility" />
  <gamegenie code="SZLNZY" description="Infinite lives" />
  <gamegenie code="PAZYOG" description="Start with 1 life" />
  <gamegenie code="TAZYOG" description="Start with 6 lives" />
  <gamegenie code="PAZYOK" description="Start with 9 lives" />
</game>
<game code="CLV-H-QTLAE" name="Xexyz" crc="B1612FE6">
  <gamegenie code="OTNGGYSV" description="Immune to enemy bullets" />
  <gamegenie code="OTNGGTSV" description="Immune to monsters" />
  <gamegenie code="PAUZTZLA" description="Start with 1 life" />
  <gamegenie code="TAUZTZLA" description="Start with 6 lives" />
  <gamegenie code="PAUZTZLE" description="Start with 9 lives" />
  <gamegenie code="SZEXTKVK" description="Infinite lives" />
  <gamegenie code="PAUXLILA" description="1 life after continue" />
  <gamegenie code="VTOXAKSE" description="Become a whirlwind on new life" />
  <gamegenie code="AAOLPNAA" description="Start with and keep foot-wing" />
</game>
<game code="CLV-H-KXKMT" name="Yo! Noid" crc="50D141FC">
  <gamegenie code="AVZUSZ" description="Invincibility" />
  <gamegenie code="SZULPTAX" description="Invincibility (alt)" />
  <gamegenie code="SXXLIGVG" description="Infinite time" />
  <gamegenie code="IAKUVGPA" description="More magic from small scrolls" />
  <gamegenie code="AEUGSKTZ" description="Multi-mega-jumps" />
  <gamegenie code="PAXSNZLA" description="1 continue" />
  <gamegenie code="TAXSNZLA" description="6 continues" />
  <gamegenie code="ZEVSKPPA" description="Start on stage 2" />
  <gamegenie code="GEVSKPPA" description="Start on stage 4" />
  <gamegenie code="TEVSKPPA" description="Start on stage 6" />
  <gamegenie code="AEVSKPPE" description="Start on stage 8" />
  <gamegenie code="ZEVSKPPE" description="Start on stage 10" />
  <gamegenie code="GEVSKPPE" description="Start on stage 12" />
  <gamegenie code="AUUIVPZL" description="Start with 1 life (1 of 2)" />
  <gamegenie code="AKUSOPZG" description="Start with 1 life (2 of 2)" />
  <gamegenie code="IUUIVPZL" description="Start with 6 lives (1 of 2)" />
  <gamegenie code="IKUSOPZG" description="Start with 6 lives (2 of 2)" />
  <gamegenie code="PUUIVPZU" description="Start with 9 lives (1 of 2)" />
  <gamegenie code="PKUSOPZK" description="Start with 9 lives (2 of 2)" />
  <gamegenie code="SXKTTUVK" description="Infinite lives (1 of 2)" />
  <gamegenie code="SXKVPUVK" description="Infinite lives (2 of 2)" />
</game>
<game code="CLV-H-HBQZS" name="Yoshi" crc="E7EAD93B">
  <gamegenie code="GOUYPEAZ" description="Short wait for next characters" />
  <gamegenie code="ZEUYPEAZ" description="Really short wait for next characters" />
  <gamegenie code="NNUYPEAX" description="Really long wait for next characters" />
  <gamegenie code="AVSULYZA" description="Freeze characters for a short time (press Down)" />
  <gamegenie code="PAVAAPLA" description="Need only 1 Victory Egg to win (1 of 3)" />
  <gamegenie code="PESTAZLA" description="Need only 1 Victory Egg to win (2 of 3)" />
  <gamegenie code="PEXTZLLA" description="Need only 1 Victory Egg to win (3 of 3)" />
  <gamegenie code="ZAVAAPLA" description="Need only 2 Victory Eggs to win (1 of 3)" />
  <gamegenie code="ZESTAZLA" description="Need only 2 Victory Eggs to win (2 of 3)" />
  <gamegenie code="ZEXTZLLA" description="Need only 2 Victory Eggs to win (3 of 3)" />
</game>
<game code="CLV-H-ETXZC" name="Young Indiana Jones Chronicles, The" crc="35C6F574">
  <gamegenie code="XVSEGPSE" description="Infinite health" />
  <gamegenie code="PEKSVGLA" description="Start with 2 lives" />
  <gamegenie code="TEKSVGLA" description="Start with 7 lives" />
  <gamegenie code="PEKSVGLE" description="Start with 10 lives" />
  <gamegenie code="SZEOUGVG" description="Infinite lives" />
</game>
<game code="CLV-H-AGUTL" name="Zanac" crc="E292AA10">
  <gamegenie code="ALSEGZEU" description="Invincibility + Hit anywhere (1 of 3)" />
  <gamegenie code="ATSEIZPL" description="Invincibility + Hit anywhere (2 of 3)" />
  <gamegenie code="SZOELXOO" description="Invincibility + Hit anywhere (3 of 3)" />
  <gamegenie code="PEEKOLLA" description="Start with 1 life" />
  <gamegenie code="TEEKOLLA" description="Start with 6 lives" />
  <gamegenie code="PEEKOLLE" description="Start with 9 lives" />
  <gamegenie code="OXEENYVK" description="Infinite lives" />
  <gamegenie code="PEOPAGAA" description="Start with Straight Crusher" />
  <gamegenie code="ZEOPAGAA" description="Start with Field Shutter" />
  <gamegenie code="LEOPAGAA" description="Start with the Circular" />
  <gamegenie code="GEOPAGAA" description="Start with the Vibrator" />
  <gamegenie code="IEOPAGAA" description="Start with the Rewinder" />
  <gamegenie code="TEOPAGAA" description="Start with the Plasma Flash" />
  <gamegenie code="YEOPAGAA" description="Start with rapid fire" />
</game>
<game code="CLV-H-FJSHD" name="Zen: Intergalactic Ninja" crc="D8578BFD">
  <gamegenie code="AAKEOAPP" description="Invincibility (blinking)" />
  <gamegenie code="AEELPXYZ" description="Hit anywhere (1 of 3)" />
  <gamegenie code="AEOLYXPP" description="Hit anywhere (2 of 3)" />
  <gamegenie code="OXXUGZEU" description="Hit anywhere (3 of 3)" />
  <gamegenie code="AEKLYGZA" description="One hit kills" />
  <gamegenie code="ZAELNGIE" description="9 lives allowed in options menu" />
  <gamegenie code="GZNLYUSE" description="Infinite health" />
  <gamegenie code="NYNXVTOE" description="Slower timer" />
  <gamegenie code="YTNXVTOE" description="Faster timer" />
  <gamegenie code="YINXVTOE" description="Even faster timer" />
  <gamegenie code="AEUAOLGE" description="Zen does increased damage - isometric stages" />
  <gamegenie code="GOUAOLGA" description="Zen does mega damage - isometric stages" />
  <gamegenie code="AAKXUIGE" description="Jab attack does more damage - horizontal stages" />
  <gamegenie code="GPKXUIGA" description="Mega jab attack damage - horizontal stages" />
  <gamegenie code="SZSPGTVG" description="Infinite lives (1 of 2)" />
  <gamegenie code="SZOZYTVG" description="Infinite lives (2 of 2)" />
  <gamegenie code="PAEUGGLA" description="Fewer hits in shield (1 of 2)" />
  <gamegenie code="PAXUNTLA" description="Fewer hits in shield (2 of 2)" />
  <gamegenie code="TAEUGGLA" description="Double hits in shield (1 of 2)" />
  <gamegenie code="TAXUNTLA" description="Double hits in shield (2 of 2)" />
  <gamegenie code="PAEUGGLE" description="Triple hits in shield (1 of 2)" />
  <gamegenie code="PAXUNTLE" description="Triple hits in shield (2 of 2)" />
</game>
<game code="CLV-H-SVDKL" name="Zombie Nation" crc="03FB57B6">
  <gamegenie code="AVXTEISZ" description="Infinite health" />
</game>
</database>`;
}
