use log::{debug, info};
use tauri_api::dialog;

use crate::{
    device::{ConnectedDevice, ConnectedDeviceType},
    error::{Error, Result},
    github::Asset,
    state::InstallState,
};

#[tauri::command]
pub fn local_binary(
    device: ConnectedDevice,
    state: tauri::State<InstallState>,
    handle: tauri::AppHandle,
) -> Result<()> {
    // select the file type filter based on the device type
    let file_type = match &device.device_type {
        Some(device_type) => match device_type {
            ConnectedDeviceType::Bridge6 | ConnectedDeviceType::Bridge4 => Some("bin"),
            ConnectedDeviceType::Click | ConnectedDeviceType::ULoop => Some("uf2"),
            _ => None,
        },
        None => None,
    };

    // get the local file path
    let local_file_path = match dialog::select(file_type, Some("")) {
        Ok(response) => match response {
            dialog::Response::Okay(selected_path) => Some(selected_path),
            dialog::Response::OkayMultiple(_) | dialog::Response::Cancel => {
                debug!("local file selection cancelled");
                None
            }
        },
        Err(e) => {
            info!("local file selection cancelled: {:?}", e);
            None
        }
    };

    match local_file_path {
        Some(file_path) => {
            state
                .bootloader_transition(device, file_path.into(), &handle)
                .unwrap();

            Ok(())
        }
        None => Err(Error::IO("Unable to find local file".to_string())),
    }
}

#[tauri::command]
pub fn remote_binary(
    device: ConnectedDevice,
    asset: Asset,
    state: tauri::State<InstallState>,
    handle: tauri::AppHandle,
) -> Result<()> {
    Ok(())
}
