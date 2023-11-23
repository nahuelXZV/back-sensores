// import { SerialPort } from 'serialport'
import { Data, DataModel } from '../model/data.model';
import { Socket } from 'socket.io';
import { NotificationsService } from './firebase.service';
import { Sensor, SensorModel } from '../model/sensor.model';

// const port = new SerialPort({
//     path: '/dev/COM6',
//     baudRate: 57600,
// });

// port.on('open', () => {
//     console.log('Puerto Abierto');
// });

// port.on('data', (data: Buffer) => {
//     console.log(data.toString());
// });

export async function handlerData(data: Buffer, socket: Socket) {
    const sensorModel = new SensorModel(undefined);
    const dataAtr: Data = {
        fecha: new Date("YYYY-MM-DD").toString(),
        hora: new Date("HH:MM:SS").toString(),
        valor: data.toString(),
        sensor_id: 1,
    };
    const dataModel = new DataModel(dataAtr);
    dataModel.store();

    // SOCKETS
    socket.emit("new-data", dataAtr);

    // NOTIFICACION
    const valor = parseInt(dataAtr.valor);
    if (valor < 300) return;

    const sensor: Sensor | undefined = await sensorModel.getOne(1);
    const listTokens = [
        "d0Z",
    ];
    const mapa = 'https://www.google.com/maps/search/?api=1&query=' + sensor?.longitud + ',' + sensor?.latitud;

    listTokens.forEach(token => {
        new NotificationsService().sendNotification({
            token,
            mapa,
            data: dataAtr,
        });
    });
}

