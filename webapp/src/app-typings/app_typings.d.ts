interface FileReaderEventTarget extends EventTarget {
    result: string,
    files: File[]
}

interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getMessage(): string;
}