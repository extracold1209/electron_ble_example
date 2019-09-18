// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var device;
var gatt;
var services;
var characteristic;
/**
 * this function discover WeDo 2.0 Device with BLE and set global variables to Web Bluetooth Objects
 */
async function onButtonClick() {
    try {
        if (!navigator.bluetooth) {
            console.error('You Can\'t use Web Bluetooth API');
            return;
        }

        console.log('Requesting Bluetooth Devices...');
        // WeDo 2.0 Service UUID
        device = await navigator.bluetooth.requestDevice({
            filters: [
                { services: ['00001523-1212-efde-1523-785feabcd123'] }
            ],
            optionalServices: [
                '00001565-1212-efde-1523-785feabcd123'
            ]
        });

        console.log('Try to Connect Devices..');
        gatt = await device.gatt.connect();

        console.log('Get BLE PrimaryServices..');
        services = await gatt.getPrimaryServices();

        console.log('Get Specific Characteristic from first index Services..');
        characteristic = await services[0].getCharacteristic('0000152b-1212-efde-1523-785feabcd123'); // WeDo Device Turn off Characteristic
        
        console.log('set Characteristic done! you can check objects that names device, gatt, services, characteristic');
    } catch (e) {
        console.error(e);
        device && device.gatt && device.gatt.disconnect();
    }
}

async function onCharacteristicActivationClick() {
    try {
        if (characteristic) {
            const payload = new Uint16Array([37]);
            await characteristic.writeValue(payload);
        }
    } catch (e) {
        console.error(e);
        device && device.gatt && device.gatt.disconnect();
    }
}