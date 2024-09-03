/*
 *  Freya Legacy Hardware
 *
 *  by Sanne 'SpuQ' Santens
 */

const Qdevice = require('qdevice');
const dbus = require('dbus-native');

/* System DBus client */
const systemBus = dbus.systemBus();

// Listen for signals from Freya Core
systemBus.getService('io.freya.Core').getInterface( '/io/freya/Core', 
                                                    'io.freya.Core',
                                                    (err:any, iface:any)=>{
                                                        if(err) return console.log(err);
                                                        iface.on('updateActuator', setActuator );
                                                    }
);


/* Q-com based hardware devices */
const powerSwitch = new Qdevice("FreyaPowerswitch_1");		// Freya's Powerswitch Module, on address 1
const sensor = new Qdevice("FreyaSensor_1");		        // Freya's Sensor Module, on address 1

// When data is received from the physical sensor,
// update the data to the Freya Core
sensor.on('data', function( data:any ){
	if( data.signal == "humidity" ){

	}
	else if( data.signal == "lighting" ){

	}
	else if (data.signal == "temperature" ){

	}
});

// When actuator data is received from the
// Freya Core, update the physical actuators
function setActuator( data:string ){
        console.log(data)
        try{
            // Parse the data to JSON
            const actuatorData = JSON.parse(data);

            switch(actuatorData.actuator){
                case 'lights':  powerSwitch.send('CH1', actuatorData.value);
                                break;
                case 'rain':    powerSwitch.send('CH2', actuatorData.value);
                                break;
                case 'heater':  powerSwitch.send('CH3', actuatorData.value);
                                break;
                default: break;
            }
        }
        catch( err ){
            console.error("Unable to parse actuator data!");
        }
}