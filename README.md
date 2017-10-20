# ChiChiNes
 Continuation of abandoned FishbulbNES project - new focus on javascript

Overall plan
Stage 1 - Use Bridge.NET to create a version of nes emulator that runs in javascript, and typescript bindings for the various OO elements
 ^ complete
Stage 2 - Rewrite emulator (ChiChi) in typescript using generated bindings as template, remove all dependencies on Bridge.net
 ^ in progress
 Stage 3 - Create mockup of emulator (Wishbone), based on typescript bindings.  

  Wishbone will share cart/ram/etc data with ChiChi using SharedArrayBuffers, and regular messaging.
  
  The idea is for ChiChi to be able to run unencumbered on a background thread, while Wishbone provides rich class-based wrappers for the angular front-end to bind to.
  
  The plan is to be able to create super zippy debugging/visualization tools with minimal code, by binding to rich class-based interfaces which are automatically bound to an optimized emulator, and with minimal impact on the emulator.
  
  Stage 4 - ? - rewrite ChiChi to target webassembler
  
