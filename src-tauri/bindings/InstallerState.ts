// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ConnectedDevice } from "./ConnectedDevice";

export type InstallerState = { type: "Init" } | { type: "Bootloader", device: ConnectedDevice, binary: string, };