declare module ChiChiNES {
    export interface AudioSettings {
        sampleRate: number;
        master_volume: number;

        enableSquare0: boolean;
        enableSquare1: boolean;
        enableTriangle: boolean;
        enableNoise: boolean;
        enablePCM: boolean;
    }
}