export interface IChannel {
    playing: boolean;
    output: number;
    onWriteAudio(time: number): void;
}