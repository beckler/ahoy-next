import { invoke } from "@tauri-apps/api/tauri";
import Image from "next/image";
import FadeIn from "react-fade-in";
import DeviceLogo from "../../components/DeviceLogo";
import { useRouter } from "next/router";
import {
  DocumentIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import updaterIcon from "../../assets/icon-updater.png";

import type { ConnectedDevice } from "../../../src-tauri/bindings/ConnectedDevice";
import IncompatableModal from "../../components/IncompatableModal";
import { useState } from "react";

function AvailableDevices({ devices }: { devices: ConnectedDevice[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [errorDevice, setErrorDevice] = useState(undefined);

  const onLocalInstall = async (device: ConnectedDevice) => {
    await invoke("local_binary", { device }).catch((e) => {
      if (!e.IO) {
        console.log(e);
        setErrorDevice(device);
        setIsOpen(true);
      }
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    setErrorDevice(undefined);
  };

  return (
    <FadeIn className="overflow-hidden">
      <div className="flex items-center py-4 mx-4 mb-2 border-b">
        <Image
          width={75}
          height={75}
          src={updaterIcon}
          alt="Pirate MIDI Updater Logo"
        />
        <div className="mx-4">
          <p className="text-lg font-bold">
            {devices.length} Devices Connected:
          </p>
          <p className="text-xs">
            You can connect multiple devices at the same time.
          </p>
        </div>
      </div>

      <ul className="w-full h-full p-0 px-4 py-2 overflow-y-auto">
        {devices.map((device) => (
          <li className="w-full" key={device.id}>
            <div className="device-button">
              <span className="mx-2 mt-1">
                <Image
                  width={100}
                  height={50}
                  src={DeviceLogo(device)}
                  alt={device.device_type + " Logo"}
                />
              </span>
              <div className="flex flex-col flex-grow pl-8 mx-2 space-y-1 text-xs text-left border-l">
                <span className="text-lg font-bold">
                  {device.device_details
                    ? device.device_details.deviceName
                    : "N/A"}
                </span>
                <div className="flex flex-col">
                  <span>
                    <strong className="text-sm">
                      {device.device_details
                        ? device.device_details.firmwareVersion
                        : "N/A"}
                    </strong>{" "}
                    Current Firmware Version
                  </span>
                  <span>
                    <strong className="text-sm">
                      {device.device_details
                        ? device.device_details.hardwareVersion
                        : "N/A"}
                    </strong>{" "}
                    Hardware Revision
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm">Select an installation method:</p>
                <div className="flex flex-row items-center">
                  <button
                    onClick={() => onLocalInstall(device)}
                    className={
                      "flex items-center px-4 py-2 m-2 text-sm border rounded border-pm-blue-left text-pm-blue-left dark:text-pm-blue-right dark:border-pm-blue-right hover:bg-pm-blue-right hover:border-pm-blue-right hover:text-slate-800"
                    }
                  >
                    <DocumentIcon className="icon-left" />
                    Local File
                    <ArrowUpIcon className="icon-right" />
                  </button>
                  <span hidden={!device.releases}>OR</span>
                  <button
                    onClick={() => {
                      router.push(
                        {
                          pathname: "/releases",
                          query: { serial_number: device.serial_number },
                        },
                        "/releases",
                      );
                    }}
                    className={
                      device.releases
                        ? "flex items-center px-4 py-2 m-2 text-sm border rounded bg-emerald-300 border-emerald-400 text-slate-800 hover:bg-emerald-400"
                        : "hidden"
                    }
                  >
                    <CheckBadgeIcon className="icon-left" />
                    Latest Release
                    <ArrowRightIcon className="icon-right" />
                  </button>
                  <span
                    className={
                      device.releases
                        ? "hidden"
                        : "flex items-center px-4 py-2 m-2 text-xs rounded bg-gradient-to-r from-pm-red-left to-pm-red-right text-white font-bold"
                    }
                  >
                    <ExclamationTriangleIcon className="icon-left" />
                    Unable to fetch releases
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <IncompatableModal
        show={isOpen}
        onClose={closeModal}
        onAccept={closeModal}
        device={errorDevice}
      />
    </FadeIn>
  );
}

export default AvailableDevices;
